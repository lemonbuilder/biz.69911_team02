import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "recap-"));
delete process.env.OPENAI_BASE_URL; delete process.env.GEMINI_API_KEY; delete process.env.OLLAMA_MODEL;
process.env.ANALYZER = "openai"; // 주소 없이 FreeLLMAPI를 강제해 실패 경로를 확인한다
const { default: app, jobs } = await import("../server.js");
const { computeMetrics, parseTranscriptText } = await import("../lib/metrics.js");

let server, base;
before(() => new Promise(r => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; r(); }); }));
after(() => server.close());
const call = async (m, url, body) => {
  const res = await fetch(base + url, { method: m, headers: { "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
};
const settle = async id => { await jobs.get(id); return (await call("GET", `/api/sessions/${id}`)).body; };
const newSession = async () => (await call("POST", "/api/sessions", { title: "t", participants: P })).body.session.id;
const P = ["가람", "나래", "다온"];
const transcript = "가람: 요즘 어떻게 지냈어?\n나래: 회사 일이 많아서 정신없었어. 너는?\n다온: 나는 이사 준비 중이야\n가람: 이사는 어디로 가?";

// FreeLLMAPI 흉내: 요청 내용에 따라 발화자 추정 또는 분석 결과를 돌려준다
const realFetch = globalThis.fetch;
function mockLLM(answer) {
  process.env.ANALYZER = "openai"; process.env.OPENAI_BASE_URL = "http://llm.test/v1";
  globalThis.fetch = async (url, opt) => {
    if (!String(url).startsWith("http://llm.test")) return realFetch(url, opt);
    const prompt = JSON.parse(opt.body).messages[0].content;
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(answer(prompt)) } }] }));
  };
}
function unmock() { globalThis.fetch = realFetch; process.env.ANALYZER = "openai"; delete process.env.OPENAI_BASE_URL; }
const fullAnalysis = { session: "s", highlights: [], nextTopics: [], todo: [], individual: Object.fromEntries(P.map(p => [p, { role: "r", engagement: "e" }])) };

test("숫자 지표: 균형 점수 범위", () => {
  const m = computeMetrics([{ speaker: "가람", text: "aaaa" }, { speaker: "나래", text: "aaaa" }, { speaker: "다온", text: "aaaa" }], P);
  assert.equal(m.balance, 100);
  assert.equal(computeMetrics([{ speaker: "가람", text: "aaaa" }], P).balance, 0);
});

test("이어서 한 질문은 앞사람 단어를 받은 질문만 센다", () => {
  const m = computeMetrics([
    { speaker: "나래", text: "요즘 이사 준비 중이야" },
    { speaker: "가람", text: "이사는 어디로 가?" },
    { speaker: "다온", text: "그러니까 너는 어때?" },
  ], P);
  assert.equal(m.perPerson["가람"].followUps, 1);
  assert.equal(m.perPerson["다온"].followUps, 0);
});

test("전사본 형식: 이름: 내용, 클로바노트 형식, 이름 아닌 라벨", () => {
  assert.deepEqual(parseTranscriptText("가람: 안녕\n이어지는 줄"), [{ label: "가람", text: "안녕 이어지는 줄" }]);
  assert.deepEqual(parseTranscriptText("참석자 1 00:12\n안녕하세요\n\n참석자 2 01:02:03\n반가워요"),
    [{ label: "참석자 1", text: "안녕하세요" }, { label: "참석자 2", text: "반가워요" }]);
  assert.deepEqual(parseTranscriptText("발화자 1: 네\n발화자 2: 그렇죠"), [{ label: "발화자 1", text: "네" }, { label: "발화자 2", text: "그렇죠" }]);
  assert.throws(() => parseTranscriptText("그냥 글"));
});

test("회고 전에는 결과가 안 보이고, 개인 결과는 본인 것만 온다", async () => {
  const id = await newSession();
  await call("POST", `/api/sessions/${id}/transcript`, { text: transcript });
  const s = await settle(id);
  assert.ok(s.analysisError);            // 주소 없음 → 해석 실패
  assert.equal(s.hasTranscript, true);   // 재시도를 위해 전사본 보관
  assert.equal((await call("GET", `/api/sessions/${id}/result?me=가람`)).status, 403);
  await call("POST", `/api/sessions/${id}/reflections`, { me: "가람", rating: 4, text: "좋았다" });
  const res = await call("GET", `/api/sessions/${id}/result?me=가람`);
  assert.equal(res.body.mode, "metricsOnly");
  const raw = JSON.stringify(res.body);
  assert.ok(!raw.includes("나래") && !raw.includes("다온"), "다른 사람 이름/결과가 섞이면 안 된다");
  assert.equal((await call("GET", `/api/sessions/${id}/result?me=모르는사람`)).status, 403);
});

test("키가 없으면 숫자 지표만, 주제는 지어내지 않는다", async () => {
  delete process.env.ANALYZER;
  try {
    const id = await newSession();
    await call("POST", `/api/sessions/${id}/transcript`, { text: transcript });
    await settle(id);
    await call("POST", `/api/sessions/${id}/reflections`, { me: "다온", rating: 4, text: "" });
    const res = await call("GET", `/api/sessions/${id}/result?me=다온`);
    assert.match(res.body.pending, /AI 분석이 필요/);
    assert.equal(res.body.nextTopics, undefined);
  } finally { process.env.ANALYZER = "openai"; }
});

test("이름 아닌 라벨 + LLM 없음: 오류 없이 손으로 연결하는 화면으로", async () => {
  delete process.env.ANALYZER;
  try {
    const id = await newSession();
    const r = await call("POST", `/api/sessions/${id}/transcript`, { text: "발화자 1: 안녕\n발화자 2: 반가워\n발화자 3: 나도" });
    assert.equal(r.status, 200);
    assert.deepEqual(Object.keys(r.body.speakers), ["발화자 1", "발화자 2", "발화자 3"]);
    assert.equal(r.body.guess, null);
  } finally { process.env.ANALYZER = "openai"; }
});

test("AI 발화자 추정: 라벨별 이름과 모호한 문장만 짚고, 확인하면 분석된다", async () => {
  mockLLM(prompt => prompt.includes("음성 인식이 화자를") ? {
    mapping: { "발화자 1": { name: "가람", confidence: "높음", reason: "r" }, "발화자 2": { name: "나래", confidence: "중간", reason: "r" }, "발화자 3": { name: "다온", confidence: "높음", reason: "r" } },
    doubtful: [{ index: 3, suggested: "다온", reason: "맥락상 다온" }, { index: 0, suggested: "가람", reason: "라벨과 같아서 빠져야 함" }],
  } : fullAnalysis);
  try {
    const id = await newSession();
    await call("POST", `/api/sessions/${id}/transcript`, { text: "발화자 1: 이사 어디로 가?\n발화자 2: 회사 근처\n발화자 3: 좋겠다\n발화자 2: 나는 이사가 힘들었어" });
    const s = await settle(id);
    assert.equal(s.guess.mapping["발화자 2"].name, "나래");
    assert.equal(s.guess.doubtful.length, 1);  // 라벨 추정과 같은 제안은 걸러진다
    assert.equal(s.guess.doubtful[0].text, "나는 이사가 힘들었어");

    await call("POST", `/api/sessions/${id}/speakers`, {
      map: { "발화자 1": "가람", "발화자 2": "나래", "발화자 3": "다온" }, overrides: { 3: "다온" },
    });
    const done = await settle(id);
    assert.equal(done.status, "analyzed");
    assert.equal(done.hasTranscript, false);
    await call("POST", `/api/sessions/${id}/reflections`, { me: "다온", rating: 5, text: "" });
    const res = await call("GET", `/api/sessions/${id}/result?me=다온`);
    assert.equal(res.body.me.turns, 2);  // 고친 문장이 다온에게 들어갔다
  } finally { unmock(); }
});

test("분석 중에 저장한 회고가 분석 결과에 덮어써지지 않는다", async () => {
  let release;
  const gate = new Promise(r => { release = r; });
  mockLLM(() => fullAnalysis);
  const mocked = globalThis.fetch;
  globalThis.fetch = async (u, o) => { if (String(u).startsWith("http://llm.test")) await gate; return mocked(u, o); };
  try {
    const id = await newSession();
    await call("POST", `/api/sessions/${id}/transcript`, { text: transcript });
    assert.equal((await call("GET", `/api/sessions/${id}`)).body.busy, "analyze");
    await call("POST", `/api/sessions/${id}/reflections`, { me: "나래", rating: 5, text: "기다리며 씀" });
    release();
    const s = await settle(id);
    assert.equal(s.status, "analyzed");
    assert.deepEqual(s.reflected, ["나래"]);
  } finally { unmock(); }
});

test("녹음 없이 진행하면 회고만으로 결과", async () => {
  const id = await newSession();
  await call("POST", `/api/sessions/${id}/no-recording`);
  await call("POST", `/api/sessions/${id}/reflections`, { me: "나래", rating: 5, text: "편했다" });
  const res = await call("GET", `/api/sessions/${id}/result?me=나래`);
  assert.equal(res.body.mode, "self");
});

test("업로드된 녹음 파일은 전사 실패 시에도 삭제된다", async () => {
  const id = await newSession();
  const fd = new FormData(); fd.append("audio", new Blob(["fake"]), "a.webm");
  const res = await fetch(`${base}/api/sessions/${id}/audio`, { method: "POST", body: fd });
  assert.equal(res.status, 502); // Clova 키 없음
  const dir = path.join(process.env.DATA_DIR, "uploads");
  assert.deepEqual(fs.existsSync(dir) ? fs.readdirSync(dir) : [], []);
});
