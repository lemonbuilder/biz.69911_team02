# QUESTIONS.md

Team: Team 02
Last updated: 2026-10-11

Your biggest open questions about this project.
Write this together, after the premortem merge.

At most five, most important first.
The consultation opens with question 1, so put the one you are least sure about there, not the one that is easiest to ask.

Write in Korean or English.
Keep the headings exactly as they are.

---

## What counts as an open question

- **The answer would change what you do next.** If every possible answer leaves your next two weeks the same, it is curiosity, not an open question.
- **It is specific to this project.** "Is our idea good?" cannot be answered in 30 minutes. "We assume the person in `PROJECT.md` will enter data by hand every day, and none of us has asked one. How do we test that in a week?" can.
- **You have already tried something.** Say what you think the answer is today, even if it is a guess. A question with a guess attached gets a much better answer than a bare one.

Two good places to look for questions:

- `docs/PREMORTEM.md` — a cause of failure you could not find a countermeasure for is a question.
- `docs/PROJECT.md` — the section you argued about longest, or the one where you wrote "nobody yet".

## Our questions

### 1. 3인 구조가 정말 더 좋은 대화를 만드는가?

- **Why it matters:** 이 서비스의 핵심 가설이다. 3명일 때 대화가 체감될 만큼 좋아진다면, 학기 동안 만들 것은 3명을 잘 조합하고 세 자리를 다 채우는 장치다. 차이가 없다면 "3인"을 내세울 이유가 없어지고 일반 소모임 앱과 다를 바가 없어진다. 세 명 모두 "차별점이 없어 밀렸다"를 적었는데(PREMORTEM #1), 그 차별점이 바로 이 가설에 달려 있다.
- **What we think today:** 3명은 모두가 말하게 되고, 대화가 끊겨도 제3자가 이어 주는 최소 단위라고 믿는다. 반대로 2:1로 갈리거나 한 명이 겉도는 순간도 있을 수 있다. 근거는 우리 팀 3명의 회의 경험뿐이다. 3인 시범 모임 3회의 참여자 중 4명을 다시 모아 4인 모임 1회를 열고, 같은 사람에게 "몇 분이나 말했나 / 얼마나 깊이 이야기했나 / 다시 오고 싶은가"를 비교해 묻는다. 다만 표본이 너무 작고, 참여자가 지인 네트워크에서 오기 때문에 후하게 답할 수 있다는 점이 걱정이다.
- **Who could answer it:** 시범 모임에 온 팀 밖 참가자들. 실제 사용자의 의견을 직접 듣는다.

### 2. "검증된 대화 상대"와 만나려면 추가 요금을 내는 구조에서, 정작 검증된 사람은 왜 계속 남아 있어야 하는가?

- **Why it matters:** 평가가 좋은 사람일수록 돈을 내는 사람들과 만나는 "서비스 제공자"가 되는데, 보상이 없으면 가장 좋은 사용자부터 떠날 수 있다. 답에 따라 수익 구조를 "추가 요금"에서 "검증된 사람에게 할인·보상을 주는 방식"으로 바꿔야 할 수도 있다. 두 명이 "아무도 돈을 내지 않았다"를 적었다(PREMORTEM #3).
- **What we think today:** 검증된 사람도 비슷한 수준의 상대를 만나고 싶어 할 것이라는 막연한 가정뿐이다. 아직 아무에게도 물어보지 않았다.
- **Who could answer it:** 시범 모임에서 평가가 좋게 나온 참여자, 그리고 트레바리·문토 같은 유료 모임에 돈을 내 본 직장인. 실제 사용자의 의견을 직접 듣는다.

### 3. 세션이 "좋았다"는 평가를 무엇으로 측정해야, 듣는 사람과 말하는 사람 모두 공정하게 검증할 수 있는가?

- **Why it matters:** 세 명이 서로 평가하면 예의상 높은 점수를 주거나, 말을 많이 한 사람만 기억에 남을 수 있다. 측정 방식이 잘못되면 "검증된 대화 상대"와 유료화의 근거 자체가 무너진다.
- **What we think today:** 개인이 아니라 세션 단위로 평가하고, 좋은 세션에 참여한 횟수를 누적하는 방식이 평가 부담을 줄여 줄 것이라고 생각한다.
- **Who could answer it:** 팀 내 추가 논의가 필요하다. 시범 모임마다 참여자가 세션 단위 평가와 개인 단위 평가를 둘 다 작성하게 하고, 어느 쪽이 덜 불편했는지와 두 결과가 얼마나 다른지를 본다.

### 4. 이 서비스를 실제로 구현하기 위해 가장 집중해야 하는 부분이 "AI 기반 비즈니스" 수업이 목표로 하는 바와 일치하는가?

- **Why it matters:** 지금 보이는 핵심 과제는 세 자리를 다 채워 모임을 성사시키는 것, 이상한 사람을 거르는 신뢰·안전 운영, 그리고 세션 평가다(PREMORTEM #2, #4). 이 중 상당 부분이 AI보다 오프라인 운영과 커뮤니티 관리에 가깝다. 어긋난다면 Demo Day까지 AI가 실제로 일을 하는 부분(3인 조합 매칭, 대화 주제 준비, 신청서 기반 사전 필터링)을 프로젝트의 중심으로 잡고, 오프라인 운영은 시범 검증 수준으로 줄여야 한다. 어긋나지 않는다면 앱 개발보다 시범 운영과 운영 설계를 프로젝트의 본체로 가져간다.
- **What we think today:** 핵심 가치가 오프라인 대화라서, 앱 개발에 시간을 쓰면 정작 검증해야 할 부분을 못 볼 수 있다. 지역·시간 조율과 AI 매칭만 하는 간단한 웹 페이지, 그리고 실제 시범 모임 결과로 충분하다고 본다. AI 비중을 어느 정도로 가져갈지는 팀 안에서 아직 정하지 않았다.
- **Who could answer it:** 팀 내 추가 논의가 필요하다. 매칭·필터링 중 무엇을 AI에 맡길지는 시범 참가자에게 "어떤 기준으로 같은 테이블 사람이 정해지면 좋겠나"를 묻고 그 답을 바탕으로 정한다.

### 5. 세 자리가 다 차야 열리는 구조에서, 모르는 3명을 매칭할 것인가, 2명이 함께 신청하고 1명만 채울 것인가?

- **Why it matters:** 모르는 3명이면 대화는 새롭지만 노쇼 한 명에 모임이 무산되고(PREMORTEM #4), 이상한 사람 한 명이 테이블 전체를 망친다(PREMORTEM #2). 2+1이면 성사율과 안전은 오르지만 "1"이 소외될 수 있다. 운영 규칙(실행 항목 2)의 수준이 여기서 정해진다.
- **What we think today:** 시범 모임은 팀원의 회사·지인 네트워크에서만 받되, 서로 모르는 사람끼리 앉힌다. 3회 중 2회는 모르는 3명, 1회는 2+1로 열어 성사율과 "1"의 만족도를 비교하려 한다.
- **Who could answer it:** 직접 열어 봐야 안다. 시범 모임 참가자의 의견을 직접 듣는다.

## Where we disagree

- 서로 모르는 사람을 만날 수 있는 기회를 제공하는 서비스에 집중할지, 이미 형성된 커뮤니티에서 더 좋은 대화를 나눌 수 있도록 지원하는 것에 집중할 것인지에 대한 결정  
- 최종 결과물에 대한 방향성 

---

## After the consultation

Fill this in within a week of your slot.

| # | What we heard | What we will do about it | Owner | By when |
|---|---|---|---|---|
| 1 | 차별점이 보이지 않는다. 3명 모임은 카톡·디스코드로도 만들 수 있는데, 무엇이 다르고 어떻게 "의미 있는" 모임이 되는가? | 교수님 소개로 교수님 모임과 지난 학기 수강생 후속 모임(2팀)을 인터뷰하고 운영 프로토콜을 받아, "진짜 대화"·"의미 있는 모임"이 생기는 조건을 정리한다. | 정직한, 박혜민 | 2026-10-21 |
| 2 | 깊은 대화는 고정 멤버가 장기간(약 12주) 만나며 신뢰가 쌓인 뒤에 생겼다. 대화를 모니터링·평가해서 만들어지는 것은 아닐 수 있다. | 단발성 3인 매칭+세션 평가와 고정 멤버 정례 모임 중 어느 쪽으로 갈지 정례 미팅에서 결정하고, `PROJECT.md`에 반영한다. | 문피아, 정직한 | 2026-10-21 |
| 3 | AI가 꼭 필요한 서비스가 아닐 수 있고, 수업 및 평가항목과는 직결되지 않을 수 있다.(평가 기준: So what / What's new / Why you / AI native). 그럼에도 이 아이디어를 선택할 시, 문제의 본질에 집중하라. | 실제 모임을 주선 또는 참석한다. 매 미팅마다 그 주 수업 내용을 프로젝트에 적용할 지점을 하나씩 정해 시도한다. | 박혜민, 문피아, 정직한 | 매주 |
| 4 | 실제로 모임을 주선·운영하는 데 품이 많이 드는 프로젝트다(팀 논의). | 각자의 목표와 투입 가능 시간을 공유하고, 수업 외 주 1회 정기 미팅(수요일 밤 10시, 온라인)을 고정한다. | 박혜민, 문피아, 정직한 | 2026-10-24 |

## Revision log

| Date | What changed and why |
|---|---|
| 2026-10-02 | Draft for consultation |
| 2026-10-11 | 컨설팅 후 팀 논의 결과: 아이디어대로 진행하기로 결정했다. 1번(3인 구조가 더 좋은 대화를 만드는가)과 4번(수업 목표와의 정합성)과 관련해, AI 활용 이외에 "진짜 대화"란 무엇인지, "의미 있는 모임"이 무엇인지 알아내는 데 시간과 에너지를 투자하고, 교수님이 진행 중인 모임과 이전 수강생들의 후속 모임을 벤치마킹한다. 문제의 본질에 집중하되 수업 시간에 배우는 내용도 적극적으로 활용하고 시도하며, 수업 외 주 1회 팀 정기 미팅에서 이어 논의한다. |
