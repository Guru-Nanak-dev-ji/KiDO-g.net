/* KiDO first-screen enhancement. Existing chat/auth nodes and handlers are retained. */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const chat = document.getElementById('chat');
  const input = document.getElementById('input');
  const app = document.querySelector('.app');
  if (!chat || !input || !app || document.querySelector('.kq-home')) return;
  const el = (tag, cls, text) => { const n = document.createElement(tag); n.className = cls || ''; if (text) n.textContent = text; return n; };
  const icon = name => { const n = el('img', 'kq-icon'); n.src = './assets/icons/' + name + '.svg'; n.alt = ''; n.setAttribute('aria-hidden', 'true'); return n; };
  const button = (label, name, fn, cls = '') => { const b = el('button', cls); b.type = 'button'; if (name) b.append(icon(name)); b.append(el('span', '', label)); b.addEventListener('click', e => { e.stopPropagation(); fn(); }); return b; };
  const focusChat = () => { brahma.scrollIntoView({ behavior: motion() ? 'smooth' : 'instant', block: 'start' }); input.focus({ preventScroll: true }); };
  const prompt = text => { input.value = text; input.dispatchEvent(new Event('input')); focusChat(); };
  const motion = () => !document.documentElement.classList.contains('kq-motion-off') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { if (localStorage.getItem('kido-motion') === 'off') document.documentElement.classList.add('kq-motion-off'); } catch {}
  const home = el('div', 'kq-home');
  const mast = el('section', 'kq-mast');
  const topbar = el('div', 'kq-topbar');
  topbar.append(el('span', 'kq-edition', 'KHATRI DIGITAL NETWORK'), button('Login', 'Lock', () => openSheet('account'), 'kq-login-toggle'));
  const branding = el('div', 'kq-branding');
  const seal = el('div', 'kq-seal'); seal.append(el('span', '', 'KHALSA'), icon('ChessKnight'));
  const brand = el('div', 'kq-brand'); brand.innerHTML = '<h1>KiDO<span>-G</span></h1><p>आपका AI साथी</p><small>KHATRI DIGITAL NETWORK</small>';
  const globe = el('div', 'kq-globe'); globe.append(icon('EarthAsia'));
  branding.append(seal, brand, globe);
  const shrine = el('div', 'kq-sanctuary'); shrine.setAttribute('aria-label', 'एक ओंकार');
  const faith = el('span', 'kq-faith', 'ੴ');
  shrine.append(icon('Gopuram'), faith, icon('Gopuram'));
  const nav = el('nav', 'kq-nav'); nav.setAttribute('aria-label', 'मुख्य द्वार');
  nav.append(button('KiDO', 'House', () => chat.scrollTo({ top: 0, behavior: 'smooth' })), button('KDN', 'Globe', () => grid.scrollIntoView({ block: 'center', behavior: 'smooth' })), button('Farming', 'Seedling', () => prompt('खेती के बारे में मेरी मदद करें: ')), button('Business', 'Building', () => prompt('मेरे business के लिए योजना बनाने में मदद करें: ')), button('More', 'Bars', () => openSheet('menu')));
  mast.append(topbar, branding, shrine, nav);
  const brahma = el('section', 'kq-brahma-panel'); brahma.id = 'kq-brahma'; brahma.setAttribute('aria-labelledby', 'kq-brahma-title');
  const heading = el('div', 'kq-brahma-top'); const face = el('div', 'kq-brahma-face'); face.append(icon('Robot'));
  const words = el('div'); words.innerHTML = '<h2 id="kq-brahma-title">BRAHMA AI</h2><p>Ask · Search · Create · Learn</p>';
  heading.append(face, words);
  const composer = document.querySelector('.composer');
  const plus = document.getElementById('plus'); plus.replaceChildren(icon('Plus')); plus.setAttribute('aria-label', 'Attachments and tools');
  const send = document.getElementById('send'); send.replaceChildren(icon('PaperPlane'));
  input.setAttribute('aria-label', 'BRAHMA को संदेश');
  const mic = button('', 'Microphone', () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) { hint.textContent = 'Voice typing के लिए अपने keyboard का microphone इस्तेमाल करें।'; focusChat(); return; }
    const speech = new Speech(); speech.lang = document.getElementById('language').value === 'pa' ? 'pa-IN' : document.getElementById('language').value === 'en' ? 'en-US' : 'hi-IN';
    speech.onstart = () => { mic.classList.add('listening'); hint.textContent = 'सुन रहा हूँ…'; };
    speech.onresult = e => { input.value += e.results[0][0].transcript; input.dispatchEvent(new Event('input')); };
    speech.onerror = () => { hint.textContent = 'Microphone उपलब्ध नहीं है। आप संदेश लिख सकते हैं।'; };
    speech.onend = () => mic.classList.remove('listening');
    try { speech.start(); } catch { hint.textContent = 'Voice typing अभी उपलब्ध नहीं है।'; }
  }, 'kq-mic'); mic.setAttribute('aria-label', 'Voice typing'); send.before(mic);
  const hint = el('div', 'kq-hint'); hint.setAttribute('role', 'status');
  const actions = el('div', 'kq-actions'); const check = document.getElementById('brahma-web-search');
  const web = button('Web Search', 'Globe', () => { check.checked = !check.checked; web.setAttribute('aria-pressed', String(check.checked)); hint.textContent = check.checked ? 'Web search चुना गया। अपना सवाल लिखें।' : ''; }, 'kq-action'); web.setAttribute('aria-pressed', String(check.checked));
  const deep = button('Deep Think', 'Brain', () => prompt('इस प्रश्न पर विस्तार से विचार करके जवाब दें: '), 'kq-action');
  actions.append(web, button('Files', 'FileLines', () => document.getElementById('fileInput').click(), 'kq-action'), deep, button('Tools', 'ScrewdriverWrench', () => plus.click(), 'kq-action'));
  const log = el('div', 'kq-conversation'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite'); log.setAttribute('aria-label', 'BRAHMA बातचीत');
  brahma.append(heading, composer, actions, hint, log);
  const grid = el('section', 'kq-grid'); grid.id = 'kq-doors'; grid.setAttribute('aria-label', 'Digital Kingdom द्वार');
  const entries = [
    ['Newspaper', 'NEWS', 'World · India · Punjab', 'brahma-news-btn'],
    ['GraduationCap', 'UPSC', 'Study · Exam · Current', 'brahma-upsc-btn'],
    ['Landmark', 'GOVERNMENT', 'Schemes · Jobs · Portals', 'brahma-govt-btn'],
    ['Users', 'SOCIAL SEARCH', 'People · Trends · Media', 'brahma-social-btn'],
    ['FeatherPointed', 'WRITER ACADEMY', 'Write · Learn · Publish', './writer-academy.html'],
    ['Palette', 'CREATIVE STUDIO', 'Images · Videos · Apps', './creative-studio.html']
  ];
  for (const [art, label, desc, target] of entries) {
    const b = el(target.startsWith('./') ? 'a' : 'button', 'kq-tile');
    if (b.tagName === 'A') b.href = target;
    else { b.type = 'button'; b.addEventListener('click', () => { document.getElementById(target).click(); web.setAttribute('aria-pressed', String(check.checked)); hint.textContent = label + ' चुना गया। अपना सवाल लिखें।'; focusChat(); }); }
    const medallion = el('div', 'kq-door-art'); medallion.append(icon(art));
    b.append(medallion, el('b', '', label), el('small', '', desc)); grid.append(b);
  }
  const aux = el('nav', 'kq-aux'); aux.setAttribute('aria-label', 'अन्य द्वार');
  aux.append(button('AI AGENTS', 'Robot', () => openSheet('agents')), button('FAMILY & GOTRA', 'Users', () => prompt('परिवार और गोत्र के बारे में मेरा सवाल: ')), button('BUSINESS', 'ChartLine', () => prompt('Business के लिए मेरी मदद करें: ')), button('TOOLS & MORE', 'Shapes', () => openSheet('menu')));
  const orbit = el('div', 'kq-orbit-stage'); orbit.setAttribute('aria-hidden', 'true'); orbit.append(icon('EarthAsia'));
  const dock = el('nav', 'kq-dock'); dock.setAttribute('aria-label', 'Quick navigation');
  const center = button('', 'Khanda', () => chat.scrollTo({ top: 0, behavior: 'smooth' }), 'kq-dock-center'); center.setAttribute('aria-label', 'KiDO Home');
  dock.append(button('Home', 'House', () => chat.scrollTo({ top: 0, behavior: 'smooth' })), button('Chat', 'Comments', focusChat), center, button('Search', 'MagnifyingGlass', () => { check.checked = true; web.setAttribute('aria-pressed', 'true'); focusChat(); }), button('Menu', 'Shapes', () => openSheet('menu')));
  home.append(mast, brahma, grid, aux, orbit);
  // Collapse the legacy home layout. Retain all nodes, IDs, listeners and API code.
  [...chat.children].forEach(n => n.classList.add('kq-legacy'));
  chat.prepend(home); app.append(dock); document.body.classList.add('kq-ready');
  const tools = document.getElementById('kidoTools'); document.body.append(tools);
  const sheet = document.createElement('dialog'); sheet.className = 'kq-sheet';
  const sheetHead = el('div', 'kq-sheet-head'); const sheetTitle = el('h2');
  const close = button('', 'Xmark', () => sheet.close(), 'kq-close'); close.setAttribute('aria-label', 'बंद करें');
  sheetHead.append(sheetTitle, close); const sheetBody = el('div', 'kq-sheet-body'); sheet.append(sheetHead, sheetBody); document.body.append(sheet);
  sheet.addEventListener('click', e => { if (e.target === sheet) { const r = sheet.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) sheet.close(); } });
  const account = document.getElementById('brahma-account');
  const teams = [document.querySelector('.team'), document.querySelector('.specialist-team')].filter(Boolean);
  const parking = el('div'); parking.hidden = true; document.body.append(parking);
  if (account) { account.classList.remove('kq-legacy'); parking.append(account); }
  teams.forEach(t => { t.classList.remove('kq-legacy'); parking.append(t); t.addEventListener('click', e => { if (e.target.closest('.agent,.specialist')) sheet.close(); }, true); });
  const menu = el('div', 'kq-menu');
  for (const [label, href] of [['Government portals', './government-portals.html'], ['Writer Academy', './writer-academy.html'], ['Creative Studio', './creative-studio.html']]) { const a = el('a', '', label); a.href = href; a.append(icon('ChevronRight')); menu.append(a); }
  menu.append(button('Login / Private memory', 'Lock', () => openSheet('account')), button('Core & Specialist AI Team', 'Robot', () => openSheet('agents')));
  const animationButton = button('हल्के animation', 'CirclePause', () => { const off = document.documentElement.classList.toggle('kq-motion-off'); animationButton.setAttribute('aria-pressed', String(!off)); try { localStorage.setItem('kido-motion', off ? 'off' : 'on'); } catch {} });
  animationButton.setAttribute('aria-pressed', String(motion())); menu.append(animationButton); parking.append(menu);
  function openSheet(which) {
    [...sheetBody.children].forEach(n => parking.append(n));
    sheetTitle.textContent = which === 'account' ? 'BRAHMA Private Login' : which === 'agents' ? 'KiDO AI Team' : 'आपके सभी द्वार';
    if (which === 'account' && account) sheetBody.append(account);
    else if (which === 'agents') teams.forEach(t => sheetBody.append(t));
    else sheetBody.append(menu);
    if (!sheet.open) sheet.showModal();
  }
  // Put replies below the actual composer; auth history still queries the same #chat.
  const moveMessages = () => {
    for (const n of [...chat.children]) if (n.matches('.msg') && !n.classList.contains('kq-legacy')) { log.append(n); n.scrollIntoView({ block: 'nearest', behavior: motion() ? 'smooth' : 'instant' }); }
  };
  new MutationObserver(moveMessages).observe(chat, { childList: true });
  // No continuous JS motion; reduce-motion and the menu switch control CSS animation.
});
