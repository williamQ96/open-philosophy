// Switchback implementation used by the Sisyphus scene.
import * as THREE from 'three';
import {behind,cyclePosition,gaitFoot,height,outcrops,retainingWallGeometry,roadGeometry,roadHalfWidth,route,routeLength,tangent,terrainGeometry,terrainHeight} from './sisyphus-switchback-route.js';
import {sisyphusHandTarget} from './sisyphus-path.js';
import {applyBoulderAsset} from './boulder.js';
import {disposeSceneGraph} from './dispose-scene.js';
export function buildSisyphusSwitchback(scene,_concept,loadBoulder){
 const root=new THREE.Group();root.name='sisyphus-switchback';scene.add(root);
// Keep the plinth top below the edge of the terrain to prevent coplanar flicker.
const base=new THREE.Mesh(new THREE.CylinderGeometry(5.35,5.55,.35,96),new THREE.MeshStandardMaterial({color:0x565e4c}));base.position.y=-.355;root.add(base);
// Blend broken ridges into the terrain outside a protected road corridor.
function makeTerrainTexture(){const size=256,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4,grain=((x*31+y*47+x*y*3)%29)/28,vein=Math.pow(Math.max(0,Math.sin(x*.12+y*.085+1.5*Math.sin(y*.04))),12),tone=Math.round(248-9*grain-12*vein);data[i]=data[i+1]=data[i+2]=tone;data[i+3]=255}const texture=new THREE.DataTexture(data,size,size);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;return texture}
const hill=new THREE.Mesh(terrainGeometry(),new THREE.MeshStandardMaterial({vertexColors:true,map:makeTerrainTexture(),roughness:1,flatShading:true}));hill.name='switchback-hill';hill.receiveShadow=false;root.add(hill);
const rockGeometry=new THREE.DodecahedronGeometry(1,0),rockMaterials=[0x777d70,0x8b8172,0x646f65].map(color=>new THREE.MeshStandardMaterial({color,flatShading:true}));
outcrops.forEach(([x,z,sx,sy,sz],i)=>{const outcrop=new THREE.Mesh(rockGeometry,rockMaterials[i%3]);outcrop.scale.set(sx,sy,sz);outcrop.rotation.set(sy>.8?.3:.15,i*.87,.2*(i%2?1:-1));outcrop.position.set(x,terrainHeight(x,z)-sy*(sy>.8?.5:.18),z);outcrop.castShadow=true;root.add(outcrop)});
// A gnarled olive tree anchors the lower approach, outside the walking corridor.
const olive=new THREE.Group();olive.name='switchback-olive';olive.position.set(-3.8,terrainHeight(-3.8,2.3),2.3);root.add(olive);
const wood=new THREE.MeshStandardMaterial({color:0x675a45,roughness:1}),oliveLeaves=[0x687858,0x82906a,0x9c9c71].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}));
function branch(a,b,r){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),piece=new THREE.Mesh(new THREE.CylinderGeometry(r*.55,r,delta.length(),7),wood);piece.position.copy(start).add(end).multiplyScalar(.5);piece.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());piece.castShadow=true;olive.add(piece)}
const trunk=[[0,0,0],[.1,.43,.02],[-.07,.85,0],[.04,1.22,.03],[-.08,1.57,0]];for(let i=0;i<trunk.length-1;i++)branch(trunk[i],trunk[i+1],.19-i*.035);
const tips=[];for(let i=0;i<17;i++){const a=i*2.399963,r=.45+.14*(i%4),base=trunk[2+i%3],mid=[Math.cos(a)*r*.57,1.48+(i%4)*.12,Math.sin(a)*r*.57],tip=[Math.cos(a)*r,1.74+(i%5)*.11,Math.sin(a)*r];branch(base,mid,.045);branch(mid,tip,.02);tips.push(tip)}
const leafGeometry=new THREE.SphereGeometry(1,7,5),leafDummy=new THREE.Object3D();for(let color=0;color<3;color++){const leaves=new THREE.InstancedMesh(leafGeometry,oliveLeaves[color],102);for(let i=0;i<102;i++){const index=i*3+color,tip=tips[index%tips.length],a=index*2.399963,r=.04+.18*((index*13)%19)/18;leafDummy.position.set(tip[0]+Math.cos(a)*r,tip[1]+.12*Math.sin(index*1.3),tip[2]+Math.sin(a)*r);leafDummy.rotation.set(.35*Math.sin(a),a,.55*Math.cos(a));leafDummy.scale.set(.12,.045,.06);leafDummy.updateMatrix();leaves.setMatrixAt(i,leafDummy.matrix)}leaves.computeBoundingSphere();leaves.castShadow=true;olive.add(leaves)}
// A repeatable, world-aligned dirt texture provides fine aggregate without
// adding raised objects to the walking and rolling contact surface.
function makeRoadTexture(){const size=256,data=new Uint8Array(size*size*4);let seed=74621;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<size*size;i++){const grain=Math.floor(220+random()*28),n=i*4;data[n]=grain;data[n+1]=Math.max(0,grain-2);data[n+2]=Math.max(0,grain-5);data[n+3]=255}
 for(let i=0;i<220;i++){const cx=Math.floor(random()*size),cy=Math.floor(random()*size),rx=1+Math.floor(random()*4),ry=1+Math.floor(random()*2),tone=190+Math.floor(random()*38);for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){if((x*x)/(rx*rx)+(y*y)/(ry*ry)>1)continue;const px=(cx+x+size)%size,py=(cy+y+size)%size,n=(py*size+px)*4;data[n]=tone;data[n+1]=tone-3;data[n+2]=tone-7}}
 // Fine broken erosion marks remain in the texture, below the contact surface.
 for(let i=0;i<70;i++){const x0=Math.floor(random()*size),y0=Math.floor(random()*size),length=3+Math.floor(random()*11),slope=(random()-.5)*.8,tone=188+Math.floor(random()*28);for(let j=0;j<length;j++){if((j+i)%5===0)continue;const x=(x0+j)%size,y=(y0+Math.round(j*slope)+size)%size,n=(y*size+x)*4;data[n]=tone;data[n+1]=tone-3;data[n+2]=tone-7}}
 const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;return texture}
const roadTexture=makeRoadTexture(),road=new THREE.Mesh(roadGeometry(),new THREE.MeshStandardMaterial({vertexColors:true,map:roadTexture,side:THREE.DoubleSide,roughness:1}));road.name='switchback-road';road.receiveShadow=true;root.add(road);
const wall=new THREE.Mesh(retainingWallGeometry(),new THREE.MeshStandardMaterial({color:0x958572,side:THREE.DoubleSide}));wall.castShadow=true;wall.receiveShadow=true;root.add(wall);
// Joints continue down the exposed outside faces so the supporting walls read
// as masonry instead of a single smooth ribbon.
{const vertices=[],steps=180,offset=roadHalfWidth+.186;
 for(const side of [-1,1]){const points=[];for(let i=0;i<=steps;i++){const p=route(i/steps),d=tangent(i/steps),x=p.x-d.y*offset*side,z=p.z+d.x*offset*side,top=height(x,z)+.13,bottom=Math.min(height(x,z)-.10,terrainHeight(x,z)-.04);points.push({x,z,top,bottom,mid:(top+bottom)/2})}
  for(let i=0;i<steps;i++){const a=points[i],b=points[i+1];vertices.push(a.x,a.mid,a.z,b.x,b.mid,b.z);if(i%3===0)vertices.push(a.x,a.bottom,a.z,a.x,a.mid,a.z);if(i%3===1)vertices.push(a.x,a.mid,a.z,a.x,a.top,a.z)}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const joints=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0x72685a}));joints.name='switchback-wall-joints';root.add(joints);
}
// Transverse joints divide the coping into individual stones.
{const vertices=[];for(let i=1;i<240;i+=2){const p=route(i/240),d=tangent(i/240);for(const side of [-1,1]){const points=[];for(const offset of [roadHalfWidth+.025,roadHalfWidth+.18]){const x=p.x-d.y*offset*side,z=p.z+d.x*offset*side;points.push(x,height(x,z)+.132,z)}vertices.push(...points)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));root.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0x6f6558})))}
// Small rock and scrub clusters occupy only the terrain outside the movement corridor.
const routeSamples=Array.from({length:501},(_,i)=>route(i/500));
// Exposed, fractured stone fins give the outer slopes the larger geological
// structure of the concept while keeping the complete route unobstructed.
// Each fin is sunk into the terrain, with a tapered, irregular ridge rather
// than a separate floating boulder.
{
 const geometry=new THREE.BufferGeometry();
 const p=[-.5,0,-.45, .45,0,-.5, .52,0,.38, -.4,0,.5, -.34,1,-.2, .12,1.24,-.22, .28,.92,.13, -.2,.87,.3];
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
 geometry.setIndex([0,1,2,0,2,3,0,5,1,0,4,5,1,6,2,1,5,6,2,7,3,2,6,7,3,4,0,3,7,4,4,6,5,4,7,6]);geometry.computeVertexNormals();
 const materials=[0x66736d,0x778078,0x897f6f,0x697970].map(color=>new THREE.MeshStandardMaterial({color,roughness:1,flatShading:true}));
 let count=0;
 for(let i=0;i<500&&count<22;i++){
  const angle=i*2.399963,r=2.9+2.15*((i*83%499)/499),x=Math.cos(angle)*r,z=Math.sin(angle)*r;
  const width=.68+.2*((i*17)%7)/6;
  if(Math.hypot(x,z)>4.9||routeSamples.some(point=>Math.hypot(x-point.x,z-point.z)<roadHalfWidth+width+.22)||outcrops.some(([ox,oz,sx,,sz])=>Math.hypot(x-ox,z-oz)<Math.max(sx,sz)+width*.6)||Math.hypot(x+3.8,z-2.3)<1.05)continue;
  const fin=new THREE.Mesh(geometry,materials[count%materials.length]);fin.name='switchback-rock-fin';fin.position.set(x,terrainHeight(x,z)-.18,z);fin.rotation.y=angle+.28*Math.sin(i);fin.scale.set(width,.38+.35*((i*13)%11)/10,width*.85);fin.castShadow=true;fin.receiveShadow=true;root.add(fin);count++;
 }
}
const scrubMaterials=[0x7e865a,0x9a9b66,0x6e7954].map(color=>new THREE.MeshStandardMaterial({color,flatShading:true}));
const scrubGeo=new THREE.DodecahedronGeometry(1,0),pebbleGeo=new THREE.DodecahedronGeometry(1,0);
for(let i=0;i<180;i++){
 const angle=i*2.399963,r=2.5+2.65*((i*47%181)/181),x=Math.cos(angle)*r,z=Math.sin(angle)*r;
 if(Math.hypot(x,z)>5.1||routeSamples.some(p=>Math.hypot(x-p.x,z-p.z)<1.28)||outcrops.some(([ox,oz])=>Math.hypot(x-ox,z-oz)<.55))continue;
 const y=terrainHeight(x,z),rock=i%3===0,m=new THREE.Mesh(rock?pebbleGeo:scrubGeo,rock?rockMaterials[i%3]:scrubMaterials[i%3]);
 const size=rock?.12+.04*(i%4):.14+.035*(i%4);m.position.set(x,y+size*.25,z);m.scale.set(size,size*(rock?.7:.5),size*.85);m.rotation.y=i*.7;m.castShadow=true;root.add(m);
}
// Ground-cover tufts fill the otherwise bare slopes; their entire footprints
// remain beyond the retaining wall and the boulder's movement corridor.
{const clumps=[];for(let i=0;i<2400&&clumps.length<100;i++){const angle=i*2.399963,r=.5+4.5*((i*937%2399)/2399),x=Math.cos(angle)*r,z=Math.sin(angle)*r;
 if(routeSamples.some(p=>Math.hypot(x-p.x,z-p.z)<1.25)||outcrops.some(([ox,oz,sx,,sz])=>Math.hypot(x-ox,z-oz)<Math.max(sx,sz)+.2)||Math.hypot(x+3.8,z-2.3)<.55)continue;
 clumps.push({x,z,phase:i*.7});
 }
 const blades=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,5),new THREE.MeshStandardMaterial({color:0xffffff,flatShading:true}),clumps.length*5),dummy=new THREE.Object3D(),shades=[0x6e7b51,0x8b925e,0x9a9a68];blades.name='switchback-ground-cover';let index=0;
 for(const clump of clumps)for(let j=0;j<5;j++){const a=clump.phase+j*Math.PI*2/5,dx=Math.cos(a)*.065,dz=Math.sin(a)*.065,scale=.8+.1*(j%3),x=clump.x+dx,z=clump.z+dz;dummy.position.set(x,terrainHeight(x,z)+.10*scale,z);dummy.rotation.set(.25*Math.sin(a),a,-.25*Math.cos(a));dummy.scale.set(.055*scale,.23*scale,.035*scale);dummy.updateMatrix();blades.setMatrixAt(index,dummy.matrix);blades.setColorAt(index,new THREE.Color(shades[(index+j)%shades.length]));index++}
 blades.computeBoundingSphere();root.add(blades);
}
// Match the production asset and rolling convention; the proxy remains if loading fails.
const carrier=new THREE.Group();carrier.name='switchback-carrier';root.add(carrier);const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(.60,1),new THREE.MeshStandardMaterial({color:0x8d7b68,flatShading:true}));rock.name='switchback-boulder';rock.castShadow=true;carrier.add(rock);
let live=true;const delivered=new WeakSet(),handled={geometries:new WeakSet(),materials:new WeakSet()};if(loadBoulder)loadBoulder(asset=>{if(delivered.has(asset))return;delivered.add(asset);applyBoulderAsset(rock,asset,live,handled)});
// A simple articulated stand-in follows the route behind the rock, rather
// than extrapolating a straight tangent across a hairpin.
const actor=new THREE.Group();actor.name='switchback-actor';root.add(actor);const skin=new THREE.MeshStandardMaterial({color:0xcaa483}),cloth=new THREE.MeshStandardMaterial({color:0xa75f4c});
const upperArmGeometry=new THREE.CylinderGeometry(.065,.09,1,10),forearmGeometry=new THREE.CylinderGeometry(.05,.065,1,10),thighGeometry=new THREE.CylinderGeometry(.085,.11,1,10),shinGeometry=new THREE.CylinderGeometry(.06,.08,1,10),jointGeometry=new THREE.SphereGeometry(.075,10,8);
function actorMesh(geometry,material){const m=new THREE.Mesh(geometry,material);m.castShadow=true;actor.add(m);return m}
const hairMaterial=new THREE.MeshStandardMaterial({color:0x51463c,roughness:1}),shoeMaterial=new THREE.MeshStandardMaterial({color:0x795844,roughness:1});
const torso=actorMesh(new THREE.CylinderGeometry(.24,.18,.6,12),skin),head=actorMesh(new THREE.SphereGeometry(.17,12,10),skin),hair=actorMesh(new THREE.SphereGeometry(.175,12,10),hairMaterial),skirt=actorMesh(new THREE.CylinderGeometry(.18,.27,.3,16),cloth),thighs=[actorMesh(thighGeometry,skin),actorMesh(thighGeometry,skin)],shins=[actorMesh(shinGeometry,skin),actorMesh(shinGeometry,skin)],knees=[actorMesh(jointGeometry,skin),actorMesh(jointGeometry,skin)],arms=[actorMesh(upperArmGeometry,skin),actorMesh(upperArmGeometry,skin)],forearms=[actorMesh(forearmGeometry,skin),actorMesh(forearmGeometry,skin)],feet=[actorMesh(jointGeometry,shoeMaterial),actorMesh(jointGeometry,shoeMaterial)],hands=[actorMesh(jointGeometry,skin),actorMesh(jointGeometry,skin)],elbows=[actorMesh(jointGeometry,skin),actorMesh(jointGeometry,skin)];
torso.name='switchback-torso';head.name='switchback-head';for(const [parts,name] of [[arms,'upper-arm'],[forearms,'forearm'],[hands,'hand'],[elbows,'elbow'],[thighs,'thigh'],[shins,'shin'],[knees,'knee'],[feet,'foot']])for(const part of parts)part.name=`switchback-${name}`;
// Rounded shoulder joints follow the articulated upper arms and soften the
// otherwise cylindrical pushing silhouette.
const shoulderGeometry=new THREE.SphereGeometry(.105,10,8),shoulders=[actorMesh(shoulderGeometry,skin),actorMesh(shoulderGeometry,skin)];for(const shoulder of shoulders)shoulder.name='switchback-shoulder';const neck=actorMesh(new THREE.CylinderGeometry(.07,.085,1,10),skin);neck.name='switchback-neck';
head.scale.setScalar(1.1);hair.scale.set(1.1,.528,1.1);for(const foot of feet)foot.scale.set(1.35,.55,.9);
// The drape is separate from the moving limbs and rotates to face the road.
const drapeVertices=[],drapeFaces=[],drapeRows=8,drapeColumns=12;
for(let row=0;row<=drapeRows;row++){const t=row/drapeRows;for(let col=0;col<=drapeColumns;col++){const u=col/drapeColumns*2-1;drapeVertices.push(u*(.14+.10*t),.43-.51*t,.10-.31*t-.018*t*Math.cos(u*Math.PI*4));if(row<drapeRows&&col<drapeColumns){const n=row*(drapeColumns+1)+col;drapeFaces.push(n,n+1,n+drapeColumns+1,n+1,n+drapeColumns+2,n+drapeColumns+1)}}}
const drapeGeometry=new THREE.BufferGeometry();drapeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(drapeVertices,3));drapeGeometry.setIndex(drapeFaces);drapeGeometry.computeVertexNormals();const drapeMaterial=new THREE.MeshStandardMaterial({color:0xa75f4c,side:THREE.DoubleSide});const drape=actorMesh(drapeGeometry,drapeMaterial);drape.name='switchback-drape';
const hairCurlGeometry=new THREE.SphereGeometry(.025,7,5);for(let i=0;i<18;i++){const a=i*2.399963,r=.13*Math.sqrt((i+.5)/18),curl=new THREE.Mesh(hairCurlGeometry,hairMaterial);curl.position.set(Math.cos(a)*r,.12+Math.sqrt(Math.max(0,.024-r*r))*.3,Math.sin(a)*r);curl.scale.y=1.5;head.add(curl)}
const eyeGeometry=new THREE.SphereGeometry(.014,7,5);for(const side of [-1,1]){const eye=new THREE.Mesh(eyeGeometry,hairMaterial);eye.position.set(side*.06,.02,.158);head.add(eye);const ear=new THREE.Mesh(new THREE.SphereGeometry(.03,7,5),skin);ear.position.set(side*.17,0,0);ear.scale.set(.55,1,.8);head.add(ear)}
// Small carved facial volumes remain attached to the head through turns.
{const nose=new THREE.Mesh(new THREE.SphereGeometry(.032,8,6),skin);nose.position.set(0,-.025,.164);nose.scale.set(.7,1.2,1);nose.name='switchback-nose';head.add(nose);const beard=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),hairMaterial);beard.position.set(0,-.10,.068);beard.scale.set(.9,.7,.8);beard.name='switchback-beard';head.add(beard);for(const side of [-1,1]){const brow=new THREE.Mesh(new THREE.BoxGeometry(.055,.012,.012),hairMaterial);brow.position.set(side*.06,.054,.158);brow.rotation.z=-side*.12;brow.name='switchback-brow';head.add(brow)}}
for(const foot of feet){const strap=new THREE.Mesh(new THREE.BoxGeometry(.09,.018,.06),cloth);strap.position.set(0,.06,.025);foot.add(strap)}
function placeSegment(m,a,b){const delta=b.clone().sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());m.scale.y=delta.length()}
function update(t,value){const {q}=cyclePosition(t,1/(.045+value*.12)),p=route(q),direction=tangent(q),yaw=Math.atan2(-direction.y,direction.x),roll=-q*12,c=Math.cos(yaw),s=Math.sin(yaw),cr=Math.cos(roll),sr=Math.sin(roll),vertices=rock.geometry.getAttribute('position');let support=-Infinity;
 for(let i=0;i<vertices.count;i++){const x=cr*vertices.getX(i)-sr*vertices.getY(i),y=sr*vertices.getX(i)+cr*vertices.getY(i),z=vertices.getZ(i),wx=p.x+c*x+s*z,wz=p.z-s*x+c*z;support=Math.max(support,height(wx,wz)+.04-y)}
 carrier.position.set(p.x,support,p.z);carrier.rotation.y=yaw;rock.rotation.z=roll;carrier.updateMatrixWorld(true);
 const body=behind(q,1.2),bodyDirection=tangent(q-1.2/routeLength),hip=body.clone().add(new THREE.Vector3(0,.54,0)),shoulder=body.clone().add(new THREE.Vector3(bodyDirection.x*.4,1.05,bodyDirection.y*.4));placeSegment(torso,hip,shoulder);torso.scale.y/= .6;head.position.copy(shoulder).add(new THREE.Vector3(-bodyDirection.x*.1,.23,-bodyDirection.y*.1));placeSegment(neck,shoulder,head.position);head.rotation.y=Math.atan2(bodyDirection.x,bodyDirection.y);hair.position.copy(head.position).add(new THREE.Vector3(0,.143,0));skirt.position.copy(hip).add(new THREE.Vector3(0,-.09,0));skirt.rotation.y=head.rotation.y;drape.position.copy(hip);drape.rotation.y=head.rotation.y;
 for(let i=0;i<2;i++){const side=i?1:-1,foot=gaitFoot(q,side),shoulderSide=shoulder.clone().add(new THREE.Vector3(-bodyDirection.y*side*.12,0,bodyDirection.x*side*.12)),localShoulder=carrier.worldToLocal(shoulderSide.clone()),localHand=sisyphusHandTarget(rock.geometry,roll,new THREE.Vector3(),localShoulder),hand=carrier.localToWorld(localHand),elbow=shoulderSide.clone().lerp(hand,.52).add(new THREE.Vector3(0,-.1,0)),hipSide=hip.clone().add(new THREE.Vector3(-bodyDirection.y*side*.1,0,bodyDirection.x*side*.1)),knee=hipSide.clone().lerp(foot,.5).add(new THREE.Vector3(bodyDirection.x*.1,.055,bodyDirection.y*.1));shoulders[i].position.copy(shoulderSide);feet[i].position.copy(foot);knees[i].position.copy(knee);hands[i].position.copy(hand);elbows[i].position.copy(elbow);placeSegment(thighs[i],hipSide,knee);placeSegment(shins[i],knee,foot);placeSegment(arms[i],shoulderSide,elbow);placeSegment(forearms[i],elbow,hand)}
 // During the return the figure backs downhill while bracing the same rock;
 // retaining the pose prevents a disappearance or teleport at the turn.
 actor.visible=true;}

return {update,dispose(){live=false;scene.remove(root);disposeSceneGraph(root)}};
}
