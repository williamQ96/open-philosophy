import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('liquid volume stays within the glass and clears the diffuser',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),volume=scene.getObjectByName('vat-liquid-volume'),bottom=scene.getObjectByName('vat-liquid-bottom'),glass=scene.getObjectByName('vat-glass');assert.ok(volume&&bottom&&glass);scene.updateMatrixWorld(true);
 const liquid=new THREE.Box3().setFromObject(volume,true),container=new THREE.Box3().setFromObject(glass,true);assert.ok(liquid.min.x>container.min.x&&liquid.max.x<container.max.x);assert.ok(liquid.min.y>container.min.y&&liquid.max.y<container.max.y);assert.ok(bottom.geometry.parameters.innerRadius>.3);assert.ok(volume.material.transparent&&!volume.material.depthWrite);view.dispose();
});

test('each exterior cable terminates at a separate console socket',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),cables=[],sockets=[];
 scene.traverse(o=>{if(o.name==='vat-external-cable')cables.push(o);if(o.name==='vat-console-cable-socket')sockets.push(o)});scene.updateMatrixWorld(true);
 assert.equal(cables.length,4);assert.equal(sockets.length,4);
 for(let i=0;i<4;i++){const end=cables[i].geometry.parameters.path.getPoint(1),top=sockets[i].localToWorld(new THREE.Vector3(0,.07,0));assert.ok(end.distanceTo(top)<1e-6,`cable ${i} misses its socket`);if(i)assert.ok(end.distanceTo(cables[i-1].geometry.parameters.path.getPoint(1))>.15)}
 view.dispose();
});

test('observer bust rests on the floor and clears nearby objects',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),bust=scene.getObjectByName('vat-observer-bust'),books=[];scene.traverse(o=>{if(o.name==='vat-floor-book')books.push(o)});scene.updateMatrixWorld(true);
 assert.ok(bust&&bust.getObjectByName('vat-bust-thinking-arm'));assert.equal(books.length,3);const bounds=new THREE.Box3().setFromObject(bust,true),floor=new THREE.Box3().setFromObject(scene.getObjectByName('vat-floor'),true);assert.ok(Math.abs(bounds.min.y-floor.max.y)<1e-6);
 for(const object of [...books,scene.getObjectByName('vat-bookcase'),scene.getObjectByName('vat-glass')])assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(object,true)));view.dispose();
});

test('vat signals and waveform respond to the signal control',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),signals=[];scene.traverse(o=>{if(o.name==='vat-signal')signals.push(o)});assert.equal(signals.length,4);
 const trace=scene.getObjectByName('vat-waveform');view.update(0,0);assert.ok(signals.every(s=>!s.visible));const flat=trace.geometry.getAttribute('position').getY(4);
 assert.doesNotThrow(()=>view.update(-.001,.5));assert.ok(signals.every(s=>s.position.toArray().every(Number.isFinite)));
 view.update(0,1);assert.ok(signals.every(s=>s.visible));assert.notEqual(trace.geometry.getAttribute('position').getY(4),flat);const previous=signals[0].position.clone();view.update(1,1);assert.ok(signals[0].position.distanceTo(previous)>.01);
 view.dispose();assert.equal(scene.children.length,0);
});

test('decorative bubbles stay inside the vessel and move independently of signal strength',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),bubbles=[];scene.traverse(o=>{if(o.name==='vat-bubble')bubbles.push(o)});assert.equal(bubbles.length,18);
 view.update(-.001,0);const first=bubbles[0].position.clone();for(const bubble of bubbles){const radius=bubble.scale.x;assert.ok(Math.hypot(bubble.position.x,bubble.position.z)+radius<1.6);assert.ok(bubble.position.y-radius>=.35);assert.ok(bubble.position.y+radius<=2.4)}
 view.update(1,0);assert.notEqual(bubbles[0].position.y,first.y);const y=bubbles[0].position.y;view.update(1,1);assert.equal(bubbles[0].position.y,y);
 // Inflated ellipsoids approximate the two lobes and their raised folds.
 for(let i=0;i<80;i++){view.update(i/10,.5);for(const bubble of bubbles){const p=bubble.position,r=bubble.scale.x;for(const side of [-1,1])assert.ok(((p.x-side*.406)/(.70+r))**2+((p.y-1.52)/(.66+r))**2+(p.z/(.97+r))**2>=1,'bubble enters the approximate brain volume')}}
 view.dispose();assert.equal(scene.children.length,0);
});

test('lid lamp stays above the liquid and independent of the signal control',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),lamp=scene.getObjectByName('vat-lid-lamp'),light=scene.getObjectByName('vat-lid-light'),surface=scene.getObjectByName('vat-liquid-surface');assert.ok(lamp&&light?.isPointLight);assert.ok(lamp.position.y>surface.position.y);const intensity=light.intensity,emission=lamp.material.emissiveIntensity;for(const value of [0,.5,1]){view.update(1,value);assert.equal(light.intensity,intensity);assert.equal(lamp.material.emissiveIntensity,emission)}view.dispose();
});

test('vat liquid and diffuser stream remain inside the tank below the brain',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),stream=[];scene.traverse(o=>{if(o.name==='vat-diffuser-bubble')stream.push(o)});
 const liquid=scene.getObjectByName('vat-liquid-surface'),waterline=scene.getObjectByName('vat-waterline'),diffuser=scene.getObjectByName('vat-diffuser');assert.ok(liquid&&waterline&&diffuser);assert.equal(stream.length,9);assert.equal(liquid.position.y,waterline.position.y);
 for(const t of [-1,0,1,8,20]){view.update(t,.5);scene.updateMatrixWorld(true);const brainBox=new THREE.Box3().setFromObject(scene.getObjectByName('vat-brain'));for(const bubble of stream){const radius=bubble.scale.x;assert.ok(bubble.position.y-radius>=.44);assert.ok(bubble.position.y+radius<brainBox.min.y);assert.ok(Math.hypot(bubble.position.x,bubble.position.z)+radius<.27)}}
 view.dispose();
});

test('brain fits in the liquid and electrodes meet its upper surface',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),lobes=[],electrodes=[];scene.traverse(o=>{if(o.name==='vat-brain-lobe')lobes.push(o);if(o.name==='vat-electrode')electrodes.push(o)});assert.equal(lobes.length,2);assert.equal(electrodes.length,4);scene.updateMatrixWorld(true);const brainBox=new THREE.Box3().setFromObject(scene.getObjectByName('vat-brain'));assert.ok(brainBox.max.y<2.4&&brainBox.min.y>.5);assert.ok(Math.hypot(Math.max(Math.abs(brainBox.min.x),Math.abs(brainBox.max.x)),Math.max(Math.abs(brainBox.min.z),Math.abs(brainBox.max.z)))<1.6);
 for(const electrode of electrodes){const center=electrode.getWorldPosition(new THREE.Vector3()),ray=new THREE.Raycaster(new THREE.Vector3(center.x,3,center.z),new THREE.Vector3(0,-1,0)),hits=ray.intersectObjects(lobes);assert.ok(hits.length);assert.ok(Math.abs(center.y-.03-hits[0].point.y)<.025,'electrode bottom should meet a lobe surface')}view.dispose();
});

test('rear brain lobe stays inside the vessel and clear of animated bubbles',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),rear=scene.getObjectByName('vat-brain-rear-lobe'),bubbles=[];scene.traverse(o=>{if(o.name==='vat-bubble'||o.name==='vat-diffuser-bubble')bubbles.push(o)});assert.ok(rear);assert.equal(bubbles.length,27);
 for(let i=0;i<80;i++){view.update(i/10,.5);scene.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(rear,true);assert.ok(Math.hypot(Math.max(Math.abs(b.min.x),Math.abs(b.max.x)),Math.max(Math.abs(b.min.z),Math.abs(b.max.z)))<1.6);for(const bubble of bubbles){const center=bubble.getWorldPosition(new THREE.Vector3()),radius=bubble.scale.x;assert.ok(!b.intersectsSphere(new THREE.Sphere(center,radius)))}}view.dispose();
});

test('floor detailing clears the pedestal and the console legs meet the floor',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),floor=scene.getObjectByName('vat-floor'),rug=scene.getObjectByName('vat-rug'),pedestal=scene.getObjectByName('vat-pedestal'),joints=scene.getObjectByName('vat-floor-joints'),legs=[];scene.traverse(o=>{if(o.name==='vat-console-leg')legs.push(o)});scene.updateMatrixWorld(true);
 assert.ok(rug.geometry.parameters.innerRadius>pedestal.geometry.parameters.radiusTop);const floorTop=new THREE.Box3().setFromObject(floor).max.y;assert.ok(rug.position.y>floorTop&&rug.position.y-floorTop<.005);assert.ok(joints.isLineSegments);assert.equal(legs.length,4);for(const leg of legs)assert.ok(Math.abs(new THREE.Box3().setFromObject(leg).min.y-rug.position.y)<1e-6);view.dispose();
});

test('bookcase is grounded, clear of the tank and supports its books and instrument',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),shelf=scene.getObjectByName('vat-bookcase'),armillary=scene.getObjectByName('vat-armillary'),books=[];shelf.traverse(o=>{if(o.name==='vat-shelf-book')books.push(o)});scene.updateMatrixWorld(true);assert.equal(books.length,21);assert.ok(!new THREE.Box3().setFromObject(shelf).intersectsBox(new THREE.Box3().setFromObject(scene.getObjectByName('vat-glass'))));
 const floorTop=new THREE.Box3().setFromObject(scene.getObjectByName('vat-floor')).max.y;assert.ok(Math.abs(new THREE.Box3().setFromObject(shelf).min.y-floorTop)<1e-6);for(let i=0;i<books.length;i++){const row=Math.floor(i/7);assert.ok(Math.abs(books[i].position.y-.255-(.19+row*.71))<1e-6)}assert.ok(Math.abs(armillary.position.y-2.25)<1e-6);view.dispose();
});

test('console cabinet rests on the floor between the legs',()=>{
 const scene=new THREE.Scene(),view=builders.vat(scene),cabinet=scene.getObjectByName('vat-console-cabinet'),legs=[];scene.traverse(o=>{if(o.name==='vat-console-leg')legs.push(o)});scene.updateMatrixWorld(true);
 const cabinetBox=new THREE.Box3().setFromObject(cabinet),rug=scene.getObjectByName('vat-rug');assert.ok(Math.abs(cabinetBox.min.y-rug.position.y)<1e-6);for(const leg of legs)assert.ok(!cabinetBox.intersectsBox(new THREE.Box3().setFromObject(leg)));view.dispose();
});
