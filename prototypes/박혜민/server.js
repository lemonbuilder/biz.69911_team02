import "dotenv/config";
import { pathToFileURL } from "node:url";
import express from "express";
import { STAGES } from "./public/questions.js";
import { generateQuestion, hasKey } from "./lib/question.js";

// 받은 대화는 Claude에 전달만 하고, 어디에도 저장하거나 로그로 남기지 않는다.
export const app = express();
app.use(express.json({ limit: "64kb" }));
app.use(express.static("public"));

app.get("/api/status", (req, res) => res.json({ ai: hasKey() }));

app.post("/api/question", async (req, res) => {
  const { stage, transcript, avoid } = req.body ?? {};
  if (!STAGES.includes(stage) || typeof transcript !== "string") {
    return res.status(400).json({ error: "stage와 transcript가 필요합니다." });
  }
  const result = await generateQuestion({
    stage,
    transcript: transcript.slice(-4000),
    avoid: typeof avoid === "string" ? avoid.slice(0, 100) : undefined,
  });
  res.json(result);
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT) || 3100;
  app.listen(port, "localhost", () => {
    console.log(`진짜대화 Facilitator: http://localhost:${port}  (AI ${hasKey() ? "켜짐" : "꺼짐 — 고정 질문만"})`);
  });
}
