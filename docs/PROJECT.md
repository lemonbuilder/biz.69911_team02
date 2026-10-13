# PROJECT.md

Team: Team 02
Members: 박혜민, 문피아, 정직한
Last updated: 2026-10-11

One page.
Draft it together before anyone writes a premortem, and come back to it after the merge.

You are not committing to this.
You are making it concrete enough to argue about, and concrete enough that a premortem about it means something.
A project idea you cannot imagine failing in a specific way is not yet an idea.

Later in the term you will run a Why Tree on this, and the Why Tree may well move it.
That is expected, and it is not wasted work.

Write in Korean or English.
Keep the headings exactly as they are.

---

## What we think we are building

AI가 업무 메일을 쓰고, 고민 상담을 받아 주고, 대화 상대까지 대신하는 시대에 사람과 사람이 마주 앉아 나누는 "진짜 대화"를 파는 오프라인 모임 커뮤니티 서비스.
모든 모임의 단위는 **3명**이다. 한 사람이 3인 모임을 열고 나머지 두 자리를 모집하거나, 열려 있는 3인 모임의 빈자리에 들어가 참여한다. 1:1은 소개팅이나 면접처럼 부담스럽고, 다인원 모임은 대화가 흩어지거나 몇 사람에게 쏠린다. 3명은 모두가 말하게 되고, 대화가 끊겨도 제3자가 이어 주는 가장 작은 단위라는 것이 우리의 가설이다.
온라인과 AI는 대화 바깥에서만 쓴다. 어느 지역에서 언제 만날지 조율하고, 신청서를 바탕으로 사전 필터링을 하고, 세 사람을 조합하고, 첫 대화 주제를 준비하는 데까지다. 테이블 위의 대화는 사람에게만 맡긴다.
세션이 끝날 때마다 참여자가 그 세션이 좋았는지 평가한다. 좋은 평가를 받은 세션에 자주 참여한 사람은 듣는 쪽이든 말하는 쪽이든 "검증된 대화 상대"가 되고, 이들과 함께하는 모임에는 추가 요금을 받는다.

## Who it is for

- **Person:** 회사와 집만 오가는 입사 3~7년 차 직장인. 하루 대부분을 메신저·화상회의·생성형 AI와 "대화"하며 보내지만, 회사 밖에서 이해관계 없이 깊게 이야기할 사람은 점점 줄었다고 느끼는 사람.
- **Situation:** 퇴근 후 고민이나 생각을 털어놓고 싶은데 결국 ChatGPT 창을 열고 있는 자신을 발견하는 순간. 또는 수십 명 규모의 모임에 나갔다가 자기소개만 돌고 아무와도 제대로 이야기하지 못한 채 돌아오는 순간.
- **What they do today instead:** 독서모임·취미 소모임이나 트레바리·문토 같은 유료 모임에 가입해 보지만 인원이 많아 대화가 얕다. 결국 오래된 친구 두세 명과 가끔 술자리를 잡거나, AI 챗봇·익명 커뮤니티에 털어놓고 만다.

## How we know this problem is real

아직 팀 밖의 사람과는 이야기해 보지 않았다.
현재 근거는 직장에 다니며 PMBA 과정을 병행하는 팀원 세 명의 경험뿐이다. "3명이 대화에 가장 집중하기 좋은 인원"이라는 생각도 아직 검증하지 않은 가설이다.
11월 7일까지 직장인 9명을 모아 3인 시범 모임 3회를 직접 열고, 그중 4명을 다시 모아 4인 모임 1회를 열어 같은 사람이 3인과 4인을 모두 겪어 보게 할 계획이다.

## Why us

팀원 세 명 모두 이 서비스가 겨냥하는 직장인이고, 새로운 사람을 만나는 일이 얼마나 어려운지 직접 겪고 있다. 각자의 지인 및 동료를 중심으로 초기 참여자 풀에도 바로 닿을 수 있다.
우리 팀 자체가 3인 구성이다. 3명이 모였을 때 무엇이 잘 되고 무엇이 깨지는지(2:1로 갈리는 순간, 한 명이 빠지는 순간)를 학기 내내 직접 겪는다.
따라서 "사람끼리의 대화"는 AI가 앞에서 대신하지 않게 하고, 사람 손으로는 확장되지 않는 3인 조합과 사전 필터링을 AI가 뒤에서 맡는다는 설계 기준을 우리 경험에서 바로 세울 수 있다.

## What would make us drop this idea

직장인 9명(3개 세션)으로 시범 모임을 진행했을 때, 다시 참여하겠다는 사람이 5명 미만이거나 "검증된 대화 상대"와의 모임에 추가 요금을 내겠다는 사람이 한 명도 없으면 이 아이디어를 접거나 크게 수정한다.
3인과 4인 모임을 모두 겪은 4명 중 3명 이상이 "차이가 없었다"고 답하면, 3인 구조라는 핵심을 다시 본다.

The thing you are least sure about does not go here.
It goes at the top of `docs/QUESTIONS.md`, because it is the best use of the 30 minutes.

---

## Revision log

| Date | What changed and why |
|---|---|
| 2026-10-02 | Draft for consultation |
| 2026-10-11 | Revised after the 2026-10-03 consultation: kept the idea, added benchmarking. |
