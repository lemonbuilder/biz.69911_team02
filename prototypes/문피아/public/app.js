// 역할 돌리기 화면. 규칙은 rotation.js에 있고, 여기서는 화면만 다룬다.
// 모든 상태는 이 변수에만 있다. 새로고침하거나 끝내면 사라진다.
const { SEATS, createRotation, assignments, nextTurn, toggleRest } = window.RoleRotation;
const $ = id => document.getElementById(id);

let state = null;   // { rotation, names: [3], on: bool, turnStartedAt }
let ticker = null;

function show(screen) {
  for (const id of ["intro", "session", "ended"]) $(id).classList.toggle("on", id === screen);
}

function start() {
  state = {
    rotation: createRotation(),
    names: [0, 1, 2].map(i => $(`name${i}`).value.trim()),
    on: true,
    turnStartedAt: Date.now(),
  };
  show("session");
  render();
  ticker = setInterval(renderElapsed, 15_000);
  $("nextBtn").focus();
}

function render() {
  const { on } = state;
  $("seats").hidden = !on;
  $("pausedNote").hidden = on;
  $("nextBtn").hidden = !on;
  $("pauseBtn").hidden = !on;
  if (on) renderSeats();
  renderElapsed();
}

// 다음 차례 예고는 띄우지 않는다. 지금 맡은 역할에만 집중하게
function renderSeats() {
  $("seats").replaceChildren(...assignments(state.rotation).map(({ seat, role, resting }) => {
    const card = document.createElement("article");
    card.className = "seat" + (resting ? " resting" : "");
    card.dataset.role = role.id;
    card.innerHTML = `
      <div class="who"></div>
      <h2 class="role"></h2>
      <p class="desc"></p>
      <p class="rest-note"></p>
      <button class="quiet"></button>`;
    card.querySelector(".who").textContent = state.names[seat] || SEATS[seat];
    card.querySelector(".role").textContent = role.name;
    card.querySelector(".desc").textContent = role.desc;
    card.querySelector(".rest-note").textContent = resting ? "이번엔 쉬어요" : "";
    const btn = card.querySelector("button");
    btn.textContent = resting ? "다시 할게요" : "이번엔 쉬어요";
    btn.addEventListener("click", () => {
      state.rotation = toggleRest(state.rotation, seat);
      renderSeats();
    });
    return card;
  }));
}

// 지난 시간은 작게 보여 주기만 한다. 소리·깜빡임으로 재촉하지 않는다
function renderElapsed() {
  if (!state) return;
  const min = Math.floor((Date.now() - state.turnStartedAt) / 60_000) + 1;
  $("elapsed").textContent = state.on ? `이번 차례 ${min}분째` : "";
}

function next() {
  state.rotation = nextTurn(state.rotation);
  state.turnStartedAt = Date.now();
  render();
}

function pause() {
  state.on = false;
  render();
  $("resumeBtn").focus();
}

// 멈췄던 배정에서 그대로 이어 간다. 시간만 새로 센다
function resume() {
  state.on = true;
  state.turnStartedAt = Date.now();
  render();
  $("nextBtn").focus();
}

// 확인 창 없이 끝낸다. 지울 것이 이름뿐이라서
function end() {
  clearInterval(ticker);
  state = null;
  for (const i of [0, 1, 2]) $(`name${i}`).value = "";
  $("seats").replaceChildren();
  $("elapsed").textContent = "";
  show("ended");
}

$("startBtn").addEventListener("click", start);
$("nextBtn").addEventListener("click", next);
$("pauseBtn").addEventListener("click", pause);
$("resumeBtn").addEventListener("click", resume);
$("endBtn").addEventListener("click", end);
$("againBtn").addEventListener("click", () => show("intro"));
