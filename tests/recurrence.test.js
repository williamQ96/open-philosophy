import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('entrance foliage remains clear of the moving traveler',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),arch=scene.getObjectByName('recurrence-entrance-arch'),traveler=scene.getObjectByName('recurrence-traveler'),leaves=[];arch.traverse(o=>{if(o.name==='recurrence-entrance-leaf')leaves.push(o)});assert.equal(leaves.length,14);assert.ok(arch.getObjectByName('recurrence-entrance-vine'));
 for(let i=0;i<=80;i++){view.update(0,i/80);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(traveler,true);for(const leaf of leaves)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(leaf,true)))}view.dispose();
});

test('resting moment is grounded and clears the complete walking cycle',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),moment=scene.getObjectByName('recurrence-resting-moment'),traveler=scene.getObjectByName('recurrence-traveler'),border=[];scene.traverse(o=>{if(o.name==='recurrence-border-rock'||o.name==='recurrence-border-plant')border.push(o)});assert.ok(moment?.getObjectByName('recurrence-resting-rock'));for(let i=0;i<=128;i++){view.update(0,i/128);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(moment,true);assert.ok(Math.abs(bounds.min.y-.05)<1e-6);assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(traveler,true)));for(const item of border)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(item,true)))}view.dispose();
});

test('stacking moment remains grounded and clear of the traveler',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),moment=scene.getObjectByName('recurrence-stacking-moment'),traveler=scene.getObjectByName('recurrence-traveler');assert.ok(moment);
 for(let i=0;i<=128;i++){view.update(0,i/128);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(moment,true);assert.ok(Math.abs(bounds.min.y-.05)<1e-6);assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(traveler,true)))}view.dispose();
});

test('tree earth and stones stay inside the seating ring',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),earth=scene.getObjectByName('recurrence-tree-earth'),stones=scene.getObjectByName('recurrence-tree-ground-stones'),p=earth.geometry.getAttribute('position'),matrix=new THREE.Matrix4(),point=new THREE.Vector3();assert.ok(earth&&stones);for(let i=0;i<p.count;i++)assert.ok(Math.hypot(p.getX(i),p.getY(i))<1.25);for(let i=0;i<stones.count;i++){stones.getMatrixAt(i,matrix);point.setFromMatrixPosition(matrix);assert.ok(Math.hypot(point.x,point.z)<1.1);assert.ok(point.y>=.05)}view.dispose();
});

test('central tree trunk meets the garden and stays clear of the traveler',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),trunk=scene.getObjectByName('recurrence-tree-trunk'),traveler=scene.getObjectByName('recurrence-traveler'),bark=[];scene.traverse(o=>{if(o.name==='recurrence-tree-bark')bark.push(o)});assert.ok(trunk);assert.equal(bark.length,13);scene.updateMatrixWorld(true);const treeBounds=new THREE.Box3().setFromObject(trunk,true);assert.ok(Math.abs(treeBounds.min.y-.05)<1e-6);assert.ok(treeBounds.max.x-treeBounds.min.x>.7);
 for(let i=0;i<36;i++){view.update(0,i/36);scene.updateMatrixWorld(true);assert.ok(!treeBounds.intersectsBox(new THREE.Box3().setFromObject(traveler,true)))}view.dispose();
});

test('autumn tree is grounded and clears the traveler around the entire cycle',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),tree=scene.getObjectByName('recurrence-autumn-tree'),traveler=scene.getObjectByName('recurrence-traveler');assert.ok(tree&&traveler);
 for(let i=0;i<=100;i++){view.update(0,i/100);scene.updateMatrixWorld(true);assert.ok(Math.abs(new THREE.Box3().setFromObject(tree,true).min.y-.05)<1e-6);const person=new THREE.Box3().setFromObject(traveler,true);for(const part of tree.children)assert.ok(!new THREE.Box3().setFromObject(part,true).intersectsBox(person))}view.dispose();
});

test('recurrence traveler stays upright on the path and returns to the same pose',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),traveler=scene.getObjectByName('recurrence-traveler');let initialPosition,initialDirection;
 for(let i=0;i<=100;i++){
  view.update(0,i/100);const p=traveler.position,forward=new THREE.Vector3(0,0,1).applyQuaternion(traveler.quaternion),radial=new THREE.Vector3(p.x,0,p.z).normalize();
  assert.ok(Math.abs(Math.hypot(p.x,p.z)-3.225)<1e-9);assert.equal(p.y,.13);assert.ok(Math.abs(forward.dot(radial))<1e-9,'figure faces along the tangent');
  if(i===0){initialPosition=p.clone();initialDirection=forward.clone()}if(i===100){assert.ok(p.distanceTo(initialPosition)<1e-9);assert.ok(forward.distanceTo(initialDirection)<1e-9)}
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('recurrence garden keeps the moving traveler and outer ornaments clear of the route',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),traveler=scene.getObjectByName('recurrence-traveler');
 const ornaments=[];scene.traverse(object=>{if(['recurrence-seat','recurrence-border-plant','recurrence-cairn','recurrence-inner-plant'].includes(object.name))ornaments.push(object)});
 assert.equal(ornaments.filter(o=>o.name==='recurrence-seat').length,10);
 assert.equal(ornaments.filter(o=>o.name==='recurrence-cairn').length,3);
 scene.updateMatrixWorld(true);
 for(let i=0;i<72;i++){
  view.update(0,i/72);scene.updateMatrixWorld(true);
  const personBounds=new THREE.Box3().setFromObject(traveler);
  for(const ornament of ornaments)assert.equal(personBounds.intersectsBox(new THREE.Box3().setFromObject(ornament)),false,`${ornament.name} obstructs the traveler at ${i}/72`);
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('ring path and stone seats meet their supporting surfaces',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),sides=[],seats=[];scene.traverse(o=>{if(o.name==='recurrence-path-side')sides.push(o);if(o.name==='recurrence-seat')seats.push(o)});assert.equal(sides.length,2);assert.equal(seats.length,10);const entrance=new THREE.Box3().setFromObject(scene.getObjectByName('recurrence-entrance-path'),true);assert.ok(Math.abs(entrance.max.y-.1225)<1e-6);assert.ok(Math.abs(entrance.max.z+3.65)<1e-6);
 for(const side of sides){const box=new THREE.Box3().setFromObject(side,true);assert.ok(Math.abs(box.min.y-.05)<1e-6);assert.ok(Math.abs(box.max.y-.1225)<1e-6)}
 for(const seat of seats)assert.ok(Math.abs(new THREE.Box3().setFromObject(seat,true).min.y-.05)<1e-6);
 for(let i=0;i<=24;i++){view.update(0,i/24);scene.updateMatrixWorld(true);const bottom=new THREE.Box3().setFromObject(scene.getObjectByName('recurrence-traveler'),true).min.y;assert.ok(Math.abs(bottom-.1225)<1e-6)}
 view.dispose();
});

test('traveler alternates steps with a grounded foot and closes the gait cycle',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),shoes=[];scene.traverse(o=>{if(o.name==='recurrence-shoe')shoes.push(o)});assert.equal(shoes.length,2);
 let sawLift=false;for(let i=0;i<=128;i++){view.update(0,i/128);scene.updateMatrixWorld(true);const bottoms=shoes.map(shoe=>new THREE.Box3().setFromObject(shoe,true).min.y);assert.ok(Math.abs(Math.min(...bottoms)-.1225)<1e-6);assert.ok(bottoms.every(y=>y>=.1225-1e-6));if(Math.max(...bottoms)>.17)sawLift=true}assert.ok(sawLift);
 view.update(0,0);const start=shoes.map(shoe=>shoe.parent.position.clone());view.update(0,1);shoes.forEach((shoe,i)=>assert.ok(shoe.parent.position.distanceTo(start[i])<1e-9));
 view.dispose();
});

test('the reading moment rests on the outer ground and clears the full walking cycle',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),reader=scene.getObjectByName('recurrence-reading-moment'),traveler=scene.getObjectByName('recurrence-traveler');assert.ok(reader&&reader.getObjectByName('recurrence-reader-body'));
 for(let i=0;i<=128;i++){view.update(0,i/128);scene.updateMatrixWorld(true);const readerBounds=new THREE.Box3().setFromObject(reader,true),travelerBounds=new THREE.Box3().setFromObject(traveler,true);assert.ok(Math.abs(readerBounds.min.y-.05)<1e-6);assert.ok(!readerBounds.intersectsBox(travelerBounds),'reader must remain outside the moving route')}view.dispose();
});

test('reading alcove remains beyond the traveler throughout the cycle',()=>{
 const scene=new THREE.Scene(),view=builders.recurrence(scene),library=scene.getObjectByName('recurrence-library'),traveler=scene.getObjectByName('recurrence-traveler'),books=[];library.traverse(o=>{if(o.name==='recurrence-library-book')books.push(o)});assert.equal(books.length,15);assert.ok(library.getObjectByName('recurrence-library-arch'));
 for(let i=0;i<=128;i++){view.update(0,i/128);scene.updateMatrixWorld(true);assert.ok(!new THREE.Box3().setFromObject(library,true).intersectsBox(new THREE.Box3().setFromObject(traveler,true)))}view.dispose();
});
