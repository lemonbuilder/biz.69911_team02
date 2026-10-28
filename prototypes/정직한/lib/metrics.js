// 전사본(화자별 발화 목록)에서 숫자 지표를 직접 계산한다. AI는 쓰지 않는다.
// segments: [{ speaker: "이름", text: "...", start?: ms, end?: ms }]
const JOSA = /(으로|에서|에게|까지|부터|이랑|하고|처럼|보다|은|는|이|가|을|를|에|도|만|와|과|로|의|랑)$/;
const FILLER = new Set("그러니까 그래서 그리고 그런데 근데 이런 이렇게 그런 그렇게 저런 그냥 진짜 약간 정말 너무 이제 일단 아니 그거 이거 저거 우리 그게 이게 뭔가 좀".split(" "));
const words = text => new Set(text.split(/[^가-힣A-Za-z0-9]+/).map(w => w.replace(JOSA, "")).filter(w => w.length >= 2 && !FILLER.has(w)));
const isQuestion = text => /\?|까요|나요|어때|뭐야|니\?|었어\?|했어\?/.test(text);

export function computeMetrics(segments, participants) {
  const per = Object.fromEntries(participants.map(p => [p, { turns: 0, chars: 0, ms: 0, questions: 0, followUps: 0, longestRun: 0 }]));
  let prev = null, run = 0;
  for (const s of segments) {
    const m = per[s.speaker];
    if (!m) continue;
    m.turns += 1;
    m.chars += s.text.length;
    if (s.end != null && s.start != null) m.ms += s.end - s.start;
    if (isQuestion(s.text)) {
      m.questions += 1;
      // 이어서 한 질문: 바로 앞 사람이 쓴 단어를 다시 쓰며 묻는 질문
      if (prev && prev.speaker !== s.speaker) {
        const before = words(prev.text);
        if ([...words(s.text)].some(w => before.has(w))) m.followUps += 1;
      }
    }
    // 끊기지 않고 혼자 이어 말한 가장 긴 구간(글자 수)
    run = prev && prev.speaker === s.speaker ? run + s.text.length : s.text.length;
    m.longestRun = Math.max(m.longestRun, run);
    prev = s;
  }
  const useMs = Object.values(per).some(m => m.ms > 0);
  const total = Object.values(per).reduce((a, m) => a + (useMs ? m.ms : m.chars), 0) || 1;
  const result = {};
  const shares = [];
  for (const [p, m] of Object.entries(per)) {
    const share = ((useMs ? m.ms : m.chars) / total) * 100;
    shares.push(share);
    result[p] = { ...m, share: Math.round(share), avgLen: m.turns ? Math.round(m.chars / m.turns) : 0 };
  }
  // 균형: 세 사람이 정확히 1/3씩이면 100, 한 사람이 독점하면 0
  const ideal = 100 / participants.length;
  const dev = shares.reduce((a, s) => a + Math.abs(s - ideal), 0);
  const maxDev = 2 * (100 - ideal);
  return { perPerson: result, balance: 0 + Math.max(0, Math.round(100 * (1 - dev / maxDev))), basis: useMs ? "발화 시간" : "발화 글자 수" };
}

// "이름: 내용" 형식의 텍스트 전사본을 segments로 바꾼다.
export function parseTranscriptText(text, participants) {
  const segments = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([^:：]{1,20})\s*[:：]\s*(.+)$/);
    if (!m) {
      if (segments.length && line.trim()) segments[segments.length - 1].text += " " + line.trim();
      continue;
    }
    const name = m[1].trim();
    if (!participants.includes(name)) throw new Error(`전사본의 화자 "${name}"가 참여자 목록에 없습니다.`);
    segments.push({ speaker: name, text: m[2].trim() });
  }
  if (!segments.length) throw new Error("전사본에서 '이름: 내용' 형식의 줄을 찾지 못했습니다.");
  return segments;
}
