# Interactive golden home revision — 22 October 2026

Scope: `Guru-Nanak-dev-ji/KiDO-g.net`, `kido-restore` only. Builds on starting commit `7ca103e879c720d4ccb9e6659ee6d24fc640bae2`.

## Result

The homepage now has a more sculpted gold device frame, orange-letter wordmark, layered blue globe, seven-tower DOM palace with domes and water reflections, a small CSS turban avatar, six miniature gate scenes, and independently hinged CSS 3D door leaves. Gate activation opens the leaves before selecting the original chat topic or navigating to the existing destination. Repeated taps during the transition are ignored; reduced-motion activation is immediate. Existing four auxiliary entry controls remain available.

The supplied ornate image is a composition/material reference. The tall supplied website screenshot is the current-UI reference. Neither attachment is copied, generated, embedded, or used as a page background. All new artwork is HTML/CSS geometry layered with existing local SVG icons. This is a CSS 3D interface, not a WebGL walkthrough or an exact reproduction of the reference illustration.

The original composer is retained. Existing Login, Chat, upload and language nodes/handlers remain connected. UI touch controls are at least 44px high; the inner device screen scrolls on compact displays. Keyboard activation uses native buttons and links. Reduced motion and the menu motion setting remain supported.

## Checks performed

- `npm run check` passed; `git diff --check` passed.
- All five inline script blocks in `index.html` are identical to the starting commit. Only the two UI asset cache versions change in that file.
- `brahma-memory.js` and `backend/netlify/functions/chat.mjs` are byte-for-byte unchanged. No auth credentials, endpoint configuration, CORS, deployment, DNS or backend permissions were changed.
- 19 headless DOM contract checks passed using jsdom, with network transport mocked: original node identity; six main and four auxiliary entries; twelve hinged leaves; palace/avatar DOM; original Login panel and empty-input validation; four original topic handlers; Writer/Creative relative links; original tools tray and file input; original send payload and reply rendering; auth-history descendant access; timed opening and repeated-tap suppression; idempotent enhancement; no script exceptions.
- jsdom and its harness were temporary QA dependencies outside the repository. No runtime dependency was added.

## Verification limits

Fresh mobile screenshots and rendered visual comparison could not be completed. The authorized cloud-browser preview attempt was rejected by its URL/security policy. No alternate browser or policy workaround was used. **The older screenshots in `docs/qa` predate this revision and are not evidence of this UI.** No mobile overflow, exact rendered alignment, visual fidelity or physical-device pass is claimed.

The reference has detailed illustrated architecture, a portrait and rich 3D art. This implementation approximates those elements with live DOM/CSS and existing icons; visual matching needs rendered review. It is not pixel matched.

Chat transport was mocked for the DOM tests. A live AI response, real authentication, account creation and persistence were not exercised. See the previous `design-qa.md` for its earlier live-backend limitation; this revision does not fix or independently reverify that deployed service.

No separate site is created or deployed by this change. Existing branch-triggered hosting automation, if configured externally, controls whether the branch appears on the public domain.
