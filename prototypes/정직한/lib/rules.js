// 규칙 기반 분석 (AI 없음). 키가 하나도 없을 때 쓴다.
const STOP = new Set("그냥 진짜 근데 그래서 그리고 그런데 이제 약간 좀 너무 정말 아니 그거 이거 저거 거기 여기 우리 너는 나는 내가 네가 그래 응 어 음 있어 없어 했어 하는 하고 해서 같아 같은 많이 요즘 어떻게 뭐 왜 그게 이게 그럼".split(" "));
const JOSA = /(으로|에서|에게|까지|부터|이랑|하고|처럼|보다|은|는|이|가|을|를|에|도|만|와|과|로|의|랑|야|요)$/;

function keywords(segments, n = 3) {
  const count = {};
  for (const s of segments) {
    for (let w of s.text.split(/[^가-힣A-Za-z0-9]+/)) {
      w = w.replace(JOSA, "");
      if (w.length < 2 || STOP.has(w) || /(었어|았어|했어|어요|아요|네요|니다|겠다|는데|려고|네|지|다)$/.test(w)) continue;
      count[w] = (count[w] || 0) + 1;
    }
  }
  return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, n).map(([w]) => w);
}

export function analyzeByRules(session, segments, metrics) {
  const people = Object.entries(metrics.perPerson);
  const top = people.reduce((a, b) => (b[1].share > a[1].share ? b : a));
  const asker = people.reduce((a, b) => (b[1].followUps > a[1].followUps ? b : a));
  const low = people.reduce((a, b) => (b[1].share < a[1].share ? b : a));

  const balanceText = metrics.balance >= 80 ? "세 사람이 고르게 이야기한 대화였습니다."
    : metrics.balance >= 50 ? "대체로 고르게 이야기했지만 조금 기운 부분이 있었습니다."
    : "대화가 한쪽으로 꽤 기울었습니다.";
  const kw = keywords(segments);

  const individual = {};
  for (const [p, m] of people) {
    const role = p === asker[0] && m.followUps > 0 ? "질문으로 대화를 이어 준 사람"
      : p === top[0] ? "이야기를 주로 이끈 사람"
      : p === low[0] ? "주로 듣고 반응한 사람"
      : "이야기를 나누며 받쳐 준 사람";
    individual[p] = {
      role,
      engagement: `발화 비중 ${m.share}%, 발화 ${m.turns}회, 질문 ${m.questions}회(그중 다른 사람 말에 이어서 한 질문 ${m.followUps}회)였습니다.` +
        (m.share > 50 ? " 다음에는 다른 사람에게 질문을 더 건네 보면 좋겠습니다." : m.share < 20 ? " 다음에는 내 이야기를 조금 더 꺼내 보면 좋겠습니다." : ""),
    };
  }
  return {
    engine: "rules",
    session: `${balanceText} (균형 ${metrics.balance}/100, ${metrics.basis} 기준) 자주 나온 말은 ${kw.join(", ") || "뚜렷하지 않았습니다"}입니다.`,
    nextTopics: kw.length ? kw.map(w => `"${w}" 이야기를 더 깊게`) : ["이번에 다 못한 이야기"],
    todo: [
      "이번 대화에서 기억에 남은 한 문장을 적어 두기",
      kw[0] ? `"${kw[0]}"에 대해 내 생각을 한 가지 정리해 오기` : "다음에 꺼낼 내 이야기 하나 준비하기",
      metrics.balance < 80 ? "다음 모임에서 덜 말한 사람에게 먼저 질문하기" : "다음 모임에서도 서로 질문을 이어 가기",
    ],
    individual,
  };
}
