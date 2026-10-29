// 역할 순환 규칙. 화면과 분리된 순수 함수만 둔다.
// 일반 <script>로도, 테스트의 import로도 읽히도록 export 대신 globalThis에 붙인다.
// (파일을 바로 열어도 동작해야 하는데, file://에서는 모듈 import가 막힌다)
(() => {
  const ROLES = [
    { id: "open", name: "말 꺼내기", desc: "지금 이야기에 대한 내 생각이나 경험을 먼저 꺼내 주세요. 들은 이야기나 가벼운 경험이어도 괜찮아요." },
    { id: "reflect", name: "되짚기", desc: "방금 들은 말을 한 문장으로 되짚고 '이렇게 이해했는데 맞아요?' 하고 확인한 뒤, 궁금한 걸 하나 더 물어봐 주세요." },
    { id: "differ", name: "다르게 보기", desc: "다른 경우나 다른 시선이 떠오르면 하나 꺼내 주세요. 반대하라는 뜻은 아니에요. 떠오르지 않으면 '저도 비슷해요'도 괜찮아요." },
  ];
  // 화면을 바라볼 때 왼쪽 · 가운데 · 오른쪽
  const SEATS = ["왼쪽 자리", "가운데 자리", "오른쪽 자리"];

  // 모임 전체에 걸친 화두 한 줄. 고백을 요구하지 않고, 들은 이야기로도 답할 수 있게 쓴다.
  // 첫 화두가 기본값이다. text가 null이면 화두를 띄우지 않는다.
  const TOPICS = [
    { id: "failure", label: "실패", text: "실패라고 생각했다가 나중에 다르게 보인 일이 있나요? 들은 이야기도 좋아요." },
    { id: "goodlife", label: "잘 산다는 것", text: "잘 산다는 건 어떤 모습일까요? 주변에서 본 모습도 좋아요." },
    { id: "adult", label: "어른", text: "어른이 된다는 건 무엇이 달라지는 걸까요?" },
    { id: "luck", label: "운과 노력", text: "지금의 나를 만든 것 중 운은 얼마나였을까요?" },
    { id: "none", label: "화두 없이", text: null },
  ];

  // 처음 배정만 무작위. start[자리] = 그 자리의 첫 역할 번호
  function createRotation(random = Math.random) {
    const start = [0, 1, 2];
    for (let i = start.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [start[i], start[j]] = [start[j], start[i]];
    }
    return { start, turn: 0, resting: [] };
  }

  // 차례마다 모두 한 칸씩 같은 방향으로 이동하므로, 세 차례면 모두가 세 역할을 한 번씩 맡는다
  function roleIndex(state, seat) {
    checkSeat(seat);
    return (state.start[seat] + state.turn) % ROLES.length;
  }

  function assignments(state) {
    return SEATS.map((_, seat) => ({
      seat,
      role: ROLES[roleIndex(state, seat)],
      resting: state.resting.includes(seat),
    }));
  }

  // 쉬기는 이번 차례에만. 다음 차례가 되면 풀린다
  function nextTurn(state) {
    return { ...state, turn: state.turn + 1, resting: [] };
  }

  // "이번엔 쉬어요" — 역할을 비워 둘 뿐, 다른 사람과 맞바꾸지 않는다. 다시 누르면 취소
  function toggleRest(state, seat) {
    checkSeat(seat);
    const resting = state.resting.includes(seat)
      ? state.resting.filter(s => s !== seat)
      : [...state.resting, seat];
    return { ...state, resting };
  }

  function checkSeat(seat) {
    if (!Number.isInteger(seat) || seat < 0 || seat >= SEATS.length) throw new RangeError(`없는 자리: ${seat}`);
  }

  globalThis.RoleRotation = { ROLES, SEATS, TOPICS, createRotation, roleIndex, assignments, nextTurn, toggleRest };
})();
