# 역할 돌리기 — 연구 근거 확인

- 날짜: 2026-10-30
- 상태: 완료
- 원칙: 1차 출처(논문 본문, DOI 랜딩, PubMed/PMC, 저자 PDF, 출판사 페이지)만 근거로 쓴다. 블로그·위키·ChatGPT 글은 단서로만 쓴다.

## 한 줄 결론

"다르게 보기는 진짜 사례로"(Nemeth)와 "되짚기로 직접 확인"(Eyal)은 근거가 있고, "3명이 최적"·"역할만 돌리면 셋이 고르게 참여"·"고정 시간 라운드"는 근거가 없으며, 후속 질문을 아예 빼는 것과 깊은 실패 화두를 처음부터 던지는 것은 근거와 어긋난다.

## GPT가 인용한 주장 검증

| # | 주장 (ChatGPT 원문 요지) | 판정 | 확인 수준 |
|---|---|---|---|
| 1 | Aron et al. (1997): 낯선 두 사람이 약 45분간 점차 개인적인 질문을 주고받으면 가벼운 대화 집단보다 상호 친밀감을 높게 보고 | **맞음** (세부 표현은 약간 느슨) | 원문/초록 확인 |
| 2 | Huang et al. (2017): 질문을 많이 하는 것보다 후속 질문이 호감·반응성 인식에 중요 | **대체로 맞음, 약간 과장** | 원문/초록 확인 |
| 3 | Egbert (1997): 4명 이상 대화가 두 개 이상 독립 대화로 분화하는 현상 연구, 4명이 2:2로 나뉠 수 있다는 가설에 근거, 항상 나뉘는 것은 아님 | **맞음** (단 "4명이 최소"는 Egbert의 실증 결과라기보다 정의상 전제) | 초록 확인 (본문 못 봄) |
| 4 | Stivers (2021): 발언 순서·시선·이야기 전개가 다인 참여에 미치는 영향 분석, 셋이 모여도 셋 다 동등하게 참여하지는 않음 | **맞음, 오히려 과소 서술** — 논문은 "대화 구조 자체가 2인 중심 참여를 선호한다"고 더 강하게 말함 | 초록 확인 (본문 못 봄) |

### 1. Aron, Melinat, Aron, Vallone & Bator (1997)

- 서지: Aron, A., Melinat, E., Aron, E. N., Vallone, R. D., & Bator, R. J. (1997). The experimental generation of interpersonal closeness: A procedure and some preliminary findings. *Personality and Social Psychology Bulletin, 23*(4), 363–377. https://doi.org/10.1177/0146167297234003
- 열어본 것: 논문 PDF 전문 (stafforini.com에 올라온 SAGE 원문 사본). DOI 랜딩은 SAGE로 리다이렉트만 확인.
- 설계: 심리학 대형 강의 수업 시간에 진행한 실험. 서로 모르는 학생을 **2인 1조(dyad)**로 짝지어 대면으로 45분(15분×3세트) 진행. 슬립을 번갈아 소리 내어 읽고 둘 다 수행. Study 1은 "점점 강도가 높아지는 자기개방 과제" vs "가벼운 대화(small talk) 과제" 무작위 배정.
- N: Study 1은 교차성별 쌍과 여성-여성 쌍으로 구성(본문 표기 n = 33, n = 17 — 쌍 수인지 인원 수인지 본문 표현이 모호해 정확한 총 쌍 수는 적지 않음). 분석 단위는 쌍.
- 결과: 친밀감 합성점수(IOS + SCI, 각자 개별 응답) 평균 4.06 vs 3.25, d = .88, F(1, 37) = 5.68, p < .05. Study 2·3에서는 "태도 불일치 없게 매칭", "상대가 나를 좋아할 거라는 기대", "가까워지기를 명시적 목표로 제시"가 친밀감에 유의한 차이를 만들지 않았음.
- 판정 메모: 주장 내용은 맞음. 다만 (a) 비교 집단도 "일반 대화"가 아니라 36개 슬립으로 구조화된 small-talk 과제였고, (b) 과제에는 질문만이 아니라 다른 친밀 행동 과제도 섞여 있으며, (c) "상호 친밀감"은 각자가 상대에 대해 개별 보고한 점수를 쌍 단위로 분석한 것.
- 우리 서비스에 대한 한계: **2인**, 대학생, 실험실(교실) 환경, 결과 변수는 "친밀감"이지 "관점 확장/발견"이 아님. 우리 목표(공동체·치료가 아닌 발견)와 결과 변수가 다름. 3인 대화에 대해서는 아무것도 말하지 않음.

### 2. Huang, Yeomans, Brooks, Minson & Gino (2017)

- 서지: Huang, K., Yeomans, M., Brooks, A. W., Minson, J., & Gino, F. (2017). It doesn't hurt to ask: Question-asking increases liking. *Journal of Personality and Social Psychology, 113*(3), 430–452. https://doi.org/10.1037/pspi0000097
- 열어본 것: 논문 PDF 전문.
- 설계: Study 1 — 실험실에서 익명 **2인 온라인 채팅** 15분, 한쪽에게 질문을 많이(9개 이상)/적게(4개 이하) 하라고 지시. 분석 199쌍(398명). Study 2A — 양쪽 모두에 조작, 온라인(MTurk 포함) 169쌍(338명). Study 2B — 제3자 평가자 612명. Study 3 — 기존 스피드데이팅 데이터(110명, 대면 4분 데이트 15–19회), 관찰 연구(상관).
- 결과: 질문을 많이 하라고 지시받은 사람이 더 호감을 얻음. 질문 유형을 코딩해 보니 **후속 질문(follow-up) 비율만** 상대 호감을 예측했고, 화제 전환(full switch) 질문은 반응성 평정이 오히려 낮았음. 많이 질문하라는 조건의 효과를 후속 질문 비율이 매개. 스피드데이팅에서도 후속 질문이 많을수록 2차 데이트 수락이 많았음(상관).
- 판정 메모: 논문의 헤드라인은 "질문을 더 하면 호감이 오른다"이고, 후속 질문은 그 효과를 설명하는 메커니즘. "단순히 질문을 많이 하는 것보다 후속 질문이 중요하다"는 요지는 Table 3 결과와 맞지만, 논문은 질문 수 자체의 효과도 함께 보고하므로 "많이 하는 것은 덜 중요"처럼 읽히면 과장.
- 저자가 직접 쓴 한계: 질문이 너무 많으면(자기개방 없이) 호감이 떨어질 수 있음(곡선 관계 가능성, 미검증). 제3자 관찰자는 오히려 질문에 답한 사람을 더 좋게 봄.
- 우리 서비스에 대한 한계: **2인**, 결과 변수는 "호감", 대부분 온라인 채팅. 3인 대면·관점 확장에 대해서는 직접 근거가 아님.

### 3. Egbert (1997)

- 서지: Egbert, M. M. (1997). Schisming: The collaborative transformation from a single conversation to multiple conversations. *Research on Language and Social Interaction, 30*(1), 1–51. https://doi.org/10.1207/s15327973rlsi3001_1
- 열어본 것: Crossref 서지 메타데이터, OpenAlex에 수록된 초록. 출판사(Taylor & Francis) 페이지는 403으로 막힘. 본문은 못 봄. 1993년 UCLA 박사논문이 바탕이라는 정보는 2차 목록에서만 봄.
- 설계: 대화분석(conversation analysis). 자연발생 다인 대화 녹화 자료. 데이터의 정확한 규모·언어·참여자 수는 초록에 없어서 **확인 못 함**.
- 초록 내용: schisming은 "**최소 4명** 참여 대화가 두 개 이상의 작은 대화로 체계적으로 갈라질 수 있다"는 관찰. 한 사람이 일부 참여자만 향한 발화(schisming-inducing turn)를 하면 그 일부가 떨어져 나가 새 대화를 만든다. 유발 계기: 음식·음료 요청 같은 서비스 상황, 화제 전환, 불평, 언어 전환. 6명 넘는 집단은 때로 3개 대화로 갈라짐.
- 4명이 최소라고 하나? → 초록은 "at least four participants"를 schisming의 조건으로 제시함. 이는 대화 하나가 최소 2명이라 2+2가 되려면 4명이 필요하다는 정의적 전제(대화분석 고전 Sacks, Schegloff & Jefferson 1974에서 유래)에 가깝고, 3명이 절대 안 갈라진다는 실험 증거가 아님. **3명은 2+2로 갈라질 수 없지만, 1명이 소외되는 2+1은 가능** — 이건 Stivers(2021) 쪽 논점.
- 판정 메모: "항상 나뉘는 것은 아니다"는 초록의 "may"와 맞음. "4명이 2:2로 나뉠 수 있다는 가설에 근거가 있다"도 맞음. 단 "3명이 최적"의 근거는 아님 — 4명 이상에서 갈라질 *수 있다*는 것뿐, 3명이 2·4명보다 낫다는 비교 데이터는 없음.

### 4. Stivers (2021)

- 서지: Stivers, T. (2021). Is conversation built for two? The partitioning of social interaction. *Research on Language and Social Interaction, 54*(1), 1–19. https://doi.org/10.1080/08351813.2020.1864158 (ChatGPT가 추정한 논문이 맞음, Crossref로 확인)
- 열어본 것: Crossref 서지, OpenAlex 초록. 오픈 액세스 아님(closed). 본문 PDF 못 찾음.
- 설계: 대화분석. 자연발생 대화 비디오 녹화, 미국 영어. 녹화 건수·참여자 수는 초록에 없어 **확인 못 함**.
- 초록 내용: 대부분의 대화는 2인이다. 턴 배분(turn allocation)과 연쇄 조직(sequence organization)이 2인 참여를 선호하기 때문에, 3인 이상이 *함께 초점을 공유하는* 참여를 유지하려면 2인 참여보다 더 많은 상호작용적 노력이 든다. 다만 **"연속적 2인 참여(serially dyadic participation)" — 2인 짝이 계속 바뀌는 것 — 와 이야기·농담 들려주기는 여러 사람의 참여를 돕는다.**
- 3인(2:1)에 대한 함의: 3인 대화는 자연스럽게 두 사람이 주고받고 한 사람이 관객이 되는 쪽으로 기운다. 그 구조를 깨려면 (a) 짝을 계속 바꾸거나 (b) 이야기를 셋 모두에게 들려주는 형식이 도움. (Stivers의 2015년 IPrA 기조강연을 요약한 RoLSI 블로그 글은 "3명은 제3자를 소외시킬 가능성, 4명 이상은 schisming"이라고 정리 — 2차 자료라 단서로만 기록.)
- 구조화된 턴 배정(역할 돌리기 같은)에 대해서? → 초록에는 **없음**. 자연 대화 연구라 인위적 역할 배정을 시험하지 않음. 우리 설계와 연결은 "추론"이지 증거가 아님: 역할 돌리기는 매 차례 '말하는 사람–받는 사람' 짝을 바꾸게 하므로 Stivers가 말한 serially dyadic 구조를 인위적으로 만드는 셈이라는 정도.
- 판정 메모: ChatGPT 서술은 틀리지 않았지만, 논문의 핵심은 "동등하지 않다"보다 강한 "구조적으로 2인 쪽으로 쏠린다"이다.

## 출처별 정리

확인 수준 표기: **원문/초록 확인** = 논문 본문 또는 PubMed·출판사·DOI 메타데이터에 실린 공식 초록을 직접 읽음 / **서지만 확인** = 논문 존재·서지 정보만 확인 / **찾지 못함**. 초록만 본 경우 표본·설계는 초록에 적힌 것까지만 적었다.

### 5. 진짜 반대 vs 악마의 변호인 — Nemeth, Brown & Rogers (2001)

- 서지: Nemeth, C. J., Brown, K., & Rogers, J. (2001). Devil's advocate versus authentic dissent: Stimulating quantity and quality. *European Journal of Social Psychology, 31*(6), 707–720. https://doi.org/10.1002/ejsp.58
- 확인 수준: **초록 확인** (OpenAlex에 수록된 출판사 초록). Wiley 페이지는 403. 본문 못 봄.
- 설계: 집단 의사결정 실험. 악마의 변호인(DA)의 실제 입장이 알려진 조건(맡은 입장과 일치/불일치)·모르는 조건 3가지와 진짜 소수 의견(authentic minority) 조건 비교. 결과 변수는 해결책의 양과 질. **참여자 수, 집단 크기, 대면 여부, 시간은 초록에 없어 확인 못 함.**
- 결과: 진짜 소수 의견이 세 가지 DA 형태 모두보다 해결책의 양·질에서 우월. 저자들은 "진정성은 역할극으로 복제하기 어렵다"고 해석. 초록에 따르면 선행 연구에서 DA는 발산적 사고보다 원래 입장을 굳히는(bolstering) 사고를 유발했음.
- 한계: 과제 집단의 문제 해결 성과이지 개인의 관점 확장·대화 경험이 아님. "비슷하게 느껴도 괜찮다"는 허용이 어떤 효과를 내는지는 다루지 않음.

### 6a. 고품질 경청 — Itzchakov, Kluger & Castro (2017)

- 서지: Itzchakov, G., Kluger, A. N., & Castro, D. R. (2017). I am aware of my inconsistencies but can tolerate them: The effect of high quality listening on speakers' attitude ambivalence. *Personality and Social Psychology Bulletin, 43*(1), 105–120. https://doi.org/10.1177/0146167216675339 (PMID 27856728; 2017년 7월 정오표(Erratum) 있음 — 내용 미확인)
- 확인 수준: **초록 확인** (PubMed).
- 설계: 실험실 실험 4개, 말하는 사람–듣는 사람 구조. 듣는 경험을 "여러 방식으로" 조작. 각 실험의 N·조작 방식은 초록에 없어 **확인 못 함**.
- 결과: 공감적·비판단적 경청을 받은 화자는 사회불안이 줄고 방어적 처리가 줄어, 자기 태도 안의 모순을 더 인식(객관적 양가성↑)하고 태도 극단성이 낮아졌으며 모순을 더 견딤.
- 주의: 여기서 "고품질 경청"은 공감·비판단 태도 전반이지 **"한 문장 바꿔 말하기"만을 시험한 것이 아님**. 되짚기의 근거로 쓸 땐 "경청 받는 경험이 덜 방어적으로 생각하게 한다" 수준까지만.

### 6b. 경청과 의견 불일치 — Itzchakov, Weinstein, Leary, Saluk & Amar (2024) *(추가 출처)*

- 서지: Itzchakov, G., Weinstein, N., Leary, M., Saluk, D., & Amar, M. (2024). Listening to understand: The role of high-quality listening on speakers' attitude depolarization during disagreements. *Journal of Personality and Social Psychology, 126*(2), 213–239. https://doi.org/10.1037/pspa0000366 (PMID 37917499)
- 확인 수준: **초록 확인** (PubMed).
- 설계: 실험 4개. Study 1은 비디오 비네트, Study 2–4는 실시간 상호작용. 경청 품질(낮음/중간/높음) 조작. N 미확인.
- 결과: **의견이 다른 상황에서** 상대가 주의·이해·선의를 담아 들어주면, 화자가 더 편안하고 연결됐다고 느끼고 덜 방어적으로 자기 태도를 돌아보며, 인식된·실제 태도 극단성이 줄었음.
- 의미: "다르게 보기"(다른 관점 제시)와 "되짚기"(이해 확인)가 같이 있는 우리 구조와 가장 가까운 결과. 단 2인 구조, 결과 변수는 태도 극단성.

### 6c. 적극적 경청의 엇갈린 결과 — Weger, Castle Bell, Minei & Robinson (2014)

- 서지: Weger, H., Castle Bell, G., Minei, E. M., & Robinson, M. C. (2014). The relative effectiveness of active listening in initial interactions. *International Journal of Listening, 28*(1), 13–31. https://doi.org/10.1080/10904018.2013.813234
- 확인 수준: **초록 확인** (OpenAlex에 수록된 출판사 초록). 출판사 PDF는 403, 제3자 사본은 열지 않음.
- 설계: 참여자 115명, 훈련된 공모자(confederate) 10명이 ① 적극적 경청 ② 조언 ③ 단순 맞장구 중 하나로 반응. 첫 만남 상황. (적극적 경청 = "바꿔 말하기 + 필요 시 더 말해 달라고 묻기", 참여자 = 대학생이라는 설명은 미네소타대 2차 요약에서만 봄 → **원문 미확인**.)
- 결과: 적극적 경청을 받은 쪽이 조언·맞장구보다 **"이해받았다"는 느낌은 높았음**. 대화 만족도·상대의 사회적 매력은 적극적 경청과 조언이 맞장구보다 높았으나 **효과 크기가 작았고, 적극적 경청과 조언 사이엔 차이가 없었음**.
- 의미: 바꿔 말하기는 "이해받음"에는 도움이 되지만 만족도·호감에서 조언보다 낫다는 근거는 없음. 되짚기의 효과를 크게 홍보하면 과장.

### 7. 관점 얻기 vs 관점 짐작하기 — Eyal, Steffel & Epley (2018)

- 서지: Eyal, T., Steffel, M., & Epley, N. (2018). Perspective mistaking: Accurately understanding the mind of another requires getting perspective, not taking perspective. *Journal of Personality and Social Psychology, 114*(4), 547–571. https://doi.org/10.1037/pspa0000115 (PMID 29620401)
- 확인 수준: **초록 확인** (PubMed).
- 설계: 실험 25개. 표정·몸짓으로 감정 맞히기, 가짜/진짜 미소, 거짓말 판별, 배우자 선호 예측 등 정확도 과제. 개별 N 미확인.
- 결과: "상대 입장이 되어 보라"는 지시(perspective taking)는 정확도를 일관되게 높이지 못했고, 전체적으로는 오히려 낮췄으며 가끔 자신감만 높였음. 마지막 실험에서 **대화로 직접 물어서 관점을 얻는 것(perspective getting)은 정확도를 높였음**.
- 의미: 되짚기의 "내가 맞게 이해했어?"(확인 요청)는 짐작이 아닌 '얻기'에 해당 → 지지. 다르게 보기를 "상상한 반대 입장"이 아닌 "실제로 떠올린 사례"로 정한 것과도 결이 맞음(추론).
- 한계: 대화 그룹 연구가 아님. 결과는 타인 마음 읽기의 정확도.

### 8. 낯선 사람과의 깊은 대화 — Kardas, Kumar & Epley (2022)

- 서지: Kardas, M., Kumar, A., & Epley, N. (2022). Overly shallow?: Miscalibrated expectations create a barrier to deeper conversation. *Journal of Personality and Social Psychology, 122*(3), 367–398. https://doi.org/10.1037/pspa0000281 (PMID 34591541)
- 확인 수준: **초록 확인** (PubMed) + **보충자료(Supporting Information) 일부 확인**. 본문은 못 봄.
- 설계: 실험 1a–7b. 대부분 낯선 2인. 보충자료 기준 예: Exp 1b — 금융회사 직원 50쌍(100명) 대면, Exp 1c — 석사 오리엔테이션에서 **2–3인 그룹** 56개(제외 후 137명)를 Zoom 소회의실로 진행(코로나로 인해, 소회의실 수 제약 때문에 3인 포함).
- 결과: 낯선 사람과의 대화는 예상보다 덜 어색하고 더 연결감·행복감을 줬음. 특히 깊은 대화의 어색함을 과대평가. 깊은 대화와 얕은 대화를 둘 다 해본 뒤엔 깊은 대화 상대에게 더 연결감을 느낌(Exp 6a–b). 원인은 "상대가 내 이야기에 덜 관심 있을 것"이라는 과소추정. 기대를 보정해 주면 더 깊은 주제를 고름(Exp 7a–b).
- 의미: 깊은 화두 자체에 대한 지지. 그리고 "생각보다 덜 어색하고, 상대는 생각보다 관심 있다"는 안내가 더 깊은 대화를 유도할 수 있다는 근거(7a–b).
- 한계: 결과 변수는 연결감·행복감이지 관점 확장이 아님. 질문은 연구자가 준 것(예: 남 앞에서 울었던 때). 3인 대면 비교는 없음(1c는 Zoom, 2–3인 혼합, 그룹 크기 비교 분석 아님).

### 9. 그룹 크기와 자기개방 — Cooney, Mastroianni, Abi-Esber & Brooks (2020)

- 서지: Cooney, G., Mastroianni, A. M., Abi-Esber, N., & Brooks, A. W. (2020). The many minds problem: Disclosure in dyadic versus group conversation. *Current Opinion in Psychology, 31*, 22–27. https://doi.org/10.1016/j.copsyc.2019.06.032 (PMID 31404835) — 참고: DOI는 `.06.032`.
- 확인 수준: **초록 확인** (PubMed).
- 유형: **리뷰(이론 논문)이지 실험이 아님.**
- 내용: 대화 인원이 늘면 화자·청자 모두에게 체계적 어려움("many minds problem")이 생기며, 그룹 크기가 얼마나·무엇을 개방하는지, 그에 대한 느낌에 영향을 줄 "가능성이 크다(likely)"고 리뷰.
- 의미: 3명이 2명보다 개방에 불리할 수 있다는 방향의 논점. "3명이 최적"의 근거로는 쓸 수 없음.

### 10a. 실패에서 배우기 — Eskreis-Winkler & Fishbach (2019)

- 서지: Eskreis-Winkler, L., & Fishbach, A. (2019). Not learning from failure—the greatest failure of all. *Psychological Science, 30*(12), 1733–1744. https://doi.org/10.1177/0956797619881133 (PMID 31702452)
- 확인 수준: **초록 확인** (PubMed).
- 설계: 연구 5개, 총 N = 1,674. 이지선다 문제 후 성공/실패 피드백 제공(둘 다 정답을 알려줌), 이후 시험.
- 결과: **자기 실패** 피드백에서는 성공 피드백보다 덜 배움(자아 위협 → 주의를 끔). **타인의 실패**에서는 타인의 성공에서만큼 배움.
- 의미: "실패"를 화두로 삼아 본인 실패를 꺼내게 하면 방어가 생길 수 있음. 남의 실패 이야기(들은 이야기)는 학습을 막지 않음 → g 지지, f에 주의.
- 한계: 대화 연구가 아님. 퀴즈형 학습 과제.

### 10b. 실패를 드러내기 — Brooks, Huang, Abi-Esber, Buell, Huang & Hall (2019)

- 서지: Brooks, A. W., Huang, K., Abi-Esber, N., Buell, R. W., Huang, L., & Hall, B. (2019). Mitigating malicious envy: Why successful individuals should reveal their failures. *Journal of Experimental Psychology: General, 148*(4), 667–687. https://doi.org/10.1037/xge0000538 (PMID 30829524)
- 확인 수준: **초록 확인** (PubMed).
- 설계: 온라인 실험 3개 + 창업 피칭 대회 현장 실험 1개.
- 결과: 사람들은 실패를 드러내길 꺼림. 그러나 성공과 함께 실패를 드러내면 관찰자의 악의적 질투가 줄었음(현장 실험은 "시사적(suggestive)" 증거).
- 의미: 실패를 말하는 것에 대한 **꺼림 자체가 실증됨** → 낯선 사람에게 첫 화두로 던질 때 장벽이 있음. 결과 변수가 질투라 우리 목표와는 거리가 있음.

### 11a. 대화 그룹 크기 — Dunbar, Duncan & Nettle (1995)

- 서지: Dunbar, R. I. M., Duncan, N. D. C., & Nettle, D. (1995). Size and structure of freely forming conversational groups. *Human Nature, 6*(1), 67–78. https://doi.org/10.1007/BF02734136 (PMID 24202831) — 참고: DOI는 `BF02734136`.
- 확인 수준: **초록 확인** (PubMed).
- 설계: 여러 장면에서 자연 형성 대화 그룹 관찰. 표본 크기 미확인.
- 결과: 자발적 대화에서 함께 대화할 수 있는 인원의 **상한이 약 4명**. 말하기·듣기 메커니즘 때문으로 보임.
- 의미: 3명은 한 대화로 유지 가능한 범위 안. 그러나 2·3·4 중 3이 최적이라는 말은 없음.

### 11b. 그룹 크기와 대화 방식 — Fay, Garrod & Carletta (2000)

- 서지: Fay, N., Garrod, S., & Carletta, J. (2000). Group discussion as interactive dialogue or as serial monologue: The influence of group size. *Psychological Science, 11*(6), 481–486. https://doi.org/10.1111/1467-9280.00292 (PMID 11202493)
- 확인 수준: **초록 확인** (PubMed). 에든버러대 저장소 PDF는 403.
- 설계: **5명 vs 10명** 그룹 토론. 과제·N 미확인.
- 결과: 5명 그룹은 대화형 — 직접 주고받은 사람에게 가장 영향받음. 10명 그룹은 연속 독백형 — 지배적 화자에게 가장 영향받음.
- 의미: 3명은 시험 대상이 아님. 작은 그룹일수록 "주고받기"가 영향 경로라는 방향성만 참고.

### 12. 발언 균등성 — Woolley, Chabris, Pentland, Hashmi & Malone (2010)

- 서지: Woolley, A. W., Chabris, C. F., Pentland, A., Hashmi, N., & Malone, T. W. (2010). Evidence for a collective intelligence factor in the performance of human groups. *Science, 330*(6004), 686–688. https://doi.org/10.1126/science.1193147 (PMID 20929725)
- 확인 수준: **초록 확인** (PubMed). PubMed에 2017년 *J Appl Psychol* 논평(doi:10.1037/apl0000176)이 연결돼 있음 — 내용 미확인.
- 설계: 연구 2개, 699명, **2–5인 과제 집단**.
- 결과: 집단 과제 수행을 설명하는 "c 요인"이 있으며, 이는 구성원 평균 지능보다 사회적 민감성, **대화 순서(turn-taking) 분배의 균등성**, 여성 비율과 상관.
- 의미/한계: **과제 수행 집단**이고 상관관계. "발언이 고르게 돌면 대화가 좋아진다"의 근거로 쓰면 과장. 발언 균등을 강제했을 때의 효과를 시험한 게 아님.

### 13. 3인 역할 순환의 실제 결과 — Galantucci, Theisen, Gutierrez, Kroos & Rhodes (2012) *(추가 출처, 가장 가까운 '3인+역할 순환' 실험)*

- 서지: Galantucci, B., Theisen, C. A., Gutierrez, E., Kroos, C. H., & Rhodes, T. (2012). The diffusion of novel signs beyond the dyad. *Language Sciences, 34*(5), 583–590. https://doi.org/10.1016/j.langsci.2012.03.013 (PMC3375914)
- 확인 수준: **원문 확인** (PMC 전문).
- 설계: 예일대 모집, **3인조 10개(30명)**. 서로 보거나 들을 수 없는 매개 환경(컴퓨터+스타일러스)에서 새 기호를 만들어 소통하는 게임. 매번 2명이 플레이, 1명은 관찰자, **2시행마다 짝이 바뀌어 모두가 같은 만큼 플레이·관찰**. 점수는 3인 공동.
- 결과: 소통 성공이 세 짝 모두에 고르게 나뉜 3인조는 소수(10개 중 4개). 다섯 3인조에서는 **두 사람끼리만 통하고 둘 다 세 번째 사람과는 통하지 못함**. 관찰만으로는 상대의 소통 체계를 쉽게 배우지 못함.
- 의미: 역할을 공평하게 돌려도 **2+1 구조가 자동으로 깨지지 않는다**는 실험적 신호. 저자들은 공동 점수 구조와 역할 순환이 일부 참여자의 비협조를 키웠을 수 있다고 해석.
- 한계: 탐색적 연구, 비언어 기호 게임, 대면 대화 아님, 경쟁적 점수 구조. 우리 서비스에 직접 일반화 불가 — "역할 돌리기만으로 셋이 고르게 통한다고 가정하지 말라"는 경고로만 사용.

### 14. 번갈아 하는 자기개방 — Sprecher, Treger, Wondra, Hilaire & Wallpe (2013)

- 서지: Sprecher, S., Treger, S., Wondra, J. D., Hilaire, N., & Wallpe, K. (2013). Taking turns: Reciprocal self-disclosure promotes liking in initial interactions. *Journal of Experimental Social Psychology, 49*(5), 860–866. https://doi.org/10.1016/j.jesp.2013.03.017
- 확인 수준: **서지만 확인** (Crossref). 초록은 출판사 403, 다른 메타데이터에 없음. Huang et al.(2017) 본문이 "번갈아 하는 자기개방이 호감을 높인다"고 인용한 것만 확인.
- 의미: 역할 돌리기(b)와 관련 있어 보이지만 **원문 미확인이라 근거로 쓰지 않음**.

## 설계 결정별 근거 표

| 결정 | 판정 | 출처 | 이유 (한 줄) |
|---|---|---|---|
| a. 3인 그룹 (2·4인 대비) | **섞임 / "최적" 근거 없음** | Dunbar 1995, Egbert 1997, Stivers 2021, Cooney 2020, Galantucci 2012 | 3명은 한 대화로 유지 가능하고(상한 ~4) 2:2 분열(4명 이상)은 피하지만, 대화 구조가 2인 쪽으로 쏠려 1명이 관객이 되기 쉽고, 인원이 늘수록 개방이 어려워진다는 리뷰도 있음. 2·3·4인을 관점 확장 결과로 비교한 연구는 못 찾음. |
| b. 역할을 돌려 모두가 각 역할을 맡음 | **간접 지지 + 경고** | Stivers 2021, Woolley 2010, Galantucci 2012 | 짝이 계속 바뀌는 "연속적 2인 참여"는 다인 참여를 돕고(자연 대화 관찰), 발언 균등은 과제 집단 성과와 상관. 그러나 역할을 공평히 돌린 3인 게임에서도 2+1 구조가 자주 남음. 대화 역할 순환 자체를 시험한 연구는 못 찾음. |
| c. 다르게 보기 = 진짜 사례, 악마의 변호인 아님 | **지지** | Nemeth et al. 2001 (보조: Eyal et al. 2018, Itzchakov et al. 2024) | 진짜 소수 의견이 세 형태의 악마의 변호인보다 해결책의 양·질에서 우월. 단 과제 집단 결과. "비슷하게 느껴도 됨" 허용의 효과는 미검증. |
| d. 되짚기 = 바꿔 말하기 + 확인 질문 | **섞임 (확인 부분은 지지)** | Weger et al. 2014, Itzchakov et al. 2017·2024, Eyal et al. 2018 | 이해받은 느낌은 높이지만 만족·호감은 조언과 차이 없음(Weger). 경청 받으면 덜 방어적이고 덜 극단적(Itzchakov). "맞게 이해했어?"로 직접 묻는 것은 짐작보다 정확(Eyal). |
| e. 별도 "후속 질문" 역할 없음 | **반대 (Huang이 후속 질문을 지지)** | Huang et al. 2017 | 후속 질문만이 상대 호감을 예측했고 반응성 인식의 핵심. 단 결과는 2인·주로 채팅·호감. 별도 역할까진 아니어도 어딘가에 후속 질문 자리가 있어야 근거와 맞음. |
| f. 처음에 깊은 화두 하나(예: 실패) 던지기 | **섞임** | Kardas et al. 2022, Aron et al. 1997, Eskreis-Winkler & Fishbach 2019, Brooks et al. 2019 | 깊은 대화는 예상보다 덜 어색하고 연결감이 큼(지지). 그러나 Aron 절차는 깊이를 45분에 걸쳐 *점진적으로* 올렸고, 자기 실패는 자아 위협으로 주의를 끄게 하며, 사람들은 실패 공개를 꺼림(시작부터 던지는 방식엔 반대). |
| g. 들은 이야기·가벼운 경험 허용 (고백 강요 X) | **간접 지지** | Eskreis-Winkler & Fishbach 2019, Stivers 2021 | 타인의 실패에서는 성공에서만큼 배움. 이야기 들려주기는 다인 참여를 도움. 단 Kardas는 사람들이 깊이를 과소선택한다고 하므로 "가볍게만" 머무르게 두면 안 됨. |
| h. 사람이 정하는 차례 vs 고정 ~9분 라운드 | **근거 없음** | (Aron 1997은 15분×3 고정 세트를 썼지만 비교 안 함) | 자율 페이스와 고정 시간을 비교한 연구를 못 찾음. ChatGPT의 "역할당 ~9분"·"60분 실패 프로토콜"은 출처 없음. |

## 근거가 바꾸라고 하는 것

1. **"3명이 최적"이라고 말하지 말 것.** 쓸 수 있는 말: "4명부터는 대화가 둘로 갈라질 수 있고(Egbert), 3명은 한 사람이 관객이 되기 쉽다(Stivers). 역할 돌리기는 이 2+1 쏠림을 줄이려는 장치다 — 효과는 아직 검증 안 됨."
2. **되짚기에 후속 질문 한 개를 붙이는 것을 고려.** 예: "내가 맞게 이해했어?" 다음에 "그때 어땠는지 하나만 더 물어봐도 돼?" 별도 역할은 만들지 않아도, Huang(2017)을 근거로 대면 서비스에서 후속 질문이 사라지는 건 근거와 어긋남.
3. **화두를 넣는다면 처음부터 깊게 던지지 말고 단계적으로.** Aron 절차처럼 가벼운 것→깊은 것으로. "실패"를 고른다면 "내 실패 고백" 대신 "들은 실패 이야기, 실패라고 생각했다가 바뀐 것"처럼 자아 위협을 낮추는 문구로(Eskreis-Winkler & Fishbach, Brooks).
4. **시작 화면에 기대 보정 문구 하나.** "처음 만난 사람과의 깊은 대화는 생각보다 덜 어색하고, 상대는 생각보다 내 이야기에 관심이 있다는 연구가 있어요" — Kardas(2022) Exp 7a–b가 보정된 기대가 더 깊은 주제 선택으로 이어짐을 보임.
5. **다르게 보기 문구("악마의 변호인 아님")는 유지.** Nemeth(2001)가 가장 직접적인 근거.
6. **되짚기 효과를 과장하지 말 것.** "이해받는 느낌"까지는 근거가 있지만 "더 좋아하게 된다/만족한다"는 Weger(2014)에서 조언과 차이 없음.
7. **역할만 돌리면 셋이 고르게 참여한다고 가정하지 말 것.** Galantucci(2012)의 3인 순환 게임에서도 두 사람만 통하는 경우가 많았음 → 테스트 때 "누가 누구에게 말을 거는지"를 관찰 항목에 넣을 것(녹음 없이 메모로).

## 확인하지 못한 것

- **Egbert (1997)·Stivers (2021) 본문**: 둘 다 유료. 초록만 봄. 데이터 규모(녹화 건수·참여자 수·언어 — Stivers는 미국 영어만 확인), Stivers가 3인 대화를 구체적으로 어떻게 분석했는지 미확인.
- **Nemeth et al. (2001)**: 참여자 수, 집단 크기, 공모자 사용 여부, 과제 내용 미확인(초록만).
- **Weger et al. (2014)**: 적극적 경청의 구체적 조작(바꿔 말하기+질문)과 참여자 특성은 2차 요약에서만 봄. 원문 PDF 접근 시도는 막힘(출판사 403, 제3자 사본은 열지 않음).
- **Itzchakov et al. (2017, 2024)**: 각 실험의 N과 경청 조작 방식 미확인(초록만). 2017년 논문 정오표 내용 미확인.
- **Fay et al. (2000)**: 과제·N 미확인(저장소 PDF 403).
- **Kardas et al. (2022)**: 본문은 못 보고 초록+보충자료만 봄.
- **Aron et al. (1997) Study 1의 정확한 쌍 수**: 본문 표기(n = 33, n = 17)가 쌍인지 사람인지 모호.
- **Sprecher et al. (2013)**: 초록조차 확인 못 함 → 근거에서 제외.
- **Woolley et al. (2010)에 대한 2017년 논평** 내용 미확인.
- **못 찾은 것**: (1) 대면 3인 대화에서 말하기/되짚기/다르게 보기 같은 **대화 역할을 순환**시킨 실험, (2) 2·3·4인을 **관점 확장·새 생각 발견** 결과로 비교한 실험, (3) 자율 페이스 vs 고정 시간 라운드 비교. 교육용 "speaker–listener–observer 3인 연습" 자료는 많았지만 통제 실험이 아니라 제외.
- ChatGPT가 제안한 Storyteller/Explorer/Reflector 역할, 역할당 ~9분, 60분 실패 프로토콜: **출처를 찾지 못함**(제안이지 연구 결과가 아님).
