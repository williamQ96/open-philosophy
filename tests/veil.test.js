import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('platform balustrades leave the figures and station objects clear',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),podiums=[];scene.traverse(o=>{if(o.name==='veil-podium'&&o.getObjectByName('veil-balustrade-rail'))podiums.push(o)});assert.equal(podiums.length,2);scene.updateMatrixWorld(true);
 function localBounds(object,podium){const inverse=podium.matrixWorld.clone().invert(),bounds=new THREE.Box3(),point=new THREE.Vector3();object.traverse(o=>{const positions=o.geometry?.attributes.position;if(!positions)return;const matrix=inverse.clone().multiply(o.matrixWorld);for(let i=0;i<positions.count;i++)bounds.expandByPoint(point.fromBufferAttribute(positions,i).applyMatrix4(matrix))});return bounds}
 for(const podium of podiums){const subjects=['veil-person','veil-station-object'].map(name=>localBounds(podium.getObjectByName(name),podium));for(const item of podium.children.filter(o=>o.name==='veil-balustrade-post'||o.name==='veil-balustrade-rail'))for(const subject of subjects)assert.ok(!localBounds(item,podium).intersectsBox(subject),`${item.name} crosses a subject`)}view.dispose();
});

test('station objects stay on the podium and clear the figures',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),podiums=[];scene.traverse(o=>{if(o.name==='veil-podium')podiums.push(o)});scene.updateMatrixWorld(true);
 function boundsInPodium(object,podium){const inverse=podium.matrixWorld.clone().invert(),bounds=new THREE.Box3(),point=new THREE.Vector3();object.traverse(mesh=>{const positions=mesh.geometry?.attributes.position;if(!positions)return;const matrix=inverse.clone().multiply(mesh.matrixWorld);for(let i=0;i<positions.count;i++)bounds.expandByPoint(point.fromBufferAttribute(positions,i).applyMatrix4(matrix))});return bounds}
 for(const podium of podiums){const prop=podium.getObjectByName('veil-station-object'),person=podium.getObjectByName('veil-person'),bounds=boundsInPodium(prop,podium);assert.ok(!bounds.intersectsBox(boundsInPodium(person,podium)));for(const x of [bounds.min.x,bounds.max.x])for(const z of [bounds.min.z,bounds.max.z])assert.ok(Math.hypot(x,z)<.85)}view.dispose();
});

test('veil gathers at the post tops while figures stand on the podium caps',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),podiums=[];
 scene.traverse(o=>{if(o.name==='veil-podium')podiums.push(o)});assert.equal(podiums.length,6);
 for(const podium of podiums){const person=podium.getObjectByName('veil-person'),cap=podium.getObjectByName('veil-podium-cap');assert.ok(person&&cap);podium.updateMatrixWorld(true);const feet=new THREE.Box3().setFromObject(person,true).min.y,top=new THREE.Box3().setFromObject(cap,true).max.y;assert.ok(Math.abs(feet-top)<1e-5);assert.ok(podium.getObjectByName('veil-station-object'))}
 const curtain=scene.getObjectByName('veil-curtain'),hem=scene.getObjectByName('veil-hem');assert.equal(hem.parent,curtain);view.update(0,0);scene.updateMatrixWorld(true);const initialScale=curtain.scale.y,initialOpacity=curtain.material.opacity,top=curtain.position.y,hemBefore=new THREE.Vector3().fromBufferAttribute(hem.geometry.getAttribute('position'),0).applyMatrix4(hem.matrixWorld);
 view.update(0,1);scene.updateMatrixWorld(true);const hemAfter=new THREE.Vector3().fromBufferAttribute(hem.geometry.getAttribute('position'),0).applyMatrix4(hem.matrixWorld);assert.ok(hemAfter.y>hemBefore.y+2);assert.ok(curtain.scale.y<initialScale);assert.ok(curtain.material.opacity<initialOpacity);assert.ok(hem.material.opacity<.65);assert.equal(curtain.position.y,top);
 view.dispose();assert.equal(scene.children.length,0);
});

test('podium stairways rise toward the figures without entering the central mosaic',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),podiums=[];scene.traverse(o=>{if(o.name==='veil-podium')podiums.push(o)});scene.updateMatrixWorld(true);
 assert.ok(scene.getObjectByName('veil-mosaic'));
 for(const podium of podiums){const stairs=podium.getObjectByName('veil-podium-stairs'),cap=podium.getObjectByName('veil-podium-cap');assert.equal(stairs.children.length,5);
  const tops=stairs.children.map(step=>step.position.y+step.scale.y/2);assert.ok(tops.every((top,i)=>i===0||top>tops[i-1]));assert.ok(Math.abs(tops.at(-1)-(cap.position.y+.06))<1e-7);
  const first=stairs.children[0].getWorldPosition(new THREE.Vector3()),last=stairs.children.at(-1).getWorldPosition(new THREE.Vector3());assert.ok(Math.hypot(first.x,first.z)<Math.hypot(last.x,last.z));assert.ok(Math.hypot(first.x,first.z)>1.5);
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('podium recesses face outward, away from the stairs',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),podiums=[];scene.traverse(o=>{if(o.name==='veil-podium')podiums.push(o)});scene.updateMatrixWorld(true);let count=0;
 for(const podium of podiums){const recess=podium.getObjectByName('veil-podium-recess');if(!recess)continue;count++;const center=podium.getWorldPosition(new THREE.Vector3()),outward=center.clone().setY(0).normalize(),delta=recess.getWorldPosition(new THREE.Vector3()).sub(center);assert.ok(delta.dot(outward)>.8,'recess should face the outside of the ring');const stairs=new THREE.Box3().setFromObject(podium.getObjectByName('veil-podium-stairs'));assert.ok(!stairs.intersectsBox(new THREE.Box3().setFromObject(recess)))}assert.equal(count,4);view.dispose();
});

test('each figure has facial and clothing details with shoes on the podium',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),podiums=[];scene.traverse(o=>{if(o.name==='veil-podium')podiums.push(o)});scene.updateMatrixWorld(true);
 for(const podium of podiums){const person=podium.getObjectByName('veil-person'),eyes=[],shoes=[],folds=[];person.traverse(o=>{if(o.name==='veil-eye')eyes.push(o);if(o.name==='veil-shoe')shoes.push(o);if(o.name==='veil-robe-fold')folds.push(o)});assert.equal(eyes.length,2);assert.equal(shoes.length,2);assert.equal(folds.length,2);assert.ok(person.getObjectByName('veil-belt'));const top=new THREE.Box3().setFromObject(podium.getObjectByName('veil-podium-cap')).max.y;for(const shoe of shoes)assert.ok(Math.abs(new THREE.Box3().setFromObject(shoe).min.y-top)<.005)}view.dispose();
});

test('figures have distinct gestures with hands attached to their arms',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),people=[];scene.traverse(o=>{if(o.name==='veil-person')people.push(o)});scene.updateMatrixWorld(true);const poses=new Set();
 for(const person of people){const arms=person.children.filter(o=>o.name==='veil-arm'),hands=person.children.filter(o=>o.name==='veil-hand');assert.equal(arms.length,2);assert.equal(hands.length,2);poses.add(hands.map(h=>h.position.toArray().join(',')).join('|'));for(let i=0;i<2;i++){const endpoint=arms[i].localToWorld(new THREE.Vector3(0,arms[i].geometry.parameters.height/2,0));assert.ok(endpoint.distanceTo(hands[i].getWorldPosition(new THREE.Vector3()))<1e-6)}}assert.equal(poses.size,6);view.dispose();
});

test('figure mantles remain on their podiums while the curtain rises',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),podiums=[];scene.traverse(o=>{if(o.name==='veil-podium')podiums.push(o)});for(const value of [0,.5,1]){view.update(0,value);scene.updateMatrixWorld(true);for(const podium of podiums){const mantle=podium.getObjectByName('veil-mantle'),cap=podium.getObjectByName('veil-podium-cap');assert.ok(mantle);const box=new THREE.Box3().setFromObject(mantle,true),capTop=new THREE.Box3().setFromObject(cap,true).max.y;assert.ok(box.min.y>capTop);const center=podium.getWorldPosition(new THREE.Vector3());for(const x of [box.min.x,box.max.x])for(const z of [box.min.z,box.max.z])assert.ok(Math.hypot(x-center.x,z-center.z)<.85)}}view.dispose();
});

test('fabric seams stay anchored and follow the hem as the veil rises',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),curtain=scene.getObjectByName('veil-curtain'),hem=scene.getObjectByName('veil-hem'),seams=curtain.children.filter(o=>o.name==='veil-cloth-seam');assert.equal(seams.length,12);assert.equal(curtain.castShadow,false);
 for(const value of [0,1]){view.update(0,value);scene.updateMatrixWorld(true);const seam=seams[0],path=seam.geometry.parameters.path,top=seam.localToWorld(path.getPoint(0)),bottom=seam.localToWorld(path.getPoint(1)),hemPoint=hem.localToWorld(hem.geometry.parameters.path.getPoint(0));assert.ok(Math.abs(top.y-3.22)<1e-6);assert.ok(Math.abs(Math.hypot(top.x,top.z)-4.008)<1e-5);assert.ok(bottom.distanceTo(hemPoint)<.01);assert.ok(seam.material.opacity<=(value===0?.38:.17))}view.dispose();
});

test('lower veil hem meets the posts and rises between them when lowered',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),curtain=scene.getObjectByName('veil-curtain'),bases=[];scene.traverse(o=>{if(o.name==='veil-post-base')bases.push(o)});view.update(0,0);scene.updateMatrixWorld(true);const p=curtain.geometry.getAttribute('position'),row=12*97;assert.equal(bases.length,12);
 for(let i=0;i<12;i++){const anchor=curtain.localToWorld(new THREE.Vector3().fromBufferAttribute(p,row+i*8)),mid=curtain.localToWorld(new THREE.Vector3().fromBufferAttribute(p,row+i*8+4)),base=bases[i].getWorldPosition(new THREE.Vector3());assert.ok(Math.hypot(anchor.x-base.x,anchor.z-base.z)<1e-5);assert.ok(Math.abs(anchor.y-.08)<1e-5);assert.ok(mid.y>anchor.y+.4)}view.dispose();
});

test('fabric crown meets the curtain rim and gathers with the veil',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),curtain=scene.getObjectByName('veil-curtain'),crown=scene.getObjectByName('veil-fabric-crown'),rim=curtain.geometry.getAttribute('position'),surface=crown.geometry.getAttribute('position'),segments=96;assert.equal(crown.parent,curtain);
 for(let i=0;i<=segments;i++){const p=new THREE.Vector3().fromBufferAttribute(surface,16*(segments+1)+i),q=new THREE.Vector3().fromBufferAttribute(rim,i);assert.ok(p.distanceTo(q)<1e-6)}
 view.update(0,0);scene.updateMatrixWorld(true);const high=crown.localToWorld(new THREE.Vector3(0,.9,0)).y,opacity=crown.material.opacity;view.update(0,1);scene.updateMatrixWorld(true);assert.ok(crown.localToWorld(new THREE.Vector3(0,.9,0)).y<high);assert.ok(crown.material.opacity<opacity);view.dispose();
});

test('billowing curtain remains outside the podiums and within the stage',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),curtain=scene.getObjectByName('veil-curtain'),positions=curtain.geometry.getAttribute('position');
 for(const value of [0,.5,1]){view.update(0,value);scene.updateMatrixWorld(true);for(let i=0;i<positions.count;i++){const p=new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(curtain.matrixWorld),r=Math.hypot(p.x,p.z);assert.ok(r>3.85&&r<4.6,`curtain radius ${r} at ${value}`)}}view.dispose();
});

test('veil post bases sit on the floor beyond the podium caps',()=>{
 const scene=new THREE.Scene(),view=builders.veil(scene),bases=[],collars=[];scene.traverse(o=>{if(o.name==='veil-post-base')bases.push(o);if(o.name==='veil-post-collar')collars.push(o)});assert.equal(bases.length,12);assert.equal(collars.length,12);scene.updateMatrixWorld(true);
 for(const base of bases){assert.ok(Math.abs(new THREE.Box3().setFromObject(base,true).min.y)<1e-6);assert.ok(Math.hypot(base.position.x,base.position.z)-.13>3+.85)}
 view.dispose();
});
