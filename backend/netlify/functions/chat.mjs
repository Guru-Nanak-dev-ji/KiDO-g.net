const ALLOWED_ORIGIN = "https://www.kido-g.net";

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
  "Vary": "Origin",
  "X-Content-Type-Options": "nosniff"
};

function reply(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

export const config = {
  path: "/api/chat",
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ["ip"]
  }
};

export default async function handler(request) {
  const origin = request.headers.get("origin");

  if (origin !== ALLOWED_ORIGIN) {
    return reply(403, { error: "Origin not allowed" });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== "POST") {
    return reply(405, { error: "Method not allowed" });
  }

  let message;

  try {
    const raw = await request.text();

    if (Buffer.byteLength(raw, "utf8") > 4096) {
      return reply(413, { error: "Request too large" });
    }

    const payload = JSON.parse(raw);
    message = payload.message;
    var upscMode = payload.upsc === true;
    var socialMode = payload.social === true;
    var newsMode = payload.news === true;
    var searchMode = payload.search === true || newsMode || socialMode || upscMode;
  } catch {
    return reply(400, { error: "Invalid JSON" });
  }

  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 2000
  ) {
    return reply(400, { error: "Invalid message" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return reply(503, { error: "AI service not configured" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions:
          "You are BRAHMA of KIDO ONE. Reply in Hindi. Provide text advice only. Never execute commands, publish, or approve actions. Human approval is required.",
        input: upscMode ? "You are a UPSC Civil Services Examination study tutor for India. Explain in Hindi unless the user requests English. Support Prelims GS and CSAT, Mains GS I-IV, Essay, optional-subject guidance, current affairs, answer writing, MCQs with solutions, study plans and revision. For official syllabus, dates, eligibility or notices use the UPSC official website https://upsc.gov.in and cite reliable current sources; never invent dates, cutoffs or exam rules. Distinguish practice questions from actual UPSC past questions. User request: "+message : socialMode ? "Find publicly available social media accounts matching the supplied name or organization on Facebook, Instagram, YouTube, X, LinkedIn, TikTok and official websites. Provide direct profile URLs with source evidence. Distinguish official, likely, and unverified accounts; do not claim verification without evidence. Do not search for private contact details or hidden profiles. User query: "+message : newsMode ? "Find recent, reliably sourced news relevant to the user query. Include publication dates when available, distinguish reporting dates from event dates, avoid inventing headlines, and cite sources. User query: "+message : message,
        ...(searchMode ? { tools: [{ type: "web_search" }], tool_choice: "auto" } : {}),
        max_output_tokens: (newsMode || socialMode || upscMode) ? 1200 : (searchMode ? 800 : 150)
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (!response.ok) {
      return reply(502, { error: "AI request failed" });
    }

    const data = await response.json();

    const sources = (data.output || []).flatMap(item => item.content || [])
      .flatMap(item => item.annotations || [])
      .filter(item => item.type === "url_citation" && typeof item.url === "string")
      .map(item => ({ title: item.title || item.url, url: item.url }));

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    return reply(200, {
      answer: answer || "No text returned",
      sources: searchMode ? [...new Map(sources.map(s => [s.url, s])).values()].slice(0,10) : [],
      mode: upscMode ? "upsc" : (socialMode ? "social" : (newsMode ? "news" : (searchMode ? "search" : "chat"))),
      execution: "DISABLED"
    });
  } catch {
    return reply(502, { error: "AI connection failed" });
  }
}
