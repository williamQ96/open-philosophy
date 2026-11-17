import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import {sisyphusHandTarget} from '../src/sisyphus-path.js';
import {buildSisyphusSwitchback} from '../src/sisyphus-switchback.js';
import {route as productionRoute,roadHalfWidth as productionRoadHalfWidth,tangent as productionTangent,terrainGeometry as productionTerrainGeometry,roadGeometry as productionRoadGeometry,height as productionHeight} from '../src/sisyphus-switchback-route.js';
import {behind,curbPoints,cyclePosition,gaitFoot,height,outcrops,retainingWallGeometry,roadGeometry,roadHalfWidth,route,routeLength,turnRadius,tangent,terrainGeometry} from '../review/sisyphus-switchback/route.js';

test('production rock fins stay outside the movement corridor',()=>{
 const scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene,{}),fins=[];scene.traverse(o=>{if(o.name==='switchback-rock-fin')fins.push(o)});assert.ok(fins.length>5);scene.updateMatrixWorld(true);
 const routePoints=Array.from({length:1001},(_,i)=>productionRoute(i/1000));
 for(const fin of fins){const vertices=fin.geometry.attributes.position;for(let i=0;i<vertices.count;i++){const p=new THREE.Vector3().fromBufferAttribute(vertices,i).applyMatrix4(fin.matrixWorld);let nearest=Infinity;for(const point of routePoints)nearest=Math.min(nearest,Math.hypot(p.x-point.x,p.z-point.z));assert.ok(nearest>productionRoadHalfWidth+.1,`rock enters path at ${nearest}`)}}
 view.dispose();assert.equal(scene.children.length,0);
});

test('production terrain stays beneath the road at sampled cross sections',()=>{
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),terrain=new THREE.Mesh(productionTerrainGeometry(),material),road=new THREE.Mesh(productionRoadGeometry(),material),ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
 for(let i=1;i<100;i++){const q=i/100,p=productionRoute(q),d=productionTangent(q);for(const offset of [-.65,0,.65]){const x=p.x-d.y*offset,z=p.z+d.x*offset;ray.set(new THREE.Vector3(x,12,z),down);const ground=ray.intersectObject(terrain)[0],surface=ray.intersectObject(road)[0];assert.ok(ground&&surface,`missing production surface at ${q}, ${offset}`);assert.ok(surface.point.y-ground.point.y>.005,`production terrain intersects the road at ${q}, ${offset}`)}}
 terrain.geometry.dispose();road.geometry.dispose();material.dispose();
});

test('loaded production boulder stays supported on its rendered road through a full cycle',async()=>{
 const data=await readFile(new URL('../public/assets/moon_rock_02.glb',import.meta.url)),gltf=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
 const scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene,{},deliver=>deliver(gltf.scene)),rock=scene.getObjectByName('switchback-boulder'),road=scene.getObjectByName('switchback-road'),vertices=rock.geometry.getAttribute('position'),centers=Array.from({length:801},(_,i)=>productionRoute(i/800)),period=1/(.045+.5*.12),ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),point=new THREE.Vector3();assert.ok(vertices.count>1000,'the loaded asset must replace the proxy');
 for(let sample=0;sample<=80;sample++){view.update(period*sample/80,.5);scene.updateMatrixWorld(true);let lowestGap=Infinity,contact;
  for(let i=0;i<vertices.count;i++){point.fromBufferAttribute(vertices,i).applyMatrix4(rock.matrixWorld);const gap=point.y-productionHeight(point.x,point.z)-.04;if(gap<lowestGap){lowestGap=gap;contact=point.clone()}if(i%4===0){let nearest=Infinity;for(const center of centers)nearest=Math.min(nearest,Math.hypot(point.x-center.x,point.z-center.z));assert.ok(nearest<productionRoadHalfWidth-.02,`rock footprint exceeds production road at sample ${sample}`)}}
  ray.set(new THREE.Vector3(contact.x,contact.y+3,contact.z),down);const hit=ray.intersectObject(road)[0];assert.ok(hit,`production road missing at sample ${sample}`);const gap=contact.y-hit.point.y;assert.ok(gap>-.025&&gap<.045,`rock-to-rendered-road gap ${gap} at sample ${sample}`);
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('switchback cycle returns the boulder continuously',()=>{
 const start=cyclePosition(0),summit=cyclePosition(20),beforeSummit=cyclePosition(20-1e-6),beforeRestart=cyclePosition(25-1e-6),restart=cyclePosition(25);
 assert.ok(start.ascending);assert.ok(!summit.ascending);assert.ok(Math.abs(summit.q-(1-.8/routeLength))<1e-12);assert.ok(Math.abs(beforeSummit.q-summit.q)<1e-6);assert.ok(Math.abs(beforeRestart.q-restart.q)<1e-6);assert.ok(restart.ascending);
 let previous=start.q;for(let i=1;i<=80;i++){const p=cyclePosition(i/4);assert.ok(p.q>=previous-1e-12);previous=p.q}for(let i=81;i<=100;i++){const p=cyclePosition(i/4);assert.ok(p.q<=previous+1e-12);previous=p.q}
});

test('production figure remains visible and continuous through the return',()=>{
 const scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene,{}),actor=scene.getObjectByName('switchback-actor'),torso=scene.getObjectByName('switchback-torso'),rock=scene.getObjectByName('switchback-carrier'),period=1/(.045+.5*.12);assert.ok(actor&&torso&&rock);
 for(const phase of [0,.4,.799,.8,.85,.9,.99,1]){view.update(period*phase,.5);assert.ok(actor.visible,`figure hidden at ${phase}`)}
 for(const phase of [.8,1]){view.update(period*phase-1e-7,.5);scene.updateMatrixWorld(true);const before=[torso,rock].map(o=>o.getWorldPosition(new THREE.Vector3()));view.update(period*phase+1e-7,.5);scene.updateMatrixWorld(true);for(const [i,o] of [torso,rock].entries())assert.ok(before[i].distanceTo(o.getWorldPosition(new THREE.Vector3()))<.001,'cycle transition jumps')}
 view.dispose();assert.equal(scene.children.length,0);
});

test('production pushing pose clears the loaded boulder and keeps arms connected',async()=>{
 const bytes=await readFile(new URL('../public/assets/moon_rock_02.glb',import.meta.url)),gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');const scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene,{},callback=>callback(gltf.scene)),rock=scene.getObjectByName('switchback-boulder'),head=scene.getObjectByName('switchback-head'),hands=[],elbows=[],upper=[],forearms=[];
 scene.traverse(o=>{if(o.name==='switchback-hand')hands.push(o);if(o.name==='switchback-elbow')elbows.push(o);if(o.name==='switchback-upper-arm')upper.push(o);if(o.name==='switchback-forearm')forearms.push(o)});const neck=scene.getObjectByName('switchback-neck'),torso=scene.getObjectByName('switchback-torso'),p=rock.geometry.getAttribute('position'),index=rock.geometry.index,tri=new THREE.Triangle(),closest=new THREE.Vector3(),center=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),period=1/(.045+.5*.12);
 for(let sample=0;sample<=80;sample++){view.update(period*sample/80,.5);scene.updateMatrixWorld(true);rock.worldToLocal(head.getWorldPosition(center));let distance=Infinity;for(let j=0;j<index.count;j+=3){tri.set(a.fromBufferAttribute(p,index.getX(j)),b.fromBufferAttribute(p,index.getX(j+1)),c.fromBufferAttribute(p,index.getX(j+2)));tri.closestPointToPoint(center,closest);distance=Math.min(distance,closest.distanceTo(center))}assert.ok(distance>.187,`head enters the boulder at ${sample}/80: ${distance}`);assert.ok(neck.localToWorld(new THREE.Vector3(0,.5,0)).distanceTo(head.getWorldPosition(new THREE.Vector3()))<1e-6);assert.ok(neck.localToWorld(new THREE.Vector3(0,-.5,0)).distanceTo(torso.localToWorld(new THREE.Vector3(0,.3,0)))<1e-6);for(let i=0;i<2;i++){const joint=elbows[i].getWorldPosition(new THREE.Vector3()),hand=hands[i].getWorldPosition(new THREE.Vector3());assert.ok(upper[i].localToWorld(new THREE.Vector3(0,.5,0)).distanceTo(joint)<1e-6);assert.ok(forearms[i].localToWorld(new THREE.Vector3(0,.5,0)).distanceTo(hand)<1e-6);assert.ok(upper[i].scale.y<.8&&forearms[i].scale.y<.8)}}view.dispose();
});

test('production hands touch the loaded boulder surface through the cycle',async()=>{
 const bytes=await readFile(new URL('../public/assets/moon_rock_02.glb',import.meta.url)),gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),''),scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene,{},callback=>callback(gltf.scene)),rock=scene.getObjectByName('switchback-boulder'),hands=[];scene.traverse(o=>{if(o.name==='switchback-hand')hands.push(o)});assert.equal(hands.length,2);
 const p=rock.geometry.getAttribute('position'),index=rock.geometry.getIndex(),count=index?index.count:p.count,triangle=new THREE.Triangle(),closest=new THREE.Vector3(),period=1/(.045+.5*.12);
 for(let sample=0;sample<=40;sample++){view.update(period*sample/40,.5);scene.updateMatrixWorld(true);for(const hand of hands){const point=rock.worldToLocal(hand.getWorldPosition(new THREE.Vector3()));let distance=Infinity;for(let i=0;i+2<count;i+=3){const vertex=j=>new THREE.Vector3().fromBufferAttribute(p,index?index.getX(j):j);triangle.set(vertex(i),vertex(i+1),vertex(i+2));triangle.closestPointToPoint(point,closest);distance=Math.min(distance,closest.distanceTo(point))}assert.ok(distance<1e-5,`hand misses surface at ${sample}/40`)}}
 view.dispose();
});

test('switchback study climbs continuously without folding its road strip',()=>{
 let previous=route(0);
 for(let i=1;i<=2000;i++){
  const point=route(i/2000);
  assert.ok(point.y>=previous.y-1e-8,`descent at sample ${i}`);
  assert.ok(point.distanceTo(previous)<.02,`route discontinuity at sample ${i}`);
  assert.ok(tangent(i/2000).dot(tangent((i-1)/2000))>.998,`tangent discontinuity at sample ${i}`);
  previous=point;
 }
 const geometry=roadGeometry(),p=geometry.getAttribute('position'),index=geometry.getIndex();
 for(let i=0;i<index.count;i+=3){
  const [a,b,c]=[index.getX(i),index.getX(i+1),index.getX(i+2)];
  const signed=(p.getX(b)-p.getX(a))*(p.getZ(c)-p.getZ(a))-(p.getZ(b)-p.getZ(a))*(p.getX(c)-p.getX(a));
  assert.ok(signed>0,`folded or degenerate road triangle ${i/3}`);
 }
 assert.ok(roadHalfWidth<turnRadius,'inside of each turn must remain open');
 assert.ok(roadHalfWidth*2>1.27,'road must accommodate the measured boulder width');
 geometry.dispose();
});

test('trailing foot anchors follow the road through hairpins',()=>{
 for(let i=0;i<=500;i++){const q=1.7/routeLength+(1-1.7/routeLength)*i/500;
  for(const [distance,side] of [[1.65,-.18],[1.05,.18]]){const foot=behind(q,distance,side),center=route(q-distance/routeLength);assert.ok(Math.abs(Math.hypot(foot.x-center.x,foot.z-center.z)-.18)<1e-6);assert.ok(Math.abs(foot.y-height(foot.x,foot.z)-.04)<1e-6);assert.ok(Math.abs(side)<roadHalfWidth-.1)}
 }
});

test('alternating gait stays over the rendered road with at least one planted foot',()=>{
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),road=new THREE.Mesh(roadGeometry(),material),ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
 for(let i=0;i<=300;i++){const q=1.7/routeLength+(1-1.7/routeLength)*i/300,lifts=[];for(const side of [-1,1]){const foot=gaitFoot(q,side);ray.set(new THREE.Vector3(foot.x,10,foot.z),down);const hit=ray.intersectObject(road)[0];assert.ok(hit,`foot misses road at ${q}`);const lift=foot.y-.04125-hit.point.y;assert.ok(lift>-.02&&lift<.12,`foot height ${lift} at ${q}`);lifts.push(lift)}assert.ok(Math.min(...lifts)<.02,`neither foot is planted at ${q}`)}
 road.geometry.dispose();material.dispose();
});

test('stance anchors do not slide and gait remains continuous around step changes',()=>{
 const stride=.55,delta=1e-6;let planted=0;
 for(let i=0;i<=3000;i++){const q=1.7/routeLength+(1-1.7/routeLength-delta)*i/3000;for(const side of [-1,1]){const phase=q*routeLength/stride+(side>0?.5:0),fraction=phase-Math.floor(phase),a=gaitFoot(q,side),b=gaitFoot(q+delta,side);assert.ok(a.distanceTo(b)<.001,`gait jumps at ${q}`);if(fraction<.49){assert.ok(a.distanceTo(b)<1e-9,`support foot slides at ${q}`);planted++}}}
 assert.ok(planted>1000);
 const cycleStart=cyclePosition(0).q,cycleEnd=cyclePosition(25-1e-8).q;for(const side of [-1,1])assert.ok(gaitFoot(cycleStart,side).distanceTo(gaitFoot(cycleEnd,side))<1e-6,'gait returns to the same pose');
});

test('outcrop footprints remain beyond the road and moving corridor',()=>{
 for(const [x,z,sx,sy,sz] of outcrops)for(let i=0;i<=1000;i++){const p=route(i/1000);assert.ok(Math.hypot(x-p.x,z-p.z)>1.05+Math.max(sx,sy,sz),`outcrop too close to route at ${i/1000}`)}
});

test('continuous retaining wall remains outside the moving road corridor',()=>{
 const geometry=retainingWallGeometry(),vertices=geometry.getAttribute('position'),centers=Array.from({length:2001},(_,i)=>route(i/2000));
 let exposed=0;for(let i=0;i<vertices.count;i+=4){let nearest=Infinity;for(const p of centers)nearest=Math.min(nearest,Math.hypot(vertices.getX(i)-p.x,vertices.getZ(i)-p.z));assert.ok(nearest>roadHalfWidth+.015,`wall intrudes into the road near vertex ${i}`);if(vertices.getY(i+3)-vertices.getY(i+2)>.4)exposed++}assert.ok(exposed>100,'downhill masonry should extend below the coping');geometry.dispose();
});

test('rendered road remains above terrain at sampled positions across its width',()=>{
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),terrain=new THREE.Mesh(terrainGeometry(),material),road=new THREE.Mesh(roadGeometry(),material),ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
 for(let i=1;i<100;i++){const q=i/100,p=route(q),d=tangent(q);for(const side of [-.65,0,.65]){const x=p.x-d.y*side,z=p.z+d.x*side;ray.set(new THREE.Vector3(x,10,z),down);const ground=ray.intersectObject(terrain)[0],surface=ray.intersectObject(road)[0];assert.ok(ground&&surface,`missing surface at ${q}, ${side}`);assert.ok(surface.point.y-ground.point.y>.005,`terrain protrudes through road at ${q}, ${side}`)}}
 terrain.geometry.dispose();road.geometry.dispose();material.dispose();
});

test('trailing foot anchors meet the rendered road across sampled turns',()=>{
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),road=new THREE.Mesh(roadGeometry(),material),ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
 for(let i=0;i<=200;i++){const q=1.7/routeLength+(1-1.7/routeLength)*i/200;for(const [distance,side] of [[1.65,-.18],[1.05,.18]]){const foot=behind(q,distance,side);ray.set(new THREE.Vector3(foot.x,10,foot.z),down);const hit=ray.intersectObject(road)[0];assert.ok(hit,`foot misses road at ${q}`);assert.ok(Math.abs(foot.y-hit.point.y)<.02,`foot is not grounded at ${q}`)}}
 road.geometry.dispose();material.dispose();
});

test('sampled rotating production boulder footprint stays within the study road',async()=>{
 const data=await readFile(new URL('../public/assets/moon_rock_02.glb',import.meta.url));
 const gltf=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');let geometry;gltf.scene.traverse(o=>{if(o.isMesh)geometry=o.geometry});
 const vertices=geometry.getAttribute('position'),centers=Array.from({length:801},(_,i)=>route(i/800)),curbs=curbPoints(),material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),surfaces=[new THREE.Mesh(terrainGeometry(),material),new THREE.Mesh(roadGeometry(),material)],ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
 for(let sample=1;sample<40;sample++){const q=sample/40,p=route(q),d=tangent(q),yaw=Math.atan2(-d.y,d.x),c=Math.cos(yaw),s=Math.sin(yaw),roll=-q*12,cr=Math.cos(roll),sr=Math.sin(roll);
  let support=-Infinity;for(let i=0;i<vertices.count;i++){const x=cr*vertices.getX(i)-sr*vertices.getY(i),y=sr*vertices.getX(i)+cr*vertices.getY(i),z=vertices.getZ(i);support=Math.max(support,height(p.x+c*x+s*z,p.z-s*x+c*z)+.04-y)}
  if(q>=1.7/routeLength){const body=behind(q,1.2),bd=tangent(q-1.2/routeLength),carrier=new THREE.Object3D();carrier.position.set(p.x,support,p.z);carrier.rotation.y=yaw;carrier.updateMatrixWorld(true);for(const side of [-1,1]){const shoulder=body.clone().add(new THREE.Vector3(bd.x*.12-bd.y*side*.12,.98,bd.y*.12+bd.x*side*.12)),local=carrier.worldToLocal(shoulder),hand=sisyphusHandTarget(geometry,roll,new THREE.Vector3(),local);assert.ok(local.distanceTo(hand)<.75,`hand reach exceeds proxy proportions at ${q}`)}}
  let gap=Infinity;for(let i=0;i<vertices.count;i++){const x=cr*vertices.getX(i)-sr*vertices.getY(i),y=sr*vertices.getX(i)+cr*vertices.getY(i)+support,z=vertices.getZ(i),wx=p.x+c*x+s*z,wz=p.z-s*x+c*z;let nearest=Infinity;for(const center of centers)nearest=Math.min(nearest,Math.hypot(wx-center.x,wz-center.z));assert.ok(nearest<roadHalfWidth-.03,`boulder footprint exceeds road at ${q}`);for(const curb of curbs)assert.ok(y>=curb.y+.075||Math.hypot(wx-curb.x,wz-curb.z)>=Math.SQRT2*.065,`boulder vertex touches curb at ${q}`);
   if(sample%8===0&&i%8===0){ray.set(new THREE.Vector3(wx,10,wz),down);const hit=ray.intersectObjects(surfaces,false)[0];if(hit)gap=Math.min(gap,y-hit.point.y)}
  }
  if(sample%8===0)assert.ok(gap>-.02&&gap<.04,`boulder/rendered surface gap ${gap} at ${q}`);
 }
 surfaces.forEach(o=>o.geometry.dispose());material.dispose();geometry.dispose();gltf.scene.traverse(o=>{if(o.material)[].concat(o.material).forEach(m=>m.dispose())});
});
