import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {orbitWithKey,handleOrbitKey} from '../src/keyboard.js';

test('keyboard orbit and zoom remain bounded and leave other keys alone',()=>{
 const camera=new THREE.PerspectiveCamera();camera.position.set(9,7,10);
 let updates=0;const controls={target:new THREE.Vector3(0,1,0),minPolarAngle:0,maxPolarAngle:Math.PI/2.05,minDistance:7,maxDistance:19,update(){updates++}};
 const before=camera.position.clone();assert.equal(orbitWithKey(camera,controls,'ArrowLeft'),true);assert.ok(!camera.position.equals(before));
 for(let i=0;i<100;i++)orbitWithKey(camera,controls,'+');assert.ok(camera.position.distanceTo(controls.target)>=7-1e-9);
 for(let i=0;i<100;i++)orbitWithKey(camera,controls,'-');assert.ok(camera.position.distanceTo(controls.target)<=19+1e-9);
 const count=updates;assert.equal(orbitWithKey(camera,controls,'Tab'),false);assert.equal(updates,count);
});


test('browser modifier shortcuts are not intercepted',()=>{
 const camera=new THREE.PerspectiveCamera();camera.position.set(9,7,10);
 const controls={target:new THREE.Vector3(0,1,0),minPolarAngle:0,maxPolarAngle:Math.PI/2,minDistance:7,maxDistance:19,update(){}};
 for(const modifier of ['ctrlKey','metaKey','altKey']){
  let prevented=false;const event={key:modifier==='altKey'?'ArrowLeft':'+',[modifier]:true,preventDefault(){prevented=true}};
  const before=camera.position.clone();assert.equal(handleOrbitKey(event,camera,controls),false);assert.equal(prevented,false);assert.ok(camera.position.equals(before));
 }
 let prevented=false;assert.equal(handleOrbitKey({key:'+',shiftKey:true,preventDefault(){prevented=true}},camera,controls),true);assert.equal(prevented,true);
});
