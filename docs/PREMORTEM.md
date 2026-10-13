# PREMORTEM.md

Team: Team 02
Members: 박혜민, 문피아, 정직한
Merged on: 2026-10-02
Last updated: 2026-10-11

> **Order matters, and here it is the entire method.**
> Every member first writes their own list in `docs/premortem/<name>.md`, alone.
> Only then does the team fill in this file.
>
> If you brainstorm as a group first, the first risk named anchors everyone else, and the quiet member's risk, which is usually the real one, never gets written down.
>
> Write content in Korean or English.
> Keep the headings exactly as they are.

---

## 1. Individual lists

| Member | File | Written on | Causes listed |
|---|---|---|---|
| 박혜민 | `docs/premortem/박혜민.md` | 2026-09-23 | 7 |
| 문피아 | `docs/premortem/문피아.md` | 2026-10-02 | 5 |
| 정직한 | `docs/premortem/정직한.md` | 2026-10-02 | 5 |

## 2. Read-out

Go around the table.
One cause each, in turn, until every list is exhausted.
No debating during the read-out, and nobody reads their whole list at once.
People have to feel safe saying the awkward one, so the only allowed response is writing it down.

## 3. The merged list

Every cause from every list goes here.
Stack the repeats into one row and keep the sharpest wording, not the most diplomatic one.
Cluster by problem, never by role or department: once a cluster is called "development", half the team decides it is somebody else's problem.

Sort by how many members raised it, most first.
The repeats are your priority signal, and you get it for free.
Break ties by expected damage.

Mark a cause with **(us)** when it exists because of who is on this team, not because of the software.
At least two rows must carry that mark: skill asymmetry, time asymmetry, who will actually debug the code the artificial intelligence (AI) wrote, who has a product launch at work in November, who agrees in meetings and then goes quiet.
A premortem with no **(us)** rows is a premortem about software, not about this team.

| # | Failure cause (past tense, specific) | Problem cluster | Raised by | How many |
|---|---|---|---|---|
| 1 | "3명이 만난다"는 것 외에 차별점이 없었다. 유명 커뮤니티 플랫폼이 "3인 모임" 포맷을 내놓고 자본으로 밀어붙이자 사용자가 그쪽으로 옮겨 갔고, 남은 사용자도 락인되지 않아 재방문율이 무너졌다. | 차별점·경쟁 | 정직한 #1, 박혜민 #3, 문피아 #2 | 3 |
| 2 | 이상한 사람, 진상, 악성 사용자가 늘어 불만이 쌓였고 커뮤니티가 블라인드처럼 변질됐다. 3명뿐인 테이블이라 한 명만 이상해도 나머지 둘의 대화가 통째로 망가졌다. | 악성 사용자·안전 | 정직한 #3, 정직한 #5, 박혜민 #5 | 2 |
| 3 | 아무도 돈을 내지 않았다. "검증된 대화 상대" 추가 요금도 팔리지 않아 평범한 무료 소셜 앱이 됐고, 운영비와 고객획득비용만 쌓였다. | 수익 모델 | 정직한 #2, 박혜민 #1 | 2 |
| 4 | 마케팅 비용을 다 썼는데도 사람이 모이지 않았다. 세 자리가 다 차야 열리는 구조라 한 자리가 비거나 한 명이 노쇼하면 모임이 취소됐고, 초기 모임이 성사되지 않은 채 조용히 사장됐다. | 초기 모객·콜드스타트 | 정직한 #4, 문피아 #1 | 2 |
| 5 | 트랙션이 없어 투자 유치와 정부지원사업에 모두 실패했고 런웨이가 바닥났다. | 자금·런웨이 | 박혜민 #2, 문피아 #1 | 2 |
| 6 | 우리 세 명 중 누구도 전력을 다하지 않았고, 사기가 떨어지자 더이상 하기 싫어졌다. 그만두겠다는 사람이 생겼다. **(us)** | 팀 몰입·이탈 | 박혜민 #7, 문피아 #3, 문피아 #5 | 2 |
| 7 | 3인 모임 중 불미스러운 사고가 발생했다. 소수가 만나는 구조라 말리거나 증언해 줄 사람도 적었고, 소문이 퍼지면서 사용자가 이탈했다. | 악성 사용자·안전 | 박혜민 #4 | 1 |
| 8 | 세 창업자가 크게 싸운 끝에 못 해먹겠다 하고 갈라섰다. **(us)** | 팀 갈등 | 문피아 #4 | 1 |
| 9 | 우리가 예상한 좋은 사람들 대신 그렇지 않은 사람들이 주축이 되었다. 그 괴리가 커지자 팀이 이 서비스를 이어갈 이유를 잃었다. **(us)** | 타깃 괴리 | 박혜민 #6 | 1 |

Add rows until every individual list is used up.

## 4. What only one person saw

Look again at every row above that a single member raised.

| Cause | Raised by | What we decided to do about it |
|---|---|---|
| #7 3인 모임 중 사고 → 소문 → 대거 이탈 | 박혜민 | #2 악성 사용자와 묶어 5절의 2번 대응책으로 다룬다. 오프라인 서비스에서는 한 번의 사고가 곧 종료로 이어질 수 있다고 판단했다. |
| #8 창업자 간 싸움 → 결별 | 문피아 | #6 팀 몰입과 묶어 5절의 3번 대응책으로 다룬다. 3인 팀은 한 명만 빠져도 멈추므로, 서비스가 "3명"을 내세우는 것과 똑같은 약점을 우리 팀도 가지고 있다. |
| #9 지향 사용자층과 실제 유입층의 괴리 → 지속 의지 약화 | 박혜민 | 지금은 사용자가 없어 관찰할 수 없으므로 의도적으로 보류한다. 시범 모임 신청서에 직장·연차와 "왜 오고 싶은지"를 한 줄로 받아 두고, 팀 밖 신청자 20명이 모인 시점에 다시 본다. |

A cause only one person saw is not a weak signal.
It is usually the one the rest of the team is structurally unable to see.

## 5. The three we act on

Pick at most three.
More than three is a list, not a plan.

The top of the merged list is where you start looking, not an automatic answer.
If a cause only one person saw is the one that would end the project, pick it.

| # | Failure cause | Early warning signal — what we would actually observe, and when | Countermeasure — the action | Owner | By when |
|---|---|---|---|---|---|
| 1 | 아무도 돈을 내지 않았다 (#3). 사람이 모이지 않아 모임이 성사되지 않았다 (#4). | 11월 7일까지 시범 모임 참여자 9명 중 "검증된 상대와의 모임에 추가 요금을 내겠다"는 사람이 0명이다. 또는 다시 오겠다는 사람이 5명 미만이다. 또는 신청한 모임 중 3명이 모두 온 비율이 절반 미만이다. | 각자 회사·지인 네트워크에서 직장인 9명을 모아 2번 운영 규칙을 적용한 3인 시범 모임 3회를 직접 운영한다. 그중 4명을 다시 모아 비교용 4인 모임 1회를 연다. 매 모임 종료 직후 재참여 의향, 추가 요금 지불 의향(금액 포함)을 설문으로 받고, 4인 모임 뒤에는 "3인과 비교하면 어땠나"를 묻는다. 신청 대비 성사율을 기록한다. | 박혜민 | 2026-11-07 |
| 2 | 이상한 사람 한 명이 3인 테이블 전체를 망치고, 오프라인 사고로 신뢰가 무너졌다 (#2, #7) | 시범 모임 직후 익명 설문에서 "불편한 사람이 있었다"는 응답이나 노쇼가 1건이라도 나온다. | 재직 인증 방법, 장소를 공개된 카페로 한정하는 규칙, 신고·퇴출 기준, 노쇼 처리, 사고 시 연락 순서를 한 페이지 운영 규칙으로 쓴다. 참여 예정자 5명에게 먼저 보여 주고 "이 규칙이면 나가겠다 / 귀찮다" 반응을 그대로 받아 적은 뒤, 첫 시범 모임 전에 참여자 전원에게 공지하고 적용한다. | 정직한 | 2026-10-16 |
| 3 | 우리 셋 중 누구도 전력을 다하지 않았고, 싸움 끝에 갈라서거나 한 명이 빠졌다 (#6, #8) **(us)** | 한 명이 주 1회 팀 정기 미팅에 2주 연속 빠지거나, 맡은 산출물이 마감보다 3일 이상 늦어진다. 또는 결정이 나지 않은 안건이 다음 주로 두 번 넘어간다. | 컨설팅 직후 각자의 주당 투입 시간, 향후 일정, 역할, 의견이 갈릴 때의 결정 방식(그 자리에서 2:1 다수결)을 한 장으로 정리하고, 아이디어 피봇은 세 명이 모두 동의할 때만 한다. 활발한 논의를 위해 수업 외 시간에 주 1회 팀 정기 미팅(수요일 밤 10시, 온라인)을 고정하고, 매 미팅마다 지난주 산출물과 미결 안건을 확인한다. | 문피아 | 2026-10-24 |

Three tests every row must pass:

- **The signal is observable.** "We notice we are falling behind" is not a signal. "Two members have not opened the project in seven days" is.
- **The countermeasure is an action, not a posture.** "열심히 하기", "우선순위 관리", and "we will be careful" are intentions. "Call three potential users and write down what they say" is an action. If it has no verb, rewrite it.
- **The owner is one named person, and there is a date.** "The team" owns nothing. A countermeasure with no date is a countermeasure with no week: it never lands on anyone's calendar.

You do not need a 1-to-5 likelihood and impact matrix, and we would rather you did not add one.
It makes every risk look equally considered whether or not it was.

Everything in section 3 that is not in this table is a risk you are knowingly leaving alone for now.
That is a decision, and it is fine.

이번에 손대지 않기로 한 것: #1 차별점은 실행 항목으로 두지 않고, 컨설팅 후 `docs/QUESTIONS.md` "After the consultation" 1번(사례 인터뷰)에서 다룬다. #5 자금·런웨이는 론칭 이후(2027년) 문제라 학기 중에는 다루지 않는다. #9는 사용자가 생기기 전에는 관찰할 수 없어 4절에서 보류했다.

---

## Revision log

Any change of direction needs a new row here within one week.
A premortem that analyzes a product you no longer build is worse than none, because it reads as covered.

| Date | What changed and why |
|---|---|
| 2026-10-02 | Draft for consultation |
| 2026-10-11 | 컨설팅 후 팀 논의 결과 반영(#6, #8, 실행 항목 3 관련): 아이디어는 그대로 진행하며, 교수님께서 현재 진행 중인 모임과 이전 수강생들의 후속 모임 등 좋은 사례를 벤치마킹한다. 실제로 모임을 주선하고 진행하는 데 품이 많이 드는 아이디어임을 구성원 모두 인지했고, 이를 위해 개인 시간을 할애할 의사가 있음을 세 명 모두 확인했다. 활발한 논의를 위해 수업 외 시간에 주 1회 팀 정기 미팅을 하기로 약속했다.|

---

Method note: Gary Klein, "Performing a Project Premortem", Harvard Business Review, September 2007.
