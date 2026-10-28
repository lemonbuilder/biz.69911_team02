import { test, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.ANTHROPIC_API_KEY = "";   // 키 없는 경로를 시험한다 (.env가 있어도 덮어쓰지 않게 빈 값)
const { app } = await import("../server.js");
const { validateQuestion } = await import("../lib/question.js");
const { ICEBREAKERS, FALLBACK, STAGES } = await import("../public/questions.js");

let server, base;
before(() => new Promise(r => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; r(); }); }));
after(() => server.close());

const post = body => fetch(`${base}/api/question`, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});

test("키가 없으면 서버가 바로 fallback을 돌려준다", async () => {
  const res = await post({ stage: "mid", transcript: "요즘 주말마다 등산을 다니는데 정상에서 먹는 컵라면이 최고예요." });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { source: "fallback", reason: "no-key" });
});

test("단계나 transcript가 잘못되면 400", async () => {
  assert.equal((await post({ stage: "very-deep", transcript: "x" })).status, 400);
  assert.equal((await post({ stage: "light" })).status, 400);
});

test("AI 답 검사: 한 문장, 60자 이하, 물음표로 끝남", () => {
  assert.equal(validateQuestion("  \"요즘 가장 기다려지는 일은 무엇인가요?\" "), "요즘 가장 기다려지는 일은 무엇인가요?");
  assert.equal(validateQuestion("좋은 질문입니다. 요즘 어떠세요?"), null);   // 두 문장
  assert.equal(validateQuestion("요즘 어떠세요"), null);                     // 물음표 없음
  assert.equal(validateQuestion("가".repeat(60) + "?"), null);              // 61자
  assert.equal(validateQuestion("첫 줄?\n둘째 줄?"), null);
});

test("고정 질문 세트가 기준을 지킨다", () => {
  for (const s of STAGES) assert.ok(FALLBACK[s].length >= 10, `${s} 10개 이상`);
  assert.ok(ICEBREAKERS.length >= 10 && ICEBREAKERS.length <= 15);
  for (const q of [...ICEBREAKERS, ...STAGES.flatMap(s => FALLBACK[s])]) {
    assert.ok(validateQuestion(q), `문장 규칙: ${q}`);
  }
  for (const q of ICEBREAKERS) assert.doesNotMatch(q, /직업|회사|나이|몇 살|사는 곳|어디 사/, q);
  // 고정 질문은 단독으로 뜨므로 앞 맥락을 가리키지 않는다
  for (const q of [...ICEBREAKERS, ...STAGES.flatMap(s => FALLBACK[s])]) assert.doesNotMatch(q, /^그 |그 일|그때|그 선택/, q);
});
