# Golden home implementation notes

All work belongs on `kido-restore`. `quantum-kingdom.js` enhances the existing page after DOMContentLoaded; it moves existing composer and authentication nodes instead of recreating them. The original input/send/upload/language IDs, auth module and backend request logic must remain intact.

Do not turn the supplied reference into a full-page background. The frame, layout, gate controls and animations are live HTML/CSS. Icons are bundled from Font Awesome Free Solid 7.3.1 (license in assets/icons/LICENSE.txt). No runtime CDN dependency is required.

`npm run dev -- --host 0.0.0.0 --port 4173 --strictPort` starts a local static server. `/__mobile` is a local-only QA harness; optional width/height parameters select a constrained iframe viewport. It is not a deployed page. `npm run check` checks enhancement/auth syntax.

Reduced-motion is respected. Users can also disable CSS motion in Menu. Account and menu dialogs use native modal behavior. The old team slider does not auto-run in the enhanced screen.

See design-qa.md for known fidelity differences and the live-backend verification blocker. This commit does not change Netlify, Supabase, domain configuration, or backend security.
