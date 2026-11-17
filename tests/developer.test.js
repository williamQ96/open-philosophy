import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {concepts} from '../src/concepts.js';
import {catalogMarkup,maturityMarkup,developerCopy,syncCatalog} from '../src/developer.js';
test('visitor catalog never exposes model maturity in either language',()=>{
 for(const lang of ['en','zh']){
  const html=catalogMarkup(concepts,lang,'cave');
  assert.equal((html.match(/<a /g)||[]).length,23);
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
  assert.doesNotMatch(html,/level|whitebox|placeholder|白模|白膜|[01] 级/i);
  for(const concept of concepts)assert.doesNotMatch(concept[lang].reflection,/whitebox|placeholder|白模|白膜/i);
 }
});
test('developer submenu retains fourteen refined models and lists nine level-zero studies',()=>{
 for(const lang of ['en','zh']){
  const html=maturityMarkup(concepts,lang,'cave');
  assert.equal((html.match(/<li/g)||[]).length,23);
  assert.equal(html.split(developerCopy[lang].levels[1]).length-1,14);
  assert.equal(html.split(developerCopy[lang].levels[0]).length-1,9);
 }
});
test('developer maturity is nested behind two initially closed disclosures',()=>{
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(main,/<details class="developer-menu" id="developer-menu">.*<details id="maturity-menu">/s);
 assert.doesNotMatch(main,/<details[^>]*\sopen(?:[ =>])/);
 assert.match(main,/hidden=!c.hasControl/);
 assert.doesNotMatch(main,/c.level\?/);
});


test('route changes update catalog links in place',()=>{
 const makeLink=id=>({dataset:{id},classList:{active:false,toggle(_,value){this.active=value}},attrs:{},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]}});
 const first=makeLink('sisyphus'),second=makeLink('panopticon');
 const nav={dataset:{language:'en'},innerHTML:'unchanged',querySelectorAll(){return [first,second]}};
 syncCatalog(nav,concepts,'en','panopticon');
 assert.equal(nav.innerHTML,'unchanged');assert.equal(first.classList.active,false);assert.equal(second.classList.active,true);assert.equal(second.attrs['aria-current'],'page');
});
