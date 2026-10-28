import "dotenv/config";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import express from "express";
import multer from "multer";
import * as store from "./lib/store.js";
import { computeMetrics, parseTranscriptText } from "./lib/metrics.js";
import { transcribe } from "./lib/clova.js";
import { analyze } from "./lib/analyze.js";

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

// 전사본이 이름과 연결되면 지표를 계산하고 Claude로 분석한다.
// 성공하면 전사본을 지운다. 실패하면 지표만 남기고 재시도를 위해 전사본을 보관한다.
async function runAnalysis(s) {
  s.metrics = computeMetrics(s.segments, s.participants);
  try {
    s.analysis = await analyze(s, s.segments, s.metrics);
    s.analysisError = null;
    s.segments = null;
    s.status = "analyzed";
  } catch (e) {
    s.analysisError = e.message;
    s.status = "transcribed";
  }
  return store.put(s);
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
    s.rawSegments = await transcribe(req.file.path, 3);
    store.put(s);
    res.json({ speakers: speakerSamples(s.rawSegments) });
  } catch (e) {
    res.status(502).json({ error: e.message });
  } finally {
    fs.rmSync(req.file.path, { force: true });
  }
});

// 화자 라벨 → 참여자 이름 연결
app.post("/api/sessions/:id/speakers", async (req, res) => {
  const s = need(req, res); if (!s) return;
  if (!s.rawSegments) return res.status(400).json({ error: "전사본이 없습니다." });
  const map = req.body.map || {};
  for (const name of Object.values(map)) if (!s.participants.includes(name)) return res.status(400).json({ error: `${name}은 참여자가 아닙니다.` });
  s.segments = s.rawSegments.map(r => ({ speaker: map[r.label], text: r.text, start: r.start, end: r.end })).filter(r => r.speaker);
  s.rawSegments = null;
  res.json(publicView(await runAnalysis(s)));
});

// 텍스트 전사본 직접 입력 ("이름: 내용")
app.post("/api/sessions/:id/transcript", async (req, res) => {
  const s = need(req, res); if (!s) return;
  try { s.segments = parseTranscriptText(req.body.text || "", s.participants); }
  catch (e) { return res.status(400).json({ error: e.message }); }
  res.json(publicView(await runAnalysis(s)));
});

app.post("/api/sessions/:id/retry", async (req, res) => {
  const s = need(req, res); if (!s) return;
  if (!s.segments) return res.status(400).json({ error: "다시 분석할 전사본이 없습니다." });
  res.json(publicView(await runAnalysis(s)));
});

app.post("/api/sessions/:id/no-recording", (req, res) => {
  const s = need(req, res); if (!s) return;
  s.status = "noRecording"; s.rawSegments = null; s.segments = null;
  res.json(publicView(store.put(s)));
});

app.post("/api/sessions/:id/reflections", (req, res) => {
  const s = need(req, res); if (!s) return;
  const { me, rating, text } = req.body;
  if (!s.participants.includes(me)) return res.status(403).json({ error: "이 세션의 참여자가 아닙니다." });
  const r = Number(rating);
  if (!(r >= 1 && r <= 5)) return res.status(400).json({ error: "만족도는 1~5입니다." });
  s.reflections[me] = { rating: r, text: String(text || "").trim(), at: new Date().toISOString() };
  store.put(s);
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
    me: { share: mine.share, turns: mine.turns, questions: mine.questions, followUps: mine.followUps },
  };
  if (s.analysis) {
    out.session = s.analysis.session;
    out.nextTopics = s.analysis.nextTopics;
    out.todo = s.analysis.todo;
    out.engine = s.analysis.engine;
    out.me = { ...out.me, ...s.analysis.individual[me] };
  } else {
    out.pending = "해석은 준비 중입니다.";
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
    analysisError: s.analysisError, hasTranscript: !!s.segments,
    speakers: s.rawSegments ? speakerSamples(s.rawSegments) : null,
    reflected: Object.keys(s.reflections),
  };
}

export default app;
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`진짜 대화 리캡: http://localhost:${port}`));
}
