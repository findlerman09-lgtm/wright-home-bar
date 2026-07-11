(()=>{
const HOUSE_TAG='Wright House Original';
const renames={
  'Cucumber Basil Gimlet':{name:'The Conservatory',subtitle:'Gin, cucumber, basil and lime'},
  'Matcha Gin Sour':{name:'Verdant Hour',subtitle:'Gin, matcha, honey and lemon'},
  'Rosemary Cranberry Collins':{name:'Winter Branch',subtitle:'Vodka, cranberry, rosemary and soda'},
  'Rosewater Elderflower Sour':{name:'Glass Garden',subtitle:'Gin, elderflower, rose water and lemon'},
  'Coffee Rum Old Fashioned':{name:'Night Ledger',subtitle:'Dark rum, cold brew, demerara and chocolate bitters'},
  'Blood Orange Mezcal Sour':{name:'Ember Orchard',subtitle:'Mezcal, blood orange, lime and agave'},
  'Cinnamon Pineapple Swizzle':{name:'Spice Route',subtitle:'Pineapple rum, pineapple, lime and cinnamon'},
  'Pear Elderflower Fizz':{name:'Orchard Bell',subtitle:'Vodka, pear, elderflower, lemon and soda'},
  'Strawberry Basil Vodka Sour':{name:'Summer Glasshouse',subtitle:'Vodka, strawberry, basil and lemon'},
  'Rosemary Apple Aquavit Sour':{name:'North Orchard',subtitle:'Aquavit, apple, rosemary and lemon'},
  'Cucumber Basil Gimlet No. 2':{name:'The Conservatory',subtitle:'Gin, cucumber, basil and lime'},
  'Trade Wind No. 2':{name:'Spice Route',subtitle:'Pineapple rum, pineapple, lime and cinnamon'}
};
const establishedNumbered=new Set([
  'corpse reviver no 1','corpse reviver no 2','pimm s cup no 1','french 75','ward eight','twentieth century','20th century'
]);
const seen=new Set(DATA.recipes.map(r=>norm(r.name)));
for(const recipe of DATA.recipes){
  const change=renames[recipe.name];
  if(change){
    const old=recipe.name;
    const proposed=norm(change.name);
    seen.delete(norm(old));
    if(!seen.has(proposed))recipe.name=change.name;
    seen.add(norm(recipe.name));
    recipe.subtitle=change.subtitle;
    recipe.originalWorkingName=old;
    recipe.tags=[...new Set([...(recipe.tags||[]),HOUSE_TAG])];
    recipe.source='Wright Home Bar original';
  }
  const numbered=/(?:#|\bno\.?\s*)\d+\b/i.test(recipe.name);
  if(numbered&&!establishedNumbered.has(norm(recipe.name))&&(recipe.tags||[]).some(t=>['Craft','Cutting Edge',HOUSE_TAG].includes(t))){
    recipe.namingReview=true;
  }
}
const oldCard=window.card||card;
window.card=card=function(r){
  const html=oldCard(r);
  return r.subtitle?html.replace('</h3>',`</h3><div class="recipe-subtitle">${r.subtitle}</div>`):html;
};
const oldOpen=window.openRecipe||openRecipe;
window.openRecipe=openRecipe=function(id){
  oldOpen(id);
  const r=DATA.recipes.find(x=>x.id===id),title=document.getElementById('mName');
  if(!title)return;
  let sub=document.getElementById('mSubtitle');
  if(!sub){sub=document.createElement('div');sub.id='mSubtitle';sub.className='recipe-subtitle modal-subtitle';title.insertAdjacentElement('afterend',sub)}
  sub.textContent=r?.subtitle||'';
  sub.hidden=!r?.subtitle;
};
if(!document.getElementById('houseNameStyles')){
  const style=document.createElement('style');style.id='houseNameStyles';style.textContent='.recipe-subtitle{font-size:.78rem;line-height:1.3;opacity:.72;margin:.15rem 0 .45rem}.modal-subtitle{font-size:.95rem;margin-top:-.25rem}.card .recipe-subtitle{min-height:2em}';document.head.appendChild(style)
}
window.WHB_NAMING_POLICY={version:'1.0',houseTag:HOUSE_TAG,renamed:Object.keys(renames).length,numberedReview:DATA.recipes.filter(r=>r.namingReview).map(r=>r.name)};
})();