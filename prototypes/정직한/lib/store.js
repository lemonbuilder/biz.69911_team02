// 프로토타입용 저장소: data/sessions.json 파일 하나.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DIR = process.env.DATA_DIR || path.resolve("data");
const FILE = path.join(DIR, "sessions.json");
fs.mkdirSync(DIR, { recursive: true });

const load = () => (fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : {});
const save = all => fs.writeFileSync(FILE, JSON.stringify(all, null, 2));

export const dataDir = DIR;
export function get(id) { return load()[id]; }
export function all() { return Object.values(load()); }
export function put(s) { const a = load(); a[s.id] = s; save(a); return s; }
// 최신 상태를 다시 읽어 고친다. 뒤에서 도는 작업이 그사이 저장된 회고를 덮어쓰지 않게 한다.
export function update(id, fn) { const s = get(id); if (!s) return null; fn(s); return put(s); }
export function create(title, participants) {
  return put({
    id: crypto.randomUUID().slice(0, 8),
    title, participants, createdAt: new Date().toISOString(),
    status: "created",   // created → transcribed → analyzed | noRecording
    rawSegments: null,   // 화자 라벨이 붙은 전사본, 이름 연결 전
    guess: null, guessError: null, // AI 발화자 추정
    busy: null,          // 뒤에서 도는 작업: identify | analyze
    segments: null,      // 이름이 붙은 전사본. 분석 성공 후 삭제
    metrics: null, analysis: null, analysisError: null,
    reflections: {},
  });
}
