/* BRAHMA preview integration. No keys or commands in browser. */
(() => {
  'use strict';
  const form = document.getElementById('ask');
  const input = document.getElementById('q');
  if (!form || !input) return;
  const endpoint = 'https://kido-brahma-ai.netlify.app/api/chat';
  const panel = document.createElement('section');
  panel.id = 'brahma-replies';
  panel.setAttribute('aria-live', 'polite');
  panel.setAttribute('aria-label', 'BRAHMA AI conversation');
  panel.style.cssText = 'margin-top:12px;max-height:280px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.5';
  form.after(panel);
  const submit = form.querySelector('button[type="submit"]');
  const line = (label, text) => {
    const p = document.createElement('p');
    p.style.cssText = 'padding:9px;border:1px solid #b78029;border-radius:10px;margin:7px 0';
    const strong = document.createElement('strong');
    strong.textContent = label + ': ';
    p.append(strong, document.createTextNode(text));
    panel.append(p);
    panel.scrollTop = panel.scrollHeight;
    return p;
  };
  let busy = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const message = input.value.trim();
    if (busy || !message) return;
    if (message.length > 2000) {
      line('BRAHMA', 'संदेश 2000 अक्षरों से छोटा रखें।');
      return;
    }
    line('आप', message);
    input.value = '';
    busy = true;
    if (submit) submit.disabled = true;
    const status = line('BRAHMA', 'जवाब प्राप्त किया जा रहा है…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal
      });
      let data;
      try { data = await response.json(); } catch { data = {}; }
      if (!response.ok || typeof data.answer !== 'string' || !data.answer.trim()) {
        throw new Error(response.status === 429 ? 'बहुत अनुरोध आए हैं। थोड़ी देर बाद कोशिश करें।' :
          response.status === 503 ? 'AI सेवा अभी उपलब्ध नहीं है।' : 'AI से जवाब नहीं मिला।');
      }
      status.lastChild.textContent = data.answer;
    } catch (error) {
      status.lastChild.textContent = error.name === 'AbortError'
        ? 'जवाब आने में बहुत देर हो रही है। बाद में कोशिश करें।'
        : (error instanceof TypeError ? 'AI सर्वर से संपर्क नहीं हो सका।' : error.message);
    } finally {
      clearTimeout(timeout);
      busy = false;
      if (submit) submit.disabled = false;
    }
  }, true);
})();
