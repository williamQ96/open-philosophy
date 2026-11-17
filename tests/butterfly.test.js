import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {builders} from '../src/scenes.js';

function localBounds(object,root){const bounds=new THREE.Box3(),inverse=root.matrixWorld.clone().invert();object.traverse(o=>{if(!o.geometry)return;o.geometry.computeBoundingBox();if(o.geometry.boundingBox)bounds.union(o.geometry.boundingBox.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld)))});return bounds}

test('dream veils follow the butterfly height across control states',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),veils=[];scene.traverse(o=>{if(o.name==='butterfly-dream-veil')veils.push(o)});assert.equal(veils.length,2);const insect=scene.getObjectByName('butterfly-insect');let previous;
 for(const value of [0,.5,1]){view.update(0,value);for(const veil of veils){const p=veil.geometry.attributes.position,n=p.count,mid=(p.getY(n-2)+p.getY(n-1))/2;assert.ok(Math.abs(mid-(insect.position.y-.1))<.04);assert.ok(Math.abs(p.getX(n-1)-1.22)<1e-5)}if(previous!==undefined)assert.ok(insect.position.y>previous);previous=insect.position.y}view.dispose();assert.equal(scene.children.length,0);
});

test('dream cloud follows the insect throughout its animated height range',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),insect=scene.getObjectByName('butterfly-insect'),halo=scene.getObjectByName('butterfly-dream-halo'),contours=[],petals=[];halo.traverse(o=>{if(o.name==='butterfly-dream-cloud-contour')contours.push(o);if(o.name==='butterfly-dream-petal')petals.push(o)});assert.equal(contours.length,3);assert.equal(petals.length,4);
 for(const value of [0,.5,1])for(const time of [0,.5,2]){view.update(time,value);assert.equal(halo.position.x,insect.position.x);assert.equal(halo.position.y,insect.position.y);assert.ok(halo.position.z<insect.position.z)}view.dispose();assert.equal(scene.children.length,0);
});

test('butterfly wings open symmetrically while the dream control changes height',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),insect=scene.getObjectByName('butterfly-insect'),wings=[];
 insect.traverse(o=>{if(o.name==='butterfly-wing')wings.push(o)});assert.equal(wings.length,2);
 view.update(0,0);const low=insect.position.y,angle=wings[0].rotation.y;assert.ok(Math.abs(wings[0].rotation.y+wings[1].rotation.y)<1e-9);
 view.update(0,1);assert.ok(insect.position.y>low);assert.ok(wings[0].rotation.y>angle);assert.ok(Math.abs(wings[0].rotation.y+wings[1].rotation.y)<1e-9);
 scene.updateMatrixWorld(true);const sleeperBox=new THREE.Box3().setFromObject(scene.getObjectByName('butterfly-sleeper')),matBox=new THREE.Box3().setFromObject(scene.getObjectByName('butterfly-mat'));
 assert.ok(sleeperBox.min.y<=matBox.max.y+.02,'resting figure is close to the mat');
 view.dispose();assert.equal(scene.children.length,0);
});

test('wing outlines and spots follow the two animated wing pivots',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),insect=scene.getObjectByName('butterfly-insect'),wings=[];insect.traverse(o=>{if(o.name==='butterfly-wing')wings.push(o)});assert.equal(wings.length,2);
 for(const wing of wings){const spots=[],cells=[];wing.traverse(o=>{if(o.name==='butterfly-wing-spot')spots.push(o);if(o.name==='butterfly-wing-color-cell')cells.push(o)});assert.ok(wing.getObjectByName('butterfly-wing-surface'));assert.ok(wing.getObjectByName('butterfly-wing-outline'));assert.equal(spots.length,6);assert.equal(cells.length,4);assert.equal(cells.filter(c=>c.position.z<0).length,2);assert.equal(cells.filter(c=>c.position.z>0).length,2)}
 view.update(0,0);scene.updateMatrixWorld(true);const before=wings[0].getObjectByName('butterfly-wing-outline').localToWorld(new THREE.Vector3(.8,.5,0));view.update(.5,1);scene.updateMatrixWorld(true);const after=wings[0].getObjectByName('butterfly-wing-outline').localToWorld(new THREE.Vector3(.8,.5,0));assert.ok(before.distanceTo(after)>.1);view.dispose();
});

test('dream scene furnishings clear the sleeper and animated butterfly',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),root=scene.children[0],insect=scene.getObjectByName('butterfly-insect'),table=scene.getObjectByName('butterfly-tea-table'),sleeper=scene.getObjectByName('butterfly-sleeper');
 scene.updateMatrixWorld(true);assert.equal(localBounds(table,root).intersectsBox(localBounds(sleeper,root)),false);
 for(const value of [0,.25,.5,.75,1])for(const time of [0,.4,1,2]){
  view.update(time,value);scene.updateMatrixWorld(true);const wings=localBounds(insect,root);
  assert.equal(wings.intersectsBox(localBounds(sleeper,root)),false);
  assert.equal(wings.intersectsBox(localBounds(table,root)),false);
 }
 view.dispose();assert.equal(scene.children.length,0);
});

test('tea table meets the garden floor and the cascade reaches the pond',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),legs=[],rocks=[];scene.traverse(o=>{if(o.name==='butterfly-table-leg')legs.push(o);if(o.name==='butterfly-cascade-rock')rocks.push(o)});scene.updateMatrixWorld(true);assert.equal(legs.length,4);assert.equal(rocks.length,2);
 for(const leg of legs)assert.ok(Math.abs(new THREE.Box3().setFromObject(leg,true).min.y-.05)<1e-6);
 const cascade=scene.getObjectByName('butterfly-cascade'),vertices=cascade.geometry.getAttribute('position'),pond=scene.getObjectByName('butterfly-pond'),root=scene.children[0];assert.equal(vertices.count,8);assert.ok(Math.abs(vertices.getY(6)-.075)<1e-6);const origin=root.localToWorld(new THREE.Vector3(vertices.getX(6),1,vertices.getZ(6))),down=new THREE.Vector3(0,-1,0).transformDirection(root.matrixWorld);assert.ok(new THREE.Raycaster(origin,down).intersectObject(pond).length,'cascade reaches the water surface');
 view.dispose();
});

test('sleeper forearms meet their hands and the bolster rests on the mat',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),arms=[],hands=[];scene.traverse(o=>{if(o.name==='butterfly-forearm')arms.push(o);if(o.name==='butterfly-hand')hands.push(o)});scene.updateMatrixWorld(true);assert.equal(arms.length,2);assert.equal(hands.length,2);
 for(let i=0;i<2;i++){const tip=arms[i].localToWorld(new THREE.Vector3(0,arms[i].geometry.parameters.height/2,0));assert.ok(tip.distanceTo(hands[i].getWorldPosition(new THREE.Vector3()))<1e-6)}const bolster=scene.getObjectByName('butterfly-bolster'),mat=scene.getObjectByName('butterfly-mat');assert.ok(Math.abs(new THREE.Box3().setFromObject(bolster,true).min.y-new THREE.Box3().setFromObject(mat,true).max.y)<1e-6);view.dispose();
});

test('perimeter garden clears the furnishings, pond and butterfly flight',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),root=scene.children[0],rocks=scene.getObjectByName('butterfly-garden-rocks'),leaves=scene.getObjectByName('butterfly-garden-leaves'),flowers=[];scene.traverse(o=>{if(o.name==='butterfly-garden-flower')flowers.push(o)});assert.equal(rocks.count,15);assert.equal(leaves.count,75);assert.equal(flowers.length,2);scene.updateMatrixWorld(true);
 const mat=localBounds(scene.getObjectByName('butterfly-mat'),root).expandByScalar(.3),table=localBounds(scene.getObjectByName('butterfly-tea-table'),root).expandByScalar(.3),matrix=new THREE.Matrix4(),point=new THREE.Vector3();for(let i=0;i<rocks.count;i++){rocks.getMatrixAt(i,matrix);point.setFromMatrixPosition(matrix);assert.ok(Math.hypot(point.x,point.z)<4.65);assert.ok(Math.hypot(point.x-2.15,point.z-1.15)>1.3);assert.ok(!mat.containsPoint(point)&&!table.containsPoint(point))}
 for(const value of [0,.5,1])for(const time of [0,.5,1,2]){view.update(time,value);scene.updateMatrixWorld(true);const insect=localBounds(scene.getObjectByName('butterfly-insect'),root);for(const flower of flowers)assert.ok(!insect.intersectsBox(localBounds(flower,root)))}view.dispose();
});

test('dream hills remain inside the circular sky',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),sky=scene.getObjectByName('butterfly-dream-sky'),hills=[];
 scene.traverse(o=>{if(o.name==='butterfly-dream-hill')hills.push(o)});assert.equal(hills.length,2);
 const radius=sky.geometry.parameters.radius;
 for(const hill of hills){assert.ok(hill.position.z>sky.position.z);const p=hill.geometry.getAttribute('position');for(let i=0;i<p.count;i++)assert.ok(Math.hypot(p.getX(i),p.getY(i))<=radius+1e-5)}
 view.dispose();
});

test('cascade highlights follow the water and foam rests on the pond',()=>{
 const scene=new THREE.Scene(),view=builders.butterfly(scene),root=scene.children[0],cascade=scene.getObjectByName('butterfly-cascade'),pond=scene.getObjectByName('butterfly-pond'),highlights=scene.getObjectByName('butterfly-cascade-highlights'),foam=[];scene.traverse(o=>{if(o.name==='butterfly-cascade-foam')foam.push(o)});assert.equal(foam.length,7);scene.updateMatrixWorld(true);
 const p=highlights.geometry.getAttribute('position'),down=new THREE.Vector3(0,-1,0).transformDirection(root.matrixWorld);for(let i=0;i<p.count;i++){const point=new THREE.Vector3().fromBufferAttribute(p,i),origin=root.localToWorld(point.clone().add(new THREE.Vector3(0,1,0))),hits=new THREE.Raycaster(origin,down).intersectObject(cascade);assert.ok(hits.length&&hits[0].distance>.98&&hits[0].distance<1.03)}
 for(const spot of foam){const origin=spot.getWorldPosition(new THREE.Vector3()).addScaledVector(down,-1);assert.ok(new THREE.Raycaster(origin,down).intersectObject(pond).length)}view.dispose();
});
