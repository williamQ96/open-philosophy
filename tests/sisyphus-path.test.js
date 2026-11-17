import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {concepts} from '../src/concepts.js';
import {buildSisyphus} from '../src/scenes.js';
import {addSceneDetails} from '../src/scene-details.js';
import {enrichScene} from '../src/scene-enrichment.js';
import {sisyphusGround,sisyphusPath,sisyphusSurface,sisyphusGaitFoot,sisyphusHandTarget} from '../src/sisyphus-path.js';
import {readFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// Preserve tests for the previous cone study; production uses the switchback.
function legacySisyphus(scene,concept){const view=buildSisyphus(scene,concept),root=scene.children.at(-1),detail=addSceneDetails('sisyphus',root),enrichment=enrichScene('sisyphus',root);return {update(t,v){view.update(t,v);detail(t,v);enrichment(t,v)},dispose(){view.dispose()}}}

test('hand projection follows triangle interiors across a shared edge',()=>{
 const indexed=new THREE.PlaneGeometry(2,2),geometries=[indexed,indexed.toNonIndexed()],angle=.7,c=Math.cos(angle),s=Math.sin(angle),center=new THREE.Vector3(1,2,3);
 for(const geometry of geometries){let previous;for(let i=0;i<=40;i++){const x=-.8+i*.04,y=x,shoulder=new THREE.Vector3(center.x+c*x-s*y,center.y+s*x+c*y,center.z+1),target=sisyphusHandTarget(geometry,angle,center,shoulder);assert.ok(Math.abs(target.z-center.z)<1e-6);assert.ok(Math.abs(target.x-shoulder.x)<1e-6&&Math.abs(target.y-shoulder.y)<1e-6);if(previous)assert.ok(target.distanceTo(previous)<.06);previous=target}geometry.dispose()}
});

test('rock scenery clears the entire Sisyphus motion path and shared geometry is released once',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]);
 const rocks=[];scene.traverse(object=>{if(object.name==='sisyphus-crag')rocks.push(object)});
 assert.ok(rocks.length>=12,'terrain should contain a substantial set of crags');
 const motion=scene.getObjectByName('sisyphus-motion');assert.ok(motion);
 const surface=scene.getObjectByName('sisyphus-path');assert.ok(surface);
 const normals=surface.geometry.getAttribute('normal');
 for(let i=0;i<normals.count;i++)assert.ok(normals.getY(i)>0,'path surface must face upward');
 for(let i=0;i<=120;i++){
  const path=sisyphusPath(i/120);assert.ok(Number.isFinite(path.x)&&Number.isFinite(path.y)&&Number.isFinite(path.z));
  for(const rock of rocks){
   // Scenery is attached without an additional transform; include its largest scale.
   const radius=Math.max(rock.scale.x,rock.scale.z);
   assert.ok(Math.hypot(path.x-rock.position.x,path.z-rock.position.z)>radius+1.1,'crag enters the figure/boulder corridor');
  }
 }
 const geometries=new Set(rocks.map(rock=>rock.geometry));assert.equal(geometries.size,1,'crags share a single geometry');
 let disposals=0;rocks[0].geometry.addEventListener('dispose',()=>disposals++);
 view.update(1,.5);view.dispose();assert.equal(disposals,1);assert.equal(scene.children.length,0);
});

test('rotating boulder touches the modeled slope without sinking along the ascent',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]);
 const boulder=scene.getObjectByName('sisyphus-boulder');assert.ok(boulder);
 const surface=sisyphusSurface(scene.getObjectByName('sisyphus-path').geometry);
 const hands=[];scene.traverse(object=>{if(object.name==='sisyphus-hand')hands.push(object)});assert.equal(hands.length,2);
 for(let i=0;i<=9;i++){
  // At slider zero the ascending phase uses q = t * .045 / .8.
  view.update((i/10)*.8/.045,0);scene.updateMatrixWorld(true);
  const center=boulder.getWorldPosition(new THREE.Vector3());
  for(const hand of hands){
   const handPosition=boulder.worldToLocal(hand.getWorldPosition(new THREE.Vector3())),vertices=boulder.geometry.getAttribute('position'),index=boulder.geometry.index,count=index?index.count:vertices.count,triangle=new THREE.Triangle(),closest=new THREE.Vector3();let nearest=Infinity;
   for(let i=0;i+2<count;i+=3){const point=j=>new THREE.Vector3().fromBufferAttribute(vertices,index?index.getX(j):j);triangle.set(point(i),point(i+1),point(i+2));triangle.closestPointToPoint(handPosition,closest);nearest=Math.min(nearest,closest.distanceTo(handPosition))}
   assert.ok(nearest<1e-5,'each hand follows the actual boulder surface');
  }
  const positions=boulder.geometry.getAttribute('position');let lowest=Infinity;
  for(let vertex=0;vertex<positions.count;vertex++){
   const point=new THREE.Vector3().fromBufferAttribute(positions,vertex).applyMatrix4(boulder.matrixWorld);
   lowest=Math.min(lowest,point.y-surface(point.x,point.z));
  }
  assert.ok(Math.abs(lowest)<1e-5,'one vertex should touch the raised path or ground while the others remain above it');
 }
 view.dispose();
});

test('the figure alternates steps while one foot stays on the path or hill',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]),feet=[];
 scene.traverse(object=>{if(object.name==='sisyphus-foot')feet.push(object)});assert.equal(feet.length,2);
 const surface=sisyphusSurface(scene.getObjectByName('sisyphus-path').geometry);
 let lifted=false;for(let i=0;i<100;i++){
  view.update((i/100)*.8/.045,0);scene.updateMatrixWorld(true);
  const gaps=[];for(const foot of feet){const vertices=foot.geometry.getAttribute('position');let gap=Infinity;for(let vertex=0;vertex<vertices.count;vertex++){const p=new THREE.Vector3().fromBufferAttribute(vertices,vertex).applyMatrix4(foot.matrixWorld);gap=Math.min(gap,p.y-surface(p.x,p.z))}assert.ok(gap> -1e-6&&gap<.101,`foot clearance ${gap} at sample ${i}`);gaps.push(gap)}assert.ok(Math.min(...gaps)<1e-6,`one foot should remain supported at sample ${i}`);lifted||=Math.max(...gaps)>.08;
 }
 assert.ok(lifted,'the swing foot should visibly lift');view.dispose();assert.equal(scene.children.length,0);
});

test('support foot remains at its world-space anchor across the ascent',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]),feet=[];scene.traverse(o=>{if(o.name==='sisyphus-foot')feet.push(o)});let supported=0;
 for(let i=0;i<500;i++){const q=i/500,next=q+1e-6;view.update(q*.8/.045,0);scene.updateMatrixWorld(true);const before=feet.map(foot=>foot.getWorldPosition(new THREE.Vector3()));view.update(next*.8/.045,0);scene.updateMatrixWorld(true);for(let j=0;j<2;j++){const side=j?-1:1;if(sisyphusGaitFoot(q,side).lift<1e-9&&sisyphusGaitFoot(next,side).lift<1e-9){const after=feet[j].getWorldPosition(new THREE.Vector3());assert.ok(Math.hypot(after.x-before[j].x,after.z-before[j].z)<1e-8,`support foot slides at ${q}`);supported++}}}
 assert.ok(supported>400);view.dispose();
});

test('segmented limbs remain joined as the figure follows the boulder',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]),parts={};for(const name of ['upper-arm','forearm','elbow','hand','thigh','shin','knee','foot']){parts[name]=[];scene.traverse(o=>{if(o.name===`sisyphus-${name}`)parts[name].push(o)});assert.equal(parts[name].length,2)}
 const end=(object,y)=>object.localToWorld(new THREE.Vector3(0,y,0)),center=object=>object.getWorldPosition(new THREE.Vector3());
 for(let i=0;i<20;i++){view.update(i/20*.8/.045,0);scene.updateMatrixWorld(true);for(let side=0;side<2;side++){
  for(const [upper,lower,joint,tip] of [['upper-arm','forearm','elbow','hand'],['thigh','shin','knee','foot']]){const middle=center(parts[joint][side]);assert.ok(end(parts[upper][side],.5).distanceTo(middle)<1e-6);assert.ok(end(parts[lower][side],-.5).distanceTo(middle)<1e-6);assert.ok(end(parts[lower][side],.5).distanceTo(center(parts[tip][side]))<(tip==='foot'?.041:1e-6))}
 }}view.dispose();
});

test('loaded boulder clears the visible path triangles and touches the terrain',async()=>{
 const data=await readFile(new URL('../public/assets/moon_rock_02.glb',import.meta.url));
 const gltf=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
 const scene=new THREE.Scene(),view=buildSisyphus(scene,null,callback=>callback(gltf.scene)),rock=scene.getObjectByName('sisyphus-boulder'),path=scene.getObjectByName('sisyphus-path');
 assert.ok(rock.geometry.getAttribute('position').count>1000,'the actual delivered asset should be tested');
 const ray=new THREE.Raycaster(),origin=new THREE.Vector3(),down=new THREE.Vector3(0,-1,0),point=new THREE.Vector3();
 for(const q of [0,.2,.4,.6,.8,.98]){
  view.update(q*.8/.045,0);scene.updateMatrixWorld(true);let min=Infinity;const vertices=rock.geometry.getAttribute('position');
  for(let i=0;i<vertices.count;i++){
   point.fromBufferAttribute(vertices,i).applyMatrix4(rock.matrixWorld);origin.set(point.x,20,point.z);ray.set(origin,down);
   const hits=ray.intersectObject(path,false),height=Math.max(sisyphusGround(point.x,point.z),hits.length?hits[0].point.y:-Infinity);
   min=Math.min(min,point.y-height);
  }
  assert.ok(Math.abs(min)<1e-5,`loaded rock at ${q} should touch visible surface; clearance ${min}`);
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('boulder and feet contact the rendered hill, path and base meshes',async()=>{
 const data=await readFile(new URL('../public/assets/moon_rock_02.glb',import.meta.url)),gltf=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
 const scene=new THREE.Scene(),view=buildSisyphus(scene,null,callback=>callback(gltf.scene)),rock=scene.getObjectByName('sisyphus-boulder'),surfaces=['sisyphus-hill','sisyphus-path','sisyphus-base'].map(name=>scene.getObjectByName(name)),ray=new THREE.Raycaster(),point=new THREE.Vector3(),feet=[];scene.traverse(o=>{if(o.name==='sisyphus-foot')feet.push(o)});
 for(const q of [0,.2,.4,.6,.8,.98]){view.update(q*.8/.045,0);scene.updateMatrixWorld(true);const footGaps=[];for(const object of [rock,...feet]){let gap=Infinity;const vertices=object.geometry.getAttribute('position');for(let i=0;i<vertices.count;i++){point.fromBufferAttribute(vertices,i).applyMatrix4(object.matrixWorld);ray.set(new THREE.Vector3(point.x,20,point.z),new THREE.Vector3(0,-1,0));const hits=ray.intersectObjects(surfaces,false);if(hits.length)gap=Math.min(gap,point.y-hits[0].point.y)}if(object===rock)assert.ok(Math.abs(gap)<.015,`boulder rendered contact at ${q} has gap ${gap}`);else {assert.ok(gap>-.015&&gap<.115,`foot clearance at ${q} has gap ${gap}`);footGaps.push(gap)}}assert.ok(Math.min(...footGaps)<.015,`one foot remains supported at ${q}`)}
 view.dispose();
});

test('large rock masses clear the entire moving path and are embedded in the hill',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]),rocks=[];scene.traverse(o=>{if(o.name==='sisyphus-rock-mass')rocks.push(o)});assert.ok(rocks.length>=12);
 for(const rock of rocks){const radius=Math.max(rock.scale.x,rock.scale.z);for(let i=0;i<=120;i++){const p=sisyphusPath(i/120);assert.ok(Math.hypot(p.x-rock.position.x,p.z-rock.position.z)>radius+1.4-1e-6)}assert.ok(Math.abs(rock.position.y-sisyphusGround(rock.position.x,rock.position.z)+.08)<1e-6)}
 view.dispose();
});

test('connected rock strata stay clear of the moving corridor',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]),strata=scene.getObjectByName('sisyphus-connected-strata');assert.ok(strata);scene.updateMatrixWorld(true);
 const ray=new THREE.Raycaster(),direction=new THREE.Vector3(0,-1,0);for(let i=0;i<=48;i++){const p=sisyphusPath(i/48);for(let j=0;j<16;j++){const a=j*Math.PI/8,x=p.x+Math.cos(a)*1.5,z=p.z+Math.sin(a)*1.5;ray.set(new THREE.Vector3(x,10,z),direction);for(const hit of ray.intersectObject(strata))assert.ok(hit.point.y<=sisyphusGround(x,z)+.001,'rock strata intrude into the motion corridor')}}
 view.dispose();
});

test('hill ridges rise away from the motion corridor',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]),hill=scene.getObjectByName('sisyphus-hill'),ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);scene.updateMatrixWorld(true);let ridge=0;
 function height(x,z){ray.set(new THREE.Vector3(x,10,z),down);return ray.intersectObject(hill)[0]?.point.y}
 for(let i=0;i<32;i++){const a=i*Math.PI/16;for(let r=1;r<=4;r++){const x=Math.cos(a)*r,z=Math.sin(a)*r,y=height(x,z);if(y!==undefined)ridge=Math.max(ridge,y-sisyphusGround(x,z))}
  const p=sisyphusPath(i/32);for(let j=0;j<8;j++){const b=j*Math.PI/4,x=p.x+1.5*Math.cos(b),z=p.z+1.5*Math.sin(b),y=height(x,z);if(y!==undefined)assert.ok(y<=sisyphusGround(x,z)+.01,'ridge intrudes on sampled corridor')}
 }
 assert.ok(ridge>.2,'visible hill should include raised rock away from the route');view.dispose();
});

test('retaining blocks clear the sampled motion corridor',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]),blocks=[];scene.traverse(o=>{if(o.name==='sisyphus-retaining-block')blocks.push(o)});assert.ok(blocks.length>40);scene.updateMatrixWorld(true);
 for(const block of blocks){const vertices=block.geometry.getAttribute('position');for(let j=0;j<vertices.count;j++){const v=new THREE.Vector3().fromBufferAttribute(vertices,j).applyMatrix4(block.matrixWorld);for(let i=0;i<=120;i++){const p=sisyphusPath(i/120);assert.ok(Math.hypot(p.x-v.x,p.z-v.z)>1.32,'wall enters sampled route corridor')}}}
 view.dispose();assert.equal(scene.children.length,0);
});

test('olive tree is grounded outside the moving path corridor',()=>{
 const scene=new THREE.Scene(),view=legacySisyphus(scene,concepts[0]),tree=scene.getObjectByName('sisyphus-olive'),leaves=scene.getObjectByName('sisyphus-olive-leaves');assert.ok(tree&&leaves?.isInstancedMesh);assert.ok(Math.abs(tree.position.y-sisyphusGround(tree.position.x,tree.position.z))<1e-8);
 for(let i=0;i<=120;i++){const p=sisyphusPath(i/120);assert.ok(Math.hypot(p.x-tree.position.x,p.z-tree.position.z)>2.5,'tree center encroaches on the route')}
 let disposed=0;leaves.geometry.addEventListener('dispose',()=>disposed++);view.dispose();assert.equal(disposed,1);assert.equal(scene.children.length,0);
});
