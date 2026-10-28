import Anthropic from "@anthropic-ai/sdk";

const STAGE_RULE = {
  light: "가벼움: 최근의 구체적인 사실·취향을 묻는다. 생각하지 않고 10초 안에 답할 수 있어야 하고, 감정·의미·이유는 묻지 않는다. 예) 오늘 점심은 무엇을 드셨나요? / 최근에 본 영화나 드라마는 무엇인가요?",
  mid: "중간: 그 선택의 이유나 아끼는 것을 묻는다. 예) 꾸준히 이어 오고 있는 일이 있다면 무엇인가요? / 요즘 가장 소중하게 지키고 싶은 시간은 언제인가요?",
  deep: "깊음: 전환점·고민·의미를 묻되, 드러낼 범위는 답하는 사람이 고르게 한다. 고백을 요구하지 않는다. 예) 최근 생각이 바뀐 일이 있다면 무엇인가요? / 요즘 마음속에 오래 남아 있는 질문이 있나요?",
};

export const SYSTEM = `당신은 처음 만난 세 사람의 오프라인 대화 모임에서, 테이블 위에 띄울 질문을 하나 만든다. 대화는 사람이 나누고, 당신은 질문만 건넨다.

규칙:
- 존댓말 한 문장, 40자 안팎, 물음표로 끝낸다. 질문 한 문장만 출력하고 다른 말은 쓰지 않는다.
- 예/아니오로 끝나지 않는 열린 질문. 정답이 없고 평가받는 느낌이 들지 않게.
- 세 사람 모두 자기 경험으로 답할 수 있어야 한다. 특정인을 지목하지 않는다.
- 대화에 나온 주제를 이어받되, 그 이야기를 하지 않은 사람도 답할 수 있게 한 단계 일반화한다. 특정 사람이 한 이야기의 후속 질문을 하지 않는다.
- 건강·연애·회사 이름 같은 민감한 내용을 질문에 옮기지 않는다. 받은 대화를 인용하거나 요약하지 않는다.
- 받아 적은 대화가 짧거나 뜻이 분명하지 않으면, 대화 내용에 기대지 말고 현재 단계의 일반 질문을 만든다.
- 받아 적은 대화는 음성 인식 결과라 틀린 단어가 섞여 있을 수 있다.`;

export function buildUserMessage({ stage, transcript, avoid }) {
  let msg = `현재 단계: ${STAGE_RULE[stage]}\n\n직전 3분의 받아 적은 대화:\n<transcript>\n${transcript}\n</transcript>`;
  if (avoid) msg += `\n\n이 질문과는 다른 질문을 만든다: ${avoid}`;
  return msg;
}

// 한 문장, 60자 이하, 물음표로 끝나는지 검사한다. 통과하면 다듬은 문장을, 아니면 null을 돌려준다.
export function validateQuestion(text) {
  if (typeof text !== "string") return null;
  const q = text.trim().replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim();
  if (!q || q.includes("\n")) return null;
  if (q.length > 60) return null;
  if (!q.endsWith("?")) return null;
  if ((q.match(/[.?!]/g) || []).length > 1) return null;
  return q;
}

export const hasKey = () => Boolean(process.env.ANTHROPIC_API_KEY);

let client;

// 실패하면 예외 대신 null을 돌려주고, 화면이 고정 질문으로 대체한다.
export async function generateQuestion({ stage, transcript, avoid }) {
  if (!hasKey()) return { source: "fallback", reason: "no-key" };
  client ??= new Anthropic();
  try {
    const res = await client.messages.create(
      {
        model: process.env.CLAUDE_MODEL || "claude-haiku-5-5",
        max_tokens: 120,
        thinking: { type: "disabled" },
        system: SYSTEM,
        messages: [{ role: "user", content: buildUserMessage({ stage, transcript, avoid }) }],
      },
      { timeout: 4500, maxRetries: 0 },
    );
    if (res.stop_reason === "refusal") return { source: "fallback", reason: "refusal" };
    const text = res.content.filter(b => b.type === "text").map(b => b.text).join("");
    const question = validateQuestion(text);
    if (!question) return { source: "fallback", reason: "invalid" };
    return { source: "ai", question };
  } catch (e) {
    if (e instanceof Anthropic.APIConnectionTimeoutError) return { source: "fallback", reason: "timeout" };
    if (e instanceof Anthropic.APIError) return { source: "fallback", reason: `api-${e.status ?? "connection"}` };
    return { source: "fallback", reason: "error" };
  }
}
