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
export function create(title, participants) {
  return put({
    id: crypto.randomUUID().slice(0, 8),
    title, participants, createdAt: new Date().toISOString(),
    status: "created",   // created → transcribed → analyzed | noRecording
    rawSegments: null,   // Clova 결과(화자 라벨), 이름 연결 전
    segments: null,      // 이름이 붙은 전사본. 분석 성공 후 삭제
    metrics: null, analysis: null, analysisError: null,
    reflections: {},
  });
}
