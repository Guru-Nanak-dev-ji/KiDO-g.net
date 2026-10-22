# BRAHMA security and private memory plan

Status: audit in progress (2026-10-22). This document does not change the production chat API or website UI.

## Verified architecture
- Public frontend is served from GitHub Pages using the `kido-restore` branch.
- Frontend `index.html` calls `https://kido-brahma-ai.netlify.app/api/chat`.
- BRAHMA backend is deployed as a separate Netlify project `kido-brahma-ai`; its function source is NOT in this GitHub branch. Audit of server-side validation, API spend limits, and logging therefore requires access to the deployed backend source.
- Current frontend request sends the message and optional base64 file/image content. No authenticated user identity is supplied with the request.
- No account login is present in this frontend's chat flow. Therefore chat history must NOT be treated as private per-user data on a shared server.

## Security requirements before server-side memory
1. Recover and version-control the current backend source privately, without secrets or credentials; preserve the current production deploy until verified.
2. Validate request body size and attachment MIME/type/size; reject oversized payloads before invoking paid model calls.
3. Keep the model API key server-side, use cost and rate controls, and ensure execution of user-supplied commands remains disabled.
4. Introduce authenticated user identity with server-verified sessions before writing persistent private chat history.
5. Enforce per-user access controls at the database layer; never accept a user ID from the browser as authorization.
6. Define history retention, user deletion/export, and encryption and backup policies; minimize sensitive data in logs.
7. Test CORS, error handling, access-control isolation, and rollback on a non-production deploy before release.

## Memory rollout
- Phase A: Optional in-tab conversation context only, with clear disclosure that it is not persistent private memory; no server-side data storage.
- Phase B: Authenticated persistent chat history after login, per-user row-level isolation and delete-history control are implemented and tested.
- Phase C: Optional longer-term user preferences with explicit opt-in, inspection, and deletion.

## Production safety
- Do not change the site's design or production API endpoint as part of this document.
- Do not add public chat history storage, localStorage-based private memory, or secrets to the GitHub Pages frontend.
- All changes to the backend must be tested and deployed with rollback available.
