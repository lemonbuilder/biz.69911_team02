import "dotenv/config";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import express from "express";
import multer from "multer";
import * as store from "./lib/store.js";
import { computeMetrics, parseTranscriptText } from "./lib/metrics.js";
import { transcribe } from "./lib/clova.js";
import { analyze, identifySpeakers, pickEngine, NO_ENGINE } from "./lib/analyze.js";

export const NOTICE = "이 세션은 녹음됩니다. 모임이 끝나면 녹음을 전사해 대화를 분석하고, 결과를 드린 뒤 녹음과 전사본은 삭제합니다. 모임 중에는 AI가 개입하지 않습니다.";

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static("public"));
const upload = multer({ dest: path.join(store.dataDir, "uploads") });

const need = (req, res) => {
  const s = store.get(req.params.id);
  if (!s) res.status(404).json({ error: "세션이 없습니다." });
  return s;
};

// 뒤에서 도는 작업. 끝나면 최신 상태에 결과만 반영한다. 테스트에서 기다릴 수 있게 promise를 남긴다.
export const jobs = new Map();
function background(id, kind, work) {
  store.update(id, s => { s.busy = kind; });
  const p = work().finally(() => { store.update(id, s => { s.busy = null; }); jobs.delete(id); });
  jobs.set(id, p);
}

// 이름이 붙은 전사본으로 지표를 계산하고 LLM으로 분석한다.
// 성공하면 전사본을 지운다. 실패하면 지표만 남기고 재시도를 위해 전사본을 보관한다.
function startAnalysis(id) {
  const s = store.update(id, s => { s.metrics = computeMetrics(s.segments, s.participants); s.analysisError = null; s.status = "transcribed"; });
  background(id, "analyze", async () => {
    try {
      const analysis = await analyze(s, s.segments, s.metrics);
      store.update(id, s => { s.analysis = analysis; s.segments = null; s.status = "analyzed"; });
    } catch (e) {
      store.update(id, s => { s.analysisError = e.message; });
    }
  });
}

// 화자 라벨이 붙은 전사본을 받는다. 라벨이 모두 참여자 이름이면 바로 분석,
// 아니면 AI가 누가 누구인지 추정한 뒤 참여자가 확인한다.
function acceptRaw(id, raw) {
  const s = store.update(id, s => { s.rawSegments = raw; s.segments = null; s.guess = null; s.guessError = null; });
  if (raw.every(r => s.participants.includes(r.label))) {
    store.update(id, s => { s.segments = raw.map(r => ({ speaker: r.label, text: r.text, start: r.start, end: r.end })); s.rawSegments = null; });
    return startAnalysis(id);
  }
  if (!pickEngine()) return; // LLM이 없으면 손으로 연결
  background(id, "identify", async () => {
    try {
      const guess = await identifySpeakers(s.participants, raw);
      store.update(id, s => { s.guess = guess; });
    } catch (e) {
      store.update(id, s => { s.guessError = e.message; });
    }
  });
}

app.get("/api/notice", (req, res) => res.json({ notice: NOTICE }));

app.post("/api/sessions", (req, res) => {
  const { title, participants } = req.body;
  const names = (participants || []).map(p => String(p).trim()).filter(Boolean);
  if (names.length !== 3 || new Set(names).size !== 3) return res.status(400).json({ error: "서로 다른 참여자 3명이 필요합니다." });
  res.json({ session: publicView(store.create(title || "진짜 대화", names)), notice: NOTICE });
});

app.get("/api/sessions", (req, res) => res.json(store.all().map(publicView)));
app.get("/api/sessions/:id", (req, res) => { const s = need(req, res); if (s) res.json(publicView(s)); });

// 녹음 업로드 → Clova 전사 → 녹음 파일 즉시 삭제
app.post("/api/sessions/:id/audio", upload.single("audio"), async (req, res) => {
  const s = need(req, res);
  if (!s) { req.file && fs.rmSync(req.file.path, { force: true }); return; }
  if (!req.file) return res.status(400).json({ error: "녹음 파일이 없습니다." });
  try {
    acceptRaw(s.id, await transcribe(req.file.path, 3));
    res.json(publicView(store.get(s.id)));
  } catch (e) {
    res.status(502).json({ error: e.message });
  } finally {
    fs.rmSync(req.file.path, { force: true });
  }
});

// 화자 라벨 → 참여자 이름 연결. overrides는 모호한 문장만 따로 고친 것 { 문장번호: 이름 }
app.post("/api/sessions/:id/speakers", (req, res) => {
  const s = need(req, res); if (!s) return;
  if (!s.rawSegments) return res.status(400).json({ error: "전사본이 없습니다." });
  const map = req.body.map || {};
  const overrides = req.body.overrides || {};
  for (const name of [...Object.values(map), ...Object.values(overrides)]) if (!s.participants.includes(name)) return res.status(400).json({ error: `${name}은 참여자가 아닙니다.` });
  const segments = s.rawSegments.map((r, i) => ({ speaker: overrides[i] || map[r.label], text: r.text, start: r.start, end: r.end })).filter(r => r.speaker);
  if (!segments.length) return res.status(400).json({ error: "화자를 한 명 이상 연결해 주세요." });
  store.update(s.id, s => { s.segments = segments; s.rawSegments = null; s.guess = null; });
  startAnalysis(s.id);
  res.json(publicView(store.get(s.id)));
});

// 텍스트 전사본 직접 입력 ("이름: 내용" 또는 클로바노트 형식)
app.post("/api/sessions/:id/transcript", (req, res) => {
  const s = need(req, res); if (!s) return;
  let raw;
  try { raw = parseTranscriptText(req.body.text || ""); }
  catch (e) { return res.status(400).json({ error: e.message }); }
  acceptRaw(s.id, raw);
  res.json(publicView(store.get(s.id)));
});

app.post("/api/sessions/:id/retry", (req, res) => {
  const s = need(req, res); if (!s) return;
  if (s.busy) return res.status(409).json({ error: "이미 처리 중입니다." });
  if (!s.segments) return res.status(400).json({ error: "다시 분석할 전사본이 없습니다." });
  startAnalysis(s.id);
  res.json(publicView(store.get(s.id)));
});

app.post("/api/sessions/:id/no-recording", (req, res) => {
  const s = need(req, res); if (!s) return;
  res.json(publicView(store.update(s.id, s => { s.status = "noRecording"; s.rawSegments = null; s.segments = null; s.guess = null; })));
});

app.post("/api/sessions/:id/reflections", (req, res) => {
  const s = need(req, res); if (!s) return;
  const { me, rating, text } = req.body;
  if (!s.participants.includes(me)) return res.status(403).json({ error: "이 세션의 참여자가 아닙니다." });
  const r = Number(rating);
  if (!(r >= 1 && r <= 5)) return res.status(400).json({ error: "만족도는 1~5입니다." });
  store.update(s.id, s => { s.reflections[me] = { rating: r, text: String(text || "").trim(), at: new Date().toISOString() }; });
  res.json({ ok: true });
});

// 결과: 본인 회고를 입력한 사람만, 본인의 개인 결과만 받는다.
app.get("/api/sessions/:id/result", (req, res) => {
  const s = need(req, res); if (!s) return;
  const me = req.query.me;
  if (!s.participants.includes(me)) return res.status(403).json({ error: "이 세션의 참여자가 아닙니다." });
  if (!s.reflections[me]) return res.status(403).json({ error: "먼저 이번 대화에 대한 회고를 입력해 주세요." });
  res.json(resultFor(s, me));
});

export function resultFor(s, me) {
  const ratings = Object.values(s.reflections).map(r => r.rating);
  const base = {
    title: s.title,
    status: s.status,
    satisfaction: { average: +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1), count: ratings.length },
    myReflection: s.reflections[me],
  };
  if (s.status === "noRecording" || (!s.metrics && !s.analysis)) {
    // 녹음이 없을 때: 본인 평가와 회고만으로 결과
    return { ...base, mode: "self", reflections: Object.entries(s.reflections).map(([p, r]) => ({ who: p, text: r.text })) };
  }
  const mine = s.metrics.perPerson[me];
  const out = {
    ...base,
    mode: s.analysis ? "full" : "metricsOnly",
    balance: s.metrics.balance, basis: s.metrics.basis,
    me: { share: mine.share, turns: mine.turns, avgLen: mine.avgLen, longestRun: mine.longestRun, questions: mine.questions, followUps: mine.followUps },
  };
  if (s.analysis) {
    out.session = s.analysis.session;
    out.nextTopics = s.analysis.nextTopics;
    out.todo = s.analysis.todo;
    out.highlights = s.analysis.highlights || [];
    out.engine = s.analysis.engine;
    out.me = { ...out.me, ...s.analysis.individual[me] };
  } else {
    out.pending = s.analysisError === NO_ENGINE ? "주제·해 볼 것·역할 해석은 AI 분석이 필요합니다." : "해석은 준비 중입니다.";
  }
  return out;
}

function speakerSamples(raw) {
  const by = {};
  for (const r of raw) (by[r.label] ||= []).length < 3 && by[r.label].push(r.text);
  return by;
}

// 목록·상태 조회용. 전사본, 지표, 분석, 회고 내용은 담지 않는다.
function publicView(s) {
  return {
    id: s.id, title: s.title, participants: s.participants, status: s.status,
    analysisError: s.analysisError, hasTranscript: !!s.segments, busy: s.busy || null,
    speakers: s.rawSegments ? speakerSamples(s.rawSegments) : null,
    guess: s.rawSegments && s.guess ? {
      mapping: s.guess.mapping,
      doubtful: s.guess.doubtful.map(d => ({ ...d, label: s.rawSegments[d.index].label, text: s.rawSegments[d.index].text })),
    } : null,
    guessError: s.guessError,
    reflected: Object.keys(s.reflections),
  };
}

export default app;
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const s of store.all()) if (s.busy) store.update(s.id, s => { s.busy = null; });
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`진짜 대화 리캡: http://localhost:${port}`));
}
