import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildSisyphusSwitchback} from '../src/sisyphus-switchback.js';
import {builders} from '../src/scenes.js';
import {height,route} from '../src/sisyphus-switchback-route.js';

test('application uses the switchback and its speed control changes progress',()=>{
 const scene=new THREE.Scene(),view=builders.sisyphus(scene),carrier=scene.getObjectByName('switchback-carrier');assert.ok(carrier&&scene.getObjectByName('switchback-road'));assert.equal(scene.getObjectByName('sisyphus-connected-strata'),undefined);
 view.update(1,0);const slow=carrier.position.clone();view.update(1,1);assert.ok(carrier.position.distanceTo(slow)>.1);view.dispose();assert.equal(scene.children.length,0);
});

test('candidate ground cover remains outside the switchback road',()=>{
 const scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene),cover=scene.getObjectByName('switchback-ground-cover'),samples=Array.from({length:501},(_,i)=>route(i/500)),matrix=new THREE.Matrix4(),point=new THREE.Vector3();assert.ok(cover?.isInstancedMesh&&cover.count>=100);
 for(let i=0;i<cover.count;i++){cover.getMatrixAt(i,matrix);point.setFromMatrixPosition(matrix);let nearest=Infinity;for(const p of samples)nearest=Math.min(nearest,Math.hypot(point.x-p.x,point.z-p.z));assert.ok(nearest>1.1,`ground cover enters the protected corridor at instance ${i}`)}view.dispose();
});

test('candidate limbs stay connected to their joints through the ascent',()=>{
 const scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene),parts={};for(const name of ['upper-arm','forearm','elbow','hand','thigh','shin','knee','foot']){parts[name]=[];scene.traverse(o=>{if(o.name===`switchback-${name}`)parts[name].push(o)});assert.equal(parts[name].length,2)}
 for(let i=0;i<80;i++){view.update(i/80*.8/.045,0);scene.updateMatrixWorld(true);for(let side=0;side<2;side++)for(const [upper,lower,joint,tip] of [['upper-arm','forearm','elbow','hand'],['thigh','shin','knee','foot']]){const a=parts[upper][side],b=parts[lower][side],middle=parts[joint][side].getWorldPosition(new THREE.Vector3()),end=parts[tip][side].getWorldPosition(new THREE.Vector3());assert.ok(a.localToWorld(new THREE.Vector3(0,.5,0)).distanceTo(middle)<1e-6);assert.ok(b.localToWorld(new THREE.Vector3(0,-.5,0)).distanceTo(middle)<1e-6);assert.ok(b.localToWorld(new THREE.Vector3(0,.5,0)).distanceTo(end)<1e-6);assert.ok(a.scale.y<.8&&b.scale.y<.8,`unreasonable limb extension at sample ${i}`)}}
 view.dispose();
});

test('candidate follows the continuous route, supports its fallback boulder and releases resources',()=>{
 const scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene),rock=scene.getObjectByName('switchback-boulder'),actor=scene.getObjectByName('switchback-actor');
 assert.ok(scene.getObjectByName('switchback-road')&&scene.getObjectByName('switchback-hill')&&rock&&actor);
 for(let i=0;i<=100;i++){const t=i/10;view.update(t,.5);scene.updateMatrixWorld(true);const p=rock.geometry.getAttribute('position');let gap=Infinity;
  for(let j=0;j<p.count;j++){const v=new THREE.Vector3().fromBufferAttribute(p,j).applyMatrix4(rock.matrixWorld);gap=Math.min(gap,v.y-height(v.x,v.z)-.04)}
  assert.ok(Math.abs(gap)<1e-5,`fallback boulder contact at ${t}: ${gap}`);assert.equal(actor.visible,true,'figure stays visible on both ascent and return');
 }
 let disposed=0,textureDisposals=0;rock.geometry.addEventListener('dispose',()=>disposed++);const road=scene.getObjectByName('switchback-road'),texture=road.material.map;assert.ok(road.geometry.getAttribute('uv')&&texture);texture.addEventListener('dispose',()=>textureDisposals++);view.dispose();assert.equal(disposed,1);assert.equal(textureDisposals,1);assert.equal(scene.children.length,0);
});

test('candidate accepts the delivered rock and disposes a late asset safely',async()=>{
 const data=await readFile(new URL('../public/assets/moon_rock_02.glb',import.meta.url));
 const asset=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');let deliver;
 const scene=new THREE.Scene(),view=buildSisyphusSwitchback(scene,null,callback=>{deliver=callback}),rock=scene.getObjectByName('switchback-boulder'),old=rock.geometry;
 deliver(asset.scene);assert.notEqual(rock.geometry,old);view.update(2,.5);scene.updateMatrixWorld(true);const positions=rock.geometry.getAttribute('position');let gap=Infinity;
 for(let i=0;i<positions.count;i++){const p=new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(rock.matrixWorld);gap=Math.min(gap,p.y-height(p.x,p.z)-.04)}assert.ok(Math.abs(gap)<1e-5);
 view.dispose();assert.equal(scene.children.length,0);
 const lateGeometry=new THREE.BoxGeometry(),lateMaterial=new THREE.MeshBasicMaterial(),late=new THREE.Group();late.add(new THREE.Mesh(lateGeometry,lateMaterial));let disposal=0;lateGeometry.addEventListener('dispose',()=>disposal++);deliver(late);assert.equal(disposal,1);
});
