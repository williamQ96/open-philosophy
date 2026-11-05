import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {concepts,getConcept} from '../src/concepts.js';
import {builders,buildPlaceholder} from '../src/scenes.js';
test('catalog has unique routes, bilingual context, and explicit maturity',()=>{
 assert.equal(concepts.length,14);assert.equal(new Set(concepts.map(c=>c.id)).size,14);
 assert.deepEqual(concepts.filter(c=>c.level===1).map(c=>c.id),['sisyphus','panopticon','cave','ship','veil']);
 for(const c of concepts){for(const lang of ['en','zh'])for(const key of ['title','question','description','reflection','control'])assert.ok(c[lang][key],c.id+' '+lang+' '+key);assert.ok(c.source)}
});
test('all scenes build, update at slider extremes, and dispose',()=>{
 for(const c of concepts){const scene=new THREE.Scene();const s=(builders[c.id]||buildPlaceholder)(scene,c);assert.ok(scene.children.length);s.update(1,0);s.update(2,1);s.dispose();assert.equal(scene.children.length,0,c.id)}
});
test('unknown route falls back safely',()=>assert.equal(getConcept('missing').id,'sisyphus'));
test('level 1 concept controls change scene state',()=>{
 const state=scene=>{const parts=[];scene.traverse(o=>{if(o.isMesh)parts.push([o.position.x,o.position.y,o.position.z,o.scale.x,o.scale.y,o.rotation.y,o.material.color?.getHex(),o.material.opacity])});return JSON.stringify(parts)};
 for(const id of ['cave','ship','veil']){const scene=new THREE.Scene(),s=builders[id](scene);s.update(1,0);const before=state(scene);s.update(1,1);assert.notEqual(state(scene),before,id);s.dispose()}
});
