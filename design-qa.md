# KiDO golden home — visual and interaction QA

final result: blocked

The functional front-end revision is reviewable, but full reference-art fidelity and successful live chat verification are not complete. Do not describe this revision as a pixel-matched reproduction or an end-to-end production pass.

## Evidence

- Source: user attachment `02-1000369541.png` (1024 × 1536). The supplied image is a reference only; it is not included in the website or committed here.
- Implementation: `docs/qa/mobile-390x844.jpg` and `docs/qa/mobile-320x640.jpg`.
- CSS viewport: 390 × 844 and 320 × 640, each rendered in a same-origin iframe in the cloud Chromium browser. Captures are at 1 screenshot pixel per CSS pixel. This is browser viewport testing, not a physical Android device test.
- Full comparison: source phone-frame region approximately x=150..880, y=0..1536 normalized to 390 × 844 alongside the implementation. This is an approximate composition comparison because the reference is a perspective illustration, not a measured browser viewport.
- Source and implementation were opened together in a comparison image during QA. Focused inspection covered the header/brand, BRAHMA composer, six doors, and navigation. No source-reference bitmap is shipped.
- State: signed out, home, no conversation. The 320px viewport intentionally scrolls; navigation remains visible.

## Comparison history and findings

1. First capture: the 390 × 844 home pushed the auxiliary gates below the viewport. Reduced header height, gate height and gaps; recaptured. All six primary gates and four auxiliary gates are visible in the second capture, with the lower orbit partly behind the center dock ornament.
2. [P1, remaining] Asset fidelity: the reference includes a detailed palace, illustrated Sikh child avatar, rendered planet and rich miniature gate scenes. This implementation uses locally bundled Font Awesome icons with depth, light and perspective styling. It does not reproduce those illustration assets. The user forbade image generation and use of a flattened reference background. No images were generated or extracted from the supplied reference. Full visual acceptance remains blocked on this difference.
3. [P1, verification gap] Live Chat: sending a harmless test message in both the original live website and local preview produced `Failed to fetch` in this browser. An independent OPTIONS request to the currently configured Netlify endpoint returned HTTP 405, rather than the 204 in the repository backend source. This suggests a deployed routing/preflight mismatch, but deployment configuration has not been diagnosed here. The backend was not modified and CORS was not weakened. A successful live answer remains unverified.
4. [P3] Typography: bold Arial/system Devanagari approximates the reference's condensed display typography; it is not an exact typeface match.

## Required fidelity surfaces

- Fonts/typography: readable live text, bold title hierarchy, no title overflow at 320px. Typeface differs as above.
- Spacing/layout: golden device frame, header, category navigation, integrated BRAHMA composer, 3-column doors, 4 auxiliary controls, orbit and persistent dock follow the reference order. Small phones scroll without horizontal overflow; 320px body scrollWidth equals clientWidth.
- Colors/tokens: black, warm gold, blue accent. Metal edge shadows and restrained animations are CSS rather than a static page picture.
- Image quality: local licensed SVG icons remain sharp, but do not match the reference illustrations; this is the major visual blocker.
- Copy/content: six gate labels, category navigation, BRAHMA subtitle and dock labels correspond to the reference. Deep Think prefills a detailed-answer request; it does not claim a separate model/reasoning backend. Family & Gotra prepares a chat prompt; it does not claim a new stored family-tree feature.

## Interaction checks

- Login drawer opens the original `#brahma-account` node; Login and Sign Up blank-field validation both respond. Close works. No new accounts were created; authenticated history persistence was not tested.
- News, UPSC, Government and Social gates invoke original handlers and select their respective input placeholders/web-search state.
- Tools opens the original attachment tray and closes through the original plus control. Actual file upload and voice permissions were not exercised.
- Menu opens, motion switch updates, AI team drawer opens; agent details remain accessible after leaving the native dialog.
- Writer, Creative and Government portals retain existing relative destinations; those pages were not redesigned.
- Chat submission displays loading, then a visible connection error and re-enables Send. Successful response is blocked as described above.
- Console inspected: extension metadata errors were present. No app JavaScript exception observed; chat network failure remains.
- JS syntax and whitespace checks pass.
- Original main chat inline script, `brahma-memory.js`, and `backend/netlify/functions/chat.mjs` are byte-for-byte unchanged from the starting commit.

## Implementation checklist

- [x] Interactive home, real buttons/links/input, integrated composer, gold frame and motion controls.
- [x] Preserve auth/chat/backend contracts and restrict edits to kido-restore.
- [x] Mobile screenshots and reference comparison.
- [ ] Resolve original deployed chat preflight/routing and verify a live response.
- [ ] Supply approved individual artwork or authorize another artwork approach for a closer visual match; do not use the full reference as a background.
