# KIDO-G BRAHMA integration audit — 2026-10-29

## Verified from repository
- Base branch: `kido-restore`.
- Current root `index.html` is a Golden Kingdom UI and does not contain a `fetch(` call or a reference to `/api/chat` or the Netlify production hostname.
- `backend/netlify/functions/chat.mjs` exports a Netlify handler configured at `/api/chat`, checks the Origin header, validates request length, uses server-side `OPENAI_API_KEY`, and calls OpenAI Responses API.
- The repository does not have a verified deployment configuration at the root. Presence of backend source does **not** prove it is deployed.
- Historical `docs/BRAHMA-SECURITY-MEMORY.md` refers to a separate Netlify project, but may not reflect current production.

## Required before launch
1. Confirm the actual production Netlify site and deployed function source with authorized hosting access.
2. Confirm the production chat endpoint and response contract without exposing keys.
3. Add a frontend chat integration on a preview branch with loading, timeout, error, and unavailable states. Never claim AI is online until a real response is received.
4. Prefer same-origin reverse proxy or a carefully configured HTTPS backend origin; restrict CORS server-side and do not rely on CORS as authentication.
5. Verify rate limiting, spend controls, request limits, abuse controls, and logging policy on the deployed backend.
6. Test keyboard/mobile accessibility, failed requests, offline behavior, and rollback.
7. Deploy only after preview validation and explicit production approval.

## Related work
- NOT4YOU: verify apex/www HTTPS redirect chain and ownership before changing DNS.
- MY NETA: recover requirements and source; keep public representative data verifiable, politically neutral, and distinguish official from user-submitted information.

No production files, secrets, DNS settings, or deployments were modified in this audit.
