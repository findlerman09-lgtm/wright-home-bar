(()=>{
function syncRows(){
  const unlocks={};
  DATA.recipes.forEach(r=>{const m=missing(r);if(m.length===1)unlocks[norm(m[0])]=(unlocks[norm(m[0])]||0)+1});
  return allInventoryItems().map(name=>{
    const key=norm(name),stock=stockRecord(key),match=matchIngredient(name);
    return {
      name,
      key,
      category:categoryOf(name),
      owned:presentName(key),
      stock:stock.level||'full',
      opened:stock.opened||'',
      refrigerated:Boolean(stock.refrigerated),
      pantry_assumption:pantry.has(key),
      match_status:match.status,
      available_via:match.via||'',
      direct_recipe_uses:DATA.recipes.filter(r=>r.ingredients.some(i=>norm(i[0])===key)).length,
      recipes_unlocked_if_added:unlocks[key]||0
    };
  });
}
function syncPayload(){
  const rows=syncRows();
  return {
    format:'wright-home-bar-inventory-sync',
    version:1,
    exported:new Date().toISOString(),
    instructions:'Upload this file to ChatGPT and ask it to update the Wright Home Bar GitHub inventory. owned, stock, opened, refrigerated and pantry_assumption are authoritative.',
    summary:{
      total_items:rows.length,
      owned:rows.filter(x=>x.owned).length,
      low:rows.filter(x=>x.stock==='low').length,
      empty:rows.filter(x=>x.stock==='empty').length,
      wishlist:rows.filter(x=>x.stock==='wishlist').length
    },
    items:rows,
    shopping:rows.filter(x=>!x.owned||x.stock==='wishlist'||x.stock==='empty').sort((a,b)=>b.recipes_unlocked_if_added-a.recipes_unlocked_if_added||a.name.localeCompare(b.name))
  };
}
function download(name,text,type){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function csvEscape(v){const s=String(v??'');return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
function exportSyncJson(){download('wright-home-bar-inventory-sync.json',JSON.stringify(syncPayload(),null,2),'application/json')}
function exportSyncCsv(){const rows=syncRows(),cols=['name','category','owned','stock','opened','refrigerated','pantry_assumption','match_status','available_via','direct_recipe_uses','recipes_unlocked_if_added'];const text=[cols.join(','),...rows.map(r=>cols.map(c=>csvEscape(r[c])).join(','))].join('\n');download('wright-home-bar-inventory-sync.csv',text,'text/csv')}
async function copySyncJson(){const text=JSON.stringify(syncPayload(),null,2);try{await navigator.clipboard.writeText(text);alert('Inventory sync JSON copied. Paste it into ChatGPT.')}catch{const box=$('#syncText');box.value=text;box.select();alert('Copy was blocked. The JSON is selected below.')}}
function renderSync(){if(!$('#syncText'))return;const p=syncPayload();$('#syncText').value=JSON.stringify(p,null,2);$('#syncSummary').textContent=`${p.summary.owned} owned · ${p.summary.low} low · ${p.summary.empty} empty · ${p.summary.wishlist} wishlist`;
  $('#syncShopping').innerHTML=p.shopping.slice(0,20).map(x=>`<div class="sync-shopping-row"><b>${x.name}</b><span>${x.stock==='wishlist'?'Wishlist':x.stock==='empty'?'Empty':'Not owned'} · unlocks ${x.recipes_unlocked_if_added}</span></div>`).join('')||'<p>No shopping items are currently flagged.</p>';
}
function setRecipeVisibility(show){
  const grid=$('#recipeGrid'),head=grid?.previousElementSibling,button=$('#toggleRecipes');
  if(!grid||!button)return;
  grid.hidden=!show;
  if(head)head.classList.toggle('recipes-collapsed',!show);
  button.textContent=show?'Hide recipes':'Show recipes';
  button.setAttribute('aria-expanded',String(show));
  localStorage.setItem('whb_show_recipes',show?'1':'0');
}
function installRecipeToggle(){
  const actions=document.querySelector('#recipes .actions');
  if(!actions||$('#toggleRecipes'))return;
  const button=document.createElement('button');
  button.id='toggleRecipes';button.className='alt';button.type='button';
  button.onclick=()=>setRecipeVisibility($('#recipeGrid').hidden);
  actions.prepend(button);
  setRecipeVisibility(localStorage.getItem('whb_show_recipes')==='1');
}
window.exportSyncJson=exportSyncJson;window.exportSyncCsv=exportSyncCsv;window.copySyncJson=copySyncJson;window.renderSync=renderSync;
const originalSwitch=window.switchView;window.switchView=function(id){originalSwitch(id);if(id==='sync')renderSync()};
$('#exportSyncJson')?.addEventListener('click',exportSyncJson);$('#exportSyncCsv')?.addEventListener('click',exportSyncCsv);$('#copySyncJson')?.addEventListener('click',copySyncJson);$('#refreshSync')?.addEventListener('click',renderSync);
installRecipeToggle();
})();