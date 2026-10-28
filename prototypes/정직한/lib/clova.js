// Clova Speech(장문 인식)로 전사 + 화자 분리. 세 사람으로 나누도록 요청한다.
import fs from "node:fs";

export async function transcribe(filePath, speakerCount = 3) {
  const url = process.env.CLOVA_INVOKE_URL;
  const key = process.env.CLOVA_SECRET_KEY;
  if (!url || !key) throw new Error("CLOVA_INVOKE_URL / CLOVA_SECRET_KEY가 .env에 없습니다.");
  const form = new FormData();
  form.append("media", new Blob([fs.readFileSync(filePath)]), "audio.webm");
  form.append("params", JSON.stringify({
    language: "ko-KR",
    completion: "sync",
    diarization: { enable: true, speakerCountMin: speakerCount, speakerCountMax: speakerCount },
  }));
  const res = await fetch(`${url.replace(/\/$/, "")}/recognizer/upload`, {
    method: "POST",
    headers: { "X-CLOVASPEECH-API-KEY": key },
    body: form,
  });
  if (!res.ok) throw new Error(`Clova Speech 오류 ${res.status}: ${await res.text()}`);
  const data = await res.json();
  // 화자 라벨("1","2","3")은 아직 누구인지 모른다. 참여자가 직접 연결한다.
  return (data.segments || []).map(s => ({
    label: String(s.speaker?.label ?? s.speaker?.name ?? "?"),
    text: s.text,
    start: s.start,
    end: s.end,
  }));
}
