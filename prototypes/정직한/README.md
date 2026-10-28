# 진짜 대화 리캡 — 정직한 프로토타입

스펙: [`docs/specs/정직한-recap.md`](../../docs/specs/정직한-recap.md)

## 실행

```bash
cd prototypes/정직한
npm install
cp .env.example .env   # 분석 설정(FreeLLMAPI 또는 Gemini) 채우기
npm start              # http://localhost:3000
```

**분석은 무료 LLM만 씁니다.** 설정된 것을 아래 순서로 고릅니다.

| 조건 | 엔진 |
|---|---|
| `OPENAI_BASE_URL`이 있음 | FreeLLMAPI (또는 OpenRouter, Groq 등 OpenAI 호환 주소) |
| 없고 `GEMINI_API_KEY`가 있음 | Gemini (무료) |
| 없고 `OLLAMA_MODEL`이 있음 | 로컬 오픈소스 LLM (Ollama) |
| 아무것도 없음 | 숫자 지표만 (주제·제안은 "AI 분석이 필요합니다") |

**1순위: FreeLLMAPI.** [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi)를 띄우고, 대시보드(http://localhost:3001)의 Keys 페이지에 Gemini·Groq 같은 무료 키를 등록합니다. 그다음 `.env`에 아래를 넣습니다.

```
OPENAI_BASE_URL=http://localhost:3001/v1
OPENAI_API_KEY=<Keys 페이지 위쪽의 통합 키>
OPENAI_MODEL=auto:smart
```

**간단한 방법: Gemini 키 하나.** https://aistudio.google.com/apikey 에서 **Create API key**를 누르고(카드 불필요), `.env`의 `GEMINI_API_KEY=` 뒤에 붙여 넣습니다.

키는 `.env`에만 두고, 채팅이나 다른 파일에 쓰지 않습니다. 바꾼 뒤에는 서버를 다시 켭니다.

무료 등급의 Gemini 등은 입력 내용을 Google이 서비스 개선에 쓸 수 있습니다. 팀원끼리 동의한 대화만 넣으세요. 녹음 전사는 Clova 키가 있어야 합니다.

## 사용 흐름

1. 첫 화면에서 녹음·분석 안내를 확인하고 참여자 3명으로 세션을 만든다.
2. 각자 자기 이름 링크로 들어간다.
3. 녹음(브라우저 마이크 또는 파일, Clova 키 필요) 또는 텍스트 전사본(붙여 넣기 / `.txt`)을 넣는다. 또는 "녹음 없이 진행".
   - 전사본 형식: "이름: 내용" 또는 클로바노트 형식("참석자 1 00:12" 다음 줄에 내용). 화자가 "발화자 1"이어도 된다.
   - 화자가 이름이 아니면 AI가 누가 누구인지 추정하고, 라벨이 잘못 붙은 것 같은 문장만 최대 5개 짚어 준다. 확인하거나 고친 뒤 분석한다.
   - 추정과 분석은 뒤에서 돌고(최대 3분, `LLM_TIMEOUT_MS`), 끝나면 화면이 저절로 바뀐다. 그동안 회고를 먼저 써도 된다.
4. 각자 만족도와 회고를 저장하면 결과가 보인다. 공통 결과(세션 평가, 다음 주제, 해 볼 것)와 나만 보는 결과(발화 비중, 역할, 몰입도).

## 구조

- `server.js` — API와 결과 공개 규칙(회고 전 차단, 본인 결과만)
- `lib/metrics.js` — 발화 비중·질문 수·균형 점수 (AI 없이 계산)
- `lib/clova.js` — Clova Speech 전사 + 화자 분리
- `lib/analyze.js` — 엔진 선택, FreeLLMAPI(OpenAI 호환)/Gemini/Ollama 해석 (2회 재시도)
- `lib/store.js` — `data/sessions.json` 저장 (git에 올리지 않음)
- `npm test` — 접근 제한, 녹음 삭제, 실패 경로 자동 테스트
