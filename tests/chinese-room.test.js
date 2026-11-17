import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

// Axis-aligned bounds in the room's own frame remain meaningful when the whole diorama rotates.
function roomBounds(object,room){const result=new THREE.Box3(),inverse=room.matrixWorld.clone().invert();object.traverse(o=>{if(!o.geometry)return;o.geometry.computeBoundingBox();if(o.geometry.boundingBox)result.union(o.geometry.boundingBox.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld)))});return result}

test('external tray braces meet the trays and clear passing cards',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],braces=[],trays=[];scene.traverse(o=>{if(o.name==='chinese-room-tray-brace')braces.push(o);if(o.name==='chinese-room-tray')trays.push(o)});assert.equal(braces.length,4);
 for(const brace of braces){const length=brace.geometry.parameters.height,end=new THREE.Vector3(0,length/2,0).applyQuaternion(brace.quaternion).add(brace.position),tray=trays.find(t=>Math.sign(t.position.x)===Math.sign(end.x));assert.ok(Math.abs(end.y-(tray.position.y-.04))<1e-6);assert.ok(Math.abs(end.x-tray.position.x)<1.05);assert.ok(Math.abs(end.z)<.425)}
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);for(const name of ['chinese-room-input','chinese-room-output']){const card=scene.getObjectByName(name);if(card.visible)for(const brace of braces)assert.ok(!roomBounds(card,room).intersectsBox(roomBounds(brace,room)))}}view.dispose();
});

test('cards pass through the openings supported by trays and in sequence',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],walls=[],trays=[],trim=[],arches=[];
 scene.traverse(o=>{if(o.name==='chinese-room-slot-wall')walls.push(o);if(o.name==='chinese-room-tray')trays.push(o);if(o.name==='chinese-room-slot-trim')trim.push(o);if(o.name==='chinese-room-slot-arch')arches.push(o)});assert.equal(arches.length,2);
 const input=scene.getObjectByName('chinese-room-input'),output=scene.getObjectByName('chinese-room-output');assert.equal(walls.length,8);assert.equal(trays.length,2);
 for(let i=0;i<=20;i++){
  const value=i/20;view.update(0,value);scene.updateMatrixWorld(true);assert.equal(output.visible,value>.5);
  for(const card of [input,...(output.visible?[output]:[])]){
   const cardBox=roomBounds(card,room);
   for(const wall of walls)assert.ok(!cardBox.intersectsBox(roomBounds(wall,room)),'card must clear the wall opening');
   for(const piece of trim)assert.ok(!cardBox.intersectsBox(roomBounds(piece,room)),'card must clear the opening trim');
   for(const arch of arches)assert.ok(!cardBox.intersectsBox(roomBounds(arch,room)),'card must clear the stone arch');
   const tray=trays.find(t=>Math.sign(t.position.x)===Math.sign(card.position.x)),trayBox=roomBounds(tray,room);
   assert.ok(cardBox.min.x>=trayBox.min.x&&cardBox.max.x<=trayBox.max.x,'tray supports the card through its movement');
  }
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('projecting stone portals clear both moving cards throughout the slider range',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],masonry=[],edges=[],crowns=[];scene.traverse(o=>{if(o.name==='chinese-room-portal-masonry')masonry.push(o);if(o.name==='chinese-room-portal-edge')edges.push(o);if(o.name==='chinese-room-portal-crown')crowns.push(o)});assert.equal(masonry.length,8);assert.equal(edges.length,6);assert.equal(crowns.length,2);
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);for(const name of ['chinese-room-input','chinese-room-output']){const card=scene.getObjectByName(name);if(card.visible){const bounds=roomBounds(card,room);for(const part of [...masonry,...edges,...crowns])assert.ok(!bounds.intersectsBox(roomBounds(part,room)),`${name} clears ${part.name}`)}}}view.dispose();
});

test('operator faces the rulebook and slot frames preserve open passages',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),operator=scene.getObjectByName('chinese-room-operator'),trim=[];
 scene.traverse(o=>{if(o.name==='chinese-room-slot-trim')trim.push(o)});assert.ok(operator);assert.equal(trim.length,12);
 const forward=new THREE.Vector3(0,0,1).applyQuaternion(operator.quaternion);assert.ok(forward.z>.999);assert.ok(operator.position.z<scene.getObjectByName('chinese-room-desk').position.z);
 view.dispose();assert.equal(scene.children.length,0);
});

test('operator chair and shoes meet the actual room floor',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),legs=[],shoes=[];scene.traverse(o=>{if(o.name==='chinese-room-chair-leg')legs.push(o);if(o.name==='chinese-room-shoe')shoes.push(o)});scene.updateMatrixWorld(true);
 const floor=new THREE.Box3().setFromObject(scene.getObjectByName('chinese-room-floor'),true);assert.equal(legs.length,4);assert.equal(shoes.length,2);
 for(const object of [...legs,...shoes]){const bounds=new THREE.Box3().setFromObject(object,true);assert.ok(Math.abs(bounds.min.y-floor.max.y)<1e-6,'chair and feet meet the floor')}
 view.dispose();
});

test('back window is an opening bounded by masonry and framed arches',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],walls=[],arches=[];scene.traverse(o=>{if(o.name==='chinese-room-back-wall')walls.push(o);if(o.name==='chinese-room-window-arch')arches.push(o)});scene.updateMatrixWorld(true);
 assert.equal(walls.length,4);assert.equal(arches.length,2);const opening=new THREE.Box3(new THREE.Vector3(.4,1.12,-1.78),new THREE.Vector3(2.1,2.3,-1.62));for(const wall of walls)assert.ok(!roomBounds(wall,room).intersectsBox(opening));
 view.dispose();
});

test('window spandrel leaves both arched apertures open',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),spandrel=scene.getObjectByName('chinese-room-window-spandrel');scene.updateMatrixWorld(true);
 const intersects=(x,y)=>{const origin=new THREE.Vector3(x,y,1).applyMatrix4(spandrel.matrixWorld),direction=new THREE.Vector3(0,0,-1).transformDirection(spandrel.matrixWorld);return new THREE.Raycaster(origin,direction).intersectObject(spandrel).length>0};
 for(const x of [-.35,.35]){assert.equal(intersects(x,.15),false,'arch interior is open');assert.equal(intersects(x,.45),true,'masonry fills above arch')}
 view.dispose();
});

test('window landscape is behind the back wall and clear of the moving cards',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],scenery=scene.getObjectByName('chinese-room-window-view');assert.ok(scenery);scene.updateMatrixWorld(true);const bounds=roomBounds(scenery,room);assert.ok(bounds.max.z< -1.775);assert.ok(bounds.min.x>=.4-1e-6&&bounds.max.x<=2.1+1e-6);
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);for(const name of ['chinese-room-input','chinese-room-output']){const card=scene.getObjectByName(name);if(card.visible)assert.ok(!bounds.intersectsBox(roomBounds(card,room)))}}view.dispose();
});

test('wall crowns are above the window and clear of traveling cards',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],crowns=[];scene.traverse(o=>{if(o.name==='chinese-room-wall-crown')crowns.push(o)});assert.equal(crowns.length,2);scene.updateMatrixWorld(true);const bounds=crowns.map(c=>roomBounds(c,room)),window=roomBounds(scene.getObjectByName('chinese-room-window'),room);for(const b of bounds)assert.ok(b.min.y>window.max.y);
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);for(const name of ['chinese-room-input','chinese-room-output']){const card=scene.getObjectByName(name);if(card.visible)for(const b of bounds)assert.ok(!b.intersectsBox(roomBounds(card,room)))}}view.dispose();
});

test('desk supports the runner and rule cards without blocking the trays',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],legs=[],cards=[],trays=[];
 scene.traverse(o=>{if(o.name==='chinese-room-desk-leg')legs.push(o);if(o.name==='chinese-room-rule-card')cards.push(o);if(o.name==='chinese-room-tray')trays.push(o)});scene.updateMatrixWorld(true);
 const desk=roomBounds(scene.getObjectByName('chinese-room-desk'),room),floor=roomBounds(scene.getObjectByName('chinese-room-floor'),room),runner=roomBounds(scene.getObjectByName('chinese-room-runner'),room);
 assert.equal(legs.length,4);assert.equal(cards.length,3);for(const leg of legs)assert.ok(Math.abs(roomBounds(leg,room).min.y-floor.max.y)<1e-6);
 assert.ok(Math.abs(runner.min.y-desk.max.y)<1e-6);for(const card of cards){const b=roomBounds(card,room);assert.ok(Math.abs(b.min.y-runner.max.y)<.001);assert.ok(b.min.x>desk.min.x&&b.max.x<desk.max.x&&b.min.z>desk.min.z&&b.max.z<desk.max.z)}
 for(const tray of trays)assert.ok(!desk.intersectsBox(roomBounds(tray,room)));
 view.dispose();
});

test('operator hands meet forearms and the raised card',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),operator=scene.getObjectByName('chinese-room-operator'),hands=[],forearms=[];
 operator.traverse(o=>{if(o.name==='chinese-room-hand')hands.push(o);if(o.name==='chinese-room-forearm')forearms.push(o)});assert.equal(hands.length,2);assert.equal(forearms.length,2);
 for(let i=0;i<2;i++){const arm=forearms[i],end=new THREE.Vector3(0,arm.geometry.parameters.height/2,0).applyQuaternion(arm.quaternion).add(arm.position);assert.ok(end.distanceTo(hands[i].position)<1e-6)}
 const held=scene.getObjectByName('chinese-room-held-card');assert.ok(hands[1].position.distanceTo(new THREE.Vector3(held.position.x,held.position.y-.15,held.position.z))<.07);
 view.dispose();
});

test('banner and desk framing do not obstruct the moving cards or chair',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],banner=scene.getObjectByName('chinese-room-banner'),operator=scene.getObjectByName('chinese-room-operator'),aprons=[],feet=[];scene.traverse(o=>{if(o.name==='chinese-room-desk-apron')aprons.push(o);if(o.name==='chinese-room-desk-foot')feet.push(o)});assert.ok(banner);assert.equal(aprons.length,2);assert.equal(feet.length,4);
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);for(const name of ['chinese-room-input','chinese-room-output']){const card=scene.getObjectByName(name);if(card.visible)assert.ok(!roomBounds(card,room).intersectsBox(roomBounds(banner,room)))}}
 const chairParts=[];operator.traverse(o=>{if(o.name==='chinese-room-chair-leg'||o.name==='chinese-room-shoe')chairParts.push(o)});for(const piece of [...aprons,...feet])for(const chairPart of chairParts)assert.ok(!roomBounds(piece,room).intersectsBox(roomBounds(chairPart,room)));view.dispose();
});

test('open rulebook rests on the desk and clears both moving cards',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],book=scene.getObjectByName('chinese-room-rulebook'),pages=[];book.traverse(o=>{if(o.name==='chinese-room-book-page')pages.push(o)});assert.equal(pages.length,2);assert.ok(book.getObjectByName('chinese-room-book-gutter'));scene.updateMatrixWorld(true);const b=roomBounds(book,room),desk=roomBounds(scene.getObjectByName('chinese-room-desk'),room);assert.ok(Math.abs(b.min.y-desk.max.y)<1e-6);
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);for(const name of ['chinese-room-input','chinese-room-output']){const card=scene.getObjectByName(name);if(card.visible)assert.ok(!b.intersectsBox(roomBounds(card,room)))}}view.dispose();
});

test('room and traveling cards fit on the smaller circular stage',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],stage=room.children[0],radius=stage.geometry.parameters.radiusTop,trays=[];scene.traverse(o=>{if(o.name==='chinese-room-tray')trays.push(o)});
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);for(const object of [scene.getObjectByName('chinese-room-floor'),...trays,scene.getObjectByName('chinese-room-input'),scene.getObjectByName('chinese-room-output')]){if(!object.visible)continue;const b=roomBounds(object,room);for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(Math.hypot(x,z)<radius)}}view.dispose();
});

test('library crown connects the stiles and clears the traveling cards',()=>{
 const scene=new THREE.Scene(),view=builders['chinese-room'](scene),room=scene.children[0],shelf=scene.getObjectByName('chinese-room-library'),crown=scene.getObjectByName('chinese-room-library-crown'),stiles=[];shelf.traverse(o=>{if(o.name==='chinese-room-library-stile')stiles.push(o)});assert.equal(stiles.length,2);assert.equal(crown.parent,shelf);scene.updateMatrixWorld(true);
 const b=roomBounds(crown,room),left=roomBounds(stiles[0],room),right=roomBounds(stiles[1],room);assert.ok(b.min.x<=left.max.x&&b.max.x>=right.min.x);assert.ok(Math.abs(b.min.y-left.max.y)<.06);
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);for(const name of ['chinese-room-input','chinese-room-output']){const card=scene.getObjectByName(name);if(card.visible)assert.ok(!b.intersectsBox(roomBounds(card,room)))}}view.dispose();
});
