import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('foreground volume is grounded and clear of the study and armillary',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),volume=scene.getObjectByName('monkey-floor-volume');scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(volume,true);
 assert.ok(Math.abs(bounds.min.y-.055)<1e-6);for(const name of ['monkey-study','monkey-armillary'])assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(scene.getObjectByName(name),true)));view.dispose();
});

function localBounds(object,root){const bounds=new THREE.Box3(),inverse=root.matrixWorld.clone().invert();object.traverse(o=>{if(!o.geometry)return;o.geometry.computeBoundingBox();if(o.geometry.boundingBox)bounds.union(o.geometry.boundingBox.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld)))});return bounds}

test('hourglass rests on a grounded stack without blocking typing',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),root=scene.children[0],hourglass=scene.getObjectByName('monkey-hourglass'),books=[],hands=[];scene.traverse(o=>{if(o.name==='monkey-hourglass-book')books.push(o);if(o.name==='monkey-hand')hands.push(o)});assert.equal(books.length,3);books.sort((a,b)=>a.position.y-b.position.y);scene.updateMatrixWorld(true);assert.ok(Math.abs(books[0].position.y-.055-.05)<1e-6);for(let i=1;i<books.length;i++)assert.ok(Math.abs((books[i].position.y-.055)-(books[i-1].position.y+.055))<1e-6);assert.ok(Math.abs(localBounds(hourglass,root).min.y-(books[2].position.y+.055))<1e-6);
 for(let i=0;i<24;i++){view.update(i/5,.5);scene.updateMatrixWorld(true);for(const hand of hands)assert.ok(!localBounds(hourglass,root).intersectsBox(localBounds(hand,root)))}view.dispose();
});

test('typewriter handles negative initial timestamps and the active hand follows the depressed key',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),keys=[],hands=[],lines=[];scene.traverse(o=>{if(o.name==='monkey-key')keys.push(o);if(o.name==='monkey-hand')hands.push(o);if(o.name==='monkey-sequence-line')lines.push(o)});
 assert.equal(keys.length,24);assert.equal(hands.length,2);for(const t of [-.01,0,.4,1.2,2.8]){view.update(t,.5);scene.updateMatrixWorld(true);const pressed=keys.filter(k=>k.position.y<1.2);assert.equal(pressed.length,1);const key=pressed[0],hand=hands.find(h=>Math.sign(h.position.x)===Math.sign(key.position.x));assert.ok(hand);assert.ok(Math.abs(hand.position.x-key.position.x)<1e-9);assert.ok(Math.abs(hand.position.z-key.position.z)<1e-9);assert.ok(Math.abs(new THREE.Box3().setFromObject(hand).min.y-new THREE.Box3().setFromObject(key).max.y)<1e-6)}
 view.update(0,0);const before=lines.map(o=>o.scale.x);view.update(0,1);assert.ok(lines.some((o,i)=>o.scale.x>before[i]));view.dispose();assert.equal(scene.children.length,0);
});

test('scattered output pages reflect sequence progress in both directions',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),marks=[];scene.traverse(o=>{if(o.name==='monkey-loose-sequence')marks.push(o)});
 assert.equal(marks.length,12);for(const [value,count] of [[0,0],[.5,6],[1,12],[0,0]]){view.update(0,value);assert.equal(marks.filter(mark=>mark.visible).length,count)}view.dispose();
});

test('typewriter sheet leans back from the platen and its ink follows the sheet',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),page=scene.getObjectByName('monkey-typewriter-page'),positions=page.geometry.getAttribute('position'),first=0,last=positions.count-1;
 assert.ok(positions.getZ(last)<positions.getZ(first)-.7);
 const zAt=y=>{for(let i=0;i<positions.count-2;i+=2){const a=positions.getY(i),b=positions.getY(i+2);if(a<=y&&y<=b)return THREE.MathUtils.lerp(positions.getZ(i),positions.getZ(i+2),(y-a)/(b-a))}throw Error('height outside sheet')};
 assert.ok(Math.abs(zAt(1.47)+.45)<.002);
 const lines=[];scene.traverse(o=>{if(o.name==='monkey-sequence-line')lines.push(o)});assert.equal(lines.length,5);for(const line of lines)assert.ok(Math.abs(line.position.z-zAt(line.position.y)-.012)<.002);
 view.dispose();
});

test('study ornaments stay separate from the typewriter and seated monkey',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),monkey=scene.getObjectByName('monkey-figure'),machine=scene.getObjectByName('monkey-typewriter'),hourglass=scene.getObjectByName('monkey-hourglass');
 scene.updateMatrixWorld(true);const hourglassBox=new THREE.Box3().setFromObject(hourglass);
 assert.equal(hourglassBox.intersectsBox(new THREE.Box3().setFromObject(monkey)),false);
 assert.equal(hourglassBox.intersectsBox(new THREE.Box3().setFromObject(machine)),false);
 const pages=[];scene.traverse(o=>{if(o.name==='monkey-loose-page')pages.push(o)});assert.equal(pages.length,3);
 for(const page of pages){const bounds=localBounds(page,scene.children[0]);assert.equal(bounds.intersectsBox(localBounds(monkey,scene.children[0])),false);assert.equal(bounds.intersectsBox(localBounds(machine,scene.children[0])),false);assert.equal(bounds.intersectsBox(localBounds(scene.getObjectByName('monkey-carpet'),scene.children[0])),false)}
 for(const name of ['monkey-armillary','monkey-crumpled-page']){const bounds=new THREE.Box3().setFromObject(scene.getObjectByName(name));assert.equal(bounds.intersectsBox(new THREE.Box3().setFromObject(monkey)),false);assert.equal(bounds.intersectsBox(new THREE.Box3().setFromObject(machine)),false)}
 view.dispose();assert.equal(scene.children.length,0);
});

test('monkey chair, feet and table stand on the carpet',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),parts=[];scene.traverse(o=>{if(['monkey-table-leg','monkey-chair-leg','monkey-foot'].includes(o.name))parts.push(o)});scene.updateMatrixWorld(true);
 const top=new THREE.Box3().setFromObject(scene.getObjectByName('monkey-carpet'),true).max.y;assert.equal(parts.length,10);
 for(const part of parts)assert.ok(Math.abs(new THREE.Box3().setFromObject(part,true).min.y-top)<1e-6,'feet and furniture meet the carpet');
 view.dispose();
});

test('typewriter carriage lever stays clear of typing hands',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),root=scene.children[0],lever=scene.getObjectByName('monkey-carriage-lever'),hands=[];scene.traverse(o=>{if(o.name==='monkey-hand')hands.push(o)});assert.ok(lever);assert.equal(hands.length,2);
 for(let i=0;i<24;i++){view.update(i/5,.5);scene.updateMatrixWorld(true);const leverBounds=localBounds(lever,root);for(const hand of hands)assert.ok(!leverBounds.intersectsBox(localBounds(hand,root)))}
 view.dispose();
});

test('table page stays clear of the hands throughout the typing cycle',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),root=scene.children[0],page=scene.getObjectByName('monkey-table-page'),hands=[];scene.traverse(o=>{if(o.name==='monkey-hand')hands.push(o)});assert.ok(page);assert.equal(hands.length,2);
 for(let i=0;i<24;i++){view.update(i/5,.5);scene.updateMatrixWorld(true);const bounds=localBounds(page,root);for(const hand of hands)assert.ok(!bounds.intersectsBox(localBounds(hand,root)))}view.dispose();
});

test('inkwell and feather stay clear of the machine and typing hands',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),root=scene.children[0],inkwell=scene.getObjectByName('monkey-inkwell'),machine=scene.getObjectByName('monkey-typewriter'),hands=[];scene.traverse(o=>{if(o.name==='monkey-hand')hands.push(o)});assert.ok(inkwell&&machine);assert.equal(hands.length,2);
 for(let i=0;i<24;i++){view.update(i/5,.5);scene.updateMatrixWorld(true);const bounds=localBounds(inkwell,root);assert.ok(!bounds.intersectsBox(localBounds(machine,root)));for(const hand of hands)assert.ok(!bounds.intersectsBox(localBounds(hand,root)))}
 view.dispose();
});

test('articulated arms stay connected as the hands type',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),upper=[],forearms=[],elbows=[],hands=[];
 scene.traverse(o=>{if(o.name==='monkey-upper-arm')upper.push(o);if(o.name==='monkey-forearm')forearms.push(o);if(o.name==='monkey-elbow')elbows.push(o);if(o.name==='monkey-hand')hands.push(o)});
 assert.equal(upper.length,2);assert.equal(forearms.length,2);assert.equal(elbows.length,2);assert.equal(hands.length,2);
 for(const t of [0,.4,1.2,2.8]){view.update(t,.5);scene.updateMatrixWorld(true);for(let i=0;i<2;i++){const joint=elbows[i].getWorldPosition(new THREE.Vector3()),tip=hands[i].getWorldPosition(new THREE.Vector3());assert.ok(upper[i].localToWorld(new THREE.Vector3(0,.5,0)).distanceTo(joint)<1e-6);assert.ok(forearms[i].localToWorld(new THREE.Vector3(0,-.5,0)).distanceTo(joint)<1e-6);assert.ok(forearms[i].localToWorld(new THREE.Vector3(0,.5,0)).distanceTo(tip)<1e-6);assert.equal(hands[i].children.filter(o=>o.name==='monkey-finger').length,4)}}
 view.dispose();
});

test('arm fur stays attached to all four articulated segments',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),locks=[];scene.traverse(o=>{if(o.name==='monkey-arm-fur')locks.push(o)});assert.equal(locks.length,4);assert.ok(locks.every(o=>o.parent.name==='monkey-upper-arm'||o.parent.name==='monkey-forearm'));view.update(0,.5);scene.updateMatrixWorld(true);const before=locks[0].getWorldPosition(new THREE.Vector3());view.update(1,.5);scene.updateMatrixWorld(true);assert.ok(before.distanceTo(locks[0].getWorldPosition(new THREE.Vector3()))>.001);view.dispose();
});

test('typebar fan stays behind typing hands through the animation',()=>{
 const scene=new THREE.Scene(),view=builders.monkey(scene),root=scene.children[0],assembly=scene.getObjectByName('monkey-typebar-assembly'),bars=[],hands=[];assembly.traverse(o=>{if(o.name==='monkey-typebar')bars.push(o)});scene.traverse(o=>{if(o.name==='monkey-hand')hands.push(o)});assert.equal(bars.length,15);assert.equal(hands.length,2);
 for(let i=0;i<24;i++){view.update(i/5,.5);scene.updateMatrixWorld(true);const bounds=localBounds(assembly,root);for(const hand of hands)assert.ok(!bounds.intersectsBox(localBounds(hand,root)))}view.dispose();
});
