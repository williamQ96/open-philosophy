import {readFile} from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {poseCandidate} from './pose-solver.js';
globalThis.ProgressEvent??=class ProgressEvent extends Event{constructor(t,o){super(t);Object.assign(this,o)}};
const data=await readFile(new URL('./superhero-male-untextured.gltf',import.meta.url),'utf8');
const gltf=await new Promise((resolve,reject)=>new GLTFLoader().parse(data,'',resolve,reject));
const mesh=gltf.scene.getObjectByName('SuperHero_Male'),indices=mesh.geometry.getAttribute('skinIndex'),weights=mesh.geometry.getAttribute('skinWeight');
const positions=new THREE.IcosahedronGeometry(.62,2).getAttribute('position'),center=new THREE.Vector3(0,.62,.82),axis=new THREE.Vector3(0,0,1),point=new THREE.Vector3(),report=[];
const triangleCheck=process.argv.includes('--triangles');
const steps=Number(process.argv[2]||20);if(!Number.isInteger(steps)||steps<1||steps>1000)throw new Error('steps must be an integer from 1 to 1000');
for(let n=-steps;n<=steps;n++){
 const angle=n/steps;poseCandidate(gltf.scene,{rockRotation:angle});gltf.scene.updateMatrixWorld(true);mesh.skeleton.update();const planes=[];
 for(let i=0;i<positions.count;i+=3){const v=k=>new THREE.Vector3().fromBufferAttribute(positions,i+k).applyAxisAngle(axis,angle).add(center),plane=new THREE.Plane().setFromCoplanarPoints(v(0),v(1),v(2));if(plane.distanceToPoint(center)>0)plane.negate();planes.push(plane)}
 let inside=0,maxDepth=0;const nearestBySide={l:Infinity,r:Infinity};
 for(let i=0;i<indices.count;i++)for(const side of ['l','r']){let influence=0;for(let k=0;k<4;k++){const name=mesh.skeleton.bones[indices.getComponent(i,k)]?.name||'';if(new RegExp(`^(hand|index|middle|ring|pinky|thumb).*_${side}$`).test(name))influence+=weights.getComponent(i,k)}if(influence<=.5)continue;
  mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld);let separation=-Infinity;for(const plane of planes)separation=Math.max(separation,plane.distanceToPoint(point));nearestBySide[side]=Math.min(nearestBySide[side],Math.abs(separation));if(separation < -1e-5){inside++;maxDepth=Math.max(maxDepth,-separation)}
 }
 const nearest=Math.max(nearestBySide.l,nearestBySide.r);let triangleHits=0,trianglesTested=0;
 if(triangleCheck){const active=[],deformed=[];for(let i=0;i<indices.count;i++){let influence=0;for(let k=0;k<4;k++){const name=mesh.skeleton.bones[indices.getComponent(i,k)]?.name||'';if(/^(hand|index|middle|ring|pinky|thumb).*_[lr]$/.test(name))influence+=weights.getComponent(i,k)}active.push(influence>.5);deformed.push(mesh.getVertexPosition(i,new THREE.Vector3()).applyMatrix4(mesh.matrixWorld))}const index=mesh.geometry.getIndex();for(let i=0;i<index.count;i+=3){const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)];if(!ids.some(id=>active[id]))continue;trianglesTested++;let polygon=ids.map(id=>deformed[id]);for(const plane of planes){if(!polygon.length)break;const next=[];for(let j=0;j<polygon.length;j++){const a=polygon[j],b=polygon[(j+1)%polygon.length],da=plane.distanceToPoint(a),db=plane.distanceToPoint(b),aInside=da<=-1e-5,bInside=db<=-1e-5;if(aInside)next.push(a);if(aInside!==bInside)next.push(a.clone().lerp(b,(-1e-5-da)/(db-da)))}polygon=next}if(polygon.length>=3)triangleHits++}}
 report.push({angle,inside,maxDepth,nearest,trianglesTested,triangleHits});
}
console.log(JSON.stringify({samples:report.length,penetratingSamples:report.filter(x=>x.inside>0).length,trianglePenetratingSamples:report.filter(x=>x.triangleHits>0).length,worst:report.reduce((a,b)=>b.maxDepth>a.maxDepth?b:a),report},null,2));
