import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const apiUrl = process.env.LLM_API_URL || "http://100.121.65.10:20128/v1";
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || "dynamic";

  if (!apiKey) {
    return res.status(500).json({
      error: "LLM_API_KEY is not configured on the server environment.",
    });
  }

  try {
    // Read the agent's knowledge base markdown file
    const knowledgePath = path.join(process.cwd(), "data", "knowledge-base.md");
    let knowledgeContent = "";
    if (fs.existsSync(knowledgePath)) {
      knowledgeContent = fs.readFileSync(knowledgePath, "utf-8");
    }

    const systemPrompt = `You are the official AI Assistant representing Marzuki (also known as Ukay).

CRITICAL INSTRUCTIONS & GUARDRAILS:
1. You MUST answer ONLY using the provided Knowledge Base below. Do NOT hallucinate other people or external open-source projects named Marzuki.
2. Do NOT use any emojis in your response. Keep answers clean, concise, and professional.
3. If the user's question is about anything outside of Marzuki's experience, portfolio, skills, resume, background, or contact details (e.g. general trivia, solving general coding homework, math, politics, unrelated topics), politely decline and state that you are only programmed to answer questions about Marzuki and his engineering work.
4. Be professional, friendly, polite, concise, and structured.
5. Reply in the same language as the user's prompt (Indonesian or English).
6. If the user asks for CV or resume, provide the link: /Marzuki_Front-End_Developer_Resume_ATS.pdf.

--- START KNOWLEDGE BASE ---
${knowledgeContent}
--- END KNOWLEDGE BASE ---
`;

    // Construct OpenAI-compatible streaming payload
    const payload = {
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-8), // Keep recent conversation context
      ],
      stream: true,
      temperature: 0.2,
      max_tokens: 800,
    };

    // Normalize endpoint if necessary
    let requestUrl = apiUrl;
    if (!requestUrl.endsWith("/chat/completions") && !requestUrl.includes("?")) {
      requestUrl = requestUrl.replace(/\/+$/, "") + "/chat/completions";
    }

    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `LLM API Error (${response.status}): ${errText.slice(0, 150)}`,
      });
    }

    // Set Server-Sent Events (SSE) headers for real-time client streaming
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    }

    res.end();
  } catch (error) {
    console.error("AI Chat Stream Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: error.message || "An internal error occurred while processing the chat.",
      });
    } else {
      res.end();
    }
  }
}
