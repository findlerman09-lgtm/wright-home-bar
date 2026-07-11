(()=>{
async function loadPayload(){
  const names=['expansion-v5-1.b64','expansion-v5-2.b64','expansion-v5-3.b64'];
  const parts=await Promise.all(names.map(async name=>{
    const response=await fetch(name+'?v=5');
    if(!response.ok)throw new Error(`Could not load ${name}`);
    return (await response.text()).trim();
  }));
  if(!('DecompressionStream' in window))throw new Error('This browser does not support the compressed cocktail expansion.');
  const bytes=Uint8Array.from(atob(parts.join('')),c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
}
window.WHB_V5_READY=(async()=>{
  const payload=await loadPayload();
  const catalog=window.WHB_INGREDIENT_CATALOG||[];
  const catalogSeen=new Set(catalog.map(x=>norm(x.name)));
  for(const item of payload.catalog){
    const key=norm(item.name);
    if(!catalogSeen.has(key)){catalog.push(item);catalogSeen.add(key)}
  }
  window.WHB_INGREDIENT_CATALOG=catalog;
  const existing=new Set(DATA.recipes.map(r=>norm(r.name)));
  let next=Math.max(0,...DATA.recipes.map(r=>Number(r.id)||0))+1,added=0;
  for(const recipe of payload.recipes){
    const key=norm(recipe.name);
    if(existing.has(key))continue;
    existing.add(key);
    DATA.recipes.push({...recipe,id:next++,strength:recipe.strength||((recipe.tags||[]).includes('Spirit Forward')||(recipe.tags||[]).includes('Strong')?'Strong':(recipe.tags||[]).includes('Low ABV')?'Light':'Medium')});
    added++;
  }
  window.WHB_V5_ADDED=added;
  document.dispatchEvent(new CustomEvent('whb:v5-ready',{detail:{added}}));
  return {added};
})().catch(error=>{
  console.error('Wright Home Bar v5 data load failed',error);
  return {added:0,error:String(error)};
});
})();