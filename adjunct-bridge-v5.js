(()=>{
const staged=(window.WHB_RECIPE_CHUNKS||[]).flat();
const existing=new Set(DATA.recipes.map(r=>norm(r.name)));
let next=Math.max(0,...DATA.recipes.map(r=>Number(r.id)||0))+1,added=0;
for(const recipe of staged){
  const key=norm(recipe.name);
  if(existing.has(key))continue;
  existing.add(key);
  DATA.recipes.push({...recipe,id:next++});
  added++;
}
window.WHB_ADJUNCT_BRIDGE_ADDED=added;
})();