import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const client = readFileSync(new URL('../brahma-preview.js', import.meta.url), 'utf8');
const backend = readFileSync(new URL('../backend/netlify/functions/chat.mjs', import.meta.url), 'utf8');

assert.match(html, /<script defer src="\.\/brahma-preview\.js"><\/script>/, 'Homepage must load chat client');
assert.match(html, /<form class="ask" id="ask">/, 'Chat form must exist');
assert.match(html, /id="q"/, 'Chat input must exist');
assert.match(client, /event\.preventDefault\(\)/, 'Prevent fallback modal on submit');
assert.match(client, /event\.stopImmediatePropagation\(\)/, 'Stop legacy placeholder handler');
assert.match(client, /AbortController/, 'Network request must be cancellable');
assert.match(client, /response\.ok/, 'HTTP failures must be handled');
assert.match(client, /textContent/, 'Render AI replies as text, not HTML');
assert.doesNotMatch(client, /innerHTML\s*=/, 'Never inject untrusted model HTML');
assert.doesNotMatch(client, /OPENAI_API_KEY|sk-proj-/, 'Do not embed API secrets in frontend');
assert.match(backend, /path:\s*["']\/api\/chat["']/, 'Backend API route must exist');
assert.match(backend, /OPENAI_API_KEY/, 'API key must be read on server');

console.log('BRAHMA preview static integration checks: PASS');
