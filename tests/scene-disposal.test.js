import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';
import {concepts} from '../src/concepts.js';

test('switching scenes releases instance buffers and shared resources exactly once',()=>{
 let instances=0,textures=0;
 for(const concept of concepts){
  const scene=new THREE.Scene(),view=builders[concept.id](scene,concept),counts=new Map();
  const watch=resource=>{if(!resource||counts.has(resource))return;counts.set(resource,0);resource.addEventListener('dispose',()=>counts.set(resource,counts.get(resource)+1))};
  scene.traverse(object=>{if(object.isInstancedMesh){watch(object);instances++}watch(object.geometry);for(const material of [].concat(object.material||[])){watch(material);for(const value of Object.values(material))if(value?.isTexture){if(!counts.has(value))textures++;watch(value)}}});
  view.dispose();assert.equal(scene.children.length,0,concept.id);
  for(const [resource,count] of counts)assert.equal(count,1,`${concept.id}: ${resource.type||resource.constructor.name} disposed ${count} times`);
 }
 assert.ok(instances>0,'the audit must cover instanced models');
 assert.ok(textures>0,'the audit must cover scene-owned material textures');
});
