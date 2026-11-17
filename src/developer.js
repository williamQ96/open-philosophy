// Internal model maturity is deliberately absent from the visitor catalog.
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const developerCopy = {
 en: {developer:'Developer',maturity:'Model maturity',note:'Development reference only. Model detail is independent of philosophical value and existing interactions.',levels:['Level 0 · Whitebox','Level 1 · Refined model'],definitions:['Placeholder geometry awaiting model refinement.','A more detailed first model, still open to further refinement.'],assets:'Community asset sources'},
 zh: {developer:'开发者',maturity:'模型等级',note:'仅供开发参考。模型细化程度与哲学价值、已有交互能力分别记录。',levels:['0 级 · 白模占位','1 级 · 细化模型'],definitions:['基础占位几何，模型细化尚待推进。','已有更细化的初版模型，仍可继续完善。'],assets:'社区素材来源'}
};
export function catalogMarkup(concepts,lang,currentId){
 return concepts.map(item=>`<a href="#${escape(item.id)}" data-id="${escape(item.id)}" ${item.id===currentId?'class="active" aria-current="page"':''}><span>${escape(item.number)}</span><strong>${escape(item[lang].title)}</strong><b aria-hidden="true">↗</b></a>`).join('');
}
// Keep route links in the DOM when the active concept changes so keyboard focus survives.
export function syncCatalog(nav,concepts,lang,currentId){
 if(nav.dataset.language!==lang){nav.innerHTML=catalogMarkup(concepts,lang,currentId);nav.dataset.language=lang;return}
 for(const link of nav.querySelectorAll('a')){
  const active=link.dataset.id===currentId;
  link.classList.toggle('active',active);
  if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
 }
}
export function maturityMarkup(concepts,lang,currentId){
 return concepts.map(item=>`<li${item.id===currentId?' class="current"':''}><span>${escape(item[lang].title)}</span><strong>${escape(developerCopy[lang].levels[item.level])}</strong></li>`).join('');
}
export function renderDeveloperMenu(document,concepts,lang,currentId){
 const copy=developerCopy[lang];
 for(const [id,value] of [['developer-label',copy.developer],['maturity-label',copy.maturity],['maturity-note',copy.note],['asset-sources',copy.assets]])document.getElementById(id).textContent=value;
 document.getElementById('maturity-definitions').innerHTML=copy.levels.map((level,index)=>`<dt>${escape(level)}</dt><dd>${escape(copy.definitions[index])}</dd>`).join('');
 document.getElementById('maturity-list').innerHTML=maturityMarkup(concepts,lang,currentId);
}
