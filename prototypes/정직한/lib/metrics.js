// 전사본(화자별 발화 목록)에서 숫자 지표를 직접 계산한다. AI는 쓰지 않는다.
// segments: [{ speaker: "이름", text: "...", start?: ms, end?: ms }]
export function computeMetrics(segments, participants) {
  const per = Object.fromEntries(participants.map(p => [p, { turns: 0, chars: 0, ms: 0, questions: 0, followUps: 0 }]));
  let prev = null;
  for (const s of segments) {
    const m = per[s.speaker];
    if (!m) continue;
    m.turns += 1;
    m.chars += s.text.length;
    if (s.end != null && s.start != null) m.ms += s.end - s.start;
    const isQuestion = /\?|까요|나요|어때|뭐야|있어\?|니\?/.test(s.text);
    if (isQuestion) m.questions += 1;
    // 다른 사람 말 바로 뒤에 이어서 한 질문
    if (isQuestion && prev && prev !== s.speaker) m.followUps += 1;
    prev = s.speaker;
  }
  const useMs = Object.values(per).some(m => m.ms > 0);
  const total = Object.values(per).reduce((a, m) => a + (useMs ? m.ms : m.chars), 0) || 1;
  const result = {};
  const shares = [];
  for (const [p, m] of Object.entries(per)) {
    const share = ((useMs ? m.ms : m.chars) / total) * 100;
    shares.push(share);
    result[p] = { ...m, share: Math.round(share) };
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
