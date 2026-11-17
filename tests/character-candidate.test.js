import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {poseCandidate} from '../review/sisyphus-character-evaluation/pose-solver.js';

test('evaluation rig reaches static hand targets and keeps foot errors bounded',async()=>{
 globalThis.ProgressEvent??=class ProgressEvent extends Event{constructor(type,options){super(type);Object.assign(this,options)}};
 const data=await readFile(new URL('../review/sisyphus-character-evaluation/superhero-male-untextured.gltf',import.meta.url),'utf8');
 const gltf=await new Promise((resolve,reject)=>new GLTFLoader().parse(data,'',resolve,reject)),result=poseCandidate(gltf.scene);
 for(const [bone,target,tolerance] of [[result.fingers[0],result.targets[0].toArray(),.001],[result.fingers[1],result.targets[1].toArray(),.001],[result.feet[0],[.16,.09,.07],.05],[result.feet[1],[-.16,.09,-.16],.05]]){const point=bone.getWorldPosition(new THREE.Vector3());assert.ok(point.toArray().every(Number.isFinite));assert.ok(point.distanceTo(new THREE.Vector3(...target))<tolerance)}
 const mesh=gltf.scene.getObjectByName('SuperHero_Male'),indices=mesh.geometry.getAttribute('skinIndex'),weights=mesh.geometry.getAttribute('skinWeight'),point=new THREE.Vector3(),min={l:Infinity,r:Infinity},count={l:0,r:0};mesh.skeleton.update();
 for(let i=0;i<indices.count;i++)for(const side of ['l','r']){let influence=0;for(let k=0;k<4;k++){const name=mesh.skeleton.bones[indices.getComponent(i,k)]?.name;if(name===`foot_${side}`||name===`ball_${side}`)influence+=weights.getComponent(i,k)}if(influence>.5){mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld);min[side]=Math.min(min[side],point.y);count[side]++}}
 for(const side of ['l','r']){assert.ok(count[side]>100);assert.ok(Math.abs(min[side])<.005,`${side} sole vertices should approach the flat reference floor`)}
 // The preview rock is convex. Its oriented triangle planes classify hand vertices.
 const rock=new THREE.IcosahedronGeometry(.62,2),vertices=rock.getAttribute('position'),center=new THREE.Vector3(0,.62,.82),planes=[];for(let i=0;i<vertices.count;i+=3){const plane=new THREE.Plane().setFromCoplanarPoints(new THREE.Vector3().fromBufferAttribute(vertices,i).add(center),new THREE.Vector3().fromBufferAttribute(vertices,i+1).add(center),new THREE.Vector3().fromBufferAttribute(vertices,i+2).add(center));if(plane.distanceToPoint(center)>0)plane.negate();planes.push(plane)}
 const handCounts={l:0,r:0},clearance={l:Infinity,r:Infinity};for(let i=0;i<indices.count;i++)for(const side of ['l','r']){let influence=0;for(let k=0;k<4;k++){const name=mesh.skeleton.bones[indices.getComponent(i,k)]?.name||'';if(new RegExp(`^(hand|index|middle|ring|pinky|thumb).*_${side}$`).test(name))influence+=weights.getComponent(i,k)}if(influence>.5){mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld);let separation=-Infinity;for(const plane of planes)separation=Math.max(separation,plane.distanceToPoint(point));assert.ok(separation>=-1e-5,`${side} hand vertex is inside the preview rock`);clearance[side]=Math.min(clearance[side],separation);handCounts[side]++}}
 for(const side of ['l','r']){assert.ok(handCounts[side]>1000);assert.ok(clearance[side]<.002,`${side} hand remains close to the preview rock`)}
 // Clip each triangle with a hand-dominant vertex against the convex rock interior.
 const handDominant=[],deformed=[];for(let i=0;i<indices.count;i++){let influence=0;for(let k=0;k<4;k++){const name=mesh.skeleton.bones[indices.getComponent(i,k)]?.name||'';if(/^(hand|index|middle|ring|pinky|thumb).*_[lr]$/.test(name))influence+=weights.getComponent(i,k)}handDominant.push(influence>.5);deformed.push(mesh.getVertexPosition(i,new THREE.Vector3()).applyMatrix4(mesh.matrixWorld))}
 const index=mesh.geometry.getIndex();let tested=0;for(let i=0;i<index.count;i+=3){const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)];if(!ids.some(n=>handDominant[n]))continue;tested++;let polygon=ids.map(n=>deformed[n].clone());for(const plane of planes){if(!polygon.length)break;const next=[];for(let j=0;j<polygon.length;j++){const a=polygon[j],b=polygon[(j+1)%polygon.length],da=plane.distanceToPoint(a),db=plane.distanceToPoint(b),insideA=da<=-1e-5,insideB=db<=-1e-5;if(insideA)next.push(a);if(insideA!==insideB)next.push(a.clone().lerp(b,(-1e-5-da)/(db-da)))}polygon=next}assert.ok(polygon.length<3,'hand triangle penetrates preview rock')}
 assert.ok(tested>3000);rock.dispose();
 const bounds=new THREE.Box3().setFromObject(gltf.scene,true);assert.ok(bounds.min.y>-.02,'candidate remains close to the reference floor, but is not yet dynamically fitted');
});

test('candidate solver resets its pose and follows sampled rotated-rock targets',async()=>{
 globalThis.ProgressEvent??=class ProgressEvent extends Event{constructor(type,options){super(type);Object.assign(this,options)}};
 const data=await readFile(new URL('../review/sisyphus-character-evaluation/superhero-male-untextured.gltf',import.meta.url),'utf8'),gltf=await new Promise((resolve,reject)=>new GLTFLoader().parse(data,'',resolve,reject));
 let initial;for(const angle of [0,.25,-.4,.7,0]){const result=poseCandidate(gltf.scene,{rockRotation:angle});for(let i=0;i<2;i++)assert.ok(result.fingers[i].getWorldPosition(new THREE.Vector3()).distanceTo(result.targets[i])<.001);const q=gltf.scene.getObjectByName('upperarm_l').quaternion.clone();if(initial===undefined)initial=q;else if(angle===0)assert.ok(q.angleTo(initial)<1e-7,'returning to zero restores the same pose')}
});

test('candidate contact targets change gradually across the preview rotation range',async()=>{
 globalThis.ProgressEvent??=class ProgressEvent extends Event{constructor(type,options){super(type);Object.assign(this,options)}};
 const data=await readFile(new URL('../review/sisyphus-character-evaluation/superhero-male-untextured.gltf',import.meta.url),'utf8'),gltf=await new Promise((resolve,reject)=>new GLTFLoader().parse(data,'',resolve,reject));let previous=null,max=0;
 for(let i=-100;i<=100;i++){const target=poseCandidate(gltf.scene,{rockRotation:i/100}).targets[0];if(previous)max=Math.max(max,target.distanceTo(previous));previous=target.clone()}
 assert.ok(max<.015,`sampled target displacement ${max} exceeds tolerance`);
});
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('candidate selected hand triangles clear the convex preview rock at sampled angles',()=>{
 const audit=fileURLToPath(new URL('../review/sisyphus-character-evaluation/audit-contact.mjs',import.meta.url)),result=JSON.parse(execFileSync(process.execPath,[audit,'20','--triangles'],{encoding:'utf8'}));
 assert.equal(result.samples,41);assert.equal(result.penetratingSamples,0);assert.equal(result.trianglePenetratingSamples,0);assert.ok(result.report.every(x=>x.trianglesTested>3000&&x.nearest<.015));
});
