import * as THREE from 'three';
import {disposeSceneGraph} from './dispose-scene.js';

// These are interpretive dioramas, not literal reconstructions of the arguments.
const material = color => new THREE.MeshStandardMaterial({color, roughness: 0.9});
const colors = {dark:0x414c46, light:0xded6c2, gold:0xc99a64, red:0xa75d4c, blue:0x789b9a, wood:0x8b6a50};
function part(parent, geometry, color, x=0, y=0, z=0) {
 const object = new THREE.Mesh(geometry, typeof color === 'number' ? material(color) : color);
 object.position.set(x,y,z); object.castShadow=true; object.receiveShadow=true; parent.add(object); return object;
}
const box=(p,w,h,d,c,x=0,y=0,z=0)=>part(p,new THREE.BoxGeometry(w,h,d),c,x,y,z);
const ball=(p,r,c,x=0,y=0,z=0)=>part(p,new THREE.SphereGeometry(r,16,12),c,x,y,z);
const cylinder=(p,r,h,c,x=0,y=0,z=0)=>part(p,new THREE.CylinderGeometry(r,r,h,20),c,x,y,z);
function figure(parent,x,z,color=colors.gold) {
 const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
 const skin=0xc9a17f,hair=0x50443a;
 ball(g,.19,skin,0,1.28,0);const cap=ball(g,.18,hair,0,1.37,-.025);cap.scale.y=.55;
 part(g,new THREE.CylinderGeometry(.16,.23,.72,12),color,0,.75,0);
 for(const side of [-1,1]){box(g,.12,.48,.13,skin,side*.11,.23,0);box(g,.1,.5,.1,color,side*.25,.8,0);ball(g,.06,skin,side*.25,.53,0)}
 return g;
}
function stage(scene,radius=5.2) {
 const root=new THREE.Group();scene.add(root);cylinder(root,radius,.25,colors.dark,0,-.14,0);
 return root;
}
function done(scene,root,update){return {update,dispose(){scene.remove(root);disposeSceneGraph(root)}}}

// A smooth, schematic junction shared by the rails and the moving tram.
export function trolleyCurve(x,branch){
 const q=Math.max(0,Math.min(1,(x+1.4)/2.2));
 return {z:branch*1.5*q*q*(3-2*q),slope:branch*1.5*6*q*(1-q)/2.2};
}
export function buildTrolley(scene){
 const root=stage(scene),rail=material(colors.light),tie=material(colors.wood);
 cylinder(root,5,.06,0x78836c,0,.01,0);
 const branches=[];
 function railLine(start,end,side,branch,mat){
  const points=[];for(let i=0;i<=36;i++){const x=start+(end-start)*i/36,{z,slope}=branch?trolleyCurve(x,branch):{z:0,slope:0},normal=Math.hypot(1,slope);points.push(new THREE.Vector3(x-side*.3*slope/normal,.12,z+side*.3/normal));}
  return part(root,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),72,.045,6,false),mat);
 }
 for(const side of [-1,1])railLine(-4,-1.4,side,0,rail);
 for(let branchIndex=0;branchIndex<2;branchIndex++){
  const branch=branchIndex===0?-1:1,group=new THREE.Group();group.name=`trolley-branch-${branchIndex}`;root.add(group);
  for(const side of [-1,1]){const m=material(colors.light),line=railLine(-1.4,4,side,branch,m);root.remove(line);group.add(line)}branches.push(group);
 }
 function sleepers(start,end,branch){for(let x=start;x<end;x+=.45){const {z,slope}=branch?trolleyCurve(x,branch):{z:0,slope:0};const sleeper=box(root,.11,.06,.82,tie,x,.06,z);sleeper.rotation.y=-Math.atan(slope);sleeper.name='trolley-sleeper'}}
 function ballast(start,end,branch,height){const vertices=[],indices=[];for(let i=0;i<=48;i++){const x=start+(end-start)*i/48,{z,slope}=branch?trolleyCurve(x,branch):{z:0,slope:0},normal=Math.hypot(1,slope);for(const side of [-1,1])vertices.push(x-side*.5*slope/normal,height,z+side*.5/normal);if(i<48){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const surface=material(0x9b9985);surface.side=THREE.DoubleSide;const strip=part(root,geometry,surface);strip.name='trolley-ballast'}
 ballast(-4,-1.4,0,.045);ballast(-1.4,4,-1,.046);ballast(-1.4,4,1,.047);
 sleepers(-3.9,-1.4,0);sleepers(-1.25,4,-1);sleepers(-1.25,4,1);
 // Low gravel sits at the outside edge of the track bed, below the running gear.
 const gravelGeometry=new THREE.DodecahedronGeometry(.035,0),gravelMaterial=material(0xb5ad96);
 for(const [start,end,branch] of [[-3.8,-1.45,0],[-1.2,3.9,-1],[-1.2,3.9,1]])for(let x=start,index=0;x<end;x+=.22,index++){
  const {z,slope}=branch?trolleyCurve(x,branch):{z:0,slope:0},normal=Math.hypot(1,slope);
  for(const side of [-1,1]){const offset=side*(.45+(index%3)*.025),stone=part(root,gravelGeometry,gravelMaterial,x-offset*slope/normal,.048,z+offset/normal);stone.name='trolley-gravel';stone.scale.y=.55;stone.castShadow=false}
 }
 // Fine grasses occupy open ground beyond the track bed and switch. Each
 // clump is checked against sampled rail centerlines before being placed.
 {const centers=[];for(let i=0;i<=160;i++){const x=-4+i*8/160;if(x<=-1.4)centers.push([x,0]);else for(const branch of [-1,1])centers.push([x,trolleyCurve(x,branch).z])}const sites=[];
  for(let i=0;i<1800&&sites.length<90;i++){const a=i*2.399963,r=1.35+3.4*((i*617%1799)/1799),x=Math.cos(a)*r,z=Math.sin(a)*r;if(centers.some(([cx,cz])=>Math.hypot(x-cx,z-cz)<.82)||Math.hypot(x+1,z-2.25)<.85||Math.hypot(x+3.15,z+3.15)<.9||Math.hypot(x,z+3.1)<1.05||Math.hypot(x-1.65,z+3.25)<.8)continue;sites.push([x,z,i])}
  const blades=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,5),material(0x71835d),sites.length*4),dummy=new THREE.Object3D();blades.name='trolley-meadow-grass';let n=0;for(const [x,z,seed] of sites)for(let j=0;j<4;j++){const a=seed*.7+j*Math.PI/2,height=.14+.035*((seed+j)%4);dummy.position.set(x+Math.cos(a)*.055,.04+height/2,z+Math.sin(a)*.055);dummy.rotation.set(.2*Math.sin(a),a,-.2*Math.cos(a));dummy.scale.set(.035,height,.025);dummy.updateMatrix();blades.setMatrixAt(n++,dummy.matrix)}blades.computeBoundingSphere();blades.castShadow=false;root.add(blades)
 }
 const cart=new THREE.Group();cart.name='trolley-cart';root.add(cart);
 box(cart,1.4,.26,.76,colors.dark,0,.48,0);box(cart,1.35,.56,.72,0x4d7168,0,.82,0);box(cart,1.4,.13,.78,colors.wood,0,1.17,0);box(cart,1.48,.12,.82,colors.dark,0,1.62,0);
 const glass=new THREE.MeshStandardMaterial({color:0xd3d8c1,transparent:true,opacity:.25,roughness:.25,side:THREE.DoubleSide,depthWrite:false}),windowShape=new THREE.Shape();windowShape.moveTo(-.18,-.185);windowShape.lineTo(-.18,.005);windowShape.quadraticCurveTo(-.18,.185,0,.185);windowShape.quadraticCurveTo(.18,.185,.18,.005);windowShape.lineTo(.18,-.185);windowShape.closePath();
 const windowGeometry=new THREE.ShapeGeometry(windowShape,16),windowFrame=new THREE.TorusGeometry(.18,.018,6,20,Math.PI),windowWood=material(colors.wood);glass.side=THREE.DoubleSide;
 for(const z of [-.386,.386])for(const x of [-.45,0,.45]){const pane=part(cart,windowGeometry,glass,x,1.38,z);pane.name='trolley-side-window';const arch=part(cart,windowFrame,windowWood,x,1.385,z+Math.sign(z)*.012);arch.name='trolley-window-arch';for(const dx of [-.18,.18])box(cart,.035,.19,.035,windowWood,x+dx,1.29,z);box(cart,.36,.035,.035,windowWood,x,1.195,z)}
 for(const x of [-.68,.68])box(cart,.025,.37,.55,glass,x,1.38,0);
 // Paired benches sit behind the translucent panes and travel with the body.
 {const interior=new THREE.Group();interior.name='trolley-interior';cart.add(interior);for(const z of [-.23,.23]){const seat=box(interior,1.12,.06,.22,0x9c7050,0,1.19,z);seat.name='trolley-interior-seat';const back=box(interior,1.12,.22,.045,0x805b43,0,1.32,z+Math.sign(z)*.075);back.name='trolley-interior-back';for(const x of [-.47,-.235,0,.235,.47]){const slat=box(interior,.035,.2,.052,0xb1855d,x,1.32,z+Math.sign(z)*.08);slat.name='trolley-interior-slat'}}}
 const bogies=[];for(const offset of [-.56,.56]){const bogie=new THREE.Group();bogie.name='trolley-bogie';bogie.userData.offset=offset;cart.add(bogie);bogies.push(bogie);
  for(const side of [-1,1]){const wheel=cylinder(bogie,.2,.1,colors.dark,0,.365,side*.3);wheel.rotation.x=Math.PI/2;wheel.name='trolley-wheel';const hub=cylinder(bogie,.085,.025,colors.gold,0,.365,side*.3625);hub.rotation.x=Math.PI/2;hub.name='trolley-wheel-hub'}
 }
 for(const x of [-.73,.73]){const bumper=box(cart,.12,.11,.9,colors.wood,x,.41,0);bumper.name='trolley-bumper';for(const z of [-.27,.27])ball(cart,.035,colors.gold,x*1.09,.41,z)}
 for(const side of [-1,1]){box(cart,1.12,.035,.025,colors.gold,0,.68,side*.372);box(cart,1.12,.035,.025,colors.gold,0,.99,side*.372)}
 ball(cart,.12,0xe2c17b,.72,.8,0);const headlightRim=part(cart,new THREE.TorusGeometry(.13,.018,6,24),colors.gold,.82,.8,0);headlightRim.rotation.y=Math.PI/2;headlightRim.name='trolley-headlight-rim';
 // Roof crown, window framing and a compact collector move with the tram.
 const roofVertices=[],roofIndices=[];for(let i=0;i<=12;i++){const z=-.41+i*.82/12,y=1.68+.14*Math.cos(z/.41*Math.PI/2);roofVertices.push(-.74,y,z,.74,y,z);if(i<12){const n=i*2;roofIndices.push(n,n+2,n+1,n+1,n+2,n+3)}}
 const roofGeometry=new THREE.BufferGeometry();roofGeometry.setAttribute('position',new THREE.Float32BufferAttribute(roofVertices,3));roofGeometry.setIndex(roofIndices);roofGeometry.computeVertexNormals();const roofMaterial=material(0x526b62);roofMaterial.side=THREE.DoubleSide;const roof=part(cart,roofGeometry,roofMaterial);roof.name='trolley-roof';
 for(const x of [-.52,-.26,0,.26,.52]){const points=[];for(let i=0;i<=12;i++){const z=-.4+i*.8/12;points.push(new THREE.Vector3(x,1.688+.14*Math.cos(z/.41*Math.PI/2),z))}const seam=part(cart,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.008,5,false),0x789086);seam.name='trolley-roof-seam'}
 for(const z of [-.39,.39]){for(const x of [-.66,-.23,.23,.66])box(cart,.035,.43,.035,colors.wood,x,1.38,z);for(const y of [1.19,1.59])box(cart,1.34,.035,.035,colors.wood,0,y,z)}
 box(cart,.52,.08,.25,colors.wood,0,1.86,0);for(const x of [-.2,.2]){const bar=box(cart,.045,.45,.045,colors.gold,x,2.06,0);bar.rotation.z=x<0?-.35:.35}box(cart,.55,.045,.045,colors.dark,0,2.29,0);
 // Lengthen the body and its attached details as a unit, while keeping wheel
 // geometry circular and letting each axle independently follow the rails.
 for(const child of cart.children){if(bogies.includes(child))continue;child.position.x*=1.3;child.scale.x*=1.3}
 const coats=[0x72918b,0xb38c6a,0xa96551,0x637f77,0xc0a077],skins=[0xc9a17f,0xaf8061,0xd0ae90,0x946e58,0xba906f];
 const eyeGeometry=new THREE.SphereGeometry(.016,8,6),noseGeometry=new THREE.SphereGeometry(.025,8,6),shoeGeometry=new THREE.BoxGeometry(.12,.06,.22),beltGeometry=new THREE.CylinderGeometry(.205,.205,.035,12),detailInk=material(0x4d4035);
 const robeGeometry=new THREE.CylinderGeometry(.16,.22,1,40,10),robePositions=robeGeometry.getAttribute('position');for(let j=0;j<robePositions.count;j++){const x=robePositions.getX(j),y=robePositions.getY(j),z=robePositions.getZ(j),a=Math.atan2(z,x),t=.5-y,scale=1+(.025+.055*t)*Math.cos(8*a+.3*Math.sin(t*3));robePositions.setXYZ(j,x*scale,y,z*scale)}robeGeometry.computeVertexNormals();
 for(let i=0;i<6;i++){const p=figure(root,i<5?1.45+i*.45:2.35,i<5?-1.5:1.5,coats[i%5]);p.name=i<5?'trolley-group-person':'trolley-single-person';p.position.y=.1;p.rotation.y=-Math.PI/2;for(const child of p.children)if(child.material?.color?.getHex()===0xc9a17f)child.material.color.setHex(skins[i%5]);p.children[1].position.y=1.39;p.children[1].material.color.setHex([0x4c3b30,0x5a4839,0x7a7067,0x6b4534,0x40342e,0x5a4b40][i]);
  p.children[2].geometry.dispose();p.children[2].geometry=robeGeometry;p.children[2].position.y=.6;p.children[2].name='trolley-figure-robe';
  // Restrained hand poses distinguish the figures while staying within their track spacing.
  for(const [index,side] of [[0,-1],[1,1]]){const arm=p.children[index?7:4],hand=p.children[index?8:5],start=new THREE.Vector3(side*.2,1.04,0),end=new THREE.Vector3(side*(i%3===0?.17:i%3===1?.13:.12),i%3===2?.84:.67,i%3===0?.08:.16),delta=end.clone().sub(start);arm.position.copy(start).add(end).multiplyScalar(.5);arm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());arm.scale.y=delta.length()/.5;arm.name='trolley-figure-arm';hand.position.copy(end);hand.name='trolley-figure-hand'}
  // A diagonal mantle is part of each figure, so it follows its facing direction.
  {const side=i%2?1:-1,shape=new THREE.Shape();shape.moveTo(side*.16,1.06);shape.lineTo(-side*.13,.75);shape.lineTo(-side*.12,.37);shape.lineTo(side*.13,.45);shape.lineTo(side*.2,.95);shape.closePath();const cloth=material(new THREE.Color(coats[i%5]).multiplyScalar(i%2?.72:1.14));cloth.side=THREE.DoubleSide;const mantle=part(p,new THREE.ShapeGeometry(shape),cloth,0,0,.205);mantle.name='trolley-figure-mantle'}
  for(const side of [-1,1]){const eye=part(p,eyeGeometry,detailInk,side*.065,1.30,.177);eye.name='trolley-figure-eye';const shoe=part(p,shoeGeometry,detailInk,side*.11,.02,.035);shoe.name='trolley-figure-shoe'}
  const nose=part(p,noseGeometry,material(skins[i%5]),0,1.25,.187);nose.name='trolley-figure-nose';const belt=part(p,beltGeometry,material(new THREE.Color(coats[i%5]).multiplyScalar(.7)),0,.73,0);belt.name='trolley-figure-belt';
 }
 const switchHousing=new THREE.Group();switchHousing.name='trolley-switch-housing';switchHousing.position.set(-1,0,2.25);root.add(switchHousing);
 box(switchHousing,.58,.06,.48,colors.dark,0,.07,0);
 // Irregular paving marks a small operating area around the switch, leaving
 // its center open so the housing remains grounded on the lawn.
 {const shape=new THREE.Shape();shape.moveTo(-.21,-.15);shape.lineTo(-.13,-.21);shape.lineTo(.15,-.2);shape.lineTo(.22,-.11);shape.lineTo(.2,.15);shape.lineTo(.1,.21);shape.lineTo(-.17,.18);shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelThickness:.005,bevelSize:.008,bevelSegments:1});for(const [dx,dz,angle] of [[-.55,-.48,.15],[0,-.49,-.1],[.55,-.45,.08],[-.55,0,-.08],[.55,.02,.12],[-.55,.48,.06],[0,.49,-.1],[.55,.47,.14]]){const tile=part(root,geometry,0xbeb39d,-1+dx,.045,2.25+dz);tile.rotation.set(-Math.PI/2,0,angle);tile.name='trolley-switch-paving';tile.castShadow=false}}
 const guardShape=new THREE.Shape();guardShape.moveTo(-.22,.1);guardShape.lineTo(-.22,.18);guardShape.absarc(0,.18,.22,Math.PI,0,true);guardShape.lineTo(.22,.1);guardShape.closePath();
 const guard=part(switchHousing,new THREE.ExtrudeGeometry(guardShape,{depth:.16,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:2}),0x8f8068,0,0,-.08);guard.name='trolley-switch-guard';
 for(const z of [-.105,.105]){const bolt=part(switchHousing,new THREE.SphereGeometry(.045,10,8),colors.gold,0,.18,z);bolt.scale.z=.35}
 for(const x of [-.23,.23])for(const z of [-.18,.18]){const bolt=part(switchHousing,new THREE.CylinderGeometry(.025,.025,.015,10),colors.gold,x,.108,z);bolt.name='trolley-switch-base-bolt'}
 const lever=new THREE.Group();lever.name='trolley-lever';lever.position.set(-1,.12,2.25);root.add(lever);box(lever,.1,.85,.1,colors.gold,0,.425,0);ball(lever,.12,colors.red,0,.88,0);
 return done(scene,root,(t,value)=>{const branch=value<.5?-1:1,progress=(t*.12)%1,x=-3.4+progress*3.15,{z,slope}=trolleyCurve(x,branch);cart.position.set(x,0,z);cart.rotation.y=-Math.atan(slope);
  for(const bogie of bogies){const axleX=x+bogie.userData.offset/Math.hypot(1,slope),axle=trolleyCurve(axleX,branch),dx=axleX-x,dz=axle.z-z,cos=Math.cos(cart.rotation.y),sin=Math.sin(cart.rotation.y);bogie.position.set(cos*dx-sin*dz,0,sin*dx+cos*dz);bogie.rotation.y=-Math.atan(axle.slope)-cart.rotation.y}
  lever.rotation.z=branch*.55;branches.forEach((group,i)=>group.children.forEach(beam=>beam.material.color.setHex((value<.5?0:1)===i?colors.gold:colors.light)))});
}
export function buildVat(scene){
 const root=stage(scene),dark=material(colors.dark),metal=material(0xb68d60),tissue=material(0xd29a85),fold=material(0xe2ad96),cableMat=material(0x44514b);
 const floor=cylinder(root,4.95,.07,0x99978a,0,.02,0);floor.name='vat-floor';const pedestal=cylinder(root,1.86,.2,dark,0,.14,0);pedestal.name='vat-pedestal';cylinder(root,1.76,.12,metal,0,.29,0);
 // A low rug and fine paving joints give the apparatus a setting without raising obstacles.
 const rug=part(root,new THREE.RingGeometry(2.05,3.45,72,1,Math.PI,Math.PI),0xb88d76,0,.057,0);rug.rotation.x=-Math.PI/2;rug.name='vat-rug';rug.castShadow=false;rug.receiveShadow=false;
 const trimMaterial=material(0xc5a57f);for(const radius of [2.1,3.4]){const trim=part(root,new THREE.TorusGeometry(radius,.012,6,72,Math.PI),trimMaterial,0,.06,0);trim.rotation.x=Math.PI/2;trim.castShadow=false}
 const paving=[];for(let i=0;i<32;i++){const a=i*Math.PI*2/32;paving.push(Math.sin(a)*3.6,.058,Math.cos(a)*3.6,Math.sin(a)*4.85,.058,Math.cos(a)*4.85)}for(const radius of [4,4.45])for(let i=0;i<96;i++){const a=i*Math.PI*2/96,b=(i+1)*Math.PI*2/96;paving.push(Math.sin(a)*radius,.058,Math.cos(a)*radius,Math.sin(b)*radius,.058,Math.cos(b)*radius)}
 const pavingGeometry=new THREE.BufferGeometry();pavingGeometry.setAttribute('position',new THREE.Float32BufferAttribute(paving,3));const joints=new THREE.LineSegments(pavingGeometry,new THREE.LineBasicMaterial({color:0x7f7e70}));joints.name='vat-floor-joints';root.add(joints);
 for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2,clamp=box(root,.24,.3,.24,metal,Math.sin(a)*1.72,.24,Math.cos(a)*1.72);clamp.rotation.y=a;clamp.name='vat-base-clamp'}
 const glass=part(root,new THREE.CylinderGeometry(1.6,1.6,2.2,48,1,true),new THREE.MeshStandardMaterial({color:0x8dbab4,transparent:true,opacity:.18,roughness:.2,side:THREE.DoubleSide,depthWrite:false}),0,1.45,0);glass.name='vat-glass';glass.castShadow=false;glass.receiveShadow=false;
 // A separate faint liquid volume and tinted floor make the immersion visible
 // through the glass while leaving the brain and animated bubbles legible.
 const liquidVolume=part(root,new THREE.CylinderGeometry(1.54,1.54,1.94,48,1,true),new THREE.MeshStandardMaterial({color:0x8fc6b9,transparent:true,opacity:.14,roughness:.3,side:THREE.DoubleSide,depthWrite:false}),0,1.43,0);liquidVolume.name='vat-liquid-volume';liquidVolume.castShadow=false;liquidVolume.receiveShadow=false;
 // Narrow translucent highlights sit on the front of the curved glass and
 // remain fixed when the signal animation changes.
 {const positions=[],indices=[],strips=[[-.92,-.81,.65,2.25],[.77,.84,.73,2.13]];for(const [a0,a1,y0,y1] of strips){const start=positions.length/3,steps=8;for(let i=0;i<=steps;i++){const a=THREE.MathUtils.lerp(a0,a1,i/steps),r=1.605;positions.push(Math.sin(a)*r,y0,Math.cos(a)*r,Math.sin(a)*r,y1,Math.cos(a)*r);if(i<steps){const n=start+i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const highlight=part(root,geometry,new THREE.MeshBasicMaterial({color:0xd9f1e7,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));highlight.name='vat-glass-reflection';highlight.castShadow=false}
 const liquidBottom=part(root,new THREE.RingGeometry(.31,1.52,48),new THREE.MeshStandardMaterial({color:0x82b2a7,transparent:true,opacity:.24,side:THREE.DoubleSide,depthWrite:false}),0,.445,0);liquidBottom.rotation.x=-Math.PI/2;liquidBottom.name='vat-liquid-bottom';liquidBottom.castShadow=false;liquidBottom.receiveShadow=false;
 cylinder(root,1.7,.12,metal,0,2.61,0);cylinder(root,1.58,.08,dark,0,2.71,0);
 // A fixed lamp under the lid illuminates the suspended specimen independently
 // of the signal control; the fixture remains above the liquid surface.
 {const lampMaterial=material(0xe5cf9e);lampMaterial.emissive.setHex(0x9e7d45);lampMaterial.emissiveIntensity=.5;const lamp=part(root,new THREE.CircleGeometry(.46,32),lampMaterial,0,2.545,0);lamp.rotation.x=Math.PI/2;lamp.name='vat-lid-lamp';lamp.castShadow=false;const light=new THREE.PointLight(0xffdba3,1,3,2);light.position.set(0,2.5,0);light.name='vat-lid-light';root.add(light)}
 const post=new THREE.CylinderGeometry(.04,.04,2.22,8);for(let i=0;i<6;i++){const a=i*Math.PI/3;part(root,post,metal,Math.sin(a)*1.65,1.48,Math.cos(a)*1.65)}
 // A faint horizontal meniscus indicates liquid without obscuring the brain.
 const liquidMaterial=new THREE.MeshStandardMaterial({color:0xa8d2c4,transparent:true,opacity:.12,roughness:.25,side:THREE.DoubleSide,depthWrite:false});
 const surface=part(root,new THREE.CircleGeometry(1.57,48),liquidMaterial,0,2.4,0);surface.rotation.x=-Math.PI/2;surface.name='vat-liquid-surface';surface.castShadow=false;surface.receiveShadow=false;
 const waterline=part(root,new THREE.TorusGeometry(1.56,.018,6,48),new THREE.MeshStandardMaterial({color:0xb8ddd1,transparent:true,opacity:.45,depthWrite:false}),0,2.4,0);waterline.rotation.x=-Math.PI/2;waterline.name='vat-waterline';waterline.castShadow=false;
 const diffuser=cylinder(root,.27,.08,metal,0,.39,0);diffuser.name='vat-diffuser';const diffuserInset=cylinder(root,.18,.015,dark,0,.438,0);diffuserInset.name='vat-diffuser-inset';
 const rivetGeometry=new THREE.SphereGeometry(.055,10,8);for(const y of [.3,2.6])for(let i=0;i<12;i++){const a=i*Math.PI/6;part(root,rivetGeometry,metal,Math.sin(a)*1.72,y,Math.cos(a)*1.72)}
 const bubbles=[],bubbleGeometry=new THREE.SphereGeometry(1,12,8),bubbleMaterial=new THREE.MeshStandardMaterial({color:0xb7e0d7,transparent:true,opacity:.5,roughness:.2,depthWrite:false});
 for(let i=0;i<18;i++){const a=i*2.399963,r=1.27+(i%3)*.035,bubble=part(root,bubbleGeometry,bubbleMaterial,Math.sin(a)*r,.5,Math.cos(a)*r);bubble.scale.setScalar(.035+(i%3)*.015);bubble.name='vat-bubble';bubbles.push(bubble)}
 const risingBubbles=[];for(let i=0;i<9;i++){const a=i*2.399963,r=.025+(i%3)*.025,bubble=part(root,bubbleGeometry,bubbleMaterial,Math.cos(a)*r,.5,Math.sin(a)*r);bubble.scale.setScalar(.025+(i%3)*.007);bubble.name='vat-diffuser-bubble';risingBubbles.push(bubble)}
 const brain=new THREE.Group();brain.name='vat-brain';brain.scale.setScalar(1.4);brain.position.y=1.52*(1-1.4);root.add(brain);
 const hemisphere=new THREE.SphereGeometry(1,32,20);for(const side of [-1,1]){const lobe=part(brain,hemisphere,tissue,side*.29,1.52,0);lobe.name='vat-brain-lobe';lobe.scale.set(.45,.42,.64);lobe.receiveShadow=false;
  // Meandering, open ridges avoid the repeated closed rings of the earlier
  // cortex while remaining attached to each hemisphere's curved surface.
  for(let row=0;row<7;row++)for(let col=0;col<4;col++){const points=[],latitude=-1.2+row*.4,phase=row*1.7+col*.91,start=-Math.PI+col*Math.PI/2+(row%2)*.16,cycles=1.4+((row*5+col*3)%5)*.21;
   for(let i=0;i<=36;i++){const t=i/36,lon=start+t*1.42,lat=latitude+.115*Math.sin(t*cycles*2*Math.PI+phase)+.035*Math.sin(t*7*Math.PI-phase);points.push(new THREE.Vector3(side*.29+.456*Math.cos(lat)*Math.cos(lon),1.52+.426*Math.sin(lat),.646*Math.cos(lat)*Math.sin(lon)))}
   const ridge=part(brain,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),48,.052,10,false),fold);ridge.name='vat-brain-fold';ridge.castShadow=false;ridge.receiveShadow=false;
  }
 }
 // A small folded rear lobe adds depth below the paired cerebral hemispheres.
 const rearLobe=part(brain,hemisphere,tissue,0,1.24,-.57);rearLobe.scale.set(.2,.12,.19);rearLobe.name='vat-brain-rear-lobe';
 for(let row=0;row<4;row++){const points=[],y=1.18+row*.04,section=Math.sqrt(Math.max(0,1-((y-1.24)/.12)**2));for(let i=0;i<=24;i++){const a=Math.PI+i*Math.PI/24;points.push(new THREE.Vector3(.203*section*Math.cos(a),y,-.57+.193*section*Math.sin(a)))}const ridge=part(brain,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.014,6,false),fold);ridge.name='vat-rear-fold'}
 // A short curved stem connects the lower lobes without entering the diffuser stream.
 {const path=new THREE.CatmullRomCurve3([new THREE.Vector3(0,1.29,-.39),new THREE.Vector3(0,1.22,-.4),new THREE.Vector3(.015,1.13,-.39)]),stem=part(brain,new THREE.TubeGeometry(path,20,.055,10,false),tissue);stem.name='vat-brain-stem'}
 // External cables and animated markers share exactly the same curves.
 const curves=[],signals=[];
 for(let i=0;i<4;i++){
  const x=(i-1.5)*.42,endX=3+(i-1.5)*.16,endZ=(i-1.5)*.075,curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,2.75,0),new THREE.Vector3(x+.18,3.02+i*.14,-.04),new THREE.Vector3(1.7,3.02+i*.16,endZ),new THREE.Vector3(endX,2.55+i*.10,endZ),new THREE.Vector3(endX,1.507,endZ)]);curves.push(curve);
  const cable=part(root,new THREE.TubeGeometry(curve,48,.035,6,false),cableMat);cable.name='vat-external-cable';cylinder(root,.11,.16,metal,x,2.8,0);
  const signal=ball(root,.065,0xe5d595);signal.name='vat-signal';signals.push(signal);
  const contactX=x*.65,side=Math.sign(contactX),surfaceY=1.52+.588*Math.sqrt(1-((contactX-side*.406)/.63)**2-(.05/.896)**2),lead=new THREE.CatmullRomCurve3([new THREE.Vector3(x,2.6,0),new THREE.Vector3(x*.9,2.32,.05),new THREE.Vector3(contactX,surfaceY+.06,.05)]);part(root,new THREE.TubeGeometry(lead,20,.025,6,false),cableMat);const electrode=cylinder(root,.07,.06,metal,contactX,surfaceY+.03,.05);electrode.name='vat-electrode';
 }
 // Two forward-facing contacts make the connection visible through the glass.
 // Their leads route over the brain and terminate just outside its folded surface.
 for(const side of [-1,1]){const x=side*.55,lead=new THREE.CatmullRomCurve3([new THREE.Vector3(x,2.6,.1),new THREE.Vector3(x,2.45,.55),new THREE.Vector3(x,2.12,.99),new THREE.Vector3(x,1.75,.88)]);
  const wire=part(root,new THREE.TubeGeometry(lead,32,.025,6,false),cableMat);wire.name='vat-front-lead';
  const contact=cylinder(root,.115,.045,metal,x,1.75,.88);contact.rotation.x=Math.PI/2;contact.name='vat-front-electrode';
  const center=cylinder(root,.055,.05,dark,x,1.75,.91);center.rotation.x=Math.PI/2;center.name='vat-front-electrode-center';
 }
 const consoleGroup=new THREE.Group();consoleGroup.name='vat-console';consoleGroup.position.set(3,.057,0);root.add(consoleGroup);
 for(let i=0;i<4;i++){const plug=cylinder(consoleGroup,.055,.14,metal,(i-1.5)*.16,1.38,(i-1.5)*.075);plug.name='vat-console-cable-socket'}
 box(consoleGroup,1.55,.18,1.05,colors.wood,0,.45,0);for(const x of [-.62,.62])for(const z of [-.38,.38]){const leg=box(consoleGroup,.1,.44,.1,colors.wood,x,.22,z);leg.name='vat-console-leg'}
  // A grounded equipment cabinet occupies the open space under the console.
  const cabinet=new THREE.Group();cabinet.name='vat-console-cabinet';consoleGroup.add(cabinet);
  box(cabinet,.9,.36,.65,colors.dark,0,.18,0);
  for(const y of [.09,.15,.21,.27])box(cabinet,.56,.018,.012,metal,0,y,.331);
  for(const x of [-.4,.4])for(const y of [.055,.305]){const screw=ball(cabinet,.018,metal,x,y,.332);screw.scale.z=.3}
 box(consoleGroup,1.28,.74,.38,colors.dark,0,.91,0);box(consoleGroup,.78,.37,.025,0x75988a,-.15,1.0,.205);
 for(const x of [-.66,.66]){const cheek=box(consoleGroup,.06,.75,.42,colors.wood,x,.91,0);cheek.name='vat-console-wood-cheek'}
 for(const y of [.53,1.29]){const rail=box(consoleGroup,1.38,.04,.42,colors.wood,0,y,0);rail.name='vat-console-wood-rail'}
 for(const x of [-.57,.57])for(const y of [.61,1.21]){const screw=ball(consoleGroup,.035,metal,x,y,.205);screw.scale.z=.35}
 for(const y of [.79,1.21])box(consoleGroup,.86,.025,.03,metal,-.15,y,.225);for(const x of [-.58,.28])box(consoleGroup,.025,.43,.03,metal,x,1,.225);
 for(let i=0;i<3;i++)ball(consoleGroup,.075,colors.gold,.37,.72+i*.2,.23);
 for(const x of [-.48,-.17,.14]){const knob=cylinder(consoleGroup,.075,.06,metal,x,.65,.23);knob.rotation.x=Math.PI/2;knob.name='vat-knob'}
 const tracePositions=new Float32Array(33*3),traceGeometry=new THREE.BufferGeometry();traceGeometry.setAttribute('position',new THREE.BufferAttribute(tracePositions,3));const trace=new THREE.Line(traceGeometry,new THREE.LineBasicMaterial({color:0xe0d8ae}));trace.name='vat-waveform';consoleGroup.add(trace);
 const shelf=new THREE.Group();shelf.name='vat-bookcase';shelf.position.set(-3.45,.05,.25);root.add(shelf);
 for(const x of [-.7,.7])box(shelf,.12,2.25,.48,colors.wood,x,1.13,0);
 for(const y of [.14,.85,1.56,2.2])box(shelf,1.5,.1,.5,colors.wood,0,y,0);
 const bookColors=[0x8c5c48,0x62796a,0xb38a5e,0x596861];for(let row=0;row<3;row++)for(let i=0;i<7;i++){const book=box(shelf,.15,.51,.32,bookColors[(i+row)%4],-.55+i*.18,.445+row*.71,0);book.name='vat-shelf-book'}
 const armillary=new THREE.Group();armillary.name='vat-armillary';armillary.position.y=2.25;shelf.add(armillary);cylinder(armillary,.14,.1,metal,0,.05,0);cylinder(armillary,.025,.16,metal,0,.18,0);ball(armillary,.09,metal,0,.49,0);for(const rotation of [0,Math.PI/2]){const orbit=part(armillary,new THREE.TorusGeometry(.24,.018,6,32),metal,0,.49,0);orbit.rotation.y=rotation}
 const arch=new THREE.Group();arch.name='vat-background-arch';arch.position.set(-3.45,.055,-.35);root.add(arch);
 for(const x of [-.9,.9]){box(arch,.2,2.25,.24,0xc6b89f,x,1.125,0);box(arch,.32,.12,.34,0xd9cbb0,x,2.25,0)}
 {const shape=new THREE.Shape();for(let i=0;i<=32;i++){const a=Math.PI-i*Math.PI/32,x=1.02*Math.cos(a),y=1.02*Math.sin(a);if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y)}for(let i=0;i<=32;i++){const a=i*Math.PI/32;shape.lineTo(.78*Math.cos(a),.78*Math.sin(a))}shape.closePath();const crown=part(arch,new THREE.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelThickness:.01,bevelSize:.01,bevelSegments:1}),0xc6b89f,0,2.25,-.12);crown.name='vat-arch-crown';
  const vinePoints=[new THREE.Vector3(-.95,.12,.14),new THREE.Vector3(-1.01,.85,.14),new THREE.Vector3(-.94,1.6,.14),new THREE.Vector3(-.86,2.25,.14),new THREE.Vector3(-.65,2.82,.14),new THREE.Vector3(-.16,3.15,.14)],curve=new THREE.CatmullRomCurve3(vinePoints),vine=part(arch,new THREE.TubeGeometry(curve,40,.02,6,false),0x6f7e58);vine.name='vat-arch-vine';for(let i=0;i<20;i++){const t=.08+i*.043,p=curve.getPoint(t),tangent=curve.getTangent(t),side=i%2?1:-1,leaf=ball(arch,.105,0x81926a,p.x-side*tangent.y*.07,p.y+side*tangent.x*.07,.15);leaf.scale.set(.62,1.25,.25);leaf.rotation.z=Math.atan2(tangent.y,tangent.x)+side*.7;leaf.name='vat-arch-leaf'}}
 for(let i=0;i<3;i++){const book=box(root,.7,.1,.48,bookColors[i],-2.95,.12+i*.11,1.3);book.name='vat-floor-book';box(root,.62,.05,.43,0xe1d7c1,-2.95,.14+i*.11,1.3)}
 // A small contemplative stone bust balances the console at the front of the display.
 const bust=new THREE.Group();bust.name='vat-observer-bust';bust.position.set(-2.8,.055,2.55);root.add(bust);const bustStone=material(0xc5b9a3);
 box(bust,.7,.18,.58,bustStone,0,.09,0);box(bust,.54,.22,.44,bustStone,0,.29,0);
 const shoulders=ball(bust,.34,bustStone,0,.62,0);shoulders.scale.set(1.15,.7,.72);cylinder(bust,.10,.17,bustStone,0,.83,0);
 const head=ball(bust,.17,bustStone,0,1.02,0);head.scale.set(.86,1.12,.83);const hair=ball(bust,.17,bustStone,0,1.10,-.025);hair.scale.set(.9,.58,.86);
 const beard=ball(bust,.135,bustStone,0,.89,.07);beard.scale.set(.9,.9,.7);const nose=ball(bust,.035,bustStone,0,1.01,.145);nose.scale.set(.8,1.3,1);
 const curls=new THREE.SphereGeometry(.035,8,6);for(let row=0;row<2;row++)for(let col=-2;col<=2;col++){const curl=part(bust,curls,bustStone,col*.053,1.13+row*.035,.08-Math.abs(col)*.012-row*.02);curl.scale.set(1,.8,1);curl.name='vat-bust-hair-curl'}
 const armPath=new THREE.CatmullRomCurve3([[.24,.61,.10],[.27,.68,.17],[.19,.79,.20],[.08,.92,.18]].map(p=>new THREE.Vector3(...p)));const arm=part(bust,new THREE.TubeGeometry(armPath,20,.05,8,false),bustStone);arm.name='vat-bust-thinking-arm';const hand=ball(bust,.06,bustStone,.07,.94,.18);hand.scale.set(.75,1.2,.6);
 return done(scene,root,(t,value)=>{signals.forEach((signal,i)=>{const phase=t*(.12+value*.25)+i*.19;signal.visible=value>.02;signal.position.copy(curves[i].getPointAt(((phase%1)+1)%1));signal.material.emissive.setHex(0x9b7a31);signal.material.emissiveIntensity=value*.8});bubbles.forEach((bubble,i)=>{const phase=t*.09+i/18;bubble.position.y=.43+(((phase%1)+1)%1)*1.89});risingBubbles.forEach((bubble,i)=>{const phase=t*.14+i/9;bubble.position.y=.48+(((phase%1)+1)%1)*.31});const positions=traceGeometry.getAttribute('position');for(let i=0;i<positions.count;i++){const q=i/(positions.count-1);positions.setXYZ(i,-.5+q*.68,1+.1*value*Math.sin(q*14-t*2),.225)}positions.needsUpdate=true});
}
export function buildFreeWill(scene){
 const root=stage(scene),stone=material(0xd5c8ae),edge=material(0xb3a38b),pavingJoint=material(0xc5b79f),archStone=material(0xb9ad98),green=material(0x78836c);
 cylinder(root,5,.07,green,0,.02,0);
 const approach=box(root,1,.12,4.75,stone,0,.09,2.425),junction=cylinder(root,.7,.12,stone,0,.09,.05);approach.name='free-will-approach';approach.receiveShadow=false;junction.receiveShadow=false;
 // Concentric and radial joints make the shared junction read as individual
 // paving stones rather than a single unarticulated disk.
 {const vertices=[];for(const radius of [.24,.46,.66])for(let i=0;i<48;i++){const a=i*Math.PI/24,b=(i+1)*Math.PI/24;vertices.push(radius*Math.cos(a),.154,.05+radius*Math.sin(a),radius*Math.cos(b),.154,.05+radius*Math.sin(b))}for(const [inner,outer,count,phase] of [[.24,.46,8,0],[.46,.66,12,.12]])for(let i=0;i<count;i++){const a=i*Math.PI*2/count+phase;vertices.push(inner*Math.cos(a),.154,.05+inner*Math.sin(a),outer*Math.cos(a),.154,.05+outer*Math.sin(a))}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const joints=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xb3a38b}));joints.name='free-will-junction-joints';root.add(joints)}
 for(let z=.85;z<=4.7;z+=.32){const joint=box(root,.95,.008,.018,pavingJoint,0,.155,z);joint.castShadow=false}
 for(const x of [-.49,.49]){const border=box(root,.025,.018,4.6,edge,x,.156,2.45);border.castShadow=false}
 // Simple engraved markers enrich the common approach without labeling either choice.
 const medallionGeometry=new THREE.CylinderGeometry(.2,.2,.015,24),engravingMaterial=new THREE.LineBasicMaterial({color:0x8f7965});
 for(let k=0;k<3;k++){const disc=part(root,medallionGeometry,edge,0,.1575,1.65+k*1.1);disc.name='free-will-medallion';const lines=[];const segment=(x1,z1,x2,z2)=>lines.push(x1,.009,z1,x2,.009,z2);
  if(k===0){for(let i=0;i<8;i++){const a=i*Math.PI/4;segment(.085*Math.cos(a),.085*Math.sin(a),.14*Math.cos(a),.14*Math.sin(a))}for(let i=0;i<20;i++){const a=i*Math.PI/10,b=(i+1)*Math.PI/10;segment(.065*Math.cos(a),.065*Math.sin(a),.065*Math.cos(b),.065*Math.sin(b))}}
  if(k===1)for(let row=-1;row<=1;row++)for(let i=0;i<12;i++){const x=-.13+i*.26/12,n=x+.26/12;segment(x,row*.045+.012*Math.sin(x*24),n,row*.045+.012*Math.sin(n*24))}
  if(k===2){segment(0,-.14,0,.14);for(const side of [-1,1])for(const z of [-.07,0,.07]){segment(0,z,side*.085,z+.035);segment(side*.085,z+.035,0,z+.055)}}
  const lineGeometry=new THREE.BufferGeometry();lineGeometry.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));const engraving=new THREE.LineSegments(lineGeometry,engravingMaterial);engraving.name='free-will-engraving';disc.add(engraving);
 }
 const paths=[],markers=[];
 for(const sign of [-1,1]){
  const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(0,.15,.05),new THREE.Vector3(sign*.95,.15,-.1),new THREE.Vector3(sign*3.1,.15,-.7),new THREE.Vector3(sign*3.1,.15,-1.5));paths.push(curve);
  const verts=[],indices=[],left=[],right=[];
  for(let i=0;i<=40;i++){const q=i/40,p=curve.getPointAt(q),tangent=curve.getTangentAt(q),normal=new THREE.Vector3(-tangent.z,0,tangent.x).normalize();const a=p.clone().addScaledVector(normal,.48),b=p.clone().addScaledVector(normal,-.48);verts.push(a.x,.15,a.z,b.x,.15,b.z);left.push(a);right.push(b);}
  for(let i=0;i<40;i++){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geometry.setIndex(indices);geometry.computeVertexNormals();const path=part(root,geometry,stone);path.name=`free-will-path-${paths.length-1}`;path.receiveShadow=false;path.material.side=THREE.DoubleSide;
  for(const points of [left,right])part(root,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),48,.035,6,false),edge);
  // Ground the branch edges beyond the shared circular junction.
  for(const points of [left,right]){const sidePositions=[],sideIndices=[];for(let i=8;i<points.length;i++){const p=points[i];sidePositions.push(p.x,.055,p.z,p.x,.15,p.z);if(i<points.length-1){const n=(i-8)*2;sideIndices.push(n,n+1,n+2,n+1,n+3,n+2)}}const sideGeometry=new THREE.BufferGeometry();sideGeometry.setAttribute('position',new THREE.Float32BufferAttribute(sidePositions,3));sideGeometry.setIndex(sideIndices);sideGeometry.computeVertexNormals();edge.side=THREE.DoubleSide;const sideWall=part(root,sideGeometry,edge);sideWall.name='free-will-curb-wall';sideWall.castShadow=false}
  // Stagger the joints on either side of a continuous center seam.
  const centerPoints=[];for(let i=4;i<=40;i++){const point=curve.getPointAt(i/40);centerPoints.push(new THREE.Vector3(point.x,.1536,point.z))}const centerSeam=new THREE.Line(new THREE.BufferGeometry().setFromPoints(centerPoints),new THREE.LineBasicMaterial({color:0xb6a58e}));centerSeam.name='free-will-paving-center';root.add(centerSeam);
  for(const side of [-1,1])for(let i=2;i<18;i++){const q=(i+(side>0?.5:0))/18,point=curve.getPointAt(q),tangent=curve.getTangentAt(q),normal=new THREE.Vector3(-tangent.z,0,tangent.x).normalize(),tile=box(root,.018,.004,.44,pavingJoint,point.x+normal.x*side*.23,.153,point.z+normal.z*side*.23);tile.name='free-will-paving-joint';tile.rotation.y=-Math.atan2(tangent.z,tangent.x);tile.castShadow=false}
  const arch=new THREE.Group();arch.name='free-will-arch';arch.position.set(sign*3.1,-.0018,-1.5);arch.scale.set(1.15,1.18,1.12);root.add(arch);
  const accent=material(sign<0?0x718d83:0xb67a5d);
  for(const x of [-.83,.83]){const pier=box(arch,.34,1.645,.3,accent,x,.8775,0);pier.name='free-will-colored-pier'}
  for(const x of [-.65,.65]){box(arch,.24,1.7,.3,archStone,x,.85,0);box(arch,.36,.14,.4,stone,x,.08,0);box(arch,.36,.14,.4,stone,x,1.7,0)}
  part(arch,new THREE.TorusGeometry(.65,.13,8,24,Math.PI),archStone,0,1.7,0);
  const archBandShape=new THREE.Shape();archBandShape.moveTo(.96,0);archBandShape.absarc(0,0,.96,0,Math.PI,false);archBandShape.lineTo(-.75,0);archBandShape.absarc(0,0,.75,Math.PI,0,true);archBandShape.closePath();const band=part(arch,new THREE.ExtrudeGeometry(archBandShape,{depth:.3,bevelEnabled:false,curveSegments:32}),accent,0,1.7,-.15);band.name='free-will-colored-arch';
  for(let i=0;i<7;i++){const a=(i+.5)*Math.PI/7,block=box(arch,.035,.19,.35,stone,Math.cos(a)*.855,1.7+Math.sin(a)*.855,0);block.rotation.z=a-Math.PI/2}
  const archLeafGeometry=new THREE.BufferGeometry();archLeafGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,-.12,0,-.075,0,0,0,.14,0,.075,0,0,0,0,.025],3));archLeafGeometry.setIndex([0,1,4,1,2,4,2,3,4,3,0,4]);archLeafGeometry.computeVertexNormals();const archLeafMaterial=material(sign<0?0x788f6d:0xb88763);archLeafMaterial.side=THREE.DoubleSide;
  for(const side of [-1,1])for(let i=0;i<5;i++){const y=.65+i*.36,leaf=part(arch,archLeafGeometry,archLeafMaterial,side*(.8+.02*(i%2)),y,.16);leaf.rotation.z=side*.45;leaf.name='free-will-arch-leaf'}
  // Climbing stems and alternating leaves follow the outside of the arch.
  const vineMaterial=material(sign<0?0x657b52:0x916047),vineLeaf=material(sign<0?0x849765:0xb56e4c);
  for(const side of [-1,1]){
   const vinePoints=[];for(let i=0;i<=10;i++){const y=.18+i*.2;vinePoints.push(new THREE.Vector3(side*(.83+.035*Math.sin(i*1.6)),y,.195))}
   for(let i=1;i<=7;i++){const a=(side<0?Math.PI:0)+(side<0?-1:1)*i*Math.PI/16;vinePoints.push(new THREE.Vector3(Math.cos(a)*.88,1.7+Math.sin(a)*.88,.195))}
   const vine=part(arch,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vinePoints),36,.016,5,false),vineMaterial);vine.name='free-will-arch-vine';
   for(let i=1;i<vinePoints.length;i+=2){const point=vinePoints[i],leaf=part(arch,archLeafGeometry,vineLeaf,point.x+side*.045,point.y,.21);leaf.material.side=THREE.DoubleSide;leaf.scale.set(.9,1,.9);leaf.rotation.z=side*.55;leaf.name='free-will-vine-leaf'}
  }
  const marker=ball(arch,.105,colors.gold,0,2.42,0);markers.push(marker);
 }
 // A low rear hill rises out of the lawn between the two paths.
 const hillVertices=[],hillIndices=[],hillColors=[],hillRadius=1.6,hillHeight=.98,hillRings=16,hillSegments=48;
 const hillElevation=r=>.055+hillHeight*Math.pow(1-Math.min(1,r*r),2);
 for(let row=0;row<=hillRings;row++){const r=row/hillRings;for(let i=0;i<=hillSegments;i++){const a=i*Math.PI*2/hillSegments,x=Math.cos(a)*r*hillRadius,z=Math.sin(a)*r*hillRadius;hillVertices.push(x,hillElevation(r),z);const c=new THREE.Color((i+row)%5?0x829071:0x899473);hillColors.push(c.r,c.g,c.b);if(row<hillRings&&i<hillSegments){const n=row*(hillSegments+1)+i;hillIndices.push(n,n+hillSegments+1,n+1,n+1,n+hillSegments+1,n+hillSegments+2)}}}
 const hillGeometry=new THREE.BufferGeometry();hillGeometry.setAttribute('position',new THREE.Float32BufferAttribute(hillVertices,3));hillGeometry.setAttribute('color',new THREE.Float32BufferAttribute(hillColors,3));hillGeometry.setIndex(hillIndices);hillGeometry.computeVertexNormals();const hillMaterial=material(0xffffff);hillMaterial.vertexColors=true;hillMaterial.side=THREE.DoubleSide;const hill=part(root,hillGeometry,hillMaterial,0,0,-3.05);hill.name='free-will-rear-hill';
 // A narrow meandering trail climbs the rear hill, following the same surface
 // as the terrain rather than lying on a flat plane above it.
 {const vertices=[],indices=[],steps=56,halfWidth=.095;
  for(let i=0;i<=steps;i++){const t=i/steps,z=.96-1.92*t,x=.16*Math.sin(t*Math.PI*2-.3),dx=.32*Math.PI*Math.cos(t*Math.PI*2-.3),dz=-1.92,len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;
   for(const side of [-1,1]){const px=x+nx*halfWidth*side,pz=z+nz*halfWidth*side,r=Math.hypot(px,pz)/hillRadius;vertices.push(px,hillElevation(r)+.016,pz-3.05)}
   if(i<steps){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const trailMaterial=material(0xb5a287);trailMaterial.side=THREE.DoubleSide;const trail=part(root,geometry,trailMaterial);trail.name='free-will-hill-trail';trail.castShadow=false;
 }
 // Sparse terrain is placed only outside the two paths and the entrance.
 const rockGeometry=new THREE.DodecahedronGeometry(1,0),rockMaterial=material(0xaaa18d),leafGeometry=new THREE.ConeGeometry(.12,.42,5),leafMaterial=material(0x687f64);let added=0;
 for(const [x,z,size] of [[-.69,-.35,.23],[.67,-.2,.2],[-.65,.52,.18],[.7,.48,.16],[-.68,.25,.15]]){const r=Math.hypot(x,z)/hillRadius,rock=part(root,rockGeometry,rockMaterial,x,hillElevation(r)+size*.25,-3.05+z);rock.scale.set(size*1.2,size*.7,size);rock.rotation.y=x*3;rock.name='free-will-hill-rock'}
 for(let i=0;i<150&&added<14;i++){const a=i*2.399963,r=2+2.4*((Math.sin(i*13.71)*43758.5453%1+1)%1),x=Math.sin(a)*r,z=Math.cos(a)*r,size=.18+(i%3)*.055;
  if(Math.abs(x)<.85&&z>-.55&&z<4.9)continue;
  if(Math.hypot(x,z+3.05)<hillRadius+size+.1)continue;
  if(paths.some(path=>{for(let j=0;j<=36;j++){const pt=path.getPointAt(j/36);if(Math.hypot(x-pt.x,z-pt.z)<.65+size)return true}return false}))continue;
  const rock=part(root,rockGeometry,rockMaterial,x,size*.35,z);rock.scale.set(size*1.35,size*.7,size);rock.rotation.set(i*.12,i*.4,i*.1);rock.name='free-will-rock';
  for(let j=0;j<3;j++){const leaf=part(root,leafGeometry,leafMaterial,x+(j-1)*.12,.16,z+.22);leaf.rotation.z=(j-1)*.28;leaf.name='free-will-grass'}added++;
 }
 // Larger foreground stones anchor the fork in a layered landscape. Their
 // low, irregular silhouettes stay well away from the approach and branches.
 const boulderGeometry=new THREE.DodecahedronGeometry(1,0),boulderMaterials=[material(0xada692),material(0xb8ae9c),material(0x999987)];
 for(const [x,z,sx,sy,sz,turn] of [[-2.85,2.25,.72,.48,.58,.3],[-2.1,3.35,.55,.34,.46,1.1],[2.7,2.6,.78,.48,.55,.8],[1.75,3.85,.48,.28,.38,.4],[-4.05,.65,.48,.36,.42,.2]]){
  const rock=part(root,boulderGeometry,boulderMaterials[Math.round((x+z+10)*2)%3],x,.055+sy*.53,z);rock.scale.set(sx,sy,sz);rock.rotation.set(.09,turn,.07);rock.name='free-will-foreground-boulder';
 }
 // Pointed ground-level rosettes provide a different leaf scale from the
 // flowering clumps; all leaf tips remain inside the platform boundary.
 const bladeGeometry=new THREE.ConeGeometry(.095,.55,5),bladeMaterials=[material(0x596e54),material(0x728262),material(0x879173)];
 for(const [x,z,size] of [[-2.4,2.05,1],[-3.45,1.55,.8],[-1.6,3.25,.75],[2.05,2.2,.85],[3.4,1.7,.85],[2.55,3.35,.72]]){
  const rosette=new THREE.Group();rosette.name='free-will-rosette';rosette.position.set(x,.055,z);root.add(rosette);
  for(let j=0;j<7;j++){const a=j*Math.PI*2/7,blade=part(rosette,bladeGeometry,bladeMaterials[j%3],Math.cos(a)*.11*size,.2*size,Math.sin(a)*.11*size);blade.rotation.set(Math.sin(a)*.48,0,-Math.cos(a)*.48);blade.scale.setScalar(size)}
 }
 // Slender evergreens frame the far side of the fork without occupying either path.
 const cypressProfile=[[0,.35],[.14,.37],[.23,.58],[.27,.95],[.26,1.35],[.21,1.8],[.13,2.22],[.06,2.52],[0,2.7]].map(([r,y])=>new THREE.Vector2(r,y));
 const cypressGeometry=new THREE.LatheGeometry(cypressProfile,16),cypressLeafGeometry=new THREE.SphereGeometry(1,7,6),cypressLeafMaterial=material(0x71845e),cypressDummy=new THREE.Object3D();
 for(const x of [-2.05,2.05]){const evergreen=new THREE.Group();evergreen.name='free-will-evergreen';evergreen.position.set(x,.055,-3.35);root.add(evergreen);part(evergreen,new THREE.CylinderGeometry(.075,.12,.65,8),0x79604a,0,.325,0);const crown=part(evergreen,cypressGeometry,0x5f7559);crown.name='free-will-cypress-crown';
  const foliage=new THREE.InstancedMesh(cypressLeafGeometry,cypressLeafMaterial,84);foliage.name='free-will-cypress-foliage';foliage.castShadow=false;
  for(let i=0;i<84;i++){const y=.47+2.08*((i*37)%83)/82,angle=i*2.399963,r=y<.95?.17+.1*(y-.47)/.48:y<1.35?.26:y<1.8?.26-.05*(y-1.35)/.45:y<2.22?.21-.08*(y-1.8)/.42:.13-.07*(y-2.22)/.3;cypressDummy.position.set(Math.cos(angle)*r,y,Math.sin(angle)*r);cypressDummy.rotation.set(.12*Math.sin(angle),angle,.12*Math.cos(angle));cypressDummy.scale.set(.045,.13,.025);cypressDummy.updateMatrix();foliage.setMatrixAt(i,cypressDummy.matrix)}foliage.computeBoundingSphere();evergreen.add(foliage)
 }
 // A ceramic jar beside the warm arch provides a foreground landmark clear of the path.
 const jar=new THREE.Group();jar.name='free-will-jar';jar.position.set(4,.055,-.7);root.add(jar);const clay=material(0xb57653),profile=[[0,0],[.16,0],[.23,.07],[.27,.23],[.24,.39],[.15,.48],[.13,.56],[.17,.58],[.17,.61],[.11,.61],[.1,.54],[0,.5]].map(([x,y])=>new THREE.Vector2(x,y));
 part(jar,new THREE.LatheGeometry(profile,24),clay);for(const side of [-1,1]){const handle=part(jar,new THREE.TorusGeometry(.105,.025,6,20,Math.PI),clay,side*.19,.43,0);handle.rotation.z=side*Math.PI/2}
 for(const y of [.18,.32]){const ring=part(jar,new THREE.TorusGeometry(y===.18?.263:.25,.008,5,32),0xd19b70,0,y,0);ring.rotation.x=Math.PI/2}
 // A tree sits beyond the junction, clear of the two walkable routes.
 const tree=new THREE.Group();tree.name='free-will-tree';tree.position.set(.3,hillElevation(Math.hypot(.3,-.3)/hillRadius),-3.35);tree.scale.setScalar(1.25);root.add(tree);
 part(tree,new THREE.CylinderGeometry(.1,.17,1.25,10),0x79604a,0,.63,0);
 for(const [x,y,z] of [[-.42,1.45,0],[.4,1.55,0],[0,1.78,-.1]]){const from=new THREE.Vector3(0,.9,0),to=new THREE.Vector3(x,y,z),delta=to.clone().sub(from),branch=part(tree,new THREE.CylinderGeometry(.04,.07,delta.length(),8),0x79604a);branch.position.copy(from.add(to).multiplyScalar(.5));branch.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());const crown=ball(tree,.34,0x7d8b67,x,y,z);crown.scale.set(1,.7,.85)}
 // Fine overlapping leaves soften the three underlying canopy masses.
 {const tips=[[-.42,1.45,0],[.4,1.55,0],[0,1.78,-.1]],geometry=new THREE.SphereGeometry(1,8,6),materials=[material(0x73865f),material(0x96a579),material(0x82956c)],dummy=new THREE.Object3D();for(let variant=0;variant<3;variant++){const leaves=new THREE.InstancedMesh(geometry,materials[variant],36);leaves.name='free-will-tree-leaves';for(let i=0;i<36;i++){const index=variant*36+i,tip=tips[index%3],angle=index*2.399963,r=.09+.24*Math.sqrt(((index*17)%107)/106);dummy.position.set(tip[0]+Math.cos(angle)*r,tip[1]+.1+Math.sin(angle)*r*.55,tip[2]+.16*Math.sin(index*1.31));dummy.rotation.set(.25*Math.sin(index),angle,.4*Math.cos(index));dummy.scale.set(.13,.055,.07);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)}leaves.computeBoundingSphere();tree.add(leaves)}}
 // Low flowering clumps occupy the open ground, outside paths and structures.
 const meadowLeaf=new THREE.ConeGeometry(.07,.34,5),meadowStem=new THREE.CylinderGeometry(.012,.014,.22,5),flowerHead=new THREE.SphereGeometry(.045,7,5),meadowGreen=material(0x687e58),stemGreen=material(0x71804f),flowerGold=material(0xd6a454),flowerCream=material(0xe4c987);
 let clumps=0;
 for(let i=0;i<400&&clumps<34;i++){
  const a=i*2.399963,r=1.3+3.22*((Math.sin(i*19.37)*43758.5453%1+1)%1),x=Math.sin(a)*r,z=Math.cos(a)*r;
  if(Math.abs(x)<.85&&z>-.7&&z<4.9)continue;
  if(Math.hypot(x,z+3.05)<hillRadius+.2)continue;
  if(paths.some(path=>{for(let j=0;j<=80;j++){const pt=path.getPointAt(j/80);if(Math.hypot(x-pt.x,z-pt.z)<.85)return true}return false}))continue;
  if([-3.1,3.1].some(ax=>Math.hypot(x-ax,z+1.5)<1.1)||[-2.05,2.05].some(tx=>Math.hypot(x-tx,z+3.35)<.55)||Math.hypot(x-.3,z+3.35)<.65)continue;
  const clump=new THREE.Group();clump.name='free-will-meadow-clump';clump.position.set(x,.055,z);root.add(clump);
  for(let j=0;j<5;j++){const theta=j*Math.PI*2/5,leaf=part(clump,meadowLeaf,meadowGreen,Math.cos(theta)*.075,.12,Math.sin(theta)*.075);leaf.rotation.z=-Math.cos(theta)*.46;leaf.rotation.x=Math.sin(theta)*.46}
  for(let j=0;j<3;j++){const theta=j*Math.PI*2/3+i,fx=Math.cos(theta)*.085,fz=Math.sin(theta)*.085;part(clump,meadowStem,stemGreen,fx,.19,fz);const head=part(clump,flowerHead,j===0?flowerCream:flowerGold,fx,.305,fz);head.scale.set(1,.6,1)}
  clumps++;
 }
 const p=figure(root,0,0,0xd8c8aa);p.name='free-will-figure';p.scale.setScalar(1.25);p.position.y=.1625;p.children[1].position.y=1.39;
 const cloakPositions=[],cloakIndices=[],cloakRows=10,cloakColumns=12;for(let row=0;row<=cloakRows;row++){const t=row/cloakRows;for(let j=0;j<=cloakColumns;j++){const u=j/cloakColumns*2-1,x=u*(.19+.11*t),y=1.08-.74*t-.05*t*(u+1)/2,z=-.17-.09*t-.018*Math.cos(u*Math.PI*3)*t;cloakPositions.push(x,y,z);if(row<cloakRows&&j<cloakColumns){const n=row*(cloakColumns+1)+j;cloakIndices.push(n,n+cloakColumns+1,n+1,n+1,n+cloakColumns+1,n+cloakColumns+2)}}}
 const cloakGeometry=new THREE.BufferGeometry();cloakGeometry.setAttribute('position',new THREE.Float32BufferAttribute(cloakPositions,3));cloakGeometry.setIndex(cloakIndices);cloakGeometry.computeVertexNormals();const cloakMaterial=material(0xa96b50);cloakMaterial.side=THREE.DoubleSide;const cloak=part(p,cloakGeometry,cloakMaterial);cloak.name='free-will-cloak';
 const sash=box(p,.34,.12,.035,0xa96b50,0,.84,.18);sash.rotation.z=-.35;const belt=part(p,new THREE.TorusGeometry(.205,.018,6,24),0x795844,0,.66,0);belt.rotation.x=Math.PI/2;ball(p,.035,colors.gold,.16,1.03,.15);
 for(const side of [-1,1]){const shoe=box(p,.12,.06,.22,0x5a483a,side*.11,.02,.035);shoe.name='free-will-shoe';const eye=ball(p,.016,0x4e4036,side*.065,1.30,.177);eye.name='free-will-eye'}
 const raisedArm=p.children[7],raisedHand=p.children[8],shoulder=new THREE.Vector3(.17,.99,0),handPosition=new THREE.Vector3(.12,1.10,.19),armDelta=handPosition.clone().sub(shoulder);raisedArm.position.copy(shoulder).add(handPosition).multiplyScalar(.5);raisedArm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),armDelta.clone().normalize());raisedArm.scale.y=armDelta.length()/.5;raisedArm.name='free-will-raised-arm';raisedHand.position.copy(handPosition);raisedHand.name='free-will-raised-hand';
 // Close-fitting curls and ears make the traveler readable from either gate.
 const hairMaterial=material(0x50443a),hairCurl=new THREE.SphereGeometry(.035,8,6),earGeometry=new THREE.SphereGeometry(.032,8,6),skinMaterial=material(0xc9a17f);
 for(let i=0;i<16;i++){const a=i*2.399963,r=.14*Math.sqrt((i+.5)/16),curl=part(p,hairCurl,hairMaterial,Math.cos(a)*r,1.4+Math.sqrt(Math.max(0,.02-r*r))*.28,-.025+Math.sin(a)*r);curl.name='free-will-hair-curl'}
 for(const side of [-1,1]){const ear=part(p,earGeometry,skinMaterial,side*.18,1.28,0);ear.scale.set(.6,1,.8);ear.name='free-will-ear';const strap=box(p,.12,.018,.035,0xb69a73,side*.11,.058,.09);strap.name='free-will-sandal-strap'}
 const collar=part(p,new THREE.TorusGeometry(.135,.015,6,24),0xe5d8bf,0,1.1,0);collar.rotation.x=Math.PI/2;collar.name='free-will-collar';
 return done(scene,root,(_t,value)=>{const side=value<.5?0:1,q=Math.abs(value-.5)*2*.68,point=paths[side].getPointAt(q),tangent=paths[side].getTangentAt(q);p.position.set(point.x,.1625,point.z);p.rotation.y=Math.atan2(tangent.x,tangent.z);markers.forEach((marker,i)=>marker.scale.setScalar(i===side?1.35:.75))});
}
export function buildChineseRoom(scene){
 const root=stage(scene,3.7),wall=material(0xd7cbb2),wood=material(0x896349),paper=material(0xe8dec6),ink=material(0x59796e),accent=material(0xb66f53);
 root.rotation.y=Math.PI/4;
 // Pale paving fills the exposed plinth around the room; its joints remain
 // below the room floor and therefore cannot cover the furniture or cards.
 const paving=cylinder(root,3.62,.025,0xbdb19a,0,-.0025,0);paving.name='chinese-room-surrounding-paving';paving.castShadow=false;
 const pavingLines=[];for(let i=0;i<32;i++){const a=i*Math.PI/16;pavingLines.push(Math.sin(a)*2.65,.011,Math.cos(a)*2.65,Math.sin(a)*3.57,.011,Math.cos(a)*3.57)}for(const r of [2.8,3.2])for(let i=0;i<96;i++){const a=i*Math.PI/48,b=(i+1)*Math.PI/48;pavingLines.push(Math.sin(a)*r,.011,Math.cos(a)*r,Math.sin(b)*r,.011,Math.cos(b)*r)}
 const pavingGeometry=new THREE.BufferGeometry();pavingGeometry.setAttribute('position',new THREE.Float32BufferAttribute(pavingLines,3));const pavingJoints=new THREE.LineSegments(pavingGeometry,new THREE.LineBasicMaterial({color:0xa69880}));pavingJoints.name='chinese-room-surrounding-joints';root.add(pavingJoints);
 const floor=box(root,5,.15,3.4,0xb7ab97,0,.08,0);floor.name='chinese-room-floor';
 // Four masonry sections leave a genuine opening rather than a window painted on the wall.
 for(const [x,y,w,h] of [[-1.075,1.35,2.85,2.6],[2.325,1.35,.35,2.6],[1.25,.55,1.8,1],[1.25,2.5,1.8,.3]]){const section=box(root,w,h,.15,wall,x,y,-1.7);section.name='chinese-room-back-wall'}
 // Two shallow stone arches give the room a more architectural crown.
 const crownShape=new THREE.Shape();crownShape.moveTo(-1.25,0);crownShape.quadraticCurveTo(0,.7,1.25,0);crownShape.lineTo(1.25,-.04);crownShape.quadraticCurveTo(0,.38,-1.25,-.04);crownShape.closePath();const crownGeometry=new THREE.ExtrudeGeometry(crownShape,{depth:.18,bevelEnabled:false,curveSegments:24});
 for(const x of [-1.25,1.25]){const crown=part(root,crownGeometry,wall,x,2.65,-1.79);crown.name='chinese-room-wall-crown'}
 for(const x of [-2.45,2.45]){const coping=box(root,.22,.12,2.56,wall,x,2.66,-.4);coping.name='chinese-room-side-coping'}
 const crownKeystone=box(root,.22,.18,.22,0xc5b79e,0,2.72,-1.7);crownKeystone.name='chinese-room-crown-keystone';
 const window=new THREE.Group();window.name='chinese-room-window';window.position.set(1.25,0,-1.6);root.add(window);
 for(const x of [-.7,0,.7]){const column=box(window,.09,.57,.12,wall,x,1.335,0);column.name='chinese-room-window-column'}
 for(const x of [-.35,.35]){const curve=part(window,new THREE.TorusGeometry(.35,.055,7,24,Math.PI),wall,x,1.62,0);curve.name='chinese-room-window-arch'}
 // Masonry follows the two arch openings above their spring line, joining
 // them to the upper wall instead of leaving an unframed rectangular gap.
 const spandrelShape=new THREE.Shape();spandrelShape.moveTo(-.9,0);spandrelShape.lineTo(-.9,.73);spandrelShape.lineTo(.9,.73);spandrelShape.lineTo(.9,0);spandrelShape.lineTo(.7,0);spandrelShape.absarc(.35,0,.35,0,Math.PI,false);spandrelShape.absarc(-.35,0,.35,0,Math.PI,false);spandrelShape.lineTo(-.9,0);spandrelShape.closePath();
 const spandrel=part(root,new THREE.ExtrudeGeometry(spandrelShape,{depth:.15,bevelEnabled:false,curveSegments:24}),wall,1.25,1.62,-1.775);spandrel.name='chinese-room-window-spandrel';
 box(window,1.65,.1,.25,wood,0,1.05,0);
 // A small scenic backdrop sits beyond the open window, behind the masonry.
 const view=new THREE.Group();view.name='chinese-room-window-view';view.position.set(1.25,1.1,-2.05);root.add(view);
 const skyGeometry=new THREE.PlaneGeometry(1.7,1.25),skyColors=[];const skyPosition=skyGeometry.getAttribute('position');for(let i=0;i<skyPosition.count;i++){const color=new THREE.Color(skyPosition.getY(i)>0?0xb5c9c5:0xe7d8b6);skyColors.push(color.r,color.g,color.b)}skyGeometry.setAttribute('color',new THREE.Float32BufferAttribute(skyColors,3));const sky=part(view,skyGeometry,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide}),0,.625,0);sky.name='chinese-room-window-sky';sky.castShadow=false;
 for(const [height,color,depth] of [[.56,0xaeb9a2,.01],[.4,0x92a688,.02],[.23,0x789473,.03]]){const hill=new THREE.Shape();hill.moveTo(-.85,0);hill.lineTo(-.85,height*.53);hill.lineTo(-.52,height*.95);hill.lineTo(-.15,height*.56);hill.lineTo(.2,height);hill.lineTo(.58,height*.55);hill.lineTo(.85,height*.76);hill.lineTo(.85,0);hill.closePath();const ridge=part(view,new THREE.ShapeGeometry(hill),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}),0,0,depth);ridge.name='chinese-room-window-ridge';ridge.castShadow=false}
 for(const [x,h] of [[-.55,.25],[-.37,.37],[.45,.31],[.62,.23]]){const tree=part(view,new THREE.ConeGeometry(.045,h,7),0x6c846b,x,.12+h/2,.04);tree.name='chinese-room-window-tree';tree.castShadow=false}
 // Staggered stone joints give the floor scale while staying nearly flush.
 for(let z=-1.12;z<=1.13;z+=.56){const seam=box(root,4.85,.006,.014,0x968b79,0,.158,z);seam.name='chinese-room-floor-seam'}
 for(let row=0;row<6;row++)for(let col=0;col<7;col++){const x=-2.08+col*.62+(row%2)*.31,z=-1.4+row*.56;const joint=box(root,.012,.006,.54,0x968b79,x,.158,z);joint.name='chinese-room-stone-joint'}
 const mat=box(root,1.45,.012,.45,0xc18a62,0,.165,1.42);mat.name='chinese-room-mat';
 for(const x of [-.67,.67])box(root,.025,.007,.39,ink,x,.174,1.42);
 for(const z of [1.23,1.61])box(root,1.35,.007,.025,ink,0,.174,z);
 // Real apertures in the side walls permit the cards to cross without clipping.
 for(const x of [-2.45,2.45]){
  // The upper front of each side is cut away, exposing cards while the rear
  // lintel and the complete opening remain intact.
  const sections=[[1.02,.51,0,3.4],[1.2,2.0,-.4,2.6],[.42,1.23,-1.075,1.25],[.42,1.23,1.075,1.25]];
  for(const [height,y,z,depth] of sections){const piece=box(root,.15,height,depth,wall,x,y,z);piece.name='chinese-room-slot-wall'}
  const tray=box(root,2.1,.08,.85,wood,x,1.06,0);tray.name='chinese-room-tray';
  // A deep stone surround makes each passage read as part of the wall,
  // while the clear opening remains wide enough for the moving cards.
  {const side=Math.sign(x),cx=x+side*.22;for(const z of [-.65,.65]){const pier=box(root,.44,1.39,.38,0xc9bba2,cx,.845,z);pier.name='chinese-room-portal-masonry'}const lintel=box(root,.44,.18,1.68,0xc9bba2,cx,1.535,0);lintel.name='chinese-room-portal-masonry';
   const crownShape=new THREE.Shape();crownShape.moveTo(-.82,0);crownShape.absarc(0,0,.82,Math.PI,0,true);crownShape.lineTo(-.82,0);crownShape.closePath();const crown=part(root,new THREE.ExtrudeGeometry(crownShape,{depth:.44,bevelEnabled:false,curveSegments:32}),0xc9bba2,x,1.625,0);crown.rotation.y=side*Math.PI/2;crown.name='chinese-room-portal-masonry';
   const outer=x+side*.449,frame=part(root,new THREE.TorusGeometry(.73,.045,8,32,Math.PI),0xb5a58a,outer,1.625,0);frame.rotation.y=Math.PI/2;frame.name='chinese-room-portal-crown';
   for(const z of [-.51,.51]){const edge=box(root,.025,.39,.055,0xc5a36d,outer+side*.015,1.255,z);edge.name='chinese-room-portal-edge'}const top=box(root,.025,.055,1.07,0xc5a36d,outer+side*.015,1.475,0);top.name='chinese-room-portal-edge';
  }
  // Paired braces support the projecting outside half of each card tray.
  for(const z of [-.3,.3]){const start=new THREE.Vector3(x+Math.sign(x)*.105,.52,z),end=new THREE.Vector3(x+Math.sign(x)*.82,1.02,z),delta=end.clone().sub(start),brace=box(root,.075,delta.length(),.075,wood);brace.position.copy(start).add(end).multiplyScalar(.5);brace.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());brace.name='chinese-room-tray-brace'}
  // Shallow seams describe the timber slats without raising the card surface.
  const trayLines=[];for(const z of [-.27,0,.27])trayLines.push(x-1.02,1.101,z,x+1.02,1.101,z);for(let j=0;j<6;j++){const tx=x-.85+j*.34;trayLines.push(tx,1.101,-.4,tx,1.101,.4)}const trayLineGeometry=new THREE.BufferGeometry();trayLineGeometry.setAttribute('position',new THREE.Float32BufferAttribute(trayLines,3));const trayJoints=new THREE.LineSegments(trayLineGeometry,new THREE.LineBasicMaterial({color:0x674734}));trayJoints.name='chinese-room-tray-joints';root.add(trayJoints);
  for(const z of [-.47,.47])box(root,2.15,.1,.07,wood,x,1.14,z);
  for(const side of [-1,1]){const face=x+side*.085;for(const z of [-.48,.48]){const trim=box(root,.04,.42,.06,accent,face,1.23,z);trim.name='chinese-room-slot-trim'}const top=box(root,.04,.055,1.02,accent,face,1.465,0);top.name='chinese-room-slot-trim'}
  // Shallow stone reliefs frame the slots while leaving the aperture clear.
  const inner=x-Math.sign(x)*.08,arch=part(root,new THREE.TorusGeometry(.7,.035,6,32,Math.PI),0xb5aa94,inner,1.49,0);arch.rotation.y=Math.PI/2;arch.name='chinese-room-slot-arch';
  for(const y of [.42,.76,1.84,2.21]){const upper=y>1.5,joint=box(root,.012,.014,upper?2.5:3.3,0xb9ac96,inner,y,upper?-.4:0);joint.name='chinese-room-masonry-joint'}
  box(root,.08,2.5,.12,wall,inner,.05+1.25,-1.58);box(root,.08,1.4,.12,wall,inner,.05+.7,1.58);
 }
 // Ivy climbs the rear exterior corners, away from both card passages.
 const ivyLeaf=new THREE.BufferGeometry();ivyLeaf.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-.07,.12,0,0,.27,0,.07,.12,0,0,.13,.025],3));ivyLeaf.setIndex([0,1,4,1,2,4,2,3,4,3,0,4]);ivyLeaf.computeVertexNormals();
 const ivyMaterials=[material(0x627a5a),material(0x81916b)];ivyMaterials.forEach(m=>m.side=THREE.DoubleSide);
 for(const side of [-1,1]){
  const ivy=new THREE.Group();ivy.name='chinese-room-corner-ivy';root.add(ivy);
  const x=side*2.54,points=[[x,.2,-1.48],[x,.8,-1.43],[x,1.42,-1.52],[x,2.03,-1.46],[x,2.67,-1.5]].map(p=>new THREE.Vector3(...p));
  const vine=new THREE.CatmullRomCurve3(points);part(ivy,new THREE.TubeGeometry(vine,32,.018,6,false),0x6f7351);
  for(let i=0;i<11;i++){const p=vine.getPoint(.12+i*.078);for(const direction of [-1,1]){const leaf=part(ivy,ivyLeaf,ivyMaterials[(i+(direction>0?1:0))%2],p.x,p.y,p.z);leaf.name='chinese-room-ivy-leaf';leaf.rotation.y=Math.PI/2;leaf.rotation.x=direction*.85;leaf.scale.setScalar(.65+(i%3)*.12)}}
 }
 // A geometric hanging marks the input side without suggesting a written rule.
 const banner=new THREE.Group();banner.name='chinese-room-banner';banner.position.set(-2.355,0,0);root.add(banner);
 const clothGeometry=new THREE.BufferGeometry();clothGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,2.34,-.36,0,2.34,.36,0,1.72,.36,0,1.55,0,0,1.72,-.36],3));clothGeometry.setIndex([0,1,2,0,2,3,0,3,4]);clothGeometry.computeVertexNormals();const cloth=part(banner,clothGeometry,ink);cloth.material.side=THREE.DoubleSide;
 const rod=cylinder(banner,.027,.83,colors.gold,0,2.36,0);rod.rotation.x=Math.PI/2;
 for(const z of [-.39,.39])ball(banner,.04,colors.gold,0,2.36,z);
 const emblem=part(banner,new THREE.CircleGeometry(.15,24),colors.gold,.008,1.98,0);emblem.rotation.y=Math.PI/2;
 const stem=box(banner,.012,.32,.025,colors.gold,.012,1.8,0);stem.name='chinese-room-banner-emblem';
 // A proper desk and a geometric rulebook, not an invented Chinese sentence.
 const desk=box(root,2.35,.14,1.475,wood,0,.89,.1125);desk.name='chinese-room-desk';for(const x of [-1.02,1.02])for(const z of [-.5,.7]){const leg=box(root,.14,.67,.14,wood,x,.49,z);leg.name='chinese-room-desk-leg'}
 // Planks and a molded edge give the writing desk the layered timber surface
 // visible in the concept while keeping its top flat for the rule materials.
 const deskJoints=[];for(const z of [-.42,-.14,.14,.42,.7])deskJoints.push(-1.16,.961,z,1.16,.961,z);for(const [x,z0,z1] of [[-.51,-.62,-.42],[.56,-.42,-.14],[-.72,-.14,.14],[.7,.14,.42],[-.36,.42,.7]])deskJoints.push(x,.961,z0,x,.961,z1);const deskJointGeometry=new THREE.BufferGeometry();deskJointGeometry.setAttribute('position',new THREE.Float32BufferAttribute(deskJoints,3));const deskJointLines=new THREE.LineSegments(deskJointGeometry,new THREE.LineBasicMaterial({color:0x654631}));deskJointLines.name='chinese-room-desk-plank-joints';root.add(deskJointLines);
 for(const z of [-.62,.84]){const molding=box(root,2.34,.035,.022,0x634631,0,.865,z);molding.name='chinese-room-desk-molding'}
 // Aprons and foot blocks articulate the desk while leaving room for the chair.
 for(const z of [-.5,.7]){const apron=box(root,1.88,.18,.08,wood,0,.73,z);apron.name='chinese-room-desk-apron'}
 for(const x of [-1.02,1.02])for(const z of [-.5,.7]){const foot=box(root,.2,.09,.2,wood,x,.195,z);foot.name='chinese-room-desk-foot'}
 // A runner, loose rule cards and writing tools make the working surface legible.
 const runner=box(root,1.38,.012,.54,accent,0,.966,.58);runner.name='chinese-room-runner';
 const hanging=box(root,1.38,.28,.018,accent,0,.827,.852);hanging.name='chinese-room-runner-hanging';
 for(const x of [-.63,.63]){box(root,.018,.006,.5,colors.gold,x,.975,.58);box(root,.018,.25,.008,colors.gold,x,.83,.865)}
 for(let i=0;i<17;i++)box(root,.018,.08,.018,colors.gold,-.64+i*.08,.65,.852);
 for(const [x,symbol] of [[-.43,'triangle'],[0,'ring'],[.43,'triangle']]){const tile=box(root,.34,.025,.27,paper,x,.984,.57);tile.name='chinese-room-rule-card';if(symbol==='ring'){const mark=part(root,new THREE.TorusGeometry(.065,.012,6,20),ink,x,1,.57);mark.rotation.x=Math.PI/2}else{const mark=part(root,new THREE.CylinderGeometry(.075,.075,.012,3),ink,x,1,.57);mark.rotation.y=Math.PI/2}}
 for(let i=0;i<4;i++)box(root,.32,.025,.28,paper,-.87,.976+i*.028,.15);
 const inkwell=cylinder(root,.105,.16,accent,.88,1.04,.56);inkwell.name='chinese-room-inkwell';const quill=box(root,.025,.46,.025,paper,.88,1.32,.56);quill.rotation.z=-.25;const feather=part(root,new THREE.SphereGeometry(.09,12,8),paper,.95,1.49,.56);feather.scale.set(.48,1.65,.18);feather.rotation.z=-.25;
 // The rulebook has a supported cover, a central gutter and gently curved pages.
 const rulebook=new THREE.Group();rulebook.name='chinese-room-rulebook';root.add(rulebook);box(rulebook,1.06,.045,.73,wood,0,.9825,-.1);
 for(const side of [-1,1]){const vertices=[],indices=[],columns=12;for(let i=0;i<=columns;i++){const u=i/columns,x=side*(.015+.5*u),y=1.009+.022*u*u;vertices.push(x,y,-.44,x,y,.24);if(i<columns){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}}const pageGeometry=new THREE.BufferGeometry();pageGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));pageGeometry.setIndex(indices);pageGeometry.computeVertexNormals();const page=part(rulebook,pageGeometry,paper);page.name='chinese-room-book-page';page.material.side=THREE.DoubleSide;
  const pageHeight=x=>1.009+.022*((Math.abs(x)-.015)/.5)**2+.009,center=side*.265;for(let row=0;row<3;row++){const z=-.32+row*.18,rx=center-.13,tx=center+.13,ring=part(rulebook,new THREE.TorusGeometry(.043,.009,6,16),ink,rx,pageHeight(rx),z);ring.rotation.x=Math.PI/2;const triangle=part(rulebook,new THREE.CylinderGeometry(.055,.055,.012,3),accent,tx,pageHeight(tx),z);triangle.rotation.y=Math.PI/2;box(rulebook,.075,.01,.014,ink,center,pageHeight(center),z)}}
 const spine=box(rulebook,.025,.015,.68,0xb99c7e,0,1.016,-.1);spine.name='chinese-room-book-gutter';
 const operator=new THREE.Group();operator.name='chinese-room-operator';operator.position.set(0,.15,-.99);root.add(operator);
 box(operator,.72,.12,.65,wood,0,.48,0);box(operator,.72,.72,.1,wood,0,.88,-.3);for(const x of [-.28,.28])for(const z of [-.23,.23]){const leg=box(operator,.09,.45,.09,wood,x,.23,z);leg.name='chinese-room-chair-leg'}
 part(operator,new THREE.CylinderGeometry(.17,.25,.64,12),colors.blue,0,.97,0);ball(operator,.18,0xc9a17f,0,1.48,0);const hair=ball(operator,.18,0x50443a,0,1.58,-.02);hair.scale.y=.55;
 for(const side of [-1,1]){const eye=ball(operator,.016,0x3f3933,side*.06,1.5,.17);eye.name='chinese-room-eye'}ball(operator,.025,0xc9a17f,0,1.46,.18);
 for(const side of [-1,1]){box(operator,.15,.16,.4,colors.blue,side*.12,.55,.23);box(operator,.12,.595,.12,0xc9a17f,side*.12,.3025,.41);const shoe=box(operator,.15,.08,.23,0x6c5141,side*.12,.045,.46);shoe.name='chinese-room-shoe';const lock=ball(operator,.07,0x50443a,side*.145,1.54,0);lock.scale.set(.7,1.15,.85)}
 const bun=ball(operator,.115,0x50443a,0,1.62,-.16);bun.name='chinese-room-hair-bun';bun.scale.set(1,.8,.78);
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5,curl=ball(operator,.045,0x655045,Math.sin(a)*.075,1.62+Math.cos(a)*.055,-.235);curl.name='chinese-room-bun-curl';curl.scale.set(1,.8,.55)}
 // An open-front shoulder wrap with shallow folds, rather than a solid ellipsoid.
 const wrapPositions=[],wrapIndices=[],wrapRows=10,wrapCols=28;
 for(let row=0;row<=wrapRows;row++){const t=row/wrapRows;for(let col=0;col<=wrapCols;col++){const a=Math.PI*.32+col/wrapCols*Math.PI*1.36,fold=.008*Math.cos(a*9)*t,rx=.205+.075*t+fold,rz=.15+.055*t+fold;wrapPositions.push(Math.sin(a)*rx,1.25-.51*t-.025*t*Math.cos(a),Math.cos(a)*rz-.025);if(row<wrapRows&&col<wrapCols){const n=row*(wrapCols+1)+col;wrapIndices.push(n,n+1,n+wrapCols+1,n+1,n+wrapCols+2,n+wrapCols+1)}}}
 const wrapGeometry=new THREE.BufferGeometry();wrapGeometry.setAttribute('position',new THREE.Float32BufferAttribute(wrapPositions,3));wrapGeometry.setIndex(wrapIndices);wrapGeometry.computeVertexNormals();const wrapMaterial=material(0x537d73);wrapMaterial.side=THREE.DoubleSide;const cloak=part(operator,wrapGeometry,wrapMaterial);cloak.name='chinese-room-shoulder-wrap';const clasp=ball(operator,.04,colors.gold,-.17,1.18,.13);clasp.scale.z=.5;
 function limb(from,to,radius,color,name){const a=new THREE.Vector3(...from),b=new THREE.Vector3(...to),delta=b.clone().sub(a),mesh=part(operator,new THREE.CylinderGeometry(radius,radius,delta.length(),10),color);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.name=name;return mesh}
 const poses=[{shoulder:[-.2,1.19,0],elbow:[-.29,.98,.15],hand:[-.09,1.33,.17]},{shoulder:[.2,1.19,0],elbow:[.3,1.01,.14],hand:[.4,1.22,.23]}];
 for(const pose of poses){limb(pose.shoulder,pose.elbow,.065,colors.blue,'chinese-room-upper-arm');limb(pose.elbow,pose.hand,.05,0xc9a17f,'chinese-room-forearm');const hand=ball(operator,.06,0xc9a17f,...pose.hand);hand.name='chinese-room-hand'}
 const heldCard=box(operator,.23,.3,.035,paper,.4,1.36,.25);heldCard.name='chinese-room-held-card';const heldMark=part(operator,new THREE.TorusGeometry(.065,.01,6,20),ink,.4,1.38,.271);heldMark.name='chinese-room-held-symbol';
 // Give the seated operator enough visual weight to read the pose and card
 // at the default framing while keeping the feet on the room floor.
 operator.scale.set(1.12,1.2,1.12);operator.position.y=.149;
 for(let i=0;i<3;i++){box(root,.38,.07,.48,i%2?accent:ink,.73,1.0+i*.075,-.13);box(root,.33,.035,.43,paper,.73,1.02+i*.075,-.13)}
 // A full-height, recessed library gives the back wall the weight of the concept.
 const shelf=new THREE.Group();shelf.name='chinese-room-library';shelf.position.set(-1.38,0,-1.42);root.add(shelf);
 const backing=box(shelf,1.92,2.31,.08,0x79513b,0,1.355,-.13);backing.name='chinese-room-library-backing';
 for(const x of [-.99,.99]){const stile=box(shelf,.12,2.36,.4,wood,x,1.37,0);stile.name='chinese-room-library-stile'}
 for(const y of [.2,.84,1.48,2.12,2.55]){const board=box(shelf,2.1,.09,.4,wood,0,y,0);board.name='chinese-room-library-shelf'}
 // A low curved crown connects the two stiles and echoes the room's arch.
 const libraryCrownShape=new THREE.Shape();libraryCrownShape.moveTo(-1.05,0);libraryCrownShape.quadraticCurveTo(0,.62,1.05,0);libraryCrownShape.lineTo(.94,0);libraryCrownShape.quadraticCurveTo(0,.43,-.94,0);libraryCrownShape.closePath();
 const libraryCrown=part(shelf,new THREE.ExtrudeGeometry(libraryCrownShape,{depth:.12,bevelEnabled:false,curveSegments:32}),wood,0,2.59,.13);libraryCrown.name='chinese-room-library-crown';
 const bookColors=[0x59796e,0xa65d46,0xb18a50,0x6b7a62,0x82513e];
 for(let row=0;row<3;row++){
  let x=-.84;
  for(let i=0;i<9;i++){
   const width=.13+(i%3)*.018,height=.35+((i*3+row)%4)*.038,base=.245+row*.64;
   const book=box(shelf,width,height,.25,bookColors[(i+row*2)%bookColors.length],x+width/2,base+height/2,.015);book.name='chinese-room-library-book';
   for(const offset of [.08,height-.07]){const band=box(shelf,width*.86,.012,.008,0xc9a46b,x+width/2,base+offset,.144);band.name='chinese-room-book-band'}
   x+=width+.025;
  }
 }
 // The upper shelf holds a small stone bust and an hourglass as visual accents.
 const bust=new THREE.Group();bust.name='chinese-room-library-bust';bust.position.set(-.48,2.17,.015);shelf.add(bust);
 box(bust,.28,.045,.2,0xc9bca4,0,.025,0);const shoulders=ball(bust,.12,0xc9bca4,0,.13,0);shoulders.scale.set(1.05,.65,.65);cylinder(bust,.035,.08,0xc9bca4,0,.2,0);const head=ball(bust,.075,0xc9bca4,0,.28,0);head.scale.set(.85,1.12,.85);
 const hourglass=new THREE.Group();hourglass.name='chinese-room-library-hourglass';hourglass.position.set(.48,2.17,0);shelf.add(hourglass);
 for(const y of [.015,.235])box(hourglass,.19,.03,.15,wood,0,y,0);
 for(const x of [-.07,.07])cylinder(hourglass,.012,.2,0xc9a46b,x,.125,0);
 const glass=part(hourglass,new THREE.ConeGeometry(.065,.1,12),0xd3bd91,0,.175,0);glass.rotation.z=Math.PI;part(hourglass,new THREE.ConeGeometry(.065,.1,12),0xd3bd91,0,.075,0);
 function card(name,symbol){const g=new THREE.Group();g.name=name;root.add(g);box(g,.65,.06,.54,paper);if(symbol==='ring'){const ring=part(g,new THREE.TorusGeometry(.13,.025,8,24),ink,0,.034,0);ring.rotation.x=Math.PI/2}else{const triangle=part(g,new THREE.CylinderGeometry(.16,.16,.014,3),accent,0,.037,0);triangle.rotation.y=Math.PI/2}return g}
 const input=card('chinese-room-input','ring'),output=card('chinese-room-output','triangle');
 return done(scene,root,(_t,value)=>{input.position.set(-3.15+1.4*Math.min(1,value*2),1.13,0);output.position.set(1.75+1.4*Math.max(0,value*2-1),1.13,0);output.visible=value>.5});
}
export function buildSocratic(scene){
 const root=stage(scene,4.75),wood=material(0x805b43),stone=material(0xc6b9a1),paper=material(0xe4d8bd),ink=material(0x4d6960);
 root.rotation.y=Math.PI/4;
 cylinder(root,4.65,.06,0xa49d89,0,.02,0);const dialoguePartsStart=root.children.length;const carpet=box(root,4.8,.035,3.4,0xb99c7e,0,.075,.3);carpet.name='socratic-carpet';
 for(const z of [-1.3,1.9])box(root,4.6,.012,.035,0x718a7b,0,.101,z);for(const x of [-2.3,2.3])box(root,.035,.012,3.2,0x718a7b,x,.101,.3);
 // Narrow woven stripes are flush with the carpet and remain beneath the furniture.
 for(let z=-1.2;z<1.8;z+=.12)box(root,4.5,.004,.012,0xcbb193,0,.095,z);
 for(let i=0;i<38;i++)for(const z of [-1.43,2.03]){const fringe=box(root,.025,.008,.16,0xd8c4a4,-2.25+i*.122,.054,z);fringe.name='socratic-carpet-fringe'}
 const table=new THREE.Group();table.name='socratic-table';table.scale.setScalar(1.15);table.position.y=.0925-.03*1.15;root.add(table);cylinder(table,1.08,.13,wood,0,.83,0);cylinder(table,.17,.77,wood,0,.42,0);const tableBase=cylinder(table,.55,.1,wood,0,.08,0);tableBase.name='socratic-table-base';
 const tableInlay=part(table,new THREE.TorusGeometry(.97,.009,6,48),0xc49d6d,0,.899,0);tableInlay.rotation.x=Math.PI/2;tableInlay.name='socratic-table-inlay';
 for(const x of [-.24,.24]){const page=box(table,.46,.04,.62,paper,x,.92,0);page.name='socratic-table-page';if(x>0){for(let row=0;row<3;row++)box(table,.28,.012,.02,ink,x,.948,-.18+row*.16)}else{
  // Intersecting circles suggest a shared sketch, without assigning a
  // particular answer to either speaker.
  for(const [dx,dz] of [[-.055,-.035],[.055,-.035],[0,.055]]){const circle=part(table,new THREE.TorusGeometry(.105,.006,5,28),ink,x+dx,.946,dz);circle.rotation.x=Math.PI/2;circle.name='socratic-table-diagram'}
 }}
 for(const x of [-.72,.72]){cylinder(table,.11,.17,ink,x,.98,.3);cylinder(table,.075,.014,paper,x,1.07,.3)}
 const scroll=cylinder(table,.095,.65,paper,0,.96,-.61);scroll.rotation.z=Math.PI/2;for(const x of [-.32,.32]){const end=cylinder(table,.11,.035,wood,x,.96,-.61);end.rotation.z=Math.PI/2}
 cylinder(table,.14,.18,wood,0,1,.61);for(const [x,z] of [[-.1,.61],[.1,.61],[0,.53]]){const leaf=ball(table,.12,0x718d72,x,1.16,z);leaf.scale.set(.55,1.15,.55)}
 // A compact stack sits at the outer edge of the reading surface, apart from the pages.
 {const stack=new THREE.Group();stack.name='socratic-table-books';stack.position.set(.68,.895,-.4);table.add(stack);for(let i=0;i<2;i++){const book=box(stack,.32,.075,.29,i?ink:colors.red,0,.0375+i*.08,0);book.name='socratic-table-book';box(stack,.29,.035,.265,paper,0,.04+i*.08,.002);for(const z of [-.09,.09])box(stack,.29,.008,.012,colors.gold,0,.079+i*.08,z)}}
 function participant(x,sign,color){
  const g=new THREE.Group();g.name='socratic-participant';g.scale.setScalar(1.15);g.position.set(x,.0925-.01*1.15,0);g.rotation.y=sign*Math.PI/2;root.add(g);
  // Local +Z points from the participant toward the table.
  box(g,.82,.12,.68,wood,0,.49,0);box(g,.82,.72,.12,wood,0,.9,-.32);
  for(const xx of [-.3,.3])for(const z of [-.22,.22]){const leg=box(g,.1,.46,.1,wood,xx,.24,z);leg.name='socratic-chair-leg'}
  const cushion=box(g,.65,.09,.53,0x8b9b80,0,.59,-.01);cushion.name='socratic-chair-cushion';
  const backCushion=box(g,.64,.55,.045,0x8b9b80,0,.91,-.245);backCushion.name='socratic-chair-back-cushion';
  for(const side of [-1,1]){box(g,.1,.42,.1,wood,side*.36,.73,.2);box(g,.12,.09,.57,wood,side*.36,.96,-.03)}
  const torso=part(g,new THREE.CylinderGeometry(.17,.25,.68,12),color,0,.99,0);torso.rotation.x=-.08;
  // Layered drapery, a clasp and folds read as clothing from the normal view.
  const drape=part(g,new THREE.CylinderGeometry(.22,.3,.57,12,1,true,0,Math.PI),color,0,.92,-.015);drape.rotation.y=Math.PI;
  const clasp=ball(g,.045,0xc99a64,-.16,1.22,.12);clasp.scale.z=.45;
  for(const xx of [-.16,0,.16]){const fold=box(g,.018,.42,.012,0xd4c4a5,xx,.78,.225);fold.rotation.z=xx*.22}
  ball(g,.18,0xc9a17f,0,1.52,.02);const hair=ball(g,.18,0x50443a,0,1.61,0);hair.scale.y=.55;for(const side of [-1,1]){ball(g,.022,0x39453e,side*.06,1.54,.19);const lock=ball(g,.065,0x50443a,side*.14,1.61,.015);lock.scale.set(.75,.8,1)}ball(g,.026,0xc9a17f,0,1.49,.2);
  // Two distinct hair silhouettes help the speakers remain legible at a distance.
  for(const side of [-1,1]){const ear=ball(g,.036,0xc9a17f,side*.175,1.52,.015);ear.scale.set(.55,1,.8);ear.name='socratic-ear'}
  if(sign>0){const curls=new THREE.SphereGeometry(.035,8,6),hairColor=material(0x50443a);for(let i=0;i<16;i++){const angle=i*2.399963,r=.14*Math.sqrt((i+.5)/16),curl=part(g,curls,hairColor,Math.cos(angle)*r,1.63+Math.sqrt(Math.max(0,.02-r*r))*.28,Math.sin(angle)*r);curl.name='socratic-hair-curl'}const beard=ball(g,.12,0x50443a,0,1.405,.135);beard.scale.set(.9,.7,.55);beard.name='socratic-beard'}
  else {const bun=ball(g,.1,0x50443a,0,1.6,-.17);bun.scale.set(1,.8,.85);bun.name='socratic-hair-bun';const band=part(g,new THREE.TorusGeometry(.09,.012,6,20),0xc99a64,0,1.6,-.225);band.name='socratic-hair-band'}
  for(const side of [-1,1]){const thigh=box(g,.16,.18,.43,color,side*.13,.6,.25);thigh.rotation.x=-.08;box(g,.13,.42,.13,0xc9a17f,side*.13,.3,.44);const shoe=box(g,.17,.08,.25,wood,side*.13,.05,.51);shoe.name='socratic-shoe';box(g,.18,.025,.055,0xc99a64,side*.13,.1025,.52)}
  // A folded lap cloth descends from the seated waist over the knees, leaving the feet exposed.
  const clothPositions=[],clothIndices=[],clothRows=12,clothCols=16;
  for(let row=0;row<=clothRows;row++){const t=row/clothRows,y=t<.45?.78-t*.5:.555-(t-.45)*.76,z=t<.45?.19+t*.62:.469+(t-.45)*.035,width=.24+.08*Math.sin(Math.PI*t);
   for(let col=0;col<=clothCols;col++){const u=col/clothCols*2-1;clothPositions.push(u*width,y+.012*Math.cos(u*4*Math.PI),z+.015*Math.cos(u*5*Math.PI));if(row<clothRows&&col<clothCols){const n=row*(clothCols+1)+col;clothIndices.push(n,n+1,n+clothCols+1,n+1,n+clothCols+2,n+clothCols+1)}}}
  const clothGeometry=new THREE.BufferGeometry();clothGeometry.setAttribute('position',new THREE.Float32BufferAttribute(clothPositions,3));clothGeometry.setIndex(clothIndices);clothGeometry.computeVertexNormals();const clothMaterial=material(0xd6c8aa);clothMaterial.side=THREE.DoubleSide;const lapCloth=part(g,clothGeometry,clothMaterial);lapCloth.name='socratic-lap-drape';
  function limb(parent,from,to,radius,mat,name){const start=new THREE.Vector3(...from),end=new THREE.Vector3(...to),delta=end.clone().sub(start),mesh=part(parent,new THREE.CylinderGeometry(radius,radius,delta.length(),10),mat);mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.name=name;return mesh}
  const arm=new THREE.Group();arm.name='socratic-arm';arm.position.set(.23,1.18,.04);g.add(arm);limb(arm,[0,0,0],[0,-.27,.12],.065,color,'socratic-active-upper-arm');limb(arm,[0,-.27,.12],[0,-.31,.35],.05,0xc9a17f,'socratic-active-forearm');const activeHand=ball(arm,.062,0xc9a17f,0,-.31,.35);activeHand.name='socratic-active-hand';
  const elbow=[-.28,.98,.13],hand=sign>0?[-.08,1.36,.18]:[-.23,.83,.36];limb(g,[-.23,1.18,.04],elbow,.065,color,'socratic-resting-upper-arm');limb(g,elbow,hand,.05,0xc9a17f,'socratic-resting-forearm');const restingHand=ball(g,.06,0xc9a17f,...hand);restingHand.name='socratic-resting-hand';
  return {g,arm};
 }
 const a=participant(-1.85,1,colors.blue),b=participant(1.85,-1,colors.red),bubbles=[];
 for(const x of [-1.65,1.65]){const g=new THREE.Group();g.name='socratic-bubble';g.position.set(x,2.48,0);root.add(g);const bubbleMaterial=material(x<0?0x6e8879:0xc9975c),bubbleInk=material(0xeee1c6),bubble=ball(g,1,bubbleMaterial);bubble.scale.set(.46,.28,.1);
  const side=Math.sign(x),tailShape=new THREE.Shape();tailShape.moveTo(side*.04,-.19);tailShape.quadraticCurveTo(side*.12,-.32,side*.24,-.4);tailShape.quadraticCurveTo(side*.19,-.25,side*.28,-.16);tailShape.closePath();const tail=part(g,new THREE.ShapeGeometry(tailShape,12),bubbleMaterial,0,0,.005);tail.material.side=THREE.DoubleSide;tail.name='socratic-bubble-tail';
  if(x<0){
   // Balanced scales evoke an issue under examination, without naming an answer.
   box(g,.022,.31,.025,bubbleInk,0,0,.11);box(g,.31,.022,.025,bubbleInk,0,.105,.11);box(g,.13,.025,.025,bubbleInk,0,-.16,.11);
   for(const side of [-1,1]){box(g,.014,.1,.018,bubbleInk,side*.14,.05,.11);const pan=part(g,new THREE.TorusGeometry(.055,.011,5,16,Math.PI),bubbleInk,side*.14,0,.11);pan.rotation.z=Math.PI}
  }else{
   // A branching tree suggests ideas developing through dialogue.
   box(g,.025,.24,.025,bubbleInk,0,-.07,.11);for(const side of [-1,1]){const branch=box(g,.022,.16,.025,bubbleInk,side*.05,.025,.11);branch.rotation.z=-side*.55;for(const dy of [.065,.14]){const leaf=ball(g,.043,bubbleInk,side*(.075+dy*.35),dy,.11);leaf.scale.set(1,.65,.3)}}
  }
  bubbles.push(g)}
 // The shared question sits above the dialogue, independent of either speaker's emphasis.
 const question=new THREE.Group();question.name='socratic-shared-question';question.position.set(0,3.02,-.55);question.scale.setScalar(1.2);root.add(question);
 // One shallow, continuous speech cloud avoids visible seams between lobes.
 {const shape=new THREE.Shape();shape.moveTo(-.55,-.2);shape.bezierCurveTo(-.82,-.19,-.83,.08,-.62,.16);shape.bezierCurveTo(-.61,.36,-.42,.45,-.24,.38);shape.bezierCurveTo(-.11,.54,.12,.51,.23,.38);shape.bezierCurveTo(.43,.46,.62,.35,.62,.16);shape.bezierCurveTo(.82,.08,.8,-.16,.58,-.2);shape.bezierCurveTo(.48,-.35,.28,-.37,.13,-.29);shape.bezierCurveTo(0,-.38,-.23,-.37,-.35,-.28);shape.bezierCurveTo(-.44,-.31,-.52,-.27,-.55,-.2);shape.closePath();const cloud=part(question,new THREE.ExtrudeGeometry(shape,{depth:.04,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:2,curveSegments:16}),new THREE.MeshBasicMaterial({color:0xe4d8bd}),0,0,0);cloud.name='socratic-question-cloud';cloud.castShadow=false;cloud.receiveShadow=false}
 const questionHook=part(question,new THREE.TorusGeometry(.13,.026,8,28,Math.PI*1.45),ink,0,.08,.105);questionHook.rotation.z=-.25;box(question,.045,.12,.035,ink,0,-.105,.105);ball(question,.035,ink,0,-.235,.105);
 // Scale the connected dialogue arrangement about the ground, preserving
 // the table, seated figures, carpet and their animated gestures together.
 const dialogue=new THREE.Group();dialogue.name='socratic-dialogue-arrangement';for(const child of root.children.slice(dialoguePartsStart))dialogue.add(child);dialogue.scale.setScalar(1.2);dialogue.position.y=.05*(1-1.2);root.add(dialogue);
 // An abstract arch and bookcase suggest a setting without claiming a historical portrait.
 const backdrop=new THREE.Group();backdrop.name='socratic-back-wall';backdrop.position.set(0,0,-2.35);root.add(backdrop);
 const blockGeometry=new THREE.BoxGeometry(.555,.275,.24),blockMaterials=[material(0xc0b39b),material(0xc9bca4),material(0xb9ad96)];
 for(let row=0;row<5;row++)for(let i=0;i<8;i++){const block=part(backdrop,blockGeometry,blockMaterials[(i+row*2)%3],-1.96875+i*.5625,.1875+row*.28,0);block.name='socratic-wall-block'}
 const arch=new THREE.Group();arch.name='socratic-stone-arch';arch.position.set(-3.1,0,-2.35);root.add(arch);for(const x of [-.62,.62]){box(arch,.22,1.8,.28,stone,x,.9,0);box(arch,.35,.14,.4,stone,x,1.8,0)}
 // A broad annular stone crown has real depth and meets both pier capitals.
 {const shape=new THREE.Shape();shape.moveTo(.74,0);shape.absarc(0,0,.74,0,Math.PI,false);shape.lineTo(-.5,0);shape.absarc(0,0,.5,Math.PI,0,true);shape.closePath();const crown=part(arch,new THREE.ExtrudeGeometry(shape,{depth:.28,bevelEnabled:false,curveSegments:32}),stone,0,1.8,-.14);crown.name='socratic-arch-crown'}
 // A distant garden through the arch gives the dialogue a setting beyond the wall.
 const garden=new THREE.Group();garden.name='socratic-arch-garden';garden.position.set(-3.1,.07,-2.57);root.add(garden);
 const sky=part(garden,new THREE.PlaneGeometry(1.04,1.83),new THREE.MeshBasicMaterial({color:0xd4d8c3,side:THREE.DoubleSide}),0,.915,0);sky.castShadow=false;
 for(const [height,color,depth] of [[.64,0xaab79b,.01],[.43,0x8ea687,.02],[.24,0x718d6e,.03]]){const shape=new THREE.Shape();shape.moveTo(-.52,0);shape.lineTo(-.52,height*.55);shape.lineTo(-.29,height);shape.lineTo(0,height*.62);shape.lineTo(.26,height*.9);shape.lineTo(.52,height*.5);shape.lineTo(.52,0);shape.closePath();const ridge=part(garden,new THREE.ShapeGeometry(shape),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}),0,0,depth);ridge.castShadow=false}
 for(const [x,h] of [[-.31,.52],[.06,.7],[.3,.42]]){const tree=part(garden,new THREE.ConeGeometry(.07,h,7),0x6d8467,x,.25+h/2,.04);tree.castShadow=false}
 // Radial joints and pier courses suggest separate carved stones.
 for(let i=1;i<8;i++){const angle=Math.PI*i/8,joint=box(arch,.012,.23,.006,0xa69a84,.62*Math.cos(angle),1.8+.62*Math.sin(angle),.145);joint.rotation.z=angle-Math.PI/2;joint.name='socratic-arch-stone-joint'}
 for(const x of [-.62,.62])for(const y of [.38,.78,1.18,1.58])box(arch,.21,.014,.012,0xa69a84,x,y,.145);
 for(let i=0;i<9;i++){const angle=Math.PI*(.1+i*.1),leaf=ball(arch,.13,i%2?0x728d6c:0x5e7d5d,.7*Math.cos(angle),1.8+.7*Math.sin(angle),.04);leaf.scale.set(.6,1.25,.4);leaf.rotation.z=-angle}
 const shelf=new THREE.Group();shelf.position.set(3.05,0,-2.3);root.add(shelf);for(const x of [-.62,.62])box(shelf,.12,2.15,.4,wood,x,1.08,0);for(const y of [.1,.75,1.4,2.1])box(shelf,1.35,.1,.42,wood,0,y,0);
 for(let row=0;row<3;row++)for(let i=0;i<5;i++){const h=[.35,.42,.46,.39,.43][(i+row)%5],x=-.45+i*.22,y=.15+row*.65+h/2,book=box(shelf,.16,h,.3,i%2?ink:colors.red,x,y,0);book.name='socratic-shelf-book';for(const offset of [-.12,.12])box(shelf,.165,.018,.008,colors.gold,x,y+offset,.154)}
 const bust=new THREE.Group();bust.name='socratic-bust';bust.position.set(3.05,2.16,-2.3);root.add(bust);box(bust,.52,.09,.36,stone,0,.045,0);part(bust,new THREE.CylinderGeometry(.14,.25,.3,12),stone,0,.24,0);ball(bust,.16,stone,0,.49,0);
 // A small armillary on a stone pedestal completes the study setting and
 // leaves the moving hands and dialogue markers unobstructed.
 const armillary=new THREE.Group();armillary.name='socratic-armillary';armillary.position.set(3.4,.05,.75);root.add(armillary);
 const pedestal=box(armillary,.62,.64,.62,stone,0,.32,0);pedestal.name='socratic-armillary-pedestal';for(const y of [.18,.37,.55])box(armillary,.61,.012,.008,0xa99c87,0,y,.315);
 cylinder(armillary,.2,.08,wood,0,.68,0);cylinder(armillary,.045,.2,colors.gold,0,.82,0);for(const angle of [0,Math.PI/3,-Math.PI/3]){const hoop=part(armillary,new THREE.TorusGeometry(.31,.018,7,40),colors.gold,0,1.2,0);hoop.rotation.y=angle;hoop.rotation.z=.2}ball(armillary,.06,colors.gold,0,1.2,0);
 // Foliage follows the arch; it stays behind both participants and the dialogue cues.
 for(let i=0;i<9;i++){const y=.3+i*.21,x=-3.72+.08*Math.sin(i*.8),stem=ball(root,.12,0x728d6c,x,y,-2.34);stem.scale.set(.65,1.2,.5);stem.rotation.z=(i%2?1:-1)*.35}
 const planter=cylinder(root,.28,.38,0xa76c50,-3.5,.19,.75);planter.name='socratic-planter';for(let i=0;i<5;i++){const a=i*Math.PI*2/5,leaf=ball(root,.18,0x718b6f,-3.5+Math.sin(a)*.2,.5+(i%2)*.1,.75+Math.cos(a)*.15);leaf.scale.set(.65,1.4,.55)}
 return done(scene,root,(_t,value)=>{bubbles[0].scale.setScalar(1-value*.45);bubbles[1].scale.setScalar(.55+value*.45);a.arm.rotation.x=-value*.5;b.arm.rotation.x=-(1-value)*.5});
}
export function buildNewcomb(scene){
 const root=stage(scene),dark=material(0x3d514a),gold=material(0xbd9055),stone=material(0xc4b79e);
 root.rotation.y=Math.PI/4;
 cylinder(root,4.95,.06,0xa49d89,0,.02,0);const dais=cylinder(root,3.2,.15,stone,0,.12,0);dais.name='newcomb-dais';
 // Jointed stonework defines the two levels without obscuring the selection frames.
 const tileMaterials=[0xbdb09b,0xc4b8a4,0xb7aa96,0xc9bba7].map(material),daisEdge=material(0xb3a58e);
 // Three staggered rings read as individual stone blocks rather than long
 // radial planks. Their seams remain below all props and the selection rims.
 for(const [row,inner,outer,count] of [[0,3.25,3.74,27],[1,3.76,4.25,31],[2,4.27,4.78,35]])for(let i=0;i<count;i++){
  const step=Math.PI*2/count,start=(i+(row%2)*.5)*step+.0035;
  const tile=part(root,new THREE.RingGeometry(inner,outer,3,1,start,step-.007),tileMaterials[(i*7+row*3)%tileMaterials.length],0,.055,0);tile.name='newcomb-paving-stone';tile.rotation.x=-Math.PI/2;
 }
 for(let i=0;i<24;i++){const start=i*Math.PI*2/24+.008,segment=part(root,new THREE.RingGeometry(2.85,3.15,4,1,start,Math.PI*2/24-.016),daisEdge,0,.198,0);segment.rotation.x=-Math.PI/2}
 function selection(x,name){const g=new THREE.Group(),active=material(0xffd37c);active.emissive.setHex(0x9c5d14);active.emissiveIntensity=.6;g.name=name;g.position.set(x,.23,0);root.add(g);for(const z of [-.89,.89])box(g,2.14,.07,.11,active,0,0,z);for(const dx of [-1.04,1.04])box(g,.11,.07,1.78,active,dx,0,0);return g}
 const selectedOpaque=selection(-1.4,'newcomb-selection-opaque'),selectedClear=selection(1.4,'newcomb-selection-clear');
 const closed=new THREE.Group();closed.name='newcomb-opaque';closed.position.set(-1.4,-.065,0);root.add(closed);
 const closedBody=box(closed,1.8,1.36,1.5,dark,0,.94,0);closedBody.name='newcomb-opaque-body';box(closed,1.9,.14,1.6,dark,0,1.69,0);
 for(const x of [-.86,.86])for(const z of [-.71,.71]){box(closed,.13,1.43,.13,gold,x,.96,z);ball(closed,.065,gold,x,1.7,z)}
 // Folded corner plates and their rivets articulate the sealed chest without
 // revealing or implying anything about its contents.
 for(const sideX of [-1,1])for(const sideZ of [-1,1])for(const y of [.42,1.49]){
  const front=box(closed,.25,.23,.035,gold,sideX*.79,y,sideZ*.775);front.name='newcomb-opaque-corner-plate';
  const side=box(closed,.035,.23,.25,gold,sideX*.905,y,sideZ*.66);side.name='newcomb-opaque-corner-plate';
  for(const dy of [-.065,.065]){const rivet=ball(closed,.024,0x76562f,sideX*.8,y+dy,sideZ*.798);rivet.name='newcomb-opaque-rivet';rivet.scale.z=.5}
 }
 box(closed,.25,.3,.05,gold,0,1.18,.78);ball(closed,.055,dark,0,1.2,.82);box(closed,.035,.09,.025,dark,0,1.13,.82);
 for(const y of [.33,1.57]){for(const z of [-.76,.76])box(closed,1.75,.06,.04,gold,0,y,z);for(const x of [-.89,.89])box(closed,.04,.06,1.48,gold,x,y,0)}
 for(const x of [-.82,.82])for(const y of [.42,1.5])for(const z of [-.78,.78])ball(closed,.035,gold,x,y,z);
 // Inset lid edging and front panels reinforce the sealed, opaque construction.
 for(const z of [-.59,.59])box(closed,1.55,.025,.025,gold,0,1.77,z);
 for(const x of [-.77,.77])box(closed,.025,.025,1.2,gold,x,1.77,0);
 for(const x of [-.65,.65])box(closed,.025,.84,.015,gold,x,.94,.756);
 for(const y of [.52,1.36])box(closed,1.31,.025,.015,gold,0,y,.756);
 const clear=new THREE.Group();clear.name='newcomb-clear';clear.position.set(1.4,-.045,0);root.add(clear);
 const clearBase=box(clear,1.85,.1,1.55,dark,0,.29,0);clearBase.name='newcomb-clear-base';
 const glass=new THREE.MeshStandardMaterial({color:0x91b7ae,transparent:true,opacity:.2,roughness:.18,side:THREE.DoubleSide,depthWrite:false});
 for(const z of [-.74,.74]){const pane=part(clear,new THREE.PlaneGeometry(1.76,1.36),glass,0,1.02,z);pane.castShadow=false;pane.receiveShadow=false}
 for(const x of [-.88,.88]){const pane=part(clear,new THREE.PlaneGeometry(1.48,1.36),glass,x,1.02,0);pane.rotation.y=Math.PI/2;pane.castShadow=false;pane.receiveShadow=false}
 const lid=part(clear,new THREE.PlaneGeometry(1.76,1.48),glass,0,1.7,0);lid.rotation.x=-Math.PI/2;lid.castShadow=false;lid.receiveShadow=false;
 for(const x of [-.9,.9])for(const z of [-.75,.75]){box(clear,.08,1.45,.08,gold,x,1,z);ball(clear,.07,gold,x,1.73,z)}
 for(const z of [-.75,.75])box(clear,1.85,.08,.08,gold,0,1.72,z);for(const x of [-.9,.9])box(clear,.08,.08,1.55,gold,x,1.72,0);
 const clearLatch=box(clear,.23,.23,.055,gold,0,1.58,.77);clearLatch.name='newcomb-clear-latch';ball(clear,.025,dark,0,1.57,.805);
 const coinRim=new THREE.TorusGeometry(.135,.009,6,24);
 const coinShade=material(0xb4864c);
 for(const [x,z,count] of [[-.48,-.37,4],[-.08,-.37,3],[.34,-.37,4],[-.48,.03,3],[-.06,.03,5],[.36,.03,3],[-.36,.4,4],[.08,.4,3],[.48,.4,2]]){for(let i=0;i<count*2;i++){const coin=cylinder(clear,.19,.035,i%2?gold:coinShade,x,.3575+i*.035,z);coin.name='newcomb-coin'}const top=.34+count*.07;const rim=part(clear,coinRim,0xe0b778,x,top+.004,z);rim.name='newcomb-coin-engraving';rim.rotation.x=Math.PI/2;
  const strokes=[];for(let i=0;i<8;i++){const a=i*Math.PI/4;strokes.push(x+.045*Math.cos(a),top+.01,z+.045*Math.sin(a),x+.095*Math.cos(a),top+.01,z+.095*Math.sin(a))}const faceGeometry=new THREE.BufferGeometry();faceGeometry.setAttribute('position',new THREE.Float32BufferAttribute(strokes,3));const face=new THREE.LineSegments(faceGeometry,new THREE.LineBasicMaterial({color:0x8f6c3f}));face.name='newcomb-coin-face';clear.add(face)}
 const arch=new THREE.Group();arch.name='newcomb-arch';arch.position.set(0,0,-2.55);root.add(arch);
 for(const x of [-2.55,2.55]){
  const base=box(arch,.48,.12,.48,stone,x,.115,0);base.name='newcomb-column-base';
  cylinder(arch,.2,.12,stone,x,.235,0);const shaft=cylinder(arch,.15,2.05,stone,x,1.32,0);shaft.name='newcomb-column-shaft';
  cylinder(arch,.2,.12,stone,x,2.405,0);box(arch,.45,.15,.55,stone,x,2.53,0);
  for(const y of [.43,.84,1.25,1.66,2.07]){const course=part(arch,new THREE.TorusGeometry(.151,.009,5,20),0xa99d87,x,y,0);course.rotation.x=Math.PI/2}
 }
 // Extrude an elliptical annulus so the crown has stone-like depth and
 // substantial radial thickness while the opening stays clear.
 {const shape=new THREE.Shape(),segments=48;for(let i=0;i<=segments;i++){const a=Math.PI-i*Math.PI/segments,x=2.71*Math.cos(a),y=1.08*Math.sin(a);if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y)}for(let i=0;i<=segments;i++){const a=i*Math.PI/segments;shape.lineTo(2.39*Math.cos(a),.76*Math.sin(a))}shape.closePath();const crown=part(arch,new THREE.ExtrudeGeometry(shape,{depth:.32,bevelEnabled:false}),stone,0,2.55,-.16);crown.name='newcomb-arch-crown'}
 // Individual voussoirs read across the face of the flattened stone arch.
 for(let i=1;i<16;i++){const a=i*Math.PI/16,x=2.55*Math.cos(a),y=2.55+.92*Math.sin(a),joint=box(arch,.018,.31,.014,0xa99d87,x,y,.165);joint.rotation.z=a-Math.PI/2;joint.name='newcomb-arch-joint'}
 // A folded swath follows the arch, with a deep hanging center and edged hem.
 const clothPositions=[],clothIndices=[],clothRows=16,clothCols=40;
 function clothPoint(u,v){const x=.08+2.48*u,top=2.55+1.08*Math.sqrt(Math.max(0,1-(x/2.71)**2))+.045,drop=.34+1.03*Math.pow(Math.sin(Math.PI*u),.8)+.28*u,fold=.065*Math.sin(u*5*Math.PI+v*3)*Math.sin(Math.PI*v*.85);return new THREE.Vector3(x,top-v*drop,-2.34+fold)}
 for(let row=0;row<=clothRows;row++)for(let i=0;i<=clothCols;i++){const p=clothPoint(i/clothCols,row/clothRows);clothPositions.push(p.x,p.y,p.z);if(row<clothRows&&i<clothCols){const n=row*(clothCols+1)+i;clothIndices.push(n,n+clothCols+1,n+1,n+1,n+clothCols+1,n+clothCols+2)}}
 const clothGeometry=new THREE.BufferGeometry();clothGeometry.setAttribute('position',new THREE.Float32BufferAttribute(clothPositions,3));clothGeometry.setIndex(clothIndices);clothGeometry.computeVertexNormals();const clothMaterial=material(0x607a71);clothMaterial.side=THREE.DoubleSide;const drape=part(root,clothGeometry,clothMaterial);drape.name='newcomb-drape';
 // Cloth folds across the thickness of the stone and hangs behind the arch.
 {const positions=[],indices=[],rows=12,columns=40;for(let row=0;row<=rows;row++){const v=row/rows;for(let col=0;col<=columns;col++){const u=col/columns,front=clothPoint(u,0),z=-2.34-.44*v,y=front.y+.035*Math.sin(Math.PI*v)-.34*Math.pow(Math.max(0,(v-.6)/.4),1.25)+.025*Math.sin(u*5*Math.PI+v*2)*Math.sin(Math.PI*v);positions.push(front.x,y,z);if(row<rows&&col<columns){const n=row*(columns+1)+col;indices.push(n,n+columns+1,n+1,n+1,n+columns+1,n+columns+2)}}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const back=part(root,geometry,clothMaterial);back.name='newcomb-drape-over-arch'}
 const hemPoints=[];for(let i=0;i<=40;i++)hemPoints.push(clothPoint(i/40,.97));const hem=part(root,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hemPoints),60,.018,6,false),0xb79a69);hem.name='newcomb-drape-hem';
 // Woody stems and paired pointed leaves frame the arch rather than forming a bead chain.
 const foliage=new THREE.Group();foliage.name='newcomb-olive-branch';root.add(foliage);const stemMaterial=material(0x716e4b),leaves=[material(0x6b7957),material(0x85916b)];
 const stemPoints=[[-2.84,.36,-2.64],[-2.88,1.35,-2.64],[-2.7,2.32,-2.64],[-2.16,2.91,-2.64],[-1.3,3.42,-2.64],[-.45,3.59,-2.64]].map(p=>new THREE.Vector3(...p));
 const stemCurve=new THREE.CatmullRomCurve3(stemPoints);part(foliage,new THREE.TubeGeometry(stemCurve,48,.027,7,false),stemMaterial);
 const leafShape=new THREE.BufferGeometry();leafShape.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-.1,.16,0,0,.38,0,.1,.16,0,0,.18,.035],3));leafShape.setIndex([0,1,4,1,2,4,2,3,4,3,0,4]);leafShape.computeVertexNormals();leaves.forEach(m=>m.side=THREE.DoubleSide);
 for(let i=0;i<15;i++){const u=.16+i*.055,anchor=stemCurve.getPoint(u),tangent=stemCurve.getTangent(u);for(const side of [-1,1]){const direction=new THREE.Vector3(tangent.x*.48-tangent.y*side,tangent.y*.48+tangent.x*side,.05).normalize(),end=anchor.clone().addScaledVector(direction,.19);part(foliage,new THREE.CylinderGeometry(.008,.012,.19,6),stemMaterial).position.copy(anchor.clone().add(end).multiplyScalar(.5));const twig=foliage.children[foliage.children.length-1];twig.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);const leaf=part(foliage,leafShape,leaves[(i+(side>0?1:0))%2],end.x,end.y,end.z);leaf.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);leaf.name='newcomb-olive-leaf'}}
 // Short offshoots grow from the main stem, producing a fuller canopy rather
 // than a single line of paired leaves around the stone arch.
 for(const [u,dx,dy] of [[.38,-.54,.35],[.62,-.48,.48],[.8,-.32,.47]]){const start=stemCurve.getPoint(u),end=start.clone().add(new THREE.Vector3(dx,dy,.025)),mid=start.clone().lerp(end,.55).add(new THREE.Vector3(.05,.04,0)),curve=new THREE.QuadraticBezierCurve3(start,mid,end),branch=part(foliage,new THREE.TubeGeometry(curve,16,.015,6,false),stemMaterial);branch.name='newcomb-olive-offshoot';for(let i=0;i<5;i++){const t=.24+i*.17,p=curve.getPoint(t),tangent=curve.getTangent(t);for(const side of [-1,1]){const direction=new THREE.Vector3(tangent.x*.6-tangent.y*side,tangent.y*.6+tangent.x*side,.04).normalize(),leaf=part(foliage,leafShape,leaves[(i+(side>0?1:0))%2],p.x,p.y,p.z);leaf.scale.setScalar(.72+.08*(i%2));leaf.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);leaf.name='newcomb-olive-leaf'}}}
 // A shorter branch on the opposite side balances the arch and remains
 // behind the glass box; it does not represent a selection indicator.
 const rightBranch=new THREE.Group();rightBranch.name='newcomb-right-branch';root.add(rightBranch);
 const rightCurve=new THREE.CatmullRomCurve3([[2.55,.38,-2.68],[2.83,1.05,-2.68],[3.04,1.64,-2.68],[3.38,2.14,-2.68]].map(p=>new THREE.Vector3(...p)));
 part(rightBranch,new THREE.TubeGeometry(rightCurve,28,.026,7,false),stemMaterial);
 for(let i=0;i<9;i++){const u=.18+i*.085,anchor=rightCurve.getPoint(u),tangent=rightCurve.getTangent(u);for(const side of [-1,1]){const direction=new THREE.Vector3(tangent.x*.48-tangent.y*side,tangent.y*.48+tangent.x*side,.04).normalize(),end=anchor.clone().addScaledVector(direction,.16),twig=part(rightBranch,new THREE.CylinderGeometry(.007,.011,.16,6),stemMaterial);twig.position.copy(anchor.clone().add(end).multiplyScalar(.5));twig.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);const leaf=part(rightBranch,leafShape,leaves[(i+(side>0?1:0))%2],end.x,end.y,end.z);leaf.scale.setScalar(.85);leaf.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);leaf.name='newcomb-olive-leaf'}}
 const clay=material(0xa46c51);const urn=part(root,new THREE.SphereGeometry(.38,16,12),clay,3.7,.46,.55);urn.scale.set(.78,1.25,.78);cylinder(root,.18,.18,clay,3.7,.94,.55);const lip=part(root,new THREE.TorusGeometry(.19,.035,8,20),clay,3.7,1.04,.55);lip.rotation.x=Math.PI/2;
 for(const x of [3.4,4]){const handle=part(root,new THREE.TorusGeometry(.15,.035,8,20,Math.PI),clay,x,.68,.55);handle.rotation.z=x<3.7?Math.PI/2:-Math.PI/2}
 // Painted olive sprigs and a rim band give the vessel a readable ceramic finish.
 const urnPaint=material(0xd9b685),urnStem=new THREE.CatmullRomCurve3([[3.7,.27,.835],[3.7,.43,.845],[3.7,.63,.825],[3.7,.8,.78]].map(p=>new THREE.Vector3(...p)));
 const urnSprig=part(root,new THREE.TubeGeometry(urnStem,20,.009,5,false),urnPaint);urnSprig.name='newcomb-urn-sprig';
 for(let i=0;i<6;i++){const side=i%2?1:-1,y=.34+Math.floor(i/2)*.14,leaf=ball(root,.065,urnPaint,3.7+side*.07,y,.826);leaf.scale.set(.48,1.2,.14);leaf.rotation.z=-side*.75;leaf.name='newcomb-urn-leaf'}
 const urnBand=part(root,new THREE.TorusGeometry(.22,.012,6,32),urnPaint,3.7,.865,.55);urnBand.rotation.x=Math.PI/2;urnBand.name='newcomb-urn-band';
 // Low bowl: a hollow lathed profile rather than a solid sphere.
 const bowlProfile=[[0,0],[.20,0],[.29,.05],[.37,.17],[.39,.24],[.35,.24],[.32,.19],[.25,.09],[.18,.055],[0,.055]].map(([x,y])=>new THREE.Vector2(x,y));
 const bowl=part(root,new THREE.LatheGeometry(bowlProfile,32),0x617b6d,3.05,.055,1.7);bowl.name='newcomb-bowl';
 // A neutral sculptural bust supplies a human-scale observer without depicting a named philosopher.
 const bust=new THREE.Group();bust.name='newcomb-bust';bust.position.set(-3.82,-.01,1.55);bust.scale.setScalar(1.25);root.add(bust);
 box(bust,.75,.22,.65,stone,0,.15,0);box(bust,.58,.32,.49,stone,0,.42,0);
 const shoulders=ball(bust,.42,stone,0,.88,0);shoulders.scale.set(1.1,.72,.7);
 cylinder(bust,.12,.24,stone,0,1.15,0);const head=ball(bust,.21,stone,0,1.43,0);head.scale.set(.84,1.15,.83);
 const hair=ball(bust,.21,stone,0,1.53,-.025);hair.scale.set(.9,.68,.9);
 for(const x of [-.075,.075]){const eye=ball(bust,.018,0x8e8270,x,1.44,.169);eye.scale.z=.4}
 // Carved facial volumes, curled hair and a hand at the chin make the observer's
 // thinking pose legible while keeping the sculpture a single stone material.
 const nose=ball(bust,.05,stone,0,1.385,.175);nose.name='newcomb-bust-nose';nose.scale.set(.7,1.4,1.1);
 const beard=ball(bust,.18,stone,0,1.25,.075);beard.name='newcomb-bust-beard';beard.scale.set(.87,.82,.76);
 const curlGeometry=new THREE.SphereGeometry(.045,10,8);
 for(let row=0;row<3;row++)for(let col=-2;col<=2;col++){const x=col*.065,y=1.56+row*.038,z=.11-Math.abs(col)*.018-row*.025;const curl=part(bust,curlGeometry,stone,x,y,z);curl.name='newcomb-bust-hair-curl';curl.scale.set(1,.8,1)}
 for(let i=0;i<7;i++){const x=(i-3)*.044,curl=part(bust,curlGeometry,stone,x,1.20+Math.abs(i-3)*.012,.17-Math.abs(i-3)*.01);curl.name='newcomb-bust-beard-curl';curl.scale.set(.65,1.25,.7)}
 function bustCurve(points,r,name){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const m=part(bust,new THREE.TubeGeometry(curve,20,r,8,false),stone);m.name=name;return m}
 bustCurve([[.28,.85,.12],[.34,.91,.24],[.23,1.05,.28],[.10,1.21,.24]],.065,'newcomb-bust-thinking-arm');
 const hand=ball(bust,.08,stone,.085,1.235,.235);hand.name='newcomb-bust-thinking-hand';hand.scale.set(.8,1.2,.6);
 for(let i=0;i<3;i++)bustCurve([[.07+i*.026,1.24,.27],[.052+i*.024,1.31,.23]],.012,'newcomb-bust-finger');
 // Shallow carved folds follow the front of the rounded shoulders.
 for(let i=0;i<3;i++)bustCurve([[-.34,.87+i*.045,.18],[-.18,.77+i*.055,.25],[.03,.74+i*.055,.27],[.21,.79+i*.05,.23]],.012,'newcomb-bust-drapery-fold');
 for(let i=0;i<3;i++){const book=box(root,.8,.11,.55,i%2?0x6f8a80:0xa46c51,-3.45,.12+i*.13,.7);book.name='newcomb-observer-book';box(root,.72,.045,.5,0xe0d4ba,-3.45,.15+i*.13,.7)}
 // Two diagram plaques summarize the one-box and two-box options.
 box(root,3.1,.12,.78,0x805b43,0,.27,2.35);
 // A small woven runner lies on the lower level in front of the dais.
 const runner=box(root,2.5,.012,.8,0xa75d4c,0,.061,3.7);runner.name='newcomb-runner';
 for(const x of [-1.15,1.15])box(root,.025,.006,.68,0xcaa36d,x,.071,3.7);for(const z of [3.36,4.04])box(root,2.28,.006,.025,0xcaa36d,0,.071,z);
 for(let i=0;i<22;i++)for(const z of [3.27,4.13])box(root,.025,.008,.09,0xcaa36d,-1.18+i*.112,.062,z);
 function choicePlaque(x,name,two){const group=new THREE.Group(),light=material(0x6f8278);group.name=name;group.position.set(x,.35,2.35);root.add(group);const disc=cylinder(group,.32,.04,0xd9cdb4,0,0,0);disc.name='newcomb-choice-disc';const icon=(offset)=>{for(const z of [-.1,.1])box(group,.21,.02,.02,light,offset,.035,z);for(const xx of [-.105,.105])box(group,.02,.02,.21,light,offset+xx,.035,0)};icon(two?-.075:0);if(two)icon(.075);const rim=part(group,new THREE.TorusGeometry(.29,.012,6,32),gold,0,.025,0);rim.rotation.x=Math.PI/2;rim.name='newcomb-choice-rim';return light}
 const oneChoice=choicePlaque(-.72,'newcomb-choice-one',false),twoChoice=choicePlaque(.72,'newcomb-choice-two',true);
 return done(scene,root,(_t,value)=>{const two=value>=.5;selectedOpaque.visible=true;selectedClear.children.forEach(piece=>piece.visible=two);oneChoice.color.setHex(two?0x6f8278:0xd19c51);twoChoice.color.setHex(two?0xd19c51:0x6f8278)});
}
export function buildRecurrence(scene){
 const root=stage(scene),grass=material(0x778168),stone=material(0xc9bda4),seam=material(0xa99b82),wood=material(0x71513e),leaf=material(0x78845b);
 cylinder(root,4.95,.06,grass,0,.02,0);
 const path=part(root,new THREE.RingGeometry(2.8,3.65,96),stone,0,.1225,0);path.name='recurrence-path';path.rotation.x=-Math.PI/2;path.receiveShadow=false;path.material.side=THREE.DoubleSide;
 // Vertical stone skirts connect the raised path surface to the garden floor.
 for(const radius of [2.8,3.65]){const side=part(root,new THREE.CylinderGeometry(radius,radius,.0725,96,1,true),stone,0,.08625,0);side.name='recurrence-path-side';side.material.side=THREE.DoubleSide}
 for(let i=0;i<36;i++){const a=i*Math.PI*2/36,tile=box(root,.035,.014,.82,seam,Math.sin(a)*3.225,.12,Math.cos(a)*3.225);tile.rotation.y=a;tile.castShadow=false}
 const pavingJoint=part(root,new THREE.TorusGeometry(3.225,.012,5,96),seam,0,.119,0);pavingJoint.rotation.x=Math.PI/2;pavingJoint.castShadow=false;
 const curb=part(root,new THREE.TorusGeometry(1.38,.13,8,64),stone,0,.2,0);curb.rotation.x=Math.PI/2;
 // The central tree widens into asymmetric roots and bends gently toward its
 // crown, replacing a straight tapered cylinder with an organic trunk.
 const trunkGeometry=new THREE.CylinderGeometry(.18,.3,1.8,24,16),trunkPositions=trunkGeometry.getAttribute('position');
 function trunkSurface(t,a,extra=0){const radius=THREE.MathUtils.lerp(.3,.18,t)*(1+.65*Math.pow(1-t,4)*(.5+.5*Math.cos(a*7))),bendX=.12*t*t,bendZ=.04*Math.sin(Math.PI*t);return new THREE.Vector3(bendX+(radius+extra)*Math.cos(a),.05+1.8*t,bendZ+(radius+extra)*Math.sin(a))}
 for(let i=0;i<trunkPositions.count;i++){const x=trunkPositions.getX(i),y=trunkPositions.getY(i),z=trunkPositions.getZ(i),t=THREE.MathUtils.clamp((y+.9)/1.8,0,1),a=Math.atan2(z,x),r=Math.hypot(x,z),base=THREE.MathUtils.lerp(.3,.18,t),p=trunkSurface(t,a);trunkPositions.setXYZ(i,.12*t*t+(p.x-.12*t*t)*r/base,y,.04*Math.sin(Math.PI*t)+(p.z-.04*Math.sin(Math.PI*t))*r/base)}
 trunkGeometry.computeVertexNormals();const trunk=part(root,trunkGeometry,wood,0,.95,0);trunk.name='recurrence-tree-trunk';
 const bark=material(0x5e4937);for(let i=0;i<13;i++){const points=[];for(let j=0;j<=18;j++){const t=.08+j/18*.82,a=i*Math.PI*2/13+.035*Math.sin(t*7+i),p=trunkSurface(t,a,.004);points.push(p)}const groove=part(root,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,.006,5,false),bark);groove.name='recurrence-tree-bark'}
 function branch(a,b,r){const d=new THREE.Vector3().subVectors(b,a),m=part(root,new THREE.CylinderGeometry(r,r*1.4,d.length(),8),wood);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize())}
 for(const [x,y,z] of [[-.8,2,-.2],[.8,2,.15],[0,2.35,-.5],[-.45,2.45,.5],[.55,2.5,.4]]){branch(new THREE.Vector3(0,1.35,0),new THREE.Vector3(x,y,z),.07);const crown=ball(root,.53,leaf,x,y+.1,z);crown.scale.set(1,.38,.85);crown.receiveShadow=false}
 // Roots and a broken circle of stone seats frame the tree without crossing the path.
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7;branch(new THREE.Vector3(0,.32,0),new THREE.Vector3(Math.sin(a)*.8,.1,Math.cos(a)*.8),.07)}
 // A low, irregular earth bed and embedded stones give the roots a ground
 // surface while staying inside the circular seat and walking route.
 {const shape=new THREE.Shape();for(let i=0;i<48;i++){const a=i*Math.PI*2/48,r=1.14+.06*Math.sin(5*a+.4)+.025*Math.sin(9*a),x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y)}shape.closePath();const soil=part(root,new THREE.ShapeGeometry(shape),0x69775b,0,.054,0);soil.rotation.x=-Math.PI/2;soil.name='recurrence-tree-earth';soil.castShadow=false;
  const rocks=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),material(0xa59d83),18),dummy=new THREE.Object3D();rocks.name='recurrence-tree-ground-stones';for(let i=0;i<18;i++){const a=i*2.399963,r=.79+.29*((i*11)%17)/16,size=.08+.035*(i%3);dummy.position.set(Math.cos(a)*r,.055+size*.23,Math.sin(a)*r);dummy.rotation.set(.1,i*.7,.1);dummy.scale.set(size*1.25,size*.45,size);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix)}rocks.computeBoundingSphere();root.add(rocks);
 }
 for(let i=0;i<12;i++){if(i===0||i===6)continue;const a=i*Math.PI*2/12,seat=box(root,.68,.315,.3,stone,Math.sin(a)*1.55,.2075,Math.cos(a)*1.55);seat.rotation.y=a;seat.name='recurrence-seat';const joint=box(root,.68,.035,.3,seam,seat.position.x,.385,seat.position.z);joint.rotation.y=a}
 for(const [x,y,z,r] of [[-1.08,2.17,.06,.42],[1.05,2.12,.02,.44],[-.65,2.65,-.12,.4],[.5,2.7,-.12,.42],[0,2.42,.48,.4]]){const crown=ball(root,r,leaf,x,y+.12,z);crown.scale.set(1.15,.38,.85);crown.receiveShadow=false}
 // Outer clusters grow from the main forks rather than floating as separate crowns.
 for(const [from,to] of [[[ -.8,2,-.2],[-1.08,2.17,.06]],[[.8,2,.15],[1.05,2.12,.02]],[[0,2.35,-.5],[-.65,2.65,-.12]],[[0,2.35,-.5],[.5,2.7,-.12]],[[-.45,2.45,.5],[0,2.42,.48]]]){const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(...from),new THREE.Vector3((from[0]+to[0])*.55,(from[1]+to[1])*.53,(from[2]+to[2])*.5),new THREE.Vector3(...to)),bough=part(root,new THREE.TubeGeometry(curve,16,.035,7,false),wood);bough.name='recurrence-outer-bough'}
 // Layer foliage over the crown, keeping the small leaves inexpensive to draw.
 const leafGeometry=new THREE.SphereGeometry(1,8,6),leafColors=[material(0x82905c),material(0x99a566),material(0x687b50)];
 const canopies=[[-.8,2,-.2],[.8,2,.15],[0,2.35,-.5],[-.45,2.45,.5],[.55,2.5,.4],[-1.08,2.17,.06],[1.05,2.12,.02],[-.65,2.65,-.12],[.5,2.7,-.12],[0,2.42,.48]];
 const leafTransform=new THREE.Object3D();
 for(let color=0;color<3;color++){const leaves=new THREE.InstancedMesh(leafGeometry,leafColors[color],200);leaves.name='recurrence-canopy-leaves';for(let n=0;n<200;n++){const index=n*3+color,c=Math.floor(index/60),i=index%60,[cx,cy,cz]=canopies[c],a=i*2.399963+c*.31,r=.51*Math.sqrt((i+.5)/60);leafTransform.position.set(cx+Math.cos(a)*r*1.1,cy+.12+.22*Math.sqrt(Math.max(0,1-(r/.52)**2)),cz+Math.sin(a)*r*.8);leafTransform.rotation.set(.15*Math.sin(i),-a,.15*Math.cos(i));leafTransform.scale.set(.13,.035,.075);leafTransform.updateMatrix();leaves.setMatrixAt(n,leafTransform.matrix)}leaves.computeBoundingSphere();leaves.castShadow=true;root.add(leaves)}
 // A sparse lower layer rounds the edges of the canopy without concealing
 // the trunk and large branches below.
 {const leaves=new THREE.InstancedMesh(leafGeometry,leafColors[0],100);leaves.name='recurrence-canopy-side-leaves';for(let i=0;i<100;i++){const [cx,cy,cz]=canopies[Math.floor(i/10)],a=(i%10)*Math.PI*2/10+.23*(Math.floor(i/10)%3),r=.4+.04*(i%2);leafTransform.position.set(cx+Math.cos(a)*r,cy+.02+.07*Math.sin(i*1.7),cz+Math.sin(a)*r*.8);leafTransform.rotation.set(.3*Math.sin(a),-a,.4*Math.cos(a));leafTransform.scale.set(.12,.045,.07);leafTransform.updateMatrix();leaves.setMatrixAt(i,leafTransform.matrix)}leaves.computeBoundingSphere();leaves.castShadow=false;root.add(leaves)}
 // A planted inner verge sits away from both the seat ring and the walking route.
 const petalGeometry=new THREE.SphereGeometry(1,8,6),flowerWhite=material(0xe7dfc6),flowerGold=material(0xcda568);
 for(let i=0;i<20;i++){const a=i*Math.PI*2/20+.06,r=2.12,x=Math.sin(a)*r,z=Math.cos(a)*r;const tuft=part(root,new THREE.ConeGeometry(.11,.28,5),leaf,x,.17,z);tuft.name='recurrence-inner-plant';if(i%2===0){for(let p=0;p<5;p++){const q=p*Math.PI*2/5,petal=part(root,petalGeometry,flowerWhite,x+Math.sin(q)*.06,.32,z+Math.cos(q)*.06);petal.scale.set(.035,.014,.065);petal.rotation.y=q;petal.name='recurrence-inner-plant'}const center=part(root,petalGeometry,flowerGold,x,.335,z);center.scale.set(.035,.02,.035);center.name='recurrence-inner-plant'}}
 const rockGeometry=new THREE.DodecahedronGeometry(1,0);for(let i=0;i<14;i++){const a=i*Math.PI*2/14+.08,r=4.25+(i%2)*.15,x=Math.sin(a)*r,z=Math.cos(a)*r;if((z>3.8&&Math.abs(x)<.85)||(x< -3.8&&Math.abs(z)<.9)||Math.hypot(x-3.08,z-3.08)<1)continue;const rock=part(root,rockGeometry,stone,x,.12,z);rock.scale.set(.2+(i%3)*.05,.14,.18);rock.rotation.y=i*.7;rock.name='recurrence-border-rock'}
 const entrance=box(root,.8,.0725,1,stone,0,.08625,-4.15);entrance.name='recurrence-entrance-path';for(const z of [-4.48,-4.18,-3.88]){const joint=box(root,.76,.006,.02,seam,0,.1255,z);joint.castShadow=false}
 const arch=new THREE.Group();arch.name='recurrence-entrance-arch';arch.position.set(0,.055,-4.15);root.add(arch);for(const x of [-.58,.58]){box(arch,.2,1.45,.25,stone,x,.72,0);box(arch,.3,.12,.34,stone,x,1.45,0)}part(arch,new THREE.TorusGeometry(.58,.12,8,24,Math.PI),stone,0,1.45,0);
 for(const x of [-.58,.58])for(const y of [.16,.54,.92,1.3])box(arch,.215,.025,.26,seam,x,y,0);
 // The entrance is a separate moment on the outer verge. Stone joints and
 // climbing foliage follow its crown without crossing the moving route.
 for(let i=1;i<8;i++){const a=i*Math.PI/8,from=new THREE.Vector3(.48*Math.cos(a),1.45+.48*Math.sin(a),.125),to=new THREE.Vector3(.69*Math.cos(a),1.45+.69*Math.sin(a),.125),delta=to.clone().sub(from),joint=part(arch,new THREE.CylinderGeometry(.008,.008,delta.length(),5),seam);joint.position.copy(from).add(to).multiplyScalar(.5);joint.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());joint.name='recurrence-entrance-joint'}
 {const vineCurve=new THREE.CatmullRomCurve3([[-.65,.1,.16],[-.69,.68,.16],[-.6,1.35,.16],[-.48,1.7,.16],[-.18,2,.16],[.14,2.01,.16]].map(p=>new THREE.Vector3(...p))),vine=part(arch,new THREE.TubeGeometry(vineCurve,32,.018,6,false),0x657750);vine.name='recurrence-entrance-vine';for(let i=0;i<14;i++){const t=.08+i*.06,p=vineCurve.getPoint(t),tangent=vineCurve.getTangent(t),side=i%2?1:-1,leaflet=ball(arch,.09,i%3?0x788c61:0x94a06e,p.x-side*tangent.y*.065,p.y+side*tangent.x*.065,p.z+.01);leaflet.scale.set(.65,1.2,.3);leaflet.rotation.z=Math.atan2(tangent.y,tangent.x)+side*.65;leaflet.name='recurrence-entrance-leaf'}}
 // Low grasses and a cairn occupy the outer border; the circular route stays clear.
 for(let i=0;i<18;i++){const a=i*Math.PI*2/18+.13,r=4.32,x=Math.sin(a)*r,z=Math.cos(a)*r;if((z>3.8&&Math.abs(x)<.85)||(x< -3.8&&Math.abs(z)<.9)||Math.hypot(x-3.08,z-3.08)<.8)continue;for(const offset of [-1,0,1]){const blade=part(root,new THREE.ConeGeometry(.055,.34+((i+offset+3)%3)*.06,5),leaf,x+offset*.075,.2,z);blade.rotation.z=offset*.25;blade.name='recurrence-border-plant'}}
 for(let i=0;i<3;i++){const cairn=part(root,new THREE.DodecahedronGeometry(1,1),stone,3.8,.19+i*.21,-2.05);cairn.scale.set(.33-i*.065,.16,.26-i*.045);cairn.name='recurrence-cairn'}
 // A second moment of the same traveler: kneeling beside the cairn with
 // hands extended toward its upper stone, outside the circular walking route.
 const stacking=new THREE.Group();stacking.name='recurrence-stacking-moment';stacking.position.set(3.4,.05,-2.7);stacking.rotation.y=Math.atan2(.4,.65);root.add(stacking);
 const stackingCloak=material(0xa75d4c),stackingClothes=material(0xd2c2a4),stackingSkin=material(0xc9a17f);
 for(const side of [-1,1]){const thigh=box(stacking,.16,.14,.38,stackingClothes,side*.12,.15,.14);thigh.rotation.x=-.15;const foot=box(stacking,.14,.07,.22,wood,side*.12,.035,-.16);foot.name='recurrence-stacking-foot'}
 const torso=part(stacking,new THREE.CylinderGeometry(.13,.2,.48,10),stackingCloak,0,.47,.06);torso.rotation.x=.24;torso.name='recurrence-stacking-torso';
 const head=ball(stacking,.14,stackingSkin,0,.81,.12),hair=ball(stacking,.14,0x50443a,0,.88,.09);hair.scale.set(.96,.55,.9);head.name='recurrence-stacking-head';
 for(const side of [-1,1]){const start=new THREE.Vector3(side*.14,.64,.12),end=new THREE.Vector3(side*.11,.69,.62),delta=end.clone().sub(start),arm=part(stacking,new THREE.CylinderGeometry(.045,.055,delta.length(),8),stackingClothes);arm.position.copy(start).add(end).multiplyScalar(.5);arm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());arm.name='recurrence-stacking-arm';const hand=ball(stacking,.046,stackingSkin,...end.toArray());hand.name='recurrence-stacking-hand'}
 // A separate autumn tree marks another moment beyond the walking ring.
 const autumn=new THREE.Group();autumn.name='recurrence-autumn-tree';autumn.position.set(-3.9,.05,-1.7);root.add(autumn);
 part(autumn,new THREE.CylinderGeometry(.11,.2,1.35,10),wood,0,.675,0);
 const autumnTips=[[-.55,1.65,0],[.55,1.72,.08],[0,1.95,-.28],[-.25,2.05,.27],[.3,2.1,.2]];
 for(const [x,y,z] of autumnTips){const start=new THREE.Vector3(0,.9,0),end=new THREE.Vector3(x,y,z),d=end.clone().sub(start),b=part(autumn,new THREE.CylinderGeometry(.035,.065,d.length(),8),wood);b.position.copy(start).add(end).multiplyScalar(.5);b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize())}
 const autumnGeometry=new THREE.SphereGeometry(1,8,6),autumnColors=[material(0xc98645),material(0xdca653),material(0xa96b3d)],dummy=new THREE.Object3D();
 for(let color=0;color<3;color++){const leaves=new THREE.InstancedMesh(autumnGeometry,autumnColors[color],45);leaves.name='recurrence-autumn-leaves';for(let i=0;i<45;i++){const index=color*45+i,tip=autumnTips[index%autumnTips.length],a=index*2.399963,r=.08+.28*((index*17)%43)/42;dummy.position.set(tip[0]+Math.cos(a)*r,tip[1]+.1*Math.sin(index*1.3),tip[2]+Math.sin(a)*r);dummy.rotation.set(.2*Math.sin(index),a,.4*Math.cos(index));dummy.scale.set(.14,.065,.075);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)}leaves.computeBoundingSphere();autumn.add(leaves)}
 // An outdoor reading alcove sits beyond the path, indicating another moment in the cycle.
 const library=new THREE.Group();library.name='recurrence-library';library.position.set(-4.28,.05,0);library.rotation.y=Math.PI/2;root.add(library);
 box(library,.92,.12,.42,stone,0,.06,0);for(const x of [-.4,.4]){box(library,.14,1.3,.34,stone,x,.77,0);box(library,.21,.1,.4,stone,x,1.42,0)}
 const libraryArch=part(library,new THREE.TorusGeometry(.4,.075,7,28,Math.PI),stone,0,1.42,0);libraryArch.name='recurrence-library-arch';box(library,.65,1.2,.08,0x775740,0,.75,-.13);
 for(const y of [.2,.61,1.02,1.35])box(library,.66,.055,.27,wood,0,y,0);
 for(let row=0;row<3;row++)for(let i=0;i<5;i++){const height=.25+(i%3)*.025,book=box(library,.09,height,.17,[0x927254,0x6e8476,0xa66c50][(i+row)%3],-.24+i*.12,.23+row*.41+height/2,.015);book.name='recurrence-library-book';box(library,.088,.012,.008,0xc5a573,-.24+i*.12,.29+row*.41,.104)}
 // A quiet reading moment sits beyond the ring, separate from the moving traveler.
 const reader=new THREE.Group();reader.name='recurrence-reading-moment';reader.position.set(0,.05,4.25);reader.rotation.y=Math.PI;root.add(reader);
 box(reader,.64,.29,.48,stone,0,.145,0);box(reader,.7,.08,.53,stone,0,.33,0);
 const readerBody=part(reader,new THREE.CylinderGeometry(.13,.19,.46,10),0xa75d4c,0,.63,0);readerBody.name='recurrence-reader-body';
 const readerHead=ball(reader,.14,0xc9a17f,0,1.01,.04);readerHead.scale.set(.9,1,.9);const readerHair=ball(reader,.14,0x50443a,0,1.08,.015);readerHair.scale.set(.95,.55,.9);
 for(const side of [-1,1]){box(reader,.13,.13,.3,0xd2c2a4,side*.12,.42,.15);box(reader,.11,.31,.11,0xd2c2a4,side*.12,.22,.27);box(reader,.14,.07,.19,wood,side*.12,.035,.31);
  const from=new THREE.Vector3(side*.15,.78,.02),to=new THREE.Vector3(side*.14,.62,.24),delta=to.clone().sub(from),arm=part(reader,new THREE.CylinderGeometry(.045,.055,delta.length(),8),0xd2c2a4);arm.position.copy(from).add(to).multiplyScalar(.5);arm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());ball(reader,.046,0xc9a17f,...to.toArray())}
 for(const side of [-1,1]){const page=box(reader,.19,.025,.25,0xe4d8bd,side*.095,.63,.24);page.rotation.z=side*.08;for(let row=0;row<3;row++)box(reader,.12,.006,.008,0x758578,side*.095,.648,.16+row*.065)}
 // Another quiet moment on the outer verge suggests the same life recurring
 // without placing a static figure on the interactive walking route.
 const resting=new THREE.Group();resting.name='recurrence-resting-moment';resting.position.set(3.08,.05,3.08);resting.rotation.y=Math.PI*1.25;root.add(resting);
 const seat=part(resting,new THREE.DodecahedronGeometry(1,1),stone,0,.19,0);seat.scale.set(.38,.19,.31);seat.name='recurrence-resting-rock';
 const restSkin=material(0xc9a17f),restCloth=material(0xd2c2a4),restCloak=material(0xa75d4c),restHair=material(0x50443a);
 const restBody=part(resting,new THREE.CylinderGeometry(.13,.19,.48,12),restCloak,0,.53,0);restBody.rotation.x=.12;restBody.name='recurrence-resting-body';
 ball(resting,.14,restSkin,0,.92,.04);const restCap=ball(resting,.14,restHair,0,.99,.01);restCap.scale.set(.95,.55,.9);
 function restLimb(start,end,r,mat,name){const a=new THREE.Vector3(...start),b=new THREE.Vector3(...end),d=b.clone().sub(a),limb=part(resting,new THREE.CylinderGeometry(r*.9,r,d.length(),9),mat);limb.position.copy(a).add(b).multiplyScalar(.5);limb.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());limb.name=name;return limb}
 for(const side of [-1,1]){restLimb([side*.1,.3,.02],[side*.24,.2,.25],.075,restCloth,'recurrence-resting-thigh');restLimb([side*.24,.2,.25],[side*.12,.07,.43],.06,restCloth,'recurrence-resting-shin');const shoe=box(resting,.15,.09,.2,wood,side*.12,.045,.43);shoe.name='recurrence-resting-shoe';restLimb([side*.15,.72,.02],[side*.23,.42,.18],.055,restCloth,'recurrence-resting-arm');const hand=ball(resting,.05,restSkin,side*.23,.42,.18);hand.name='recurrence-resting-hand'}
 const traveler=figure(root,0,0,colors.red);traveler.name='recurrence-traveler';traveler.scale.setScalar(.75);
 // A folded cloak and carried satchel distinguish the recurring traveler from a marker.
 const cloakPositions=[],cloakIndices=[],rows=10,columns=12;for(let row=0;row<=rows;row++){const t=row/rows;for(let col=0;col<=columns;col++){const u=col/columns*2-1;cloakPositions.push(u*(.19+.13*t),1.07-.73*t-.035*t*(u+1),-.17-.1*t-.025*Math.cos(u*Math.PI*3)*t);if(row<rows&&col<columns){const n=row*(columns+1)+col;cloakIndices.push(n,n+columns+1,n+1,n+1,n+columns+1,n+columns+2)}}}
 const cloakGeometry=new THREE.BufferGeometry();cloakGeometry.setAttribute('position',new THREE.Float32BufferAttribute(cloakPositions,3));cloakGeometry.setIndex(cloakIndices);cloakGeometry.computeVertexNormals();const cloakMaterial=material(0xa75d4c);cloakMaterial.side=THREE.DoubleSide;const cloak=part(traveler,cloakGeometry,cloakMaterial);cloak.name='recurrence-cloak';
 const pack=box(traveler,.25,.28,.13,0x795844,-.14,.8,-.19);pack.rotation.z=.12;const strap=box(traveler,.045,.62,.025,0x795844,0,.82,.19);strap.rotation.z=.45;ball(traveler,.035,colors.gold,.16,1.02,.12);
 const legs=[traveler.children[3],traveler.children[6]],steps=[];for(let i=0;i<2;i++){const side=i?1:-1,step=new THREE.Group();step.name='recurrence-step';traveler.add(step);step.add(legs[i]);const shoe=box(step,.14,.07,.22,0x59483b,side*.11,.025,.04);shoe.name='recurrence-shoe';steps.push(step);ball(traveler,.016,0x3f3933,side*.06,1.30,.183);const lock=ball(traveler,.055,0x50443a,side*.15,1.35,0);lock.scale.set(.7,1,.8)}
 return done(scene,root,(_t,value)=>{const angle=value*Math.PI*2;traveler.position.set(Math.sin(angle)*3.225,.13,Math.cos(angle)*3.225);traveler.rotation.y=Math.atan2(Math.cos(angle),-Math.sin(angle));const stride=Math.sin(value*Math.PI*16);steps.forEach((step,i)=>{const phase=(i?1:-1)*stride;step.position.z=phase*.13;step.position.y=Math.max(0,phase)*.1})});
}
export function buildButterfly(scene){
 const root=stage(scene),grass=material(0x78836a),stone=material(0xb8ac95),wood=material(0x755441),skin=material(0xc9a17f),robe=material(0x718b82),cream=material(0xe4d8c1),gold=material(0xc99a64);
 root.rotation.y=Math.PI/4;
 cylinder(root,4.95,.06,grass,0,.02,0);
 const restingPartsStart=root.children.length;
 // A reclined figure and pillow are composed in world coordinates to keep contact with the mat.
 const mat=box(root,2.8,.12,1.15,0xc4ad8b,-1.95,.12,.3);mat.name='butterfly-mat';
 for(let x=-3.25;x<-.6;x+=.09)box(root,.012,.006,1.04,0xb39a78,x,.183,.3);
 for(const z of [-.23,.83])box(root,2.75,.012,.035,0x8a735c,-1.95,.189,z);
 const bolster=part(root,new THREE.CylinderGeometry(.21,.21,.62,20),0xa86b53,-3.13,.39,.3);bolster.rotation.x=Math.PI/2;bolster.name='butterfly-bolster';for(const z of [-.02,.62]){const end=part(root,new THREE.TorusGeometry(.19,.012,6,24),gold,-3.13,.39,z);end.name='butterfly-bolster-trim'}
 box(root,.55,.2,.48,cream,-2.95,.28,.3);const sleeper=new THREE.Group();sleeper.name='butterfly-sleeper';root.add(sleeper);
 const head=ball(sleeper,.19,skin,-2.95,.49,.3);head.scale.set(1,.85,1);const hair=ball(sleeper,.18,0x50443a,-3.03,.53,.3);hair.scale.set(.8,.7,1);
 // Rounded volumes soften the reclining silhouette beneath the folded bedding.
 const body=ball(sleeper,1,robe,-2.25,.39,.3);body.scale.set(.55,.2,.27);body.rotation.z=-.08;
 const lower=ball(sleeper,1,cream,-1.33,.31,.3);lower.scale.set(.49,.12,.25);lower.rotation.z=.04;
 function recliningLimb(a,b,r,color,name){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),segment=part(sleeper,new THREE.CylinderGeometry(r*.85,r,delta.length(),10),color);segment.position.copy(start).add(end).multiplyScalar(.5);segment.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());segment.name=name;return segment}
 for(const side of [-1,1]){const z=.3+side*.2,shoulder=[-2.56,.52,z],elbow=[-2.36,.48,z+side*.06],hand=[-2.1,.5,z+side*.02];recliningLimb(shoulder,elbow,.075,cream,'butterfly-sleeve');recliningLimb(elbow,hand,.045,skin,'butterfly-forearm');const palm=ball(sleeper,.055,skin,...hand);palm.scale.set(1,.55,.8);palm.name='butterfly-hand'}
 const robeVertices=[],robeFaces=[],robeRows=12,robeCols=10;for(let row=0;row<=robeRows;row++){const t=row/robeRows,x=-2.7+.72*t;for(let col=0;col<=robeCols;col++){const u=col/robeCols*2-1,z=.3+u*(.23+.04*t),y=.57-.045*t-.055*Math.pow(Math.abs(u),3)+.012*Math.sin(t*10+u*5);robeVertices.push(x,y,z);if(row<robeRows&&col<robeCols){const n=row*(robeCols+1)+col;robeFaces.push(n,n+1,n+robeCols+1,n+1,n+robeCols+2,n+robeCols+1)}}}
 const robeGeometry=new THREE.BufferGeometry();robeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(robeVertices,3));robeGeometry.setIndex(robeFaces);robeGeometry.computeVertexNormals();const robeMaterial=material(0x839a8c);robeMaterial.side=THREE.DoubleSide;const robeFold=part(sleeper,robeGeometry,robeMaterial);robeFold.name='butterfly-shoulder-drape';
 // A folded cover follows the torso and legs and hangs toward the mat at its edges.
 function coverPoint(q,v){const width=.31+.065*Math.sin(Math.PI*q),x=-2.13+q*1.35,z=.3+(v*2-1)*width,edge=Math.pow(Math.abs(v*2-1),3),knee=.14*Math.exp(-Math.pow((q-.56)/.19,2)),fold=.022*Math.sin(q*19+v*5)+.012*Math.sin(q*31-v*8);return new THREE.Vector3(x,.53-.11*q+knee-.16*edge+fold,z)}
 const coverVertices=[],coverIndices=[],coverRows=32,coverCols=16;for(let i=0;i<=coverRows;i++){const q=i/coverRows;for(let j=0;j<=coverCols;j++){const v=j/coverCols,p=coverPoint(q,v);coverVertices.push(p.x,p.y,p.z);if(i<coverRows&&j<coverCols){const n=i*(coverCols+1)+j;coverIndices.push(n,n+1,n+coverCols+1,n+1,n+coverCols+2,n+coverCols+1)}}}
 const coverGeometry=new THREE.BufferGeometry();coverGeometry.setAttribute('position',new THREE.Float32BufferAttribute(coverVertices,3));coverGeometry.setIndex(coverIndices);coverGeometry.computeVertexNormals();const coverMaterial=material(0x829c91);coverMaterial.side=THREE.DoubleSide;const cover=part(sleeper,coverGeometry,coverMaterial);cover.name='butterfly-cover';
 // Woven edging follows the shaped cover rather than floating above a flat plane.
 for(const v of [.12,.88]){const points=[];for(let i=0;i<=48;i++){const p=coverPoint(i/48,v);p.y+=.008;points.push(p)}const border=part(sleeper,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),64,.008,5,false),gold);border.name='butterfly-cover-border'}
 // Fine botanical embroidery follows the shaped cloth over the knee and folds.
 for(const [centerQ,centerV,scale] of [[.29,.42,.8],[.67,.57,1]]){const stem=[];for(let i=0;i<=24;i++){const t=i/24,q=centerQ+(t-.5)*.24*scale,v=centerV+.06*Math.sin(t*Math.PI)*scale,p=coverPoint(q,v);p.y+=.012;stem.push(p)}const vine=part(sleeper,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stem),32,.0045,5,false),gold);vine.name='butterfly-cover-embroidery';for(const side of [-1,1])for(const t of [.28,.55,.78]){const q=centerQ+(t-.5)*.24*scale,v=centerV+.06*Math.sin(t*Math.PI)*scale,points=[];for(let i=0;i<=12;i++){const u=i/12,p=coverPoint(q+.035*scale*Math.sin(Math.PI*u),v+side*.075*scale*u);p.y+=.013;points.push(p)}const leaf=part(sleeper,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),16,.0035,5,false),gold);leaf.name='butterfly-cover-embroidery'}}
 const knot=ball(sleeper,.105,0x50443a,-3.13,.57,.3);knot.scale.set(.8,.75,1);for(const z of [.22,.38]){const eye=box(sleeper,.06,.012,.012,0x50443a,-2.91,.635,z);eye.rotation.y=.12}
 // Enlarge the whole resting arrangement around its floor contact to give the figure visual weight.
 const restingGroup=new THREE.Group();restingGroup.name='butterfly-resting-arrangement';for(const child of root.children.slice(restingPartsStart))restingGroup.add(child);root.add(restingGroup);const restingScale=1.45;restingGroup.scale.setScalar(restingScale);restingGroup.position.set(-1.95*(1-restingScale),.05*(1-restingScale),.3*(1-restingScale));
 // A circular frame and a small pond suggest a dreamscape, not a literal setting.
 const backdrop=part(root,new THREE.TorusGeometry(1.55,.09,10,64),wood,-.15,1.85,-1.55);
 const skyGeometry=new THREE.CircleGeometry(1.44,64),skyPositions=skyGeometry.getAttribute('position'),skyColors=[];for(let i=0;i<skyPositions.count;i++){const t=THREE.MathUtils.clamp((skyPositions.getY(i)/1.44+1)/2,0,1),color=new THREE.Color(0xe4d8bd).lerp(new THREE.Color(0xb2c7bf),t);skyColors.push(color.r,color.g,color.b)}skyGeometry.setAttribute('color',new THREE.Float32BufferAttribute(skyColors,3));const sky=part(root,skyGeometry,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide}),-.15,1.85,-1.82);sky.name='butterfly-dream-sky';sky.castShadow=false;
 // Layered silhouettes sit inside the circular frame, behind the sleeping figure.
 const mountainShape=new THREE.Shape();mountainShape.moveTo(-1.12,-.72);mountainShape.lineTo(-.65,.18);mountainShape.lineTo(-.38,-.16);mountainShape.lineTo(.12,.82);mountainShape.lineTo(.65,-.08);mountainShape.lineTo(.86,.19);mountainShape.lineTo(1.14,-.72);mountainShape.closePath();
 const mountain=part(root,new THREE.ShapeGeometry(mountainShape),material(0x82958b),-.15,1.85,-1.7);mountain.name='butterfly-mountain';mountain.material.side=THREE.DoubleSide;
 for(const [color,z,variant] of [[0x99a99a,-1.68,0],[0x708a7c,-1.65,1]]){const hills=new THREE.Shape();hills.moveTo(-1.1,-.92);hills.lineTo(-1.18,-.65);if(variant===0){hills.quadraticCurveTo(-.95,.05,-.62,-.18);hills.quadraticCurveTo(-.32,-.48,-.06,.12);hills.quadraticCurveTo(.24,.4,.52,-.14);hills.quadraticCurveTo(.84,-.4,1.18,-.65)}else{hills.quadraticCurveTo(-.82,-.3,-.48,-.53);hills.quadraticCurveTo(-.12,-.72,.22,-.34);hills.quadraticCurveTo(.6,-.1,1.18,-.65)}hills.lineTo(1.1,-.92);hills.closePath();const layer=part(root,new THREE.ShapeGeometry(hills,16),material(color),-.15,1.85,z);layer.name='butterfly-dream-hill';layer.material.side=THREE.DoubleSide;layer.castShadow=false}
 for(const [x,y,s] of [[-.85,2.1,.32],[.68,2.34,.27]]){for(let i=0;i<3;i++){const cloud=ball(root,s,cream,x+i*s*.8,y+(i===1?.06:0),-1.66);cloud.scale.set(1,.18,.12)}}
 // Fine translucent arcs connect the sleeper to the dream without a literal speech bubble.
 const dreamMaterial=new THREE.MeshStandardMaterial({color:0xe6d8b8,transparent:true,opacity:.48,roughness:1,depthWrite:false});
 for(let i=0;i<3;i++){const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(-2.7,.73+i*.07,-.12),new THREE.Vector3(-2,1.25+i*.1,-.4),new THREE.Vector3(-.8,.8+i*.12,-.35),new THREE.Vector3(.15,1.14+i*.09,-.3));const ribbon=part(root,new THREE.TubeGeometry(curve,48,.018-i*.004,6,false),dreamMaterial);ribbon.name='butterfly-dream-trail';ribbon.castShadow=false;}
 // An irregular, shallow shoreline surrounds a subtly varied water surface.
 {const segments=64,waterVertices=[0,.07,0],waterColors=[],waterIndices=[],shoreVertices=[],shoreIndices=[],centerColor=new THREE.Color(0x789f99),edgeColor=new THREE.Color(0xa4bdb0);waterColors.push(centerColor.r,centerColor.g,centerColor.b);
  for(let i=0;i<=segments;i++){const a=i*Math.PI*2/segments,r=1+.045*Math.sin(3*a+.4)+.035*Math.sin(7*a),x=Math.cos(a)*r,z=Math.sin(a)*r*.9;waterVertices.push(x,.07,z);waterColors.push(edgeColor.r,edgeColor.g,edgeColor.b);shoreVertices.push(x*.98,.058,z*.98,x*1.14,.045,z*1.14);if(i<segments){waterIndices.push(0,i+2,i+1);const n=i*2;shoreIndices.push(n,n+2,n+1,n+1,n+2,n+3)}}
  const waterGeometry=new THREE.BufferGeometry();waterGeometry.setAttribute('position',new THREE.Float32BufferAttribute(waterVertices,3));waterGeometry.setAttribute('color',new THREE.Float32BufferAttribute(waterColors,3));waterGeometry.setIndex(waterIndices);waterGeometry.computeVertexNormals();const pond=part(root,waterGeometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.68,side:THREE.DoubleSide}),2.15,0,1.15);pond.name='butterfly-pond';pond.receiveShadow=false;
  const shoreGeometry=new THREE.BufferGeometry();shoreGeometry.setAttribute('position',new THREE.Float32BufferAttribute(shoreVertices,3));shoreGeometry.setIndex(shoreIndices);shoreGeometry.computeVertexNormals();const shore=part(root,shoreGeometry,0x8d9a7c,2.15,0,1.15);shore.material.side=THREE.DoubleSide;shore.name='butterfly-pond-shore';shore.castShadow=false}
 for(const [x,z,r] of [[2.15,1.15,.54],[2.47,1.4,.22],[1.83,.94,.2]]){const ripple=part(root,new THREE.TorusGeometry(r,.009,6,40),0xb7c8b7,x,.079,z);ripple.rotation.x=Math.PI/2;ripple.castShadow=false}
 const rocks=new THREE.DodecahedronGeometry(1,0);for(let i=0;i<8;i++){const a=i*Math.PI/4,r=1.05,rock=part(root,rocks,stone,2.15+Math.sin(a)*r,.13,1.15+Math.cos(a)*r);rock.scale.set(.22,.14,.18);rock.rotation.y=i*.6}
 // A short cascade feeds the pond between two faceted rocks.
 for(const x of [2.35,3.05]){const bank=part(root,rocks,stone,x,.26,.12);bank.scale.set(.36,.38,.29);bank.rotation.z=x<2.7?.2:-.2;bank.name='butterfly-cascade-rock'}
 const cascadeGeometry=new THREE.BufferGeometry(),cascadeVertices=[];for(const [y,z] of [[.6,.12],[.43,.22],[.26,.36],[.075,.55]])cascadeVertices.push(2.57,y,z,2.83,y,z);cascadeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(cascadeVertices,3));cascadeGeometry.setIndex([0,2,1,1,2,3,2,4,3,3,4,5,4,6,5,5,6,7]);cascadeGeometry.computeVertexNormals();
 const cascadeMaterial=material(0xabc9bf);cascadeMaterial.side=THREE.DoubleSide;const cascade=part(root,cascadeGeometry,cascadeMaterial);cascade.name='butterfly-cascade';cascade.castShadow=false;
 // Narrow broken highlights follow the sloping water and gather into foam
 // at its foot; these remain fixed visual detail independent of the dream state.
 {const profile=[[.6,.12],[.43,.22],[.26,.36],[.075,.55]],vertices=[];
  function at(t){const v=Math.min(2.999,t*3),i=Math.floor(v),f=v-i;return [THREE.MathUtils.lerp(profile[i][0],profile[i+1][0],f),THREE.MathUtils.lerp(profile[i][1],profile[i+1][1],f)]}
  for(let lane=0;lane<7;lane++)for(let segment=0;segment<4;segment++){const t0=.03+segment*.23+(lane%3)*.025,t1=Math.min(.99,t0+.14),a=at(t0),b=at(t1),x=2.59+lane*.037;vertices.push(x,a[0]+.009,a[1]+.006,x+.012*Math.sin(lane+segment),b[0]+.009,b[1]+.006)}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const highlights=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xe4eee0,transparent:true,opacity:.82}));highlights.name='butterfly-cascade-highlights';root.add(highlights);
  const foamGeometry=new THREE.CircleGeometry(1,12),foamMaterial=new THREE.MeshBasicMaterial({color:0xd9e7d9,transparent:true,opacity:.65,side:THREE.DoubleSide,depthWrite:false});for(let i=0;i<7;i++){const foam=new THREE.Mesh(foamGeometry,foamMaterial);foam.name='butterfly-cascade-foam';foam.rotation.x=-Math.PI/2;foam.position.set(2.57+i*.043,.081,.58+.018*Math.sin(i*2));foam.scale.set(.025+(i%3)*.006,.045,1);root.add(foam)}
 }
 for(const [x,z] of [[1.85,.95],[2.48,1.45]]){const pad=part(root,new THREE.CircleGeometry(.17,18),material(0x657e68),x,.08,z);pad.rotation.x=-Math.PI/2;for(let i=0;i<5;i++){const a=i*Math.PI*2/5,petal=ball(root,.085,cream,x+Math.sin(a)*.09,.105,z+Math.cos(a)*.09);petal.scale.set(.65,.22,1)}ball(root,.045,gold,x,.125,z)}
 const insect=new THREE.Group();insect.name='butterfly-insect';insect.scale.setScalar(.8);insect.rotation.y=.35;root.add(insect);
 // Irregular translucent cloud contours surround the moving insect and make
 // the dream field legible without turning it into an opaque sphere.
 const dreamHalo=new THREE.Group();dreamHalo.name='butterfly-dream-halo';dreamHalo.position.set(1.35,1.9,-.62);root.add(dreamHalo);
 // A faint translucent field with a feathered boundary follows the insect.
 // The centre stays transparent enough for the landscape to remain visible.
 {const positions=[0,0,-.04],colors=[.96,.87,.72,.24],indices=[],segments=72,rings=5;for(let row=1;row<=rings;row++){const r=row/rings,alpha=.24*(1-THREE.MathUtils.smoothstep(r,.45,1));for(let i=0;i<segments;i++){const a=i*Math.PI*2/segments,wave=1+.035*Math.sin(5*a)+.025*Math.sin(9*a+.7);positions.push(Math.cos(a)*1.25*r*wave,Math.sin(a)*.91*r*wave,-.04);colors.push(.96,.87,.72,alpha)}}for(let i=0;i<segments;i++)indices.push(0,1+i,1+(i+1)%segments);for(let row=1;row<rings;row++)for(let i=0;i<segments;i++){const a=1+(row-1)*segments+i,b=1+(row-1)*segments+(i+1)%segments,c=a+segments,d=b+segments;indices.push(a,c,b,b,c,d)}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,4));geometry.setIndex(indices);const field=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,side:THREE.DoubleSide}));field.name='butterfly-dream-field';field.castShadow=false;dreamHalo.add(field)}
 const haloMaterial=new THREE.MeshBasicMaterial({color:0xe7cba5,transparent:true,opacity:.52,depthWrite:false});
 for(let band=0;band<3;band++){const points=[];for(let i=0;i<=42;i++){const a=(.08+band*.065+i/42*(.78-band*.09))*Math.PI*2,r=1+.07*Math.sin(5*a+band);points.push(new THREE.Vector3(Math.cos(a)*1.15*r,Math.sin(a)*.78*r,.025*band))}const stroke=part(dreamHalo,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),64,.012-band*.002,6,false),haloMaterial);stroke.name='butterfly-dream-cloud-contour';stroke.castShadow=false}
 const dreamPetalMaterial=new THREE.MeshBasicMaterial({color:0xead4b4,transparent:true,opacity:.68,side:THREE.DoubleSide,depthWrite:false}),petalShape=new THREE.Shape();petalShape.moveTo(0,0);petalShape.quadraticCurveTo(-.08,.08,0,.2);petalShape.quadraticCurveTo(.08,.08,0,0);const dreamPetalGeometry=new THREE.ShapeGeometry(petalShape,8);
 for(const [x,y,angle,scale] of [[-.77,.48,-.8,.55],[.76,.4,.6,.5],[.95,-.25,-.5,.4],[-.65,-.5,.9,.45]]){const petal=part(dreamHalo,dreamPetalGeometry,dreamPetalMaterial,x,y,.07);petal.rotation.z=angle;petal.scale.setScalar(scale);petal.castShadow=false;petal.name='butterfly-dream-petal'}
 // A soft, tapering fabric-like trail bridges the sleeper and the moving
 // butterfly. Its final point follows the same height as the insect.
 const dreamVeils=[];
 for(let layer=0;layer<2;layer++){
  const steps=48,positions=new Float32Array((steps+1)*6),indices=[];for(let i=0;i<steps;i++){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(indices);
  const veil=part(root,geometry,new THREE.MeshStandardMaterial({color:layer?0xe8cfad:0xf4e5c8,transparent:true,opacity:layer?.24:.38,roughness:1,side:THREE.DoubleSide,depthWrite:false}));veil.name='butterfly-dream-veil';veil.castShadow=false;veil.receiveShadow=false;dreamVeils.push({geometry,layer,steps});
 }
 function shapeDreamVeils(height,time){for(const {geometry,layer,steps} of dreamVeils){const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(-2.75,.79,-.17),new THREE.Vector3(-1.95,1.85+layer*.12,-.35),new THREE.Vector3(-.12,1.55+layer*.24,-.38),new THREE.Vector3(1.22,height-.1,-.28));const p=geometry.attributes.position;for(let i=0;i<=steps;i++){const t=i/steps,center=curve.getPoint(t),width=(.06+.8*Math.sin(Math.PI*t))*(layer?.65:1),wave=.035*Math.sin(t*10+time*.7+layer);p.setXYZ(i*2,center.x,center.y-width/2+wave,center.z+layer*.025);p.setXYZ(i*2+1,center.x,center.y+width/2+wave,center.z+layer*.025)}p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere()}}
 const bodyInsect=ball(insect,.19,colors.dark);bodyInsect.scale.set(.65,1.9,.65);ball(insect,.13,colors.dark,0,.43,0);
 for(const side of [-1,1]){const antenna=box(insect,.025,.4,.025,colors.dark,side*.12,.68,0);antenna.rotation.z=-side*.35}
 const wings=[];for(const side of [-1,1]){const pivot=new THREE.Group();pivot.name='butterfly-wing';insect.add(pivot);const wingGroup=new THREE.Group();wingGroup.scale.x=side;pivot.add(wingGroup);
  const shape=new THREE.Shape();shape.moveTo(0,.1);shape.bezierCurveTo(.18,.72,.68,1.23,1.1,1.34);shape.bezierCurveTo(1.32,1.39,1.23,.88,1.05,.5);shape.bezierCurveTo(1.3,.3,1.22,.08,.93,.02);shape.bezierCurveTo(1.02,-.17,.88,-.4,.7,-.4);shape.bezierCurveTo(.82,-.67,.7,-.79,.59,-.46);shape.bezierCurveTo(.42,-.49,.28,-.39,.19,-.24);shape.lineTo(0,-.15);shape.closePath();
  const wing=part(wingGroup,new THREE.ShapeGeometry(shape,24),new THREE.MeshStandardMaterial({color:0x668d84,roughness:.9,side:THREE.DoubleSide}));wing.name='butterfly-wing-surface';
  const outlinePoints=shape.getPoints(60).map(p=>new THREE.Vector3(p.x,p.y,.02));const outline=part(wingGroup,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(outlinePoints),96,.018,5,false),0x405e58);outline.name='butterfly-wing-outline';
  // Warm, translucent-looking cells sit on both faces of the wing and are
  // carried by the flap pivot; their outlines remain within the wing shape.
  const upper=new THREE.Shape();upper.moveTo(.19,.1);upper.bezierCurveTo(.33,.4,.64,.97,.97,1.13);upper.bezierCurveTo(1.04,1.07,1.04,.96,.98,.86);upper.bezierCurveTo(.74,.67,.48,.3,.19,.1);upper.closePath();
  const lower=new THREE.Shape();lower.moveTo(.19,-.12);lower.bezierCurveTo(.4,-.13,.7,-.09,.95,.02);lower.bezierCurveTo(.93,-.1,.84,-.22,.73,-.26);lower.bezierCurveTo(.53,-.29,.35,-.22,.19,-.12);lower.closePath();
  const upperGeometry=new THREE.ShapeGeometry(upper,20),lowerGeometry=new THREE.ShapeGeometry(lower,20),upperColor=material(0xd6a77d),lowerColor=material(0xc98c71);upperColor.side=lowerColor.side=THREE.DoubleSide;
  for(const z of [-.018,.018]){for(const [geometry,color] of [[upperGeometry,upperColor],[lowerGeometry,lowerColor]]){const patch=part(wingGroup,geometry,color,0,0,z);patch.name='butterfly-wing-color-cell'}}
  for(const z of [-.012,.012]){const marking=ball(wingGroup,.28,0xd9b681,.64,.25,z);marking.scale.set(1.25,.65,.025);const lowerMark=ball(wingGroup,.2,0xd9b681,.58,-.17,z);lowerMark.scale.set(1.2,.55,.025)}
  // Veins and paired markings are children of each wing so they follow the flap.
  for(const end of [[.98,.42],[1.02,.05],[.73,-.29]]){const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(.08,0,.018),new THREE.Vector3(.42,end[1]*.5,.018),new THREE.Vector3(end[0],end[1],.018));part(wingGroup,new THREE.TubeGeometry(curve,12,.014,5,false),gold)}
  for(const [x,y,r] of [[.68,.42,.12],[.65,-.12,.09]]){const spot=ball(wingGroup,r,gold,x,y,.025);spot.scale.z=.12}
  for(const [x,y] of [[.7,.86],[.88,.96],[1.02,.82],[.99,.65],[.8,-.22],[.64,-.32]]){const spot=ball(wingGroup,.055,0xdcb881,x,y,.027);spot.scale.set(1.2,.65,.15);spot.name='butterfly-wing-spot'}
  wings.push(pivot);
 }
 // A small grove and blossoms frame the diorama without covering the figure.
 const grove=new THREE.Group();grove.name='butterfly-blossom-tree';root.add(grove);
 function groveBranch(a,b,r){const d=new THREE.Vector3().subVectors(b,a),branch=part(grove,new THREE.CylinderGeometry(r*.65,r,d.length(),8),wood);branch.position.copy(a).add(b).multiplyScalar(.5);branch.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());branch.name='butterfly-grove-branch'}
 const trunkPoints=[[-3.55,.05,-1.7],[-3.66,.4,-1.7],[-3.5,.78,-1.68],[-3.65,1.12,-1.7],[-3.48,1.45,-1.68],[-3.55,1.76,-1.65]].map(p=>new THREE.Vector3(...p));for(let i=0;i<trunkPoints.length-1;i++)groveBranch(trunkPoints[i],trunkPoints[i+1],.22-i*.027);
 for(const [x,y,z] of [[-4.02,1.86,-1.68],[-3.1,1.98,-1.73],[-3.55,2.28,-1.62],[-3.7,2.35,-1.45]])groveBranch(new THREE.Vector3(-3.56,1.35,-1.69),new THREE.Vector3(x,y,z),.09);
 // Two sweeping boughs extend the canopy towards the dream frame. The
 // offshoots and blooms share the same curves, so the silhouette is a tree
 // rather than a disconnected cluster above the sleeper.
 const boughs=[
  new THREE.CubicBezierCurve3(new THREE.Vector3(-3.5,1.25,-1.7),new THREE.Vector3(-3.15,1.5,-1.75),new THREE.Vector3(-2.95,2.15,-1.75),new THREE.Vector3(-2.18,2.22,-1.72)),
  new THREE.CubicBezierCurve3(new THREE.Vector3(-3.56,1.55,-1.7),new THREE.Vector3(-3.25,2.14,-1.7),new THREE.Vector3(-2.98,2.55,-1.74),new THREE.Vector3(-2.48,2.68,-1.7))
 ];
 for(const curve of boughs){const bough=part(grove,new THREE.TubeGeometry(curve,28,.065,8,false),wood);bough.name='butterfly-grove-bough';
  for(const t of [.42,.65,.86]){const start=curve.getPoint(t),end=start.clone().add(new THREE.Vector3(.08,.22,.1));groveBranch(start,end,.025);
   for(const [dx,dy,dz] of [[0,0,0],[.17,.02,-.035],[-.12,.08,.04]]){const center=end.clone().add(new THREE.Vector3(dx,dy,dz));for(let i=0;i<5;i++){const a=i*Math.PI*2/5,petal=ball(grove,.065,cream,center.x+Math.sin(a)*.06,center.y+Math.cos(a)*.06,center.z);petal.scale.z=.45;petal.name='butterfly-bough-blossom'}ball(grove,.035,gold,center.x,center.y,center.z+.025)}}
 }
 const blossomPoints=[[-3.92,1.97,-1.43],[-3.36,2.16,-1.4],[-3.7,2.39,-1.45],[-3.05,1.96,-1.48],[-4.18,1.81,-1.48],[-3.85,2.2,-1.5],[-3.55,2.01,-1.32],[-3.17,2.3,-1.51],[-3.32,1.77,-1.4],[-3.63,2.58,-1.5],[-3.99,2.16,-1.42],[-3.78,1.79,-1.36],[-3.51,2.36,-1.4],[-3.34,2.43,-1.48],[-3.09,2.13,-1.45],[-3.28,1.92,-1.34],[-3.76,2.58,-1.48],[-4.05,1.93,-1.36]];
 for(const [x,y,z] of blossomPoints){groveBranch(new THREE.Vector3(-3.55,1.55,-1.65),new THREE.Vector3(x,y,z-.04),.025);for(let i=0;i<5;i++){const a=i*Math.PI*2/5,petal=ball(grove,.075,cream,x+Math.sin(a)*.07,y+Math.cos(a)*.07,z);petal.scale.z=.45}ball(grove,.045,gold,x,y,z+.03)}
 const groveLeafGeometry=new THREE.SphereGeometry(1,8,6),groveLeafMaterial=material(0x7e8963),groveLeaves=new THREE.InstancedMesh(groveLeafGeometry,groveLeafMaterial,72),leafDummy=new THREE.Object3D(),centers=[[-3.95,1.78,-1.7],[-3.2,1.96,-1.7],[-3.55,2.24,-1.58]];groveLeaves.name='butterfly-grove-leaves';
 for(let i=0;i<72;i++){const center=centers[Math.floor(i/24)],a=i*2.399963,r=.15+.28*((i*17%23)/22);leafDummy.position.set(center[0]+Math.cos(a)*r,center[1]+Math.sin(a)*r*.6,center[2]+.18*Math.sin(i*1.37));leafDummy.rotation.set(.3*Math.sin(i),i*.7,.5*Math.cos(i));leafDummy.scale.set(.12,.075,.04);leafDummy.updateMatrix();groveLeaves.setMatrixAt(i,leafDummy.matrix)}groveLeaves.computeBoundingSphere();grove.add(groveLeaves);const groveScale=1.28;grove.scale.setScalar(groveScale);grove.position.set(-3.55*(1-groveScale),.05*(1-groveScale),-1.7*(1-groveScale));
 // A low tea table sits beside the mat, with its feet grounded on the lawn.
 const table=new THREE.Group();table.name='butterfly-tea-table';table.position.set(-2.5,.04,1.65);root.add(table);box(table,1.15,.1,.55,wood,0,.43,0);for(const x of [-.43,.43])for(const z of [-.19,.19]){const leg=box(table,.09,.39,.09,wood,x,.205,z);leg.name='butterfly-table-leg'}
 const cup=part(table,new THREE.CylinderGeometry(.13,.09,.13,16),gold,.3,.545,0);cup.name='butterfly-cup';const cupRim=part(table,new THREE.TorusGeometry(.13,.018,6,20),cream,.3,.615,0);cupRim.rotation.x=Math.PI/2;
 const pot=ball(table,.14,stone,-.22,.59,0);pot.scale.y=.8;part(table,new THREE.ConeGeometry(.09,.07,12),stone,-.22,.72,0);
 // Low garden groups fill the perimeter while leaving the mat, table and pond clear.
 const garden=new THREE.Group();garden.name='butterfly-garden';root.add(garden);const locations=[[-4.4,.5],[-3.7,2.2],[-3,2.8],[-1.45,2.65],[-.8,3.5],[.15,2.75],[1.25,3.1],[3.5,2.5],[4.05,.4],[3.6,-1.6],[2.7,-2.8],[1.2,-3.8],[-.5,-3.8],[-2,-3.6],[-3.35,-2.9]];
 const leafGeometry=new THREE.SphereGeometry(.12,10,6),leafMaterial=material(0x718663),leaves=new THREE.InstancedMesh(leafGeometry,leafMaterial,locations.length*5),gardenRocks=new THREE.InstancedMesh(rocks,stone,locations.length),dummy=new THREE.Object3D();leaves.name='butterfly-garden-leaves';gardenRocks.name='butterfly-garden-rocks';
 locations.forEach(([x,z],i)=>{dummy.position.set(x,.11,z);dummy.rotation.set(i*.13,i*.51,i*.07);dummy.scale.set(.2+(i%3)*.04,.12+(i%2)*.035,.17);dummy.updateMatrix();gardenRocks.setMatrixAt(i,dummy.matrix);
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5+i*.4;dummy.position.set(x+Math.cos(a)*.18,.16,z+Math.sin(a)*.18);dummy.rotation.set(Math.sin(a)*.55,0,-Math.cos(a)*.55);dummy.scale.set(.65,1.4,.48);dummy.updateMatrix();leaves.setMatrixAt(i*5+j,dummy.matrix)}
 });leaves.computeBoundingSphere();gardenRocks.computeBoundingSphere();garden.add(leaves,gardenRocks);
 // Layered peony-like blooms and buds give the pond a visible garden edge.
 // These fixed plants remain separate from the moving dream and butterfly.
 const petalGeometry=new THREE.SphereGeometry(1,12,8),petalMaterials=[material(0xd99b7e),material(0xe5ad91),material(0xc8846f)],flowerLeaf=material(0x6f8463),stemMaterial=material(0x657a5b);
 // Thin, cupped petals read as overlapping surfaces rather than rounded beads.
 const bloomPetals=[];for(let layer=0;layer<3;layer++){const vertices=[],indices=[],rows=10,cols=8,length=.25-layer*.045,width=.115-layer*.014;for(let i=0;i<=rows;i++){const t=i/rows,span=width*Math.pow(Math.sin(Math.PI*t),.7);for(let j=0;j<=cols;j++){const across=j/cols*2-1;vertices.push(.035+length*t,.012+layer*.025+(.07+layer*.035)*t*t+.028*across*across*Math.sin(Math.PI*t),span*across);if(i<rows&&j<cols){const n=i*(cols+1)+j;indices.push(n,n+cols+1,n+1,n+1,n+cols+1,n+cols+2)}}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();bloomPetals.push(geometry);petalMaterials[layer].side=THREE.DoubleSide}
 for(const [x,z] of [[3.45,-1],[.7,-3.2]]){
  const flower=new THREE.Group();flower.name='butterfly-garden-flower';flower.position.set(x,.05,z);flower.scale.setScalar(1.4);garden.add(flower);
  const stems=[[[0,0,0],[0,.72,0]],[[0,.12,0],[-.28,.63,.04]],[[0,.16,0],[.23,.8,-.08]]];
  for(const [a,b] of stems){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),stem=part(flower,new THREE.CylinderGeometry(.014,.025,delta.length(),8),stemMaterial);stem.position.copy(start).add(end).multiplyScalar(.5);stem.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize())}
  for(const [lx,ly,lz,angle] of [[-.16,.25,.02,-.8],[.16,.3,.01,.8],[-.16,.47,.05,-.7],[.15,.55,-.06,.7],[.05,.18,.14,1.1]]){const leaf=part(flower,petalGeometry,flowerLeaf,lx,ly,lz);leaf.scale.set(.18,.055,.075);leaf.rotation.z=angle;leaf.name='butterfly-flower-leaf'}
  for(const [bx,by,bz,scale] of [[0,.73,0,1],[-.28,.64,.04,.72]]){const bloom=new THREE.Group();bloom.name='butterfly-peony';bloom.position.set(bx,by,bz);bloom.scale.setScalar(scale);flower.add(bloom);for(let layer=0;layer<3;layer++){const count=layer===0?9:7;for(let i=0;i<count;i++){const a=(i+(layer%2)*.5)*Math.PI*2/count,petal=part(bloom,bloomPetals[layer],petalMaterials[layer]);petal.rotation.y=a;petal.name='butterfly-peony-petal'}}ball(bloom,.045,gold,0,.075,0)}
  const bud=part(flower,petalGeometry,petalMaterials[0],.23,.85,-.08);bud.scale.set(.085,.12,.085);bud.name='butterfly-flower-bud';
 }
 for(let i=0;i<10;i++){const a=i*Math.PI*2/10,x=Math.sin(a)*3.75,z=Math.cos(a)*3.75;const stem=part(root,new THREE.CylinderGeometry(.025,.025,.34,6),grass,x,.2,z);ball(root,.09,i%2?cream:gold,x,.4,z)}
 return done(scene,root,(t,value)=>{const flap=.15+value*.3+Math.sin(t*3)*.14;wings[0].rotation.y=flap;wings[1].rotation.y=-flap;insect.position.set(1.35,1.7+value*.45+Math.sin(t)*.08,-.25);dreamHalo.position.y=insect.position.y;shapeDreamVeils(insect.position.y,t)});
}
export function buildMonkey(scene){
 const root=stage(scene),wood=material(0x805c43),fur=material(0x8b684d),skin=material(0xc6a17c),dark=material(0x3d514a),paper=material(0xe9ddc4),gold=material(0xbd955e);
 root.rotation.y=-Math.PI/4;
 // A muted green study floor and warm woven rug frame the furniture, as in
 // the concept, while keeping the scattered pages legible against the ground.
 cylinder(root,4.95,.06,0x596c60,0,.02,0);const studyPartsStart=root.children.length;const carpet=cylinder(root,1,.03,0xa86956,0,.075,.3);carpet.scale.set(2.3,1,1.8);carpet.name='monkey-carpet';
 for(const [rx,rz] of [[2.16,1.66],[2.02,1.53]]){const border=part(root,new THREE.TorusGeometry(1,.009,6,64),0xe0c39a,0,.095,.3);border.rotation.x=Math.PI/2;border.scale.set(rx,rz,1);border.name='monkey-carpet-border'}
 for(let i=0;i<32;i++){const a=i*Math.PI*2/32,leaf=ball(root,.07,0xe0c39a,2.085*Math.cos(a),.096,.3+1.595*Math.sin(a));leaf.scale.set(1.4,.12,.55);leaf.rotation.y=-a+.45;leaf.name='monkey-carpet-leaf'}
 box(root,3,.16,1.55,wood,0,.85,0);
 // Turned legs and aprons give the writing table a readable furniture silhouette.
 const legProfile=[[.085,0],[.11,.04],[.075,.08],[.07,.19],[.12,.25],[.10,.33],[.075,.39],[.075,.58],[.13,.63],[.13,.71]].map(([r,y])=>new THREE.Vector2(r,y)),tableLegGeometry=new THREE.LatheGeometry(legProfile,12);
 for(const x of [-1.32,1.32])for(const z of [-.61,.61]){const leg=part(root,tableLegGeometry,wood,x,.09,z);leg.name='monkey-table-leg'}
 for(const z of [-.67,.67])box(root,2.55,.20,.08,wood,0,.68,z);for(const x of [-1.27,1.27])box(root,.08,.20,1.2,wood,x,.68,0);
 for(const z of [-.48,-.16,.16,.48]){const grain=box(root,2.86,.006,.008,0x947257,0,.933,z);grain.castShadow=false}
 // The seated figure and the key targets are separate so arms can follow the keys.
 const monkey=new THREE.Group();monkey.name='monkey-figure';monkey.position.set(0,.085,1.4);root.add(monkey);
 box(monkey,.8,.12,.7,wood,0,.47,0);box(monkey,.8,.75,.12,wood,0,.85,.31);for(const x of [-.3,.3])for(const z of [-.23,.23]){const leg=box(monkey,.1,.45,.1,wood,x,.23,z);leg.name='monkey-chair-leg'}
 const torso=ball(monkey,.46,0x667e72,0,1.02,0);torso.scale.set(.78,1,.65);const belly=ball(monkey,.3,skin,0,1.02,-.25);belly.scale.set(.72,1,.25);ball(monkey,.4,fur,0,1.61,-.02);for(const x of [-.36,.36]){ball(monkey,.16,fur,x,1.63,-.02);ball(monkey,.095,skin,x,1.63,-.15)}
 const muzzle=ball(monkey,.22,skin,0,1.51,-.34);muzzle.scale.set(1,.7,.55);for(const x of [-.14,.14]){const patch=ball(monkey,.12,skin,x,1.68,-.34);patch.scale.set(.85,.75,.5);ball(monkey,.035,colors.dark,x,1.68,-.405)}
 const nose=ball(monkey,.045,colors.dark,0,1.55,-.465);nose.scale.set(1,.6,.4);const mouth=box(monkey,.16,.018,.012,colors.dark,0,1.46,-.46);mouth.name='monkey-mouth';
 // Short overlapping locks break up the smooth scalp while leaving the face and ears visible.
 const tuftGeometry=new THREE.SphereGeometry(1,8,6),tuftMaterial=material(0x78543d),tufts=new THREE.InstancedMesh(tuftGeometry,tuftMaterial,96),tuftDummy=new THREE.Object3D();tufts.name='monkey-scalp-tufts';
 for(let i=0;i<96;i++){const y=.12+.86*(i+.5)/96,a=i*2.399963,r=Math.sqrt(1-y*y),direction=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);tuftDummy.position.set(direction.x*.39,1.61+direction.y*.39,-.02+direction.z*.39);tuftDummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);tuftDummy.scale.set(.055,.025,.10+(i%3)*.012);tuftDummy.updateMatrix();tufts.setMatrixAt(i,tuftDummy.matrix)}tufts.computeBoundingSphere();monkey.add(tufts);
 for(const side of [-1,1]){const brow=box(monkey,.12,.022,.025,fur,side*.14,1.78,-.39);brow.rotation.z=-side*.12;brow.name='monkey-brow'}
 for(const x of [-.22,.22]){const thigh=ball(monkey,.22,fur,x,.62,-.22);thigh.scale.set(.7,.6,1.3);box(monkey,.13,.47,.13,fur,x,.285,-.42);const foot=box(monkey,.17,.08,.28,skin,x,.045,-.5);foot.name='monkey-foot'}
 const tailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(.3,.55,.2),new THREE.Vector3(.8,.45,.65),new THREE.Vector3(1,.25,.95),new THREE.Vector3(.75,.14,1.2)]);part(monkey,new THREE.TubeGeometry(tailCurve,24,.065,8,false),fur);
 for(const x of [-.27,0,.27])box(monkey,.045,.52,.06,wood,x,.93,.38);
 const machine=new THREE.Group();machine.name='monkey-typewriter';root.add(machine);
 const bodyShape=new THREE.Shape();bodyShape.moveTo(-.88,-.475);bodyShape.lineTo(.88,-.475);bodyShape.lineTo(1,-.355);bodyShape.lineTo(1,.355);bodyShape.lineTo(.88,.475);bodyShape.lineTo(-.88,.475);bodyShape.lineTo(-1,.355);bodyShape.lineTo(-1,-.355);bodyShape.closePath();
 const machineBody=part(machine,new THREE.ExtrudeGeometry(bodyShape,{depth:.196,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:2}),dark,0,.942,-.05);machineBody.rotation.x=-Math.PI/2;machineBody.name='monkey-typewriter-body';
 box(machine,1.55,.34,.35,dark,0,1.24,-.35);
 const roller=cylinder(machine,.12,1.72,gold,0,1.47,-.45);roller.rotation.z=Math.PI/2;
 for(const side of [-1,1]){const knob=cylinder(machine,.15,.12,wood,side*.92,1.47,-.45);knob.rotation.z=Math.PI/2;const hub=cylinder(machine,.075,.13,gold,side*.99,1.47,-.45);hub.rotation.z=Math.PI/2}
 const leverCurve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-1,1.47,-.45),new THREE.Vector3(-1.2,1.48,-.45),new THREE.Vector3(-1.26,1.68,-.45));const lever=part(machine,new THREE.TubeGeometry(leverCurve,16,.025,6,false),gold);lever.name='monkey-carriage-lever';ball(machine,.055,wood,-1.26,1.68,-.45);
 for(const x of [-.9,.9])box(machine,.045,.17,.72,gold,x,1.17,.02);
 // The sheet leaves the platen leaning back, so its printed face is visible
 // from above and the upper edge curls gently, as in the concept illustration.
 const pageZ=y=>-.45-.9*(y-1.47)+.12*Math.max(0,(y-2.08)/.3)**2;
 {const vertices=[],indices=[],rows=24;for(let row=0;row<=rows;row++){const y=1.34+1.04*row/rows;vertices.push(-.7,y,pageZ(y),.7,y,pageZ(y));if(row<rows){const n=row*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const page=part(machine,geometry,paper);page.material.side=THREE.DoubleSide;page.name='monkey-typewriter-page'}
 // Fragmented marks suggest typed output without claiming a particular text.
 const lines=[],markMaterial=new THREE.LineBasicMaterial({color:0x3d514a});
 for(let row=0;row<5;row++){const marks=[];for(let col=0;col<18;col++){const x=-.49+col*.057,variant=(col*7+row*3)%5;marks.push(x,-.015,0,x+.025,.015,0);if(variant!==0)marks.push(x+.004,.001,0,x+.026,.001,0);if(variant>2)marks.push(x+.025,.015,0,x+.035,-.014,0)}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(marks,3));const line=new THREE.LineSegments(geometry,markMaterial),y=2.15-row*.15;line.position.set(0,y,pageZ(y)+.012);line.name='monkey-sequence-line';machine.add(line);lines.push(line)}
 const keys=[];for(let row=0;row<3;row++)for(let i=0;i<8;i++){const key=cylinder(machine,.065,.08,paper,(i-3.5)*.22,1.2,.02+row*.17);key.name='monkey-key';const rim=part(key,new THREE.TorusGeometry(.052,.006,5,16),gold,0,.034,0);rim.rotation.x=Math.PI/2;keys.push(key)}
 for(const x of [-.91,.91]){const rail=box(machine,.035,.07,.58,gold,x,1.19,.19);rail.name='monkey-keyboard-rail'}const frontRail=box(machine,1.8,.07,.035,gold,0,1.19,.49);frontRail.name='monkey-keyboard-rail';
 for(const x of [-.62,.62]){const spool=cylinder(machine,.17,.07,wood,x,1.43,-.3);const hub=cylinder(machine,.06,.08,gold,x,1.47,-.3)}
 // A fan of typebars rises behind the keys toward the platen, giving the
 // machine a readable mechanical transition without entering the hand paths.
 {const typebars=new THREE.Group();typebars.name='monkey-typebar-assembly';machine.add(typebars);const metal=material(0xa98e69);
  for(let i=0;i<15;i++){const x=(i-7)*.068,start=new THREE.Vector3(x,1.29,-.19-.12*(1-Math.abs(x)/.48)),end=new THREE.Vector3(x*.18,1.44,-.4),curve=new THREE.QuadraticBezierCurve3(start,new THREE.Vector3(x*.72,1.39,-.34),end),bar=part(typebars,new THREE.TubeGeometry(curve,8,.009,5,false),metal);bar.name='monkey-typebar';bar.castShadow=false}
  const guide=box(typebars,1.08,.04,.035,gold,0,1.29,-.2);guide.name='monkey-typebar-guide';
 }
 // A small inkwell and feather occupy the rear corner outside the keyboard.
 const inkwell=new THREE.Group();inkwell.name='monkey-inkwell';inkwell.position.set(1.25,.93,-.57);root.add(inkwell);
 const well=cylinder(inkwell,.105,.19,0x6d8580,0,.095,0);well.scale.set(1.2,1,1.2);const rim=part(inkwell,new THREE.TorusGeometry(.105,.015,6,20),gold,0,.192,0);rim.rotation.x=Math.PI/2;
 const quillCurve=new THREE.LineCurve3(new THREE.Vector3(0,.14,0),new THREE.Vector3(.18,.76,-.04));part(inkwell,new THREE.TubeGeometry(quillCurve,12,.012,5,false),paper);
 const featherShape=new THREE.Shape();featherShape.moveTo(0,0);featherShape.quadraticCurveTo(-.1,.28,0,.55);featherShape.quadraticCurveTo(.13,.35,0,0);const feather=part(inkwell,new THREE.ShapeGeometry(featherShape,12),paper,.075,.37,-.022);feather.rotation.z=-.28;feather.material.side=THREE.DoubleSide;
 // A sheet drapes over the clear front corner of the table, away from the
 // animated hands and the typewriter. Its marks follow the curved surface.
 {const surface=z=>.941-.85*Math.max(0,z-.74)**1.45,positions=[],indices=[],marks=[],rows=20;
  for(let j=0;j<=rows;j++){const z=.25+.72*j/rows;for(const x of [1.08,1.46])positions.push(x,surface(z),z);if(j<rows){const n=j*2;indices.push(n,n+2,n+1,n+1,n+2,n+3)}}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const sheet=part(root,geometry,paper);sheet.name='monkey-table-page';sheet.material.side=THREE.DoubleSide;sheet.castShadow=false;
  for(let row=0;row<6;row++)for(let col=0;col<5;col++){const x=1.12+col*.06,z=.31+row*.075,y=surface(z)+.003;marks.push(x,y,z,x+.026,y,z+.025);if((row+col)%3)marks.push(x+.005,y,z+.015,x+.03,y,z+.015)}
  const inkGeometry=new THREE.BufferGeometry();inkGeometry.setAttribute('position',new THREE.Float32BufferAttribute(marks,3));const ink=new THREE.LineSegments(inkGeometry,markMaterial);ink.name='monkey-table-page-ink';root.add(ink);
 }
 const arms=[];for(const side of [-1,1]){const upper=part(root,new THREE.CylinderGeometry(.09,.105,1,10),fur),forearm=part(root,new THREE.CylinderGeometry(.07,.09,1,10),fur),elbow=ball(root,.09,fur),hand=ball(root,.11,skin);upper.name='monkey-upper-arm';forearm.name='monkey-forearm';elbow.name='monkey-elbow';hand.name='monkey-hand';hand.scale.set(1,.72,1.1);for(let i=0;i<4;i++){const finger=ball(hand,.035,skin,(i-1.5)*.038,-.01,-.075);finger.scale.set(.7,.5,1.4);finger.name='monkey-finger'}arms.push({upper,forearm,elbow,hand,shoulder:new THREE.Vector3(side*.33,1.325,1.28),side})}
 // Short tapered locks stay parented to the moving arm segments, so the fur
 // follows the typing motion instead of hovering in the original pose.
 {const geometry=new THREE.SphereGeometry(1,8,6),furDetail=material(0x906c50),dummy=new THREE.Object3D();for(const arm of arms)for(const [segment,r0,r1] of [[arm.upper,.105,.09],[arm.forearm,.09,.07]]){const locks=new THREE.InstancedMesh(geometry,furDetail,48);locks.name='monkey-arm-fur';for(let i=0;i<48;i++){const y=-.41+.82*(i+.5)/48,a=i*2.399963,r=THREE.MathUtils.lerp(r0,r1,y+.5)-.004,normal=new THREE.Vector3(Math.cos(a),0,Math.sin(a));dummy.position.set(normal.x*r,y,normal.z*r);dummy.rotation.set(0,-a,.18);dummy.scale.set(.012,.035,.007);dummy.updateMatrix();locks.setMatrixAt(i,dummy.matrix)}locks.computeBoundingSphere();locks.castShadow=false;locks.receiveShadow=false;segment.add(locks)}}
 function pointSegment(segment,start,end){const d=end.clone().sub(start);segment.position.copy(start).add(end).multiplyScalar(.5);segment.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());segment.scale.y=d.length()}
 function pointArm(arm,target){const joint=arm.shoulder.clone().lerp(target,.5).add(new THREE.Vector3(arm.side*.06,-.15,.08));pointSegment(arm.upper,arm.shoulder,joint);pointSegment(arm.forearm,joint,target);arm.elbow.position.copy(joint);arm.hand.position.copy(target)}
 // Enlarge the study ensemble around the carpet surface while keeping the typing mechanism together.
 const study=new THREE.Group();study.name='monkey-study';for(const child of root.children.slice(studyPartsStart))study.add(child);root.add(study);study.scale.setScalar(1.25);study.position.y=.09*(1-1.25);
 // A grounded stack supports the hourglass and frames the tabletop.
 for(let i=0;i<3;i++){const book=box(root,.9,.11,.8,i%2?colors.blue:colors.red,-1.9,.105+i*.11,3.7);book.name='monkey-hourglass-book';box(root,.8,.065,.72,paper,-1.9,.105+i*.11,3.7)}
 const arch=new THREE.Group();arch.name='monkey-arch';arch.position.set(-2.55,0,0);arch.rotation.y=Math.PI/2;root.add(arch);for(const x of [-2.3,2.3]){const column=box(arch,.28,2.04,.32,paper,x,1.13,0);column.name='monkey-arch-column';box(arch,.43,.16,.46,paper,x,.13,0);box(arch,.43,.14,.46,paper,x,2.2,0);for(const dx of [-.085,0,.085]){const flute=box(arch,.018,1.78,.018,0xd4c5ac,x+dx,1.14,.169);flute.name='monkey-column-flute'}}
 const archShape=new THREE.Shape();for(let i=0;i<=48;i++){const a=Math.PI-i*Math.PI/48,x=2.44*Math.cos(a),y=2.2+.89*Math.sin(a);if(i===0)archShape.moveTo(x,y);else archShape.lineTo(x,y)}for(let i=0;i<=48;i++){const a=i*Math.PI/48;archShape.lineTo(2.16*Math.cos(a),2.2+.61*Math.sin(a))}archShape.closePath();const archTop=part(arch,new THREE.ExtrudeGeometry(archShape,{depth:.32,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:2}),paper,0,0,-.16);archTop.name='monkey-arch-top';
 const infinityPoints=[];for(let i=0;i<=80;i++){const a=i*Math.PI*2/80;infinityPoints.push(new THREE.Vector3(.7*Math.sin(a),2.48+.25*Math.sin(2*a),.12))}const infinity=part(arch,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(infinityPoints),80,.045,8,false),gold);infinity.name='monkey-infinity';
 const vinePoints=[new THREE.Vector3(-2.32,.28,.2),new THREE.Vector3(-2.4,1.15,.2),new THREE.Vector3(-2.26,2.13,.2),new THREE.Vector3(-1.8,2.62,.2),new THREE.Vector3(-1.05,2.88,.2),new THREE.Vector3(-.35,2.96,.2)];const vineCurve=new THREE.CatmullRomCurve3(vinePoints),vine=part(arch,new THREE.TubeGeometry(vineCurve,48,.025,6,false),0x65734e);vine.name='monkey-arch-vine';for(let i=0;i<24;i++){const t=.08+i*.037,point=vineCurve.getPoint(t),tangent=vineCurve.getTangent(t),side=i%2?1:-1;point.x+=-tangent.y*side*.12;point.y+=tangent.x*side*.12;const leaf=ball(arch,.14,i%3?0x78845b:0x909971,point.x,point.y,.21);leaf.scale.set(.6,1.25,.16);leaf.rotation.z=Math.atan2(tangent.y,tangent.x)+side*.8;leaf.name='monkey-arch-leaf'}
 // The hourglass and scattered pages suggest duration without implying a completed text.
 const hourglass=new THREE.Group();hourglass.name='monkey-hourglass';hourglass.position.set(-1.9,.31,3.7);root.add(hourglass);
 for(const y of [.12,1.36])cylinder(hourglass,.36,.1,wood,0,y,0);for(const x of [-.25,.25])for(const z of [-.18,.18])cylinder(hourglass,.035,1.15,wood,x,.74,z);
 for(const side of [-1,1]){const bulb=part(hourglass,new THREE.ConeGeometry(.25,.53,20),new THREE.MeshStandardMaterial({color:0xd5c6a7,transparent:true,opacity:.5,roughness:.25}),0,.74+side*.265,0);bulb.rotation.z=side<0?Math.PI:0}
 const sand=part(hourglass,new THREE.ConeGeometry(.18,.23,16),gold,0,.38,0);sand.rotation.z=0;
 const looseLines=[];
 for(const [x,z,angle] of [[2.45,3,.25],[3.35,2.85,-.35],[1.95,3.6,.15]]){const sheet=new THREE.Group();sheet.position.set(x,0,z);sheet.rotation.y=angle;root.add(sheet);const page=box(sheet,.62,.018,.45,paper,0,.07,0);page.name='monkey-loose-page';for(let row=0;row<4;row++){const marks=[];for(let col=0;col<10;col++){const px=-.23+col*.047,pz=-.12+row*.075;marks.push(px,.081,pz,px+.019,.081,pz+.028);if((col+row)%3)marks.push(px+.002,.081,pz+.016,px+.026,.081,pz+.016)}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(marks,3));const line=new THREE.LineSegments(geometry,markMaterial);line.name='monkey-loose-sequence';sheet.add(line);looseLines.push(line)}}
 // An armillary sculpture and a discarded page evoke time and repeated attempts.
 const globe=new THREE.Group();globe.name='monkey-armillary';globe.position.set(3.45,0,-1.9);root.add(globe);
 box(globe,.65,.75,.65,0x879486,0,.39,0);cylinder(globe,.22,.1,gold,0,.82,0);cylinder(globe,.07,.22,gold,0,.98,0);
 for(const tilt of [0,Math.PI/3,-Math.PI/3]){const hoop=part(globe,new THREE.TorusGeometry(.4,.025,8,40),gold,0,1.42,0);hoop.rotation.y=tilt;hoop.rotation.z=.2}ball(globe,.075,gold,0,1.42,0);
 const crumple=part(root,new THREE.IcosahedronGeometry(.2,0),paper,2.75,.2,.65);crumple.scale.set(1,.75,.85);crumple.name='monkey-crumpled-page';
 // A closed reference volume rests on the exposed foreground floor, outside
 // the animated hands and loose output pages.
 const volume=new THREE.Group();volume.name='monkey-floor-volume';volume.position.set(1.8,.055,-3.35);volume.rotation.y=-.28;root.add(volume);
 box(volume,1.0,.045,.7,0x9f634d,0,.0225,0);box(volume,.92,.17,.62,0xdfd1b6,0,.13,0);box(volume,1.0,.045,.7,0x9f634d,0,.2375,0);
 const spine=box(volume,.1,.22,.7,0x9f634d,-.45,.13,0);spine.name='monkey-volume-spine';
 for(const z of [-.2,.2])box(volume,.98,.009,.025,gold,0,.264,z);
 const pageLines=[];for(let i=1;i<8;i++){const y=.055+i*.019;pageLines.push(-.39,y,.312,.45,y,.312);pageLines.push(.462,y,-.28,.462,y,.28)}const pageLineGeometry=new THREE.BufferGeometry();pageLineGeometry.setAttribute('position',new THREE.Float32BufferAttribute(pageLines,3));const pageEdges=new THREE.LineSegments(pageLineGeometry,new THREE.LineBasicMaterial({color:0xbca88c}));pageEdges.name='monkey-volume-page-edges';volume.add(pageEdges);
 return done(scene,root,(t,value)=>{const index=((Math.floor(t*(1+value*8))%keys.length)+keys.length)%keys.length;keys.forEach((key,i)=>key.position.y=1.2-(index===i?.055:0));for(const arm of arms){const selected=keys[index],active=Math.sign(selected.position.x)===arm.side,x=active?selected.position.x:arm.side*.45;pointArm(arm,new THREE.Vector3(x,1.3192-(active?.055:0),active?selected.position.z:.23))}lines.forEach((line,i)=>{line.scale.x=.12+Math.min(1,Math.max(0,value*5-i))*.88});looseLines.forEach((line,i)=>{line.visible=value*looseLines.length>i})});
}
