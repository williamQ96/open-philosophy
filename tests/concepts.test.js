import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {concepts,getConcept} from '../src/concepts.js';
import {builders,buildPlaceholder} from '../src/scenes.js';
test('catalog has unique routes, bilingual context, and explicit maturity',()=>{
 assert.equal(concepts.length,23);assert.equal(new Set(concepts.map(c=>c.id)).size,23);
 assert.equal(concepts.filter(c=>c.level===1).length,14);
 assert.ok(concepts.every(c=>builders[c.id]));assert.ok(concepts.slice(0,14).every(c=>c.hasControl));assert.ok(concepts.slice(14).every(c=>!c.hasControl && c.level===0));
 for(const c of concepts){for(const lang of ['en','zh'])for(const key of ['title','question','description','reflection'])assert.ok(c[lang][key],c.id+' '+lang+' '+key);assert.ok(c.source)}
});
test('all scenes build, update at slider extremes, and dispose',()=>{
 for(const c of concepts){const scene=new THREE.Scene();const s=(builders[c.id]||buildPlaceholder)(scene,c);assert.ok(scene.children.length);s.update(1,0);s.update(2,1);s.dispose();assert.equal(scene.children.length,0,c.id)}
});
test('unknown route falls back safely',()=>assert.equal(getConcept('missing').id,'sisyphus'));
test('every scene responds to its update value',()=>{
 const state=scene=>{scene.updateMatrixWorld(true);const parts=[];scene.traverse(o=>{if(o.isMesh)parts.push([o.matrixWorld.elements,o.material.color?.getHex(),o.material.opacity,o.visible])});return JSON.stringify(parts)};
 for(const c of concepts){const scene=new THREE.Scene(),s=builders[c.id](scene,c);s.update(1,0);const before=state(scene);s.update(1,1);assert.notEqual(state(scene),before,c.id);s.dispose()}
});

test('scene disposal releases each owned resource once after updates',()=>{
 for(const c of concepts){
  const scene=new THREE.Scene(),s=(builders[c.id]||buildPlaceholder)(scene,c),resources=new Set();
  scene.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)for(const m of [].concat(o.material))resources.add(m)});
  const counts=new Map();for(const resource of resources){counts.set(resource,0);resource.addEventListener('dispose',()=>counts.set(resource,counts.get(resource)+1))}
  s.update(1,0);s.update(2,1);s.dispose();
  for(const count of counts.values())assert.equal(count,1,c.id+' must release every resource exactly once');
 }
});
