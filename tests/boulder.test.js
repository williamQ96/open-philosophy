import {test} from 'node:test';import assert from 'node:assert/strict';import * as THREE from 'three';
import {buildSisyphus} from '../src/scenes.js';
const track=o=>{let n=0;o.addEventListener('dispose',()=>n++);return ()=>n};
test('late boulder load is disposed after scene switch; fallback stays usable',()=>{
 const scene=new THREE.Scene();let deliver;const state=buildSisyphus(scene,null,callback=>deliver=callback);state.update(0,.5);state.dispose();
 const geometry=new THREE.BoxGeometry(),material=new THREE.MeshStandardMaterial(),g=track(geometry),m=track(material),root=new THREE.Group();root.add(new THREE.Mesh(geometry,material));deliver(root);assert.equal(g(),1);assert.equal(m(),1);assert.equal(scene.children.length,0);
});
test('loaded boulder replaces fallback and is disposed with scene',()=>{
 const scene=new THREE.Scene();let deliver;const state=buildSisyphus(scene,null,callback=>deliver=callback);
 const geometry=new THREE.BoxGeometry(),material=new THREE.MeshStandardMaterial(),g=track(geometry),m=track(material),root=new THREE.Group();root.add(new THREE.Mesh(geometry,material));deliver(root);assert.equal(m(),1);assert.equal(g(),0);assert.ok(scene.getObjectByProperty('geometry',geometry));state.update(1,.5);state.dispose();assert.equal(g(),1);
});
test('duplicate loader callbacks do not release adopted geometry or release it twice after disposal',()=>{
 const scene=new THREE.Scene();let deliver;const state=buildSisyphus(scene,null,callback=>deliver=callback);
 const geometry=new THREE.BoxGeometry(),material=new THREE.MeshStandardMaterial(),g=track(geometry),m=track(material),root=new THREE.Group();root.add(new THREE.Mesh(geometry,material));
 deliver(root);deliver(root);assert.equal(g(),0);assert.equal(m(),1);assert.ok(scene.getObjectByProperty('geometry',geometry));
 state.dispose();deliver(root);assert.equal(g(),1);assert.equal(m(),1);
});
test('different deliveries sharing resources cannot dispose the adopted geometry',()=>{
 const scene=new THREE.Scene();let deliver;const state=buildSisyphus(scene,null,callback=>deliver=callback);
 const geometry=new THREE.BoxGeometry(),material=new THREE.MeshStandardMaterial(),g=track(geometry),m=track(material),root=new THREE.Group();root.add(new THREE.Mesh(geometry,material));
 deliver(root);deliver(root.clone());const extra=new THREE.BoxGeometry(),e=track(extra),mixed=root.clone();mixed.add(new THREE.Mesh(extra,material));deliver(mixed);
 assert.equal(g(),0);assert.equal(m(),1);assert.equal(e(),1);state.dispose();deliver(root.clone());assert.equal(g(),1);assert.equal(m(),1);
});
