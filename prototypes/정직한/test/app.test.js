import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "recap-"));
delete process.env.OPENAI_BASE_URL; delete process.env.GEMINI_API_KEY; delete process.env.OLLAMA_MODEL;
process.env.ANALYZER = "openai"; // 주소 없이 FreeLLMAPI를 강제해 실패 경로를 확인한다
const { default: app } = await import("../server.js");
const { computeMetrics } = await import("../lib/metrics.js");

let server, base;
before(() => new Promise(r => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; r(); }); }));
after(() => server.close());
const call = async (m, url, body) => {
  const res = await fetch(base + url, { method: m, headers: { "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
};
const P = ["가람", "나래", "다온"];
const transcript = "가람: 요즘 어떻게 지냈어?\n나래: 회사 일이 많아서 정신없었어. 너는?\n다온: 나는 이사 준비 중이야\n가람: 이사는 어디로 가?";

test("숫자 지표: 발화 비중 합이 약 100, 균형 점수 범위", () => {
  const m = computeMetrics([{ speaker: "가람", text: "aaaa" }, { speaker: "나래", text: "aaaa" }, { speaker: "다온", text: "aaaa" }], P);
  assert.equal(m.balance, 100);
  const one = computeMetrics([{ speaker: "가람", text: "aaaa" }], P);
  assert.equal(one.balance, 0);
});

test("회고 전에는 결과가 안 보이고, 개인 결과는 본인 것만 온다", async () => {
  const { body: { session } } = await call("POST", "/api/sessions", { title: "t", participants: P });
  const r = await call("POST", `/api/sessions/${session.id}/transcript`, { text: transcript });
  assert.equal(r.status, 200);
  assert.ok(r.body.analysisError);            // API 키 없음 → 해석 실패
  assert.equal(r.body.hasTranscript, true);   // 재시도를 위해 전사본 보관

  assert.equal((await call("GET", `/api/sessions/${session.id}/result?me=가람`)).status, 403);
  await call("POST", `/api/sessions/${session.id}/reflections`, { me: "가람", rating: 4, text: "좋았다" });
  const res = await call("GET", `/api/sessions/${session.id}/result?me=가람`);
  assert.equal(res.status, 200);
  assert.equal(res.body.mode, "metricsOnly");
  assert.equal(res.body.pending, "해석은 준비 중입니다.");
  const raw = JSON.stringify(res.body);
  assert.ok(!raw.includes("나래") && !raw.includes("다온"), "다른 사람 이름/결과가 섞이면 안 된다");
  assert.equal((await call("GET", `/api/sessions/${session.id}/result?me=모르는사람`)).status, 403);
});

test("녹음 없이 진행하면 회고만으로 결과", async () => {
  const { body: { session } } = await call("POST", "/api/sessions", { title: "t", participants: P });
  await call("POST", `/api/sessions/${session.id}/no-recording`);
  await call("POST", `/api/sessions/${session.id}/reflections`, { me: "나래", rating: 5, text: "편했다" });
  const res = await call("GET", `/api/sessions/${session.id}/result?me=나래`);
  assert.equal(res.body.mode, "self");
  assert.equal(res.body.satisfaction.average, 5);
});

test("업로드된 녹음 파일은 전사 실패 시에도 삭제된다", async () => {
  const { body: { session } } = await call("POST", "/api/sessions", { title: "t", participants: P });
  const fd = new FormData(); fd.append("audio", new Blob(["fake"]), "a.webm");
  const res = await fetch(`${base}/api/sessions/${session.id}/audio`, { method: "POST", body: fd });
  assert.equal(res.status, 502); // Clova 키 없음
  const dir = path.join(process.env.DATA_DIR, "uploads");
  assert.deepEqual(fs.existsSync(dir) ? fs.readdirSync(dir) : [], []);
});

test("키가 없으면 숫자 지표만, 주제는 지어내지 않는다", async () => {
  delete process.env.ANALYZER;
  try {
    const { body: { session } } = await call("POST", "/api/sessions", { title: "t", participants: P });
    const r = await call("POST", `/api/sessions/${session.id}/transcript`, { text: transcript });
    assert.equal(r.body.hasTranscript, true); // 키를 넣고 다시 분석할 수 있게 보관
    await call("POST", `/api/sessions/${session.id}/reflections`, { me: "다온", rating: 4, text: "" });
    const res = await call("GET", `/api/sessions/${session.id}/result?me=다온`);
    assert.equal(res.body.mode, "metricsOnly");
    assert.match(res.body.pending, /AI 분석이 필요/);
    assert.equal(res.body.nextTopics, undefined);
  } finally { process.env.ANALYZER = "openai"; }
});

test("이어서 한 질문은 앞사람 단어를 받은 질문만 센다", () => {
  const m = computeMetrics([
    { speaker: "나래", text: "요즘 이사 준비 중이야" },
    { speaker: "가람", text: "이사는 어디로 가?" },
    { speaker: "다온", text: "그러니까 너는 어때?" },
  ], P);
  assert.equal(m.perPerson["가람"].followUps, 1);
  assert.equal(m.perPerson["다온"].questions, 1);
  assert.equal(m.perPerson["다온"].followUps, 0);
});
