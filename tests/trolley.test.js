import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';
test('meadow grass remains outside the track bed and switch',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),grass=scene.getObjectByName('trolley-meadow-grass'),matrix=new THREE.Matrix4(),point=new THREE.Vector3(),centers=[];assert.ok(grass?.count>100);
 for(let i=0;i<=320;i++){const x=-4+i*8/320;if(x<=-1.4)centers.push([x,0]);else for(const side of [-1,1])centers.push([x,trolleyCurve(x,side).z])}
 for(let i=0;i<grass.count;i++){grass.getMatrixAt(i,matrix);point.setFromMatrixPosition(matrix);assert.ok(Math.hypot(point.x,point.z)<4.9);assert.ok(Math.hypot(point.x+1,point.z-2.25)>.75);for(const [x,z] of centers)assert.ok(Math.hypot(point.x-x,point.z-z)>.73)}view.dispose();
});

test('both groups face the approaching tram',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),people=[];scene.traverse(o=>{if(o.name==='trolley-group-person'||o.name==='trolley-single-person')people.push(o)});view.update(0,0);scene.updateMatrixWorld(true);const tram=scene.getObjectByName('trolley-cart').getWorldPosition(new THREE.Vector3());
 for(const person of people){const position=person.getWorldPosition(new THREE.Vector3()),forward=new THREE.Vector3(0,0,1).applyQuaternion(person.getWorldQuaternion(new THREE.Quaternion())),toward=tram.clone().sub(position).setY(0).normalize();assert.ok(forward.dot(toward)>.7,'figure should face toward the tram approach')}view.dispose();
});
import {trolleyCurve} from '../src/refined-scenes.js';

test('tram follows selected junction curve and the chosen branch is highlighted',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),cart=scene.getObjectByName('trolley-cart');
 for(const [value,branch,index] of [[0,-1,0],[1,1,1]]){
  for(const time of [0,5,7.5,8.2]){view.update(time,value);const point=trolleyCurve(cart.position.x,branch);assert.ok(Math.abs(cart.position.z-point.z)<1e-9);assert.ok(Math.abs(cart.rotation.y+Math.atan(point.slope))<1e-9);assert.ok(cart.position.x<1.4-.7,'tram remains short of the first person');}
  const lever=scene.getObjectByName('trolley-lever');for(let i=0;i<100;i++){view.update(i/100/.12,value);scene.updateMatrixWorld(true);assert.ok(!new THREE.Box3().setFromObject(cart).intersectsBox(new THREE.Box3().setFromObject(lever)),'tram clears the switch lever');}
  const selected=scene.getObjectByName(`trolley-branch-${index}`),other=scene.getObjectByName(`trolley-branch-${1-index}`);
  assert.ok(selected.children.every(o=>o.material.color.getHex()===0xc99a64));assert.ok(other.children.every(o=>o.material.color.getHex()===0xded6c2));
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('tram details follow the cart and both groups remain on their respective tracks',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),people=[],single=[],ballast=[],gravel=[],hubs=[],seams=[];scene.traverse(o=>{if(o.name==='trolley-group-person')people.push(o);if(o.name==='trolley-single-person')single.push(o);if(o.name==='trolley-ballast')ballast.push(o);if(o.name==='trolley-gravel')gravel.push(o);if(o.name==='trolley-wheel-hub')hubs.push(o);if(o.name==='trolley-roof-seam')seams.push(o)});
 const cart=scene.getObjectByName('trolley-cart'),roof=scene.getObjectByName('trolley-roof');assert.equal(people.length,5);assert.equal(single.length,1);assert.equal(ballast.length,3);assert.equal(roof.parent,cart);
 assert.equal(hubs.length,4);assert.ok(hubs.every(hub=>hub.parent.parent===cart));assert.equal(seams.length,5);assert.ok(seams.every(seam=>seam.parent===cart));assert.equal(scene.getObjectByName('trolley-headlight-rim').parent,cart);assert.ok(gravel.length>100);scene.updateMatrixWorld(true);for(const stone of gravel)assert.ok(new THREE.Box3().setFromObject(stone).max.y<.08,'gravel must stay below the wheel bottoms');
 for(const p of people)assert.ok(Math.abs(p.position.z-trolleyCurve(p.position.x,-1).z)<1e-9);assert.ok(Math.abs(single[0].position.z-trolleyCurve(single[0].position.x,1).z)<1e-9);
 view.update(0,0);scene.updateMatrixWorld(true);const before=roof.getWorldPosition(new THREE.Vector3());view.update(5,0);scene.updateMatrixWorld(true);assert.ok(before.distanceTo(roof.getWorldPosition(new THREE.Vector3()))>1);
 view.dispose();assert.equal(scene.children.length,0);
});

test('tram wheels meet the straight rails and people stand above the sleepers',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),wheels=[],people=[],sleepers=[];
 scene.traverse(o=>{if(o.name==='trolley-wheel')wheels.push(o);if(o.name==='trolley-sleeper')sleepers.push(o);if(o.name==='trolley-group-person'||o.name==='trolley-single-person')people.push(o)});
 view.update(0,0);scene.updateMatrixWorld(true);assert.equal(wheels.length,4);
 for(const wheel of wheels){const box=new THREE.Box3().setFromObject(wheel,true),center=wheel.getWorldPosition(new THREE.Vector3());assert.ok(Math.abs(Math.abs(center.z)-.3)<1e-6);assert.ok(Math.abs(box.min.y-.165)<1e-5,'wheel bottom meets rail top')}
 for(const person of people){const bottom=new THREE.Box3().setFromObject(person,true).min.y;assert.ok(Math.abs(bottom-.09)<1e-5,'feet meet sleeper height');assert.ok(sleepers.some(s=>Math.hypot(s.position.x-person.position.x,s.position.z-person.position.z)<1e-6),'figure is centered on a sleeper')}
 view.dispose();
});


test('both wheel axles follow the selected curve throughout the approach',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),bogies=[];scene.traverse(o=>{if(o.name==='trolley-bogie')bogies.push(o)});assert.equal(bogies.length,2);
 for(const [value,branch] of [[0,-1],[1,1]])for(let i=0;i<100;i++){
  view.update(i/100/.12,value);scene.updateMatrixWorld(true);
  for(const bogie of bogies){const center=bogie.getWorldPosition(new THREE.Vector3()),curve=trolleyCurve(center.x,branch);assert.ok(Math.abs(center.z-curve.z)<1e-8);assert.ok(Math.abs(bogie.getWorldQuaternion(new THREE.Quaternion()).y-Math.sin(-Math.atan(curve.slope)/2))<1e-8);
   for(const wheel of bogie.children.filter(o=>o.name==='trolley-wheel')){const p=wheel.getWorldPosition(new THREE.Vector3()),normal=Math.hypot(1,curve.slope),side=Math.sign(wheel.position.z);assert.ok(Math.hypot(p.x-(center.x-side*.3*curve.slope/normal),p.z-(center.z+side*.3/normal))<1e-8)}
  }
 }
 view.dispose();
});

test('garden architecture stays outside the tram and people',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),arch=scene.getObjectByName('trolley-garden-arch'),bench=scene.getObjectByName('trolley-garden-bench'),tree=scene.getObjectByName('trolley-garden-tree'),cart=scene.getObjectByName('trolley-cart'),people=[];scene.traverse(o=>{if(o.name==='trolley-group-person'||o.name==='trolley-single-person')people.push(o)});assert.ok(arch&&bench&&tree?.getObjectByName('trolley-tree-leaves'));scene.updateMatrixWorld(true);const fixtures=[new THREE.Box3().setFromObject(arch),new THREE.Box3().setFromObject(bench),new THREE.Box3().setFromObject(tree)];assert.ok(Math.abs(fixtures[1].min.y-.04)<1e-6);assert.ok(Math.abs(fixtures[2].min.y-.04)<1e-6);
 for(const p of people)for(const fixture of fixtures)assert.ok(!fixture.intersectsBox(new THREE.Box3().setFromObject(p)));for(const value of [0,1])for(let i=0;i<50;i++){view.update(i/50/.12,value);scene.updateMatrixWorld(true);const cartBox=new THREE.Box3().setFromObject(cart);for(const fixture of fixtures)assert.ok(!fixture.intersectsBox(cartBox))}view.dispose();
});

test('garden arcade and vine remain attached to the grounded ruin',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),arch=scene.getObjectByName('trolley-garden-arch'),arcs=[],leaves=[];arch.traverse(o=>{if(o.name==='trolley-arcade-arch')arcs.push(o);if(o.name==='trolley-arcade-leaf')leaves.push(o)});
 assert.equal(arcs.length,2);assert.ok(arcs[0].position.x<0&&arcs[1].position.x>0);assert.equal(leaves.length,24);assert.ok(arch.getObjectByName('trolley-arcade-vine'));view.dispose();assert.equal(scene.children.length,0);
});

test('glazed tram interior travels with the body on both branches',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),cart=scene.getObjectByName('trolley-cart'),interior=scene.getObjectByName('trolley-interior'),panes=[],seats=[];cart.traverse(o=>{if(o.name==='trolley-side-window')panes.push(o);if(o.name==='trolley-interior-seat')seats.push(o)});assert.equal(interior.parent,cart);assert.equal(seats.length,2);assert.ok(panes.every(p=>p.material.transparent&&p.material.opacity<.5));assert.ok(seats.every(s=>s.parent===interior));
 for(const value of [0,1]){view.update(0,value);scene.updateMatrixWorld(true);const initial=seats[0].getWorldPosition(new THREE.Vector3());view.update(5,value);scene.updateMatrixWorld(true);assert.ok(seats[0].getWorldPosition(new THREE.Vector3()).distanceTo(initial)>1)}view.dispose();
});

test('tram side windows have arched tops and move with the cart',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),cart=scene.getObjectByName('trolley-cart'),panes=[],arches=[];scene.traverse(o=>{if(o.name==='trolley-side-window')panes.push(o);if(o.name==='trolley-window-arch')arches.push(o)});assert.equal(panes.length,6);assert.equal(arches.length,6);assert.ok([...panes,...arches].every(o=>o.parent===cart));view.update(0,0);scene.updateMatrixWorld(true);
 const pane=panes[0],ray=new THREE.Raycaster();function hit(x,y){const origin=pane.localToWorld(new THREE.Vector3(x,y,.5)),direction=new THREE.Vector3(0,0,-1).transformDirection(pane.matrixWorld);ray.set(origin,direction);return ray.intersectObject(pane).length>0}assert.ok(hit(0,.15));assert.ok(!hit(.16,.15));const before=pane.getWorldPosition(new THREE.Vector3());view.update(5,0);scene.updateMatrixWorld(true);assert.ok(before.distanceTo(pane.getWorldPosition(new THREE.Vector3()))>1);view.dispose();
});

test('track figures keep their shoes on the sleepers after visual detailing',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),people=[];scene.traverse(o=>{if(o.name==='trolley-group-person'||o.name==='trolley-single-person')people.push(o)});scene.updateMatrixWorld(true);assert.equal(people.length,6);
 for(const person of people){const eyes=person.children.filter(o=>o.name==='trolley-figure-eye'),shoes=person.children.filter(o=>o.name==='trolley-figure-shoe');assert.equal(eyes.length,2);assert.equal(shoes.length,2);assert.ok(person.getObjectByName('trolley-figure-belt'));for(const shoe of shoes)assert.ok(Math.abs(new THREE.Box3().setFromObject(shoe).min.y-.09)<1e-6)}view.dispose();
});

test('track figures keep their posed hands attached and their mantles above the track',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),people=[];scene.traverse(o=>{if(o.name==='trolley-group-person'||o.name==='trolley-single-person')people.push(o)});scene.updateMatrixWorld(true);const poses=new Set();
 for(const person of people){const arms=person.children.filter(o=>o.name==='trolley-figure-arm'),hands=person.children.filter(o=>o.name==='trolley-figure-hand'),mantle=person.getObjectByName('trolley-figure-mantle');assert.equal(arms.length,2);assert.equal(hands.length,2);assert.ok(mantle);poses.add(hands.map(h=>h.position.toArray().join(',')).join('|'));for(let i=0;i<2;i++)assert.ok(arms[i].localToWorld(new THREE.Vector3(0,.25,0)).distanceTo(hands[i].getWorldPosition(new THREE.Vector3()))<1e-6);assert.ok(new THREE.Box3().setFromObject(mantle,true).min.y>.1)}assert.equal(poses.size,3);view.dispose();
});

test('switch housing is grounded and clears the tram on both branches',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),housing=scene.getObjectByName('trolley-switch-housing'),cart=scene.getObjectByName('trolley-cart');assert.ok(housing&&housing.getObjectByName('trolley-switch-guard'));
 for(const value of [0,1])for(let i=0;i<100;i++){view.update(i/100/.12,value);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(housing,true);assert.ok(Math.abs(bounds.min.y-.04)<1e-6);assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(cart,true)))}view.dispose();
});

test('switch paving clears the tram during both branch approaches',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),cart=scene.getObjectByName('trolley-cart'),tiles=[];scene.traverse(o=>{if(o.name==='trolley-switch-paving')tiles.push(o)});assert.equal(tiles.length,8);
 for(const value of [0,1])for(let i=0;i<100;i++){view.update(i/100/.12,value);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(cart,true);for(const tile of tiles)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(tile,true)))}view.dispose();
});

test('long robes remain above the sleepers and attached to the track figures',()=>{
 const scene=new THREE.Scene(),view=builders.trolley(scene),people=[];scene.traverse(o=>{if(o.name==='trolley-group-person'||o.name==='trolley-single-person')people.push(o)});assert.equal(people.length,6);scene.updateMatrixWorld(true);for(const person of people){const robe=person.getObjectByName('trolley-figure-robe'),shoe=person.getObjectByName('trolley-figure-shoe');assert.equal(robe.parent,person);const cloth=new THREE.Box3().setFromObject(robe,true),foot=new THREE.Box3().setFromObject(shoe,true);assert.ok(cloth.min.y>foot.max.y&&cloth.min.y-foot.max.y<.06)}view.dispose();
});
