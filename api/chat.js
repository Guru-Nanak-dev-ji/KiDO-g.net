export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const origin = req.headers.origin;
  const allowed = new Set(['https://www.kido-g.net', 'https://kido-g.net', 'https://kido-g-ai-api.vercel.app']);
  if (allowed.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true, service: 'kido-chat', configured: Boolean(process.env.OPENAI_API_KEY) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'AI is not configured on the server' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const raw = Array.isArray(body.messages) ? body.messages : [{ role: 'user', content: body.message || body.prompt || '' }];
    const messages = raw.filter(m => ['user', 'assistant', 'system'].includes(m.role) && typeof m.content === 'string').slice(-20);
    if (!messages.length || !messages.some(m => m.role === 'user' && m.content.trim())) return res.status(400).json({ error: 'Message required' });
    const systemMessage = { role: 'system', content: 'You are KIDO-G AI, the AI assistant integrated into the KIDO-G digital world website. Introduce yourself as KIDO-G AI, powered by OpenAI technology, when asked your name or identity. Do not claim to be a separate model created by KIDO-G or deny the underlying OpenAI provider. Answer helpfully in the language of the user, including Hindi, Punjabi, and English. Be clear about capabilities and do not claim to have completed actions you have not performed.' };
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.OPENAI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', messages: [systemMessage, ...messages.filter(m => m.role !== 'system')], max_tokens: 700 })
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: 'AI provider request failed', providerStatus: response.status });
    const reply = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ answer: reply, reply, response: reply, message: reply });
  } catch (error) {
    return res.status(500).json({ error: 'Chat request failed' });
  }
}
