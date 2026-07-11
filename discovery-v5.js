(()=>{
const css="\n#discoveryPanelV5{margin-bottom:26px;padding:18px;border:2px solid var(--leather);background:rgba(247,239,223,.74);box-shadow:4px 5px 0 rgba(80,55,34,.12)}\n#discoveryPanelV5 .discovery-filters{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}\n#discoveryPanelV5 label{display:flex;flex-direction:column;gap:5px;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--red);font-weight:bold}\n#discoveryPanelV5 select{width:100%;text-transform:none;letter-spacing:normal;font-weight:normal}\n#discoveryPanelV5 .tonight-results{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}\n#discoveryPanelV5 .tonight-card{min-height:230px;display:flex;flex-direction:column}\n#discoveryPanelV5 .tonight-card .btn{margin-top:auto;align-self:flex-start}\n.tag.cuttting-edge,.tag.cutting-edge{border-color:#6d4a72;background:#e7d8e8}\n@media(max-width:1050px){#discoveryPanelV5 .discovery-filters{grid-template-columns:repeat(2,minmax(0,1fr))}}\n@media(max-width:760px){#discoveryPanelV5{padding:12px}#discoveryPanelV5 .discovery-filters,#discoveryPanelV5 .tonight-results{grid-template-columns:1fr}#discoveryPanelV5 .actions{position:sticky;bottom:0;background:rgba(232,220,194,.96);padding:8px 0;z-index:3}}\n";if(!document.getElementById('styles-v5-inline')){const s=document.createElement('style');s.id='styles-v5-inline';s.textContent=css;document.head.appendChild(s)}
const RECENT_KEY='whb_discovery_recent_v5',PREF_KEY='whb_discovery_prefs_v5';
const loadV5=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
let recent=loadV5(RECENT_KEY,[]),prefs=loadV5(PREF_KEY,{availability:'make',base:'',service:'up',technique:'shaken',mood:'',difficulty:'',history:'untried',era:''});
const savePrefs=()=>localStorage.setItem(PREF_KEY,JSON.stringify(prefs));
const recipeDifficulty=r=>r.difficulty||((r.ingredients||[]).length>5?'Intermediate':'Easy');
const blob=r=>norm([r.name,r.base,r.style,r.tasting,r.source,...(r.tags||[]),...(r.ingredients||[]).flat()].join(' '));
function matchService(r,v){if(!v)return true;const g=norm(r.glass||''),t=(r.tags||[]).map(norm),s=norm(r.style||'');if(v==='up')return t.includes('up')||/coupe|nick nora|martini/.test(g);if(v==='rocks')return t.includes('rocks')||g.includes('rocks');if(v==='highball')return /highball|collins|fizz/.test(s+' '+g);if(v==='tiki')return t.includes('tiki')||s.includes('tiki');if(v==='hot')return s.includes('hot')||g.includes('mug');return true}
function matchTechnique(r,v){if(!v)return true;const b=blob(r);const map={shaken:['shaken','shake'],stirred:['stirred','stir'],built:['built','build'],clarified:['clarified','milk punch'],freezer:['freezer'],fatwashed:['fat washed','fat-washed'],blended:['blended','blend'],swizzled:['swizzled','swizzle']};return(map[v]||[]).some(x=>b.includes(norm(x)))}
function matchMood(r,m){if(!m)return true;const b=blob(r),map={refreshing:['refreshing','highball','collins','fizz','spritz','soda','cucumber','mint'],strong:['spirit forward','old fashioned','manhattan','strong','sazerac'],sweet:['dessert','cream','coffee','vanilla','pistachio','chocolate'],bitter:['bitter','campari','aperol','fernet','amaro','cynar'],tropical:['tiki','tropical','pineapple','coconut','passion fruit','guava','mango'],smoky:['mezcal','smoky','smoke','peated'],floral:['floral','elderflower','lavender','rose water','orange flower','violette'],savory:['savory','tomato','celery','cucumber','miso','seaweed','sherry vinegar'],tea:['tea','matcha','hojicha','earl grey','jasmine','chai'],weird:['absinthe','fernet','aquavit','chartreuse','matcha','miso','seaweed','clarified','fat washed','cutting edge']};return(map[m]||[]).some(x=>b.includes(norm(x)))}
function matchHistory(r,h){const x=hist(r.id);if(!h)return true;if(h==='untried')return x.count===0;if(h==='tried')return x.count>0;if(h==='again')return x.makeAgain;if(h==='stale')return !x.lastMade||(Date.now()-new Date(x.lastMade+'T12:00:00').getTime())/86400000>90;return true}
function matchAvailability(r,a){const n=missing(r).length;if(a==='make')return n===0;if(a==='one')return n<=1;if(a==='two')return n<=2;return true}
function matchEra(r,e){if(!e)return true;const tags=r.tags||[],src=norm(r.source||'');if(e==='classic')return tags.includes('IBA Classic')||tags.includes('Classic')||src.includes('classic');if(e==='modern')return tags.includes('Modern Classic')||src.includes('modern');if(e==='cutting')return tags.includes('Cutting Edge')||src.includes('experimental');return true}
function pool(){return DATA.recipes.filter(r=>matchAvailability(r,prefs.availability)&&(!prefs.base||r.base===prefs.base)&&matchService(r,prefs.service)&&matchTechnique(r,prefs.technique)&&matchMood(r,prefs.mood)&&(!prefs.difficulty||recipeDifficulty(r)===prefs.difficulty)&&matchHistory(r,prefs.history)&&matchEra(r,prefs.era))}
function pickSmart(source,count){
  const candidates=source.map(r=>{const idx=recent.indexOf(r.id),h=hist(r.id);let score=(idx<0?10000:idx*20)+(h.count===0?100:0)+(h.makeAgain?30:0)+(state.favorites.has(r.id)?20:0)+Math.random()*15;return{r,score}}).sort((a,b)=>b.score-a.score);
  const chosen=[];
  while(candidates.length&&chosen.length<count){const windowSize=Math.min(8,candidates.length),i=Math.floor(Math.random()*windowSize),item=candidates.splice(i,1)[0];chosen.push(item.r)}
  const ids=chosen.map(r=>r.id);recent=[...ids,...recent.filter(id=>!ids.includes(id))].slice(0,200);localStorage.setItem(RECENT_KEY,JSON.stringify(recent));return chosen
}
function render(){
  const p=pool(),picks=pickSmart(p,3),el=document.getElementById('discoveryResultsV5');if(!el)return;
  el.innerHTML=picks.length?picks.map(r=>`<div class="tonight-card"><div class="tags">${(r.tags||[]).slice(0,5).map(t=>`<span class="tag">${t}</span>`).join('')}</div><h3>${r.name}</h3><p>${r.tasting||''}</p><p><b>${missing(r).length?`Missing ${missing(r).length}`:'Make now'}</b> · ${recipeDifficulty(r)} · ${r.glass||''}</p><button class="btn" onclick="openRecipe(${r.id})">Open recipe</button></div>`).join(''):'<div class="empty">No drinks match those discovery filters.</div>';
  const c=document.getElementById('discoveryCountV5');if(c)c.textContent=`${p.length} eligible · ${recent.length} recent results remembered`;
}
function resetRecent(){recent=[];localStorage.removeItem(RECENT_KEY);render()}
function install(){
  const old=document.getElementById('discoveryPanel');if(old)old.remove();
  const tonight=document.getElementById('tonight');if(!tonight||document.getElementById('discoveryPanelV5'))return;
  const panel=document.createElement('div');panel.id='discoveryPanelV5';panel.className='discovery-panel';
  panel.innerHTML=`<div class="sectionhead"><h2>Drink Discovery</h2><span id="discoveryCountV5"></span></div>
  <div class="discovery-filters">
    <label>Availability<select id="dvAvailability"><option value="make">Make now</option><option value="one">Missing at most one</option><option value="two">Missing at most two</option><option value="all">Ignore inventory</option></select></label>
    <label>Era<select id="dvEra"><option value="">Any era</option><option value="classic">Absolute classics</option><option value="modern">Modern classics</option><option value="cutting">Cutting edge</option></select></label>
    <label>Base<select id="dvBase"><option value="">Dealer's choice</option></select></label>
    <label>Service<select id="dvService"><option value="">Any service</option><option value="up">Up</option><option value="rocks">On the rocks</option><option value="highball">Highball / fizz</option><option value="tiki">Tiki</option><option value="hot">Hot</option></select></label>
    <label>Technique<select id="dvTechnique"><option value="">Any technique</option><option value="shaken">Shaken</option><option value="stirred">Stirred</option><option value="built">Built</option><option value="clarified">Clarified / milk punch</option><option value="freezer">Freezer</option><option value="fatwashed">Fat-washed</option><option value="blended">Blended</option><option value="swizzled">Swizzled</option></select></label>
    <label>Mood<select id="dvMood"><option value="">Any mood</option><option value="refreshing">Refreshing</option><option value="strong">Strong</option><option value="sweet">Sweet</option><option value="bitter">Bitter</option><option value="tropical">Tropical</option><option value="smoky">Smoky</option><option value="floral">Floral</option><option value="savory">Savory</option><option value="tea">Tea</option><option value="weird">Unusual</option></select></label>
    <label>Difficulty<select id="dvDifficulty"><option value="">Any difficulty</option><option value="Easy">Easy</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select></label>
    <label>History<select id="dvHistory"><option value="">Any history</option><option value="untried">Never made</option><option value="stale">Not made in 90 days</option><option value="tried">Tried</option><option value="again">Make again</option></select></label>
  </div>
  <div class="actions"><button id="dvDiscover">Discover three</button><button id="dvReset" class="alt">Reset recent history</button></div>
  <div id="discoveryResultsV5" class="tonight-results"></div>`;
  tonight.prepend(panel);
  [...new Set(DATA.recipes.map(r=>r.base))].sort().forEach(v=>document.getElementById('dvBase').insertAdjacentHTML('beforeend',`<option>${v}</option>`));
  const map={dvAvailability:'availability',dvEra:'era',dvBase:'base',dvService:'service',dvTechnique:'technique',dvMood:'mood',dvDifficulty:'difficulty',dvHistory:'history'};
  Object.entries(map).forEach(([id,k])=>{const el=document.getElementById(id);el.value=prefs[k]||'';el.onchange=()=>{prefs[k]=el.value;savePrefs()}});
  document.getElementById('dvDiscover').onclick=render;document.getElementById('dvReset').onclick=resetRecent;
  const any=document.getElementById('randomAny');if(any){any.textContent='Discover a drink';any.onclick=()=>{switchView('tonight');render()}};
  const make=document.getElementById('randomMake');if(make)make.onclick=()=>{prefs.availability='make';prefs.history='untried';prefs.service='up';prefs.technique='shaken';savePrefs();switchView('tonight');install();render()};
  const wild=document.getElementById('randomWild');if(wild)wild.onclick=()=>{prefs.era='cutting';prefs.availability='make';prefs.mood='weird';prefs.service='';prefs.technique='';savePrefs();switchView('tonight');render()};
  render();
}
window.addEventListener('DOMContentLoaded',install);
document.addEventListener('whb:v5-ready',install);
setTimeout(install,600);
})();