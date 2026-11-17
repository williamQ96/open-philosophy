import {test} from 'node:test';import assert from 'node:assert/strict';import * as THREE from 'three';import {concepts} from '../src/concepts.js';import {builders} from '../src/scenes.js';import {createModel,act,syntheticTwinCount,interactivePresentation} from '../src/interactive.js';import {createMetaphorModel,metaphorAct} from '../src/metaphors.js';import {readFileSync} from 'node:fs';
const ids=['language-wall','pigeon','induction','schedules','stimulation','twins','argument-frames','time-frames','emotion-orientation'];
function snapshot(scene){scene.updateMatrixWorld(true);const result=[];scene.traverse(o=>{if(o.isMesh)result.push([o.matrixWorld.elements,o.visible,o.material.color?.getHex()])});return JSON.stringify(result)}
test('each of nine route-specific scenes receives the actual model state',()=>{for(const id of ids){const c=concepts.find(c=>c.id===id),scene=new THREE.Scene(),view=builders[id](scene,c),metaphor=ids.indexOf(id)>=6;let state=metaphor?createMetaphorModel(id):createModel(id,()=>.5);view.setInteraction(state);view.update(0,.5);const before=snapshot(scene);const action=metaphor?'frame':({ 'language-wall':'describe',pigeon:'behavior',induction:'step',schedules:'response',stimulation:'condition',twins:'compare'})[id];state=metaphor?metaphorAct(state,action):act(state,action);view.setInteraction(state);view.update(0,.5);assert.notEqual(snapshot(scene),before,id);view.dispose();assert.equal(scene.children.length,0)}});
test('main route mounts UI and forwards its changed state to active scene',()=>{const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');assert.match(main,/location\.hash\.slice\(1\)/);assert.match(main,/active\.setInteraction\(state\)/);assert.match(main,/remountPreservingFocus/);assert.match(main,/interactiveView\?\.dispose\(\)/)});
test('synthetic twin controls change population, type and environment',()=>{let s=createModel('twins');s=act(s,'group');s=act(s,'zyg');s=act(s,'environment');assert.equal(s.group,1);assert.equal(s.zygosity,1);assert.equal(s.environment,1)});

test('shared landscape remains behind the twin comparison in both environments',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),landscape=scene.getObjectByName('twin-shared-landscape'),indicators=[scene.getObjectByName('twin-example-indicator'),scene.getObjectByName('twin-type-indicator')];assert.ok(landscape&&landscape.getObjectByName('twin-landscape-sky'));let state=createModel(id,()=>.5);
 for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(landscape,true);assert.ok(landscape.visible&&bounds.min.x>-.84&&bounds.max.x<.84);for(const indicator of indicators)assert.ok(bounds.max.z<new THREE.Box3().setFromObject(indicator,true).min.z);state=act(state,'environment')}view.dispose();
});

test('language paving remains flush within its circular base',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),slabs=scene.getObjectByName('language-paving-slabs'),base=scene.getObjectByName('language-paving-base'),positions=slabs.geometry.getAttribute('position');assert.ok(positions.count>100);const top=base.position.y+base.geometry.parameters.height/2;
 for(let i=0;i<positions.count;i++){assert.ok(Math.hypot(positions.getX(i),positions.getZ(i))<4.53);assert.ok(Math.abs(positions.getY(i)-top-.001)<1e-6)}view.dispose();
});

test('argument rug follows the frame while keeping a common support height',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),floor=scene.getObjectByName('argument-stage-floor'),weave=scene.getObjectByName('argument-rug-weave'),p=weave.geometry.getAttribute('position');let state=createMetaphorModel(id);const top=floor.position.y+floor.geometry.parameters.height/2;for(let i=0;i<p.count;i++)assert.ok(Math.abs(p.getY(i)-top-.002)<1e-6);
 for(const color of [0xb99b84,0x8fa396]){view.setInteraction(state);assert.equal(floor.material.color.getHex(),color);assert.ok(weave.visible);state=metaphorAct(state,'frame')}view.dispose();
});

test('time-as-money example changes the visible scene',()=>{const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));let s=createMetaphorModel(id);view.setInteraction(s);view.update(0,.5);const a=snapshot(scene);s=metaphorAct(s,'example');view.setInteraction(s);view.update(0,.5);assert.notEqual(snapshot(scene),a);view.dispose()});

test('time-frame detail follows the chosen metaphor and is released on disposal',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));
 let state=createMetaphorModel(id);view.setInteraction(state);
 const money=scene.getObjectByName('money-detail'),garden=scene.getObjectByName('garden-detail');
 assert.ok(money&&garden);assert.ok(money.children.length>0&&garden.children.length>0);
 assert.equal(money.visible,true);assert.equal(garden.visible,false);
 state=metaphorAct(state,'frame');view.setInteraction(state);
 assert.equal(money.visible,false);assert.equal(garden.visible,true);
 const resources=new Set();garden.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)resources.add(o.material)});
 const disposed=new Map([...resources].map(r=>[r,0]));for(const resource of resources)resource.addEventListener('dispose',()=>disposed.set(resource,disposed.get(resource)+1));
 view.dispose();for(const count of disposed.values())assert.equal(count,1);
});

test('garden example switches between planted and fallow soil',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),sprouts=[];let state=createMetaphorModel(id);
 scene.traverse(o=>{if(o.name==='time-garden-sprout')sprouts.push(o)});assert.equal(sprouts.length,5);
 const meshes=group=>{const result=[];group.traverse(o=>{if(o.isMesh)result.push(o)});return result};
 view.setInteraction(state);assert.ok(sprouts.every(g=>meshes(g).every(o=>!o.visible)));
 state=metaphorAct(state,'frame');view.setInteraction(state);assert.ok(sprouts.every(g=>meshes(g).every(o=>o.visible)));
 state=metaphorAct(state,'example');view.setInteraction(state);assert.ok(sprouts.every(g=>meshes(g).every(o=>!o.visible)));
 state=metaphorAct(state,'example');view.setInteraction(state);assert.ok(sprouts.every(g=>meshes(g).every(o=>o.visible)));
 view.dispose();assert.equal(scene.children.length,0);
});

test('gardener reaches the soil with connected arms in both garden examples',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),gardener=scene.getObjectByName('time-gardener'),hands=[],arms=[];gardener.traverse(o=>{if(o.name==='time-gardener-hand')hands.push(o);if(o.name==='time-gardener-forearm')arms.push(o)});assert.equal(hands.length,2);assert.equal(arms.length,2);
 for(let i=0;i<2;i++){const end=new THREE.Vector3(0,arms[i].geometry.parameters.height/2,0).applyQuaternion(arms[i].quaternion).add(arms[i].position);assert.ok(end.distanceTo(hands[i].position)<1e-6)}
 let state=metaphorAct(createMetaphorModel(id),'frame');for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const soil=new THREE.Box3().setFromObject(scene.getObjectByName('time-garden-soil'),true);for(const hand of hands){const b=new THREE.Box3().setFromObject(hand,true);assert.ok(hand.visible&&b.min.y>=soil.max.y&&b.min.y-soil.max.y<.03);assert.ok(b.min.z>soil.min.z&&b.max.z<soil.max.z)}state=metaphorAct(state,'example')}view.dispose();
});

test('pergola foliage follows the garden frame in both seasonal examples',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),leaves=scene.getObjectByName('time-pergola-leaves'),blossoms=scene.getObjectByName('time-pergola-blossoms');assert.ok(leaves&&blossoms);let state=createMetaphorModel(id);view.setInteraction(state);assert.equal(leaves.visible,false);assert.equal(blossoms.visible,false);state=metaphorAct(state,'frame');view.setInteraction(state);assert.equal(leaves.visible,true);assert.equal(blossoms.visible,true);state=metaphorAct(state,'example');view.setInteraction(state);assert.equal(leaves.visible,true);assert.equal(blossoms.visible,true);state=metaphorAct(state,'frame');view.setInteraction(state);assert.equal(leaves.visible,false);assert.equal(blossoms.visible,false);view.dispose();
});

test('garden border flowers stay outside the bed in planted and fallow examples',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),border=scene.getObjectByName('time-garden-border'),bed=scene.getObjectByName('time-garden-bed');assert.ok(border&&bed);let state=createMetaphorModel(id);view.setInteraction(state);assert.ok(border.children.every(o=>!o.visible));
 state=metaphorAct(state,'frame');view.setInteraction(state);scene.updateMatrixWorld(true);assert.ok(border.children.every(o=>o.visible));assert.ok(new THREE.Box3().setFromObject(border,true).max.z<new THREE.Box3().setFromObject(bed,true).min.z);
 state=metaphorAct(state,'example');view.setInteraction(state);assert.ok(border.children.every(o=>o.visible));state=metaphorAct(state,'frame');view.setInteraction(state);assert.ok(border.children.every(o=>!o.visible));view.dispose();
});

test('garden side stones stay with the plot and clear the watering can',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),stones=[],can=scene.getObjectByName('time-watering-can');scene.traverse(o=>{if(o.name==='time-bed-side-stone')stones.push(o)});assert.equal(stones.length,10);let state=createMetaphorModel(id);view.setInteraction(state);assert.ok(stones.every(o=>!o.visible));
 state=metaphorAct(state,'frame');for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const canBox=new THREE.Box3().setFromObject(can,true);for(const stone of stones){const bounds=new THREE.Box3().setFromObject(stone,true);assert.ok(stone.visible&&bounds.min.y<=0&&bounds.max.y>0);assert.ok(!bounds.intersectsBox(canBox))}state=metaphorAct(state,'example')}view.dispose();
});

test('fruit tree stays outside the bed and follows the garden frame',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),tree=scene.getObjectByName('time-orchard-tree'),bed=scene.getObjectByName('time-garden-bed'),fruit=[];tree.traverse(o=>{if(o.name==='time-orchard-fruit')fruit.push(o)});assert.equal(fruit.length,5);let state=createMetaphorModel(id);view.setInteraction(state);assert.ok(tree.children.every(o=>!o.visible));state=metaphorAct(state,'frame');view.setInteraction(state);scene.updateMatrixWorld(true);assert.ok(tree.children.every(o=>o.visible));assert.ok(!new THREE.Box3().setFromObject(tree,true).intersectsBox(new THREE.Box3().setFromObject(bed,true)));state=metaphorAct(state,'example');view.setInteraction(state);assert.ok(fruit.every(o=>o.visible));view.dispose();
});

test('hourglass sand remains anchored and changed coin stacks do not float',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),upper=scene.getObjectByName('time-upper-sand'),lower=scene.getObjectByName('time-lower-sand'),coins=[],posts=[];scene.traverse(o=>{if(o.name==='time-coin')coins.push(o);if(o.name==='time-pergola-post')posts.push(o)});assert.equal(posts.length,4);assert.equal(coins.length,12);
 let state=createMetaphorModel(id);for(let i=0;i<2;i++){view.setInteraction(state);assert.ok(Math.abs(upper.position.y-.26*upper.scale.y-.75)<1e-9);assert.ok(.31*upper.scale.x<.35*(.52*upper.scale.y)/.62);assert.ok(Math.abs(lower.position.y-.26*lower.scale.y-.13)<1e-9);for(const [j,coin] of coins.entries())assert.equal(coin.visible,!(state.example&&j%4===3));state=metaphorAct(state,'example')}
 view.dispose();assert.equal(scene.children.length,0);
});

test('receiver house and roof stay together across background and build changes',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));
 let state=createModel(id,()=>.5);const house=scene.getObjectByName('receiver-house'),roof=scene.getObjectByName('receiver-roof');
 view.setInteraction(state);assert.equal(house.visible,false);assert.equal(roof.visible,false);
 state=act(state,'background');state=act(state,'build');view.setInteraction(state);
 assert.equal(house.visible,true);assert.equal(roof.visible,true);assert.equal(roof.position.z,house.position.z);
 assert.ok(Math.abs((roof.position.y-.4*roof.scale.y)-(house.position.y+.5*house.scale.y))<.001);
 state=act(state,'describe');state=act(state,'build');view.setInteraction(state);
 assert.equal(roof.position.z,house.position.z);assert.ok(Math.abs((roof.position.y-.4*roof.scale.y)-(house.position.y+.5*house.scale.y))<.06);
 view.dispose();
});

test('both house models rest on their display tables in each receiver background',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),sender=scene.getObjectByName('sender-house'),receiver=scene.getObjectByName('receiver-house'),senderTable=scene.getObjectByName('language-sender-display'),receiverTable=scene.getObjectByName('language-receiver-display');let state=createModel(id,()=>.5);state=act(state,'build');
 for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);for(const [model,table] of [[sender,senderTable],[receiver,receiverTable]]){model.geometry.computeBoundingBox();const b=model.geometry.boundingBox.clone().applyMatrix4(model.matrixWorld),t=new THREE.Box3().setFromObject(table,true);assert.ok(Math.abs(b.min.y-t.max.y)<1e-6);assert.ok(b.min.x>=t.min.x&&b.max.x<=t.max.x&&b.min.z>=t.min.z&&b.max.z<=t.max.z)}state=act(state,'background')}
 view.dispose();
});

test('urban upper storey follows the selected twin environment',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),urban=scene.getObjectByName('twin-urban-home'),windows=[];urban.traverse(o=>{if(o.name==='twin-urban-upper-window')windows.push(o)});assert.equal(windows.length,3);let state=createModel(id,()=>.5);view.setInteraction(state);assert.equal(urban.visible,false);state=act(state,'environment');view.setInteraction(state);assert.equal(urban.visible,true);assert.ok(windows.every(w=>w.parent===urban&&w.position.y>1.5));state=act(state,'environment');view.setInteraction(state);assert.equal(urban.visible,false);view.dispose();
});

test('twin background trees stay clear of the seated pair in both environments',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),trees=[],people=[];scene.traverse(o=>{if(o.name==='twin-surrounding-tree')trees.push(o);if(o.name==='twin-person')people.push(o)});assert.equal(trees.length,2);assert.equal(people.length,2);let state=createModel(id,()=>.5);
 for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);for(const tree of trees){assert.ok(tree.getObjectByName('twin-tree-leaves'));const bounds=new THREE.Box3().setFromObject(tree,true);for(const person of people)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(person,true)))}state=act(state,'environment')}view.dispose();
});

test('receiver thought remains unresolved until a model is built',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),thought=scene.getObjectByName('language-unbuilt-thought'),people=[];scene.traverse(o=>{if(o.name==='language-participant')people.push(o)});assert.ok(thought?.getObjectByName('language-thought-house'));let state=createModel(id);view.setInteraction(state);scene.updateMatrixWorld(true);assert.equal(thought.visible,true);for(const person of people)assert.ok(!new THREE.Box3().setFromObject(thought,true).intersectsBox(new THREE.Box3().setFromObject(person,true)));state=act(state,'build');view.setInteraction(state);assert.equal(thought.visible,false);view.setInteraction(createModel(id));assert.equal(thought.visible,true);view.dispose();
});

test('language workspace tools rest on their tables and clear the message passage',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),cup=scene.getObjectByName('language-pencil-cup'),mallet=scene.getObjectByName('language-mallet'),tray=scene.getObjectByName('language-message-tray');assert.ok(cup&&mallet&&tray);scene.updateMatrixWorld(true);
 const cupBox=new THREE.Box3().setFromObject(cup,true),malletBox=new THREE.Box3().setFromObject(mallet,true),trayBox=new THREE.Box3().setFromObject(tray,true);assert.ok(Math.abs(cupBox.min.y-.74)<1e-6);assert.ok(Math.abs(malletBox.min.y-.74)<1e-6);assert.ok(!cupBox.intersectsBox(trayBox)&&!malletBox.intersectsBox(trayBox));
 view.dispose();
});

test('language participants have connected forearms and grounded shoes',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),people=[];scene.traverse(o=>{if(o.name==='language-participant')people.push(o)});scene.updateMatrixWorld(true);assert.equal(people.length,2);
 for(const person of people){const arms=[],hands=[],shoes=[];person.traverse(o=>{if(o.name==='language-forearm')arms.push(o);if(o.name==='language-hand')hands.push(o);if(o.name==='language-shoe')shoes.push(o)});assert.equal(arms.length,2);assert.equal(hands.length,2);assert.equal(shoes.length,2);for(let i=0;i<2;i++){const tip=arms[i].localToWorld(new THREE.Vector3(0,arms[i].geometry.parameters.height/2,0));assert.ok(tip.distanceTo(hands[i].getWorldPosition(new THREE.Vector3()))<1e-6);assert.ok(Math.abs(new THREE.Box3().setFromObject(shoes[i],true).min.y)<1e-6)}}view.dispose();
});


test('language description and house details follow the model state',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));let state=createModel(id,()=>.5);
 const source=scene.getObjectByName('sender-house'),sourceRoof=scene.getObjectByName('sender-roof'),house=scene.getObjectByName('receiver-house'),roof=scene.getObjectByName('receiver-roof'),icon=scene.getObjectByName('language-specific-icon');
 view.setInteraction(state);assert.ok(source.visible&&sourceRoof.visible);assert.ok(source.position.x<0&&house.position.x>0);assert.equal(source.position.z,sourceRoof.position.z);assert.ok(icon.children.every(o=>!o.visible));assert.equal(house.visible,false);
 state=act(state,'describe');view.setInteraction(state);assert.ok(icon.children.every(o=>o.visible));state=act(state,'build');view.setInteraction(state);assert.equal(state.build,'matched');assert.ok(house.visible&&roof.visible);assert.equal(roof.material.color.getHex(),sourceRoof.material.color.getHex());assert.ok(house.children.length>0);
 view.dispose();assert.equal(scene.children.length,0);
});

test('receiver house details follow its background shift and do not appear before building',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));let state=createModel(id,()=>.5);
 const house=scene.getObjectByName('receiver-house'),knob=house.getObjectByName('language-house-knob');assert.ok(knob);
 view.setInteraction(state);assert.equal(house.visible,false);
 state=act(state,'describe');state=act(state,'build');view.setInteraction(state);scene.updateMatrixWorld(true);
 const before=knob.getWorldPosition(new THREE.Vector3());assert.equal(house.visible,true);
 state=act(state,'background');view.setInteraction(state);scene.updateMatrixWorld(true);
 const after=knob.getWorldPosition(new THREE.Vector3());assert.ok(Math.abs(after.z-before.z-.5)<1e-9);
 view.dispose();assert.equal(scene.children.length,0);
});

test('house chimneys are attached to their models through reconstruction changes',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));let state=createModel(id,()=>.5);const source=scene.getObjectByName('sender-house'),house=scene.getObjectByName('receiver-house'),sourceChimney=source.getObjectByName('language-house-chimney'),chimney=house.getObjectByName('language-house-chimney');assert.ok(sourceChimney&&chimney);assert.equal(chimney.parent,house);
 view.setInteraction(state);assert.equal(house.visible,false);state=act(state,'build');view.setInteraction(state);scene.updateMatrixWorld(true);const before=chimney.getWorldPosition(new THREE.Vector3());assert.ok(house.visible);state=act(state,'background');view.setInteraction(state);scene.updateMatrixWorld(true);const after=chimney.getWorldPosition(new THREE.Vector3());assert.ok(Math.abs(after.z-before.z-.5)<1e-9);view.dispose();
});

test('roof tiles stay attached to the receiver roof in each reconstruction state',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));let state=createModel(id,()=>.5);const roof=scene.getObjectByName('receiver-roof');
 assert.equal(roof.children.length,24);view.setInteraction(state);assert.equal(roof.visible,false);
 for(let i=0;i<4;i++){state=act(state,'build');view.setInteraction(state);assert.equal(roof.visible,state.build!=='none');for(const tile of roof.children){assert.equal(tile.parent,roof);assert.equal(tile.material,roof.material)}}
 view.dispose();assert.equal(scene.children.length,0);
});

test('argument columns stay grounded and support the shared arches in both frames',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),bases=[],stones=[],capitals=[],arches=[];scene.traverse(o=>{if(o.name==='argument-column-base')bases.push(o);if(o.name==='argument-column-stone')stones.push(o);if(o.name==='argument-column-capital')capitals.push(o);if(o.name==='argument-arch')arches.push(o)});assert.equal(bases.length,3);assert.equal(stones.length,15);assert.equal(capitals.length,3);assert.equal(arches.length,2);let state=createMetaphorModel(id);
 for(let frame=0;frame<2;frame++){view.setInteraction(state);scene.updateMatrixWorld(true);for(const base of bases){const b=new THREE.Box3().setFromObject(base,true),stack=stones.filter(o=>o.position.x===base.position.x).sort((a,b)=>a.position.y-b.position.y),capital=capitals.find(o=>o.position.x===base.position.x);assert.ok(Math.abs(b.min.y)<1e-6);let top=b.max.y;for(const stone of stack){const box=new THREE.Box3().setFromObject(stone,true);assert.ok(Math.abs(box.min.y-top)<.005);top=box.max.y}const capBounds=new THREE.Box3().setFromObject(capital,true);assert.ok(Math.abs(capBounds.min.y-top)<.005);assert.ok(arches.some(arch=>new THREE.Box3().setFromObject(arch,true).intersectsBox(capBounds)))}const badge=new THREE.Box3().setFromObject(scene.getObjectByName('argument-frame-indicator'),true),central=stones.find(o=>o.position.x===0&&o.position.y>1.4&&o.position.y<1.7);assert.ok(badge.min.z>new THREE.Box3().setFromObject(central,true).max.z);state=metaphorAct(state,'frame')}view.dispose();
});

test('pigeon clock and food display depend on elapsed intervals, not behavior',()=>{
 const id='pigeon',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));let state=createModel(id,()=>.5);const pellets=[];scene.traverse(o=>{if(o.name==='pigeon-food-pellet')pellets.push(o)});const clock=scene.getObjectByName('pigeon-clock-face'),hand=scene.getObjectByName('pigeon-clock-hand'),bird=scene.getObjectByName('pigeon-bird');
 view.setInteraction(state);assert.equal(pellets.filter(o=>o.visible).length,0);assert.equal(hand.position.x,clock.position.x);assert.equal(hand.position.y,clock.position.y);const originalAngle=hand.rotation.z,originalBird=bird.rotation.y;
 state=act(state,'behavior');view.setInteraction(state);assert.notEqual(bird.rotation.y,originalBird);assert.equal(hand.rotation.z,originalAngle);assert.equal(pellets.filter(o=>o.visible).length,0);
 for(let i=0;i<2;i++){state=act(state,'step');view.setInteraction(state);assert.equal(pellets.filter(o=>o.visible).length,0)}state=act(state,'step');view.setInteraction(state);assert.equal(pellets.filter(o=>o.visible).length,1);
 view.dispose();assert.equal(scene.children.length,0);
});

test('pigeon plumage follows the bird during behavior changes',()=>{
 const id='pigeon',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),bird=scene.getObjectByName('pigeon-bird'),feathers=[];bird.traverse(o=>{if(o.name==='pigeon-flight-feather'||o.name==='pigeon-neck-plumage')feathers.push(o)});assert.equal(feathers.length,15);assert.ok(scene.getObjectByName('pigeon-neck-plumage').geometry.getAttribute('color'));
 const flight=feathers.find(feather=>feather.name==='pigeon-flight-feather');let state=createModel(id,()=>.5);view.setInteraction(state);scene.updateMatrixWorld(true);const first=flight.getWorldPosition(new THREE.Vector3());state=act(state,'behavior');view.setInteraction(state);scene.updateMatrixWorld(true);assert.ok(flight.getWorldPosition(new THREE.Vector3()).distanceTo(first)>.01);assert.ok(feathers.every(feather=>feather.parent===bird));view.dispose();
});

test('pigeon wing bars follow the folded wing surface and behavior poses',()=>{
 const id='pigeon',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),bird=scene.getObjectByName('pigeon-bird'),bands=[];bird.traverse(o=>{if(o.name==='pigeon-wing-band')bands.push(o)});assert.equal(bands.length,4);
 for(const band of bands){assert.equal(band.parent,bird);const p=band.geometry.getAttribute('position');for(let i=0;i<p.count;i++){const u=(p.getX(i)+.08)/.494,v=(p.getY(i)-.83)/.285,expected=.4+.095*Math.sqrt(Math.max(0,1-u*u-v*v))+.004;assert.ok(Math.abs(Math.abs(p.getZ(i))-expected)<1e-6)}}
 let state=createModel(id,()=>.5);for(let i=0;i<3;i++){view.setInteraction(state);assert.ok(bands.every(o=>o.visible));state=act(state,'behavior')}view.dispose();
});

test('pigeon remains inside the chamber through its behavior poses',()=>{
 const id='pigeon',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),bird=scene.getObjectByName('pigeon-bird'),tray=scene.getObjectByName('pigeon-food-tray'),front=scene.getObjectByName('pigeon-front-pane');let state=createModel(id,()=>.5);assert.ok(front.material.transparent&&front.material.opacity<.1);
 for(let i=0;i<3;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(bird,true);assert.ok(bounds.min.x> -3.65&&bounds.max.x<3.65);assert.ok(bounds.min.z> -1.9&&bounds.max.z<1.9);assert.ok(bounds.max.y<2.25);assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(tray,true)));assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(front,true)));state=act(state,'behavior')}view.dispose();
});

test('raised timer stays clear of the pigeon and the feeder during behavior changes',()=>{
 const id='pigeon',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),bird=scene.getObjectByName('pigeon-bird'),clock=scene.getObjectByName('pigeon-clock-face'),rim=scene.getObjectByName('pigeon-clock-rim'),hopper=scene.getObjectByName('pigeon-feeder-hopper');let state=createModel(id,()=>.5);assert.ok(clock&&rim&&hopper);
 for(let i=0;i<3;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const clockBounds=new THREE.Box3().setFromObject(clock,true),birdBounds=new THREE.Box3().setFromObject(bird,true);assert.ok(!clockBounds.intersectsBox(birdBounds));assert.ok(!clockBounds.intersectsBox(new THREE.Box3().setFromObject(hopper,true)));assert.equal(rim.position.y,clock.position.y);state=act(state,'behavior')}
 view.dispose();
});

test('pigeon hopper connects storage to the outlet above the tray',()=>{
 const id='pigeon',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),hopper=scene.getObjectByName('pigeon-feeder-hopper'),chute=scene.getObjectByName('pigeon-feeder-chute'),tray=scene.getObjectByName('pigeon-food-tray'),panes=[];scene.traverse(o=>{if(o.name==='pigeon-side-pane')panes.push(o)});assert.ok(hopper&&chute&&tray);assert.equal(panes.length,2);scene.updateMatrixWorld(true);
 const h=new THREE.Box3().setFromObject(hopper,true),c=new THREE.Box3().setFromObject(chute,true),t=new THREE.Box3().setFromObject(tray,true);assert.ok(Math.abs(h.min.y-c.max.y)<.01);assert.ok(c.min.y>t.max.y);assert.ok(h.max.y<=1);
 view.dispose();
});

test('pigeon feather details follow its movement and feeder outlet stays above the tray',()=>{
 const id='pigeon',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),bird=scene.getObjectByName('pigeon-bird'),chute=scene.getObjectByName('pigeon-feeder-chute'),feathers=[],pellets=[];
 scene.traverse(o=>{if(o.name==='pigeon-wing-covert')feathers.push(o);if(o.name==='pigeon-food-pellet')pellets.push(o)});assert.ok(feathers.length>=16);assert.equal(feathers.filter(o=>o.position.z<0).length,feathers.filter(o=>o.position.z>0).length);assert.ok(feathers.every(o=>o.parent===bird));
 let state=createModel(id,()=>.5);view.setInteraction(state);scene.updateMatrixWorld(true);const before=feathers[0].getWorldPosition(new THREE.Vector3());
 state=act(state,'behavior');view.setInteraction(state);scene.updateMatrixWorld(true);assert.ok(feathers[0].getWorldPosition(new THREE.Vector3()).distanceTo(before)>.001);assert.equal(feathers[0].parent,bird);
 const chuteBounds=new THREE.Box3().setFromObject(chute);for(const pellet of pellets)assert.equal(chuteBounds.intersectsBox(new THREE.Box3().setFromObject(pellet)),false);
 view.dispose();assert.equal(scene.children.length,0);
});

test('induction markers show five feedings followed by a counterexample',()=>{
 const id='induction',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),caps=[],crowns=[],signs=[],groups=[],bowl=[],dayBowls=[],rays=[],landscapes=[];let state=createModel(id,()=>.5);
 scene.traverse(o=>{if(o.name==='induction-day-cap')caps.push(o);if(o.name==='induction-day-crown')crowns.push(o);if(o.name==='induction-day')signs.push(o);if(o.name==='induction-day-food')groups.push(o);if(o.name==='induction-bowl-food')bowl.push(o);if(o.name==='induction-day-bowl')dayBowls.push(o);if(o.name==='induction-day-rays')rays.push(o);if(o.name==='induction-day-landscape')landscapes.push(o)});assert.equal(caps.length,6);assert.equal(crowns.length,6);assert.equal(signs.length,6);assert.equal(groups.length,5);assert.equal(dayBowls.length,5);assert.equal(rays.length,6);assert.equal(landscapes.length,6);
 for(let i=0;i<5;i++)for(const seed of groups[i].children)assert.ok(Math.hypot(seed.position.x-dayBowls[i].position.x,seed.position.z-dayBowls[i].position.z)<.19,'food stays within its day bowl');
 for(let day=0;day<=6;day++){
  if(day)state=act(state,'step');view.setInteraction(state);
  assert.equal(groups.filter(g=>g.children.every(o=>o.visible)).length,Math.min(day,5));assert.equal(bowl.some(o=>o.visible),day>0&&day<6);
  assert.equal(rays.filter(o=>o.visible).length,Math.min(day,5));assert.equal(rays[5].visible,false);
  assert.equal(landscapes.filter(o=>o.visible).length,Math.min(day,5));assert.equal(landscapes[5].visible,false);
  assert.equal(caps[5].material.color.getHex(),day===6?0xa45d50:0x9aa89a);
  crowns.forEach((c,i)=>assert.equal(c.material.color.getHex(),signs[i].material.color.getHex()));
 }
 state=act(state,'reset');view.setInteraction(state);assert.ok(groups.every(g=>g.children.every(o=>!o.visible)));assert.ok(bowl.every(o=>!o.visible));view.dispose();assert.equal(scene.children.length,0);
});

test('hen wing feathers stay close to the supporting folded wing',()=>{
 const id='induction',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),hen=scene.getObjectByName('induction-hen'),wings=[],feathers=[];hen.traverse(o=>{if(o.name==='bird-folded-wing')wings.push(o);if(o.name==='induction-hen-wing-feather')feathers.push(o)});assert.equal(wings.length,2);assert.equal(feathers.length,36);scene.updateMatrixWorld(true);
 for(const feather of feathers){const p=feather.geometry.getAttribute('position'),side=Math.sign(p.getZ(0)),wing=wings.find(o=>Math.sign(o.position.z)===side);for(let i=0;i<p.count;i++){const point=new THREE.Vector3().fromBufferAttribute(p,i),origin=hen.localToWorld(new THREE.Vector3(point.x,point.y,side)),direction=new THREE.Vector3(0,0,-side).transformDirection(hen.matrixWorld),hit=new THREE.Raycaster(origin,direction).intersectObject(wing)[0];assert.ok(hit,'feather overlies the folded wing');assert.ok(hit.point.distanceTo(hen.localToWorld(point))<.035,'feather does not float away from the wing')}}view.dispose();
});

test('induction shelter has a clear opening to its recessed back wall',()=>{
 const id='induction',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),shelter=scene.getObjectByName('induction-shelter');assert.ok(shelter);scene.updateMatrixWorld(true);
 const origin=shelter.localToWorld(new THREE.Vector3(0,.55,.5)),direction=new THREE.Vector3(0,0,-1).transformDirection(shelter.matrixWorld),hits=new THREE.Raycaster(origin,direction).intersectObject(shelter,true);assert.ok(hits.length);assert.equal(hits[0].object.name,'induction-shelter-wall');const point=shelter.worldToLocal(hits[0].point.clone());assert.ok(point.z<-.19,'the first surface is the recessed back, not a panel across the opening');view.dispose();
});

test('induction shelter lantern stays clear of the hen and independent of days',()=>{
 const id='induction',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),lantern=scene.getObjectByName('induction-shelter-lantern'),hen=scene.getObjectByName('induction-hen'),glass=scene.getObjectByName('induction-lantern-glass');assert.ok(lantern&&glass);let state=createModel(id);const color=glass.material.color.getHex();for(let i=0;i<7;i++){view.setInteraction(state);view.update(0,.5);scene.updateMatrixWorld(true);assert.equal(glass.material.color.getHex(),color);assert.ok(!new THREE.Box3().setFromObject(lantern,true).intersectsBox(new THREE.Box3().setFromObject(hen,true)));state=act(state,'step')}view.dispose();
});

test('induction hen clears the bowl and shelter',()=>{
 const scene=new THREE.Scene(),view=builders.induction(scene,concepts.find(c=>c.id==='induction'));scene.updateMatrixWorld(true);const hen=new THREE.Box3().setFromObject(scene.getObjectByName('induction-hen'),true);for(const name of ['induction-main-bowl','induction-shelter'])assert.ok(!hen.intersectsBox(new THREE.Box3().setFromObject(scene.getObjectByName(name),true)),`hen overlaps ${name}`);view.dispose();
});

test('hay bale remains grounded and separate from the gate as days advance',()=>{
 const id='induction',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),bale=scene.getObjectByName('induction-hay-bale'),bindings=[],gate=[];scene.traverse(o=>{if(o.name==='induction-hay-binding')bindings.push(o);if(o.name==='induction-gate')gate.push(o)});assert.equal(bindings.length,2);let state=createModel(id,()=>.5);
 for(let i=0;i<7;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(bale,true);assert.ok(Math.abs(bounds.min.y)<1e-6);for(const slat of gate)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(slat,true)));state=act(state,'step')}view.dispose();
});

test('schedule background plant stays clear and independent of the mode',()=>{
 const id='schedules',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),plant=scene.getObjectByName('schedule-background-plant'),shells=[];scene.traverse(o=>{if(o.name==='schedule-cabinet-crown-shell')shells.push(o)});assert.ok(plant);assert.equal(shells.length,2);let state=createModel(id,()=>.5);for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(plant,true);assert.ok(Math.abs(bounds.min.y)<1e-6);for(const shell of shells)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(shell,true)));state=act(state,'mode')}view.dispose();
});

test('ratio scene shows current responses, active mode and earned rewards',()=>{
 const id='schedules',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),pegs=[],rewards=[];let state=createModel(id,()=>.999);
 scene.traverse(o=>{if(o.name==='schedule-progress')pegs.push(o);if(o.name==='schedule-reward')rewards.push(o)});
 const fr=scene.getObjectByName('schedule-mode-fr'),vr=scene.getObjectByName('schedule-mode-vr');
 const check=(progress,earned)=>{view.setInteraction(state);assert.equal(pegs.filter(p=>p.material.color.getHex()===0xe5ba70).length,progress);assert.equal(pegs.filter(p=>p.material.emissiveIntensity>0).length,progress);assert.equal([fr,vr].filter(lamp=>lamp.material.emissiveIntensity>0).length,1);assert.equal(rewards.filter(r=>r.visible).length,earned)};
 assert.equal(pegs.length,19);check(0,0);assert.equal(fr.material.color.getHex(),0xe8bc72);assert.equal(vr.material.color.getHex(),0x536259);
 for(let i=0;i<9;i++)state=act(state,'response');check(9,0);state=act(state,'response');check(0,1);
 state=act(state,'mode');check(0,0);assert.equal(fr.material.color.getHex(),0x536259);assert.equal(vr.material.color.getHex(),0xe8bc72);
 for(let i=0;i<12;i++)state=act(state,'response');check(12,0);for(let i=0;i<7;i++)state=act(state,'response');check(0,1);
 state=act(state,'reset');check(0,0);view.dispose();assert.equal(scene.children.length,0);
});

test('ratio display bezels align with the shared response markers',()=>{
 const id='schedules',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),markers=[],bezels=[];
 scene.traverse(o=>{if(o.name==='schedule-progress')markers.push(o);if(o.name==='schedule-progress-bezel')bezels.push(o)});assert.equal(markers.length,19);assert.equal(bezels.length,19);
 for(let i=0;i<19;i++){assert.equal(bezels[i].position.x,markers[i].position.x);assert.equal(bezels[i].position.y,markers[i].position.y)}
 const button=scene.getObjectByName('schedule-response'),ring=scene.getObjectByName('schedule-button-bezel');assert.equal(button.position.x,ring.position.x);assert.equal(button.position.z,ring.position.z);
 view.dispose();assert.equal(scene.children.length,0);
});

test('choice apparatus displays costs, visitor choices and remaining budget',()=>{
 const id='stimulation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));let state=createModel(id,()=>.5);
 const objects={};scene.traverse(o=>{if(o.name.startsWith('stimulation-'))(objects[o.name]??=[]).push(o)});
 const lit=name=>objects[name].filter(o=>o.material.color.getHex()===0xe5ba70).length;
 const visible=name=>objects[name].filter(o=>o.visible).length;
 const update=()=>view.setInteraction(state);update();assert.equal(lit('stimulation-cost'),4);assert.equal(visible('stimulation-budget'),12);assert.equal(visible('stimulation-food-choice'),0);
 state=act(state,'food');update();assert.equal(state.budget,9);assert.equal(visible('stimulation-budget'),9);assert.equal(lit('stimulation-food-counter'),1);assert.equal(visible('stimulation-food-choice'),1);
 state=act(state,'stimulate');update();assert.equal(visible('stimulation-budget'),8);assert.equal(lit('stimulation-stim-counter'),1);assert.notEqual(objects['stimulation-lever'][0].rotation.z,0);
 state=act(state,'condition');update();assert.equal(visible('stimulation-budget'),12);assert.equal(lit('stimulation-food-counter'),0);assert.equal(lit('stimulation-stim-counter'),0);assert.equal(visible('stimulation-food-choice'),0);
 const costs=objects['stimulation-cost'];assert.deepEqual(costs.map(o=>o.material.color.getHex()===0xe5ba70),[true,false,false,true,true,true]);
 for(let i=0;i<12;i++)state=act(state,'food');update();assert.equal(visible('stimulation-budget'),0);assert.equal(lit('stimulation-food-counter'),12);state=act(state,'stimulate');update();assert.equal(lit('stimulation-stim-counter'),0);
 view.dispose();assert.equal(scene.children.length,0);
});

test('choice scene panes and blank recorder do not overlap the animal',()=>{
 const id='stimulation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),rat=scene.getObjectByName('stimulation-rat'),panes=[];scene.traverse(o=>{if(o.name==='stimulation-side-pane')panes.push(o)});
 const roll=scene.getObjectByName('stimulation-blank-roll'),front=scene.getObjectByName('stimulation-front-pane');assert.equal(panes.length,2);assert.equal(panes[0].position.x,-panes[1].position.x);assert.equal(roll.children.length,0);assert.ok(front.material.transparent&&front.material.opacity<.1);scene.updateMatrixWorld(true);
 const animal=new THREE.Box3().setFromObject(rat);for(const piece of [...panes,front,roll])assert.equal(animal.intersectsBox(new THREE.Box3().setFromObject(piece)),false);
 view.dispose();assert.equal(scene.children.length,0);
});

test('rat tail stays clear of the budget display',()=>{
 const scene=new THREE.Scene(),view=builders.stimulation(scene,concepts.find(c=>c.id==='stimulation')),tail=scene.getObjectByName('stimulation-rat-tail'),budget=new THREE.Box3().setFromObject(scene.getObjectByName('stimulation-budget-base'),true);scene.updateMatrixWorld(true);budget.expandByScalar(.045);for(let i=0;i<=100;i++){const point=tail.localToWorld(tail.geometry.parameters.path.getPoint(i/100));assert.ok(!budget.containsPoint(point),`tail contacts display at ${i/100}`)}view.dispose();
});

test('laboratory supply shelf stays outside the enclosure and clear of the animal',()=>{
 const id='stimulation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),shelf=scene.getObjectByName('stimulation-supply-shelf'),rat=scene.getObjectByName('stimulation-rat');assert.ok(shelf&&rat);scene.updateMatrixWorld(true);
 const shelfBounds=new THREE.Box3().setFromObject(shelf,true),ratBounds=new THREE.Box3().setFromObject(rat,true);assert.ok(!shelfBounds.intersectsBox(ratBounds));assert.ok(shelfBounds.min.x>3.86);assert.ok(Math.hypot(shelfBounds.max.x,Math.max(Math.abs(shelfBounds.min.z),Math.abs(shelfBounds.max.z)))<5.15);
 const top=shelf.localToWorld(new THREE.Vector3(0,2.6,0)).y;for(const name of ['stimulation-supply-flask','stimulation-supply-pot'])assert.ok(Math.abs(new THREE.Box3().setFromObject(scene.getObjectByName(name),true).min.y-top)<1e-6);
 view.dispose();
});

test('twin population markers agree with the synthetic count for every condition',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),markers=[],homes=[];
 scene.traverse(o=>{if(o.name==='twin-pair-marker')markers.push(o);if(o.name==='twin-garden-home')homes.push(o)});
 const urban=scene.getObjectByName('twin-urban-home'),example=scene.getObjectByName('twin-example-indicator');
 assert.equal(markers.length,16);assert.equal(homes.length,2);assert.ok(homes[1].getObjectByName('twin-garden-porch'));assert.ok(urban.getObjectByName('twin-urban-awning'));
 for(let group=0;group<3;group++)for(let environment=0;environment<2;environment++)for(let zygosity=0;zygosity<2;zygosity++){
  const state={...createModel(id),group,environment,zygosity};view.setInteraction(state);
  const count=syntheticTwinCount(state);assert.equal(markers.filter(m=>m.material.color.getHex()===0xe1bb77).length,count*2);
  assert.match(interactivePresentation(state,'en').visual,new RegExp(`similar ${count}/8`));assert.equal(homes[1].visible,!environment);assert.equal(urban.visible,!!environment);
 }
 let state=createModel(id);view.setInteraction(state);const before=example.material.color.getHex();state=act(state,'compare');view.setInteraction(state);assert.notEqual(example.material.color.getHex(),before);
 view.dispose();assert.equal(scene.children.length,0);
});

test('twin garden roof details follow their homes and figures rest on their platforms',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),roofs=[],people=[];scene.traverse(o=>{if(o.name==='twin-garden-roof')roofs.push(o);if(o.name==='twin-person')people.push(o)});
 assert.equal(roofs.length,2);assert.equal(people.length,2);for(const roof of roofs){const tiles=roof.children.filter(o=>o.name==='twin-garden-roof-tile');assert.equal(tiles.length,60);for(const tile of tiles){const expected=.375-Math.abs(tile.position.x)*.75/1.23;assert.ok(Math.abs(tile.position.y-expected-.024)<1e-6);assert.ok(Math.abs(tile.position.z)<.54)}assert.ok(roof.getObjectByName('twin-cottage-gable'));assert.ok(roof.getObjectByName('twin-attic-window'))}
 scene.updateMatrixWorld(true);for(const person of people)assert.ok(Math.abs(new THREE.Box3().setFromObject(person,true).min.y-.125)<1e-6);
 let state=createModel(id);view.setInteraction(state);assert.equal(roofs[1].parent.visible,true);state=act(state,'environment');view.setInteraction(state);assert.equal(roofs[1].parent.visible,false);
 view.dispose();assert.equal(scene.children.length,0);
});

test('seated twin figures keep hands connected to their forearms',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),people=[];scene.traverse(o=>{if(o.name==='twin-person')people.push(o)});scene.updateMatrixWorld(true);
 assert.equal(people.length,2);for(const person of people){const arms=person.children.filter(o=>o.name==='twin-forearm'),hands=person.children.filter(o=>o.name==='twin-hand');assert.equal(arms.length,2);assert.equal(hands.length,2);for(let i=0;i<2;i++){const end=arms[i].localToWorld(new THREE.Vector3(0,arms[i].geometry.parameters.height/2,0));assert.ok(end.distanceTo(hands[i].getWorldPosition(new THREE.Vector3()))<1e-6)}}view.dispose();
});

test('urban awning and balcony planters follow the selected environment',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),home=scene.getObjectByName('twin-urban-home'),awning=scene.getObjectByName('twin-urban-awning'),planters=[];home.traverse(o=>{if(o.name==='twin-urban-planter')planters.push(o)});assert.equal(awning.children.length,4);assert.equal(planters.length,2);for(const planter of planters)assert.ok(Math.abs(planter.position.y-.08-1.15)<1e-9);
 let state=createModel(id);view.setInteraction(state);assert.equal(home.visible,false);state=act(state,'environment');view.setInteraction(state);assert.equal(home.visible,true);state=act(state,'environment');view.setInteraction(state);assert.equal(home.visible,false);view.dispose();
});

test('twin garden beds and urban paving follow the selected home without blocking the figures',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),homes=[],people=[],beds=[];let urban;
 scene.traverse(o=>{if(o.name==='twin-garden-home')homes.push(o);if(o.name==='twin-urban-home')urban=o;if(o.name==='twin-person')people.push(o);if(o.name==='twin-garden-bed')beds.push(o)});scene.updateMatrixWorld(true);
 assert.equal(homes.length,2);assert.equal(beds.length,4);assert.ok(urban.getObjectByName('twin-urban-lantern'));assert.equal(people.length,2);
 for(const bed of beds)for(const person of people)assert.ok(!new THREE.Box3().setFromObject(bed,true).intersectsBox(new THREE.Box3().setFromObject(person,true)));
 let state=createModel(id);view.setInteraction(state);assert.equal(homes[1].visible,true);assert.equal(urban.visible,false);state=act(state,'environment');view.setInteraction(state);assert.equal(homes[1].visible,false);assert.equal(urban.visible,true);
 const lantern=new THREE.Box3().setFromObject(urban.getObjectByName('twin-urban-lantern'),true);for(const person of people)assert.ok(!lantern.intersectsBox(new THREE.Box3().setFromObject(person,true)));view.dispose();
});

test('shared courtyard wall stays grounded and clear in both argument frames',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),wall=scene.getObjectByName('argument-courtyard-wall'),others=[];scene.traverse(o=>{if(['argument-person','argument-tabletop','argument-background-tree'].includes(o.name))others.push(o)});assert.equal(wall.children.length,20);let state=createMetaphorModel(id);for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(wall,true);assert.ok(Math.abs(bounds.min.y)<1e-6);for(const other of others)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(other,true)));assert.ok(wall.children.every(o=>o.visible));state=metaphorAct(state,'frame')}view.dispose();
});

test('argument frames switch the tabletop illustration and example detail',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id));let state=createMetaphorModel(id);
 const war=scene.getObjectByName('argument-war-board'),drawing=scene.getObjectByName('argument-shared-drawing'),revision=scene.getObjectByName('argument-revision');
 const meshes=g=>{const result=[];g.traverse(o=>{if(o.isMesh)result.push(o)});return result};
 view.setInteraction(state);assert.ok(meshes(war).every(o=>o.visible));assert.ok(meshes(drawing).every(o=>!o.visible));
 const before=snapshot(scene);state=metaphorAct(state,'example');view.setInteraction(state);assert.notEqual(snapshot(scene),before);
 state=metaphorAct(state,'frame');view.setInteraction(state);assert.ok(meshes(war).every(o=>!o.visible));assert.ok(meshes(drawing).every(o=>o.visible));assert.equal(revision.visible,true);
 state=metaphorAct(state,'example');view.setInteraction(state);assert.equal(revision.visible,false);state=metaphorAct(state,'reset');view.setInteraction(state);assert.ok(meshes(war).every(o=>o.visible));assert.ok(meshes(drawing).every(o=>!o.visible));
 view.dispose();assert.equal(scene.children.length,0);
});

test('drawing pencils connect each participant to the shared sheet',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),people=[],pencils=[];scene.traverse(o=>{if(o.name==='argument-person')people.push(o);if(o.name==='argument-drawing-pencil')pencils.push(o)});assert.equal(people.length,2);assert.equal(pencils.length,2);scene.updateMatrixWorld(true);
 for(const pencil of pencils){const end=pencil.localToWorld(new THREE.Vector3(0,-pencil.geometry.parameters.height/2,0)),distances=people.map(person=>end.distanceTo(person.children.find(o=>o.name==='argument-hand').getWorldPosition(new THREE.Vector3())));assert.ok(Math.min(...distances)<.01)}view.dispose();
});

test('argument participants keep their hands connected to their forearms',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),people=[];scene.traverse(o=>{if(o.name==='argument-person')people.push(o)});assert.equal(people.length,2);scene.updateMatrixWorld(true);
 const tabletop=new THREE.Box3().setFromObject(scene.getObjectByName('argument-tabletop'),true);
 for(const person of people){const arms=person.children.filter(o=>o.name==='argument-forearm'),hands=person.children.filter(o=>o.name==='argument-hand');assert.equal(arms.length,2);assert.equal(hands.length,2);for(let i=0;i<2;i++)assert.ok(new THREE.Box3().setFromObject(arms[i]).intersectsBox(new THREE.Box3().setFromObject(hands[i],true)));const resting=new THREE.Box3().setFromObject(hands[0],true);assert.ok(Math.abs(resting.min.y-tabletop.max.y)<.002);assert.ok(resting.max.x>tabletop.min.x&&resting.min.x<tabletop.max.x);assert.ok(hands[1].position.y>hands[0].position.y)}
 view.dispose();assert.equal(scene.children.length,0);
});

test('argument drapes remain above the shoes and clear of the table in both frames',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),people=[];scene.traverse(o=>{if(o.name==='argument-person')people.push(o)});let state=createMetaphorModel(id);assert.equal(people.length,2);
 for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const table=new THREE.Box3().setFromObject(scene.getObjectByName('argument-tabletop'),true);for(const person of people){const cloth=person.getObjectByName('argument-lap-drape'),shoes=person.children.filter(o=>o.name==='argument-shoe'),bounds=new THREE.Box3().setFromObject(cloth,true);assert.ok(!bounds.intersectsBox(table));for(const shoe of shoes)assert.ok(new THREE.Box3().setFromObject(shoe,true).max.y<bounds.min.y)}state=metaphorAct(state,'frame')}view.dispose();
});

test('orientation indicator follows the selected direction and example without changing the traveler',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),up=[],down=[];let state=createMetaphorModel(id);
 scene.traverse(o=>{if(o.name==='emotion-up-step')up.push(o);if(o.name==='emotion-down-step')down.push(o)});
 const marker=scene.getObjectByName('emotion-path-marker'),halo=scene.getObjectByName('emotion-path-halo'),traveler=scene.getObjectByName('emotion-traveler');
 const verify=(steps,index)=>{view.setInteraction(state);assert.equal(marker.position.x,steps[index].position.x);assert.equal(marker.position.z,steps[index].position.z);assert.ok(Math.abs(marker.position.y-(steps[index].geometry.parameters.height+.16))<1e-9);assert.equal(halo.position.x,marker.position.x);assert.equal(halo.position.z,marker.position.z);assert.deepEqual(traveler.scale.toArray(),[1,1,1])};
 verify(up,1);state=metaphorAct(state,'example');verify(up,3);state=metaphorAct(state,'frame');verify(down,3);state=metaphorAct(state,'example');verify(down,1);state=metaphorAct(state,'reset');verify(up,1);
 view.dispose();assert.equal(scene.children.length,0);
});

test('orientation grotto has a recessed back and a connected watercourse',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),root=scene.getObjectByName('study-emotion-orientation'),back=scene.getObjectByName('emotion-cave'),shell=scene.getObjectByName('emotion-cave-inner-shell'),fall=scene.getObjectByName('emotion-waterfall'),water=scene.getObjectByName('emotion-stream');let state=createMetaphorModel(id);
 for(let frame=0;frame<2;frame++){view.setInteraction(state);scene.updateMatrixWorld(true);const ray=new THREE.Raycaster(root.localToWorld(new THREE.Vector3(3.45,1.1,1)),new THREE.Vector3(0,0,-1).transformDirection(root.matrixWorld)),hits=ray.intersectObjects([shell,back]);assert.ok(hits.length);assert.equal(hits[0].object,back);assert.ok(Math.abs(root.worldToLocal(hits[0].point.clone()).z+.28)<1e-6);const streamBounds=new THREE.Box3().setFromObject(water,true),fallBounds=new THREE.Box3().setFromObject(fall,true);assert.ok(streamBounds.min.z<=fallBounds.max.z&&streamBounds.max.z>=fallBounds.min.z);state=metaphorAct(state,'frame')}view.dispose();
});

test('cave outcrops clear the water and changing path marker',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),rocks=[],waterfall=scene.getObjectByName('emotion-waterfall'),stream=scene.getObjectByName('emotion-stream'),marker=scene.getObjectByName('emotion-path-marker');scene.traverse(o=>{if(o.name==='emotion-cave-outcrop')rocks.push(o)});assert.equal(rocks.length,5);let state=createMetaphorModel(id);
 for(let frame=0;frame<2;frame++){for(let example=0;example<2;example++){view.setInteraction(state);scene.updateMatrixWorld(true);for(const rock of rocks){const b=new THREE.Box3().setFromObject(rock,true);for(const part of [waterfall,stream,marker])assert.ok(!b.intersectsBox(new THREE.Box3().setFromObject(part,true)))}state=metaphorAct(state,'example')}state=metaphorAct(state,'frame')}view.dispose();
});

test('orientation path trim clears the marker and the traveler stands on the approach',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),traveler=scene.getObjectByName('emotion-traveler'),entry=scene.getObjectByName('emotion-entry-arch'),marker=scene.getObjectByName('emotion-path-marker'),halo=scene.getObjectByName('emotion-path-halo'),trim=[];
 scene.traverse(o=>{if(o.name==='emotion-step-nosing')trim.push(o)});assert.equal(trim.length,10);scene.updateMatrixWorld(true);const landingTop=new THREE.Box3().setFromObject(scene.getObjectByName('emotion-entry-landing'),true).max.y;assert.ok(Math.abs(new THREE.Box3().setFromObject(traveler).min.y-landingTop)<1e-6);assert.equal(new THREE.Box3().setFromObject(entry).intersectsBox(new THREE.Box3().setFromObject(traveler)),false);
 let state=createMetaphorModel(id);for(let frame=0;frame<2;frame++)for(let example=0;example<2;example++){view.setInteraction({...state,frame,example});scene.updateMatrixWorld(true);for(const edge of trim){assert.equal(new THREE.Box3().setFromObject(edge).intersectsBox(new THREE.Box3().setFromObject(marker)),false);assert.equal(new THREE.Box3().setFromObject(edge).intersectsBox(new THREE.Box3().setFromObject(halo)),false)}}
 view.dispose();assert.equal(scene.children.length,0);
});

test('orientation traveler hands stay connected to the posed forearms',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),traveler=scene.getObjectByName('emotion-traveler'),hands=[],arms=[];
 traveler.traverse(o=>{if(o.name==='emotion-traveler-hand')hands.push(o);if(o.name==='emotion-traveler-forearm')arms.push(o)});assert.equal(hands.length,2);assert.equal(arms.length,2);
 for(let i=0;i<2;i++){const end=new THREE.Vector3(0,arms[i].geometry.parameters.height/2,0).applyQuaternion(arms[i].quaternion).add(arms[i].position);assert.ok(end.distanceTo(hands[i].position)<1e-6)}
 assert.ok(traveler.getObjectByName('emotion-traveler-cloak'));assert.ok(traveler.getObjectByName('emotion-traveler-bag'));view.dispose();
});

test('hillside shrubs meet the slope and clear the changing route marker',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),hill=scene.getObjectByName('emotion-upper-hillside'),shrubs=[],marker=scene.getObjectByName('emotion-path-marker');scene.traverse(o=>{if(o.name==='emotion-hillside-shrub')shrubs.push(o)});assert.equal(shrubs.length,4);scene.updateMatrixWorld(true);
 for(const shrub of shrubs){const origin=shrub.getWorldPosition(new THREE.Vector3()),hit=new THREE.Raycaster(origin.clone().add(new THREE.Vector3(0,2,0)),new THREE.Vector3(0,-1,0)).intersectObject(hill)[0];assert.ok(hit&&Math.abs(hit.point.y-origin.y)<.01)}const state=createMetaphorModel(id);for(let frame=0;frame<2;frame++)for(let example=0;example<2;example++){view.setInteraction({...state,frame,example});scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(marker,true);for(const shrub of shrubs)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(shrub,true)))}view.dispose();
});

test('middle hillside supports shrubs and clears both route markers',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),hill=scene.getObjectByName('emotion-middle-hillside'),shrubs=[],marker=scene.getObjectByName('emotion-path-marker');scene.traverse(o=>{if(o.name==='emotion-middle-hill-shrub')shrubs.push(o)});assert.equal(shrubs.length,4);scene.updateMatrixWorld(true);
 for(const shrub of shrubs){const origin=shrub.getWorldPosition(new THREE.Vector3()),hit=new THREE.Raycaster(origin.clone().add(new THREE.Vector3(0,2,0)),new THREE.Vector3(0,-1,0)).intersectObject(hill)[0];assert.ok(hit&&Math.abs(hit.point.y-origin.y)<.01)}
 const state=createMetaphorModel(id);for(let frame=0;frame<2;frame++)for(let example=0;example<2;example++){view.setInteraction({...state,frame,example});scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(marker,true);assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(hill,true)));for(const shrub of shrubs)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(shrub,true)))}view.dispose();
});

test('orientation pavilion detailing stays clear of the changing route marker',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),caps=[],courses=[],marker=scene.getObjectByName('emotion-path-marker');scene.traverse(o=>{if(o.name==='emotion-pavilion-column-cap')caps.push(o);if(o.name==='emotion-dome-course')courses.push(o)});assert.equal(caps.length,12);assert.equal(courses.length,3);
 const state=createMetaphorModel(id);for(let frame=0;frame<2;frame++)for(let example=0;example<2;example++){view.setInteraction({...state,frame,example});scene.updateMatrixWorld(true);const markerBounds=new THREE.Box3().setFromObject(marker,true);for(const detail of [...caps,...courses])assert.ok(!markerBounds.intersectsBox(new THREE.Box3().setFromObject(detail,true)))}view.dispose();
});

test('pavilion evergreens stand on the ground and clear the route indicator',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),trees=[],marker=scene.getObjectByName('emotion-path-marker');scene.traverse(o=>{if(o.name==='emotion-pavilion-evergreen')trees.push(o)});assert.equal(trees.length,3);let state=createMetaphorModel(id);
 for(let frame=0;frame<2;frame++){for(let example=0;example<2;example++){view.setInteraction(state);scene.updateMatrixWorld(true);const mark=new THREE.Box3().setFromObject(marker,true);for(const tree of trees){const b=new THREE.Box3().setFromObject(tree,true);assert.ok(Math.abs(b.min.y)<1e-6);assert.ok(!b.intersectsBox(mark))}state=metaphorAct(state,'example')}state=metaphorAct(state,'frame')}view.dispose();
});

test('language card crosses the wall opening on a supported tray',()=>{
 const id='language-wall',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),walls=[];scene.traverse(o=>{if(o.name==='language-wall-section')walls.push(o)});
 const note=scene.getObjectByName('language-description-card'),tray=scene.getObjectByName('language-message-tray');assert.equal(walls.length,4);let state=createModel(id,()=>.5);
 for(let i=0;i<2;i++){view.setInteraction(state);scene.updateMatrixWorld(true);const cardBounds=new THREE.Box3().setFromObject(note,true),trayBounds=new THREE.Box3().setFromObject(tray,true);assert.ok(cardBounds.min.x<0&&cardBounds.max.x>0);assert.ok(Math.abs(cardBounds.min.y-trayBounds.max.y)<1e-6);assert.ok(cardBounds.min.x>=trayBounds.min.x&&cardBounds.max.x<=trayBounds.max.x);for(const wall of walls)assert.ok(!cardBounds.intersectsBox(new THREE.Box3().setFromObject(wall,true)));state=act(state,'describe')}
 view.dispose();
});

test('pigeon toes and delivered pellets meet their supporting surfaces',()=>{
 const id='pigeon',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),toes=[],pellets=[],grain=[];scene.traverse(o=>{if(o.name==='pigeon-toe')toes.push(o);if(o.name==='pigeon-food-pellet')pellets.push(o);if(o.name==='pigeon-stored-grain')grain.push(o)});scene.updateMatrixWorld(true);
 const floor=new THREE.Box3().setFromObject(scene.getObjectByName('pigeon-floor'),true),tray=new THREE.Box3().setFromObject(scene.getObjectByName('pigeon-food-tray'),true);assert.equal(toes.length,6);assert.equal(pellets.length,6);assert.equal(grain.length,24);assert.ok(scene.getObjectByName('pigeon-storage-window'));
 for(const toe of toes)assert.ok(Math.abs(new THREE.Box3().setFromObject(toe,true).min.y-floor.max.y)<1e-6);
 for(const pellet of pellets){const b=new THREE.Box3().setFromObject(pellet,true);assert.ok(Math.abs(b.min.y-tray.max.y)<1e-6);assert.ok(b.min.x>=tray.min.x&&b.max.x<=tray.max.x&&b.min.z>=tray.min.z&&b.max.z<=tray.max.z)}
 for(let i=0;i<pellets.length;i++)for(let j=i+1;j<pellets.length;j++)assert.ok(pellets[i].position.distanceTo(pellets[j].position)>.15);
 let state=createModel(id,()=>.5);for(let i=0;i<3;i++){view.setInteraction(state);scene.updateMatrixWorld(true);for(const toe of toes)assert.ok(Math.abs(new THREE.Box3().setFromObject(toe,true).min.y-floor.max.y)<1e-6);state=act(state,'behavior')}view.setInteraction(state);assert.ok(grain.every(g=>g.visible));assert.ok(pellets.every(p=>!p.visible));
 view.dispose();
});

test('induction day markers and food sit on their supports',()=>{
 const id='induction',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),platforms=[],signs=[],bowls=[],groups=[],front=[],toes=[];scene.traverse(o=>{if(o.name==='induction-day-platform')platforms.push(o);if(o.name==='induction-day')signs.push(o);if(o.name==='induction-day-bowl')bowls.push(o);if(o.name==='induction-day-food')groups.push(o);if(o.name==='induction-bowl-food')front.push(o);if(o.name==='induction-hen-toe')toes.push(o)});scene.updateMatrixWorld(true);assert.equal(platforms.length,6);assert.equal(toes.length,6);
 for(let i=0;i<6;i++){const p=new THREE.Box3().setFromObject(platforms[i],true);assert.ok(Math.abs(p.min.y)<1e-6);assert.ok(Math.abs(new THREE.Box3().setFromObject(signs[i],true).min.y-p.max.y)<1e-6);if(i<5){const bowl=new THREE.Box3().setFromObject(bowls[i],true);assert.ok(Math.abs(bowl.min.y-p.max.y)<1e-6);for(const seed of groups[i].children)assert.ok(Math.abs(new THREE.Box3().setFromObject(seed,true).min.y-bowl.max.y)<1e-6)}}
 const main=new THREE.Box3().setFromObject(scene.getObjectByName('induction-main-bowl'),true);for(const seed of front){const bounds=new THREE.Box3().setFromObject(seed,true);assert.ok(Math.abs(bounds.min.y-.12)<1e-6);assert.ok(bounds.min.x>main.min.x&&bounds.max.x<main.max.x&&bounds.max.y>main.max.y)}for(const toe of toes)assert.ok(Math.abs(new THREE.Box3().setFromObject(toe,true).min.y)<1e-6);
 view.dispose();
});

test('schedule apparatus is grounded and earned markers rest in its tray',()=>{
 const id='schedules',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),rewards=[];scene.traverse(o=>{if(o.name==='schedule-reward')rewards.push(o)});scene.updateMatrixWorld(true);
 for(const name of ['schedule-progress-base','schedule-button-base','schedule-tray-base'])assert.ok(Math.abs(new THREE.Box3().setFromObject(scene.getObjectByName(name),true).min.y)<1e-6);
 const tray=new THREE.Box3().setFromObject(scene.getObjectByName('schedule-reward-tray'),true);for(const reward of rewards){const b=new THREE.Box3().setFromObject(reward,true);assert.ok(Math.abs(b.min.y-tray.max.y)<1e-6);assert.ok(b.min.x>=tray.min.x&&b.max.x<=tray.max.x&&b.min.z>=tray.min.z&&b.max.z<=tray.max.z)}
 let state=createModel(id,()=>.5);view.setInteraction(state);scene.updateMatrixWorld(true);const button=scene.getObjectByName('schedule-response'),buttonBase=new THREE.Box3().setFromObject(scene.getObjectByName('schedule-button-base'),true);assert.ok(Math.abs(new THREE.Box3().setFromObject(button,true).min.y-buttonBase.max.y)<1e-6);state=act(state,'response');view.setInteraction(state);assert.ok(button.position.y<.435);
 view.dispose();
});

test('schedule forecourt stones are supported by the earth bed',()=>{
 const id='schedules',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),ground=scene.getObjectByName('schedule-forecourt-ground'),stones=[];scene.traverse(o=>{if(o.name==='schedule-forecourt-stone')stones.push(o)});assert.ok(ground&&stones.length>10);scene.updateMatrixWorld(true);
 const top=new THREE.Box3().setFromObject(ground,true).max.y;for(const stone of stones){const bounds=new THREE.Box3().setFromObject(stone,true);assert.ok(Math.abs(bounds.min.y-top)<1e-6);assert.ok(bounds.max.y>top+.039);assert.ok(Math.hypot(Math.max(Math.abs(bounds.min.x),Math.abs(bounds.max.x)),bounds.max.z)<4.62)}view.dispose();
});

test('schedule cabinet ledges sit on their bases and clear the shared progress display',()=>{
 const id='schedules',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),ledges=[],rails=[],brackets=[];scene.traverse(o=>{if(o.name==='schedule-cabinet-ledge')ledges.push(o);if(o.name==='schedule-ledge-rail')rails.push(o);if(o.name==='schedule-ledge-bracket')brackets.push(o)});assert.equal(ledges.length,2);assert.equal(rails.length,2);assert.equal(brackets.length,4);scene.updateMatrixWorld(true);
 const progress=new THREE.Box3().setFromObject(scene.getObjectByName('schedule-progress-base'),true);for(const ledge of ledges){const b=new THREE.Box3().setFromObject(ledge,true);assert.ok(Math.abs(b.min.y-.4)<1e-6);assert.ok(!b.intersectsBox(progress))}for(const part of [...rails,...brackets])assert.ok(!new THREE.Box3().setFromObject(part,true).intersectsBox(progress));view.dispose();
});

test('preparation vessels stay outside the chamber and do not change with choices',()=>{
 const id='stimulation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),tray=scene.getObjectByName('stimulation-preparation-tray'),pane=scene.getObjectByName('stimulation-front-pane');assert.ok(tray?.getObjectByName('stimulation-empty-scoop'));let state=createModel(id,()=>.5);view.setInteraction(state);scene.updateMatrixWorld(true);
 const before=new THREE.Box3().setFromObject(tray,true),glass=new THREE.Box3().setFromObject(pane,true);assert.ok(Math.abs(before.min.y+.05)<1e-6);assert.ok(!before.intersectsBox(glass));state=act(state,'food');view.setInteraction(state);scene.updateMatrixWorld(true);assert.ok(before.equals(new THREE.Box3().setFromObject(tray,true)));view.dispose();
});

test('choice scene animal and state markers meet their supports',()=>{
 const id='stimulation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),feet=[],toes=[],food=[],budget=[];scene.traverse(o=>{if(o.name==='stimulation-rat-foot')feet.push(o);if(o.name==='stimulation-rat-toe')toes.push(o);if(o.name==='stimulation-food-choice')food.push(o);if(o.name==='stimulation-budget')budget.push(o)});scene.updateMatrixWorld(true);
 assert.equal(feet.length,4);assert.equal(toes.length,12);const floor=new THREE.Box3().setFromObject(scene.getObjectByName('stimulation-floor'),true),bowl=new THREE.Box3().setFromObject(scene.getObjectByName('stimulation-food-bowl'),true),base=new THREE.Box3().setFromObject(scene.getObjectByName('stimulation-budget-base'),true);
 const plate=new THREE.Box3().setFromObject(scene.getObjectByName('base'),true),front=new THREE.Box3().setFromObject(scene.getObjectByName('stimulation-front-pane'),true),tray=new THREE.Box3().setFromObject(scene.getObjectByName('stimulation-preparation-tray'),true);assert.ok(Math.abs(bowl.min.y-floor.max.y)<1e-6);assert.ok(Math.abs(base.min.y-plate.max.y)<1e-6);assert.ok(base.min.z>front.max.z&&!base.intersectsBox(tray));for(const part of [...feet,...toes])assert.ok(Math.abs(new THREE.Box3().setFromObject(part,true).min.y-floor.max.y)<1e-6);for(const pellet of food){const b=new THREE.Box3().setFromObject(pellet,true);assert.ok(Math.abs(b.min.y-.3)<1e-6);assert.ok(b.min.x>bowl.min.x&&b.max.x<bowl.max.x&&b.min.z>bowl.min.z&&b.max.z<bowl.max.z)}for(const token of budget)assert.ok(Math.abs(new THREE.Box3().setFromObject(token,true).min.y-base.max.y)<1e-6);
 view.dispose();
});

test('recorder roll is visible through the open housing and remains blank',()=>{
 const id='stimulation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),root=scene.children[0],roll=scene.getObjectByName('stimulation-blank-roll'),housing=scene.getObjectByName('stimulation-recorder-housing');assert.ok(roll&&housing);scene.updateMatrixWorld(true);
 const origin=root.localToWorld(new THREE.Vector3(4.18,.68,1.2)),direction=new THREE.Vector3(0,0,-1).transformDirection(root.matrixWorld),ray=new THREE.Raycaster(origin,direction);const surfaces=ray.intersectObjects([housing,roll],true);assert.ok(surfaces.length);assert.equal(surfaces[0].object,roll);assert.equal(roll.children.length,0);view.dispose();
});

test('garden soil detail stays on the bed in both examples and follows its frame',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),clods=[];scene.traverse(o=>{if(o.name==='time-soil-clods')clods.push(o)});assert.equal(clods.length,2);const matrix=new THREE.Matrix4(),point=new THREE.Vector3();for(const group of clods)for(let i=0;i<group.count;i++){group.getMatrixAt(i,matrix);point.setFromMatrixPosition(matrix);assert.ok(Math.abs(point.x)<2.475&&Math.abs(point.z)<.95);assert.ok(Math.abs(point.y-.442)<1e-5)}let state=createMetaphorModel(id);view.setInteraction(state);assert.ok(clods.every(o=>!o.visible));state=metaphorAct(state,'frame');view.setInteraction(state);assert.ok(clods.every(o=>o.visible));state=metaphorAct(state,'example');view.setInteraction(state);assert.ok(clods.every(o=>o.visible));state=metaphorAct(state,'frame');view.setInteraction(state);assert.ok(clods.every(o=>!o.visible));view.dispose();
});

test('twin homes and paired markers rest on their foundations',()=>{
 const id='twins',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),foundations=[],markers=[];scene.traverse(o=>{if(o.name==='twin-home-foundation')foundations.push(o);if(o.name==='twin-pair-marker')markers.push(o)});scene.updateMatrixWorld(true);assert.equal(foundations.length,3);assert.equal(markers.length,16);
 for(const f of foundations){const b=new THREE.Box3().setFromObject(f,true);assert.ok(Math.abs(b.min.y)<1e-6);assert.ok(Math.abs(b.max.y-.05)<1e-6)}
 const base=new THREE.Box3().setFromObject(scene.getObjectByName('twin-population-base'),true);assert.ok(Math.abs(base.min.y)<1e-6);for(const m of markers)assert.ok(Math.abs(new THREE.Box3().setFromObject(m,true).min.y-base.max.y)<1e-6);
 for(let i=0;i<markers.length;i+=2)assert.ok(markers[i].position.distanceTo(markers[i+1].position)>.14);
 let state=createModel(id);view.setInteraction(state);assert.equal(foundations[1].parent.visible,true);assert.equal(foundations[2].parent.visible,false);state=act(state,'environment');view.setInteraction(state);assert.equal(foundations[1].parent.visible,false);assert.equal(foundations[2].parent.visible,true);
 view.dispose();
});

test('argument furniture and both illustrations meet their supporting surfaces',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),parts=[],cups=[];scene.traverse(o=>{if(['argument-stool-leg','argument-shoe','argument-table-leg'].includes(o.name))parts.push(o);if(o.name==='argument-cup')cups.push(o)});scene.updateMatrixWorld(true);const floor=new THREE.Box3().setFromObject(scene.getObjectByName('argument-stage-floor'),true),table=new THREE.Box3().setFromObject(scene.getObjectByName('argument-tabletop'),true);
 assert.equal(parts.length,16);for(const p of parts)assert.ok(Math.abs(new THREE.Box3().setFromObject(p,true).min.y-floor.max.y)<1e-6);for(const p of [...cups,scene.getObjectByName('argument-board-base'),scene.getObjectByName('argument-drawing-sheet')])assert.ok(Math.abs(new THREE.Box3().setFromObject(p,true).min.y-table.max.y)<1e-6);
 view.dispose();
});

test('time money and garden elements rest on their supports in both frames',()=>{
 const id='time-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),coins=[],feet=[],sprouts=[];scene.traverse(o=>{if(o.name==='time-coin')coins.push(o);if(o.name==='time-gardener-foot')feet.push(o);if(o.name==='time-garden-sprout')sprouts.push(o)});let state=createMetaphorModel(id);view.setInteraction(state);scene.updateMatrixWorld(true);
 const desk=new THREE.Box3().setFromObject(scene.getObjectByName('time-money-desk'),true),base=new THREE.Box3().setFromObject(scene.getObjectByName('time-hourglass-base'),true),pot=new THREE.Box3().setFromObject(scene.getObjectByName('time-pencil-pot'),true);assert.ok(Math.abs(base.min.y-desk.max.y)<1e-6);assert.ok(Math.abs(pot.min.y-desk.max.y)<1e-6);for(const coin of coins.filter(c=>Math.abs(c.position.y-.835)<1e-6))assert.ok(Math.abs(new THREE.Box3().setFromObject(coin,true).min.y-desk.max.y)<1e-6);
 state=metaphorAct(state,'frame');view.setInteraction(state);scene.updateMatrixWorld(true);const bed=new THREE.Box3().setFromObject(scene.getObjectByName('time-garden-bed'),true),soil=new THREE.Box3().setFromObject(scene.getObjectByName('time-garden-soil'),true);assert.ok(Math.abs(bed.min.y)<1e-6);assert.equal(feet.length,2);for(const foot of feet)assert.ok(Math.abs(new THREE.Box3().setFromObject(foot,true).min.y)<1e-6);for(const sprout of sprouts)assert.ok(Math.abs(sprout.position.y-soil.max.y)<1e-6);
 view.dispose();
});

test('both orientation routes connect to the landing with sensible height changes',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),up=[],down=[],links=[];scene.traverse(o=>{if(o.name==='emotion-up-step')up.push(o);if(o.name==='emotion-down-step')down.push(o);if(o.name==='emotion-path-connector')links.push(o)});const landing=scene.getObjectByName('emotion-entry-landing');assert.equal(links.length,2);
 const top=o=>o.position.y+o.geometry.parameters.height/2,right=o=>o.position.x+o.geometry.parameters.width/2,left=o=>o.position.x-o.geometry.parameters.width/2;
 for(const [i,steps] of [up,down].entries()){const link=links[i];assert.ok(Math.abs(top(link)-top(landing))<1e-6);assert.ok(left(link)<=right(landing)+.001&&right(link)>=left(steps[0])-.001);assert.ok(Math.abs(top(steps[0])-top(link))<=.2);if(i===1)assert.ok(top(steps[0])<=top(link)+1e-6);for(let j=1;j<steps.length;j++)assert.ok(i===0?top(steps[j])>top(steps[j-1]):top(steps[j])<top(steps[j-1]))}view.dispose();
});

test('orientation landing masonry follows the landing surface in both frames',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),landing=scene.getObjectByName('emotion-entry-landing'),joints=scene.getObjectByName('emotion-landing-masonry'),p=joints.geometry.getAttribute('position');let state=createMetaphorModel(id);assert.ok(p.count>20);for(let i=0;i<p.count;i++){assert.ok(p.getX(i)>=-3.4&&p.getX(i)<=-.9);assert.ok(p.getY(i)>=0&&p.getY(i)<=.654);assert.ok(Math.abs(p.getY(i)-.653)<1e-5||Math.abs(p.getZ(i)-1.102)<1e-5)}for(let i=0;i<2;i++){view.setInteraction(state);assert.equal(joints.visible,true);assert.ok(Math.abs(landing.position.y+landing.geometry.parameters.height/2-.65)<1e-6);state=metaphorAct(state,'frame')}view.dispose();
});

test('raised orientation landing is reached by grounded, adjoining steps',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),steps=[];scene.traverse(o=>{if(o.name==='emotion-landing-approach-step')steps.push(o)});assert.equal(steps.length,4);const landing=scene.getObjectByName('emotion-entry-landing'),top=o=>o.position.y+o.geometry.parameters.height/2,near=o=>o.position.z-o.geometry.parameters.depth/2,far=o=>o.position.z+o.geometry.parameters.depth/2;
 assert.ok(Math.abs(top(landing)-top(steps[0])-.13)<1e-6);assert.ok(near(steps[0])<=landing.position.z+landing.geometry.parameters.depth/2+.01);for(let i=0;i<steps.length;i++){assert.ok(Math.abs(steps[i].position.y-steps[i].geometry.parameters.height/2)<1e-6);if(i) {assert.ok(Math.abs(top(steps[i-1])-top(steps[i])-.13)<1e-6);assert.ok(near(steps[i])<=far(steps[i-1])+.01)}}assert.ok(Math.abs(top(steps.at(-1))-.13)<1e-6);view.dispose();
});

test('orientation destinations connect the stairs and grounded water feature',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),steps=[];scene.traverse(o=>{if(o.name==='emotion-up-step')steps.push(o)});scene.updateMatrixWorld(true);
 const pond=new THREE.Box3().setFromObject(scene.getObjectByName('emotion-pool'),true),fall=new THREE.Box3().setFromObject(scene.getObjectByName('emotion-waterfall'),true),water=new THREE.Box3().setFromObject(scene.getObjectByName('emotion-stream'),true),landing=new THREE.Box3().setFromObject(scene.getObjectByName('emotion-pavilion-base'),true),last=new THREE.Box3().setFromObject(steps[4],true);
 assert.ok(Math.abs(pond.min.y)<1e-6);assert.ok(Math.abs(fall.min.y-pond.max.y)<1e-6);assert.ok(water.min.z<=fall.max.z&&water.max.z>=pond.min.z);assert.ok(Math.abs(water.min.y-pond.max.y)<1e-6);assert.ok(last.max.x>landing.min.x&&last.max.y<landing.max.y&&landing.max.y-last.max.y<.3);
 view.dispose();
});

test('argument chess setup rests on the board and its example moves one pawn',()=>{
 const id='argument-frames',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),squares=[],pieces=[];scene.traverse(o=>{if(o.name==='argument-board-square')squares.push(o);if(o.name==='argument-chess-piece')pieces.push(o)});assert.equal(squares.length,64);assert.equal(pieces.length,32);let state=createMetaphorModel(id);view.setInteraction(state);scene.updateMatrixWorld(true);
 const boardTop=new THREE.Box3().setFromObject(squares[0],true).max.y;for(const piece of pieces){const b=new THREE.Box3().setFromObject(piece,true);assert.ok(Math.abs(b.min.y-boardTop)<1e-6);assert.ok(Math.abs(piece.position.x)<=.7&&piece.position.z>=-.4&&piece.position.z<=.8)}
 const initial=pieces.map(p=>p.position.x);state=metaphorAct(state,'example');view.setInteraction(state);const moved=pieces.map((p,i)=>p.position.x-initial[i]).filter(d=>Math.abs(d)>1e-8);assert.equal(moved.length,1);assert.ok(Math.abs(moved[0]-.175)<1e-8);view.dispose();
});

test('cave rock masses leave the waterfall and route marker unobstructed',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),masses=[],fall=scene.getObjectByName('emotion-waterfall'),stream=scene.getObjectByName('emotion-stream'),marker=scene.getObjectByName('emotion-path-marker');scene.traverse(o=>{if(o.name==='emotion-cave-rock-mass')masses.push(o)});assert.equal(masses.length,3);let state=createMetaphorModel(id);
 for(let frame=0;frame<2;frame++){for(let example=0;example<2;example++){view.setInteraction(state);scene.updateMatrixWorld(true);for(const mass of masses){const b=new THREE.Box3().setFromObject(mass,true);for(const o of [fall,stream,marker])assert.ok(!b.intersectsBox(new THREE.Box3().setFromObject(o,true)))}state=metaphorAct(state,'example')}state=metaphorAct(state,'frame')}view.dispose();
});

test('autumn tree leaves the watercourse and active route marker clear',()=>{
 const id='emotion-orientation',scene=new THREE.Scene(),view=builders[id](scene,concepts.find(c=>c.id===id)),tree=scene.getObjectByName('emotion-autumn-tree'),parts=[],targets=['emotion-waterfall','emotion-stream','emotion-path-marker'].map(name=>scene.getObjectByName(name));tree.traverse(o=>{if(o.isMesh)parts.push(o)});assert.ok(parts.length>4);let state=createMetaphorModel(id);
 for(let frame=0;frame<2;frame++){for(let example=0;example<2;example++){view.setInteraction(state);scene.updateMatrixWorld(true);for(const part of parts){const bounds=new THREE.Box3().setFromObject(part,true);for(const target of targets)assert.ok(!bounds.intersectsBox(new THREE.Box3().setFromObject(target,true)))}state=metaphorAct(state,'example')}state=metaphorAct(state,'frame')}view.dispose();
});
