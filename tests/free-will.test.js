import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('foreground landscape remains clear of the moving traveler',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),person=scene.getObjectByName('free-will-figure'),landscape=[];
 scene.traverse(o=>{if(o.name==='free-will-foreground-boulder'||o.name==='free-will-rosette')landscape.push(o)});
 assert.ok(landscape.length>=10);
 for(let i=0;i<=40;i++){view.update(0,i/40);scene.updateMatrixWorld(true);const traveler=new THREE.Box3().setFromObject(person,true);for(const item of landscape)assert.ok(!traveler.intersectsBox(new THREE.Box3().setFromObject(item,true)))}
 view.dispose();
});

test('enlarged rear tree clears gates, evergreens and the moving figure',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),tree=scene.getObjectByName('free-will-tree'),person=scene.getObjectByName('free-will-figure'),others=[];scene.traverse(o=>{if(o.name==='free-will-arch'||o.name==='free-will-evergreen')others.push(o)});scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(tree,true);for(const object of others)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(object,true)));for(let i=0;i<=100;i++){view.update(0,i/100);scene.updateMatrixWorld(true);assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(person,true)))}view.dispose();
});

test('archside jar is grounded and clears the traveler across the fork',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),jar=scene.getObjectByName('free-will-jar'),person=scene.getObjectByName('free-will-figure');assert.ok(jar&&person);
 for(let i=0;i<=100;i++){view.update(0,i/100);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(jar,true);assert.ok(Math.abs(bounds.min.y-.055)<1e-6);assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(person,true)))}view.dispose();
});

test('border trees stay clear of the traveler along both paths',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),trees=[],person=scene.getObjectByName('free-will-figure');scene.traverse(o=>{if(o.name==='free-will-border-tree')trees.push(o)});assert.equal(trees.length,2);assert.ok(trees.every(tree=>tree.getObjectByName('free-will-border-leaves')));
 for(let i=0;i<=40;i++){view.update(0,i/40);scene.updateMatrixWorld(true);const figure=new THREE.Box3().setFromObject(person,true);for(const tree of trees)assert.ok(!figure.intersectsBox(new THREE.Box3().setFromObject(tree,true)))}view.dispose();
});

test('the figure stays centered on either visible free-will path',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),person=scene.getObjectByName('free-will-figure');
 for(const value of [0,.1,.25,.4,.5,.6,.75,.9,1]){
  view.update(0,value);const path=scene.getObjectByName(`free-will-path-${value<.5?0:1}`),positions=path.geometry.getAttribute('position');let nearest=Infinity;
  for(let i=0;i<positions.count;i+=2){const x=(positions.getX(i)+positions.getX(i+1))/2,z=(positions.getZ(i)+positions.getZ(i+1))/2;nearest=Math.min(nearest,Math.hypot(x-person.position.x,z-person.position.z));}
  assert.ok(nearest<.07,'figure is on the centerline of the selected path');assert.equal(person.position.y,.1625);
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('both branch ends enter the center of their archways',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),arches=[];scene.traverse(o=>{if(o.name==='free-will-arch')arches.push(o)});arches.sort((a,b)=>a.position.x-b.position.x);assert.equal(arches.length,2);
 for(let side=0;side<2;side++){const p=scene.getObjectByName(`free-will-path-${side}`).geometry.getAttribute('position'),center=i=>new THREE.Vector3((p.getX(i)+p.getX(i+1))/2,.15,(p.getZ(i)+p.getZ(i+1))/2),last=center(p.count-2),previous=center(p.count-4),direction=last.clone().sub(previous).normalize(),normal=new THREE.Vector3(0,0,-1).applyQuaternion(arches[side].quaternion);assert.ok(last.distanceTo(new THREE.Vector3(arches[side].position.x,.15,arches[side].position.z))<1e-5);assert.ok(direction.dot(normal)>.98,'path should enter perpendicular to the arch');assert.ok(Math.abs(p.getX(p.count-2)-last.x)<.54&&Math.abs(p.getX(p.count-1)-last.x)<.54)}view.dispose();
});

test('colored arch structures leave their central passages open',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),arches=[];scene.traverse(o=>{if(o.name==='free-will-arch')arches.push(o)});scene.updateMatrixWorld(true);
 for(const arch of arches){assert.ok(arch.getObjectByName('free-will-colored-arch'));assert.equal(arch.children.filter(o=>o.name==='free-will-colored-pier').length,2);const origin=arch.localToWorld(new THREE.Vector3(0,.8,1)),direction=new THREE.Vector3(0,0,-1).transformDirection(arch.matrixWorld);assert.equal(new THREE.Raycaster(origin,direction,0,2).intersectObject(arch,true).length,0)}view.dispose();
});

test('landscape keeps the branch centerlines clear and arches remain open',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),rocks=[],paths=[],arches=[];scene.traverse(o=>{if(o.name==='free-will-rock')rocks.push(o);if(o.name.startsWith('free-will-path-'))paths.push(o);if(o.name==='free-will-arch')arches.push(o)});
 assert.ok(rocks.length>=10);assert.equal(arches.length,2);assert.equal(paths.length,2);assert.ok(scene.getObjectByName('free-will-cloak'));
 const tree=scene.getObjectByName('free-will-tree');assert.ok(tree);for(const path of paths){const p=path.geometry.getAttribute('position');for(let i=0;i<p.count;i+=2){const x=(p.getX(i)+p.getX(i+1))/2,z=(p.getZ(i)+p.getZ(i+1))/2;assert.ok(Math.hypot(x-tree.position.x,z-tree.position.z)>1,'tree clears the path');}}
 for(const rock of rocks)for(const path of paths){const p=path.geometry.getAttribute('position');for(let i=0;i<p.count;i+=2){const x=(p.getX(i)+p.getX(i+1))/2,z=(p.getZ(i)+p.getZ(i+1))/2;assert.ok(Math.hypot(x-rock.position.x,z-rock.position.z)>.62+rock.scale.x/1.35)}}
 view.dispose();assert.equal(scene.children.length,0);
});

test('fork path surface supports the figure and evergreens clear both branches',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),evergreens=[],paths=[];scene.traverse(o=>{if(o.name==='free-will-evergreen')evergreens.push(o);if(o.name.startsWith('free-will-path-'))paths.push(o)});assert.equal(evergreens.length,2);
 const person=scene.getObjectByName('free-will-figure');for(const value of [0,.15,.3,.5,.7,.85,1]){view.update(0,value);scene.updateMatrixWorld(true);const bottom=new THREE.Box3().setFromObject(person,true).min.y;assert.ok(Math.abs(bottom-.15)<1e-5,'figure meets the path plane')}
 for(const path of paths){const p=path.geometry.getAttribute('position');for(let i=0;i<p.count;i+=2){assert.ok(Math.abs(p.getY(i)-.15)<1e-5);const x=(p.getX(i)+p.getX(i+1))/2,z=(p.getZ(i)+p.getZ(i+1))/2;for(const tree of evergreens)assert.ok(Math.hypot(x-tree.position.x,z-tree.position.z)>1)}}
 view.dispose();
});

test('approach markers rest on the path and clear the moving figure',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),approach=scene.getObjectByName('free-will-approach'),person=scene.getObjectByName('free-will-figure'),markers=[];scene.traverse(o=>{if(o.name==='free-will-medallion')markers.push(o)});scene.updateMatrixWorld(true);assert.equal(markers.length,3);const top=new THREE.Box3().setFromObject(approach).max.y;
 for(const marker of markers){assert.ok(marker.getObjectByName('free-will-engraving'));assert.ok(Math.abs(new THREE.Box3().setFromObject(marker).min.y-top)<1e-6)}for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);const figureBox=new THREE.Box3().setFromObject(person);for(const marker of markers)assert.ok(!figureBox.intersectsBox(new THREE.Box3().setFromObject(marker)))}view.dispose();
});

test('figure details remain attached while following either path',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),person=scene.getObjectByName('free-will-figure'),arm=person.getObjectByName('free-will-raised-arm'),hand=person.getObjectByName('free-will-raised-hand'),shoes=person.children.filter(o=>o.name==='free-will-shoe');assert.equal(shoes.length,2);assert.ok(person.getObjectByName('free-will-cloak').geometry.isBufferGeometry);
 for(const value of [0,.25,.5,.75,1]){view.update(0,value);scene.updateMatrixWorld(true);const tip=arm.localToWorld(new THREE.Vector3(0,.25,0));assert.ok(tip.distanceTo(hand.getWorldPosition(new THREE.Vector3()))<1e-6);for(const shoe of shoes)assert.ok(Math.abs(new THREE.Box3().setFromObject(shoe).min.y-.15)<1e-6)}view.dispose();
});

test('branch side walls meet the ground and stay outside the sampled figure centerline',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),person=scene.getObjectByName('free-will-figure'),walls=[];scene.traverse(o=>{if(o.name==='free-will-curb-wall')walls.push(o)});assert.equal(walls.length,4);
 for(const wall of walls){const p=wall.geometry.getAttribute('position');for(let i=0;i<p.count;i+=2){assert.ok(Math.abs(p.getY(i)-.055)<1e-6);assert.ok(Math.abs(p.getY(i+1)-.15)<1e-6)}}
 for(let i=0;i<=40;i++){view.update(0,i/40);for(const wall of walls){const p=wall.geometry.getAttribute('position');for(let j=0;j<p.count;j+=2)assert.ok(Math.hypot(p.getX(j)-person.position.x,p.getZ(j)-person.position.z)>.45)}}view.dispose();
});

test('meadow plantings leave the approach and both moving routes clear',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),clumps=[],arches=[];scene.traverse(o=>{if(o.name==='free-will-meadow-clump')clumps.push(o);if(o.name==='free-will-arch')arches.push(o)});
 assert.equal(clumps.length,34);for(const arch of arches){let vines=0;arch.traverse(o=>{if(o.name==='free-will-arch-vine')vines++});assert.equal(vines,2)}
 for(const clump of clumps){assert.ok(!(Math.abs(clump.position.x)<.85&&clump.position.z>-.7&&clump.position.z<4.9));for(const side of [0,1]){const p=scene.getObjectByName(`free-will-path-${side}`).geometry.getAttribute('position');for(let i=0;i<p.count;i+=2){const x=(p.getX(i)+p.getX(i+1))/2,z=(p.getZ(i)+p.getZ(i+1))/2;assert.ok(Math.hypot(x-clump.position.x,z-clump.position.z)>.82)}}}
 view.dispose();
});

test('rear hill joins the ground and stays clear of the moving figure',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),hill=scene.getObjectByName('free-will-rear-hill'),person=scene.getObjectByName('free-will-figure');assert.ok(hill);scene.updateMatrixWorld(true);const terrain=new THREE.Box3().setFromObject(hill,true);assert.ok(Math.abs(terrain.min.y-.055)<1e-6);assert.ok(terrain.max.y>.5);
 for(let i=0;i<=100;i++){view.update(0,i/100);scene.updateMatrixWorld(true);assert.ok(!terrain.intersectsBox(new THREE.Box3().setFromObject(person,true)))}view.dispose();
});

test('rear tree meets the hill and clears the hill trail',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),hill=scene.getObjectByName('free-will-rear-hill'),tree=scene.getObjectByName('free-will-tree'),trail=scene.getObjectByName('free-will-hill-trail');scene.updateMatrixWorld(true);
 const origin=tree.localToWorld(new THREE.Vector3(0,2,0)),hit=new THREE.Raycaster(origin,new THREE.Vector3(0,-1,0)).intersectObject(hill)[0];assert.ok(hit);assert.ok(Math.abs(tree.getWorldPosition(new THREE.Vector3()).y-hit.point.y)<.02);const p=trail.geometry.attributes.position;for(let i=0;i<p.count;i++)assert.ok(Math.hypot(p.getX(i)-tree.position.x,p.getZ(i)-tree.position.z)>.18);view.dispose();
});

test('rear trail follows the broadened hill surface',()=>{
 const scene=new THREE.Scene(),view=builders['free-will'](scene),root=scene.children[0],hill=scene.getObjectByName('free-will-rear-hill'),trail=scene.getObjectByName('free-will-hill-trail'),p=trail.geometry.getAttribute('position');scene.updateMatrixWorld(true);const down=new THREE.Vector3(0,-1,0).transformDirection(root.matrixWorld);
 for(let i=0;i<p.count;i+=4){const local=new THREE.Vector3().fromBufferAttribute(p,i),origin=root.localToWorld(local.clone().add(new THREE.Vector3(0,2,0))),hit=new THREE.Raycaster(origin,down).intersectObject(hill)[0];assert.ok(hit&&hit.distance>2&&hit.distance<2.05,`trail follows terrain at vertex ${i}`)}view.dispose();
});
