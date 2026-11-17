import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('stone arch crown has depth and leaves both boxes unobstructed',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),arch=scene.getObjectByName('newcomb-arch'),crown=scene.getObjectByName('newcomb-arch-crown');assert.ok(arch&&crown);crown.geometry.computeBoundingBox();const bounds=crown.geometry.boundingBox;assert.ok(Math.abs(bounds.max.z-bounds.min.z-.32)<1e-6);scene.updateMatrixWorld(true);
 const ray=new THREE.Raycaster(arch.localToWorld(new THREE.Vector3(0,2.9,1)),new THREE.Vector3(0,0,-1).transformDirection(arch.matrixWorld));assert.equal(ray.intersectObject(crown).length,0);for(const name of ['newcomb-opaque','newcomb-clear'])assert.ok(!new THREE.Box3().setFromObject(crown,true).intersectsBox(new THREE.Box3().setFromObject(scene.getObjectByName(name),true)));view.dispose();
});

test('Newcomb choices highlight one or two boxes without opening the opaque box',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),opaque=scene.getObjectByName('newcomb-opaque'),one=scene.getObjectByName('newcomb-selection-opaque'),two=scene.getObjectByName('newcomb-selection-clear');
 scene.updateMatrixWorld(true);const start=opaque.children.map(o=>o.matrix.clone());
 for(const [value,clearSelected] of [[0,false],[.49,false],[.5,true],[1,true],[0,false]]){
  view.update(0,value);scene.updateMatrixWorld(true);assert.ok(one.children.every(o=>o.visible));assert.ok(two.children.every(o=>o.visible===clearSelected));
  opaque.children.forEach((o,i)=>{assert.equal(o.material.transparent,false);o.updateMatrix();assert.ok(o.matrix.equals(start[i]),'opaque box parts remain closed and stationary')});
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('choice plaques track the one-box and two-box selection without touching either box',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),one=scene.getObjectByName('newcomb-choice-one'),two=scene.getObjectByName('newcomb-choice-two'),opaque=scene.getObjectByName('newcomb-opaque'),clear=scene.getObjectByName('newcomb-clear');
 assert.ok(one&&two);for(const [value,left,right] of [[0,0xd19c51,0x6f8278],[1,0x6f8278,0xd19c51],[0,0xd19c51,0x6f8278]]){
  view.update(0,value);scene.updateMatrixWorld(true);assert.equal(one.children[1].material.color.getHex(),left);assert.equal(two.children[1].material.color.getHex(),right);
  for(const plaque of [one,two])for(const chest of [opaque,clear])assert.ok(!new THREE.Box3().setFromObject(plaque).intersectsBox(new THREE.Box3().setFromObject(chest)));
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('observer and engraved coins remain clear of the choice objects',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),bust=scene.getObjectByName('newcomb-bust'),clear=scene.getObjectByName('newcomb-clear'),engravings=[];
 clear.traverse(o=>{if(o.name==='newcomb-coin-engraving')engravings.push(o)});
 assert.ok(engravings.length>=4);scene.updateMatrixWorld(true);
 const observerBounds=new THREE.Box3().setFromObject(bust);
 for(const name of ['newcomb-opaque','newcomb-clear','newcomb-choice-one','newcomb-choice-two'])assert.ok(!observerBounds.intersectsBox(new THREE.Box3().setFromObject(scene.getObjectByName(name))));
 for(const rim of engravings){assert.ok(Math.abs(rim.position.x)+.15<.88);assert.ok(Math.abs(rim.position.z)+.15<.74);assert.ok(rim.position.y<1.7)}
 view.dispose();assert.equal(scene.children.length,0);
});

test('observer sculpture and thinking hand stay clear of nearby books',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),bust=scene.getObjectByName('newcomb-bust'),hand=scene.getObjectByName('newcomb-bust-thinking-hand'),books=[];scene.traverse(o=>{if(o.name==='newcomb-observer-book')books.push(o)});scene.updateMatrixWorld(true);
 assert.ok(hand);assert.equal(books.length,3);
 // Both objects share a rotated scene root. Compare their vertices in that
 // coordinate system so world-axis bounding boxes do not create false overlap.
 const inverse=bust.parent.matrixWorld.clone().invert();
 function localBounds(object){const bounds=new THREE.Box3(),p=new THREE.Vector3();object.traverse(mesh=>{if(!mesh.geometry?.attributes.position)return;const matrix=inverse.clone().multiply(mesh.matrixWorld),vertices=mesh.geometry.attributes.position;for(let i=0;i<vertices.count;i++)bounds.expandByPoint(p.fromBufferAttribute(vertices,i).applyMatrix4(matrix))});return bounds}
 const bounds=localBounds(bust);for(const book of books)assert.ok(!bounds.intersectsBox(localBounds(book)));
 view.dispose();
});

test('both boxes rest on the dais and each coin stack rests on the clear-box base',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),coins=[];scene.traverse(o=>{if(o.name==='newcomb-coin')coins.push(o)});scene.updateMatrixWorld(true);
 const top=new THREE.Box3().setFromObject(scene.getObjectByName('newcomb-dais'),true).max.y;
 for(const name of ['newcomb-opaque-body','newcomb-clear-base'])assert.ok(Math.abs(new THREE.Box3().setFromObject(scene.getObjectByName(name),true).min.y-top)<1e-6);
 const baseTop=new THREE.Box3().setFromObject(scene.getObjectByName('newcomb-clear-base'),true).max.y;
 const bottoms=coins.filter(c=>Math.abs(c.position.y-.3575)<1e-8);assert.ok(bottoms.length>=4);for(const coin of bottoms)assert.ok(Math.abs(new THREE.Box3().setFromObject(coin,true).min.y-baseTop)<1e-6);for(const coin of bottoms){const stack=coins.filter(c=>c.position.x===coin.position.x&&c.position.z===coin.position.z).sort((a,b)=>a.position.y-b.position.y);for(let i=1;i<stack.length;i++){const lower=new THREE.Box3().setFromObject(stack[i-1],true),upper=new THREE.Box3().setFromObject(stack[i],true);assert.ok(Math.abs(upper.min.y-lower.max.y)<1e-6)}}
 view.dispose();
});

test('foreground runner stays on the lower floor and clear of the raised dais',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),runner=scene.getObjectByName('newcomb-runner');assert.ok(runner);assert.ok(Math.abs(runner.position.y-runner.geometry.parameters.height/2-.055)<1e-6);
 assert.ok(runner.position.z-runner.geometry.parameters.depth/2>3.2);assert.ok(Math.hypot(runner.position.x+runner.geometry.parameters.width/2,runner.position.z+runner.geometry.parameters.depth/2)<4.95);
 view.dispose();
});

test('arch columns stand on the lower floor and clear the boxes',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),bases=[],shafts=[],joints=[];scene.traverse(o=>{if(o.name==='newcomb-column-base')bases.push(o);if(o.name==='newcomb-column-shaft')shafts.push(o);if(o.name==='newcomb-arch-joint')joints.push(o)});assert.equal(bases.length,2);assert.equal(shafts.length,2);assert.equal(joints.length,15);scene.updateMatrixWorld(true);
 for(const base of bases)assert.ok(Math.abs(new THREE.Box3().setFromObject(base,true).min.y-.055)<1e-6);for(const shaft of shafts)for(const name of ['newcomb-opaque','newcomb-clear'])assert.ok(!new THREE.Box3().setFromObject(shaft,true).intersectsBox(new THREE.Box3().setFromObject(scene.getObjectByName(name),true)));view.dispose();
});

test('drape crosses the arch and remains clear of both boxes',()=>{
 const scene=new THREE.Scene(),view=builders.newcomb(scene),front=scene.getObjectByName('newcomb-drape'),back=scene.getObjectByName('newcomb-drape-over-arch'),a=front.geometry.getAttribute('position'),b=back.geometry.getAttribute('position');assert.ok(back&&b.count>400);for(let i=0;i<=40;i++){assert.ok(Math.abs(a.getX(i)-b.getX(i))<1e-6);assert.ok(Math.abs(a.getY(i)-b.getY(i))<1e-6);assert.ok(Math.abs(a.getZ(i)-b.getZ(i))<1e-6)}scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(back,true);for(const name of ['newcomb-opaque','newcomb-clear'])assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(scene.getObjectByName(name),true)));view.dispose();
});
