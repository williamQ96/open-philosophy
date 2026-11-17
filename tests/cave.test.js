import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

test('deep cave overhang joins its upper strata and clears the figures',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),roof=scene.getObjectByName('cave-overhang'),strata=scene.getObjectByName('cave-roof-strata'),subjects=[];scene.traverse(o=>{if(o.name==='cave-prisoner'||o.name==='cave-freed-person')subjects.push(o)});roof.geometry.computeBoundingBox();strata.geometry.computeBoundingBox();const rb=roof.geometry.boundingBox,sb=strata.geometry.boundingBox;assert.ok(Math.abs(rb.max.z-rb.min.z-1.2)<1e-6);assert.ok(Math.abs(sb.min.z-(roof.position.z+rb.min.z))<1e-6);assert.ok(Math.abs(sb.max.z-(roof.position.z+rb.max.z))<1e-6);
 for(const value of [0,.5,1]){view.update(0,value);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(roof,true);for(const subject of subjects)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(subject,true)))}view.dispose();
});

test('cave departure leaves silhouettes intact and the steps clear the fire',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),silhouettes=[],steps=[];
 scene.traverse(o=>{if(o.name==='cave-silhouette')silhouettes.push(o);if(o.name==='cave-exit-step')steps.push(o)});
 assert.equal(silhouettes.length,3);assert.equal(steps.length,5);
 const person=scene.getObjectByName('cave-freed-person'),fire=scene.getObjectByName('cave-fire'),seated=person.getObjectByName('cave-seated'),standing=person.getObjectByName('cave-standing');
 view.update(0,0);scene.updateMatrixWorld(true);const start=person.position.x;
 assert.equal(seated.visible,true);assert.equal(standing.visible,false);
 const fireBox=new THREE.Box3().setFromObject(fire);
 const brazier=scene.getObjectByName('cave-brazier'),stand=scene.getObjectByName('cave-prop-stand');assert.ok(brazier&&stand);
 const brazierBox=new THREE.Box3().setFromObject(brazier),standBox=new THREE.Box3().setFromObject(stand);
 assert.ok(Math.abs(brazierBox.max.y-fire.position.y)<1e-6,'flame starts at the top of its brazier');
 for(const step of steps)assert.ok(!fireBox.intersectsBox(new THREE.Box3().setFromObject(step)),'steps must not overlap the flames');
 for(let i=2;i<=10;i++){view.update(0,i/10);scene.updateMatrixWorld(true);const personBox=new THREE.Box3().setFromObject(standing);assert.ok(!fireBox.intersectsBox(personBox),'the departing person must clear the flames');assert.ok(!brazierBox.intersectsBox(personBox));assert.ok(!standBox.intersectsBox(personBox))}
 view.update(0,1);assert.ok(person.position.x>start+1.5);assert.equal(seated.visible,false);assert.equal(standing.visible,true);assert.ok(Math.abs(standing.rotation.y-Math.PI/2)<1e-6);
 for(const silhouette of silhouettes)assert.equal(silhouette.scale.x, silhouette.scale.y);
 view.dispose();assert.equal(scene.children.length,0);
});

test('cave keeps two seated prisoners and the released chain at the original anchors',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),prisoners=[],anchors=[],chain=[];scene.traverse(o=>{if(o.name==='cave-prisoner')prisoners.push(o);if(o.name==='cave-anchor')anchors.push(o);if(o.name==='cave-freed-chain')chain.push(o)});
 assert.equal(prisoners.length,2);assert.equal(anchors.length,3);assert.equal(chain.length,9);assert.ok(scene.getObjectByName('cave-overhang'));
 const before=chain.map(link=>link.position.clone()),freed=scene.getObjectByName('cave-freed-person');view.update(0,1);
 assert.ok(prisoners.every(p=>p.getObjectByName('cave-seated').visible));assert.ok(chain.every((link,i)=>link.position.x===before[i].x&&link.position.z===before[i].z));assert.ok(chain[0].position.equals(before[0]));assert.ok(freed.position.x>anchors[2].position.x+1.5);
 view.dispose();assert.equal(scene.children.length,0);
});

test('restraint chains reach the seated figures and remain at their anchors',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),people=[],cuffs=[],links=[];scene.traverse(o=>{if(o.name==='cave-prisoner'||o.name==='cave-freed-person')people.push(o);if(o.name==='cave-restraint-cuff'||o.name==='cave-loose-cuff')cuffs.push(o);if(o.name==='cave-freed-chain')links.push(o)});view.update(0,0);scene.updateMatrixWorld(true);assert.equal(cuffs.length,3);
 for(let i=0;i<3;i++)assert.ok(cuffs[i].getWorldPosition(new THREE.Vector3()).distanceTo(people[i].getObjectByName('cave-bound-hand').getWorldPosition(new THREE.Vector3()))<1e-6);
 const before=cuffs[2].position.clone();for(let step=0;step<=20;step++){view.update(0,step/20);scene.updateMatrixWorld(true);for(let i=1;i<links.length;i++)assert.ok(links[i].position.distanceTo(links[i-1].position)<.1);for(const item of [...links,cuffs[2]])assert.ok(new THREE.Box3().setFromObject(item).min.y>=.08-1e-6,'released restraint remains above the floor')}
 assert.equal(cuffs[2].position.x,before.x);assert.equal(cuffs[2].position.z,before.z);assert.ok(Math.abs(new THREE.Box3().setFromObject(cuffs[2]).min.y-.08)<1e-6);view.dispose();
});

test('cave exit steps form grounded, continuous risers',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),steps=[],rocks=[];
 scene.traverse(o=>{if(o.name==='cave-exit-step')steps.push(o);if(o.name==='cave-exit-rock')rocks.push(o)});
 scene.updateMatrixWorld(true);
 const boxes=steps.map(step=>new THREE.Box3().setFromObject(step));
 assert.equal(boxes.length,5);assert.equal(rocks.length,5);
 for(let i=0;i<boxes.length;i++){
  assert.ok(Math.abs(boxes[i].min.y-.08)<1e-6,'each riser meets the cave floor');
  if(i){assert.ok(Math.abs(boxes[i].max.z-boxes[i-1].min.z)<1e-6,'adjacent risers meet');assert.ok(Math.abs(boxes[i].max.y-boxes[i-1].max.y-.11)<1e-6,'steps rise evenly')}
 }
 view.dispose();
});

test('cave figures meet the floor and the released person approaches the first step',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),people=[],steps=[];
 scene.traverse(o=>{if(o.name==='cave-prisoner'||o.name==='cave-freed-person')people.push(o);if(o.name==='cave-exit-step')steps.push(o)});
 view.update(0,0);scene.updateMatrixWorld(true);
 for(const person of people){const box=new THREE.Box3().setFromObject(person.getObjectByName('cave-seated'),true);assert.ok(Math.abs(box.min.y-.08)<1e-5,'seated figure meets floor')}
 const freed=scene.getObjectByName('cave-freed-person'),standing=freed.getObjectByName('cave-standing');
 for(let i=2;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(standing,true);assert.ok(Math.abs(box.min.y-.08)<1e-5,'standing figure meets floor');for(const step of steps)assert.ok(!box.intersectsBox(new THREE.Box3().setFromObject(step)),'figure clears steps')}
 const figureBox=new THREE.Box3().setFromObject(standing,true),firstStep=new THREE.Box3().setFromObject(steps[0]);assert.ok(firstStep.min.x-figureBox.max.x<.1,'figure ends near entrance');
 view.dispose();
});

test('horse prop is supported and clear of the departure route',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),horse=scene.getObjectByName('cave-horse-prop'),pedestal=scene.getObjectByName('cave-horse-pedestal'),person=scene.getObjectByName('cave-standing');assert.ok(horse&&pedestal);scene.updateMatrixWorld(true);
 const horseBox=new THREE.Box3().setFromObject(horse),pedestalBox=new THREE.Box3().setFromObject(pedestal);assert.ok(Math.abs(horseBox.min.y-pedestalBox.max.y)<1e-6);
 for(let i=2;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);const figure=new THREE.Box3().setFromObject(person,true);assert.ok(!figure.intersectsBox(horseBox)&&!figure.intersectsBox(pedestalBox))}view.dispose();
});

test('stone prop wall supports both stands and clears the departure path',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),wall=scene.getObjectByName('cave-prop-wall'),person=scene.getObjectByName('cave-freed-person');assert.ok(wall);scene.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(wall,true);assert.ok(Math.abs(b.min.y-.08)<1e-6);
 for(const name of ['cave-prop-stand','cave-horse-shim']){const stand=new THREE.Box3().setFromObject(scene.getObjectByName(name),true);assert.ok(Math.abs(stand.min.y-b.max.y)<1e-6);assert.ok(stand.min.x>=b.min.x&&stand.max.x<=b.max.x)}const shim=new THREE.Box3().setFromObject(scene.getObjectByName('cave-horse-shim'),true),pedestal=new THREE.Box3().setFromObject(scene.getObjectByName('cave-horse-pedestal'),true);assert.ok(Math.abs(shim.max.y-pedestal.min.y)<1e-6);
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);const visible=i/20<.12?person.getObjectByName('cave-seated'):person.getObjectByName('cave-standing');assert.ok(!b.intersectsBox(new THREE.Box3().setFromObject(visible,true)))}view.dispose();
});

test('cave lights respond independently to time and the daylight control',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),fire=scene.getObjectByName('cave-fire-light'),day=scene.getObjectByName('cave-daylight-light'),sun=scene.getObjectByName('cave-daylight'),horse=scene.getObjectByName('cave-horse-prop');assert.ok(fire?.isPointLight&&day?.isPointLight);assert.notEqual(sun.material,horse.material);
 view.update(0,0);assert.equal(day.intensity,0);const start=fire.intensity;view.update(Math.PI/8,1);assert.equal(day.intensity,7);assert.ok(fire.intensity>start);assert.equal(horse.material.emissive.getHex(),0);view.dispose();assert.equal(scene.children.length,0);
});

test('cave roof facets remain above the wall silhouettes',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),facets=[],silhouettes=[];scene.traverse(o=>{if(o.name==='cave-roof-facet')facets.push(o);if(o.name==='cave-silhouette')silhouettes.push(o)});assert.equal(facets.length,12);assert.equal(silhouettes.length,3);scene.updateMatrixWorld(true);
 const maxShadow=Math.max(...silhouettes.map(o=>new THREE.Box3().setFromObject(o,true).max.y));for(const facet of facets)assert.ok(new THREE.Box3().setFromObject(facet,true).min.y>maxShadow);view.dispose();
});

test('irregular cave facing remains behind the silhouettes',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),facing=scene.getObjectByName('cave-rock-facing'),silhouettes=[];scene.traverse(o=>{if(o.name==='cave-silhouette')silhouettes.push(o)});assert.ok(facing);assert.equal(silhouettes.length,3);scene.updateMatrixWorld(true);
 const surface=new THREE.Box3().setFromObject(facing,true),back=new THREE.Box3().setFromObject(scene.getObjectByName('cave-wall'),true);assert.ok(surface.max.z-surface.min.z>.04);assert.ok(surface.min.z>back.max.z);const ray=new THREE.Raycaster(),direction=new THREE.Vector3(0,0,-1);for(const shadow of silhouettes){const p=shadow.geometry.getAttribute('position');for(let i=0;i<p.count;i+=37){const point=shadow.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));ray.set(point.clone().add(new THREE.Vector3(0,0,.5)),direction);const hit=ray.intersectObject(facing)[0];assert.ok(hit&&Math.abs(hit.distance-.506)<.001)}}view.dispose();
});

test('outside scenery stays behind the opening and clear of the departure route',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),outside=scene.getObjectByName('cave-outside-view'),sky=scene.getObjectByName('cave-outside-sky'),ridges=[];outside.traverse(o=>{if(o.name==='cave-outside-ridge')ridges.push(o)});assert.ok(sky);assert.equal(ridges.length,3);scene.updateMatrixWorld(true);
 const background=new THREE.Box3().setFromObject(outside,true);assert.ok(background.max.z< -1.9);assert.ok(background.min.x>2.85&&background.max.x<3.9);
 for(let i=0;i<=20;i++){view.update(0,i/20);scene.updateMatrixWorld(true);const person=scene.getObjectByName('cave-freed-person'),visible=i/20<.12?person.getObjectByName('cave-seated'):person.getObjectByName('cave-standing');assert.ok(!background.intersectsBox(new THREE.Box3().setFromObject(visible,true)))}view.dispose();
});

test('cave floor slabs remain almost flush with the supporting floor',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),slabs=scene.getObjectByName('cave-floor-slabs'),floor=scene.getObjectByName('cave-floor');scene.updateMatrixWorld(true);const floorTop=new THREE.Box3().setFromObject(floor,true).max.y,p=slabs.geometry.getAttribute('position');assert.ok(p.count>500);
 for(let i=0;i<p.count;i++){assert.ok(Number.isFinite(p.getX(i))&&Number.isFinite(p.getZ(i)));assert.ok(p.getX(i)>=-4&&p.getX(i)<=4&&p.getZ(i)>=-2.5&&p.getZ(i)<=2.5);assert.ok(p.getY(i)>floorTop&&p.getY(i)-floorTop<.0001)}view.dispose();
});

test('cave side wall meets the floor and stays clear of prisoners and silhouettes',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),wall=scene.getObjectByName('cave-side-wall'),roof=scene.getObjectByName('cave-overhang'),subjects=[],facets=[];scene.traverse(o=>{if(o.name==='cave-prisoner'||o.name==='cave-silhouette')subjects.push(o);if(o.name==='cave-side-facet')facets.push(o)});scene.updateMatrixWorld(true);
 const wallBox=new THREE.Box3().setFromObject(wall),roofBox=new THREE.Box3().setFromObject(roof);assert.ok(Math.abs(wallBox.min.y-.08)<1e-6);assert.ok(wallBox.intersectsBox(roofBox));assert.equal(facets.length,5);for(const subject of subjects){const box=new THREE.Box3().setFromObject(subject);assert.ok(!wallBox.intersectsBox(box));for(const facet of facets)assert.ok(!new THREE.Box3().setFromObject(facet).intersectsBox(box))}view.dispose();
});

test('cave shadow masks have soft edges and persist through departure',()=>{
 const scene=new THREE.Scene(),view=builders.cave(scene),shadows=[];scene.traverse(o=>{if(o.name==='cave-silhouette')shadows.push(o)});assert.equal(shadows.length,3);
 for(const shadow of shadows){const {data}=shadow.material.map.image,alpha=[];for(let i=3;i<data.length;i+=4)alpha.push(data[i]);assert.ok(shadow.material.transparent&&!shadow.material.depthWrite);assert.ok(alpha.some(a=>a===0)&&alpha.some(a=>a>150)&&alpha.some(a=>a>20&&a<130))}
 view.update(0,1);assert.ok(shadows.every(o=>o.visible));view.dispose();
});
