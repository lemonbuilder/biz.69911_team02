// Claude로 숫자 지표 + 전사본을 해석한다. 숫자는 만들지 않고, 받은 숫자만 근거로 쓴다.
import Anthropic from "@anthropic-ai/sdk";
import { analyzeByRules } from "./rules.js";

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";

function buildPrompt(session, segments, metrics) {
  const transcript = segments.map(s => `${s.speaker}: ${s.text}`).join("\n");
  const reflections = Object.entries(session.reflections)
    .map(([p, r]) => `- ${p}: 만족도 ${r.rating}/5, 회고: ${r.text}`).join("\n") || "(아직 없음)";
  return `당신은 3인 오프라인 대화 모임 "진짜 대화"가 끝난 뒤, 참여자들의 회고를 돕는 조력자입니다.
사람을 평가하거나 순위를 매기지 말고, 따뜻하고 구체적으로 씁니다. 숫자는 아래 지표만 쓰고 새로 만들지 마세요.

참여자: ${session.participants.join(", ")}
지표(${metrics.basis} 기준): ${JSON.stringify(metrics)}
참여자 회고:
${reflections}

전사본:
${transcript}

아래 JSON 하나만 출력하세요. 다른 글은 쓰지 마세요.
{
  "session": "세션 전체에 대한 평가 3~4문장 (분위기, 대화 흐름, 균형)",
  "nextTopics": ["다음 모임에서 이야기하면 좋을 주제 3개"],
  "todo": ["다음 모임 전까지 해 보면 좋을 것 2~3개"],
  "individual": {
    "<참여자 이름>": { "role": "대화에서 맡은 역할 (짧은 명사구)", "engagement": "집중·몰입에 대한 2~3문장, 지표를 근거로" }
  }
}`;
}

// 엔진 선택: ANALYZER로 지정하거나, Claude 키 → Ollama 설정 → 규칙 기반 순으로 고른다.
export function pickEngine() {
  if (process.env.ANALYZER) return process.env.ANALYZER;
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  if (process.env.OLLAMA_MODEL) return "ollama";
  return "rules";
}

async function callClaude(prompt) {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY가 .env에 없습니다.");
  const msg = await new Anthropic().messages.create({ model: MODEL, max_tokens: 2000, messages: [{ role: "user", content: prompt }] });
  return msg.content.filter(b => b.type === "text").map(b => b.text).join("");
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

export async function analyze(session, segments, metrics, { retries = 2 } = {}) {
  const engine = pickEngine();
  if (engine === "rules") return analyzeByRules(session, segments, metrics);
  const call = engine === "ollama" ? callOllama : callClaude;
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
