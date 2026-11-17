import {buildInteractiveScene} from './interactive-scenes.js';
import {disposeSceneGraph} from './dispose-scene.js';
import * as THREE from 'three';
import {applyBoulderAsset} from './boulder.js';
import {sisyphusPath,sisyphusGround,sisyphusSupport,sisyphusHandTarget,sisyphusSurface,sisyphusGaitFoot} from './sisyphus-path.js';
import {buildSisyphusSwitchback} from './sisyphus-switchback.js';
import {addSceneDetails} from './scene-details.js';
import {enrichScene} from './scene-enrichment.js';
import {buildTrolley,buildVat,buildFreeWill,buildChineseRoom,buildSocratic,buildNewcomb,buildRecurrence,buildButterfly,buildMonkey} from './refined-scenes.js';
const mat=(color,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness});
function mesh(geo,material,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m}
function limb(a,b,r,material){const d=new THREE.Vector3().subVectors(b,a);const m=mesh(new THREE.CylinderGeometry(r,r,d.length(),8),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m}
export function buildSisyphus(scene,_concept,loadBoulder){
 const root=new THREE.Group(); scene.add(root);const stone=mat(0x988373), earth=mat(0x766c5c), dark=mat(0x41463e), figure=mat(0xd0aa88);
 const base=mesh(new THREE.CylinderGeometry(5.4,5.8,.4,64),dark,0,-.35,0);base.name='sisyphus-base';root.add(base);
 // Lift faceted ridges away from the motion corridor; the route keeps its analytic slope.
 const hillGeometry=new THREE.ConeGeometry(4.7,3.4,128,48),hillPositions=hillGeometry.getAttribute('position'),hillColors=[],hillRoute=Array.from({length:121},(_,i)=>sisyphusPath(i/120));
 for(let i=0;i<hillPositions.count;i++){
  const x=hillPositions.getX(i),y=hillPositions.getY(i),z=hillPositions.getZ(i),angle=Math.atan2(z,x),wx=Math.cos(.3)*x+Math.sin(.3)*z,wz=-Math.sin(.3)*x+Math.cos(.3)*z;let distance=Infinity;
  for(const p of hillRoute)distance=Math.min(distance,Math.hypot(wx-p.x,wz-p.z));
  // Long, broken ribs read as exposed rock rather than a smooth conical mound.
  // Fade every displacement before it reaches the shared movement corridor.
  const blend=THREE.MathUtils.smoothstep(distance,1.9,2.65);
  const ribs=Math.pow(Math.max(0,Math.cos(angle*9+.4*Math.sin(y*1.3))),6);
  const fractures=Math.abs(Math.sin(angle*17-y*2.3));
  const ridge=(.12+1.02*ribs+.23*fractures+.12*Math.abs(Math.sin(angle*5+y*2.1)))*blend;
  if(y> -1.699)hillPositions.setY(i,y+ridge);
  const bands=Math.sin(angle*7+y*2.4)+.45*Math.sin(angle*13-y*3.7),color=new THREE.Color(bands>.65?0x8a8171:bands<-.6?0x5f6b61:0x747a6b);color.lerp(new THREE.Color(0x59645b),ribs*blend*.3);hillColors.push(color.r,color.g,color.b);
 }
 hillGeometry.computeVertexNormals();
 hillGeometry.setAttribute('color',new THREE.Float32BufferAttribute(hillColors,3));earth.color.setHex(0xffffff);earth.vertexColors=true;earth.flatShading=true;
 const hill=mesh(hillGeometry,earth,0,1.25,0);hill.name='sisyphus-hill';hill.rotation.y=.3;root.add(hill);
 // A winding climbing path and the moving group use the same parameterized route.
 const route=sisyphusPath;
 const vertices=[],indices=[],colors=[],along=120,across=16;
 for(let i=0;i<=along;i++){const q=i/along,point=route(q),angle=.35+q*4.5;for(let j=0;j<=across;j++){
  const outer=Math.min(1.48,5.28-Math.hypot(point.x,point.z)),offset=-.9+j/across*(outer+.9),x=point.x+Math.sin(angle)*offset,z=point.z+Math.cos(angle)*offset,shoulder=THREE.MathUtils.clamp((offset-.9)/(outer-.9),0,1);
  vertices.push(x,sisyphusGround(x,z)+.08+.28*shoulder,z);
  // Subtle earth variation remains on the contact mesh, without loose raised pieces.
  const hash=Math.sin(i*127.1+j*311.7)*43758.5453,variation=.97+.025*(hash-Math.floor(hash)-.5),edge=THREE.MathUtils.smoothstep(Math.abs(offset),.48,1.05),color=new THREE.Color(0xb4a084).lerp(new THREE.Color(0x747a6b),edge).multiplyScalar(variation);colors.push(color.r,color.g,color.b);
  if(i<along&&j<across){const n=i*(across+1)+j;indices.push(n,n+1,n+across+1,n+1,n+across+2,n+across+1)}
 }}
 const pathGeometry=new THREE.BufferGeometry();pathGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));pathGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));pathGeometry.setIndex(indices);pathGeometry.computeVertexNormals();const pathMaterial=mat(0xffffff);pathMaterial.vertexColors=true;pathMaterial.side=THREE.DoubleSide;const pathMesh=mesh(pathGeometry,pathMaterial);pathMesh.name='sisyphus-path';root.add(pathMesh);
 const groundSurface=sisyphusSurface(pathGeometry);
 const moving=new THREE.Group();moving.name='sisyphus-motion';root.add(moving);const boulder=mesh(new THREE.IcosahedronGeometry(.83,1),stone,.65,.83,0);boulder.name='sisyphus-boulder';moving.add(boulder);
 let live=true;const delivered=new WeakSet(),handled={geometries:new WeakSet(),materials:new WeakSet()};if(loadBoulder)loadBoulder(asset=>{if(delivered.has(asset))return;delivered.add(asset);applyBoulderAsset(boulder,asset,live,handled)});
 const body=new THREE.Group();body.position.z=.35;moving.add(body);const cloth=mat(0xa75f4c),hair=mat(0x514337);body.add(mesh(new THREE.SphereGeometry(.18,16,12),figure,-.52,1.13,0));const headHair=mesh(new THREE.SphereGeometry(.17,12,8),hair,-.54,1.24,-.03);headHair.scale.y=.5;body.add(headHair);
 const v=(x,y,z)=>new THREE.Vector3(x,y,z);
 // Separate the leaning chest and waist from the drape so the pushing pose is legible.
 const torso=mesh(new THREE.SphereGeometry(1,20,14),figure,-.55,.75,0);torso.name='sisyphus-torso';torso.scale.set(.16,.30,.18);torso.rotation.z=-.47;body.add(torso);
 const sash=mesh(new THREE.TorusGeometry(.16,.032,8,28,Math.PI*1.12),cloth,-.56,.76,0);sash.name='sisyphus-sash';sash.rotation.set(.26,.24,-.47);sash.scale.set(1,1.75,1);body.add(sash);
 // A folded mantle connects the shoulder to the waist on the figure's back.
 const mantlePositions=[],mantleIndices=[],mantleRows=10,mantleCols=12;
 for(let row=0;row<=mantleRows;row++){const t=row/mantleRows,width=.13+.1*t;for(let col=0;col<=mantleCols;col++){const u=col/mantleCols*2-1,x=-.64-.19*t-.018*Math.cos(u*4*Math.PI)*t,y=.96-.48*t-.025*t*u,z=u*width;mantlePositions.push(x,y,z);if(row<mantleRows&&col<mantleCols){const n=row*(mantleCols+1)+col;mantleIndices.push(n,n+1,n+mantleCols+1,n+1,n+mantleCols+2,n+mantleCols+1)}}}
 const mantleGeometry=new THREE.BufferGeometry();mantleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(mantlePositions,3));mantleGeometry.setIndex(mantleIndices);mantleGeometry.computeVertexNormals();const mantle=mesh(mantleGeometry,cloth);mantle.material.side=THREE.DoubleSide;mantle.name='sisyphus-mantle';body.add(mantle);
 const segment=(radius)=>mesh(new THREE.CylinderGeometry(radius*.85,radius,1,10),figure);
 function placeSegment(part,a,b){const delta=b.clone().sub(a);part.position.copy(a).add(b).multiplyScalar(.5);part.quaternion.setFromUnitVectors(v(0,1,0),delta.clone().normalize());part.scale.y=delta.length()}
 const arms=[];for(const z of [-.12,.12]){const start=v(-.44,.92,z),upper=segment(.072),lower=segment(.056),elbow=mesh(new THREE.SphereGeometry(.066,10,8),figure),hand=mesh(new THREE.SphereGeometry(.06,8,6),figure);upper.name='sisyphus-upper-arm';lower.name='sisyphus-forearm';hand.name='sisyphus-hand';elbow.name='sisyphus-elbow';body.add(upper,lower,elbow,hand);arms.push({start,z,upper,lower,elbow,hand})}
 const legs=[];for(const [x,z] of [[-1,.17],[-.38,-.18]]){const start=v(-.7,.48,0),upper=segment(.09),lower=segment(.075),knee=mesh(new THREE.SphereGeometry(.08,10,8),figure),foot=mesh(new THREE.SphereGeometry(.1,10,8),hair,x,.05,z);upper.name='sisyphus-thigh';lower.name='sisyphus-shin';foot.name='sisyphus-foot';knee.name='sisyphus-knee';foot.scale.set(1.5,.45,.8);body.add(upper,lower,knee,foot);legs.push({start,x,z,upper,lower,knee,foot})}
 // A belted drape and shoulder details clarify the forward-leaning figure.
 const belt=mesh(new THREE.SphereGeometry(.15,12,8),hair,-.68,.5,0);belt.scale.set(1,.35,1.1);body.add(belt);for(const z of [-.13,.13])body.add(mesh(new THREE.SphereGeometry(.09,10,8),figure,-.45,.94,z));
 const folds=[],foldFaces=[],foldRows=8,foldColumns=24;for(let row=0;row<=foldRows;row++){const t=row/foldRows;for(let col=0;col<=foldColumns;col++){const a=col/foldColumns*Math.PI*2,r=.15+.09*t+.012*t*Math.cos(a*7);folds.push(r*Math.cos(a),.16-.32*t-.025*t*(.5+.5*Math.sin(a*2)),r*Math.sin(a));if(row<foldRows&&col<foldColumns){const n=row*(foldColumns+1)+col;foldFaces.push(n,n+1,n+foldColumns+1,n+1,n+foldColumns+2,n+foldColumns+1)}}}
 const skirtGeometry=new THREE.BufferGeometry();skirtGeometry.setAttribute('position',new THREE.Float32BufferAttribute(folds,3));skirtGeometry.setIndex(foldFaces);skirtGeometry.computeVertexNormals();const skirt=mesh(skirtGeometry,cloth,-.7,.38,0);skirt.name='sisyphus-draped-skirt';skirt.rotation.z=-.22;skirt.material.side=THREE.DoubleSide;body.add(skirt);
 for(const z of [-.16,.16]){const ear=mesh(new THREE.SphereGeometry(.045,10,8),figure,-.53,1.14,z);body.add(ear);const eye=mesh(new THREE.SphereGeometry(.018,8,6),hair,-.355,1.16,z*.5);body.add(eye)}
 for(const part of legs){const strap=mesh(new THREE.BoxGeometry(.13,.035,.13),cloth,.04,.05,0);strap.name='sisyphus-sandal-strap';part.foot.add(strap)}
 return {update(t,value){
  const cycle=(t*(.045+value*.12))%1,up=cycle<.8,q=up?cycle/.8:1-(cycle-.8)/.2;
  moving.position.copy(route(q));const ahead=route(Math.min(1,q+.002)),behind=route(Math.max(0,q-.002));moving.rotation.y=Math.atan2(-(ahead.z-behind.z),ahead.x-behind.x);
  const cy=Math.cos(moving.rotation.y),sy=Math.sin(moving.rotation.y),bx=moving.position.x+.65*cy,bz=moving.position.z-.65*sy;boulder.rotation.z=-q*12;boulder.position.y=sisyphusGround(bx,bz)-moving.position.y+sisyphusSupport(boulder.geometry,moving.rotation.y,boulder.rotation.z,bx,bz,groundSurface);
  for(const part of arms){const shoulder=part.start.clone().add(body.position),end=sisyphusHandTarget(boulder.geometry,boulder.rotation.z,boulder.position,shoulder).sub(body.position),joint=part.start.clone().lerp(end,.52).add(v(0,-.10,Math.sign(part.z)*.035));placeSegment(part.upper,part.start,joint);placeSegment(part.lower,joint,end);part.elbow.position.copy(joint);part.hand.position.copy(end)}
  // Keep a support foot at its path anchor while the other moves forward.
  for(const [index,part] of legs.entries()){const target=sisyphusGaitFoot(q,index?-1:1),dx=target.x-moving.position.x,dz=target.z-moving.position.z,footX=cy*dx-sy*dz,footZ=sy*dx+cy*dz-body.position.z,worldX=target.x,worldZ=target.z,vertices=part.foot.geometry.getAttribute('position');let support=-Infinity;
   for(let i=0;i<vertices.count;i++){const dx=vertices.getX(i)*part.foot.scale.x,dz=vertices.getZ(i)*part.foot.scale.z,dy=vertices.getY(i)*part.foot.scale.y;support=Math.max(support,groundSurface(worldX+cy*dx+sy*dz,worldZ-sy*dx+cy*dz)-moving.position.y-dy)}
   part.foot.position.set(footX,support+target.lift,footZ);const end=v(footX,part.foot.position.y+.04,footZ),joint=part.start.clone().lerp(end,.52).add(v(.10,.035,0));placeSegment(part.upper,part.start,joint);placeSegment(part.lower,joint,end);part.knee.position.copy(joint)
  }
  body.visible=up;
 },dispose(){live=false;scene.remove(root);dispose(root)}};
}
export function buildPanopticon(scene){
 const root=new THREE.Group();scene.add(root);
 const wall=mat(0xaaa090),dark=mat(0x3d4b46),gold=mat(0xc38c56),floor=mat(0xb2a38e),linen=mat(0xd8c9aa),wood=mat(0x705647),glass=new THREE.MeshStandardMaterial({color:0xe1c79e,transparent:true,opacity:.25,roughness:.28,side:THREE.DoubleSide,depthWrite:false}),interior=mat(0xb99875),blanket=mat(0xc3a37f);
 // A constant warm interior bounce remains independent of the observation beam.
 interior.emissive.setHex(0x9a5c2f);interior.emissiveIntensity=.22;
 root.add(mesh(new THREE.CylinderGeometry(5.2,5.5,.35,64),dark,0,-.25,0));const courtyard=mesh(new THREE.CylinderGeometry(4.95,4.95,.12,64),floor,0,-.02,0);courtyard.name='panopticon-courtyard';root.add(courtyard);
 const geometries={jamb:new THREE.BoxGeometry(.345,1.85,.16),lintel:new THREE.BoxGeometry(.46,.42,.16),sill:new THREE.BoxGeometry(.46,.53,.16),windowBar:new THREE.BoxGeometry(.035,.9,.04),side:new THREE.BoxGeometry(.12,1.85,1.05),cellFloor:new THREE.BoxGeometry(.95,.08,1.05),coping:new THREE.BoxGeometry(1.2,.08,.22),bar:new THREE.BoxGeometry(.035,1.38,.035),cross:new THREE.BoxGeometry(.95,.045,.05),bed:new THREE.BoxGeometry(.5,.14,.63),bedLeg:new THREE.BoxGeometry(.07,.17,.07),pillow:new THREE.BoxGeometry(.31,.08,.18),head:new THREE.SphereGeometry(.12,12,8),body:new THREE.CylinderGeometry(.13,.18,.48,10),arch:new THREE.TorusGeometry(.49,.055,6,24,Math.PI),joint:new THREE.BoxGeometry(.3,.012,.012)};
 const spandrelShape=new THREE.Shape();spandrelShape.moveTo(-.23,1.2);spandrelShape.lineTo(-.23,1.43);spandrelShape.lineTo(.23,1.43);spandrelShape.lineTo(.23,1.2);spandrelShape.absarc(0,1.2,.23,0,Math.PI,false);spandrelShape.closePath();
 geometries.windowSpandrel=new THREE.ExtrudeGeometry(spandrelShape,{depth:.16,bevelEnabled:false,curveSegments:16});geometries.windowSpandrel.translate(0,0,-.08);
 geometries.outerWindowBar=new THREE.BoxGeometry(.035,.835,.04);geometries.windowArch=new THREE.TorusGeometry(.23,.022,6,24,Math.PI);geometries.windowCrossbar=new THREE.BoxGeometry(.44,.025,.04);
 geometries.cellLining=new THREE.BoxGeometry(.008,1.75,.98);geometries.blanket=new THREE.BoxGeometry(.48,.01,.34);
 geometries.pier=new THREE.BoxGeometry(.13,1.66,.16);geometries.pierBase=new THREE.BoxGeometry(.22,.14,.23);geometries.pierCap=new THREE.BoxGeometry(.24,.13,.24);
 // Thin shared surfaces trace masonry on both inner sides of a cell.
 const mortarVertices=[];function mortarPatch(x,y0,y1,z0,z1){for(const [y,z] of [[y0,z0],[y1,z0],[y1,z1],[y0,z0],[y1,z1],[y0,z1]])mortarVertices.push(x,y,z)}
 for(const x of [-.461,.461]){for(const y of [.42,.84,1.26,1.68])mortarPatch(x,y-.006,y+.006,-.96,-.01);for(const z of [-.73,-.4])mortarPatch(x,.05,1.79,z-.006,z+.006)}
 geometries.innerMortar=new THREE.BufferGeometry();geometries.innerMortar.setAttribute('position',new THREE.Float32BufferAttribute(mortarVertices,3));geometries.innerMortar.computeVertexNormals();const innerMortar=mat(0x9b8069);innerMortar.side=THREE.DoubleSide;
 // Outer side joints articulate exposed cutaway ends using one shared surface.
 const outerMortarVertices=[];function outerPatch(x,y0,y1,z0,z1){for(const [y,z] of [[y0,z0],[y1,z0],[y1,z1],[y0,z0],[y1,z1],[y0,z1]])outerMortarVertices.push(x,y,z)}
 for(const x of [-.591,.591]){for(const y of [.38,.76,1.14,1.52])outerPatch(x,y-.006,y+.006,-1,-.01);for(let row=0;row<5;row++)for(const z of (row%2?[-.78,-.38]:[-.9,-.56,-.22]))outerPatch(x,.04+row*.38,.38+row*.38,z-.006,z+.006)}
 geometries.outerMortar=new THREE.BufferGeometry();geometries.outerMortar.setAttribute('position',new THREE.Float32BufferAttribute(outerMortarVertices,3));geometries.outerMortar.computeVertexNormals();
 // Exposed front-face joints stop at the window openings and align through the tiers.
 const facadeJoints=[];for(const y of [.22,.44,.66,.88,1.1,1.32,1.54,1.76]){for(const [x0,x1] of [[-.57,-.235],[.235,.57]])facadeJoints.push(x0,y,.087,x1,y,.087);if(y<.53||y>1.44)facadeJoints.push(-.225,y,.087,.225,y,.087)}
 for(let row=0;row<8;row++){const y0=row*.22+.01,y1=Math.min((row+1)*.22-.01,1.79);for(const x of (row%2?[-.48,.48]:[-.36,.36]))facadeJoints.push(x,y0,.087,x,y1,.087)}
 const facadeGeometry=new THREE.BufferGeometry();facadeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(facadeJoints,3));const facadeMaterial=new THREE.LineBasicMaterial({color:0x8f8270});
 for(let i=0;i<20;i++){
  const a=i*2*Math.PI/20,g=new THREE.Group();g.name='panopticon-cell';g.rotation.y=a;g.position.set(Math.sin(a)*3.85,0,Math.cos(a)*3.85);root.add(g);
  // Exterior piers articulate each bay and continue on cloned upper tiers.
  for(const x of [-.54,.54]){const pier=mesh(geometries.pier,wall,x,.91,.09);pier.name='panopticon-exterior-pier';g.add(pier);const foot=mesh(geometries.pierBase,linen,x,.11,.09);foot.name='panopticon-pier-base';g.add(foot);const cap=mesh(geometries.pierCap,linen,x,1.805,.09);cap.name='panopticon-pier-cap';g.add(cap)}
  if(i===2){
   // Reserve one front bay as a walk-through entrance instead of a cell.
   g.name='panopticon-entry';for(const x of [-.53,.53]){g.add(mesh(geometries.side,wall,x,.93,-.48));g.add(mesh(new THREE.BoxGeometry(.15,1.3,.18),wall,x,.65,0))}
   const threshold=mesh(geometries.cellFloor,wall,0,0,-.48);threshold.name='panopticon-entry-floor';g.add(threshold);g.add(mesh(geometries.arch,linen,0,1.3,0));
   const barGeometry=new THREE.BoxGeometry(.035,1.17,.035),railGeometry=new THREE.BoxGeometry(.42,.035,.035);
   for(const side of [-1,1]){const leaf=new THREE.Group();leaf.name='panopticon-entry-gate';leaf.position.set(side*.47,.04,.1);leaf.rotation.y=side*.85;g.add(leaf);for(let j=0;j<4;j++)leaf.add(mesh(barGeometry,dark,-side*j*.13,.585,0));for(const y of [.06,.58,1.11])leaf.add(mesh(railGeometry,dark,-side*.195,y,0))}
   continue;
  }
  for(const x of [-.4025,.4025])g.add(mesh(geometries.jamb,wall,x,.925,0));g.add(mesh(geometries.sill,wall,0,.265,0));g.add(mesh(geometries.lintel,wall,0,1.64,0));
  const spandrel=mesh(geometries.windowSpandrel,wall);spandrel.name='panopticon-window-spandrel';g.add(spandrel);g.add(mesh(geometries.windowArch,linen,0,1.2,.085));g.add(mesh(geometries.windowBar,dark,0,.98,.02));for(const x of [-.16,.16])g.add(mesh(geometries.outerWindowBar,dark,x,.9475,.02));for(const side of [-.53,.53])g.add(mesh(geometries.side,wall,side,.93,-.48));
  for(const y of [.78,1.08]){const crossbar=mesh(geometries.windowCrossbar,dark,0,y,.045);crossbar.name='panopticon-window-crossbar';g.add(crossbar)}
  const slab=mesh(geometries.cellFloor,wall,0,0,-.48);slab.name='panopticon-cell-floor';g.add(slab);const coping=mesh(geometries.coping,linen,0,1.85,0);coping.name='panopticon-cell-coping';g.add(coping);
  for(const x of [-.466,.466]){const lining=mesh(geometries.cellLining,interior,x,.92,-.48);lining.name='panopticon-cell-lining';g.add(lining)}
  const cellMortar=mesh(geometries.innerMortar,innerMortar);cellMortar.name='panopticon-cell-mortar';cellMortar.castShadow=false;g.add(cellMortar);const outerMortar=mesh(geometries.outerMortar,innerMortar);outerMortar.name='panopticon-outer-mortar';outerMortar.castShadow=false;g.add(outerMortar);
  const facade=new THREE.LineSegments(facadeGeometry,facadeMaterial);facade.name='panopticon-facade-joints';g.add(facade);
  for(let j=-2;j<=2;j++)g.add(mesh(geometries.bar,dark,j*.19,.78,-1));
  for(const y of [.14,.78,1.46])g.add(mesh(geometries.cross,dark,0,y,-1));
  const doorway=mesh(geometries.arch,wall,0,1.34,-1.01);doorway.name='panopticon-door-arch';g.add(doorway);
  for(const x of [-.4025,.4025])for(const y of [.34,.72,1.1,1.48])g.add(mesh(geometries.joint,linen,x,y,.086));
  g.add(mesh(geometries.bed,wood,.21,.26,-.35));const mattress=mesh(geometries.bed,linen,.21,.36,-.35);mattress.name='panopticon-mattress';g.add(mattress);g.add(mesh(geometries.pillow,linen,.21,.47,-.12));const cover=mesh(geometries.blanket,blanket,.21,.435,-.44);cover.name='panopticon-blanket';g.add(cover);
  for(const x of [.04,.4])for(const z of [-.58,-.12]){const leg=mesh(geometries.bedLeg,wood,x,.125,z);leg.name='panopticon-bed-leg';g.add(leg)}
  g.add(mesh(geometries.head,gold,-.18,.57,-.55));g.add(mesh(geometries.body,gold,-.18,.28,-.55));
  // Rear upper tiers form an intentional cutaway so the interior remains legible.
  if(Math.sin(a)+Math.cos(a)<-.2)for(const y of [1.85,3.11]){const upper=g.clone();upper.name='panopticon-upper-cell';upper.position.y=y;upper.scale.y=.68;root.add(upper)}
 }
 // A continuous dark coping ties the exposed top tier into one curved wall,
 // while the front cutaway stays open for viewing the cells and tower.
 {const coping=mesh(new THREE.RingGeometry(3.78,4.08,48,1,Math.PI/4,Math.PI),dark,0,4.404,0);coping.rotation.x=-Math.PI/2;coping.name='panopticon-upper-wall-coping';coping.material.side=THREE.DoubleSide;coping.castShadow=false;root.add(coping)}
 // Balcony slabs and handrails run only along the rear arc of the cutaway.
 const galleryPositions=[],galleryIndices=[],start=3*Math.PI/4,end=7*Math.PI/4,segments=40;
 for(let i=0;i<=segments;i++){const a=start+(end-start)*i/segments;for(const [radius,y] of [[2.56,0],[2.91,0],[2.56,-.1],[2.91,-.1]])galleryPositions.push(Math.sin(a)*radius,y,Math.cos(a)*radius);if(i<segments){const n=i*4;galleryIndices.push(n,n+4,n+1,n+1,n+4,n+5,n+2,n+3,n+6,n+3,n+7,n+6,n+1,n+5,n+3,n+3,n+5,n+7,n,n+2,n+4,n+2,n+6,n+4)}}
 galleryIndices.push(0,1,2,1,3,2,segments*4,segments*4+2,segments*4+1,segments*4+1,segments*4+2,segments*4+3);
 const galleryGeometry=new THREE.BufferGeometry();galleryGeometry.setAttribute('position',new THREE.Float32BufferAttribute(galleryPositions,3));galleryGeometry.setIndex(galleryIndices);galleryGeometry.computeVertexNormals();
 const railGeometry=new THREE.CylinderGeometry(.024,.024,.6,8),galleryMaterial=mat(0xb8ab96);galleryMaterial.side=THREE.DoubleSide;
 for(const y of [1.85,3.11]){
  const gallery=mesh(galleryGeometry,galleryMaterial,0,y,0);gallery.name='panopticon-gallery';root.add(gallery);
  for(let i=0;i<=20;i++){const a=start+(end-start)*i/20,post=mesh(railGeometry,dark,Math.sin(a)*2.57,y+.3,Math.cos(a)*2.57);post.name='panopticon-gallery-post';root.add(post)}
  const rail=mesh(new THREE.TorusGeometry(2.57,.035,8,40,Math.PI),dark,0,y+.6,0);rail.rotation.x=-Math.PI/2;rail.rotation.z=Math.PI/4;root.add(rail);
  const lowerRail=mesh(new THREE.TorusGeometry(2.57,.022,8,40,Math.PI),dark,0,y+.18,0);lowerRail.rotation.x=-Math.PI/2;lowerRail.rotation.z=Math.PI/4;lowerRail.name='panopticon-gallery-lower-rail';root.add(lowerRail);
 }
 // Soft, fixed fill on the rear galleries makes the cell interiors legible;
 // it is separate from the animated observation beam.
 for(const y of [.85,2.3,3.55])for(const a of [Math.PI,Math.PI*1.25,Math.PI*1.5]){const light=new THREE.PointLight(0xffbc7b,y===2.3?1.4:1.1,3.4,2);light.name='panopticon-cell-fill';light.position.set(Math.sin(a)*3.05,y,Math.cos(a)*3.05);root.add(light)}
 // The glazed observation room has its own floor and frame. It remains empty:
 // the viewer cannot infer whether anyone is observing from the light beam.
 root.add(mesh(new THREE.CylinderGeometry(.93,1,2.45,16),wall,0,1.225,0));
 const observationFloor=mesh(new THREE.CylinderGeometry(.87,.87,.09,20),wood,0,2.63,0);observationFloor.name='panopticon-observation-floor';root.add(observationFloor);
 const observationCeiling=mesh(new THREE.CylinderGeometry(.9,.9,.1,20),dark,0,3.64,0);observationCeiling.name='panopticon-observation-ceiling';root.add(observationCeiling);
 const windowGeometry=new THREE.BoxGeometry(.48,.85,.045),mullionGeometry=new THREE.BoxGeometry(.028,.85,.05),sillGeometry=new THREE.BoxGeometry(.5,.045,.075),observationPostGeometry=new THREE.BoxGeometry(.06,.97,.07);
 for(let i=0;i<10;i++){const a=i*Math.PI/5,x=Math.sin(a)*.89,z=Math.cos(a)*.89,window=mesh(windowGeometry,glass,x,3.12,z);window.name='panopticon-observation-window';window.rotation.y=a;root.add(window);
  const mullion=mesh(mullionGeometry,dark,Math.sin(a)*.92,3.12,Math.cos(a)*.92);mullion.rotation.y=a;root.add(mullion);
  const sill=mesh(sillGeometry,dark,Math.sin(a)*.92,2.69,Math.cos(a)*.92);sill.rotation.y=a;root.add(sill);
  const postAngle=a+Math.PI/10,post=mesh(observationPostGeometry,dark,Math.sin(postAngle)*.88,3.14,Math.cos(postAngle)*.88);post.rotation.y=postAngle;post.name='panopticon-observation-post';root.add(post);
  const header=mesh(sillGeometry,dark,Math.sin(a)*.92,3.55,Math.cos(a)*.92);header.rotation.y=a;header.name='panopticon-observation-header';root.add(header);
 }
 root.add(mesh(new THREE.CylinderGeometry(1.04,1.04,.12,20),wall,0,2.48,0));
 root.add(mesh(new THREE.CylinderGeometry(1.12,1.12,.15,20),gold,0,3.82,0));const roof=mesh(new THREE.ConeGeometry(1.2,.65,20),mat(0xa66049),0,4.22,0);roof.name='panopticon-tower-roof';root.add(roof);
 // Stone courses and roof ribs articulate the tall observation tower.
 const courseGeometry=new THREE.TorusGeometry(.97,.018,6,40);
 for(const y of [.42,.84,1.26,1.68,2.1]){const course=mesh(courseGeometry,linen,0,y,0);course.rotation.x=Math.PI/2;root.add(course)}
 // Staggered, shallow joints describe masonry without cutting through the
 // lower window openings. They follow the tapered wall rather than the course rings.
 const towerJointGeometry=new THREE.BoxGeometry(.012,.36,.012),towerJointMaterial=mat(0x8e8576);
 for(let row=0;row<5;row++)for(let i=0;i<16;i++){
  const a=(i+.5+(row%2)*.28)*Math.PI/8,y=.21+row*.42;
  // Window panels occupy the first two courses at each eighth of the tower.
  if(row<2&&Math.abs(Math.sin(a*4))<.62)continue;
  const radius=1-.07*y/2.45+.008,joint=mesh(towerJointGeometry,towerJointMaterial,Math.sin(a)*radius,y,Math.cos(a)*radius);
  joint.name='panopticon-tower-masonry-joint';joint.rotation.y=a;joint.castShadow=false;root.add(joint);
 }
 for(let i=0;i<10;i++){const a=i*Math.PI/5;root.add(limb(new THREE.Vector3(Math.sin(a)*1.1,3.93,Math.cos(a)*1.1),new THREE.Vector3(0,4.55,0),.02,gold))}
 for(const y of [4.04,4.19,4.34]){const radius=1.2*(1-(y-3.895)/.65)+.008,course=mesh(new THREE.TorusGeometry(radius,.012,6,40),mat(0x8d5c4a),0,y,0);course.rotation.x=Math.PI/2;course.name='panopticon-roof-course';root.add(course)}
 const bracketGeometry=new THREE.BoxGeometry(.12,.23,.16);for(let i=0;i<12;i++){const a=i*Math.PI/6,bracket=mesh(bracketGeometry,linen,Math.sin(a)*.96,2.33,Math.cos(a)*.96);bracket.rotation.y=a;root.add(bracket)}
 const finial=mesh(new THREE.SphereGeometry(.09,12,8),dark,0,4.66,0);finial.name='panopticon-roof-finial';root.add(finial);
 const paving=mesh(new THREE.RingGeometry(1.5,1.58,64),gold,0,.05,0);paving.rotation.x=-Math.PI/2;root.add(paving);
 const courtyardRing=mesh(new THREE.RingGeometry(2.48,2.51,80),wall,0,.046,0);courtyardRing.rotation.x=-Math.PI/2;courtyardRing.name='panopticon-courtyard-ring';courtyardRing.castShadow=false;root.add(courtyardRing);
 // Concentric courses and staggered radial joints describe stone paving on
 // the courtyard floor without adding raised surfaces in the tower or cells.
 {const vertices=[],rings=[1.04,1.28,1.5,1.82,2.14,2.48,2.78],segments=80,y=.047;
  for(const radius of rings.slice(1,-1))for(let i=0;i<segments;i++){const a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;vertices.push(Math.sin(a)*radius,y,Math.cos(a)*radius,Math.sin(b)*radius,y,Math.cos(b)*radius)}
  for(let row=0;row<rings.length-1;row++){const count=20+row*5;for(let i=0;i<count;i++){const a=(i+(row%2)*.5)*Math.PI*2/count;vertices.push(Math.sin(a)*rings[row],y,Math.cos(a)*rings[row],Math.sin(a)*rings[row+1],y,Math.cos(a)*rings[row+1])}}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const joints=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0x887d6d}));joints.name='panopticon-courtyard-paving';root.add(joints)}
 // Arched lower-tower windows remain surface cues on the opaque core.
 const towerWindowShape=new THREE.Shape();towerWindowShape.moveTo(-.14,0);towerWindowShape.lineTo(-.14,.47);towerWindowShape.absarc(0,.47,.14,Math.PI,0,true);towerWindowShape.lineTo(.14,0);towerWindowShape.closePath();
 const towerWindowGeometry=new THREE.ShapeGeometry(towerWindowShape,16),towerWindowArch=new THREE.TorusGeometry(.14,.025,6,16,Math.PI),towerMullion=new THREE.BoxGeometry(.018,.45,.018),towerCrossbar=new THREE.BoxGeometry(.27,.018,.018);
 for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.sin(a)*.99,z=Math.cos(a)*.99,window=mesh(towerWindowGeometry,dark,x,.505,z);window.name='panopticon-lower-window';window.rotation.y=a;window.material.side=THREE.DoubleSide;root.add(window);const crown=mesh(towerWindowArch,linen,x,.975,z);crown.rotation.y=a;root.add(crown);
  const mullion=mesh(towerMullion,linen,Math.sin(a)*1.003,.73,Math.cos(a)*1.003);mullion.rotation.y=a;root.add(mullion);const cross=mesh(towerCrossbar,linen,Math.sin(a)*1.003,.75,Math.cos(a)*1.003);cross.rotation.y=a;root.add(cross)}
 const beam=mesh(new THREE.ConeGeometry(1.05,3.5,32,1,true),new THREE.MeshBasicMaterial({color:0xe9cb82,transparent:true,opacity:.17,side:THREE.DoubleSide,depthWrite:false}));beam.name='panopticon-beam';beam.rotation.z=Math.PI/2;beam.position.set(2.1,3.1,0);const pivot=new THREE.Group();pivot.name='panopticon-beam-pivot';pivot.add(beam);root.add(pivot);
 return {update(t,value){pivot.rotation.y=t*(.12+value*.7);beam.material.opacity=value===0?0:.12+value*.30},dispose(){scene.remove(root);dispose(root)}};
}
function dispose(root){disposeSceneGraph(root)}
const v=(x,y,z)=>new THREE.Vector3(x,y,z);
function base(scene){const root=new THREE.Group();scene.add(root);root.add(mesh(new THREE.CylinderGeometry(5.2,5.5,.3,48),mat(0x4a534e),0,-.2,0));return root}
function lifecycle(scene,root,update){return {update,dispose(){scene.remove(root);dispose(root)}}}
function person(color=0xc8a380){const g=new THREE.Group(),skin=mat(0xcaa483),robe=mat(color),hair=mat(0x51463d);g.add(mesh(new THREE.SphereGeometry(.18,12,10),skin,0,1.14,0));g.add(mesh(new THREE.SphereGeometry(.17,12,8),hair,0,1.25,-.03));g.add(mesh(new THREE.CylinderGeometry(.15,.24,.72,12),robe,0,.64,0));for(const side of [-1,1]){g.add(limb(v(side*.08,.33,0),v(side*.14,.03,0),.065,skin));g.add(limb(v(side*.17,.88,0),v(side*.25,.46,.07),.06,robe));g.add(mesh(new THREE.SphereGeometry(.065,8,6),skin,side*.25,.46,.07))}return g}
// Every unbuilt concept gets a navigable, explicitly labeled whitebox.
export function buildPlaceholder(scene,concept){
 const root=base(scene),white=mat(0xd6d4c9),dark=mat(0x7e897e);
 const box=(w,h,d,x,y,z,m=white)=>root.add(mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z));
 switch(concept.id){
 case 'trolley': box(7,.12,.25,0,.05,-1,dark);box(7,.12,.25,0,.05,1,dark);box(1.8,.7,1,-2,.5,0);for(let i=0;i<4;i++){const p=person(0xb0b5aa);p.position.set(1+i*.7,.1,i%2?1:-1);root.add(p)}break;
 case 'vat':root.add(mesh(new THREE.CylinderGeometry(1.4,1.4,2,32,1,true),new THREE.MeshStandardMaterial({color:0xd6d4c9,transparent:true,opacity:.5,side:THREE.DoubleSide}),0,1.1,0));root.add(mesh(new THREE.IcosahedronGeometry(.65,1),dark,0,1.3,0));box(3,.25,3,0,.05,0);break;
 case 'free-will':box(.5,.2,5,0,.1,0,dark);box(4,.2,.5,0,.1,-1.7,dark);root.add(person(0xb0b5aa));break;
 case 'chinese-room':box(5,3,.2,0,1.5,-2);box(.2,3,4,-2.5,1.5,0);box(.2,3,4,2.5,1.5,0);root.add(person(0xb0b5aa));break;
 case 'socratic':for(let i=0;i<2;i++){const p=person(0xb0b5aa);p.position.x=i?1.5:-1.5;root.add(p)}box(1.6,.12,1,0,.9,0,dark);break;
 case 'newcomb':box(1.8,1.5,1.8,-1.3,.75,0,dark);box(1.8,1.5,1.8,1.3,.75,0);break;
 case 'recurrence':{const ring=mesh(new THREE.TorusGeometry(2.5,.18,12,64),white,0,1.1,0);root.add(ring);const p=person(0xb0b5aa);p.position.set(0,.1,1);root.add(p);break}
 case 'butterfly':{const left=mesh(new THREE.SphereGeometry(1,16,12),white,-.8,1.4,0);left.scale.set(1,.8,.22);root.add(left);const right=mesh(new THREE.SphereGeometry(1,16,12),white,.8,1.4,0);right.scale.set(1,.8,.22);root.add(right);box(.2,1.8,.2,0,1.4,0,dark);break}
 case 'monkey':box(3,.25,1.5,0,.8,0,dark);box(2.2,1.5,.15,0,1.7,-.6);for(let i=0;i<5;i++)box(.25,.1,.25,(i-2)*.4,.98,.1);break;
 default:box(2,2,2,0,1,0);
 }
 return lifecycle(scene,root,()=>{});
}
export function buildCave(scene){
 const root=base(scene),rock=mat(0x6f5d4f),gold=mat(0xd8ad6c);
 // An uneven cutaway keeps the wall visible without pretending to be a surveyed cave.
 const wall=new THREE.Shape();wall.moveTo(-4,0);wall.lineTo(-4,2.8);wall.lineTo(-3.7,3.3);wall.lineTo(-3.2,3.55);wall.lineTo(-2.45,3.42);wall.lineTo(-1.7,3.7);wall.lineTo(-.8,3.56);wall.lineTo(.2,3.72);wall.lineTo(1,3.55);wall.lineTo(1.85,3.65);wall.lineTo(2.7,3.38);wall.lineTo(2.9,3.25);wall.lineTo(2.9,0);wall.closePath();
 const wallMesh=mesh(new THREE.ExtrudeGeometry(wall,{depth:.2,bevelEnabled:false}),rock,0,0,-2.18);wallMesh.name='cave-wall';root.add(wallMesh);
 // A shallow irregular facing breaks up the broad wall while remaining behind
 // the deliberately schematic shadow silhouettes at z = -1.88.
 const wallVertices=[],wallColors=[],cols=18,rows=8,grid=[];
 for(let row=0;row<=rows;row++){const line=[];for(let col=0;col<=cols;col++){const edge=col===0||col===cols||row===0||row===rows,x=-3.94+6.78*col/cols+(edge?0:.11*Math.sin(col*8.37+row*3.4)),y=.08+2.94*row/rows+(edge?0:.075*Math.sin(row*6.13+col*4.12)),z=-1.902-.048*(.5+.5*Math.sin(col*3.2+row*5.1));line.push([x,y,z])}grid.push(line)}
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const a=grid[row][col],b=grid[row][col+1],c=grid[row+1][col],d=grid[row+1][col+1];for(const [index,tri] of [[0,[a,b,c]],[1,[b,d,c]]]){const tone=.92+.1*(.5+.5*Math.sin(col*4.9+row*7.7+index*3.1)),color=new THREE.Color(0x75604f).multiplyScalar(tone);for(const p of tri){wallVertices.push(...p);wallColors.push(color.r,color.g,color.b)}}}
 const facingGeometry=new THREE.BufferGeometry();facingGeometry.setAttribute('position',new THREE.Float32BufferAttribute(wallVertices,3));facingGeometry.setAttribute('color',new THREE.Float32BufferAttribute(wallColors,3));facingGeometry.computeVertexNormals();const facingMaterial=mat(0xffffff);facingMaterial.vertexColors=true;facingMaterial.side=THREE.DoubleSide;const facing=mesh(facingGeometry,facingMaterial);facing.name='cave-rock-facing';facing.castShadow=false;root.add(facing);
 const floor=mesh(new THREE.BoxGeometry(8,.12,5),mat(0x857661),0,.02,0);floor.name='cave-floor';root.add(floor);
 // Continue the cave earth to the edge of the plinth, below the existing
 // supported floor and outside the moving figure's route.
 const earth=mesh(new THREE.CylinderGeometry(5.12,5.12,.025,64),mat(0x786b59),0,-.0375,0);earth.name='cave-surrounding-earth';root.add(earth);
 const rubbleGeometry=new THREE.DodecahedronGeometry(1,0),rubbleMaterial=mat(0x827361);
 for(const [x,z,s] of [[-3.5,2.85,.25],[-2.8,3.55,.31],[-1.95,3.55,.2],[-1.1,4.2,.25],[-.1,3.55,.22],[.9,3.65,.28],[1.7,3.4,.18],[2.55,3.35,.25],[-4.3,.9,.27],[-4.35,-.1,.23],[4.35,.75,.22]]){
  const stone=mesh(rubbleGeometry,rubbleMaterial,x,-.025,z);stone.name='cave-edge-rubble';stone.scale.set(s,s*.48,s*.8);stone.rotation.set(.12,x*.7,z*.17);root.add(stone);
 }
 // Sparse tufts at the cave margin connect the rocky floor to the exterior.
 const caveLeafGeometry=new THREE.SphereGeometry(1,8,6),caveLeafMaterials=[mat(0x6f8061),mat(0x87906b)];
 for(const [x,z] of [[-3.45,3.1],[-2.35,3.9],[-.65,4.35],[1.15,4.15],[2.45,3.65],[4.25,1.45]]){const tuft=new THREE.Group();tuft.name='cave-edge-tuft';tuft.position.set(x,-.025,z);root.add(tuft);for(let i=0;i<9;i++){const a=i*2.399963,r=.05+.035*(i%4),leaf=mesh(caveLeafGeometry,caveLeafMaterials[i%2],Math.cos(a)*r,.08+(i%3)*.018,Math.sin(a)*r);leaf.scale.set(.045,.14,.025);leaf.rotation.set(.45*Math.cos(a),a,.45*Math.sin(a));tuft.add(leaf)}}
 // Nearly flush irregular slabs add visible stone joints without changing the
 // established support surface for figures, steps, restraints and props.
 const floorSeeds=[],floorPositions=[],floorColors=[],floorCols=18,floorRows=11;
 for(let row=0;row<floorRows;row++)for(let col=0;col<floorCols;col++)floorSeeds.push([-3.96+7.92*(col+.5)/floorCols+.16*Math.sin(col*5.8+row*4.1),-2.46+4.92*(row+.5)/floorRows+.16*Math.sin(col*3.7-row*6.2)]);
 for(let cell=0;cell<floorSeeds.length;cell++){const [sx,sz]=floorSeeds[cell];let polygon=[[-3.96,-2.46],[3.96,-2.46],[3.96,2.46],[-3.96,2.46]];
  // Clip a cell against neighboring seed bisectors to produce irregular slabs.
  for(let other=0;other<floorSeeds.length&&polygon.length;other++){if(other===cell)continue;const [tx,tz]=floorSeeds[other],dx=tx-sx,dz=tz-sz;if(Math.abs(dx)>1.5||Math.abs(dz)>1.5)continue;const limit=(tx*tx+tz*tz-sx*sx-sz*sz)/2,inside=p=>p[0]*dx+p[1]*dz-limit,next=[];
   for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],da=inside(a),db=inside(b);if(da<=0)next.push(a);if((da<0&&db>0)||(da>0&&db<0)){const t=da/(da-db);next.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}polygon=next;
  }
  const center=polygon.reduce((a,p)=>[a[0]+p[0]/polygon.length,a[1]+p[1]/polygon.length],[0,0]),corners=polygon.map(p=>[center[0]+(p[0]-center[0])*.94,center[1]+(p[1]-center[1])*.94]),tone=.94+.12*(.5+.5*Math.sin(cell*6.3)),color=new THREE.Color(0x998970).multiplyScalar(tone);
  for(let i=1;i<corners.length-1;i++)for(const point of [corners[0],corners[i+1],corners[i]]){floorPositions.push(point[0],.08005,point[1]);floorColors.push(color.r,color.g,color.b)}
 }
 const floorGeometry=new THREE.BufferGeometry();floorGeometry.setAttribute('position',new THREE.Float32BufferAttribute(floorPositions,3));floorGeometry.setAttribute('color',new THREE.Float32BufferAttribute(floorColors,3));floorGeometry.computeVertexNormals();const slabMaterial=mat(0xffffff);slabMaterial.vertexColors=true;slabMaterial.side=THREE.DoubleSide;const slabs=mesh(floorGeometry,slabMaterial);slabs.name='cave-floor-slabs';slabs.castShadow=false;root.add(slabs);
 const rockGeometry=new THREE.DodecahedronGeometry(1,0);
 // A shallow irregular overhead shelf frames the wall without hiding the shadows.
 const archRise=x=>.48*Math.max(0,1-((x+.325)/3.675)**2),roofBottom=[[-4,3.12],[-3.35,3.03],[-2.8,3.18],[-2.05,3.02],[-1.35,3.2],[-.6,3.08],[.2,3.23],[1,3.08],[1.85,3.2],[2.6,3.05],[3.35,3.18]],roofTop=[[-4,3.64],[-3.35,3.58],[-2.5,3.76],[-1.65,3.64],[-.8,3.8],[.1,3.65],[.95,3.76],[1.8,3.58],[2.65,3.72],[3.35,3.6]].map(([x,y])=>[x,y+archRise(x)]);
 const roof=new THREE.Shape();roof.moveTo(roofBottom[0][0],roofBottom[0][1]+archRise(roofBottom[0][0]));for(const [x,y] of roofBottom.slice(1))roof.lineTo(x,y+archRise(x));for(const [x,y] of [...roofTop].reverse())roof.lineTo(x,y);roof.closePath();
 const roofMesh=mesh(new THREE.ExtrudeGeometry(roof,{depth:1.2,bevelEnabled:false}),mat(0x716759),0,0,-2.05);roofMesh.name='cave-overhang';root.add(roofMesh);
 // A continuous triangulated cap follows the irregular shelf profile, giving
 // the top the appearance of joined rock strata rather than separate blocks.
 {const profile=roofTop,top=x=>{let i=0;while(i<profile.length-2&&x>profile[i+1][0])i++;const a=profile[i],b=profile[i+1];return THREE.MathUtils.lerp(a[1],b[1],(x-a[0])/(b[0]-a[0]))},positions=[],colors=[],cols=24,rows=4,points=[];
  for(let j=0;j<=rows;j++){const row=[];for(let i=0;i<=cols;i++){const x=-4+7.35*i/cols,z=-2.05+1.2*j/rows,y=top(x)+.025+.22*(.5+.5*Math.sin(i*1.1+j*2.1))+.18*(.5+.5*Math.cos(i*.59-j*1.3));row.push([x,y,z])}points.push(row)}
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=points[j][i],b=points[j][i+1],c=points[j+1][i],d=points[j+1][i+1];for(const [k,tri] of [[0,[a,c,b]],[1,[b,c,d]]]){const color=new THREE.Color(0x756a5a).multiplyScalar(.88+.2*(.5+.5*Math.sin(i*4.2+j*7.1+k)));for(const p of tri){positions.push(...p);colors.push(color.r,color.g,color.b)}}}
  for(const j of [0,rows])for(let i=0;i<cols;i++){const a=points[j][i],b=points[j][i+1],lowerA=[a[0],top(a[0])-.04,a[2]],lowerB=[b[0],top(b[0])-.04,b[2]],color=new THREE.Color(0x6e6253);for(const p of [a,lowerA,b,b,lowerA,lowerB]){positions.push(...p);colors.push(color.r,color.g,color.b)}}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();const material=mat(0xffffff);material.vertexColors=true;material.side=THREE.DoubleSide;const cap=mesh(geometry,material);cap.name='cave-roof-strata';root.add(cap)}
 const roofStone=mat(0x796b5b);for(let i=0;i<12;i++){const x=-3.68+i*.62,facet=mesh(rockGeometry,roofStone,x,3.17+archRise(x)+(i%3)*.04,-1.04+.08*Math.sin(i*2.3));facet.scale.set(.43+(i%3)*.07,.2+(i%4)*.025,.27+(i%3)*.035);facet.rotation.set(.1+i*.08,i*.29,(i%2?1:-1)*.12);facet.name='cave-roof-facet';facet.castShadow=false;root.add(facet)}
 // The left return gives the cutaway wall depth while leaving the prisoners in view.
 const sideProfile=new THREE.Shape();sideProfile.moveTo(0,.08);sideProfile.lineTo(0,3.12);sideProfile.lineTo(.36,3.2);sideProfile.lineTo(.83,3.03);sideProfile.lineTo(1.18,2.78);sideProfile.lineTo(1.5,2.24);sideProfile.lineTo(1.87,1.58);sideProfile.lineTo(2.2,.82);sideProfile.lineTo(2.4,.08);sideProfile.closePath();
 const sideWall=mesh(new THREE.ExtrudeGeometry(sideProfile,{depth:.35,bevelEnabled:false}),rock,-4,0,-2.05);sideWall.rotation.y=-Math.PI/2;sideWall.name='cave-side-wall';root.add(sideWall);
 for(const [y,z,sy,sz] of [[.42,-.65,.42,.48],[.98,-1.13,.5,.52],[1.58,-1.48,.48,.48],[2.17,-1.62,.48,.43],[2.73,-1.74,.4,.37]]){const facet=mesh(rockGeometry,rock,-3.99,y,z);facet.scale.set(.16,sy,sz);facet.rotation.x=.19;facet.name='cave-side-facet';root.add(facet)}
 // Dark flat shapes suggest projected objects, not a physically simulated projection.
 function outline(points){const shape=new THREE.Shape();shape.moveTo(...points[0]);for(const point of points.slice(1))shape.lineTo(...point);shape.closePath();return shape}
 // Rasterize a soft-edged mask in local coordinates. It is a visual
 // illustration rather than a claim of physically accurate projected shadows.
 function silhouette(points,x,y,scale){
  const pad=.13,minX=Math.min(...points.map(p=>p[0]))-pad,maxX=Math.max(...points.map(p=>p[0]))+pad,minY=Math.min(...points.map(p=>p[1]))-pad,maxY=Math.max(...points.map(p=>p[1]))+pad,size=160,data=new Uint8Array(size*size*4);
  for(let iy=0;iy<size;iy++)for(let ix=0;ix<size;ix++){
   const px=minX+(ix+.5)/size*(maxX-minX),py=minY+(iy+.5)/size*(maxY-minY);let inside=false,distance=Infinity;
   for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [ax,ay]=points[j],[bx,by]=points[i],dx=bx-ax,dy=by-ay,t=THREE.MathUtils.clamp(((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1),0,1);
    distance=Math.min(distance,Math.hypot(px-(ax+t*dx),py-(ay+t*dy)));
    if((ay>py)!==(by>py)&&px<(bx-ax)*(py-ay)/(by-ay)+ax)inside=!inside;
   }
   const coverage=THREE.MathUtils.smoothstep((inside?distance:-distance),-.09,.09),index=(iy*size+ix)*4;data[index]=48;data[index+1]=37;data[index+2]=30;data[index+3]=Math.round(coverage*170);
  }
  const texture=new THREE.DataTexture(data,size,size);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearFilter;texture.needsUpdate=true;
  // Sample the visible rock surface so the illustrative mask remains close
  // to it from oblique views, rather than floating on a single plane.
  root.updateMatrixWorld(true);const ray=new THREE.Raycaster(),positions=[],uvs=[],indices=[],steps=36,direction=new THREE.Vector3(0,0,-1).transformDirection(root.matrixWorld);
  for(let row=0;row<=steps;row++)for(let col=0;col<=steps;col++){const u=col/steps,v=row/steps,px=x+THREE.MathUtils.lerp(minX,maxX,u)*scale,py=y+THREE.MathUtils.lerp(minY,maxY,v)*scale;ray.set(root.localToWorld(new THREE.Vector3(px,py,0)),direction);const hit=ray.intersectObject(facing)[0];if(!hit)throw new Error('Cave silhouette extends beyond the rock facing');const point=root.worldToLocal(hit.point.clone());positions.push(px,py,point.z+.006);uvs.push(u,v);if(row<steps&&col<steps){const n=row*(steps+1)+col;indices.push(n,n+1,n+steps+1,n+1,n+steps+2,n+steps+1)}}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide,depthWrite:false}),figure=mesh(geometry,material);figure.name='cave-silhouette';figure.castShadow=false;root.add(figure);return figure;
 }
 silhouette([[-.28,0],[-.34,.25],[-.29,.58],[-.16,.7],[-.18,.9],[.18,.9],[.16,.7],[.29,.58],[.34,.25],[.28,0]],-2.48,1.08,1.3);
 const horseOutline=[[-.5,.45],[-.6,.25],[-.57,.56],[-.36,.67],[.18,.65],[.31,.83],[.39,.99],[.47,.98],[.49,.84],[.61,.72],[.54,.66],[.42,.71],[.3,.48],[.36,.03],[.25,.03],[.14,.43],[-.15,.43],[-.24,0],[-.34,0],[-.29,.45],[-.4,.44],[-.51,.02],[-.61,.02]];
 silhouette(horseOutline,-1.1,1.04,1.22);
 silhouette(Array.from({length:24},(_,i)=>{const a=i*Math.PI*2/24;return [Math.cos(a)*.36,.38+Math.sin(a)*.38]}),.48,1.23,1.25);
 const people=[],standing=[];
 function seatedPrisoner(robeColor,drapeColor){const group=new THREE.Group(),skin=mat(0xcaa483),robe=mat(robeColor),hair=mat(0x51463d);
  group.add(mesh(new THREE.CylinderGeometry(.17,.25,.53,12),robe,0,.43,0));group.add(mesh(new THREE.SphereGeometry(.18,12,10),skin,0,.87,0));
  const cap=mesh(new THREE.SphereGeometry(.18,12,8),hair,0,.97,-.02);cap.scale.y=.48;group.add(cap);
  for(let i=0;i<11;i++){const a=i*2.399963,r=.13*Math.sqrt((i+.5)/11),curl=mesh(new THREE.SphereGeometry(.036,8,6),hair,Math.cos(a)*r,.99+Math.sqrt(Math.max(0,.018-r*r))*.28,-.02+Math.sin(a)*r);curl.name='cave-prisoner-hair-curl';group.add(curl)}
  for(const side of [-1,1]){const ear=mesh(new THREE.SphereGeometry(.036,8,6),skin,side*.175,.87,0);ear.scale.set(.55,1,.8);ear.name='cave-prisoner-ear';group.add(ear)}
  const clothPositions=[],clothFaces=[],clothRows=10,clothCols=12;for(let row=0;row<=clothRows;row++){const t=row/clothRows;for(let col=0;col<=clothCols;col++){const u=col/clothCols*2-1;clothPositions.push(u*(.17+.08*t),.69-.49*t,-.145-.06*t-.012*t*Math.cos(u*4*Math.PI));if(row<clothRows&&col<clothCols){const n=row*(clothCols+1)+col;clothFaces.push(n,n+clothCols+1,n+1,n+1,n+clothCols+1,n+clothCols+2)}}}
  const clothGeometry=new THREE.BufferGeometry();clothGeometry.setAttribute('position',new THREE.Float32BufferAttribute(clothPositions,3));clothGeometry.setIndex(clothFaces);clothGeometry.computeVertexNormals();const clothMaterial=mat(drapeColor);clothMaterial.side=THREE.DoubleSide;const drape=mesh(clothGeometry,clothMaterial);drape.name='cave-prisoner-drape';group.add(drape);
  // Folded fabric spans the seated thighs, giving the lower body a readable
  // silhouette while leaving the restrained hands and feet unobstructed.
  const lap=mesh(new THREE.SphereGeometry(1,14,10),robe,0,.235,-.255);lap.name='cave-prisoner-lap';lap.scale.set(.26,.13,.34);group.add(lap);
  for(const side of [-1,1]){const fold=mesh(new THREE.SphereGeometry(1,10,8),clothMaterial,side*.14,.28,-.29);fold.name='cave-prisoner-lap-fold';fold.scale.set(.055,.025,.24);fold.rotation.y=side*.1;group.add(fold)}
  for(const side of [-1,1]){group.add(limb(v(side*.13,.26,0),v(side*.14,.13,-.44),.085,robe));const shin=limb(v(side*.14,.13,-.44),v(side*.14,.10,-.62),.04,skin);shin.name='cave-prisoner-shin';group.add(shin);const foot=mesh(new THREE.SphereGeometry(.07,10,8),skin,side*.14,.083502851,-.65);foot.scale.set(.8,.5,1.45);foot.name='cave-prisoner-foot';group.add(foot);group.add(limb(v(side*.2,.59,0),v(side*.26,.23,-.22),.06,skin));const hand=mesh(new THREE.SphereGeometry(.055,10,8),skin,side*.26,.23,-.22);hand.name=side===1?'cave-bound-hand':'cave-other-hand';group.add(hand);group.add(mesh(new THREE.SphereGeometry(.022,8,6),hair,side*.06,.89,-.17))}return group}
 const chainMaterial=mat(0x49524b),chainGeometry=new THREE.TorusGeometry(.065,.018,6,12),cuffGeometry=new THREE.TorusGeometry(.067,.014,6,12),plateGeometry=new THREE.BoxGeometry(.15,.16,.025),releasedLinks=[];let releasedCuff;
 for(let i=0;i<3;i++){
  const p=new THREE.Group();p.name=i===2?'cave-freed-person':'cave-prisoner';p.position.set(-2+i*1.4,0,1.1);root.add(p);people.push(p);
  const [robeColor,drapeColor]=[[0x697e77,0x80918a],[0xa78b59,0xbba071],[0xa56850,0xbd8268]][i];
  const seated=seatedPrisoner(robeColor,drapeColor);seated.name='cave-seated';seated.scale.setScalar(1.25);seated.position.y=.01937143625;p.add(seated);
  if(i===2){const upright=person(robeColor);upright.name='cave-standing';upright.scale.setScalar(1.25);upright.position.y=.05843443125;upright.rotation.y=Math.PI;
   const hairMaterial=upright.children[1].material,skinMaterial=upright.children[0].material;
   for(const side of [-1,1]){upright.add(mesh(new THREE.SphereGeometry(.022,8,6),hairMaterial,side*.06,1.15,.17));const ear=mesh(new THREE.SphereGeometry(.035,8,6),skinMaterial,side*.17,1.14,0);ear.scale.set(.6,1,.8);ear.name='cave-standing-ear';upright.add(ear)}
   const nose=mesh(new THREE.SphereGeometry(.04,8,6),skinMaterial,0,1.105,.18);nose.scale.set(.7,1.2,.8);nose.name='cave-standing-nose';upright.add(nose);
   const curlGeometry=new THREE.SphereGeometry(.032,8,6);for(let j=0;j<14;j++){const a=j*2.399963,r=.13*Math.sqrt((j+.5)/14),curl=mesh(curlGeometry,hairMaterial,Math.cos(a)*r,1.29+.025*Math.sin(j*1.3),-.03+Math.sin(a)*r);curl.name='cave-standing-curl';upright.add(curl)}
   // A shaped mantle follows the torso, continuing the seated figure's robe.
   const positions=[],indices=[],rows=9,cols=12;for(let row=0;row<=rows;row++){const t=row/rows;for(let col=0;col<=cols;col++){const u=col/cols*2-1,x=u*(.15+.07*t),y=.96-.62*t,z=.155+.06*t+.012*Math.cos(u*Math.PI*4);positions.push(x,y,z);if(row<rows&&col<cols){const n=row*(cols+1)+col;indices.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1)}}}
   const mantleGeometry=new THREE.BufferGeometry();mantleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));mantleGeometry.setIndex(indices);mantleGeometry.computeVertexNormals();const mantleMaterial=mat(drapeColor);mantleMaterial.side=THREE.DoubleSide;const mantle=mesh(mantleGeometry,mantleMaterial);mantle.name='cave-standing-mantle';upright.add(mantle);
   p.add(upright);standing.push(upright)}
  const anchor=mesh(new THREE.BoxGeometry(.8,.3,.32),mat(0x9a8b75),-2+i*1.4,.15,1.55);anchor.name='cave-anchor';root.add(anchor);
  const anchorX=-2+i*1.4,plate=mesh(plateGeometry,chainMaterial,anchorX,.22,1.38);plate.name='cave-chain-plate';root.add(plate);
  for(let j=0;j<9;j++){const u=j/8,link=mesh(chainGeometry,chainMaterial,anchorX+.325*u,.22+.08687143625*u,1.38-.555*u);link.rotation.x=j%2?Math.PI/2:0;link.name=i===2?'cave-freed-chain':'cave-chain';root.add(link);if(i===2)releasedLinks.push(link)}
  const cuff=mesh(cuffGeometry,chainMaterial,anchorX+.325,.30687143625,.825);cuff.name=i===2?'cave-loose-cuff':'cave-restraint-cuff';root.add(cuff);if(i===2)releasedCuff=cuff;
 }
 const fire=new THREE.Group();fire.name='cave-fire';fire.position.set(2.7,.16,.3);root.add(fire);
 function flameGeometry(radius,height,bend){const positions=[],indices=[],rows=16,sides=12;for(let j=0;j<=rows;j++){const t=j/rows,r=radius*Math.pow(1-t,.72)*(.65+.35*Math.sin(Math.PI*t));for(let i=0;i<=sides;i++){const a=i/sides*Math.PI*2;positions.push(Math.cos(a)*r+bend*t*t,height*t,Math.sin(a)*r*.8);if(j<rows&&i<sides){const n=j*(sides+1)+i;indices.push(n,n+sides+1,n+1,n+1,n+sides+1,n+sides+2)}}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry}
 for(const [radius,height,color,x,z,bend] of [[.26,.84,0xc56d36,-.08,0,.13],[.21,.72,0xd88038,.10,-.03,-.12],[.15,.62,0xe9aa4c,-.09,.12,-.08],[.12,.48,0xf3cf79,.08,.13,.06],[.09,.56,0xebae51,0,-.12,.08]]){const flame=mesh(flameGeometry(radius,height,bend),mat(color),x,0,z);flame.name='cave-flame-tongue';flame.material.emissive.setHex(color);flame.material.emissiveIntensity=.18;fire.add(flame)}
 const fireLight=new THREE.PointLight(0xff9b4a,8,6,2);fireLight.name='cave-fire-light';fireLight.position.set(2.7,.9,.3);root.add(fireLight);
 // The brazier is a separate static object so the animated fire remains controllable.
 const brazier=mesh(new THREE.CylinderGeometry(.43,.3,.12,16),mat(0x574940),2.7,.10,.3);brazier.name='cave-brazier';root.add(brazier);
 const fireRim=mesh(new THREE.TorusGeometry(.4,.035,6,24),mat(0x6a5746),2.7,.16,.3);fireRim.rotation.x=Math.PI/2;root.add(fireRim);
 // Props are sculptural cues for the silhouettes, not a claim of a simulated projection.
 const propWall=mesh(new THREE.BoxGeometry(1.58,.4,.6),mat(0x9a8b75),1.65,.28,-1.05);propWall.name='cave-prop-wall';root.add(propWall);
 const mortar=mat(0x827765);for(const y of [.19,.37])root.add(mesh(new THREE.BoxGeometry(1.54,.014,.012),mortar,1.65,y,-.744));for(const [x,y] of [[1.25,.28],[1.75,.28],[2.2,.28],[1.48,.1],[2.0,.1]])root.add(mesh(new THREE.BoxGeometry(.015,.16,.012),mortar,x,y,-.744));
 const stand=mesh(new THREE.BoxGeometry(.78,.1,.55),mat(0x9a8b75),1.3,.53,-1.05);stand.name='cave-prop-stand';root.add(stand);
 for(const x of [.98,1.62])for(const z of [-1.25,-.85])root.add(mesh(new THREE.BoxGeometry(.09,.48,.09),mat(0x756551),x,.27,z));
 const vase=mesh(new THREE.SphereGeometry(.18,12,10),gold,1.1,.805,-1.05);vase.scale.set(.8,1.25,.8);root.add(vase);root.add(mesh(new THREE.CylinderGeometry(.075,.11,.16,12),gold,1.1,1.075,-1.05));
 const token=mesh(new THREE.CylinderGeometry(.18,.18,.035,16),gold,1.5,.85,-1.05);token.rotation.x=Math.PI/2;root.add(token);root.add(mesh(new THREE.CylinderGeometry(.025,.025,.3,8),gold,1.5,.68,-1.05));
 const horseShim=mesh(new THREE.BoxGeometry(.58,.01,.34),mat(0x9a8b75),2.05,.485,-1.05);horseShim.name='cave-horse-shim';root.add(horseShim);
 const horsePedestal=mesh(new THREE.BoxGeometry(.58,.08,.34),mat(0x9a8b75),2.05,.53,-1.05);horsePedestal.name='cave-horse-pedestal';root.add(horsePedestal);for(const x of [1.82,2.28])root.add(mesh(new THREE.BoxGeometry(.08,.45,.08),mat(0x756551),x,.265,-1.05));
 const horse=mesh(new THREE.ExtrudeGeometry(outline(horseOutline),{depth:.09,bevelEnabled:false}),gold,2.05,.57,-1.095);horse.name='cave-horse-prop';horse.scale.setScalar(.4);root.add(horse);
 // A distant landscape sits behind the opening; it cannot obstruct the cave
 // shadows or the moving figure and is visible through the existing stone jamb.
 const outside=new THREE.Group();outside.name='cave-outside-view';outside.position.set(2.88,0,-2.02);outside.scale.x=1.05;root.add(outside);
 const skyGeometry=new THREE.PlaneGeometry(.94,3.08),skyColors=[];const skyPosition=skyGeometry.getAttribute('position');for(let i=0;i<skyPosition.count;i++){const top=skyPosition.getY(i)>0,c=new THREE.Color(top?0x9ebfc3:0xe3d5ac);skyColors.push(c.r,c.g,c.b)}skyGeometry.setAttribute('color',new THREE.Float32BufferAttribute(skyColors,3));const sky=mesh(skyGeometry,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide}),.47,1.62,0);sky.name='cave-outside-sky';sky.castShadow=false;outside.add(sky);
 for(const [height,color,depth] of [[1.08,0x9ba68d,.01],[.72,0x7e9877,.02],[.42,0x718c64,.03]]){const profile=new THREE.Shape();profile.moveTo(0,0);profile.lineTo(0,height*.65);profile.lineTo(.22,height);profile.lineTo(.48,height*.68);profile.lineTo(.68,height*.91);profile.lineTo(.94,height*.53);profile.lineTo(.94,0);profile.closePath();const ridge=mesh(new THREE.ShapeGeometry(profile),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}),0,.08,depth);ridge.name='cave-outside-ridge';ridge.castShadow=false;outside.add(ridge)}
 for(const [x,h] of [[.55,.55],[.72,.75],[.84,.48]]){const tree=mesh(new THREE.ConeGeometry(.075,h,6),mat(0x647c5d),x,.45+h/2,.04);tree.name='cave-outside-tree';tree.castShadow=false;outside.add(tree)}
 const sun=mesh(new THREE.SphereGeometry(.28,20,16),mat(0xd8ad6c),3.55,2.8,-1.95);sun.name='cave-daylight';root.add(sun);
 const daylight=new THREE.PointLight(0xffdd98,0,5,2);daylight.name='cave-daylight-light';daylight.position.set(3.55,2.8,-1.55);root.add(daylight);
 // Solid risers meet the cave floor and each other rather than floating above it.
 for(let i=0;i<5;i++){const height=.065+i*.11;const step=mesh(new THREE.BoxGeometry(.75,height,.4),mat(0xb8a98e),3.7,.08+height/2,1.9-i*.4);step.name='cave-exit-step';root.add(step)}
 // The exposed right jamb and lintel frame the opening while keeping the stairs visible.
 // A continuous stone core supports the irregular facing rocks of the exit jamb.
 const jamb=new THREE.Shape();jamb.moveTo(3.88,.08);jamb.lineTo(4.25,.08);jamb.lineTo(4.28,.75);jamb.lineTo(4.24,1.5);jamb.lineTo(4.27,2.3);jamb.lineTo(4.2,3.05);jamb.lineTo(4.03,3.45);jamb.lineTo(3.3,3.53);jamb.lineTo(3.28,3.18);jamb.lineTo(3.8,3.14);jamb.lineTo(3.88,2.85);jamb.closePath();
 const jambMesh=mesh(new THREE.ExtrudeGeometry(jamb,{depth:.38,bevelEnabled:false}),rock,0,0,-1.94);jambMesh.name='cave-exit-jamb';root.add(jambMesh);
 for(const [x,y,z,sx,sy,sz,angle] of [[4.16,.46,-1.65,.34,.57,.48,.15],[4.13,1.35,-1.7,.3,.52,.43,-.12],[4.12,2.2,-1.72,.32,.53,.43,.12],[4.02,2.94,-1.73,.38,.49,.43,-.2],[3.7,3.38,-1.75,.53,.3,.43,.18]]){const stone=mesh(rockGeometry,rock,x,y,z);stone.scale.set(sx,sy,sz);stone.rotation.z=angle;stone.name='cave-exit-rock';root.add(stone)}
 // An olive vine clings to the outer lintel and jamb, framing the daylight
 // without crossing the view through the opening or the shadow wall.
 const vineMaterial=mat(0x6b7050),vineLeaf=mat(0x819064),vinePoints=[[3.15,3.54,-1.39],[3.53,3.63,-1.38],[3.92,3.48,-1.35],[4.24,3.15,-1.35],[4.33,2.77,-1.36]].map(p=>new THREE.Vector3(...p));
 const vineCurve=new THREE.CatmullRomCurve3(vinePoints),vine=mesh(new THREE.TubeGeometry(vineCurve,32,.025,6,false),vineMaterial);vine.name='cave-exit-vine';root.add(vine);
 const leafGeometry=new THREE.SphereGeometry(1,8,6);
 for(let i=0;i<22;i++){const t=(i+.5)/22,p=vineCurve.getPoint(t),tangent=vineCurve.getTangent(t),side=i%2?1:-1,leaf=mesh(leafGeometry,vineLeaf,p.x-tangent.y*.12*side,p.y+tangent.x*.12*side,p.z+.025);leaf.name='cave-exit-leaf';leaf.scale.set(.055,.16,.035);leaf.rotation.z=Math.atan2(tangent.y,tangent.x)-Math.PI/2+side*.7;root.add(leaf)}
 return lifecycle(scene,root,(t,value)=>{people[2].position.x=.8+value*2.22;people[2].position.z=1.1+value*1.02;people[2].getObjectByName('cave-seated').visible=value<.12;standing[0].visible=value>=.12;standing[0].rotation.y=Math.PI-value*Math.PI/2;const release=THREE.MathUtils.smoothstep(value,.12,.32);releasedLinks.forEach((link,i)=>{const u=i/8;link.position.y=THREE.MathUtils.lerp(.22+.08687143625*u,.22-.057*u,release)});releasedCuff.position.y=THREE.MathUtils.lerp(.30687143625,.161,release);sun.material.emissive.setHex(0x806032);sun.material.emissiveIntensity=value;daylight.intensity=value*7;fireLight.intensity=8+Math.sin(t*4)*.6;fire.scale.y=1+Math.sin(t*4)*.1});
}
export function buildShip(scene){
 const root=base(scene),dark=mat(0x594534);
 const waterBase=mesh(new THREE.CylinderGeometry(4.7,4.7,.08,64),mat(0x839f99),0,-.10,0);waterBase.name='ship-water-base';root.add(waterBase);
 // A shallow sculpted sea stays flat beneath the ship's footprint.
 const seaHeight=(x,z)=>{const d=Math.hypot(x/3.4,z/2.15),blend=THREE.MathUtils.smoothstep(d,1.04,1.3),phase=x*3.9+z*5.4+.55*Math.sin(x*.9)+.35*Math.sin(z*1.2),swell=.065+.08*Math.sin(phase)+.012*Math.sin(z*5-x*1.3),ripples=.018*Math.sin(x*5.3-z*4.8)+.009*Math.sin(z*7.2+x*3.1);return .04+blend*(swell+ripples)};
 const shore=[[-3.9,1.45,.34],[-3.62,1.94,.39],[-3.27,2.46,.42],[-2.83,2.91,.38],[-2.34,3.36,.37],[-1.83,3.65,.32]];
 const seaPositions=[],seaColors=[],seaIndices=[],rings=48,around=128;
 for(let j=0;j<=rings;j++){const r=4.7*j/rings;for(let i=0;i<=around;i++){const a=i*Math.PI*2/around,x=Math.cos(a)*r,z=Math.sin(a)*r,y=seaHeight(x,z);seaPositions.push(x,y,z);const c=new THREE.Color(0x497e78).multiplyScalar(.95+(y-.04)*2.2);seaColors.push(c.r,c.g,c.b);if(j<rings&&i<around){const n=j*(around+1)+i;seaIndices.push(n,n+1,n+around+1,n+1,n+around+2,n+around+1)}}}
 const seaGeometry=new THREE.BufferGeometry();seaGeometry.setAttribute('position',new THREE.Float32BufferAttribute(seaPositions,3));seaGeometry.setAttribute('color',new THREE.Float32BufferAttribute(seaColors,3));seaGeometry.setIndex(seaIndices);seaGeometry.computeVertexNormals();const seaMaterial=mat(0xffffff);seaMaterial.vertexColors=true;seaMaterial.side=THREE.DoubleSide;const sea=mesh(seaGeometry,seaMaterial);sea.name='ship-sea-surface';sea.castShadow=false;root.add(sea);
 // Close the wavy perimeter down to the water base, avoiding a floating edge.
 const edgePositions=[],edgeIndices=[];for(let i=0;i<=around;i++){const a=i*Math.PI*2/around,x=4.7*Math.cos(a),z=4.7*Math.sin(a);edgePositions.push(x,seaHeight(x,z),z,x,-.06,z);if(i<around){const n=i*2;edgeIndices.push(n,n+1,n+2,n+1,n+3,n+2)}}
 const edgeGeometry=new THREE.BufferGeometry();edgeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(edgePositions,3));edgeGeometry.setIndex(edgeIndices);edgeGeometry.computeVertexNormals();const edge=mesh(edgeGeometry,mat(0x497e78));edge.name='ship-sea-edge';edge.material.side=THREE.DoubleSide;edge.castShadow=false;root.add(edge);
 // Short pale crests follow the surface; they remain fixed as the ship rocks.
 const rippleMaterial=mat(0xc2d0c3);
 for(const [x,z,angle,scale] of [[-3.55,-1.1,.4,.9],[-2.6,-2.55,.15,1.2],[-.9,-2.7,-.3,.9],[1,-2.65,.2,1.15],[2.8,-2.15,.5,.9],[-3.95,.35,2,.85],[-1.9,2.55,2.7,1],[.3,2.6,3.1,1.3],[2.4,2.35,2.8,1.05],[3.6,.8,1.9,.8]]){const wave=[];for(let i=0;i<=12;i++){const u=(i/12-.5)*.65*scale,offset=.06*Math.cos(u*6),px=x+Math.cos(angle)*u-Math.sin(angle)*offset,pz=z+Math.sin(angle)*u+Math.cos(angle)*offset;wave.push(new THREE.Vector3(px,seaHeight(px,pz)+.012,pz))}const ripple=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wave),16,.018,5,false),rippleMaterial);ripple.name='ship-ripple';root.add(ripple)}
 // Irregular tapered foam ribbons trace several outer wave crests. They are
 // clipped away from the hull and from the circular edge of the water.
 const foamPositions=[],foamIndices=[];
 for(let k=-6;k<=6;k++)for(let chunk=0;chunk<9;chunk++){const start=-4.5+chunk,phase=Math.PI/2+k*Math.PI*2;let previous=-1;
  for(let i=0;i<=12;i++){const x=start+i/12*.82;let z=(phase-3.9*x-.55*Math.sin(x*.9))/5.4;for(let iteration=0;iteration<3;iteration++)z=(phase-3.9*x-.55*Math.sin(x*.9)-.35*Math.sin(z*1.2))/5.4;z+=.015*Math.sin(x*3+k);const width=.008+.06*Math.sin(Math.PI*i/12)**2*(.65+.35*Math.sin(i*2.4+k)**2),valid=zz=>Math.hypot(x/3.4,zz/2.15)>1.32&&Math.hypot(x,zz)<4.5&&!shore.some(([sx,sz,r])=>Math.hypot(x-sx,zz-sz)<r+.1);
   if(!valid(z-width)||!valid(z+width)){previous=-1;continue}const n=foamPositions.length/3;
   for(const sign of [-1,1]){const zz=z+sign*width;foamPositions.push(x,seaHeight(x,zz)+.008,zz)}if(previous>=0)foamIndices.push(previous,previous+1,n,previous+1,n+1,n);previous=n;
  }
 }
 const foamGeometry=new THREE.BufferGeometry();foamGeometry.setAttribute('position',new THREE.Float32BufferAttribute(foamPositions,3));foamGeometry.setIndex(foamIndices);foamGeometry.computeVertexNormals();const foamMaterial=new THREE.MeshStandardMaterial({color:0xc2d7c7,roughness:1,side:THREE.DoubleSide});const foam=mesh(foamGeometry,foamMaterial);foam.name='ship-wave-foam';foam.castShadow=false;root.add(foam);
 // A low rocky shore is fixed to the stage, outside the moving hull.
 const shoreGroup=new THREE.Group();shoreGroup.name='ship-rocky-shore';root.add(shoreGroup);const rockGeometry=new THREE.DodecahedronGeometry(1,0),rockMaterials=[mat(0xaaa28c),mat(0xbdb09a),mat(0x938f7f)];
 shore.forEach(([x,z,r],i)=>{const rock=mesh(rockGeometry,rockMaterials[i%3],x,seaHeight(x,z)+r*.27,z);rock.name='ship-shore-rock';rock.scale.set(r,r*(.7+(i%3)*.15),r*.83);rock.rotation.set(i*.31,i*.83,i*.17);shoreGroup.add(rock)});
 const twigMaterial=mat(0x726f4d),leafMaterial=mat(0x788460),leafGeometry=new THREE.SphereGeometry(.09,8,6);
 for(const [index,scale] of [[1,1],[4,.8]]){const [x,z,r]=shore[index],ground=seaHeight(x,z)+r*.48;for(let i=0;i<7;i++){const a=i*2.399963,start=new THREE.Vector3(x,ground,z),end=new THREE.Vector3(x+Math.cos(a)*.23*scale,ground+(.28+(i%3)*.1)*scale,z+Math.sin(a)*.23*scale),twig=limb(start,end,.016,twigMaterial);shoreGroup.add(twig);const leaf=mesh(leafGeometry,leafMaterial,end.x,end.y,end.z);leaf.name='ship-shore-leaf';leaf.scale.set(.65,1.35,.55);leaf.rotation.z=Math.cos(a)*.45;shoreGroup.add(leaf)}}
 const hull=new THREE.Group();hull.name='ship-hull';hull.position.y=-.14;hull.scale.set(1.15,1,.94);root.add(hull);
 const outline=new THREE.Shape();outline.moveTo(-3,0);outline.bezierCurveTo(-2.5,-1.6,-1.7,-1.9,0,-1.9);outline.bezierCurveTo(1.7,-1.9,2.5,-1.6,3,0);outline.bezierCurveTo(2.5,1.6,1.7,1.9,0,1.9);outline.bezierCurveTo(-1.7,1.9,-2.5,1.6,-3,0);
 const taper=y=>.72+.28*THREE.MathUtils.clamp((y-.3)/.62,0,1);
 const hullGeometry=new THREE.ExtrudeGeometry(outline,{depth:.62,bevelEnabled:true,bevelSize:.12,bevelThickness:.12,bevelSegments:1,curveSegments:12}),hullVertices=hullGeometry.getAttribute('position');
 for(let i=0;i<hullVertices.count;i++){const factor=taper(hullVertices.getZ(i)+.3);hullVertices.setXY(i,hullVertices.getX(i)*factor,hullVertices.getY(i)*factor)}hullGeometry.computeVertexNormals();
 const hullMesh=mesh(hullGeometry,mat(0x624534),0,.3,0);hullMesh.name='ship-hull-core';hullMesh.rotation.x=-Math.PI/2;hull.add(hullMesh);
 const hullSurface=(p,y,offset)=>{const length=Math.hypot(p.x,p.y)||1,factor=taper(y);return new THREE.Vector3(p.x*factor+offset*p.x/length,y,-p.y*factor-offset*p.y/length)};
 // Independent curved boards occupy five staggered courses. Their replacement
 // order is distributed around the hull so intermediate states show a mixed skin.
 // A single shared grain map follows each board's own length and remains
 // neutral so the replacement colours continue to communicate state.
 const grainWidth=256,grainHeight=64,grainData=new Uint8Array(grainWidth*grainHeight*4);
 for(let y=0;y<grainHeight;y++)for(let x=0;x<grainWidth;x++){const i=(y*grainWidth+x)*4,warp=2*Math.sin(x*.025)+.8*Math.sin(x*.11+y*.15),bands=Math.pow(Math.max(0,Math.sin((y+warp)*.68)),8),fine=((x*19+y*47+x*y*3)%17)/16,shade=Math.round(252-23*bands-7*fine);grainData[i]=shade;grainData[i+1]=shade;grainData[i+2]=shade;grainData[i+3]=255}
 const boardGrain=new THREE.DataTexture(grainData,grainWidth,grainHeight);boardGrain.wrapS=boardGrain.wrapT=THREE.RepeatWrapping;boardGrain.magFilter=THREE.LinearFilter;boardGrain.minFilter=THREE.LinearMipmapLinearFilter;boardGrain.generateMipmaps=true;boardGrain.colorSpace=THREE.SRGBColorSpace;boardGrain.needsUpdate=true;
 const points=outline.getSpacedPoints(120),courses=5,replacement=[],pegGeometry=new THREE.SphereGeometry(.025,8,6),pegMaterial=mat(0x493c31),hullSeamMaterial=new THREE.LineBasicMaterial({color:0x503a2c});
 for(let row=0;row<courses;row++)for(let board=0;board<12;board++){
  const start=(board*10+(row%2?5:0))%120,positions=[],uvs=[];
  for(let j=0;j<10;j++){
   const a=points[(start+j)%120],b=points[(start+j+1)%120],y0=.33+row*.1152,y1=y0+.105;
   const a0=hullSurface(a,y0,.16).toArray(),a1=hullSurface(a,y1,.16).toArray(),b0=hullSurface(b,y0,.16).toArray(),b1=hullSurface(b,y1,.16).toArray();
   positions.push(...a0,...b0,...b1,...a0,...b1,...a1);
   const u=j/10,next=(j+1)/10;uvs.push(u,0,next,0,next,1,u,0,next,1,u,1);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.computeVertexNormals();
  const panel=mesh(geometry,mat(0x76523c));panel.name='ship-side-planks';panel.material.map=boardGrain;panel.material.side=THREE.DoubleSide;panel.castShadow=false;panel.receiveShadow=false;hull.add(panel);replacement.push(panel);
  for(const offset of [1,9]){const peg=mesh(pegGeometry,pegMaterial);peg.position.copy(hullSurface(points[(start+offset)%120],.3825+row*.1152,.175));peg.name='ship-plank-peg';panel.add(peg)}
  const point=points[start],a=hullSurface(point,.335+row*.1152,.19),b=hullSurface(point,.43+row*.1152,.19),mid=a.clone().add(b).multiplyScalar(.5),seam=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a.sub(mid),b.sub(mid)]),hullSeamMaterial);seam.position.copy(mid);seam.name='ship-plank-joint';panel.add(seam);
 }
 const planks=[];for(let i=0;i<10;i++){const p=mesh(new THREE.BoxGeometry(4.8*Math.sqrt(1-Math.pow((i-4.5)*.36/2.05,2)),.12,.34),mat(0x9d7658),0,1.04,(i-4.5)*.36);p.name='ship-deck-plank';hull.add(p);planks.push(p)}
 const sailStretch=1.25,sailRise=1.85*(sailStretch-1),sailCenter=2.46+sailRise/2,sailYard=3.43+sailRise;hull.userData.sailRise=sailRise;
 const mast=mesh(new THREE.CylinderGeometry(.1,.14,3.75+sailRise,12),dark,0,2.475+sailRise/2,0);mast.name='ship-mast';hull.add(mast);
 // Curved cloth has a gathered foot and tapered lower corners.
 function sailPoint(x,y){const u=x/1.75,v=(y+.925)/1.85,lower=1-v,fold=.022*Math.sin(x*9)*Math.sin(Math.PI*v);return new THREE.Vector3(x*(1-.12*lower),(y+.28*(1-u*u)*lower**3)*sailStretch,.3*Math.cos(x/3.5*Math.PI)*Math.cos(y/1.85*Math.PI)+fold)}
 const geometry=new THREE.PlaneGeometry(3.5,1.85,24,32),pos=geometry.getAttribute('position'),colors=[];
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),p=sailPoint(x,y);pos.setXYZ(i,p.x,p.y,p.z);const band=Math.abs(y)>.64&&Math.abs(y)<.82;const c=new THREE.Color(band?0x647f70:0xe3d9c2);colors.push(c.r,c.g,c.b)}
 geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
 // Fine deterministic threads give the sail a woven surface while keeping
 // its broad coloured bands and curved geometry visible at a distance.
 const weaveSize=128,weaveData=new Uint8Array(weaveSize*weaveSize*4);for(let y=0;y<weaveSize;y++)for(let x=0;x<weaveSize;x++){const index=(y*weaveSize+x)*4,grain=((x*37+y*73+x*y*3)%17)-8,thread=(x%4===0?-10:0)+(y%5===0?-7:0),shade=THREE.MathUtils.clamp(249+grain+thread,0,255);weaveData[index]=shade;weaveData[index+1]=shade;weaveData[index+2]=shade;weaveData[index+3]=255}
 const weave=new THREE.DataTexture(weaveData,weaveSize,weaveSize);weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.repeat.set(3,2);weave.magFilter=THREE.LinearFilter;weave.minFilter=THREE.LinearMipmapLinearFilter;weave.generateMipmaps=true;weave.colorSpace=THREE.SRGBColorSpace;weave.needsUpdate=true;
 const sail=mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,map:weave,roughness:1,side:THREE.DoubleSide}),0,sailCenter,0);sail.name='ship-sail';sail.receiveShadow=false;hull.add(sail);
 // Curved end timbers and rope details stay in the same moving hull group.
 const timber=mat(0x73513a),rope=mat(0xb69467),seamMaterial=mat(0xc5b89e);
 // The masthead stays above the yard; paired stays brace its ends and all
 // parts live in hull coordinates so they follow the vessel's rocking.
 const masthead=new THREE.Vector3(0,4.18+sailRise,0);
 for(const side of [-1,1]){const stay=limb(masthead,new THREE.Vector3(side*1.72,sailYard,0),.018,rope);stay.name='ship-masthead-stay';hull.add(stay)}
 for(const y of [4.08,4.14,4.2]){const wrap=mesh(new THREE.TorusGeometry(.11,.018,6,20),rope,0,y+sailRise,0);wrap.rotation.x=Math.PI/2;wrap.name='ship-masthead-wrap';hull.add(wrap)}
 const gunwalePoints=points.slice(0,-1).map(p=>{const length=Math.hypot(p.x,p.y)||1;return new THREE.Vector3(p.x+.11*p.x/length,1.1,-p.y-.11*p.y/length)});
 const gunwale=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(gunwalePoints,true),160,.065,8,true),timber);gunwale.name='ship-gunwale';hull.add(gunwale);
 for(const side of [-1,1]){
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*2.65,.48,0),new THREE.Vector3(side*3.03,.78,0),new THREE.Vector3(side*3.12,1.17,0),new THREE.Vector3(side*3.03,1.54,0),new THREE.Vector3(side*2.83,1.65,0),new THREE.Vector3(side*2.7,1.59,0),new THREE.Vector3(side*2.72,1.48,0),new THREE.Vector3(side*2.82,1.48,0),new THREE.Vector3(side*2.86,1.54,0)]);
  const stem=mesh(new THREE.TubeGeometry(curve,48,.075,8,false),timber);stem.name='ship-end-timber';hull.add(stem);
 }
 for(const x of [-1.55,-1.03,-.51,0,.51,1.03,1.55]){
  const points=[];for(let i=0;i<=12;i++){const y=-.9+i*.15,p=sailPoint(x,y);p.z+=.012;points.push(p)}
  const seam=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),16,.009,5,false),seamMaterial);seam.name='ship-sail-seam';sail.add(seam);
  const lashing=mesh(new THREE.TorusGeometry(.08,.012,6,16),rope,x,sailYard,0);lashing.rotation.y=Math.PI/2;lashing.name='ship-sail-lashing';hull.add(lashing);
 }
 // Reinforced head and foot follow the curved cloth and move with the hull.
 for(const y of [-.925,.925]){const edge=[];for(let i=0;i<=24;i++){const p=sailPoint(-1.75+i*3.5/24,y);p.z+=.012;edge.push(p)}const hem=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge),36,.018,6,false),seamMaterial);hem.name='ship-sail-hem';sail.add(hem)}
 // Sheets connect the lower sail corners to fixed cleats on the moving deck.
 for(const side of [-1,1]){const foot=sailPoint(side*1.75,-.925).add(new THREE.Vector3(0,sailCenter,0)),cleat=new THREE.Vector3(side*2.05,1.13,.8),sheet=limb(foot,cleat,.018,rope);sheet.name='ship-sail-sheet';hull.add(sheet);const fitting=mesh(new THREE.BoxGeometry(.19,.05,.1),timber,cleat.x,1.125,cleat.z);fitting.name='ship-sheet-cleat';hull.add(fitting)}
 for(const [x,z] of [[-.6,.8],[.8,.8]]){const coil=mesh(new THREE.TorusGeometry(.27,.035,8,28),rope,x,1.135,z);coil.rotation.x=-Math.PI/2;coil.name='ship-rope-coil';hull.add(coil)}
 for(const y of [1.28,1.35,1.42]){const wrap=mesh(new THREE.TorusGeometry(.145,.024,6,20),rope,0,y,0);wrap.rotation.x=Math.PI/2;wrap.name='ship-mast-wrap';hull.add(wrap)}
 const amphora=mesh(new THREE.SphereGeometry(.2,16,12),mat(0xae6c4e),.75,1.31,-.7);amphora.scale.set(.8,1.05,.8);amphora.name='ship-amphora';hull.add(amphora);
 hull.add(mesh(new THREE.CylinderGeometry(.08,.11,.15,12),mat(0xae6c4e),.75,1.57,-.7));
 for(const side of [-1,1]){const handle=mesh(new THREE.TorusGeometry(.085,.018,6,20),amphora.material,.75+side*.17,1.48,-.7);handle.name='ship-amphora-handle';hull.add(handle)}
 const barrel=new THREE.Group();barrel.name='ship-barrel';barrel.position.set(1.5,1.1,.8);hull.add(barrel);barrel.add(mesh(new THREE.CylinderGeometry(.24,.28,.48,16),timber,0,.24,0));
 for(const [y,radius] of [[.08,.274],[.4,.247]]){const hoop=mesh(new THREE.TorusGeometry(radius,.018,8,20),dark,0,y,0);hoop.rotation.x=-Math.PI/2;hoop.name='ship-barrel-hoop';barrel.add(hoop)}
 for(let i=0;i<12;i++){const a=i*Math.PI/6,s=Math.sin(a),c=Math.cos(a),stave=limb(v(s*.274,.08,c*.274),v(s*.247,.4,c*.247),.008,dark);stave.name='ship-barrel-stave';barrel.add(stave)}
 const lid=mesh(new THREE.CylinderGeometry(.238,.238,.012,16),timber,0,.486,0);barrel.add(lid);
 const crate=new THREE.Group();crate.name='ship-crate';crate.position.set(-1.4,1.1,.7);hull.add(crate);crate.add(mesh(new THREE.BoxGeometry(.55,.35,.45),timber,0,.175,0));for(const x of [-.18,.18])crate.add(mesh(new THREE.BoxGeometry(.045,.018,.46),dark,x,.359,0));for(const x of [-.14,0,.14]){const joint=mesh(new THREE.BoxGeometry(.012,.32,.012),dark,x,.175,.23);joint.name='ship-crate-joint';crate.add(joint)}
 // A raised stern deck and low rail give the rear of the vessel its own
 // readable silhouette. The assembly moves with the hull and clears cargo.
 const stern=new THREE.Group();stern.name='ship-stern-platform';stern.position.set(-2.18,1.1,0);hull.add(stern);
 const platform=mesh(new THREE.BoxGeometry(.86,.18,1.12),timber,0,.09,0);platform.name='ship-stern-support';stern.add(platform);
 for(let i=0;i<6;i++){const plank=mesh(new THREE.BoxGeometry(.13,.06,1.12),mat(i%2?0x9b7658:0xa68160),-.35+i*.14,.21,0);plank.name='ship-stern-plank';stern.add(plank)}
 const railMaterial=mat(0x76543c);
 for(const z of [-.52,.52]){for(const x of [-.36,0,.36]){const post=mesh(new THREE.BoxGeometry(.065,.36,.065),railMaterial,x,.42,z);post.name='ship-stern-rail-post';stern.add(post)}const rail=mesh(new THREE.BoxGeometry(.86,.07,.08),railMaterial,0,.635,z);rail.name='ship-stern-rail';stern.add(rail)}
 {const rail=mesh(new THREE.BoxGeometry(.08,.07,1.12),railMaterial,-.39,.635,0);rail.name='ship-stern-rail';stern.add(rail)}
 // Deepen the hull above its waterline and raise the complete deck assembly.
 // The board skins, their pegs and joints share the same vertical stretch.
 const hullScale=1.4,waterline=.18,deckLift=(1.04-waterline)*(hullScale-1);hull.userData.deckLift=deckLift;
 for(const child of hull.children){
  if(child===hullMesh){child.scale.z=hullScale;child.position.y+=.12*(hullScale-1)}
  else if(child.name==='ship-side-planks'){child.scale.y=hullScale;child.position.y=waterline*(1-hullScale)}
  else if(child.name==='ship-end-timber'){const p=child.geometry.getAttribute('position');for(let i=0;i<p.count;i++){const y=p.getY(i);p.setY(i,y+(hullScale-1)*THREE.MathUtils.clamp(y-waterline,0,1.04-waterline))}child.geometry.computeVertexNormals()}
  else child.position.y+=deckLift;
 }
 return lifecycle(scene,root,(t,value)=>{const count=Math.round(value*planks.length);planks.forEach((p,i)=>p.material.color.setHex(i<count?0xd0b08a:0x9d7658));replacement.forEach((p,i)=>p.material.color.setHex((i*17)%replacement.length<Math.round(value*replacement.length)?0xc49a72:0x76523c));hull.rotation.z=Math.sin(t*.7)*.025});
}
export function buildVeil(scene){
 const root=base(scene),floor=mat(0xb2aa96),stone=mat(0xc7bba5),gold=mat(0xb48a5c),light=mat(0xe1d7c1);
 root.add(mesh(new THREE.CylinderGeometry(4.6,4.6,.12,48),floor,0,0,0));
 // Staggered stone paving carries the central mosaic out to the podiums.
 // A single shallow mesh keeps it below the existing stairs and furnishings.
 {const positions=[],colors=[],shades=[0xc6baa5,0xbeb29e,0xd0c3ad,0xc4b6a0];
  for(const [row,inner,outer,count] of [[0,1.56,2.52,24],[1,2.54,3.50,32],[2,3.52,4.54,40]])for(let i=0;i<count;i++){
   const step=Math.PI*2/count,start=(i+.5*(row%2))*step+.004,end=start+step-.008,color=new THREE.Color(shades[(i*7+row)%shades.length]);
   const point=(r,a)=>[r*Math.sin(a),.0605,r*Math.cos(a)],a=point(inner,start),b=point(outer,start),c=point(inner,end),d=point(outer,end);
   for(const p of [a,b,c,c,b,d]){positions.push(...p);colors.push(color.r,color.g,color.b)}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();const pavingMaterial=mat(0xffffff);pavingMaterial.vertexColors=true;pavingMaterial.side=THREE.DoubleSide;const paving=mesh(geometry,pavingMaterial);paving.name='veil-paving';paving.castShadow=false;root.add(paving);
 }
 const podiumGeometry=new THREE.CylinderGeometry(.78,.82,1,20),capGeometry=new THREE.CylinderGeometry(.85,.8,.12,20),seamGeometry=new THREE.BoxGeometry(.025,1,.025),stepGeometry=new THREE.BoxGeometry(.85,1,.28),capJointGeometry=new THREE.BoxGeometry(.012,.004,.64);
 const seamMaterial=mat(0xa99d89),woodPodium=mat(0x8c694c),woodCap=mat(0xa47e5a),woodJoint=mat(0x6d513c),robeColors=[0x879b91,0xa96e57,0x879487,0xbc8a64,0x738c8b,0xa3796b],skinColors=[0xcaa483,0xad7d60,0xd2b092,0x986f57,0xc19675,0xb58e76];
 const detailDark=mat(0x4e4036),beltMaterial=mat(0xb9a485),eyeGeometry=new THREE.SphereGeometry(.016,8,6),shoeGeometry=new THREE.SphereGeometry(.07,10,8),beltGeometry=new THREE.BoxGeometry(.27,.035,.025),foldGeometry=new THREE.CylinderGeometry(.008,.008,.4,6);
 // A shared fluted robe surface gives all six figures a folded silhouette.
 const robeGeometry=new THREE.CylinderGeometry(.15,.24,.72,48,12,false),robePositions=robeGeometry.getAttribute('position');
 for(let j=0;j<robePositions.count;j++){const x=robePositions.getX(j),y=robePositions.getY(j),z=robePositions.getZ(j),r=Math.hypot(x,z),a=Math.atan2(z,x),t=THREE.MathUtils.clamp((.36-y)/.72,0,1),variation=1+(.035+.065*t)*Math.cos(a*8+.3*Math.sin(t*Math.PI));robePositions.setXYZ(j,x*variation,y,z*variation)}robeGeometry.computeVertexNormals();
 const gestures=[[[-.25,.46,.07],[.17,.73,.19]],[[-.18,.70,.18],[.36,1,.12]],[[-.25,.46,.07],[.18,.67,.19]],[[-.14,.70,.18],[.14,.70,.18]],[[-.37,.88,.12],[.25,.46,.07]],[[-.25,.46,.07],[.32,.95,.12]]];
 for(let i=0;i<6;i++){
  const a=i*Math.PI/3,x=Math.sin(a)*3,z=Math.cos(a)*3,height=.22+i*.23;
  const podium=new THREE.Group();podium.name='veil-podium';podium.position.set(x,0,z);root.add(podium);
  const stationMaterial=i===0?woodPodium:stone,stationCap=i===0?woodCap:light,stationJoint=i===0?woodJoint:seamMaterial;
  const column=mesh(podiumGeometry,stationMaterial,0,height/2,0);column.scale.y=height;podium.add(column);
  const cap=mesh(capGeometry,stationCap,0,height+.06,0);cap.name='veil-podium-cap';podium.add(cap);
  // A short balustrade follows the outside of two stone platforms. The
  // open inner side leaves the figure, station object and stairs accessible.
  if(i===2||i===5){const points=[],railHeight=height+.48,r=.79,postGeometry=new THREE.CylinderGeometry(.035,.045,.34,10);for(let j=0;j<=6;j++){const angle=-.85+j*1.7/6,x=Math.sin(angle)*r,z=Math.cos(angle)*r,post=mesh(postGeometry,light,x,height+.29,z);post.name='veil-balustrade-post';podium.add(post)}for(let j=0;j<=24;j++){const angle=-.85+j*1.7/24;points.push(new THREE.Vector3(Math.sin(angle)*r,railHeight,Math.cos(angle)*r))}const rail=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.035,8,false),light);rail.name='veil-balustrade-rail';podium.add(rail)}
  if(i===0){const positions=[];for(const z of [-.6,-.3,0,.3,.6]){const extent=Math.sqrt(.83*.83-z*z);positions.push(-extent,height+.122,z,extent,height+.122,z)}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));const joints=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0x6d513c}));joints.name='veil-wood-plank-joints';podium.add(joints)}
  else for(let j=0;j<8;j++){const angle=j*Math.PI/4,joint=mesh(capJointGeometry,stationJoint,Math.sin(angle)*.43,height+.122,Math.cos(angle)*.43);joint.rotation.y=angle;joint.name='veil-cap-joint';joint.castShadow=false;podium.add(joint)}
  for(let j=0;j<12;j++){const angle=j*Math.PI/6,seam=mesh(seamGeometry,stationJoint,Math.sin(angle)*.799,height/2,Math.cos(angle)*.799);seam.rotation.y=angle;seam.scale.y=height*.9;podium.add(seam)}
  for(let j=1;j<Math.ceil(height/.25);j++){const course=mesh(new THREE.TorusGeometry(.8,.012,5,32),seamMaterial,0,j*height/Math.ceil(height/.25),0);course.rotation.x=Math.PI/2;podium.add(course)}
  // Leaves trail down the outward-facing masonry, away from the inward stairs.
  if(i===2||i===4||i===5){const vine=new THREE.Group();vine.name='veil-podium-vine';vine.rotation.y=a;podium.add(vine);
   const vineMaterial=mat(0x667d5f),leafGeometry=new THREE.SphereGeometry(1,7,5),leafMaterial=mat(0x82926b);
   for(const side of [-1,1]){const points=[];for(let j=0;j<=12;j++){const t=j/12,angle=side*(.48+.08*Math.sin(t*7+i));points.push(new THREE.Vector3(Math.sin(angle)*.805,height+.10-t*(height*.83),Math.cos(angle)*.805))}
    const stem=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,.012,5,false),vineMaterial);stem.name='veil-vine-stem';vine.add(stem);
    for(let j=1;j<12;j++){const p=points[j],leaf=mesh(leafGeometry,leafMaterial,p.x,p.y,p.z);leaf.name='veil-vine-leaf';leaf.scale.set(.07,.11,.035);leaf.rotation.set(.15,side*.48,side*(j%2?.55:-.55));vine.add(leaf)}
   }
  }
  // A shallow arched recess reads as masonry on the taller podiums; it is not a doorway.
  if(height>=.48){const openingHeight=height-.09,width=.38,rise=.12,facade=new THREE.Group();facade.rotation.y=a+Math.PI;podium.add(facade);
   const shape=new THREE.Shape();shape.moveTo(-width/2,.06);shape.lineTo(-width/2,openingHeight-rise);shape.quadraticCurveTo(-width/2,openingHeight,0,openingHeight);shape.quadraticCurveTo(width/2,openingHeight,width/2,openingHeight-rise);shape.lineTo(width/2,.06);shape.closePath();
   const recess=mesh(new THREE.ShapeGeometry(shape),mat(0x8b8172),0,0,-.806);recess.name='veil-podium-recess';recess.material.side=THREE.DoubleSide;facade.add(recess);
   const profile=new THREE.CatmullRomCurve3([new THREE.Vector3(-width/2,.06,-.813),new THREE.Vector3(-width/2,openingHeight-rise,-.813),new THREE.Vector3(-width*.35,openingHeight-.025,-.813),new THREE.Vector3(0,openingHeight,-.813),new THREE.Vector3(width*.35,openingHeight-.025,-.813),new THREE.Vector3(width/2,openingHeight-rise,-.813),new THREE.Vector3(width/2,.06,-.813)]);const trim=mesh(new THREE.TubeGeometry(profile,24,.025,6,false),light);trim.name='veil-podium-arch';facade.add(trim);
  }
  const stairs=new THREE.Group();stairs.name='veil-podium-stairs';stairs.rotation.y=a;podium.add(stairs);
  for(let j=0;j<5;j++){const stepHeight=(height+.12)*(j+1)/5,step=mesh(stepGeometry,stationMaterial,0,stepHeight/2,-1.18+j*.12);step.scale.y=stepHeight;stairs.add(step)}
  const p=person(robeColors[i]);p.children[2].geometry.dispose();p.children[2].geometry=robeGeometry;p.children[2].name='veil-folded-robe';p.children[0].material.color.setHex(skinColors[i]);p.children[1].scale.y=.58;p.children[1].material.color.setHex([0x4d3b30,0x403832,0x76665a,0x514031,0x595149,0x3f3530][i]);
  // Varied hair silhouettes keep the six people individually readable when
  // the curtain is lifted. These are appearance details, not status markers.
  const hairMaterial=p.children[1].material;
  if(i===0||i===3){const bun=mesh(new THREE.SphereGeometry(.09,10,8),hairMaterial,0,1.24,-.17);bun.scale.set(.85,.9,.7);bun.name='veil-hair-bun';p.add(bun)}
  if(i===1||i===4){const curls=new THREE.SphereGeometry(.037,8,6);for(let j=0;j<12;j++){const a=j*2.399963,r=.14*Math.sqrt((j+.5)/12),curl=mesh(curls,hairMaterial,Math.cos(a)*r,1.29+.025*Math.sin(j*1.3),-.03+Math.sin(a)*r);curl.name='veil-hair-curl';p.add(curl)}}
  if(i===2||i===5){const beard=mesh(new THREE.SphereGeometry(.12,12,8),hairMaterial,0,1.055,.105);beard.scale.set(.8,.85,.62);beard.name='veil-beard';p.add(beard)}
  for(const [index,side] of [[0,-1],[1,1]]){const arm=p.children[index?7:4],hand=p.children[index?8:5],start=v(side*.17,.88,0),end=new THREE.Vector3(...gestures[i][index]),delta=end.clone().sub(start);arm.position.copy(start).add(end).multiplyScalar(.5);arm.quaternion.setFromUnitVectors(v(0,1,0),delta.clone().normalize());arm.scale.y=delta.length()/arm.geometry.parameters.height;arm.name='veil-arm';hand.position.copy(end);hand.name='veil-hand'}
  for(const side of [-1,1]){const eye=mesh(eyeGeometry,detailDark,side*.06,1.16,.168);eye.name='veil-eye';p.add(eye);const shoe=mesh(shoeGeometry,detailDark,side*.14,-.014,.04);shoe.scale.set(.8,.3,1.3);shoe.name='veil-shoe';p.add(shoe);const fold=mesh(foldGeometry,beltMaterial,side*.08,.49,.204);fold.rotation.x=.1;fold.name='veil-robe-fold';p.add(fold)}
  // A folded shoulder mantle gives each figure a fuller silhouette without changing its gesture.
  const mantlePositions=[],mantleFaces=[],mantleRows=8,mantleCols=10;for(let row=0;row<=mantleRows;row++){const t=row/mantleRows;for(let col=0;col<=mantleCols;col++){const u=col/mantleCols*2-1;mantlePositions.push(u*(.16+.08*t),1-.63*t-.025*t*u,-.15-.08*t-.012*t*Math.cos(u*4*Math.PI));if(row<mantleRows&&col<mantleCols){const n=row*(mantleCols+1)+col;mantleFaces.push(n,n+mantleCols+1,n+1,n+1,n+mantleCols+1,n+mantleCols+2)}}}
  const mantleGeometry=new THREE.BufferGeometry();mantleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(mantlePositions,3));mantleGeometry.setIndex(mantleFaces);mantleGeometry.computeVertexNormals();const mantleMaterial=mat(new THREE.Color(robeColors[i]).multiplyScalar(.8));mantleMaterial.side=THREE.DoubleSide;const mantle=mesh(mantleGeometry,mantleMaterial);mantle.name='veil-mantle';p.add(mantle);
  const belt=mesh(beltGeometry,beltMaterial,0,.61,.187);belt.name='veil-belt';p.add(belt);p.name='veil-person';p.scale.setScalar(1.15);p.position.set(0,height+.12,0);p.rotation.y=a+Math.PI;podium.add(p);p.updateWorldMatrix(true,true);p.position.y+=height+.12-new THREE.Box3().setFromObject(p,true).min.y;
  // Distinct objects identify the stations without assigning status to a particular figure.
  const prop=new THREE.Group();prop.name='veil-station-object';prop.position.set(.62,height+.12,.05);podium.add(prop);
  if(i===0){const book=mesh(new THREE.BoxGeometry(.3,.075,.22),mat(0x755b49),0,.04,0);prop.add(book);prop.add(mesh(new THREE.BoxGeometry(.27,.028,.2),light,0,.08,0))}
  if(i===1){const vessel=mesh(new THREE.SphereGeometry(.13,12,8),mat(0xb87958),0,.13,0);vessel.scale.y=1.15;prop.add(vessel);prop.add(mesh(new THREE.CylinderGeometry(.05,.07,.1,10),mat(0xb87958),0,.29,0))}
  if(i===2){prop.add(mesh(new THREE.CylinderGeometry(.035,.035,.34,8),gold,0,.18,0));for(const dx of [-.07,0,.07]){const ear=mesh(new THREE.SphereGeometry(.055,8,6),mat(0xd2b175),dx,.34,0);ear.scale.y=1.8;prop.add(ear)}}
  if(i===3){prop.add(mesh(new THREE.CylinderGeometry(.045,.045,.3,8),mat(0x775c49),0,.15,0));prop.add(mesh(new THREE.BoxGeometry(.26,.11,.1),mat(0x535a56),0,.32,0))}
  if(i===4){const scroll=mesh(new THREE.CylinderGeometry(.07,.07,.3,10),light,0,.08,0);scroll.rotation.z=Math.PI/2;prop.add(scroll);for(const x of [-.15,.15]){const end=mesh(new THREE.SphereGeometry(.03,8,6),gold,x,.08,0);prop.add(end)}}
  if(i===5){prop.add(mesh(new THREE.CylinderGeometry(.035,.035,.31,8),gold,0,.16,0));prop.add(mesh(new THREE.BoxGeometry(.27,.035,.035),gold,0,.31,0));for(const x of [-.11,.11]){prop.add(mesh(new THREE.CylinderGeometry(.012,.012,.09,6),gold,x,.265,0));prop.add(mesh(new THREE.CylinderGeometry(.065,.04,.025,10),gold,x,.21,0))}}

 }
 const postGeometry=new THREE.CylinderGeometry(.055,.07,3.2,8),finialGeometry=new THREE.SphereGeometry(.1,12,8);
 const postBaseGeometry=new THREE.CylinderGeometry(.11,.13,.08,12),postCollarGeometry=new THREE.TorusGeometry(.075,.016,6,16);
 for(let i=0;i<12;i++){const a=i*Math.PI/6,x=Math.sin(a)*4,z=Math.cos(a)*4;root.add(mesh(postGeometry,gold,x,1.6,z));root.add(mesh(finialGeometry,gold,x,3.25,z));const foot=mesh(postBaseGeometry,gold,x,.04,z);foot.name='veil-post-base';root.add(foot);const collar=mesh(postCollarGeometry,gold,x,.11,z);collar.rotation.x=Math.PI/2;collar.name='veil-post-collar';root.add(collar)}
 const ring=mesh(new THREE.RingGeometry(1.48,1.54,64),gold,0,.07,0);ring.rotation.x=-Math.PI/2;root.add(ring);
 const inner=mesh(new THREE.RingGeometry(.58,.62,48),gold,0,.07,0);inner.rotation.x=-Math.PI/2;root.add(inner);
 const mosaic=mesh(new THREE.CircleGeometry(.52,48),mat(0x829b94),0,.071,0);mosaic.rotation.x=-Math.PI/2;mosaic.name='veil-mosaic';root.add(mosaic);
 const tileMaterials=[mat(0x8eaaa0),mat(0xb6c0aa)];for(let i=0;i<12;i++){const tile=mesh(new THREE.RingGeometry(.64,1.44,8,1,i*Math.PI/6,Math.PI/6),tileMaterials[i%2],0,.068,0);tile.rotation.x=-Math.PI/2;tile.name='veil-mosaic-tile';root.add(tile)}
 const spokeGeometry=new THREE.BoxGeometry(.025,.015,.82);
 for(let i=0;i<12;i++){const a=i*Math.PI/6,spoke=mesh(spokeGeometry,gold,Math.sin(a)*1.03,.072,Math.cos(a)*1.03);spoke.rotation.y=a;root.add(spoke)}
 // A pleated, double-sided curtain gathers upward while its top remains at the posts.
 const positions=[],indices=[],segments=96,rows=12;
 function curtainPoint(a,t,offset=0){const billow=.35*Math.sin(Math.PI*t)*(1+.25*Math.cos(a*3+.4)),r=4+.13*Math.sin(a*12)*(1-.3*t)+billow+offset,scallop=.45*t*t*(1-Math.cos(a*12))/2,y=-3.14*t+scallop;return new THREE.Vector3(r*Math.sin(a),y,r*Math.cos(a))}
 for(let row=0;row<=rows;row++){const t=row/rows;for(let i=0;i<=segments;i++){const a=i*Math.PI*2/segments;positions.push(...curtainPoint(a,t).toArray())}}
 for(let row=0;row<rows;row++)for(let i=0;i<segments;i++){const a=row*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1)}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const curtain=mesh(geometry,new THREE.MeshStandardMaterial({color:0xe8e2d0,transparent:true,opacity:.68,roughness:1,side:THREE.DoubleSide,depthWrite:false}),0,3.22,0);curtain.name='veil-curtain';curtain.receiveShadow=false;curtain.castShadow=false;root.add(curtain);
 // A shallow, translucent crown joins the top of the encircling fabric and
 // gathers with it. Its rim uses the same profile as the curtain's top row.
 {const vertices=[],faces=[],radial=16;for(let row=0;row<=radial;row++){const q=row/radial;for(let i=0;i<=segments;i++){const a=i*Math.PI*2/segments,edge=curtainPoint(a,0),height=.9*(1-q*q)+.12*q*(1-q)*Math.sin(a*3);vertices.push(edge.x*q,height,edge.z*q);if(row<radial&&i<segments){const n=row*(segments+1)+i;faces.push(n,n+segments+1,n+1,n+1,n+segments+1,n+segments+2)}}}const crownGeometry=new THREE.BufferGeometry();crownGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));crownGeometry.setIndex(faces);crownGeometry.computeVertexNormals();const crown=mesh(crownGeometry,new THREE.MeshStandardMaterial({color:0xeee3ca,transparent:true,opacity:.23,roughness:1,side:THREE.DoubleSide,depthWrite:false}));crown.name='veil-fabric-crown';crown.castShadow=false;crown.receiveShadow=false;curtain.add(crown)}
 const hemPoints=[];for(let i=0;i<segments;i++)hemPoints.push(curtainPoint(i*Math.PI*2/segments,1));
 const hem=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hemPoints,true),segments,.018,6,true),new THREE.MeshStandardMaterial({color:0xd9c6a6,transparent:true,opacity:.65,depthWrite:false}));hem.name='veil-hem';hem.castShadow=false;curtain.add(hem);
 const seamMaterialCloth=new THREE.MeshStandardMaterial({color:0xe9d9bd,transparent:true,opacity:.38,roughness:1,depthWrite:false});for(let i=0;i<12;i++){const a=i*Math.PI/6,points=[];for(let j=0;j<=24;j++)points.push(curtainPoint(a,j/24,.008));const seam=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.012,5,false),seamMaterialCloth);seam.name='veil-cloth-seam';seam.castShadow=false;curtain.add(seam)}
 const crown=curtain.getObjectByName('veil-fabric-crown');
 return lifecycle(scene,root,(t,value)=>{curtain.scale.y=1-value*.9;curtain.material.opacity=.68-value*.46;crown.material.opacity=.23-value*.14;hem.material.opacity=.65-value*.43;seamMaterialCloth.opacity=.38-value*.22});
}
const sceneBuilders={'argument-frames':buildInteractiveScene,'time-frames':buildInteractiveScene,'emotion-orientation':buildInteractiveScene,'language-wall':buildInteractiveScene,pigeon:buildInteractiveScene,induction:buildInteractiveScene,schedules:buildInteractiveScene,stimulation:buildInteractiveScene,twins:buildInteractiveScene,sisyphus:buildSisyphusSwitchback,panopticon:buildPanopticon,cave:buildCave,ship:buildShip,veil:buildVeil,trolley:buildTrolley,vat:buildVat,'free-will':buildFreeWill,'chinese-room':buildChineseRoom,socratic:buildSocratic,newcomb:buildNewcomb,recurrence:buildRecurrence,butterfly:buildButterfly,monkey:buildMonkey};
export const builders=Object.fromEntries(Object.entries(sceneBuilders).map(([id,build])=>[id,(scene,...args)=>{
 const existing=new Set(scene.children),state=build(scene,...args),root=scene.children.find(child=>!existing.has(child));
 // The switchback scene includes its own terrain and vegetation; the legacy
 // cone-specific enrichment would intersect its road.
 const updateDetail=id==='sisyphus'?()=>{}:addSceneDetails(id,root),updateEnrichment=id==='sisyphus'?()=>{}:enrichScene(id,root);
 return {setInteraction(value){state.setInteraction?.(value)},update(t,value){state.update(t,value);updateDetail(t,value);updateEnrichment(t,value)},dispose(){state.dispose()}};
}]));


