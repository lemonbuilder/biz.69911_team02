import { ICEBREAKERS, FALLBACK, STAGES } from "./questions.js";

const $ = id => document.getElementById(id);
const ICE_HINT = "불리고 싶은 이름과 함께, 한 사람씩 돌아가며 답해 보세요";
const DEEP_HINT = "답하고 싶은 만큼만, 넘어가도 괜찮아요";
const BUFFER_MS = 180_000;   // 직전 3분
const MIN_CHARS = 30;        // 이보다 적게 받아 적었으면 AI를 부르지 않는다
const CLIENT_TIMEOUT = 5000;
const WATCHDOG_MS = 15_000;

const state = {
  mode: "off",               // "mic" | "nomic" | "off"
  stage: "light",
  current: null,             // { text, kind: "ice" | "stage" }
  used: {},                  // 같은 모임에서 고정 질문 중복 방지
  busy: false,
  consentFor: "start",       // "start" | "resume"
  sessionId: 0,
};

// ---------- 받아 적기 (Chrome Web Speech API) ----------
// 버퍼에는 확정된 인식 결과만 { t, text }로 담고, 화면에는 절대 띄우지 않는다.
let buffer = [];
const rec = { instance: null, want: false, attempt: 0, backoff: 500, lastEvent: 0, restarts: 0, watchdog: null, pruner: null };
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function setStatus(s) {
  $("status").dataset.state = s;
  $("statusText").textContent = {
    listening: "듣는 중", reconnecting: "다시 연결 중", waiting: "마이크 권한 기다리는 중", off: "듣지 않음",
  }[s];
}

// 권한 창이 떠 있는 동안 인식을 돌리면 재시작이 권한 요청을 덮어써서 "허용"이 반영되지 않는다.
// 그래서 권한을 먼저 한 번 받고 나서 인식을 시작한다.
async function startListening() {
  if (!SR) { state.mode = "nomic"; setStatus("off"); updateMicBtn(); return; }
  const attempt = ++rec.attempt;
  state.mode = "mic";
  updateMicBtn();
  setStatus("waiting");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
  } catch {
    if (attempt === rec.attempt) { state.mode = "nomic"; setStatus("off"); updateMicBtn(); }
    return;
  }
  if (attempt !== rec.attempt || state.mode !== "mic") return;   // 기다리는 사이 멈췄거나 끝냈으면 시작하지 않는다
  rec.want = true;
  rec.backoff = 500;
  rec.lastEvent = Date.now();
  openRecognizer();
  rec.watchdog = setInterval(() => {
    if (rec.want && Date.now() - rec.lastEvent > WATCHDOG_MS) {
      rec.lastEvent = Date.now();
      rec.instance?.abort();   // onend에서 다시 시작한다
    }
  }, 5000);
  rec.pruner = setInterval(pruneBuffer, 30_000);
  updateMicBtn();
}

function openRecognizer() {
  const r = new SR();
  r.lang = "ko-KR";
  r.continuous = true;
  r.interimResults = false;
  const touch = () => { rec.lastEvent = Date.now(); };
  r.onstart = () => { touch(); setStatus("listening"); };
  r.onaudiostart = r.onspeechstart = touch;
  r.onresult = e => {
    touch();
    rec.backoff = 500;
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) buffer.push({ t: Date.now(), text: e.results[i][0].transcript.trim() });
    }
  };
  r.onerror = e => {
    touch();
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      stopListening();
      state.mode = "nomic";
      updateMicBtn();
    }
  };
  r.onend = () => {
    if (!rec.want) return;
    setStatus("reconnecting");
    rec.restarts++;
    setTimeout(() => { if (rec.want) openRecognizer(); }, rec.backoff);
    rec.backoff = Math.min(rec.backoff * 2, 2000);
  };
  rec.instance = r;
  try { r.start(); } catch { r.onend(); }
}

function stopListening() {
  rec.attempt++;   // 권한을 기다리던 시작 요청도 무효로 만든다
  rec.want = false;
  clearInterval(rec.watchdog);
  clearInterval(rec.pruner);
  if (rec.instance) { rec.instance.onend = null; rec.instance.abort(); rec.instance = null; }
  buffer = [];
  setStatus("off");
}

function pruneBuffer() {
  const cutoff = Date.now() - BUFFER_MS;
  buffer = buffer.filter(x => x.t >= cutoff);
}

function updateMicBtn() {
  $("micBtn").textContent = state.mode === "mic" ? "듣기 멈춤" : "다시 듣기";
}

// ---------- 질문 ----------
function pickFixed(key) {
  const list = key === "ice" ? ICEBREAKERS : FALLBACK[key];
  const used = (state.used[key] ??= new Set());
  let pool = list.filter(q => !used.has(q) && q !== state.current?.text);
  if (pool.length === 0) { used.clear(); pool = list.filter(q => q !== state.current?.text); }
  const q = pool[Math.floor(Math.random() * pool.length)];
  used.add(q);
  return q;
}

function show(text, kind, source) {
  state.current = { text, kind };
  $("question").textContent = text;
  $("question").classList.remove("waiting");
  $("source").textContent = source === "fallback" ? "기본 질문" : "";
  renderHint();
}

function renderHint() {
  if (state.busy) $("hint").textContent = "질문을 고르는 중…";
  else if (state.current?.kind === "ice") $("hint").textContent = ICE_HINT;
  else if (state.stage === "deep") $("hint").textContent = DEEP_HINT;
  else $("hint").textContent = "";
}

function setBusy(on) {
  state.busy = on;
  // 듣기 멈춤과 모임 끝내기는 기다리는 중에도 누를 수 있어야 한다
  for (const b of document.querySelectorAll("#nextBtn, #skipBtn, .stage button")) b.disabled = on;
  $("question").classList.toggle("waiting", on);
  renderHint();
}

// "다음 질문": 지금 화제를 일반화해 이어 가는 새 질문 / "이 질문 넘기기": 같은 맥락에서 다시 뽑기
async function nextQuestion(kind) {
  if (state.busy) return;
  if (kind === "skip" && state.current?.kind === "ice") return show(pickFixed("ice"), "ice", "ice");

  pruneBuffer();
  const transcript = buffer.map(x => x.text).join(" ");
  if (state.mode !== "mic" || transcript.length < MIN_CHARS) {
    return show(pickFixed(state.stage), "stage", "fallback");
  }

  const session = state.sessionId;
  const stage = state.stage;
  setBusy(true);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CLIENT_TIMEOUT);
  let result = { source: "fallback" };
  try {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, transcript, avoid: state.current?.text }),
      signal: ctrl.signal,
    });
    if (res.ok) result = await res.json();
  } catch { /* 시간 초과, 네트워크 끊김: 고정 질문으로 */ }
  clearTimeout(timer);
  if (session !== state.sessionId) return;   // 그사이 모임이 끝났으면 버린다
  setBusy(false);
  if (result.source === "ai" && result.question) show(result.question, "stage", "ai");
  else show(pickFixed(stage), "stage", "fallback");
}

function setStage(stage) {
  state.stage = stage;
  for (const b of document.querySelectorAll(".stage button")) b.setAttribute("aria-pressed", String(b.dataset.stage === stage));
  renderHint();
}

// ---------- 화면 전환 ----------
function showScreen(id) {
  for (const s of document.querySelectorAll(".screen")) s.classList.toggle("on", s.id === id);
}

function openConsent(purpose) {
  state.consentFor = purpose;
  for (const c of document.querySelectorAll(".agree")) c.checked = false;
  $("startMic").disabled = true;
  showScreen("consent");
}

function begin(withMic) {
  if (state.consentFor === "start") {
    state.sessionId++;
    state.used = {};
    setStage("light");
    show(pickFixed("ice"), "ice", "ice");
  }
  if (withMic) startListening();
  else { state.mode = "nomic"; setStatus("off"); updateMicBtn(); }
  showScreen("session");
}

function endSession() {
  stopListening();
  state.sessionId++;
  state.mode = "off";
  state.current = null;
  state.used = {};
  state.busy = false;
  $("question").textContent = "";
  $("hint").textContent = "";
  $("source").textContent = "";
  $("confirm").classList.remove("on");
  showScreen("ended");
}

// ---------- 이벤트 ----------
for (const c of document.querySelectorAll(".agree")) {
  c.addEventListener("change", () => {
    $("startMic").disabled = ![...document.querySelectorAll(".agree")].every(x => x.checked);
  });
}
$("startMic").onclick = () => begin(true);
$("startNoMic").onclick = () => begin(false);
$("nextBtn").onclick = () => nextQuestion("next");
$("skipBtn").onclick = () => nextQuestion("skip");
// 단계를 바꾸면 이전 질문 대신 바뀐 단계의 새 질문을 바로 띄운다
for (const b of document.querySelectorAll(".stage button")) {
  b.onclick = () => {
    if (b.dataset.stage === state.stage) return;
    setStage(b.dataset.stage);
    nextQuestion("next");
  };
}
$("micBtn").onclick = () => {
  if (state.mode === "mic") { stopListening(); state.mode = "nomic"; updateMicBtn(); }
  else openConsent("resume");   // 다시 켜려면 세 명이 다시 동의한다
};
$("endBtn").onclick = () => $("confirm").classList.add("on");
$("confirmCancel").onclick = () => $("confirm").classList.remove("on");
$("confirmEnd").onclick = endSession;
$("restartBtn").onclick = () => openConsent("start");

// ---------- 테스트용 숫자 (D 키) ----------
// 받아 적은 원문은 보여 주지 않고 숫자만 보여 준다.
window.facilitatorDebug = () => ({ bufferLength: buffer.length, listening: rec.want, mode: state.mode, restarts: rec.restarts });
document.addEventListener("keydown", e => {
  if (e.key === "d" || e.key === "D") $("debug").classList.toggle("on");
});
setInterval(() => {
  if (!$("debug").classList.contains("on")) return;
  const minuteAgo = Date.now() - 60_000;
  const perMin = buffer.filter(x => x.t >= minuteAgo).reduce((n, x) => n + x.text.length, 0);
  $("debug").textContent = `mode ${state.mode} · 재시작 ${rec.restarts}회 · 분당 ${perMin}자 · 버퍼 ${buffer.length}개`;
}, 1000);

console.assert(STAGES.every(s => FALLBACK[s].length >= 10), "단계마다 고정 질문 10개 이상");
