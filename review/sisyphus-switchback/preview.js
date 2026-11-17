import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {behind,cyclePosition,gaitFoot,height,outcrops,retainingWallGeometry,roadGeometry,roadHalfWidth,route,routeLength,tangent,terrainGeometry,terrainHeight} from './route.js';
import {sisyphusHandTarget} from '../../src/sisyphus-path.js';

const scene=new THREE.Scene();scene.background=new THREE.Color(0xddd6c7);
const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);camera.position.set(11,13,17);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;document.body.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.5,0);controls.update();
scene.add(new THREE.HemisphereLight(0xfff3dc,0x5e645b,2));const sun=new THREE.DirectionalLight(0xffdfb7,2);sun.position.set(-4,10,7);sun.castShadow=true;scene.add(sun);
// Keep the plinth top below the edge of the terrain to prevent coplanar flicker.
const base=new THREE.Mesh(new THREE.CylinderGeometry(5.35,5.55,.35,96),new THREE.MeshStandardMaterial({color:0x565e4c}));base.position.y=-.355;scene.add(base);
// Blend broken ridges into the terrain outside a protected road corridor.
const hill=new THREE.Mesh(terrainGeometry(),new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true}));hill.receiveShadow=false;scene.add(hill);
const rockGeometry=new THREE.DodecahedronGeometry(1,0),rockMaterials=[0x777d70,0x8b8172,0x646f65].map(color=>new THREE.MeshStandardMaterial({color,flatShading:true}));
outcrops.forEach(([x,z,sx,sy,sz],i)=>{const outcrop=new THREE.Mesh(rockGeometry,rockMaterials[i%3]);outcrop.scale.set(sx,sy,sz);outcrop.rotation.set(sy>.8?.3:.15,i*.87,.2*(i%2?1:-1));outcrop.position.set(x,terrainHeight(x,z)-sy*(sy>.8?.5:.18),z);outcrop.castShadow=true;scene.add(outcrop)});
// A gnarled olive tree anchors the lower approach, outside the walking corridor.
const olive=new THREE.Group();olive.position.set(-4.15,terrainHeight(-4.15,2.5),2.5);scene.add(olive);
const wood=new THREE.MeshStandardMaterial({color:0x675a45,roughness:1}),oliveLeaves=[0x687858,0x82906a,0x9c9c71].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}));
function branch(a,b,r){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),piece=new THREE.Mesh(new THREE.CylinderGeometry(r*.55,r,delta.length(),7),wood);piece.position.copy(start).add(end).multiplyScalar(.5);piece.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());piece.castShadow=true;olive.add(piece)}
const trunk=[[0,0,0],[.1,.43,.02],[-.07,.85,0],[.04,1.22,.03],[-.08,1.57,0]];for(let i=0;i<trunk.length-1;i++)branch(trunk[i],trunk[i+1],.19-i*.035);
const tips=[];for(let i=0;i<17;i++){const a=i*2.399963,r=.45+.14*(i%4),base=trunk[2+i%3],mid=[Math.cos(a)*r*.57,1.48+(i%4)*.12,Math.sin(a)*r*.57],tip=[Math.cos(a)*r,1.74+(i%5)*.11,Math.sin(a)*r];branch(base,mid,.045);branch(mid,tip,.02);tips.push(tip)}
const leafGeometry=new THREE.SphereGeometry(1,7,5),leafDummy=new THREE.Object3D();for(let color=0;color<3;color++){const leaves=new THREE.InstancedMesh(leafGeometry,oliveLeaves[color],102);for(let i=0;i<102;i++){const index=i*3+color,tip=tips[index%tips.length],a=index*2.399963,r=.04+.18*((index*13)%19)/18;leafDummy.position.set(tip[0]+Math.cos(a)*r,tip[1]+.12*Math.sin(index*1.3),tip[2]+Math.sin(a)*r);leafDummy.rotation.set(.35*Math.sin(a),a,.55*Math.cos(a));leafDummy.scale.set(.12,.045,.06);leafDummy.updateMatrix();leaves.setMatrixAt(i,leafDummy.matrix)}leaves.computeBoundingSphere();leaves.castShadow=true;olive.add(leaves)}
const road=new THREE.Mesh(roadGeometry(),new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:1}));road.receiveShadow=true;scene.add(road);
const wall=new THREE.Mesh(retainingWallGeometry(),new THREE.MeshStandardMaterial({color:0x958572,side:THREE.DoubleSide}));wall.castShadow=true;wall.receiveShadow=true;scene.add(wall);
// Transverse joints divide the coping into individual stones.
{const vertices=[];for(let i=1;i<240;i+=2){const p=route(i/240),d=tangent(i/240);for(const side of [-1,1]){const points=[];for(const offset of [roadHalfWidth+.025,roadHalfWidth+.18]){const x=p.x-d.y*offset*side,z=p.z+d.x*offset*side;points.push(x,height(x,z)+.132,z)}vertices.push(...points)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));scene.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0x6f6558})))}
// Small rock and scrub clusters occupy only the terrain outside the movement corridor.
const routeSamples=Array.from({length:501},(_,i)=>route(i/500));
const scrubMaterials=[0x7e865a,0x9a9b66,0x6e7954].map(color=>new THREE.MeshStandardMaterial({color,flatShading:true}));
const scrubGeo=new THREE.DodecahedronGeometry(1,0),pebbleGeo=new THREE.DodecahedronGeometry(1,0);
for(let i=0;i<180;i++){
 const angle=i*2.399963,r=2.5+2.65*((i*47%181)/181),x=Math.cos(angle)*r,z=Math.sin(angle)*r;
 if(Math.hypot(x,z)>5.1||routeSamples.some(p=>Math.hypot(x-p.x,z-p.z)<1.28)||outcrops.some(([ox,oz])=>Math.hypot(x-ox,z-oz)<.55))continue;
 const y=terrainHeight(x,z),rock=i%3===0,m=new THREE.Mesh(rock?pebbleGeo:scrubGeo,rock?rockMaterials[i%3]:scrubMaterials[i%3]);
 const size=rock?.12+.04*(i%4):.14+.035*(i%4);m.position.set(x,y+size*.25,z);m.scale.set(size,size*(rock?.7:.5),size*.85);m.rotation.y=i*.7;m.castShadow=true;scene.add(m);
}
// Match the production asset and rolling convention; the proxy remains if loading fails.
const carrier=new THREE.Group();scene.add(carrier);const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(.83,1),new THREE.MeshStandardMaterial({color:0x8d7b68,flatShading:true}));rock.castShadow=true;carrier.add(rock);
new GLTFLoader().load('../../assets/moon_rock_02.glb',gltf=>{let loaded;gltf.scene.traverse(o=>{if(o.isMesh)loaded=o});if(loaded){rock.geometry.dispose();rock.geometry=loaded.geometry;[].concat(loaded.material||[]).forEach(m=>m.dispose())}});
// A simple articulated stand-in follows the route behind the rock, rather
// than extrapolating a straight tangent across a hairpin.
const actor=new THREE.Group();scene.add(actor);const skin=new THREE.MeshStandardMaterial({color:0xcaa483}),cloth=new THREE.MeshStandardMaterial({color:0xa75f4c});
const limbGeometry=new THREE.CylinderGeometry(.06,.08,1,10),jointGeometry=new THREE.SphereGeometry(.075,10,8);
function actorMesh(geometry,material){const m=new THREE.Mesh(geometry,material);m.castShadow=true;actor.add(m);return m}
const hairMaterial=new THREE.MeshStandardMaterial({color:0x51463c,roughness:1}),shoeMaterial=new THREE.MeshStandardMaterial({color:0x795844,roughness:1});
const torso=actorMesh(new THREE.CylinderGeometry(.16,.23,.6,12),skin),head=actorMesh(new THREE.SphereGeometry(.17,12,10),skin),hair=actorMesh(new THREE.SphereGeometry(.175,12,10),hairMaterial),skirt=actorMesh(new THREE.CylinderGeometry(.17,.25,.3,16),cloth),thighs=[actorMesh(limbGeometry,skin),actorMesh(limbGeometry,skin)],shins=[actorMesh(limbGeometry,skin),actorMesh(limbGeometry,skin)],knees=[actorMesh(jointGeometry,skin),actorMesh(jointGeometry,skin)],arms=[actorMesh(limbGeometry,skin),actorMesh(limbGeometry,skin)],forearms=[actorMesh(limbGeometry,skin),actorMesh(limbGeometry,skin)],feet=[actorMesh(jointGeometry,shoeMaterial),actorMesh(jointGeometry,shoeMaterial)],hands=[actorMesh(jointGeometry,skin),actorMesh(jointGeometry,skin)],elbows=[actorMesh(jointGeometry,skin),actorMesh(jointGeometry,skin)];
hair.scale.set(1,.48,1);for(const foot of feet)foot.scale.set(1.35,.55,.9);
function placeSegment(m,a,b){const delta=b.clone().sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());m.scale.y=delta.length()}
const started=performance.now();
function draw(){const {q,ascending}=cyclePosition((performance.now()-started)/1000),p=route(q),direction=tangent(q),yaw=Math.atan2(-direction.y,direction.x),roll=-q*12,c=Math.cos(yaw),s=Math.sin(yaw),cr=Math.cos(roll),sr=Math.sin(roll),vertices=rock.geometry.getAttribute('position');let support=-Infinity;
 for(let i=0;i<vertices.count;i++){const x=cr*vertices.getX(i)-sr*vertices.getY(i),y=sr*vertices.getX(i)+cr*vertices.getY(i),z=vertices.getZ(i),wx=p.x+c*x+s*z,wz=p.z-s*x+c*z;support=Math.max(support,height(wx,wz)+.04-y)}
 carrier.position.set(p.x,support,p.z);carrier.rotation.y=yaw;rock.rotation.z=roll;carrier.updateMatrixWorld(true);
 const body=behind(q,1.2),bodyDirection=tangent(q-1.2/routeLength),hip=body.clone().add(new THREE.Vector3(0,.48,0)),shoulder=body.clone().add(new THREE.Vector3(bodyDirection.x*.12,.98,bodyDirection.y*.12));placeSegment(torso,hip,shoulder);torso.scale.y/= .6;head.position.copy(shoulder).add(new THREE.Vector3(0,.21,0));hair.position.copy(head.position).add(new THREE.Vector3(0,.13,0));skirt.position.copy(hip).add(new THREE.Vector3(0,-.09,0));skirt.rotation.y=Math.atan2(bodyDirection.x,bodyDirection.y);
 for(let i=0;i<2;i++){const side=i?1:-1,foot=gaitFoot(q,side),shoulderSide=shoulder.clone().add(new THREE.Vector3(-bodyDirection.y*side*.12,0,bodyDirection.x*side*.12)),localShoulder=carrier.worldToLocal(shoulderSide.clone()),localHand=sisyphusHandTarget(rock.geometry,roll,new THREE.Vector3(),localShoulder),hand=carrier.localToWorld(localHand),elbow=shoulderSide.clone().lerp(hand,.52).add(new THREE.Vector3(0,-.1,0)),hipSide=hip.clone().add(new THREE.Vector3(-bodyDirection.y*side*.1,0,bodyDirection.x*side*.1)),knee=hipSide.clone().lerp(foot,.5).add(new THREE.Vector3(bodyDirection.x*.1,.055,bodyDirection.y*.1));feet[i].position.copy(foot);knees[i].position.copy(knee);hands[i].position.copy(hand);elbows[i].position.copy(elbow);placeSegment(thighs[i],hipSide,knee);placeSegment(shins[i],knee,foot);placeSegment(arms[i],shoulderSide,elbow);placeSegment(forearms[i],elbow,hand)}
 actor.visible=ascending;controls.update();renderer.render(scene,camera);requestAnimationFrame(draw)}draw();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
