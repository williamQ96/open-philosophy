import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('panopticon cells face the central tower and beam responds to controls',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),cells=[];
 scene.traverse(object=>{if(object.name==='panopticon-cell')cells.push(object)});
 assert.equal(cells.length,19);
 for(const cell of cells){
  const inward=new THREE.Vector3(0,0,-1).applyQuaternion(cell.quaternion);
  const towardCenter=cell.position.clone().multiplyScalar(-1).normalize();
  assert.ok(inward.dot(towardCenter)>.999999,'every cell front faces the tower');
 }
 const beam=scene.getObjectByName('panopticon-beam'),pivot=scene.getObjectByName('panopticon-beam-pivot');
 view.update(1,0);assert.equal(beam.material.opacity,0);
 view.update(1,1);assert.ok(beam.material.opacity>.2);assert.ok(pivot.rotation.y>.8);
 view.dispose();assert.equal(scene.children.length,0);
});

test('observation level is a framed glazed space with a floor and ceiling',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),windows=[],posts=[];scene.traverse(o=>{if(o.name==='panopticon-observation-window')windows.push(o);if(o.name==='panopticon-observation-post')posts.push(o)});assert.equal(windows.length,10);assert.equal(posts.length,10);assert.ok(windows.every(w=>w.material.transparent&&w.material.opacity<.5));scene.updateMatrixWorld(true);const floor=new THREE.Box3().setFromObject(scene.getObjectByName('panopticon-observation-floor'),true),ceiling=new THREE.Box3().setFromObject(scene.getObjectByName('panopticon-observation-ceiling'),true);assert.ok(floor.max.y<3.12&&ceiling.min.y>3.12);const ray=new THREE.Raycaster(new THREE.Vector3(0,3.12,0),new THREE.Vector3(.15,0,1).normalize(),0,1.1),hits=ray.intersectObjects(scene.children,true);assert.ok(hits.length);assert.equal(hits[0].object.name,'panopticon-observation-window');view.dispose();
});

test('cell fill lighting remains independent of the observation control',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),lights=[];scene.traverse(o=>{if(o.name==='panopticon-cell-fill')lights.push(o)});assert.equal(lights.length,9);const intensities=lights.map(o=>o.intensity);
 for(const value of [0,.5,1]){view.update(2,value);assert.deepEqual(lights.map(o=>o.intensity),intensities);assert.ok(lights.every(o=>o.isPointLight&&!o.castShadow))}view.dispose();
});

test('rear cutaway tiers are supported by their galleries and face inward',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),upper=[],galleries=[];
 scene.traverse(o=>{if(o.name==='panopticon-upper-cell')upper.push(o);if(o.name==='panopticon-gallery')galleries.push(o)});
 assert.equal(galleries.length,2);assert.equal(upper.length,20);
 for(const cell of upper){const toward=cell.position.clone().setY(0).multiplyScalar(-1).normalize(),inward=new THREE.Vector3(0,0,-1).applyQuaternion(cell.quaternion);assert.ok(inward.dot(toward)>.999999);assert.ok(cell.position.x+cell.position.z<-.2);assert.ok(galleries.some(g=>Math.abs(g.position.y-cell.position.y)<1e-8));}
 assert.deepEqual([...new Set(upper.map(o=>o.position.y))].sort(),[1.85,3.11]);view.dispose();assert.equal(scene.children.length,0);
});

test('every cell has a supporting floor and both galleries have thickness',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),cells=[],galleries=[];scene.traverse(o=>{if(o.name==='panopticon-cell'||o.name==='panopticon-upper-cell')cells.push(o);if(o.name==='panopticon-gallery')galleries.push(o)});assert.equal(cells.length,39);scene.updateMatrixWorld(true);
 const courtyardTop=new THREE.Box3().setFromObject(scene.getObjectByName('panopticon-courtyard')).max.y;
 for(const cell of cells){const floor=cell.getObjectByName('panopticon-cell-floor'),legs=cell.children.filter(o=>o.name==='panopticon-bed-leg');assert.ok(floor);assert.equal(legs.length,4);const top=new THREE.Box3().setFromObject(floor).max.y;for(const leg of legs)assert.ok(Math.abs(new THREE.Box3().setFromObject(leg).min.y-top)<1e-6);if(cell.name==='panopticon-cell')assert.ok(Math.abs(top-courtyardTop)<1e-6);else assert.ok(Math.abs(top-cell.position.y-.0272)<1e-6)}
 for(const gallery of galleries){gallery.geometry.computeBoundingBox();assert.ok(Math.abs(gallery.geometry.boundingBox.min.y+.1)<1e-6);assert.equal(gallery.geometry.boundingBox.max.y,0)}
 view.dispose();assert.equal(scene.children.length,0);
});

test('entry bay has a supported floor and an unobstructed central passage',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),entry=scene.getObjectByName('panopticon-entry'),floor=scene.getObjectByName('panopticon-entry-floor'),gates=[];entry.traverse(o=>{if(o.name==='panopticon-entry-gate')gates.push(o)});assert.equal(gates.length,2);assert.ok(gates.every(g=>Math.abs(g.rotation.y)>.5));scene.updateMatrixWorld(true);
 assert.ok(Math.abs(new THREE.Box3().setFromObject(floor).max.y-new THREE.Box3().setFromObject(scene.getObjectByName('panopticon-courtyard')).max.y)<1e-6);
 const origin=entry.localToWorld(new THREE.Vector3(0,.7,.8)),direction=new THREE.Vector3(0,0,-1).applyQuaternion(entry.getWorldQuaternion(new THREE.Quaternion())),ray=new THREE.Raycaster(origin,direction,0,2);assert.equal(ray.intersectObject(entry,true).length,0,'open gate should leave the center clear');view.dispose();
});

test('upper wall coping follows and meets the exposed upper tier',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),coping=scene.getObjectByName('panopticon-upper-wall-coping'),cells=[];scene.traverse(o=>{if(o.name==='panopticon-upper-cell'&&o.position.y===3.11)cells.push(o)});assert.ok(coping);assert.equal(cells.length,10);scene.updateMatrixWorld(true);for(const cell of cells){const point=cell.localToWorld(new THREE.Vector3(0,1.89,0));const ray=new THREE.Raycaster(point.clone().add(new THREE.Vector3(0,.1,0)),new THREE.Vector3(0,-1,0),0,.2);assert.ok(ray.intersectObject(coping).length)}assert.ok(Math.abs(coping.geometry.parameters.thetaLength-Math.PI)<1e-9);view.dispose();
});

test('outer window masonry forms an arched opening',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),cell=scene.getObjectByName('panopticon-cell'),spandrel=cell.getObjectByName('panopticon-window-spandrel');scene.updateMatrixWorld(true);assert.ok(spandrel);
 function hit(x,y){const origin=cell.localToWorld(new THREE.Vector3(x,y,.5)),direction=new THREE.Vector3(0,0,-1).applyQuaternion(cell.getWorldQuaternion(new THREE.Quaternion()));return new THREE.Raycaster(origin,direction,0,1).intersectObject(spandrel).length>0}
 assert.equal(hit(.16,1.40),true);assert.equal(hit(.16,1.32),false);assert.equal(hit(0,1.40),false);view.dispose();
});

test('facade joints avoid the open window and share their geometry',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),joints=[];scene.traverse(o=>{if(o.name==='panopticon-facade-joints')joints.push(o)});assert.equal(joints.length,39);assert.ok(joints.every(o=>o.geometry===joints[0].geometry));
 const p=joints[0].geometry.getAttribute('position');for(let i=0;i<p.count;i+=2){const minX=Math.min(p.getX(i),p.getX(i+1)),maxX=Math.max(p.getX(i),p.getX(i+1)),minY=Math.min(p.getY(i),p.getY(i+1)),maxY=Math.max(p.getY(i),p.getY(i+1));assert.ok(maxX<=-.225+1e-6||minX>=.225-1e-6||maxY<=.53||minY>=1.44,'joint crosses the arched window opening')}
 let disposed=0;joints[0].geometry.addEventListener('dispose',()=>disposed++);view.dispose();assert.equal(disposed,1);
});

test('external piers frame each bay without entering its central opening',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),bays=[];scene.traverse(o=>{if(['panopticon-cell','panopticon-upper-cell','panopticon-entry'].includes(o.name))bays.push(o)});assert.equal(bays.length,40);
 for(const bay of bays){const piers=bay.children.filter(o=>o.name==='panopticon-exterior-pier'),bases=bay.children.filter(o=>o.name==='panopticon-pier-base'),caps=bay.children.filter(o=>o.name==='panopticon-pier-cap');assert.equal(piers.length,2);assert.equal(bases.length,2);assert.equal(caps.length,2);for(const pier of piers)assert.ok(Math.abs(pier.position.x)-pier.geometry.parameters.width/2>.4)}view.dispose();
});

test('cell bedding rests on the mattress and clears the side linings',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),cells=[];scene.traverse(o=>{if(o.name==='panopticon-cell'||o.name==='panopticon-upper-cell')cells.push(o)});scene.updateMatrixWorld(true);
 for(const cell of cells){const mattress=cell.getObjectByName('panopticon-mattress'),cover=cell.getObjectByName('panopticon-blanket'),linings=cell.children.filter(o=>o.name==='panopticon-cell-lining');assert.equal(linings.length,2);assert.ok(Math.abs(new THREE.Box3().setFromObject(mattress).max.y-new THREE.Box3().setFromObject(cover).min.y)<1e-6);assert.ok(mattress.position.x+.25<linings[1].position.x-.004)}view.dispose();
});

test('cell masonry stays on both inner walls and shares disposable geometry',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),cells=[],mortars=[];scene.traverse(o=>{if(o.name==='panopticon-cell'||o.name==='panopticon-upper-cell')cells.push(o);if(o.name==='panopticon-cell-mortar')mortars.push(o)});assert.equal(mortars.length,39);assert.ok(mortars.every(m=>cells.includes(m.parent)&&m.geometry===mortars[0].geometry));
 const p=mortars[0].geometry.getAttribute('position');for(let i=0;i<p.count;i++){assert.ok(Math.abs(Math.abs(p.getX(i))-.461)<1e-6);assert.ok(p.getY(i)>=.05-1e-6&&p.getY(i)<=1.79+1e-6);assert.ok(p.getZ(i)>=-.97&&p.getZ(i)<=0)}let disposed=0;mortars[0].geometry.addEventListener('dispose',()=>disposed++);view.dispose();assert.equal(disposed,1);
});

test('cutaway side masonry follows every cell and is disposed once',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),walls=[];scene.traverse(o=>{if(o.name==='panopticon-outer-mortar')walls.push(o)});assert.equal(walls.length,39);assert.ok(walls.every(w=>w.geometry===walls[0].geometry));const p=walls[0].geometry.getAttribute('position');for(let i=0;i<p.count;i++)assert.ok(Math.abs(Math.abs(p.getX(i))-.591)<1e-6);let disposed=0;walls[0].geometry.addEventListener('dispose',()=>disposed++);view.dispose();assert.equal(disposed,1);
});

test('outer window crossbars stay within the openings on every tier',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),cells=[],courses=[];scene.traverse(o=>{if(o.name==='panopticon-cell'||o.name==='panopticon-upper-cell')cells.push(o);if(o.name==='panopticon-roof-course')courses.push(o)});assert.equal(courses.length,3);assert.equal(cells.length,39);
 for(const cell of cells){const bars=cell.children.filter(o=>o.name==='panopticon-window-crossbar');assert.equal(bars.length,2);for(const bar of bars){assert.ok(Math.abs(bar.position.x)+bar.geometry.parameters.width/2<=.23);assert.ok(bar.position.y<1.2)}}
 view.dispose();
});

test('lower tower has eight arched window cues below the observation level',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),windows=[];scene.traverse(o=>{if(o.name==='panopticon-lower-window')windows.push(o)});assert.equal(windows.length,8);for(const window of windows){window.geometry.computeBoundingBox();assert.ok(window.geometry.boundingBox.max.y>.6);assert.ok(window.position.y+window.geometry.boundingBox.max.y<2.45);assert.ok(Math.abs(Math.hypot(window.position.x,window.position.z)-.99)<1e-8)}view.dispose();
});

test('cell lining warmth stays constant while observation beam changes',()=>{
 const scene=new THREE.Scene(),view=builders.panopticon(scene),linings=[];scene.traverse(o=>{if(o.name==='panopticon-cell-lining')linings.push(o)});assert.ok(linings.length>30);const materials=[...new Set(linings.map(o=>o.material))],before=materials.map(m=>[m.emissive.getHex(),m.emissiveIntensity]);assert.ok(before.every(([,intensity])=>intensity>0));for(const value of [0,.5,1]){view.update(2,value);assert.deepEqual(materials.map(m=>[m.emissive.getHex(),m.emissiveIntensity]),before)}view.dispose();
});
