/* KiDO Quantum Kingdom - progressive enhancement. Existing handlers preserved. */
document.addEventListener("DOMContentLoaded",()=>{
 const chat=document.getElementById("chat"),input=document.getElementById("input");
 if(!chat||!input||document.querySelector(".kq-banner"))return;
 const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt)n.textContent=txt;return n};
 const banner=el("section","kq-banner");banner.innerHTML='<div class="kq-eyebrow">✦ KHATRI DIGITAL NETWORK ✦</div><h1>KiDO-G<br>QUANTUM KINGDOM</h1><p>आपका AI साथी · Ask · Search · Create · Learn</p><div class="kq-orbit" aria-hidden="true">🌐</div>';
 const nav=el("nav","kq-nav");nav.setAttribute("aria-label","KiDO मुख्य द्वार");
 [["🍊 KiDO","#kq-brahma"],["🌍 KDN","#kq-doors"],["🌾 Farming","#kq-doors"],["🏢 Business","#kq-doors"]].forEach(([label,href])=>{const a=el("a","",label);a.href=href;nav.append(a)});
 const title=el("div","kq-section-title");title.id="kq-brahma";title.innerHTML='<span>✦ BRAHMA AI</span><small>सवाल पूछें · नीचे Chat करें</small>';
 const section=el("div","kq-section-title");section.id="kq-doors";section.innerHTML='<span>♛ DIGITAL KINGDOM</span><small>छह मुख्य द्वार</small>';
 const grid=el("div","kq-grid");
 const entries=[
 ["📰","NEWS","Live news","brahma-news-btn",null],
 ["📚","UPSC","AI Tutor","brahma-upsc-btn",null],
 ["🏛️","GOVERNMENT","Govt search","brahma-govt-btn",null],
 ["👥","SOCIAL","Find accounts","brahma-social-btn",null],
 ["✍️","WRITER","Academy",null,"./writer-academy.html"],
 ["🎨","CREATIVE","AI studio",null,"./creative-studio.html"]
 ];
 entries.forEach(([icon,name,desc,id,href])=>{const b=el(href?"a":"button","kq-tile");if(href)b.href=href;else{b.type="button";b.addEventListener("click",()=>{document.getElementById(id)?.click();input.scrollIntoView({block:"nearest"});input.focus()})}const i=el("span","kq-icon",icon),n=el("b","",name),s=el("small","",desc);b.append(i,n,s);grid.append(b)});
 const actions=el("div","kq-actions");
 [["🔎 Web Search",()=>{const c=document.getElementById("brahma-web-search");c.checked=!c.checked;input.focus()}],["💬 Chat",()=>input.focus()],["📎 Attach",()=>document.getElementById("plus")?.click()],["⚙️ More",()=>document.getElementById("kq-more")?.classList.toggle("open")]].forEach(([name,fn])=>{const b=el("button","",name);b.type="button";b.addEventListener("click",fn);actions.append(b)});
 const more=el("div","kq-more");more.id="kq-more";more.innerHTML='<a href="./government-portals.html">🏛️ सभी सरकारी पोर्टल</a><a href="./writer-academy.html">✍️ Writer Academy & Agents</a><a href="./creative-studio.html">🎨 Creative Studio</a>';
 const stage=el("div","kq-stage");stage.setAttribute("aria-label","जीवंत सुनहरा डिजिटल संसार");stage.append(el("span","kq-eagle","🦅"));
 const brahma=el("section","kq-brahma-panel");
 const top=el("div","kq-brahma-top");top.innerHTML='<div class="kq-brahma-face" aria-hidden="true">👳🏻‍♂️</div><div><h2>BRAHMA AI</h2><p>Ask · Search · Create · Learn</p></div>';
 brahma.append(top,actions);
 const aux=el("div","kq-aux");
 [["🤖","AI AGENTS",()=>document.querySelector(".team")?.scrollIntoView({behavior:"smooth"})],["👪","FAMILY",()=>more.classList.toggle("open")],["📈","BUSINESS",()=>{input.value="Business के लिए ideas बताओ";input.focus()}],["✦","MORE",()=>more.classList.toggle("open")]].forEach(([icon,name,fn])=>{const b=el("button");b.type="button";b.append(el("span","",icon),document.createTextNode(name));b.addEventListener("click",fn);aux.append(b)});
 const first=chat.firstElementChild;chat.insertBefore(banner,first);banner.after(stage,nav,brahma,section,grid,aux,more);
 // Hide duplicated large legacy controls without deleting them or their event handlers.
 ["brahma-news-btn","brahma-social-btn","brahma-upsc-btn","brahma-govt-btn"].forEach(id=>{const b=document.getElementById(id);if(b){let p=b.parentElement;if(p&&p.parentElement===chat)p.classList.add("kq-old-section")}});
 for(const a of chat.querySelectorAll('a[href="./creative-studio.html"],a[href="./writer-academy.html"],a[href="./government-portals.html"]')){const p=a.parentElement;if(p&&p.parentElement===chat)p.classList.add("kq-old-section")}
 const dock=el("nav","kq-dock");dock.setAttribute("aria-label","Quick navigation");
 [["⌂","Home",()=>chat.scrollTo({top:0,behavior:"smooth"})],["☏","Chat",()=>input.focus()],["✦","Search",()=>{document.getElementById("brahma-web-search").checked=true;input.focus()}],["☷","Menu",()=>{more.classList.toggle("open");more.scrollIntoView({block:"nearest",behavior:"smooth"})}]].forEach(([icon,label,fn])=>{const b=el("button");b.type="button";b.append(el("span","",icon),document.createTextNode(label));b.addEventListener("click",fn);dock.append(b)});
 document.body.append(dock);
 // Legacy controls remain connected to the existing backend but are visually collapsed.
 const terminal=chat.querySelector(".terminal");if(terminal)terminal.classList.add("kq-hidden-original");
 const checkbox=document.getElementById("brahma-web-search");if(checkbox){const wrapper=checkbox.closest("div");if(wrapper&&wrapper.parentElement===chat)wrapper.classList.add("kq-hidden-original")}
 const quick=chat.querySelector(".quick");if(quick)quick.classList.add("kq-hidden-original");
 const legacy=chat.querySelector(".msg.ai");if(legacy&&legacy.textContent.includes("अपनी बात नीचे"))legacy.classList.add("kq-hidden-original");
 // Existing authentication form is moved, never cloned or rewritten.
 const sheet=el("div","kq-login-sheet");sheet.id="kq-login-sheet";
 const inner=el("div","kq-login-inner");const head=el("div","kq-login-head");head.append(el("strong","","🔐 BRAHMA Private Login"));
 const close=el("button","","✕");close.type="button";close.setAttribute("aria-label","Close login");close.onclick=()=>sheet.classList.remove("open");head.append(close);inner.append(head);sheet.append(inner);document.body.append(sheet);
 sheet.addEventListener("click",e=>{if(e.target===sheet)sheet.classList.remove("open")});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")sheet.classList.remove("open")});
 const loginBtn=el("button","kq-login-toggle","🔐 Login");loginBtn.type="button";loginBtn.onclick=()=>sheet.classList.add("open");document.querySelector("header")?.append(loginBtn);
 function relocateLogin(){
  if(inner.querySelector("input[type=password]"))return true;
  const pass=Array.from(document.querySelectorAll('input[type="password"]')).find(e=>!sheet.contains(e));
  if(!pass)return false;
  let root=pass.closest("form")||pass.parentElement?.parentElement?.parentElement;
  if(!root||root===document.body||root===chat)return false;
  inner.append(root);return true;
 }
 relocateLogin();
 const observer=new MutationObserver(()=>{if(relocateLogin())observer.disconnect()});observer.observe(document.body,{subtree:true,childList:true});
 setTimeout(()=>observer.disconnect(),15000);

});
