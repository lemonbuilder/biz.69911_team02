import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

await import("../public/rotation.js");
const { ROLES, SEATS, TOPICS, createRotation, roleIndex, assignments, nextTurn, toggleRest } = globalThis.RoleRotation;

// 정해진 값을 차례로 돌려주는 가짜 난수
const seq = (...xs) => { let i = 0; return () => xs[i++ % xs.length]; };
const roleIds = state => assignments(state).map(a => a.role.id);

test("역할 3개, 자리 3개", () => {
  assert.deepEqual(ROLES.map(r => r.name), ["말 꺼내기", "되짚기", "다르게 보기"]);
  assert.equal(SEATS.length, 3);
});

test("첫 배정은 무작위지만, 세 역할이 한 사람에게 하나씩 돌아간다", () => {
  const seen = new Set();
  for (const r of [0, 0.2, 0.4, 0.6, 0.8, 0.99]) {
    for (const r2 of [0, 0.5, 0.99]) {
      const ids = roleIds(createRotation(seq(r, r2)));
      assert.equal(new Set(ids).size, 3, `겹침: ${ids}`);
      seen.add(ids.join());
    }
  }
  assert.ok(seen.size > 1, "난수에 따라 배정이 달라져야 한다");
});

test("다음 차례에는 모두 한 칸씩 같은 방향으로 이동한다", () => {
  let s = createRotation(seq(0.3, 0.7));
  for (let t = 0; t < 5; t++) {
    const next = nextTurn(s);
    for (let seat = 0; seat < 3; seat++) {
      assert.equal(roleIndex(next, seat), (roleIndex(s, seat) + 1) % 3);
    }
    s = next;
  }
});

test("세 차례면 모두가 세 역할을 한 번씩 맡는다", () => {
  let s = createRotation(seq(0.9, 0.1));
  const held = [new Set(), new Set(), new Set()];
  for (let t = 0; t < 3; t++) {
    assignments(s).forEach(a => held[a.seat].add(a.role.id));
    s = nextTurn(s);
  }
  for (const h of held) assert.equal(h.size, 3);
});

test("쉬기는 그 역할을 비울 뿐, 다른 사람의 역할을 바꾸지 않는다", () => {
  const s = createRotation(seq(0.5, 0.5));
  const rested = toggleRest(s, 1);
  assert.deepEqual(roleIds(rested), roleIds(s));
  assert.deepEqual(assignments(rested).map(a => a.resting), [false, true, false]);
});

test("쉬기는 다음 차례에 풀리고, 다시 누르면 취소된다", () => {
  const s = toggleRest(toggleRest(createRotation(), 0), 2);
  assert.deepEqual(nextTurn(s).resting, []);
  assert.deepEqual(toggleRest(s, 0).resting, [2]);
});

test("없는 자리는 거절한다", () => {
  const s = createRotation();
  assert.throws(() => toggleRest(s, 3), RangeError);
  assert.throws(() => roleIndex(s, -1), RangeError);
});

test("역할 문구: 다르게 보기는 반대 연기가 아니고 빠져나갈 길이 있다", () => {
  const differ = ROLES.find(r => r.id === "differ");
  assert.match(differ.desc, /반대하라는 뜻은 아니에요/);
  assert.match(differ.desc, /저도 비슷해요/);
});

test("역할 문구: 되짚기에 후속 질문, 말 꺼내기에 들은 이야기", () => {
  assert.match(ROLES.find(r => r.id === "reflect").desc, /하나 더 물어봐/);
  assert.match(ROLES.find(r => r.id === "open").desc, /들은 이야기/);
});

test("화두: 기본은 실패, 화두 없이 선택 가능, 고백을 요구하지 않는 질문", () => {
  assert.equal(TOPICS[0].id, "failure");
  assert.equal(TOPICS.filter(t => t.text === null).length, 1);
  for (const t of TOPICS.filter(t => t.text)) {
    assert.match(t.text, /\?/, `질문 형태: ${t.label}`);
    for (const banned of ["당신의 실패", "털어놓", "고백", "직업", "회사", "나이", "사는 곳"]) {
      assert.ok(!t.text.includes(banned), `${t.label}에 "${banned}"`);
    }
  }
  assert.match(TOPICS[0].text, /들은 이야기/);
});

test("역할 이름은 Recap의 관찰 라벨과 겹치지 않는다", () => {
  for (const label of ["질문하는 사람", "이어 주는 사람", "주로 말하는 사람"]) {
    for (const r of ROLES) assert.ok(!r.name.includes(label) && !label.includes(r.name), `${r.name} ≈ ${label}`);
  }
});

test("화면 코드는 저장소·네트워크·마이크를 쓰지 않는다", async () => {
  const src = (await Promise.all(["app.js", "rotation.js", "index.html"].map(f =>
    readFile(new URL(`../public/${f}`, import.meta.url), "utf8")))).join("\n");
  for (const api of ["localStorage", "sessionStorage", "indexedDB", "document.cookie", "fetch(", "XMLHttpRequest", "WebSocket", "getUserMedia", "SpeechRecognition"]) {
    assert.ok(!src.includes(api), `${api} 사용 금지`);
  }
});
