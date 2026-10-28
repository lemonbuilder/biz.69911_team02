// LLM으로 숫자 지표 + 전사본을 해석한다. 숫자는 만들지 않고, 받은 숫자만 근거로 쓴다.
export const NO_ENGINE = "AI 분석 설정이 없습니다. .env에 FreeLLMAPI 주소(OPENAI_BASE_URL)나 GEMINI_API_KEY(무료)를 넣고 다시 분석하세요.";

function buildPrompt(session, segments, metrics) {
  const transcript = segments.map(s => `${s.speaker}: ${s.text}`).join("\n");
  const reflections = Object.entries(session.reflections)
    .map(([p, r]) => `- ${p}: 만족도 ${r.rating}/5, 회고: ${r.text}`).join("\n") || "(아직 없음)";
  return `당신은 3인 오프라인 대화 모임 "진짜 대화"가 끝난 뒤, 참여자들의 회고를 돕는 조력자입니다.

원칙:
- 사람을 평가하거나 순위를 매기지 않습니다. 따뜻하지만 구체적으로 씁니다.
- 반드시 전사본의 실제 내용에 근거합니다. 일반론("서로 질문하세요" 같은 말)은 쓰지 않습니다.
- "그러니까", "이런" 같은 말버릇은 주제가 아닙니다. 사람들이 실제로 다룬 화제와 그 안의 질문·감정·갈림길을 봅니다.
- 숫자는 아래 지표에 있는 것만 씁니다. 새로 만들지 않습니다.
- 각 주장에는 전사본에서 짧은 인용(20자 이내)을 근거로 붙입니다.

참여자: ${session.participants.join(", ")}
지표(${metrics.basis} 기준). share=발화 비중%, turns=발화 수, avgLen=평균 발화 길이(글자), questions=질문 수, followUps=앞사람 말을 받아서 한 질문 수, longestRun=혼자 이어 말한 가장 긴 구간(글자), balance=세 사람 균형(100이 완전 균등):
${JSON.stringify(metrics)}

참여자 회고:
${reflections}

전사본:
${transcript}

아래 JSON 하나만 출력하세요.
{
  "session": "세션 전체 평가 4~5문장. 어떤 화제가 어떻게 흘러갔는지, 대화가 깊어진 지점과 얕게 지나간 지점, 균형.",
  "highlights": [{"moment": "대화가 깊어졌던 순간 한 문장", "quote": "근거 인용"}],
  "nextTopics": [{"topic": "다음 모임에서 이어 갈 구체적 주제", "why": "이번 대화의 어디서 나왔고 왜 더 이야기할 만한지", "opener": "그 주제를 여는 첫 질문 한 문장"}],
  "todo": [{"who": "모두 또는 참여자 이름", "what": "다음 모임 전까지 해 볼 구체적인 일", "why": "이번 대화와의 연결"}],
  "individual": {
    "<참여자 이름>": {
      "role": "이 대화에서 맡은 역할 (짧은 명사구)",
      "engagement": "집중·몰입에 대한 3문장. 지표 숫자와 인용을 근거로.",
      "strength": "이번 대화에서 잘한 점 하나와 근거 인용",
      "tryNext": "다음 대화에서 해 볼 만한 것 하나"
    }
  }
}
highlights는 2개, nextTopics는 3개, todo는 2~3개로 씁니다.`;
}

// 엔진 선택: ANALYZER로 지정하거나, FreeLLMAPI(OpenAI 호환) → Gemini → Ollama 순으로 설정된 것을 고른다.
export function pickEngine() {
  if (process.env.ANALYZER) return process.env.ANALYZER;
  if (process.env.OPENAI_BASE_URL) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OLLAMA_MODEL) return "ollama";
  return null;
}

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY가 .env에 없습니다.");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } }),
  });
  if (!res.ok) throw new Error(`Gemini 오류 ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ?? "";
}

// OpenAI 호환 주소: 직접 띄운 FreeLLMAPI(http://localhost:3001/v1), OpenRouter, Groq 등
async function callOpenAICompatible(prompt) {
  if (!process.env.OPENAI_BASE_URL) throw new Error("OPENAI_BASE_URL이 .env에 없습니다.");
  const base = process.env.OPENAI_BASE_URL.replace(/\/$/, "");
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || "auto:smart", messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw new Error(`OpenAI 호환 API 오류 ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()).choices?.[0]?.message?.content ?? "";
}

async function callOllama(prompt) {
  const url = (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, "");
  const res = await fetch(`${url}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.OLLAMA_MODEL || "qwen2.5:7b", stream: false, format: "json", messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw new Error(`Ollama 오류 ${res.status}: ${await res.text()}`);
  return (await res.json()).message.content;
}

const CALLS = { openai: callOpenAICompatible, gemini: callGemini, ollama: callOllama };

export async function analyze(session, segments, metrics, { retries = 2 } = {}) {
  const engine = pickEngine();
  if (!engine) throw new Error(NO_ENGINE);
  const call = CALLS[engine];
  if (!call) throw new Error(`알 수 없는 분석 엔진: ${engine}`);
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const text = await call(buildPrompt(session, segments, metrics));
      const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
      for (const p of session.participants) if (!json.individual?.[p]) throw new Error(`${p}의 개인 결과가 없습니다.`);
      return { ...json, engine };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
