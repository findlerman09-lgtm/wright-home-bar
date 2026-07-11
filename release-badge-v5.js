(()=>{
  function installReleaseBadge(){
    const version='5.0.0';
    const count=window.DATA?.recipes?.length||0;
    window.WHB_RELEASE={version,totalRecipes:count};
    const brand=document.querySelector('.brandmark small');
    if(brand)brand.textContent=`EST. 2026 · v${version}`;
    let badge=document.getElementById('releaseBadge');
    if(!badge){
      badge=document.createElement('div');
      badge.id='releaseBadge';
      badge.className='release-badge';
      const hero=document.querySelector('.hero');
      const stats=document.querySelector('.hero .stats');
      if(hero)hero.insertBefore(badge,stats||null);
    }
    badge.textContent=`Wright Home Bar v${version} · ${count} recipes`;
    document.title=`Wright Home Bar v${version}`;
    if(!document.getElementById('releaseBadgeStyles')){
      const style=document.createElement('style');
      style.id='releaseBadgeStyles';
      style.textContent='.release-badge{display:inline-block;margin:8px 0 2px;padding:6px 10px;border:1px solid rgba(199,154,74,.6);background:rgba(0,0,0,.2);color:var(--gold);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;font-weight:bold}';
      document.head.appendChild(style);
    }
  }
  window.installReleaseBadge=installReleaseBadge;
  document.addEventListener('whb:v5-ready',installReleaseBadge);
  window.addEventListener('DOMContentLoaded',()=>setTimeout(installReleaseBadge,700));
  setTimeout(installReleaseBadge,1200);
})();
