# 진짜 대화 리캡 — 정직한 프로토타입

스펙: [`docs/specs/정직한-recap.md`](../../docs/specs/정직한-recap.md)

## 실행

```bash
cd prototypes/정직한
npm install
cp .env.example .env   # ANTHROPIC_API_KEY, CLOVA_INVOKE_URL, CLOVA_SECRET_KEY 채우기
npm start              # http://localhost:3000
```

**키가 없어도 됩니다.** 텍스트 전사본(붙여 넣기 또는 `.txt` 업로드)을 넣으면 분석까지 됩니다. 분석 엔진은 자동으로 고릅니다.

| 조건 | 엔진 |
|---|---|
| `ANTHROPIC_API_KEY`가 있음 | Claude |
| 없고 `OLLAMA_MODEL`이 있음 | 로컬 오픈소스 LLM (Ollama) |
| 둘 다 없음 | 규칙 기반 (AI 없음) |

로컬 LLM을 쓰려면 [Ollama](https://ollama.com)를 설치하고 `ollama pull qwen2.5:7b`를 한 뒤, `.env`에 `OLLAMA_MODEL=qwen2.5:7b`를 넣습니다. 녹음 전사는 Clova 키가 있어야 합니다.

## 사용 흐름

1. 첫 화면에서 녹음·분석 안내를 확인하고 참여자 3명으로 세션을 만든다.
2. 각자 자기 이름 링크로 들어간다.
3. 녹음(브라우저 마이크 또는 파일) → Clova가 전사·화자 분리 → 화자 1/2/3을 이름과 연결.
   또는 "이름: 내용" 텍스트 전사본을 붙여 넣거나 `.txt`로 올린다. 또는 "녹음 없이 진행".
4. 각자 만족도와 회고를 저장하면 결과가 보인다. 공통 결과(세션 평가, 다음 주제, 해 볼 것)와 나만 보는 결과(발화 비중, 역할, 몰입도).

## 구조

- `server.js` — API와 결과 공개 규칙(회고 전 차단, 본인 결과만)
- `lib/metrics.js` — 발화 비중·질문 수·균형 점수 (AI 없이 계산)
- `lib/clova.js` — Clova Speech 전사 + 화자 분리
- `lib/analyze.js` — 엔진 선택, Claude/Ollama 해석 (2회 재시도)
- `lib/rules.js` — 규칙 기반 분석 (AI 없음)
- `lib/store.js` — `data/sessions.json` 저장 (git에 올리지 않음)
- `npm test` — 접근 제한, 녹음 삭제, 실패 경로 자동 테스트
