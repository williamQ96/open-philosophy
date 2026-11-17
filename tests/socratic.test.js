import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('stone arch crown leaves a clear opening and meets the pier capitals',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),arch=scene.getObjectByName('socratic-stone-arch'),crown=scene.getObjectByName('socratic-arch-crown'),joints=[];arch.traverse(o=>{if(o.name==='socratic-arch-stone-joint')joints.push(o)});assert.ok(crown);assert.equal(joints.length,7);scene.updateMatrixWorld(true);
 const ray=new THREE.Raycaster(arch.localToWorld(new THREE.Vector3(0,2.1,1)),new THREE.Vector3(0,0,-1).transformDirection(arch.matrixWorld));assert.equal(ray.intersectObject(crown).length,0,'center of arch must remain open');
 crown.geometry.computeBoundingBox();const b=crown.geometry.boundingBox;assert.ok(b.min.x<-.73&&b.max.x>.73&&Math.abs(b.max.z-b.min.z-.28)<1e-6);assert.ok(Math.abs(crown.position.y-1.8)<1e-6);view.dispose();
});

test('dialogue emphasis and gestures shift between the seated participants',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),people=[],bubbles=[];
 scene.traverse(o=>{if(o.name==='socratic-participant')people.push(o);if(o.name==='socratic-bubble')bubbles.push(o)});
 assert.equal(people.length,2);assert.equal(bubbles.length,2);view.update(0,0);
 assert.ok(bubbles[0].scale.x>bubbles[1].scale.x);const first=people.map(p=>p.getObjectByName('socratic-arm').rotation.x);
 view.update(0,1);assert.ok(bubbles[0].scale.x<bubbles[1].scale.x);const last=people.map(p=>p.getObjectByName('socratic-arm').rotation.x);assert.notDeepEqual(first,last);
 view.update(0,0);assert.deepEqual(people.map(p=>p.getObjectByName('socratic-arm').rotation.x),first);
 view.dispose();assert.equal(scene.children.length,0);
});

test('new background furnishings stay clear of seated participants',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),people=[];scene.traverse(o=>{if(o.name==='socratic-participant')people.push(o)});const planter=scene.getObjectByName('socratic-planter'),bust=scene.getObjectByName('socratic-bust');
 assert.ok(planter&&bust);view.update(0,.5);scene.updateMatrixWorld(true);const potBounds=new THREE.Box3().setFromObject(planter);for(const p of people)assert.ok(!potBounds.intersectsBox(new THREE.Box3().setFromObject(p)));
 assert.ok(bust.position.y>2);view.dispose();assert.equal(scene.children.length,0);
});

test('armillary pedestal is grounded and clear of the animated dialogue',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),object=scene.getObjectByName('socratic-armillary'),others=[];scene.traverse(o=>{if(['socratic-participant','socratic-bubble','socratic-shared-question','socratic-table'].includes(o.name))others.push(o)});assert.ok(object?.getObjectByName('socratic-armillary-pedestal'));for(const value of [0,.5,1]){view.update(0,value);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(object,true);assert.ok(Math.abs(bounds.min.y-.05)<1e-6);for(const other of others)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(other,true)))}view.dispose();
});

test('chairs, shoes and table stand on the carpet',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),feet=[];scene.traverse(o=>{if(['socratic-chair-leg','socratic-shoe','socratic-table-base'].includes(o.name))feet.push(o)});scene.updateMatrixWorld(true);
 const top=new THREE.Box3().setFromObject(scene.getObjectByName('socratic-carpet'),true).max.y;assert.equal(feet.length,13);
 for(const foot of feet)assert.ok(Math.abs(new THREE.Box3().setFromObject(foot,true).min.y-top)<1e-6,'furniture and shoes meet the carpet');
 view.dispose();
});

test('shared question remains clear of the speakers and their dialogue cues',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),question=scene.getObjectByName('socratic-shared-question'),others=[];
 scene.traverse(o=>{if(o.name==='socratic-participant'||o.name==='socratic-bubble')others.push(o)});assert.ok(question);assert.equal(others.length,4);
 for(const value of [0,.5,1]){view.update(0,value);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(question,true);for(const object of others)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(object,true)))}
 view.dispose();
});

test('books of varied height rest on their shelves',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),books=[];scene.traverse(o=>{if(o.name==='socratic-shelf-book')books.push(o)});assert.equal(books.length,15);
 for(const book of books){const bottom=book.position.y-book.geometry.parameters.height/2;assert.ok([.15,.8,1.45].some(y=>Math.abs(bottom-y)<1e-6))}
 view.dispose();
});

test('hands remain attached to their forearms as dialogue gestures change',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),people=[];scene.traverse(o=>{if(o.name==='socratic-participant')people.push(o)});assert.equal(people.length,2);
 for(const value of [0,.25,.5,.75,1]){view.update(0,value);scene.updateMatrixWorld(true);for(const p of people)for(const kind of ['active','resting']){const forearm=p.getObjectByName(`socratic-${kind}-forearm`),hand=p.getObjectByName(`socratic-${kind}-hand`),end=forearm.localToWorld(new THREE.Vector3(0,forearm.geometry.parameters.height/2,0)),center=hand.getWorldPosition(new THREE.Vector3());assert.ok(end.distanceTo(center)<1e-6)}}
 view.dispose();
});

test('seated drapery clears the carpet and leaves shoes below its hem',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),people=[];scene.traverse(o=>{if(o.name==='socratic-participant')people.push(o)});scene.updateMatrixWorld(true);assert.equal(people.length,2);
 const floorTop=new THREE.Box3().setFromObject(scene.getObjectByName('socratic-carpet'),true).max.y;for(const person of people){const drape=person.getObjectByName('socratic-lap-drape'),shoes=[];person.traverse(o=>{if(o.name==='socratic-shoe')shoes.push(o)});assert.ok(drape&&person.getObjectByName('socratic-chair-back-cushion'));const hem=new THREE.Box3().setFromObject(drape,true).min.y;assert.ok(hem>floorTop);for(const shoe of shoes)assert.ok(new THREE.Box3().setFromObject(shoe,true).max.y<hem)}view.dispose();
});

test('back wall is grounded and clears participants and dialogue cues',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),wall=scene.getObjectByName('socratic-back-wall'),others=[];scene.traverse(o=>{if(['socratic-participant','socratic-bubble','socratic-shared-question'].includes(o.name))others.push(o)});assert.equal(wall.children.length,40);assert.equal(others.length,5);
 for(const value of [0,.5,1]){view.update(0,value);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(wall,true);assert.ok(Math.abs(bounds.min.y-.05)<1e-6);for(const o of others)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(o,true)))}view.dispose();
});
test('table books are supported inside the round tabletop',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),table=scene.getObjectByName('socratic-table'),stack=scene.getObjectByName('socratic-table-books');scene.updateMatrixWorld(true);assert.ok(stack);const bounds=new THREE.Box3().setFromObject(stack,true),center=table.getWorldPosition(new THREE.Vector3()),scale=table.getWorldScale(new THREE.Vector3());for(const x of [bounds.min.x,bounds.max.x])for(const z of [bounds.min.z,bounds.max.z])assert.ok(Math.hypot(x-center.x,z-center.z)<1.08*scale.x);assert.ok(Math.abs(bounds.min.y-table.localToWorld(new THREE.Vector3(0,.895,0)).y)<1e-5);view.dispose();
});

test('shared diagram remains on its page as dialogue changes',()=>{
 const scene=new THREE.Scene(),view=builders.socratic(scene),pages=[],rings=[];scene.traverse(o=>{if(o.name==='socratic-table-page')pages.push(o);if(o.name==='socratic-table-diagram')rings.push(o)});assert.equal(pages.length,2);assert.equal(rings.length,3);const page=pages.find(p=>p.position.x<0);
 for(const value of [0,.5,1]){view.update(0,value);for(const ring of rings){assert.equal(ring.parent,page.parent);assert.ok(Math.abs(ring.position.x-page.position.x)+.111<.23);assert.ok(Math.abs(ring.position.z-page.position.z)+.111<.31);assert.ok(Math.abs(ring.position.y-.006-(page.position.y+.02))<1e-6)}}view.dispose();
});
