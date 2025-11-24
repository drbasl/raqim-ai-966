import type { NextApiRequest, NextApiResponse } from "next";
import { invokeLLM } from "./_core/llm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing messages" });
    return;
  }
  try {
    const response = await invokeLLM({ messages });
    const reply = response.choices[0]?.message?.content || "";
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "LLM error" });
  }
}
