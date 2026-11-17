import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('raised stern platform rests on the deck and follows the rocking hull',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),hull=scene.getObjectByName('ship-hull'),stern=scene.getObjectByName('ship-stern-platform'),support=scene.getObjectByName('ship-stern-support'),crate=scene.getObjectByName('ship-crate'),planks=[],posts=[],rails=[];
 stern.traverse(o=>{if(o.name==='ship-stern-plank')planks.push(o);if(o.name==='ship-stern-rail-post')posts.push(o);if(o.name==='ship-stern-rail')rails.push(o)});assert.equal(stern.parent,hull);assert.equal(planks.length,6);assert.equal(posts.length,6);assert.equal(rails.length,3);
 view.update(0,0);scene.updateMatrixWorld(true);const deck=new THREE.Box3().setFromObject(scene.getObjectByName('ship-deck-plank')),base=new THREE.Box3().setFromObject(support),crateBox=new THREE.Box3().setFromObject(crate,true);assert.ok(Math.abs(base.min.y-deck.max.y)<1e-6);assert.ok(!new THREE.Box3().setFromObject(stern,true).intersectsBox(crateBox));
 const point=new THREE.Vector3(.2,.2,.3).applyMatrix4(stern.matrixWorld);view.update(2,1);scene.updateMatrixWorld(true);assert.ok(point.distanceTo(new THREE.Vector3(.2,.2,.3).applyMatrix4(stern.matrixWorld))>.001);view.dispose();
});

test('ship hull replacement progresses and reverses with the slider',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),panels=[],pegs=[];
 scene.traverse(object=>{if(object.name==='ship-side-planks')panels.push(object);if(object.name==='ship-plank-peg')pegs.push(object)});
 assert.equal(panels.length,60);assert.equal(pegs.length,120);assert.ok(pegs.every(peg=>panels.includes(peg.parent)));
 for(const [value,expected] of [[0,0],[.5,30],[1,60],[0,0]]){
  view.update(0,value);
  assert.equal(panels.filter(panel=>panel.material.color.getHex()===0xc49a72).length,expected);
 }
 for(let n=0;n<=panels.length;n++){view.update(0,n/panels.length);assert.equal(panels.filter(panel=>panel.material.color.getHex()===0xc49a72).length,n,'each side board can be replaced independently')}
 const sail=scene.getObjectByName('ship-sail');assert.ok(sail);assert.equal(scene.getObjectByName('ship-gunwale').parent,scene.getObjectByName('ship-hull'));
 const position=sail.geometry.getAttribute('position');let min=Infinity,max=-Infinity;
 for(let i=0;i<position.count;i++){min=Math.min(min,position.getZ(i));max=Math.max(max,position.getZ(i))}
 assert.ok(max-min>.2,'sail has an actual curved surface');
 view.dispose();assert.equal(scene.children.length,0);
});

test('rigging and end timbers move with the ship while the water stays fixed',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),hull=scene.getObjectByName('ship-hull'),sail=scene.getObjectByName('ship-sail'),seams=[],timbers=[],ripples=[];
 scene.traverse(o=>{if(o.name==='ship-sail-seam')seams.push(o);if(o.name==='ship-end-timber')timbers.push(o);if(o.name==='ship-ripple')ripples.push(o)});
 assert.equal(seams.length,7);assert.equal(timbers.length,2);assert.equal(ripples.length,10);assert.ok(seams.every(s=>s.parent===sail));assert.ok(timbers.every(t=>t.parent===hull));assert.ok(ripples.every(r=>r.parent!==hull));
 view.update(0,.5);scene.updateMatrixWorld(true);const before=timbers[0].getWorldPosition(new THREE.Vector3()),waterBefore=ripples[0].getWorldPosition(new THREE.Vector3());
 view.update(2,.5);scene.updateMatrixWorld(true);const after=timbers[0].getWorldPosition(new THREE.Vector3()),waterAfter=ripples[0].getWorldPosition(new THREE.Vector3());
 // The timber mesh origin is at the hull origin, so compare an actual geometry point.
 const local=new THREE.Vector3().fromBufferAttribute(timbers[0].geometry.getAttribute('position'),0),worldAfter=local.clone().applyMatrix4(timbers[0].matrixWorld);
 view.update(0,.5);scene.updateMatrixWorld(true);const worldBefore=local.clone().applyMatrix4(timbers[0].matrixWorld);
 assert.ok(worldBefore.distanceTo(worldAfter)>.001);assert.ok(before.distanceTo(after)<1e-9);assert.ok(waterBefore.distanceTo(waterAfter)<1e-9);
 view.dispose();assert.equal(scene.children.length,0);
});

test('staggered ship plank joints remain attached to replacement panels',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),joints=[],panels=[];
 scene.traverse(o=>{if(o.name==='ship-plank-joint')joints.push(o);if(o.name==='ship-side-planks')panels.push(o)});
 assert.equal(joints.length,60);assert.ok(joints.every(j=>panels.includes(j.parent)));
 view.update(0,0);scene.updateMatrixWorld(true);const before=joints[0].getWorldPosition(new THREE.Vector3());
 view.update(2,1);scene.updateMatrixWorld(true);const after=joints[0].getWorldPosition(new THREE.Vector3());
 assert.ok(before.distanceTo(after)>.001,'joints follow the ship rocking');
 assert.ok(panels.every(p=>p.material.color.getHex()===0xc49a72),'replacement remains visible');
 view.dispose();
});

test('ship side courses taper with the supporting hull',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),panels=[];scene.traverse(o=>{if(o.name==='ship-side-planks')panels.push(o)});
 assert.ok(scene.getObjectByName('ship-hull-core'));assert.equal(panels.length,60);
 for(const panel of panels){const p=panel.geometry.getAttribute('position');for(let i=0;i<p.count;i+=6){const bottom=Math.hypot(p.getX(i),p.getZ(i)),top=Math.hypot(p.getX(i+5),p.getZ(i+5));assert.ok(top>bottom,'each board widens toward the gunwale')}}
 view.dispose();
});

test('ship hull bottom meets the still water at rest',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene);view.update(0,0);scene.updateMatrixWorld(true);
 const bottom=new THREE.Box3().setFromObject(scene.getObjectByName('ship-hull-core'),true).min.y;
 assert.ok(Math.abs(bottom-.04)<1e-5,'hull bottom meets the top of the water disk');view.dispose();
});

test('sculpted sea remains level under the hull while rising and falling farther out',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),surface=scene.getObjectByName('ship-sea-surface'),p=surface.geometry.getAttribute('position');let min=Infinity,max=-Infinity,inside=0;
 for(let i=0;i<p.count;i++){const d=Math.hypot(p.getX(i)/3.4,p.getZ(i)/2.15),y=p.getY(i);if(d<1){inside++;assert.ok(Math.abs(y-.04)<1e-6)}if(d>1.3){min=Math.min(min,y);max=Math.max(max,y)}}
 assert.ok(inside>100&&max-min>.04);surface.geometry.computeBoundingBox();scene.updateMatrixWorld(true);const baseTop=new THREE.Box3().setFromObject(scene.getObjectByName('ship-water-base')).max.y;assert.ok(surface.geometry.boundingBox.min.y>baseTop+.005);assert.equal(surface.castShadow,false,'sea should not self-shadow');view.dispose();
});

test('outer wave foam stays within the water and away from the hull footprint',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),foam=scene.getObjectByName('ship-wave-foam'),sea=scene.getObjectByName('ship-sea-surface'),p=foam.geometry.getAttribute('position');assert.ok(p.count>100);assert.equal(foam.castShadow,false);
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);assert.ok(Math.hypot(x,z)<4.6);assert.ok(Math.hypot(x/3.4,z/2.15)>1.3)}
 const water=sea.geometry.getAttribute('position');for(let i=0;i<water.count;i++)assert.ok(water.getY(i)>-.05,'waves must remain above the stage top');
 view.dispose();
});

test('wave crests follow the rendered sea and its perimeter meets the base',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),sea=scene.getObjectByName('ship-sea-surface'),foam=scene.getObjectByName('ship-wave-foam'),edge=scene.getObjectByName('ship-sea-edge'),ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);scene.updateMatrixWorld(true);
 const p=foam.geometry.getAttribute('position');for(let i=0;i<p.count;i+=3){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);ray.set(new THREE.Vector3(x,2,z),down);const hit=ray.intersectObject(sea)[0];assert.ok(hit);assert.ok(Math.abs(y-hit.point.y)<.04,`foam gap ${y-hit.point.y}`)}
 const e=edge.geometry.getAttribute('position'),water=sea.geometry.getAttribute('position'),outerStart=water.count-e.count/2;for(let i=0;i<e.count;i+=2){assert.ok(Math.abs(e.getY(i+1)+.06)<1e-6);assert.ok(Math.abs(e.getY(i)-water.getY(outerStart+i/2))<1e-6)}
 view.dispose();
});

test('rocky shore stays outside the ship corridor and within the stage',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),rocks=[];scene.traverse(o=>{if(o.name==='ship-shore-rock')rocks.push(o)});assert.equal(rocks.length,6);
 for(const rock of rocks){const r=Math.max(rock.scale.x,rock.scale.y,rock.scale.z),{x,z}=rock.position;assert.ok(Math.hypot(x/3.4,z/2.15)-r/2.15>1.04,'rock clears the conservative hull footprint');assert.ok(Math.hypot(x,z)+r<4.7,'rock fits on the water stage')}
 const geometry=rocks[0].geometry;let disposed=0;geometry.addEventListener('dispose',()=>disposed++);view.dispose();assert.equal(disposed,1);
});

test('ship cargo and coils sit on the deck without intersecting one another',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),hull=scene.getObjectByName('ship-hull'),cargo=[scene.getObjectByName('ship-barrel'),scene.getObjectByName('ship-crate')],coils=[];scene.traverse(o=>{if(o.name==='ship-rope-coil')coils.push(o)});assert.equal(coils.length,2);view.update(0,.5);scene.updateMatrixWorld(true);
 const deck=new THREE.Box3().setFromObject(scene.getObjectByName('ship-deck-plank')).max.y,objects=[...cargo,...coils],boxes=objects.map(o=>new THREE.Box3().setFromObject(o));
 for(let i=0;i<objects.length;i++){assert.equal(objects[i].parent,hull);assert.ok(Math.abs(boxes[i].min.y-deck)<1e-5);for(let j=0;j<i;j++)assert.ok(!boxes[i].intersectsBox(boxes[j]),'cargo and rope coils should not overlap')}
 view.dispose();
});

test('deepened hull remains joined to the deck and the yard remains at the sail head',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene);view.update(0,0);scene.updateMatrixWorld(true);const core=new THREE.Box3().setFromObject(scene.getObjectByName('ship-hull-core'),true),deck=new THREE.Box3().setFromObject(scene.getObjectByName('ship-deck-plank')),sail=new THREE.Box3().setFromObject(scene.getObjectByName('ship-sail')),yard=scene.getObjectByName('ship-yard');
 assert.ok(core.max.y-core.min.y>1.19);assert.ok(deck.min.y<core.max.y&&deck.max.y>core.max.y);assert.ok(Math.abs(yard.getWorldPosition(new THREE.Vector3()).y-sail.max.y)<.08);view.dispose();
});

test('sail has a curved foot and its lashings follow the yard',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),sail=scene.getObjectByName('ship-sail'),yard=scene.getObjectByName('ship-yard'),lashings=[];scene.traverse(o=>{if(o.name==='ship-sail-lashing')lashings.push(o)});const p=sail.geometry.getAttribute('position'),row=32*25;
 assert.ok(p.getY(row+12)-p.getY(row)>.25,'middle of sail foot rises above its corners');assert.ok(p.getX(row+24)-p.getX(row)<p.getX(24)-p.getX(0));assert.equal(lashings.length,7);
 for(const t of [0,2]){view.update(t,.5);scene.updateMatrixWorld(true);const axis=yard.getWorldPosition(new THREE.Vector3()),direction=new THREE.Vector3(1,0,0).transformDirection(yard.parent.matrixWorld);for(const lashing of lashings){const offset=lashing.getWorldPosition(new THREE.Vector3()).sub(axis);assert.ok(offset.clone().addScaledVector(direction,-offset.dot(direction)).length()<1e-6,'lashing stays on the yard axis')}}view.dispose();
});

test('sail sheets remain attached to sail corners and deck cleats as the hull rocks',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),sail=scene.getObjectByName('ship-sail'),hull=scene.getObjectByName('ship-hull'),sheets=[],cleats=[];scene.traverse(o=>{if(o.name==='ship-sail-sheet')sheets.push(o);if(o.name==='ship-sheet-cleat')cleats.push(o)});assert.equal(sheets.length,2);assert.equal(cleats.length,2);assert.ok(sheets.every(s=>s.parent===hull));
 for(const t of [0,1,2]){view.update(t,.5);scene.updateMatrixWorld(true);const positions=sail.geometry.getAttribute('position'),row=32*25;for(let i=0;i<2;i++){const sheet=sheets[i],half=sheet.geometry.parameters.height/2,start=sheet.localToWorld(new THREE.Vector3(0,-half,0)),end=sheet.localToWorld(new THREE.Vector3(0,half,0)),corner=sail.localToWorld(new THREE.Vector3().fromBufferAttribute(positions,row+i*24)),cleat=cleats[i].getWorldPosition(new THREE.Vector3());assert.ok(start.distanceTo(corner)<1e-5);assert.ok(end.distanceTo(cleat)<.006)}}view.dispose();
});

test('masthead stays connect mast and yard as the hull rocks',()=>{
 const scene=new THREE.Scene(),view=builders.ship(scene),hull=scene.getObjectByName('ship-hull'),mast=scene.getObjectByName('ship-mast'),yard=scene.getObjectByName('ship-yard'),stays=[];
 scene.traverse(o=>{if(o.name==='ship-masthead-stay')stays.push(o)});assert.equal(stays.length,2);assert.ok(stays.every(o=>o.parent===hull));
 for(const t of [0,1,2]){view.update(t,.5);scene.updateMatrixWorld(true);const mastTop=mast.localToWorld(new THREE.Vector3(0,mast.geometry.parameters.height/2,0)),yardCenter=yard.getWorldPosition(new THREE.Vector3()),axis=new THREE.Vector3(1,0,0).transformDirection(yard.parent.matrixWorld);assert.ok(mastTop.y-yardCenter.y>.5);
  for(const stay of stays){const half=stay.geometry.parameters.height/2,a=stay.localToWorld(new THREE.Vector3(0,-half,0)),b=stay.localToWorld(new THREE.Vector3(0,half,0));assert.ok(a.distanceTo(mastTop)<.2);const d=b.clone().sub(yardCenter);assert.ok(d.clone().addScaledVector(axis,-d.dot(axis)).length()<1e-5);assert.ok(Math.abs(d.dot(axis))<2)}
 }view.dispose();
});
