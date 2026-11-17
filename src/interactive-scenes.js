import * as THREE from 'three';
import {disposeSceneGraph} from './dispose-scene.js';
import {addStudyDetails} from './study-details.js';
import {syntheticTwinCount} from './interactive.js';
// Deliberately schematic Level 0 objects; no claim of historical reconstruction.
export function buildInteractiveScene(scene,concept){
 const root=new THREE.Group();root.name=`study-${concept.id}`;scene.add(root);
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.85});
 const box=(x,y,z,w,h,d,c)=>{let m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);root.add(m);return m};
 const ball=(x,y,z,r,c)=>{let m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),mat(c));m.position.set(x,y,z);root.add(m);return m};
 const cone=(x,y,z,r,h,c)=>{let m=new THREE.Mesh(new THREE.ConeGeometry(r,h,4),mat(c));m.position.set(x,y,z);m.rotation.y=Math.PI/4;root.add(m);return m};
 function attach(parent,geometry,color,x,y,z){const m=new THREE.Mesh(geometry,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function dress(head,color){head.userData.robe=attach(head,new THREE.CylinderGeometry(.17,.28,.7,10),color,0,-.53,0);for(const side of [-1,1]){attach(head,new THREE.CylinderGeometry(.055,.055,.4,8),color,side*.28,-.48,0);attach(head,new THREE.CylinderGeometry(.06,.06,.34,8),0xc99774,side*.13,-1.01,0)}const hair=attach(head,new THREE.SphereGeometry(.36,12,8),0x51463c,0,.27,-.02);hair.scale.set(1,.5,1);return head}
 function makeBird(x,z,feather,wingColor,hen=false){
  const bird=new THREE.Group();bird.position.set(x,0,z);root.add(bird);
  const body=attach(bird,new THREE.SphereGeometry(.62,16,12),feather,0,.74,0);body.scale.set(1.22,.85,.76);
  attach(bird,new THREE.SphereGeometry(.27,14,10),feather,.48,1.22,0);
  for(const side of [-1,1]){const wing=attach(bird,new THREE.SphereGeometry(.38,12,10),wingColor,-.08,.83,side*.4);wing.scale.set(1.3,.75,.25);wing.name='bird-folded-wing';attach(bird,new THREE.SphereGeometry(.035,8,6),0x293a35,.65,1.25,side*.22);attach(bird,new THREE.CylinderGeometry(.04,.04,.46,8),0xb77b65,-.15,.23,side*.18)}
  const beak=attach(bird,new THREE.ConeGeometry(.13,.25,4),0xc59c61,.77,1.2,0);beak.rotation.z=-Math.PI/2;
  const tail=attach(bird,new THREE.ConeGeometry(.28,.55,5),wingColor,-.8,.8,0);tail.rotation.z=Math.PI/2;
  if(hen)attach(bird,new THREE.SphereGeometry(.11,10,8),0xa65f54,.45,1.5,0);
  return bird;
 }
 const radius=['schedules','emotion-orientation'].includes(concept.id)?4.85:concept.id==='language-wall'?4.8:['induction','time-frames','argument-frames','twins','pigeon'].includes(concept.id)?4.65:5.15;
 const plate=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius+.2,.3,48),mat(0x566458));plate.position.y=-.2;plate.receiveShadow=true;root.add(plate);plate.name='base';let sync=()=>{};
 const id=concept.id;
 if(id==='language-wall'){
  for(const z of [-1.32,1.32]){const wall=box(0,1.2,z,.25,2.5,1.36,0xc1aa8b);wall.name='language-wall-section'}
  for(const [y,h] of [[.55,1.1],[1.91,1.18]]){const wall=box(0,y,0,.25,h,1.28,0xc1aa8b);wall.name='language-wall-section'}
  // A shallow masonry crown gives the partition a continuous architectural silhouette.
  {const shape=new THREE.Shape();shape.moveTo(-2,0);shape.quadraticCurveTo(0,.56,2,0);shape.lineTo(2,-.06);shape.lineTo(-2,-.06);shape.closePath();const crown=attach(root,new THREE.ExtrudeGeometry(shape,{depth:.25,bevelEnabled:false,curveSegments:32}),0xc1aa8b,-.125,2.5,0);crown.rotation.y=Math.PI/2;crown.name='language-wall-crown';for(const face of [-.13,.13])for(let i=1;i<8;i++){const z=-2+i*.5,y=2.45+.28*(1-(z/2)**2),joint=box(face,y,z,.01,.08,.018,0xa99379);joint.name='language-crown-joint'}}
  for(const [x,color] of [[-2.7,0xa76851],[2.7,0x7196a3]]){const person=dress(ball(x,1.38,x<0?.6:0,.25,0xc68e65),color);person.name='language-participant';person.scale.setScalar(1.15);person.rotation.y=x<0?Math.PI/2:-Math.PI/2;const hair=person.children[person.children.length-1];hair.scale.set(.72,.5,.72);person.children[1].visible=person.children[3].visible=false;
   function limb(a,b,r,c,name){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),part=attach(person,new THREE.CylinderGeometry(r*.85,r,delta.length(),8),c,0,0,0);part.position.copy(start).add(end).multiplyScalar(.5);part.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());part.name=name;return part}
   for(const side of [-1,1]){attach(person,new THREE.SphereGeometry(.025,8,6),0x43554b,side*.085,.03,.22);const shoulder=[side*.23,-.35,0],elbow=[side*.27,-.58,.13],hand=[side*.22,-.57,.33];limb(shoulder,elbow,.075,color,'language-sleeve');limb(elbow,hand,.047,0xc99774,'language-forearm');const palm=attach(person,new THREE.SphereGeometry(.055,10,8),0xc99774,...hand);palm.name='language-hand';const shoe=attach(person,new THREE.BoxGeometry(.14,.09,.22),0x795844,side*.13,-1.155,.05);shoe.name='language-shoe'}
   const nose=attach(person,new THREE.SphereGeometry(.05,8,6),0xc99774,0,-.045,.24);nose.scale.set(.7,1,.8);const collar=attach(person,new THREE.TorusGeometry(.16,.025,6,20),0xe3d7bf,0,-.22,0);collar.rotation.x=Math.PI/2;const apron=attach(person,new THREE.BoxGeometry(.28,.47,.025),0xe3d7bf,0,-.61,.205);apron.name='language-apron';const belt=attach(person,new THREE.BoxGeometry(.36,.045,.045),0x795844,0,-.55,.215);belt.name='language-belt'
  }
  // Before reconstruction, a thought bubble shows an unresolved house idea;
  // it disappears once a concrete receiver model has been built.
  const uncertainty=new THREE.Group();uncertainty.name='language-unbuilt-thought';uncertainty.position.set(2.72,2.65,-.2);root.add(uncertainty);
  {const shape=new THREE.Shape();shape.moveTo(-.43,-.2);shape.bezierCurveTo(-.66,-.18,-.68,.06,-.5,.13);shape.bezierCurveTo(-.48,.3,-.3,.36,-.17,.3);shape.bezierCurveTo(-.06,.41,.13,.39,.22,.3);shape.bezierCurveTo(.38,.36,.53,.27,.53,.12);shape.bezierCurveTo(.68,.05,.66,-.15,.49,-.2);shape.bezierCurveTo(.39,-.31,.22,-.3,.1,-.25);shape.bezierCurveTo(-.04,-.32,-.22,-.31,-.32,-.24);shape.bezierCurveTo(-.37,-.26,-.41,-.24,-.43,-.2);shape.closePath();const cloud=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelThickness:.01,bevelSize:.01,bevelSegments:2,curveSegments:16}),new THREE.MeshBasicMaterial({color:0xe5d8bd}));cloud.name='language-thought-cloud';cloud.castShadow=false;uncertainty.add(cloud)}
  for(const [x,y,r] of [[-.18,-.32,.065],[-.27,-.43,.04]]){const dot=attach(uncertainty,new THREE.SphereGeometry(r,8,6),0xe5d8bd,x,y,0);dot.scale.z=.5;dot.castShadow=false}
  {const strokes=[[-.25,-.12,.2,-.12],[-.25,-.12,-.25,.06],[.2,-.12,.2,.06],[-.32,.06,-.02,.25],[-.02,.25,.27,.06],[-.07,-.12,-.07,.01],[-.07,.01,.03,.01],[.03,.01,.03,-.12]],vertices=[];for(const [x1,y1,x2,y2] of strokes)vertices.push(x1,y1,.075,x2,y2,.075);const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const lines=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0x62766b}));lines.name='language-thought-house';uncertainty.add(lines)}
  {const hook=attach(uncertainty,new THREE.TorusGeometry(.055,.009,6,20,Math.PI*1.4),0xa56a50,.35,.07,.079);hook.rotation.z=-.25;const dot=attach(uncertainty,new THREE.SphereGeometry(.012,8,6),0xa56a50,.35,-.035,.079);dot.name='language-thought-question'}
  // Source model and reconstructed model are intentionally schematic examples.
  function pitchedRoof(x,z){const shape=new THREE.Shape();shape.moveTo(-.7,-.4);shape.lineTo(0,.4);shape.lineTo(.7,-.4);shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:1.04,bevelEnabled:false});geometry.translate(0,0,-.52);const roof=new THREE.Mesh(geometry,mat(0x5e87ae));roof.position.set(x,1.4,z);root.add(roof);
   const tileGeometry=new THREE.BoxGeometry(.24,.025,.22);for(const side of [-1,1])for(const offset of [.12,.34,.56])for(const depth of [-.38,-.13,.13,.38]){const tile=new THREE.Mesh(tileGeometry,roof.material);tile.position.set(side*offset,.4-offset*.8/.7+.018,depth);tile.rotation.z=-side*Math.atan(.8/.7);tile.castShadow=true;roof.add(tile)}return roof}
  const source=box(-1.4,.55,1.15,1.2,1,.9,0xd9c5a1),sourceRoof=pitchedRoof(-1.4,1.15);source.name='sender-house';sourceRoof.name='sender-roof';
  const house=box(1.4,.55,0,1.2,1,.9,0xd9c5a1),roof=pitchedRoof(1.4,0);house.name='receiver-house';roof.name='receiver-roof';
  function houseDetails(body){
   attach(body,new THREE.BoxGeometry(.27,.53,.035),0x795844,0,-.22,.46);
   for(const side of [-1,1])attach(body,new THREE.BoxGeometry(.04,.58,.05),0xb4a58b,side*.155,-.2,.485);
   attach(body,new THREE.BoxGeometry(.35,.045,.05),0xb4a58b,0,.09,.485);attach(body,new THREE.BoxGeometry(.38,.055,.14),0xb4a58b,0,-.475,.51);
   for(const x of [-.36,.36]){attach(body,new THREE.BoxGeometry(.22,.22,.04),0x7898a0,x,.15,.46);attach(body,new THREE.BoxGeometry(.025,.24,.045),0xe3d7bf,x,.15,.485);attach(body,new THREE.BoxGeometry(.24,.025,.045),0xe3d7bf,x,.15,.485);attach(body,new THREE.BoxGeometry(.3,.045,.1),0xb4a58b,x,.015,.5)}
   const doorKnob=attach(body,new THREE.SphereGeometry(.025,8,6),0xc69e67,.09,-.2,.49);doorKnob.name='language-house-knob';
   const chimney=attach(body,new THREE.BoxGeometry(.2,.5,.2),0xb4a58b,-.35,.85,-.15);chimney.name='language-house-chimney';attach(body,new THREE.BoxGeometry(.26,.06,.26),0xd9c5a1,-.35,1.13,-.15);
   for(const side of [-1,1]){attach(body,new THREE.BoxGeometry(.04,.22,.25),0x7898a0,side*.61,.13,0);attach(body,new THREE.BoxGeometry(.045,.025,.27),0xe3d7bf,side*.62,.13,0)}
   for(const y of [-.35,-.12,.11,.34])attach(body,new THREE.BoxGeometry(1.18,.012,.012),0xb4a58b,0,y,-.456);
  }
  houseDetails(source);houseDetails(house);
  // The houses are tabletop-scale models, keeping the participants visible.
  const houseScale=.65,displayTop=.59;for(const body of [source,house]){body.scale.setScalar(houseScale);body.position.y=displayTop+.5*houseScale}for(const top of [sourceRoof,roof]){top.scale.setScalar(houseScale);top.position.y=displayTop+1.4*houseScale}
  // Raised work tables keep the examples legible and support both receiver positions.
  for(const [x,z,depth,name] of [[-1.4,1.15,1.1,'sender'],[1.4,0,1.9,'receiver']]){const top=box(x,.55,z,1.55,.08,depth,0x795844);top.name=`language-${name}-display`;for(const dx of [-.62,.62])for(const dz of [-depth/2+.13,depth/2-.13]){const leg=box(x+dx,.255,z+dz,.1,.51,.1,0x795844);leg.name=`language-${name}-display-leg`}}
  // This card shows extra colored roof detail only for the specific description.
  const note=box(0,1.21,0,.8,.06,.7,0xe6d9b7);note.name='language-description-card';
  const icon=new THREE.Group();icon.name='language-specific-icon';note.add(icon);
  attach(icon,new THREE.BoxGeometry(.35,.012,.025),0x5e87ae,0,.036,.08);
  for(const side of [-1,1]){const line=attach(icon,new THREE.BoxGeometry(.22,.012,.025),0x5e87ae,side*.08,.036,-.04);line.rotation.y=side*.6}
  sync=s=>{icon.children.forEach(piece=>piece.visible=s.description==='specific');uncertainty.visible=s.build==='none';house.visible=roof.visible=s.build!=='none';roof.material.color.setHex(s.build==='matched'?0x5e87ae:s.build==='partial'?0xb89962:0xa65f54);roof.scale.y=houseScale*(s.build==='different'?.2:1);roof.position.y=house.position.y+.5*houseScale+.4*roof.scale.y;house.position.z=roof.position.z=s.background?.5:0};
 }else if(id==='pigeon'){
  const bird=makeBird(-1.6,0,0x9ba6a8,0x788b8d);bird.name='pigeon-bird';bird.scale.setScalar(1.45);
  // Extend the neck colours over the upper breast, so the transition is
  // continuous where the neck intersects the body rather than a collar.
  {const body=bird.children[0],p=body.geometry.getAttribute('position'),colors=[],base=new THREE.Color(0x9ba6a8),green=new THREE.Color(0x668d83),violet=new THREE.Color(0x947e91),color=new THREE.Color();for(let i=0;i<p.count;i++){const u=p.getX(i)/.62,v=p.getY(i)/.62,amount=THREE.MathUtils.smoothstep(u,.28,.75)*THREE.MathUtils.smoothstep(v,-.4,.18);color.copy(violet).lerp(green,THREE.MathUtils.smoothstep(v,.08,.6));color.lerp(base,1-amount);colors.push(color.r,color.g,color.b)}body.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));body.material.color.setHex(0xffffff);body.material.vertexColors=true;body.name='pigeon-breast'}
  // Curved toes spread forward from each ankle; the separate tapered claws
  // and small scale bands follow the bird when its behavior changes.
  for(const side of [-1,1])for(let toe=-1;toe<=1;toe++){const z=side*.18,curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.15,.044,z),new THREE.Vector3(-.075,.024,z+toe*.04),new THREE.Vector3(.09,.022,z+toe*.085)]),geometry=new THREE.TubeGeometry(curve,12,.018,8,false);geometry.computeBoundingBox();geometry.translate(0,-geometry.boundingBox.min.y,0);const foot=attach(bird,geometry,0xb77b65,0,0,0);foot.name='pigeon-toe';
   const tip=new THREE.Vector3(.09,.02,z+toe*.085),claw=attach(bird,new THREE.ConeGeometry(.015,.075,8),0x514d46,tip.x+.034,.022,tip.z+toe*.012);claw.rotation.z=-Math.PI/2;claw.rotation.x=toe*.16;claw.name='pigeon-claw';
   for(let j=0;j<3;j++){const p=curve.getPoint(.42+j*.13),band=attach(bird,new THREE.TorusGeometry(.0185,.003,5,10),0x9c6655,p.x,p.y-.001,p.z);band.rotation.y=Math.PI/2+toe*.18;band.name='pigeon-toe-scale'}
  }
  // The two dark bars conform to the folded wing rather than protruding as
  // separate rounded lumps. Their colours are fixed across behavior states.
  for(const side of [-1,1])for(const center of [-.16,-.34]){const vertices=[],indices=[],steps=16;for(let i=0;i<=steps;i++){const t=i/steps,y=.67+.31*t,mid=center+.08*(t-.5);for(const edge of [-1,1]){const x=mid+edge*.032,u=(x+.08)/.494,v=(y-.83)/.285,z=side*(.4+.095*Math.sqrt(Math.max(0,1-u*u-v*v))+.004);vertices.push(x,y,z)}if(i<steps){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const band=attach(bird,geometry,0x596e73,0,0,0);band.material.side=THREE.DoubleSide;band.castShadow=false;band.receiveShadow=false;band.name='pigeon-wing-band'}
  // A continuous coloured neck joins the head to the breast. Vertex colours
  // describe the fixed plumage, independent of reward and behavior state.
  {const geometry=new THREE.SphereGeometry(1,24,18),positions=geometry.getAttribute('position'),colors=[],green=new THREE.Color(0x668d83),violet=new THREE.Color(0x947e91),grey=new THREE.Color(0x9ba6a8),color=new THREE.Color();
   for(let i=0;i<positions.count;i++){const u=positions.getX(i),v=positions.getY(i),w=positions.getZ(i);positions.setXYZ(i,.39+.28*u+.06*v,1.03+.34*v,.30*w);color.copy(violet).lerp(green,THREE.MathUtils.smoothstep(v,-.55,.15)).lerp(grey,THREE.MathUtils.smoothstep(v,.58,.95));colors.push(color.r,color.g,color.b)}
   geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();const neck=attach(bird,geometry,0xffffff,0,0,0);neck.material.vertexColors=true;neck.name='pigeon-neck-plumage'}
  for(const side of [-1,1]){const iris=attach(bird,new THREE.SphereGeometry(.055,10,8),0xc79755,.65,1.25,side*.225);iris.scale.z=.3;attach(bird,new THREE.SphereGeometry(.025,8,6),0x293a35,.66,1.25,side*.245)}
  // Small overlapping coverts and a pale cere distinguish the bird's wing and bill.
  // Rounded coverts follow the folded wing surface; their pale, close
  // colours form layered plumage rather than separate angular scales.
  const covertMaterials=[mat(0x879996),mat(0x819390),mat(0x8b9c98)];covertMaterials.forEach(m=>m.side=THREE.DoubleSide);
  for(const side of [-1,1])for(let row=0;row<3;row++)for(let i=0;i<7;i++){
   const cx=.18-i*.09,cy=1.005-row*.075,vertices=[],indices=[],steps=8;
   for(let j=0;j<=steps;j++){const t=j/steps,x=cx-.15*t,width=.038*Math.sin(Math.PI*t);for(const edge of [-1,1]){const y=cy+edge*width,u=(x+.08)/.494,v=(y-.83)/.285,z=side*(.4+.095*Math.sqrt(Math.max(0,1-u*u-v*v))+.003);vertices.push(x-cx,y-cy,z-side*.4)}if(j<steps){const n=j*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}}
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const feather=new THREE.Mesh(geometry,covertMaterials[(row+i)%3]);feather.position.set(cx,cy,side*.4);feather.name='pigeon-wing-covert';feather.castShadow=false;feather.receiveShadow=false;bird.add(feather);
  }
  // Overlapping tapered flight feathers give the folded wing a defined lower edge.
  const flightGeometry=new THREE.SphereGeometry(1,10,6),flightColors=[mat(0x66777b),mat(0x78898c),mat(0x89989a)];
  for(const side of [-1,1])for(let i=0;i<7;i++){const feather=new THREE.Mesh(flightGeometry,flightColors[i%3]);feather.position.set(-.24-i*.095,.59+i*.028,side*(.44-i*.012));feather.scale.set(.24-i*.008,.07,.025);feather.rotation.z=.14+i*.035;feather.name='pigeon-flight-feather';feather.castShadow=false;bird.add(feather)}
  const cere=attach(bird,new THREE.SphereGeometry(.09,10,8),0xd5cbb8,.66,1.28,0);cere.scale.set(.8,.5,1);
  for(let i=-1;i<=1;i++){const feather=attach(bird,new THREE.SphereGeometry(.22,12,8),0x66777b,-.92,.62,i*.13);feather.scale.set(1.8,.18,.42);feather.rotation.y=i*.12}
  const clock=ball(1.5,1.7,-1.68,.6,0xe3d8b6);clock.scale.z=.12;clock.name='pigeon-clock-face';
  const pivot=new THREE.Group();pivot.name='pigeon-clock-hand';pivot.position.set(1.5,1.7,-1.55);root.add(pivot);attach(pivot,new THREE.BoxGeometry(.055,.42,.045),0x4c554d,0,.2,0);attach(pivot,new THREE.SphereGeometry(.065,10,8),0x4c554d,0,0,0);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3,mark=box(1.5+Math.sin(a)*.47,1.7+Math.cos(a)*.47,-1.55,.055,.13,.035,0x795844);mark.rotation.z=-a}
  // Minor ticks give the timer a clock face; the three larger marks still
  // correspond to the existing three-step display.
  for(let i=0;i<12;i++){if(i%4===0)continue;const a=i*Math.PI/6,mark=box(1.5+Math.sin(a)*.49,1.7+Math.cos(a)*.49,-1.55,.018,.07,.02,0xa28f70);mark.rotation.z=-a;mark.name='pigeon-clock-minor-tick'}
  const pellets=[];for(let i=0;i<6;i++){const pellet=ball(2.8+(i%3)*.2,.265,-1.25+Math.floor(i/3)*.2,.07,0xc89452);pellet.name='pigeon-food-pellet';pellets.push(pellet)}
  sync=s=>{bird.rotation.y=(s.actions%3)*.2;pivot.rotation.z=-Math.PI*2*(s.steps%3)/3;pellets.forEach((pellet,i)=>pellet.visible=i<Math.min(s.rewards,6));clock.material.color.setHex(s.steps%3===0&&s.steps>0?0xe2a25d:0xe3d8b6)};
 }else if(id==='induction'){
  const hen=makeBird(-3.2,-.2,0xe3ddcb,0xc9bdad,true);hen.name='induction-hen';hen.scale.setScalar(1.4);
  for(const side of [-1,1])for(let toe=-1;toe<=1;toe++){const foot=attach(hen,new THREE.BoxGeometry(.22,.035,.035),0xb77b65,-.06,.0175,side*.18+toe*.07);foot.name='induction-hen-toe';foot.rotation.y=toe*.2}
  // Overlapping curved feather surfaces follow the folded wing's ellipsoid.
  const featherGeometry=new THREE.SphereGeometry(1,10,8),featherMaterials=[mat(0xe8ddcc),mat(0xd8c9b5),mat(0xf0e7d9)];
  for(const side of [-1,1])for(let row=0;row<3;row++)for(let i=0;i<6;i++){const cx=.17-i*.085,cy=.94-row*.09,vertices=[],points=[[.04,0],[-.02,.035],[-.11,.04],[-.17,0],[-.11,-.04],[-.02,-.035],[-.055,0]];for(const [dx,dy] of points){const x=cx+dx,y=cy+dy,u=(x+.08)/.494,v=(y-.83)/.285,z=side*(.4+.095*Math.sqrt(Math.max(0,1-u*u-v*v))+.004);vertices.push(x,y,z)}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex([0,1,6,1,2,6,2,3,6,3,4,6,4,5,6,5,0,6]);geometry.computeVertexNormals();const feather=new THREE.Mesh(geometry,featherMaterials[(i+row)%3]);feather.material.side=THREE.DoubleSide;feather.name='induction-hen-wing-feather';feather.castShadow=false;hen.add(feather)}
  for(let i=0;i<9;i++){const u=(i-4)/4,tail=new THREE.Mesh(featherGeometry,featherMaterials[i%3]);tail.position.set(-.78-.09*(1-Math.abs(u)),1.05+.17*(1-Math.abs(u)),u*.21);tail.scale.set(.12,.27,.06);tail.rotation.z=.47+u*.12;tail.rotation.x=u*.45;tail.name='induction-hen-tail-feather';tail.castShadow=true;hen.add(tail)}
  for(const side of [-1,1]){const iris=attach(hen,new THREE.SphereGeometry(.048,10,8),0xc89452,.65,1.25,side*.228);iris.scale.z=.28;const pupil=attach(hen,new THREE.SphereGeometry(.022,8,6),0x293a35,.66,1.25,side*.245);pupil.scale.z=.45}
  for(let i=0;i<3;i++){const comb=attach(hen,new THREE.SphereGeometry(.095,10,8),0xa65f54,.32+i*.12,1.49,0);comb.scale.set(.8,1.1,.65)}
  const wattle=attach(hen,new THREE.SphereGeometry(.1,10,8),0xa65f54,.65,1.08,0);wattle.scale.set(.55,1,.5);
  const ground=attach(root,new THREE.CylinderGeometry(4.52,4.52,.08,64),0x849079,0,-.04,0);ground.name='induction-ground';
  const days=[],grains=[],grainGeometry=new THREE.SphereGeometry(.06,8,6),grainMaterial=mat(0xc89452);
  for(let i=0;i<6;i++){
   const x=-1.35+i*.8;const platform=box(x,.15,-.9,.64,.3,.65,0xb3a58c);platform.name='induction-day-platform';
   const sign=box(x,.6,-1.07,.56,.6,.12,0xd7ccb5);sign.name='induction-day';
   const shape=new THREE.Shape();shape.moveTo(-.28,0);for(let j=0;j<=24;j++){const a=Math.PI-j*Math.PI/24;shape.lineTo(Math.cos(a)*.28,Math.sin(a)*.28)}shape.closePath();const crown=attach(root,new THREE.ShapeGeometry(shape),0xd7ccb5,x,.9,-1);crown.material.side=THREE.DoubleSide;crown.name='induction-day-crown';
   const rim=attach(root,new THREE.TorusGeometry(.28,.035,6,24,Math.PI),0xb3a58c,x,.9,-.98);rim.name='induction-day-arch';for(const side of [-1,1])attach(root,new THREE.BoxGeometry(.07,.6,.06),0xb3a58c,x+side*.28,.6,-.98);
   const cap=ball(x,.6,-.98,.17,0x9aa89a);cap.scale.z=.18;cap.name='induction-day-cap';const rays=new THREE.Group();rays.name='induction-day-rays';rays.position.set(x,.6,-.97);root.add(rays);if(i<5)for(let j=0;j<8;j++){const a=j*Math.PI/4,ray=attach(rays,new THREE.BoxGeometry(.02,.055,.015),0xc69e67,Math.sin(a)*.23,Math.cos(a)*.23,0);ray.rotation.z=-a}
   const landscape=new THREE.Group();landscape.name='induction-day-landscape';landscape.position.set(x,.31,-.94);root.add(landscape);
   if(i<5){for(const [height,color,z] of [[.16,0x96a688,0],[.11,0x7e9577,.01]]){const hill=new THREE.Shape();hill.moveTo(-.245,0);hill.lineTo(-.245,height*.45);hill.quadraticCurveTo(-.11,height*1.18,.02,height*.66);hill.quadraticCurveTo(.14,height*.2,.245,height*.8);hill.lineTo(.245,0);hill.closePath();const face=attach(landscape,new THREE.ShapeGeometry(hill,12),color,0,0,z);face.material.side=THREE.DoubleSide}}
   days.push({sign,crown,cap,rays,landscape});
   if(i<5){const bowl=attach(root,new THREE.CylinderGeometry(.25,.18,.08,16),0x9e704e,x,.34,-.65);bowl.name='induction-day-bowl';const group=new THREE.Group();group.name='induction-day-food';group.userData.day=i;root.add(group);for(let j=0;j<19;j++){const a=j*2.399963,r=.16*Math.sqrt(j/18),seed=new THREE.Mesh(grainGeometry,grainMaterial);seed.position.set(x+Math.cos(a)*r,.44,-.65+Math.sin(a)*r);seed.castShadow=true;group.add(seed)}grains.push(group)}
  }
  const bowlFood=[],mainGrainGeometry=new THREE.SphereGeometry(.07,10,6),mainGrainMaterial=mat(0xc69e67);for(let i=0;i<31;i++){const a=i*2.399963,r=.29*Math.sqrt(i/30),seed=new THREE.Mesh(mainGrainGeometry,mainGrainMaterial);seed.position.set(-2+Math.cos(a)*r,.19,1.1+Math.sin(a)*r);seed.name='induction-bowl-food';root.add(seed);bowlFood.push(seed)}
  sync=s=>{days.forEach(({sign,crown,cap,rays,landscape},i)=>{const color=i>=s.steps?0x9aa89a:i===5&&s.failed?0xa45d50:0xcba26a;sign.material.color.setHex(i===5&&s.failed?0xe0b5a2:0xd7ccb5);crown.material.color.copy(sign.material.color);cap.material.color.setHex(color);rays.visible=landscape.visible=i<5&&i<s.food});grains.forEach((group,i)=>group.children.forEach(seed=>seed.visible=i<s.food));bowlFood.forEach(seed=>seed.visible=s.food>0&&!s.failed)};
 }else if(id==='schedules'){
  // One response stream selects either schedule; the lamps do not suggest two concurrent trials.
  box(0,-.04,0,8,.08,3.3,0x9a9d89);
  const lamps=[];
  for(const [index,x] of [-2.35,2.35].entries()){
   box(x,.2,-.5,2.8,.4,1.55,0xb3a58c);
   box(x,1.28,-1.05,2.55,1.86,.3,0x795844);
   box(x,1.28,-.87,2.25,1.55,.08,index?0xaa6a51:0x758d70);
   for(const dx of [-.98,.98])box(x+dx,1.28,-.79,.07,1.38,.07,0xd7c8a8);
   for(const y of [.65,1.91])box(x,y,-.79,2,.07,.07,0xd7c8a8);
   // A low arch and metal fasteners identify the cabinets without adding another counter.
   const crownShape=new THREE.Shape();crownShape.moveTo(-1.15,0);for(let i=0;i<=24;i++){const a=Math.PI-i*Math.PI/24;crownShape.lineTo(Math.cos(a)*1.15,Math.sin(a)*.38)}crownShape.closePath();
   const crown=attach(root,new THREE.ShapeGeometry(crownShape),index?0xaa6a51:0x758d70,x,2.18,-1.05);crown.material.side=THREE.DoubleSide;
   const rim=attach(root,new THREE.TorusGeometry(1.15,.07,8,32,Math.PI),0xd7c8a8,x,2.18,-.98);rim.scale.y=.33;
   for(const dx of [-1.1,1.1])for(const y of [.45,2.05]){const bolt=ball(x+dx,y,-.82,.055,0xc69e67);bolt.scale.z=.35}
   const lamp=ball(x,1.45,-.73,.19,0x536259);lamp.scale.z=.4;lamp.name=index?'schedule-mode-vr':'schedule-mode-fr';lamps.push(lamp);
   // Recessed decorative niches frame the static inset tiles; progress remains on the shared display.
   for(let i=0;i<4;i++){const cx=x-.6+i*.4,shape=new THREE.Shape();shape.moveTo(-.14,0);shape.lineTo(-.14,.25);shape.absarc(0,.25,.14,Math.PI,0,true);shape.lineTo(.14,0);shape.closePath();const recess=attach(root,new THREE.ShapeGeometry(shape),0x5d6258,cx,.72,-.785);recess.material.side=THREE.DoubleSide;recess.name='schedule-decorative-niche';for(const side of [-1,1])box(cx+side*.15,.85,-.765,.025,.26,.035,0xd7c8a8);const cap=attach(root,new THREE.TorusGeometry(.15,.014,6,20,Math.PI),0xd7c8a8,cx,.98,-.765);cap.name='schedule-niche-arch';box(cx,.92,-.735,.22,.1,.045,0xd9c9a9)}
  }
  const progressBase=box(0,.26,.5,5.8,.52,.5,0x43554b);progressBase.name='schedule-progress-base';
  const pegs=[];for(let i=0;i<19;i++){
   const peg=ball(-2.6+(i%10)*.57,.17+Math.floor(i/10)*.22,.79,.075,0x9aa89a);
   peg.name='schedule-progress';pegs.push(peg);
  }
  const buttonBase=box(-3.35,.165,1.05,.85,.33,.8,0x795844);buttonBase.name='schedule-button-base';
  const button=ball(-3.35,.435,1.05,.3,0xaa6a51);button.scale.y=.35;button.name='schedule-response';
  const trayBase=box(2.85,.1,1.05,1.25,.2,.75,0x795844);trayBase.name='schedule-tray-base';const tray=box(2.85,.24,1.05,1.05,.08,.56,0xd7c8a8);tray.name='schedule-reward-tray';
  for(const z of [.7,1.4])box(2.85,.3,z,1.23,.12,.07,0x795844);for(const x of [2.25,3.45])box(x,.3,1.05,.07,.12,.7,0x795844);
  const rewards=[];for(let i=0;i<6;i++){const reward=ball(2.5+(i%3)*.3,.37,.91+Math.floor(i/3)*.24,.09,0xc89452);reward.name='schedule-reward';rewards.push(reward)}
  sync=s=>{lamps.forEach((lamp,i)=>{const active=(s.mode==='FR')===(i===0);lamp.material.color.setHex(active?0xe8bc72:0x536259);lamp.material.emissive.setHex(active?0x8a4f14:0x000000);lamp.material.emissiveIntensity=active?.55:0});button.position.y=s.actions%2?.395:.435;pegs.forEach((peg,i)=>{const active=i<s.progress;peg.material.color.setHex(active?0xe5ba70:0x9aa89a);peg.material.emissive.setHex(active?0x8a4f14:0x000000);peg.material.emissiveIntensity=active?.45:0});rewards.forEach((reward,i)=>reward.visible=i<Math.min(s.rewards,6))};
 }else if(id==='stimulation'){
  // The animal is an illustration: the choice counters record the visitor's inputs, not animal behavior.
  const floor=box(0,-.04,0,7.6,.08,3.6,0xb8aa91);floor.name='stimulation-floor';
  box(0,1.12,-1.75,7.55,2.25,.12,0xd9d0bc);
  for(const x of [-3.8,3.8])for(const z of [-1.75,1.75])box(x,1.2,z,.13,2.4,.13,0x795844);
  for(const z of [-1.75,1.75])box(0,2.4,z,7.7,.12,.13,0x795844);
  for(const x of [-3.8,3.8])box(x,2.4,0,.13,.12,3.6,0x795844);
  for(let x=-3.3;x<=3.3;x+=.55)box(x,2.4,0,.035,.035,3.45,0x998d74);
  for(let z=-1.4;z<=1.4;z+=.35){const bar=box(0,2.4,z,7.45,.025,.025,0x998d74);bar.castShadow=false}
  const sideGlass=new THREE.MeshStandardMaterial({color:0xbfd0c7,transparent:true,opacity:.09,roughness:.25,side:THREE.DoubleSide,depthWrite:false});
  for(const x of [-3.73,3.73]){const pane=new THREE.Mesh(new THREE.PlaneGeometry(3.38,2.15),sideGlass);pane.position.set(x,1.22,0);pane.rotation.y=Math.PI/2;pane.name='stimulation-side-pane';root.add(pane)}
  const frontPane=new THREE.Mesh(new THREE.PlaneGeometry(7.36,2.14),new THREE.MeshStandardMaterial({color:0xc7d9d0,transparent:true,opacity:.045,roughness:.2,side:THREE.DoubleSide,depthWrite:false}));frontPane.position.set(0,1.22,1.745);frontPane.name='stimulation-front-pane';root.add(frontPane);
  const lowerRail=box(0,.07,1.75,7.45,.14,.12,0x795844);lowerRail.name='stimulation-front-rail';
  for(const x of [-3.8,3.8])for(const z of [-1.75,1.75])for(const y of [.15,2.32]){const fitting=box(x,y,z,.23,.22,.23,0xc59f65);fitting.name='stimulation-frame-fitting'}
  // Feeder and lever are two schematic alternatives, with cost and chosen-action counters.
  box(-2.35,.63,-1.45,1.5,1.05,.5,0x758d70);
  const hood=box(-2.35,1.2,-1.27,1.72,.13,.85,0xc59f65);hood.rotation.x=-.18;
  const feederShape=new THREE.Shape();feederShape.moveTo(-.58,0);feederShape.lineTo(-.58,.38);feederShape.absarc(0,.38,.58,Math.PI,0,true);feederShape.lineTo(.58,0);feederShape.closePath();const feederInset=attach(root,new THREE.ShapeGeometry(feederShape),0x4e6156,-2.35,.18,-1.19);feederInset.material.side=THREE.DoubleSide;feederInset.name='stimulation-feeder-inset';
  for(const side of [-1,1]){const jamb=box(-2.35+side*.6,.37,-1.16,.07,.4,.07,0xc59f65);jamb.name='stimulation-feeder-jamb'}const feederArch=attach(root,new THREE.TorusGeometry(.6,.035,7,28,Math.PI),0xc59f65,-2.35,.56,-1.16);feederArch.name='stimulation-feeder-arch';
  const bowlProfile=[[0,0],[.38,0],[.45,.04],[.52,.26],[.52,.36],[.46,.36],[.42,.3],[0,.3]].map(([r,y])=>new THREE.Vector2(r,y));const foodBowl=attach(root,new THREE.LatheGeometry(bowlProfile,28),0x9e704e,-2.35,0,-.95);foodBowl.name='stimulation-food-bowl';
  const pellets=[];for(let i=0;i<8;i++){const pellet=ball(-2.68+(i%4)*.21,.385,-1.05+Math.floor(i/4)*.2,.085,0xd2aa6d);pellet.name='stimulation-food-choice';pellets.push(pellet)}
  box(2.35,.8,-1.45,1.35,1.4,.5,0x81949a);
  box(2.35,.8,-1.16,.75,1.02,.08,0x576b68);
  const lever=new THREE.Group();lever.position.set(2.35,.58,-1.06);lever.name='stimulation-lever';root.add(lever);
  const stem=attach(lever,new THREE.CylinderGeometry(.055,.055,.65,10),0xb39264,0,.29,0);stem.rotation.z=.3;
  attach(lever,new THREE.SphereGeometry(.16,12,8),0xa96550,-.09,.59,0);
  const foodCost=[],stimCost=[],foodCount=[],stimCount=[],budget=[];
  for(const x of [-2.35,2.35])box(x,1.59,-1.71,1.46,.61,.08,0x53645a);
  for(const [x,array] of [[-2.35,foodCost],[2.35,stimCost]])for(let i=0;i<3;i++){const light=ball(x-.3+i*.3,1.78,-1.64,.09,0x87928a);light.name='stimulation-cost';array.push(light)}
  for(const [x,array,name] of [[-2.35,foodCount,'stimulation-food-counter'],[2.35,stimCount,'stimulation-stim-counter']])for(let i=0;i<12;i++){const mark=ball(x-.53+(i%6)*.21,1.48+Math.floor(i/6)*.17,-1.64,.055,0x899388);mark.name=name;array.push(mark)}
  // Place the visitor's budget display outside the animal chamber, making
  // the distinction between visitor choices and the animal illustration clear.
  const budgetBase=box(0,.065,2.2,3.55,.23,.5,0x795844);budgetBase.name='stimulation-budget-base';
  for(let i=0;i<12;i++){const token=ball(-1.55+i*.28,.27,2.2,.09,0xd3b978);token.name='stimulation-budget';budget.push(token)}
  // Empty preparation vessels sit outside the chamber as fixed equipment;
  // delivered food continues to be represented only by the controlled pellets.
  {const tray=new THREE.Group();tray.name='stimulation-preparation-tray';tray.position.set(2,-.05,2.85);root.add(tray);attach(tray,new THREE.BoxGeometry(1.25,.08,.76),0xcbbda4,0,.04,0);
   for(const z of [-.34,.34])attach(tray,new THREE.BoxGeometry(1.25,.12,.08),0xcbbda4,0,.14,z);for(const x of [-.585,.585])attach(tray,new THREE.BoxGeometry(.08,.12,.6),0xcbbda4,x,.14,0);
   const profile=[[0,0],[.14,0],[.21,.035],[.24,.14],[.21,.14],[.18,.07],[.12,.035],[0,.035]].map(([r,y])=>new THREE.Vector2(r,y));const bowl=attach(tray,new THREE.LatheGeometry(profile,24),0xa77553,-.28,.08,0);bowl.name='stimulation-preparation-bowl';
   const scoop=attach(tray,new THREE.LatheGeometry(profile.map(p=>p.clone().multiplyScalar(.56)),20),0xc59f65,.18,.08,0);scoop.name='stimulation-empty-scoop';const handle=attach(tray,new THREE.CylinderGeometry(.035,.035,.36,10),0xc59f65,.43,.15,0);handle.rotation.z=Math.PI/2;handle.name='stimulation-scoop-handle';
  }
  const rat=new THREE.Group();rat.name='stimulation-rat';rat.position.set(0,0,.15);rat.scale.setScalar(1.2);root.add(rat);
  // Raise the haunch and narrow the shoulder without separating the coat
  // from the body; all three surfaces use the same parametric silhouette.
  const ratBodyPoint=(u,v,w)=>new THREE.Vector3(-.2+.74*u,.43+.3575*v+.16*(1-u*u)*(.3-u),.385*w*(1-.16*u));
  const bodyGeometry=new THREE.SphereGeometry(1,64,48),bodyPositions=bodyGeometry.getAttribute('position'),bodyColors=[];
  const bellyColor=new THREE.Color(0xdfd6c5),coatColor=new THREE.Color(0xaaa397),bodyColor=new THREE.Color();
  for(let i=0;i<bodyPositions.count;i++){const u=bodyPositions.getX(i),v=bodyPositions.getY(i),w=bodyPositions.getZ(i),point=ratBodyPoint(u,v,w);bodyPositions.setXYZ(i,point.x,point.y,point.z);const dorsal=THREE.MathUtils.smoothstep(v,.05,.72)*(1-THREE.MathUtils.smoothstep(u,.25,.9));bodyColor.copy(bellyColor).lerp(coatColor,dorsal*.85);bodyColors.push(bodyColor.r,bodyColor.g,bodyColor.b)}
  bodyGeometry.setAttribute('color',new THREE.Float32BufferAttribute(bodyColors,3));bodyGeometry.computeVertexNormals();const body=attach(rat,bodyGeometry,0xffffff,0,0,0);body.material.vertexColors=true;body.name='stimulation-rat-body';
  // Taper the face toward the snout while retaining a broad skull at the ears.
  const headGeometry=new THREE.SphereGeometry(1,24,18),headPositions=headGeometry.getAttribute('position');
  for(let i=0;i<headPositions.count;i++){const u=headPositions.getX(i),v=headPositions.getY(i),w=headPositions.getZ(i),t=(u+1)/2;headPositions.setXYZ(i,.5+.36*u,.52+.24*v*(1-.18*t)+.03*u,.24*w*(1-.2*t))}
  headGeometry.computeVertexNormals();const head=attach(rat,headGeometry,0xdfd6c5,0,0,0);head.name='stimulation-rat-head';
  // Short, subtle strands follow the body's UVs, avoiding a dotted silhouette
  // and keeping the existing continuous coat colour and body shape.
  {const width=256,height=128,data=new Uint8Array(width*height*4);for(let i=0;i<width*height;i++){const shade=246+(i*17%7);data[i*4]=data[i*4+1]=data[i*4+2]=shade;data[i*4+3]=255}
   for(let i=0;i<3200;i++){const x=(i*73+Math.floor(i/17)*19)%width,y=(i*47+Math.floor(i/11)*13)%height,length=3+i%5;for(let j=0;j<length;j++){const px=(x+j)%width,py=(y+Math.floor(j*.25))%height,index=(py*width+px)*4,shade=230+(i%12);data[index]=data[index+1]=data[index+2]=Math.min(data[index],shade)}}
   const coat=new THREE.DataTexture(data,width,height);coat.colorSpace=THREE.SRGBColorSpace;coat.wrapS=coat.wrapT=THREE.RepeatWrapping;coat.magFilter=THREE.LinearFilter;coat.minFilter=THREE.LinearMipmapLinearFilter;coat.generateMipmaps=true;coat.needsUpdate=true;body.material.map=coat;body.material.needsUpdate=true;
  }
  const muzzle=attach(rat,new THREE.SphereGeometry(.18,14,10),0xe4dace,.74,.48,0);muzzle.scale.set(1,.55,.7);muzzle.name='stimulation-rat-muzzle';
  for(const side of [-1,1]){const ear=attach(rat,new THREE.SphereGeometry(.14,12,8),0xc99e96,.46,.75,side*.18);ear.scale.set(.65,1,.4);attach(rat,new THREE.SphereGeometry(.035,10,8),0x353b36,.68,.56,side*.18);for(const x of [-.55,.35]){const leg=attach(rat,new THREE.SphereGeometry(1,10,8),0xc8c0af,x-.035,.22,side*.24);leg.scale.set(x<0?.15:.105,.20,.10);leg.rotation.z=x<0?-.35:.2;leg.name='stimulation-rat-leg';const foot=attach(rat,new THREE.SphereGeometry(.11,10,8),0xb88d86,x,.0495,side*.25);foot.name='stimulation-rat-foot';foot.scale.set(1.3,.45,.7)}}
  for(const side of [-1,1]){const inner=attach(rat,new THREE.SphereGeometry(.085,10,8),0xe0b3a9,.46,.75,side*.226);inner.scale.set(.7,.95,.18);const glint=attach(rat,new THREE.SphereGeometry(.012,8,6),0xf1e9d9,.69,.572,side*.205);glint.name='stimulation-eye-glint';for(const x of [-.55,.35])for(let toe=-1;toe<=1;toe++){const digit=attach(rat,new THREE.SphereGeometry(.035,8,6),0xc59890,x+.09,.01225,side*.25+toe*.045);digit.name='stimulation-rat-toe';digit.scale.set(1.3,.35,.55)}}
  attach(rat,new THREE.SphereGeometry(.065,10,8),0xba8581,.83,.47,0);
  for(const side of [-1,1])for(let i=0;i<3;i++){const from=new THREE.Vector3(.74,.48,side*.1),to=new THREE.Vector3(1.04,.48+(i-1)*.08,side*(.25+i*.04)),delta=to.clone().sub(from),whisker=attach(rat,new THREE.CylinderGeometry(.006,.006,delta.length(),5),0xb5a99a,0,0,0);whisker.position.copy(from.add(to).multiplyScalar(.5));whisker.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize())}
  const tailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.86,.34,0),new THREE.Vector3(-1.3,.18,.1),new THREE.Vector3(-1.65,.13,.45),new THREE.Vector3(-1.85,.12,.8)]);
  const tail=attach(rat,new THREE.TubeGeometry(tailCurve,24,.035,8,false),0xb88d86,0,0,0);tail.name='stimulation-rat-tail';
  sync=s=>{foodCost.forEach((m,i)=>m.material.color.setHex(i<(s.condition?1:3)?0xe5ba70:0x87928a));stimCost.forEach((m,i)=>m.material.color.setHex(i<(s.condition?3:1)?0xe5ba70:0x87928a));foodCount.forEach((m,i)=>m.material.color.setHex(i<s.food?0xe5ba70:0x899388));stimCount.forEach((m,i)=>m.material.color.setHex(i<s.stimulation?0xe5ba70:0x899388));pellets.forEach((m,i)=>m.visible=i<Math.min(s.food,8));budget.forEach((m,i)=>m.visible=i<s.budget);lever.rotation.z=(s.stimulation%2)*-.2};
 }else if(id==='twins'){
  const ground=attach(root,new THREE.CylinderGeometry(4.52,4.52,.08,64),0x8c9c83,0,-.04,0);ground.name='twin-common-ground';
  // Paired paths lead to the homes while leaving the synthetic-population display clear.
  {const shape=new THREE.Shape();shape.moveTo(-.25,-.16);shape.lineTo(-.16,-.22);shape.lineTo(.17,-.21);shape.lineTo(.26,-.12);shape.lineTo(.24,.16);shape.lineTo(.13,.21);shape.lineTo(-.19,.2);shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelThickness:.008,bevelSize:.012,bevelSegments:1});for(const side of [-1,1])for(let i=0;i<3;i++){const x=side*(2.9-i*.3),z=2.15+i*.52;const slab=attach(root,geometry,0xc3b9a2,x,0,z);slab.rotation.set(-Math.PI/2,0,side*(.1+i*.07));slab.name='twin-approach-stone'}}
  for(const [x,z] of [[-3.55,1.45],[-2.95,2.95],[-1.3,3.55],[1.3,3.55],[2.95,2.95],[3.55,1.45]]){const plant=new THREE.Group();plant.position.set(x,0,z);plant.name='twin-common-plant';root.add(plant);for(let i=0;i<5;i++){const a=i*Math.PI*2/5,leaf=attach(plant,new THREE.SphereGeometry(.14,8,6),i%2?0x789268:0x69845f,Math.cos(a)*.1,.1,Math.sin(a)*.1);leaf.scale.set(.6,.5,1.2);leaf.rotation.y=-a}const flower=attach(plant,new THREE.SphereGeometry(.05,8,6),0xe4d7b4,0,.22,0);flower.name='twin-common-flower';
   for(let i=0;i<9;i++){const a=i*2.399963,r=.08+(i%3)*.06,leaf=attach(plant,new THREE.SphereGeometry(.12,8,6),i%2?0x7f986e:0x68835e,Math.cos(a)*r,.11+(i%2)*.035,Math.sin(a)*r);leaf.scale.set(.5,1.1,.28);leaf.rotation.set(.3*Math.sin(a),a,.5*Math.cos(a));leaf.name='twin-common-leaf'}
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3,stem=attach(plant,new THREE.CylinderGeometry(.012,.014,.18,6),0x68835e,Math.cos(a)*.1,.16,Math.sin(a)*.1);stem.name='twin-common-flower-stem';const bloom=attach(plant,new THREE.SphereGeometry(.04,8,6),0xe4d7b4,Math.cos(a)*.1,.26,Math.sin(a)*.1);bloom.name='twin-common-flower'}
  }
  // Low foreground planting frames both environments while leaving the
  // stepping stones and the population display visible and unobstructed.
  {const positions=[],indices=[];for(const [i,a] of [0,Math.PI/2].entries()){const n=i*3,dx=Math.cos(a),dz=Math.sin(a);positions.push(-.055*dx,0,-.055*dz,.055*dx,0,.055*dz,.035*dx,.17,.035*dz);indices.push(n,n+1,n+2)}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const leafMaterial=mat(0x6e8b65);leafMaterial.side=THREE.DoubleSide;
   const centers=[[-4.05,.6],[-3.9,1.95],[-3.35,2.6],[-2.25,3.45],[-1.8,3.88],[-.65,4.03],[0,4.15],[.65,4.03],[1.8,3.88],[2.25,3.45],[3.35,2.6],[3.9,1.95],[4.05,.6]],tufts=new THREE.InstancedMesh(geometry,leafMaterial,centers.length*4),dummy=new THREE.Object3D();tufts.name='twin-foreground-grass';centers.forEach(([x,z],cluster)=>{for(let i=0;i<4;i++){const a=i*2.399963+cluster*.6,r=.06+.16*Math.sqrt(i/3);dummy.position.set(x+Math.cos(a)*r,.002,z+Math.sin(a)*r);dummy.rotation.set(.12*Math.sin(a),a,.1*Math.cos(a));dummy.scale.setScalar(.7+.35*((i+cluster)%4)/3);dummy.updateMatrix();tufts.setMatrixAt(cluster*4+i,dummy.matrix)}});tufts.computeBoundingSphere();tufts.castShadow=false;root.add(tufts);
   const rockGeometry=new THREE.DodecahedronGeometry(1,0);for(const [x,z,s] of [[-3.9,.85,.23],[-3.65,2.25,.22],[-2.05,3.72,.24],[-.92,4,.19],[.92,4,.19],[2.05,3.72,.24],[3.65,2.25,.22],[3.9,.85,.23]]){const rock=attach(root,rockGeometry,0xaaa995,x,s*.35,z);rock.scale.set(s,s*.55,s*.8);rock.rotation.y=x*.7;rock.name='twin-foreground-rock'}
  }
  function house(x,urban){const group=new THREE.Group();group.position.set(x,0,-1.05);root.add(group);group.name=urban?'twin-urban-home':'twin-garden-home';
   const foundation=attach(group,new THREE.BoxGeometry(2.5,.05,1.05),0xb3a58c,0,.025,0);foundation.name='twin-home-foundation';
   const height=urban?2.05:1.5;attach(group,new THREE.BoxGeometry(2.3,height,.8),urban?0xb9795f:0xd9cdb6,0,.05+height/2,0);
   // Shallow joints on the facade distinguish brick from the cottage's larger stone courses.
   {const vertices=[],course=urban?.16:.25,block=urban?.3:.46,rows=Math.floor(height/course);for(let row=1;row<rows;row++){const y=.05+row*course;vertices.push(-1.14,y,.407,1.14,y,.407)}for(let row=0;row<rows;row++){const bottom=.05+row*course,top=Math.min(.05+height,bottom+course),offset=row%2?block/2:0;for(let px=-1.14+offset+block;px<1.14;px+=block)vertices.push(px,bottom,.407,px,top,.407)}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const joints=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:urban?0x9e6b56:0xb9ad98}));joints.name=urban?'twin-urban-masonry':'twin-garden-masonry';group.add(joints)}
   if(urban){attach(group,new THREE.BoxGeometry(2.45,.18,.94),0x795844,0,2.19,0);attach(group,new THREE.BoxGeometry(1.3,.1,.34),0x795844,0,1.1,.55);
    // A low paved forecourt belongs to the urban setting and disappears with
    // it. The shared pair and synthetic-population markers remain unchanged.
    const plaza=attach(group,new THREE.BoxGeometry(2.9,.012,1.95),0xaaa493,0,.006,1.62);plaza.name='twin-urban-forecourt';
    {const joints=[];for(let z=.67;z<=2.58;z+=.38)joints.push(-1.43,.013,z,1.43,.013,z);for(let row=0;row<5;row++)for(let x=-1.3+(row%2)*.24;x<1.4;x+=.48)joints.push(x,.013,.67+row*.38,x,.013,Math.min(2.595,1.05+row*.38));const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(joints,3));const lines=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0x8e897b}));lines.name='twin-urban-forecourt-joints';group.add(lines)}
    // Upper-storey openings make the urban setting distinct from the garden cottage.
    for(const dx of [-.72,0,.72]){const pane=attach(group,new THREE.BoxGeometry(.32,.4,.035),0x7898a0,dx,1.78,.418);pane.name='twin-urban-upper-window';attach(group,new THREE.BoxGeometry(.035,.42,.045),0xe6dcc7,dx,1.78,.445);attach(group,new THREE.BoxGeometry(.36,.04,.05),0xe6dcc7,dx,1.57,.445);attach(group,new THREE.BoxGeometry(.36,.04,.05),0xe6dcc7,dx,1.99,.445)}
    for(const dx of [-.58,-.29,0,.29,.58])attach(group,new THREE.BoxGeometry(.04,.38,.04),0x795844,dx,1.34,.71);attach(group,new THREE.BoxGeometry(1.25,.05,.05),0x795844,0,1.52,.71);
    for(const dx of [-.92,.92])for(const y of [.25,.55,.85,1.25])attach(group,new THREE.BoxGeometry(.35,.025,.025),0xd5b7a0,dx,y,.41);
    const awning=attach(group,new THREE.BoxGeometry(.7,.08,.38),0xd9c7a9,.72,.75,.62);awning.rotation.x=-.18;awning.name='twin-urban-awning';
    for(let i=0;i<4;i++){const stripe=attach(awning,new THREE.BoxGeometry(.09,.012,.36),0xb9795f,-.27+i*.18,.046,0);stripe.name='twin-urban-awning-stripe'}
    for(const dx of [-.36,.36]){const planter=attach(group,new THREE.BoxGeometry(.32,.16,.18),0x9e704e,dx,1.23,.6);planter.name='twin-urban-planter';for(let i=0;i<3;i++){const leaf=attach(group,new THREE.SphereGeometry(.09,10,8),0x75906a,dx+(i-1)*.09,1.36,.6);leaf.scale.set(.7,1.15,.65)}}
    // Paved edges and a street lantern belong only to the urban environment.
    const pavingGeometry=new THREE.BoxGeometry(.3,.025,.3);for(const dx of [-.9,.9])for(const z of [1.08,1.4,1.72]){const slab=attach(group,pavingGeometry,0xc8bea9,dx,.1375,z);slab.name='twin-urban-paving'}
    const lantern=new THREE.Group();lantern.name='twin-urban-lantern';lantern.position.set(1.13,.125,1.25);group.add(lantern);
    attach(lantern,new THREE.CylinderGeometry(.075,.11,.12,10),0x46544a,0,.06,0);attach(lantern,new THREE.CylinderGeometry(.035,.055,1.05,10),0x46544a,0,.64,0);
    attach(lantern,new THREE.BoxGeometry(.18,.26,.18),0xd8bc7f,0,1.29,0);for(const dx of [-.1,.1])for(const dz of [-.1,.1])attach(lantern,new THREE.BoxGeometry(.025,.3,.025),0x46544a,dx,1.29,dz);attach(lantern,new THREE.ConeGeometry(.19,.16,4),0x46544a,0,1.52,0).rotation.y=Math.PI/4;
   }else{const roofShape=new THREE.Shape();roofShape.moveTo(-1.23,-.375);roofShape.lineTo(0,.375);roofShape.lineTo(1.23,-.375);roofShape.closePath();const roofGeometry=new THREE.ExtrudeGeometry(roofShape,{depth:1.08,bevelEnabled:false});roofGeometry.translate(0,0,-.54);const roof=attach(group,roofGeometry,0x657a68,0,1.94,0);roof.name='twin-garden-roof';
    // The gable face sits beneath the roof edge, with a small attic window
    // and timber verge boards; all follow their own cottage on state changes.
    {const shape=new THREE.Shape();shape.moveTo(-1.12,-.34);shape.lineTo(0,.335);shape.lineTo(1.12,-.34);shape.closePath();const gable=attach(roof,new THREE.ShapeGeometry(shape),0xd9cdb6,0,0,.546);gable.material.side=THREE.DoubleSide;gable.receiveShadow=false;gable.name='twin-cottage-gable';
     const pane=attach(roof,new THREE.BoxGeometry(.24,.28,.025),0x7898a0,0,-.10,.568);pane.name='twin-attic-window';for(const dx of [-.14,.14])attach(roof,new THREE.BoxGeometry(.028,.32,.04),0x795844,dx,-.10,.585);for(const y of [-.25,.05])attach(roof,new THREE.BoxGeometry(.31,.03,.04),0x795844,0,y,.585);attach(roof,new THREE.BoxGeometry(.025,.28,.04),0xe6dcc7,0,-.10,.59);
     for(const side of [-1,1]){const start=new THREE.Vector3(0,.375,.58),end=new THREE.Vector3(side*1.23,-.375,.58),delta=end.clone().sub(start),rafter=attach(roof,new THREE.CylinderGeometry(.045,.045,delta.length(),8),0x795844,0,0,0);rafter.position.copy(start).add(end).multiplyScalar(.5);rafter.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());rafter.name='twin-cottage-verge'}
    }
    // Small slate tiles sit just above the roof planes, with subtle tonal variation.
    const tileGeometry=new THREE.BoxGeometry(.235,.025,.16),tileMaterials=[roof.material,mat(0x708572),mat(0x5d7363)];for(const side of [-1,1])for(let row=0;row<5;row++)for(let col=0;col<6;col++){const offset=.13+row*.245,z=-.45+col*.18,tile=new THREE.Mesh(tileGeometry,tileMaterials[(row*3+col+(side>0?1:0))%3]);tile.position.set(side*offset,.375-offset*.75/1.23+.024,z);tile.rotation.z=-side*Math.atan(.75/1.23);tile.name='twin-garden-roof-tile';tile.castShadow=false;tile.receiveShadow=false;roof.add(tile)}
    attach(group,new THREE.BoxGeometry(.26,.65,.25),0xb3a58c,-.66,2.08,-.08);attach(group,new THREE.BoxGeometry(.34,.08,.33),0xd7c8aa,-.66,2.43,-.08);
    for(const dx of [-.85,.85])attach(group,new THREE.BoxGeometry(.08,.63,.08),0x795844,dx,.4,.75);
    const porch=attach(group,new THREE.BoxGeometry(1.9,.1,.55),0x657a68,0,.75,.68);porch.rotation.x=-.12;porch.name='twin-garden-porch';
    for(const dx of [-.91,.91]){attach(group,new THREE.BoxGeometry(.38,.17,.25),0x9e704e,dx,.12,.58);for(let i=0;i<3;i++){const shrub=attach(group,new THREE.SphereGeometry(.1,10,8),0x75906a,dx+(i-1)*.11,.24,.58);shrub.scale.y=.8}}
    // Raised beds at the edges of the path stay with each cottage.
    for(const dx of [-.92,.92]){const bed=new THREE.Group();bed.name='twin-garden-bed';bed.position.set(dx,.125,1.45);group.add(bed);attach(bed,new THREE.BoxGeometry(.56,.12,.72),0x805c43,0,.06,0);attach(bed,new THREE.BoxGeometry(.5,.025,.66),0x665441,0,.135,0);
     for(let row=0;row<2;row++)for(let col=0;col<3;col++){const px=(row-.5)*.21,pz=(col-1)*.21,stem=attach(bed,new THREE.CylinderGeometry(.012,.016,.16,6),0x68805b,px,.215,pz),leaf=attach(bed,new THREE.SphereGeometry(.075,8,6),0x79936b,px,.29,pz);stem.name='twin-garden-stem';leaf.scale.set(1.1,.65,1);if((row+col)%2===0){const flower=attach(bed,new THREE.SphereGeometry(.035,8,6),0xe6d7b8,px,.345,pz);flower.name='twin-garden-flower'}}}
   }
   attach(group,new THREE.BoxGeometry(.45,.87,.08),0x795844,0,.45,.44);attach(group,new THREE.SphereGeometry(.035,8,6),0xc69e67,.14,.46,.5);
   // Recessed door panels and a threshold give both entrances a readable scale.
   for(const y of [.25,.62]){const panel=attach(group,new THREE.BoxGeometry(.29,.23,.012),urban?0x684b3d:0x654b3d,0,y,.487);panel.name='twin-door-panel'}
   const threshold=attach(group,new THREE.BoxGeometry(.62,.06,.22),0xc4b69d,0,.045,.53);threshold.name='twin-door-threshold';
   // The cottage shutters and the town-house pilasters remain attached to their own environment.
   if(!urban){for(const dx of [-.72,.72])for(const side of [-1,1]){const shutter=attach(group,new THREE.BoxGeometry(.16,.51,.035),0x718671,dx+side*.31,1.05,.45);shutter.name='twin-cottage-shutter';for(const y of [.86,1.04,1.22]){const rail=attach(group,new THREE.BoxGeometry(.15,.025,.02),0x526b59,dx+side*.31,y,.477);rail.name='twin-shutter-rail'}}}
   else {for(const dx of [-1.08,1.08]){const pier=attach(group,new THREE.BoxGeometry(.13,2.04,.08),0xc89a7e,dx,1.07,.44);pier.name='twin-urban-pilaster';for(const y of [.18,1.42,2.04]){const cap=attach(group,new THREE.BoxGeometry(.19,.07,.12),0xd1aa8c,dx,y,.46);cap.name='twin-urban-pilaster-cap'}}}
   for(const dx of [-.72,.72]){attach(group,new THREE.BoxGeometry(.42,.48,.08),0x7898a0,dx,1.05,.44);attach(group,new THREE.BoxGeometry(.04,.5,.09),0xe6dcc7,dx,1.05,.49);attach(group,new THREE.BoxGeometry(.44,.04,.09),0xe6dcc7,dx,1.05,.49);const sill=attach(group,new THREE.BoxGeometry(.52,.07,.17),0xc4b69d,dx,.78,.49);sill.name='twin-window-sill';const lintel=attach(group,new THREE.BoxGeometry(.52,.07,.13),0xc4b69d,dx,1.32,.48);lintel.name='twin-window-lintel'}return group}
  house(-2.25,false);const similar=house(2.25,false),different=house(2.25,true);
  for(const x of [-2.25,2.25]){
   box(x,.06,.55,2.7,.13,1.7,0xb9b39c);
   // The two figures are one illustrative pair, seated in their respective homes.
   const person=new THREE.Group();person.name='twin-person';person.position.set(x,.125,.55);person.scale.setScalar(1.25);root.add(person);
   const skin=0xc18d6c,shirt=0x6e8c83,trousers=0xd0c3a9,hair=0x51463c;
   function seatedLimb(a,b,r,color,name){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),segment=attach(person,new THREE.CylinderGeometry(r*.9,r,delta.length(),10),color,0,0,0);segment.position.copy(start).add(end).multiplyScalar(.5);segment.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());segment.name=name;return segment}
   const torso=attach(person,new THREE.CylinderGeometry(.18,.24,.43,16),shirt,0,.57,0);torso.name='twin-seated-torso';torso.rotation.x=-.1;
   attach(person,new THREE.CylinderGeometry(.08,.09,.13,12),skin,0,.84,0);const head=attach(person,new THREE.SphereGeometry(.2,16,12),skin,0,1.04,0);head.scale.set(.9,1.1,.9);
   const cap=attach(person,new THREE.SphereGeometry(.205,16,10),hair,0,1.15,-.02);cap.scale.set(.94,.58,.93);
   // Matching curls and facial features keep the two people recognizably
   // related while preserving the same pose in each environment.
   for(let i=0;i<7;i++){const a=Math.PI*.12+i*Math.PI*.76/6,curl=attach(person,new THREE.SphereGeometry(.052,10,8),hair,Math.cos(a)*.145,1.18+Math.sin(a)*.025,.11);curl.scale.set(.8,.8,.7);curl.name='twin-hair-curl'}
   const nose=attach(person,new THREE.SphereGeometry(.025,8,6),skin,0,1.015,.183);nose.scale.set(.8,1,.7);nose.name='twin-nose';
   const mouth=attach(person,new THREE.TorusGeometry(.035,.005,5,12,Math.PI),0x8e5d4d,0,.98,.177);mouth.rotation.z=Math.PI;mouth.name='twin-mouth';
   for(const side of [-1,1]){const eye=attach(person,new THREE.SphereGeometry(.018,8,6),0x34413a,side*.065,1.055,.17);eye.scale.z=.55;const ear=attach(person,new THREE.SphereGeometry(.04,8,6),skin,side*.18,1.04,0);ear.scale.set(.6,1,.7);
    const brow=attach(person,new THREE.BoxGeometry(.06,.009,.01),hair,side*.065,1.09,.169);brow.rotation.z=-side*.12;brow.name='twin-eyebrow';
    const shoulder=[side*.18,.73,0],elbow=[side*.28,.48,.08],wrist=[side*.11,.35,.23];seatedLimb(shoulder,elbow,.065,shirt,'twin-upper-arm');seatedLimb(elbow,wrist,.048,skin,'twin-forearm');const hand=attach(person,new THREE.SphereGeometry(.058,10,8),skin,...wrist);hand.name='twin-hand';hand.scale.set(1,.65,1);
    const hip=[side*.1,.25,0],knee=[side*.29,.15,.17],ankle=[-side*.1,.09,.32];seatedLimb(hip,knee,.1,trousers,'twin-thigh');seatedLimb(knee,ankle,.075,trousers,'twin-shin');const shoe=attach(person,new THREE.BoxGeometry(.16,.09,.21),0x795844,-side*.1,.045,.34);shoe.name='twin-shoe';shoe.rotation.y=side*.16;
   }
   const collar=attach(person,new THREE.TorusGeometry(.12,.018,6,20),0xe3d7bf,0,.79,0);collar.rotation.x=Math.PI/2;
   for(let i=0;i<3;i++)box(x-.8+i*.8,.1,1.45,.48,.09,.38,0xd1c6ad);
  }
  // Eight paired markers represent the invented population; color marks the invented count.
  const pairBase=box(0,.1325,2.02,3.75,.265,.72,0x795844);pairBase.name='twin-population-base';const pairs=[];
  const markerShape=new THREE.Shape();markerShape.moveTo(-.065,0);markerShape.lineTo(-.065,.075);markerShape.quadraticCurveTo(-.065,.115,-.035,.13);markerShape.quadraticCurveTo(-.052,.15,-.05,.175);markerShape.absarc(0,.175,.05,Math.PI,0,true);markerShape.quadraticCurveTo(.052,.15,.035,.13);markerShape.quadraticCurveTo(.065,.115,.065,.075);markerShape.lineTo(.065,0);markerShape.closePath();const markerGeometry=new THREE.ExtrudeGeometry(markerShape,{depth:.045,bevelEnabled:false});
  for(let i=0;i<8;i++){const group=[];for(const dx of [-.075,.075]){const mark=attach(root,markerGeometry,0x94a496,-1.55+i*.44+dx,.265,1.9975);mark.name='twin-pair-marker';group.push(mark)}pairs.push(group)}
  // A stone arch connects the two environments without suggesting a fixed
  // numerical split between heredity and environment.
  {const shape=new THREE.Shape(),outer=1.02,inner=.84,spring=1.7;
   shape.moveTo(-outer,0);shape.lineTo(-outer,spring);
   for(let i=0;i<=32;i++){const a=Math.PI-i*Math.PI/32;shape.lineTo(outer*Math.cos(a),spring+outer*Math.sin(a))}
   shape.lineTo(outer,0);shape.lineTo(inner,0);shape.lineTo(inner,spring);
   for(let i=0;i<=32;i++){const a=i*Math.PI/32;shape.lineTo(inner*Math.cos(a),spring+inner*Math.sin(a))}
   shape.lineTo(-inner,0);shape.closePath();
   const arch=attach(root,new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:1}),0xc5b9a0,0,.02,-1.02);arch.name='twin-environment-arch';
   for(const side of [-1,1]){const foot=attach(root,new THREE.BoxGeometry(.29,.11,.29),0xb4a68c,side*.93,.055,-.94);foot.name='twin-arch-foot'}
  }
  // A shared distant landscape sits inside the arch, behind both changing
  // home settings and the comparison indicators.
  {const backdrop=new THREE.Group();backdrop.name='twin-shared-landscape';backdrop.position.set(0,.1,-1.3);root.add(backdrop);
   const skyShape=new THREE.Shape();skyShape.moveTo(-.79,0);skyShape.lineTo(-.79,1.62);skyShape.absarc(0,1.62,.79,Math.PI,0,true);skyShape.lineTo(.79,0);skyShape.closePath();const sky=attach(backdrop,new THREE.ShapeGeometry(skyShape,24),0xd5d6bd,0,0,0);sky.name='twin-landscape-sky';sky.material.side=THREE.DoubleSide;sky.castShadow=false;
   for(const [height,color,z,phase] of [[1.05,0xa3b59f,.012,0],[.7,0x899f82,.024,.35],[.4,0x738e73,.036,-.25]]){const hill=new THREE.Shape();hill.moveTo(-.79,0);hill.lineTo(-.79,height*.52);hill.lineTo(-.48,height*.86);hill.lineTo(-.18,height*(.55+phase*.2));hill.lineTo(.16,height);hill.lineTo(.48,height*.58);hill.lineTo(.79,height*.76);hill.lineTo(.79,0);hill.closePath();const layer=attach(backdrop,new THREE.ShapeGeometry(hill),color,0,0,z);layer.material.side=THREE.DoubleSide;layer.castShadow=false;layer.name='twin-landscape-hill'}
  }
  // A neutral balance emblem crowns the arch: it frames comparison without
  // asserting a numerical contribution for either influence.
  {const medallion=new THREE.Group();medallion.name='twin-balance-medallion';medallion.position.set(0,2.75,-.78);root.add(medallion);
   const backing=attach(medallion,new THREE.CylinderGeometry(.34,.34,.07,32),0xd4c6a9,0,0,0);backing.rotation.x=Math.PI/2;
   const rim=attach(medallion,new THREE.TorusGeometry(.302,.015,6,32),0xb49f7d,0,0,.042);rim.name='twin-balance-rim';
   const symbolMaterial=new THREE.LineBasicMaterial({color:0x806849}),v=[];const segment=(x1,y1,x2,y2)=>v.push(x1,y1,.044,x2,y2,.044);
   segment(0,-.2,0,.2);segment(-.09,-.2,.09,-.2);segment(-.23,.1,.23,.1);for(const side of [-1,1]){segment(side*.19,.1,side*.25,-.07);segment(side*.19,.1,side*.13,-.07);segment(side*.25,-.07,side*.22,-.11);segment(side*.22,-.11,side*.16,-.11);segment(side*.16,-.11,side*.13,-.07)}
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(v,3));const symbol=new THREE.LineSegments(geometry,symbolMaterial);symbol.name='twin-balance-symbol';medallion.add(symbol);
  }
  box(0,1.06,-.68,.13,2.12,.13,0x795844);
  for(const x of [-3.65,3.65]){const tree=new THREE.Group();tree.name='twin-surrounding-tree';tree.position.set(x,0,-1.65);root.add(tree);attach(tree,new THREE.CylinderGeometry(.07,.14,1.3,10),0x795844,0,.65,0);const tips=[[-.36,1.65,0],[.32,1.72,0],[0,2.05,-.06],[.08,1.75,.27]];for(const tip of tips){const from=new THREE.Vector3(0,.95,0),to=new THREE.Vector3(...tip),d=to.clone().sub(from),branch=attach(tree,new THREE.CylinderGeometry(.035,.06,d.length(),8),0x795844,0,0,0);branch.position.copy(from).add(to).multiplyScalar(.5);branch.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize())}const leaves=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),mat(0x708a6c),80),dummy=new THREE.Object3D();leaves.name='twin-tree-leaves';for(let i=0;i<80;i++){const tip=tips[i%tips.length],a=i*2.399963,r=.08+.25*Math.sqrt(((i*17)%79)/78);dummy.position.set(tip[0]+Math.cos(a)*r,tip[1]+Math.sin(a)*r*.7,tip[2]+.16*Math.sin(i*1.3));dummy.rotation.set(.25*Math.sin(i),a,.35*Math.cos(i));dummy.scale.set(.12,.065,.05);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)}leaves.computeBoundingSphere();tree.add(leaves)}
  const example=ball(0,1.95,-.55,.22,0xd2ae77);example.name='twin-example-indicator';example.scale.z=.25;
  const type=ball(0,1.46,-.55,.16,0x7898a0);type.name='twin-type-indicator';type.scale.z=.25;
  sync=s=>{similar.visible=!s.environment;different.visible=!!s.environment;pairs.forEach((pair,i)=>pair.forEach(mark=>mark.material.color.setHex(i<syntheticTwinCount(s)?0xe1bb77:0x94a496)));example.material.color.setHex([0xd2ae77,0x7898a0,0xa56e54][s.similarity]);type.material.color.setHex(s.zygosity?0xa56e54:0x7898a0)};
 }else if(id==='argument-frames'){
  const ground=attach(root,new THREE.CylinderGeometry(4.52,4.52,.08,64),0xa7ad96,0,-.04,0);ground.name='argument-courtyard-ground';
  // The approach and planted edges remain shared by both interpretive frames.
  {const shape=new THREE.Shape();shape.moveTo(-.32,-.21);shape.lineTo(-.2,-.27);shape.lineTo(.22,-.26);shape.lineTo(.35,-.12);shape.lineTo(.31,.19);shape.lineTo(.18,.27);shape.lineTo(-.26,.24);shape.lineTo(-.35,.1);shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelThickness:.008,bevelSize:.012,bevelSegments:1});for(const [x,z,a] of [[0,2.05,.04],[.24,2.65,-.08],[.05,3.25,.1],[-.24,3.82,-.07]]){const slab=attach(root,geometry,0xc5b9a1,x,0,z);slab.rotation.set(-Math.PI/2,0,a);slab.name='argument-approach-stone'}}
  for(const [x,z] of [[-2.5,2.4],[-1.55,2.8],[1.45,2.8],[2.55,2.35]]){const cluster=new THREE.Group();cluster.name='argument-courtyard-plant';cluster.position.set(x,0,z);root.add(cluster);for(let i=0;i<5;i++){const a=i*Math.PI*2/5,leaf=attach(cluster,new THREE.SphereGeometry(.15,8,6),i%2?0x819b70:0x6d8967,Math.cos(a)*.12,.11,Math.sin(a)*.12);leaf.scale.set(.6,.45,1.2);leaf.rotation.y=-a}const stem=attach(cluster,new THREE.CylinderGeometry(.015,.02,.25,6),0x6d8967,0,.125,0);stem.name='argument-flower-stem';for(let i=0;i<5;i++){const a=i*Math.PI*2/5,petal=attach(cluster,new THREE.SphereGeometry(.055,8,6),0xe6d9b8,Math.cos(a)*.05,.27,Math.sin(a)*.05);petal.scale.set(.8,.25,1.2);petal.rotation.y=-a}attach(cluster,new THREE.SphereGeometry(.035,8,6),0xc49a63,0,.28,0)}
  // A background tree gives depth behind the shared arch without entering the stage.
  {const tree=new THREE.Group();tree.name='argument-background-tree';tree.position.set(0,0,-3.15);root.add(tree);attach(tree,new THREE.CylinderGeometry(.08,.14,1.55,9),0x795844,0,.775,0);
   const tips=[[-.7,1.85,0],[-.4,2.3,-.08],[0,2.5,0],[.42,2.25,.06],[.72,1.9,0]];for(const tip of tips){const start=new THREE.Vector3(0,1.05,0),end=new THREE.Vector3(...tip),delta=end.clone().sub(start),branch=attach(tree,new THREE.CylinderGeometry(.025,.05,delta.length(),7),0x795844);branch.position.copy(start).add(end).multiplyScalar(.5);branch.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize())}
   const leaves=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),mat(0x778e6a),120),dummy=new THREE.Object3D();leaves.name='argument-tree-leaves';for(let i=0;i<120;i++){const tip=tips[i%tips.length],a=i*2.399963,r=.06+.22*Math.sqrt(((i*17)%59)/58);dummy.position.set(tip[0]+Math.cos(a)*r,tip[1]+Math.sin(a)*r*.7,tip[2]+.15*Math.sin(i*1.3));dummy.rotation.set(.25*Math.sin(i),a,.35*Math.cos(i));dummy.scale.set(.11,.06,.045);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)}leaves.computeBoundingSphere();tree.add(leaves)
  }
  // Low stonework behind the two speakers gives the shared courtyard depth;
  // it belongs to both frames and leaves the central tree and furniture clear.
  {const wall=new THREE.Group();wall.name='argument-courtyard-wall';root.add(wall);const geometry=new THREE.BoxGeometry(.51,.245,.3),materials=[mat(0xb7ab94),mat(0xc6b9a0),mat(0xbfb19a)];for(const side of [-1,1])for(let row=0;row<2;row++)for(let i=0;i<5;i++){const block=new THREE.Mesh(geometry,materials[(i+row+(side>0?1:0))%3]);block.position.set(side*(.48+i*.54),.1225+row*.245,-2.1);block.name='argument-wall-stone';wall.add(block)}}
  // Shrubs rise behind the low wall to give the courtyard a planted edge.
  // They are common scenery and remain outside both tabletop illustrations.
  {const twigGeometry=new THREE.CylinderGeometry(.012,.02,.55,7),twigMaterial=mat(0x777353),leafGeometry=new THREE.SphereGeometry(1,8,6),leafMaterials=[mat(0x6f8864),mat(0x8b9b71),mat(0x778d68)];for(const [x,z,size] of [[-2.8,-2.48,1.1],[-1.15,-2.55,1],[1.2,-2.55,1],[2.78,-2.48,1.1]]){const shrub=new THREE.Group();shrub.name='argument-wall-shrub';shrub.position.set(x,0,z);root.add(shrub);for(let i=0;i<9;i++){const a=i*2.399963,r=.06+.21*Math.sqrt((i+.5)/9),height=.43+(i%4)*.08,branch=new THREE.Mesh(twigGeometry,twigMaterial);branch.position.set(Math.cos(a)*r*.5,height/2,Math.sin(a)*r*.5);branch.scale.y=height/.55;branch.rotation.z=-Math.cos(a)*.24;branch.rotation.x=Math.sin(a)*.24;shrub.add(branch);for(let j=0;j<3;j++){const b=a+j*2.094,p=.06+j*.045,leaf=new THREE.Mesh(leafGeometry,leafMaterials[(i+j)%3]);leaf.position.set(Math.cos(a)*r+Math.cos(b)*p,height+Math.sin(b)*.06,Math.sin(a)*r+Math.sin(b)*p);leaf.scale.set(.11,.06,.045);leaf.rotation.set(.3*Math.sin(b),b,.35*Math.cos(b));leaf.name='argument-wall-shrub-leaf';shrub.add(leaf)}}shrub.scale.setScalar(size)} }
  // A shared stage presents one frame at a time, with the same two participants.
  for(const x of [-3.5,0,3.5]){
   const base=attach(root,new THREE.CylinderGeometry(.32,.34,.16,16),0xc3b59b,x,.08,-1.55);base.name='argument-column-base';
   for(let i=0;i<5;i++){const shaft=attach(root,new THREE.CylinderGeometry(.235+i*.003,.238+i*.003,.421,16),[0xd3c4a8,0xcfc0a4,0xd7c8ad][i%3],x,.16+.21+i*.425,-1.55);shaft.name='argument-column-stone'}
   const capital=attach(root,new THREE.CylinderGeometry(.33,.29,.16,16),0xd3c4a8,x,2.365,-1.55);capital.name='argument-column-capital';
  }
  for(const x of [-1.75,1.75]){const shape=new THREE.Shape();for(let i=0;i<=48;i++){const a=Math.PI-i*Math.PI/48,px=Math.cos(a)*1.9,py=Math.sin(a)*1.9;if(i===0)shape.moveTo(px,py);else shape.lineTo(px,py)}for(let i=0;i<=48;i++){const a=i*Math.PI/48;shape.lineTo(Math.cos(a)*1.6,Math.sin(a)*1.6)}shape.closePath();const arch=attach(root,new THREE.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:2}),0xd3c4a8,x,2.35,-1.67);arch.name='argument-arch'}
  // Carved joints and branching leaves replace the bead-like arch decoration.
  for(const x of [-1.75,1.75])for(let i=1;i<12;i++){const a=i*Math.PI/12,start=new THREE.Vector3(x+1.61*Math.cos(a),2.35+1.61*Math.sin(a),-1.415),end=new THREE.Vector3(x+1.89*Math.cos(a),2.35+1.89*Math.sin(a),-1.415),delta=end.clone().sub(start),joint=attach(root,new THREE.CylinderGeometry(.01,.01,delta.length(),5),0xb0a38a,0,0,0);joint.position.copy(start).add(end).multiplyScalar(.5);joint.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());joint.name='argument-arch-joint'}
  {const leafGeometry=new THREE.BufferGeometry();leafGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-.08,.13,0,0,.3,0,.08,.13,0,0,.15,.025],3));leafGeometry.setIndex([0,1,4,1,2,4,2,3,4,3,0,4]);leafGeometry.computeVertexNormals();const leafMaterials=[mat(0x718b66),mat(0x91a379)];leafMaterials.forEach(m=>m.side=THREE.DoubleSide);
   function vine(points,count){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),stem=attach(root,new THREE.TubeGeometry(curve,40,.023,6,false),0x6f7755,0,0,0);stem.name='argument-vine';for(let i=0;i<count;i++){const t=.07+i*.86/(count-1),point=curve.getPoint(t),tangent=curve.getTangent(t);for(const side of [-1,1]){const direction=new THREE.Vector3(tangent.x*.45-tangent.y*side,tangent.y*.45+tangent.x*side,.04).normalize(),leaf=new THREE.Mesh(leafGeometry,leafMaterials[(i+(side>0?1:0))%2]);leaf.position.copy(point).addScaledVector(direction,.045);leaf.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);leaf.name='argument-vine-leaf';leaf.castShadow=true;root.add(leaf)}}}
   for(const x of [-3.5,0,3.5])vine([[x,.13,-1.2],[x-.08,.7,-1.29],[x+.07,1.35,-1.29],[x,2.32,-1.2]],9);
   for(const x of [-1.75,1.75]){const points=[];for(let i=0;i<=8;i++){const a=.2+i*(Math.PI-.4)/8;points.push([x+1.76*Math.cos(a),2.35+1.76*Math.sin(a),-1.4])}vine(points,12)}
  }
  const floor=box(0,.025,.3,6.5,.04,2.8,0xb6ad97);floor.name='argument-stage-floor';for(const z of [-1,1.6])box(0,.052,z,6.3,.012,.035,0xe1d0ac);
  for(const x of [-3.12,3.12]){const edge=box(x,.052,.3,.035,.012,2.56,0xe1d0ac);edge.name='argument-rug-edge'}
  {const vertices=[];for(let z=-.9;z<1.51;z+=.12)vertices.push(-3.06,.047,z,3.06,.047,z);const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const threads=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xb6ad97,transparent:true,opacity:.55}));threads.name='argument-rug-weave';root.add(threads)}
  for(const side of [-1,1]){
   const x=side*2.15;box(x,.44,.25,.9,.16,.9,0x795844);for(const dx of [-.34,.34])for(const dz of [-.3,.3]){const leg=box(x+dx,.2525,.25+dz,.1,.415,.1,0x795844);leg.name='argument-stool-leg'}
   const person=new THREE.Group();person.position.set(x,.5,.22);person.name='argument-person';root.add(person);
   const torso=attach(person,new THREE.CylinderGeometry(.25,.34,.65,12),side<0?0xa65f50:0x6c8d85,0,.48,0);torso.rotation.z=side*.16;
   attach(person,new THREE.SphereGeometry(.25,16,12),0xc99472,-side*.04,1.05,0);for(const dz of [-.09,.09])attach(person,new THREE.SphereGeometry(.022,8,6),0x34413a,-side*.267,1.09,dz);attach(person,new THREE.SphereGeometry(.05,10,8),0xc99472,-side*.29,1.02,0);
   const hair=attach(person,new THREE.SphereGeometry(.26,16,10),0x51463c,-side*.04,1.2,0);hair.scale.y=.52;
   // Individual hair silhouettes and ear detail keep the two speakers recognizable
   // while they remain the same participants in both interpretive frames.
   for(const dz of [-1,1]){const ear=attach(person,new THREE.SphereGeometry(.055,10,8),0xc99472,-side*.035,1.05,dz*.235);ear.scale.set(.65,1,.48);ear.name='argument-ear'}
   if(side<0){
    for(let i=0;i<22;i++){const a=i*2.399963,r=.19*Math.sqrt((i+.5)/22),curl=attach(person,new THREE.SphereGeometry(.055,8,6),i%3?0x51463c:0x625144,-side*.04+Math.cos(a)*r,1.21+Math.sqrt(Math.max(0,.045-r*r))*.55,Math.sin(a)*r);curl.name='argument-hair-curl'}
    const beard=attach(person,new THREE.SphereGeometry(.155,12,9),0x51463c,-side*.17,.94,0);beard.scale.set(.65,.8,.92);beard.name='argument-beard';
   }else{const bun=attach(person,new THREE.SphereGeometry(.13,12,9),0x51463c,side*.2,1.17,0);bun.scale.set(.85,1,.85);bun.name='argument-hair-bun';const band=attach(person,new THREE.TorusGeometry(.11,.014,6,20),0xb99b70,side*.24,1.17,0);band.rotation.y=Math.PI/2;band.name='argument-hair-band'}
   // A draped mantle and folds follow the torso instead of adding a rigid box.
   const mantleShape=new THREE.Shape();mantleShape.moveTo(-.2,.28);mantleShape.quadraticCurveTo(-.31,.43,-.2,.76);mantleShape.lineTo(.02,.8);mantleShape.quadraticCurveTo(.19,.59,.27,.28);mantleShape.quadraticCurveTo(.04,.2,-.2,.28);
   const mantle=attach(person,new THREE.ExtrudeGeometry(mantleShape,{depth:.055,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:1}),side<0?0x8e5045:0x587a72,0,0,.21);mantle.name='argument-mantle';
   for(let i=0;i<3;i++){const fold=attach(person,new THREE.BoxGeometry(.018,.39,.012),side<0?0xb6735e:0x82a298,-.13+i*.1,.48,.278);fold.rotation.z=-.18-i*.08;fold.name='argument-mantle-fold'}
   function limb(a,b,r,color){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from),segment=attach(person,new THREE.CylinderGeometry(r,r,delta.length(),10),color,0,0,0);segment.position.copy(from.add(to).multiplyScalar(.5));segment.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return segment}
   for(const dz of [-.17,.17]){const leg=attach(person,new THREE.CylinderGeometry(.09,.1,.65,10),0xd6c7ab,-side*.19,-.18,dz);leg.rotation.z=side*1.1;const elbow=[-side*(dz<0?.44:.32),.53,dz],wrist=dz<0?[-side*.91,.338,dz]:[-side*.24,.88,dz];limb([-side*.16,.77,dz],elbow,.08,side<0?0xa65f50:0x6c8d85);const forearm=limb(elbow,wrist,.07,0xc99472);forearm.name='argument-forearm'}
   for(const dz of [-.17,.17]){const hand=attach(person,new THREE.SphereGeometry(.085,10,8),0xc99472,-side*(dz<0?.91:.24),dz<0?.338:.88,dz);hand.scale.set(1,.8,.8);hand.name='argument-hand';const shoe=attach(person,new THREE.BoxGeometry(.23,.08,.14),0x795844,-side*.47,-.415,dz);shoe.name='argument-shoe';shoe.rotation.y=side*.1}
   // Folded cloth falls over the seated knees, with the hem above the shoes.
   const clothPositions=[],clothIndices=[],rows=12,columns=14;
   for(let row=0;row<=rows;row++){const t=row/rows,x=-side*(t<.45?t*.7:.315+(t-.45)*.1),y=t<.45?.32-t*.5:.095-(t-.45)*.79,width=.24+.075*Math.sin(Math.PI*t);
    for(let col=0;col<=columns;col++){const u=col/columns*2-1;clothPositions.push(x-side*.012*Math.cos(u*5*Math.PI),y+.008*Math.cos(u*4*Math.PI),u*width);if(row<rows&&col<columns){const n=row*(columns+1)+col;clothIndices.push(n,n+1,n+columns+1,n+1,n+columns+2,n+columns+1)}}}
   const clothGeometry=new THREE.BufferGeometry();clothGeometry.setAttribute('position',new THREE.Float32BufferAttribute(clothPositions,3));clothGeometry.setIndex(clothIndices);clothGeometry.computeVertexNormals();const cloth=attach(person,clothGeometry,0xd9cbb0,0,0,0);cloth.material.side=THREE.DoubleSide;cloth.name='argument-lap-drape';
   const collar=attach(person,new THREE.TorusGeometry(.2,.025,6,24),0xe3d7bf,0,.77,0);collar.rotation.x=Math.PI/2;
  }
  const tabletop=box(0,.7,.2,2.5,.14,1.6,0x795844);tabletop.name='argument-tabletop';for(const x of [-1.05,1.05])for(const z of [-.4,.8]){const leg=box(x,.3725,z,.12,.655,.12,0x795844);leg.name='argument-table-leg'}
  const war=new THREE.Group(),drawing=new THREE.Group();war.name='argument-war-board';drawing.name='argument-shared-drawing';root.add(war,drawing);
  const board=attach(war,new THREE.BoxGeometry(1.5,.05,1.3),0xd7c6a7,0,.795,.2);board.name='argument-board-base';
  const squareGeometry=new THREE.BoxGeometry(.175,.025,.15);for(let ix=0;ix<8;ix++)for(let iz=0;iz<8;iz++){const square=attach(war,squareGeometry,(ix+iz)%2?0x7b8b7d:0xe3d7bf,-.6125+ix*.175,.8325,-.325+iz*.15);square.name='argument-board-square'}
  // Distinct pawn and back-rank silhouettes form a complete chess setup.
  const pawnProfile=[[0,0],[.052,0],[.052,.015],[.035,.025],[.025,.075],[.038,.085],[.038,.095],[.024,.105]].map(p=>new THREE.Vector2(...p));
  const majorProfile=[[0,0],[.055,0],[.055,.016],[.039,.026],[.029,.095],[.045,.105],[.045,.12],[.031,.13]].map(p=>new THREE.Vector2(...p));
  const pawnGeometry=new THREE.LatheGeometry(pawnProfile,12),majorGeometry=new THREE.LatheGeometry(majorProfile,12),pieces=[];
  for(const side of [-1,1])for(const rank of [0,1])for(let i=0;i<8;i++){
   const color=side<0?0xb96c50:0x5d7e7c,x=side*(rank?.6125:.4375),z=-.325+i*.15,piece=new THREE.Group();piece.position.set(x,.845,z);piece.name='argument-chess-piece';piece.userData.side=side;war.add(piece);
   const body=attach(piece,rank?majorGeometry:pawnGeometry,color,0,0,0);body.name='argument-piece-body';
   const crown=attach(piece,new THREE.SphereGeometry(rank?.027:.025,10,8),color,0,rank?.147:.112,0);crown.name='argument-piece-crown';
   if(rank&&(i===3||i===4)){const finial=attach(piece,new THREE.BoxGeometry(.012,.048,.012),color,0,.184,0);finial.name='argument-piece-finial';if(i===4){const cross=attach(piece,new THREE.BoxGeometry(.04,.012,.012),color,0,.19,0);cross.name='argument-piece-cross'}}
   pieces.push(piece);
  }
  const sheet=attach(drawing,new THREE.BoxGeometry(1.75,.035,1.22),0xe9dfc9,0,.7875,.2);sheet.name='argument-drawing-sheet';
  for(const [x,color] of [[-.28,0xa65f50],[.28,0x6c8d85]]){const ring=attach(drawing,new THREE.TorusGeometry(.36,.025,8,32),color,x,.83,.2);ring.rotation.x=Math.PI/2}
  const revision=attach(drawing,new THREE.TorusGeometry(.2,.025,8,24),0xc59d61,0,.83,.2);revision.rotation.x=Math.PI/2;revision.name='argument-revision';
  for(const [side,color] of [[-1,0xa65f50],[1,0x6c8d85]]){const held=new THREE.Vector3(side*1.24,.838,.05),tipPoint=new THREE.Vector3(side*.86,.83,.16),delta=tipPoint.clone().sub(held),pencil=attach(drawing,new THREE.CylinderGeometry(.025,.025,delta.length(),8),color,0,0,0);pencil.position.copy(held).add(tipPoint).multiplyScalar(.5);pencil.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());pencil.name='argument-drawing-pencil';const tip=attach(drawing,new THREE.ConeGeometry(.025,.07,8),0xd7c6a7,...tipPoint.toArray());tip.quaternion.copy(pencil.quaternion);tip.name='argument-drawing-pencil-tip'}
  // Opposing standards accompany the war frame; the shared-drawing frame
  // retains one banner. Each flag is attached to its own frame group.
  for(const [group,x,color] of [[war,-2.2,0xa65f50],[war,-1.3,0x6c8d85],[drawing,1.75,0xc59d61]]){const shape=new THREE.Shape();shape.moveTo(-.34,.47);shape.lineTo(.34,.47);shape.lineTo(.34,-.46);shape.lineTo(0,-.32);shape.lineTo(-.34,-.46);shape.closePath();const banner=attach(group,new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:false}),color,x,2.85,-1.42);banner.name='argument-frame-banner';attach(group,new THREE.CylinderGeometry(.04,.04,.84,8),0x795844,x,3.35,-1.4).rotation.z=Math.PI/2;for(const dx of [-.27,.27])attach(group,new THREE.CylinderGeometry(.018,.018,.58,6),0x795844,x+dx,3.66,-1.48)}
  for(const x of [-2.2,-1.3]){const disc=attach(war,new THREE.CircleGeometry(.18,32),0xe9dfc9,x,2.86,-1.37);disc.name='argument-war-banner-disc';const half=attach(war,new THREE.CircleGeometry(.18,24,Math.PI/2,Math.PI),0x70584a,x,2.86,-1.366);half.name='argument-war-banner-half'}
  for(const x of [1.62,1.88]){const ring=attach(drawing,new THREE.TorusGeometry(.14,.018,6,24),0xe9dfc9,x,2.85,-1.38);ring.name='argument-banner-ring'}
  for(const x of [-1.08,1.08]){const cup=attach(root,new THREE.CylinderGeometry(.1,.075,.14,12),0xc59d61,x,.84,.63);cup.name='argument-cup'}
  const badge=ball(0,1.55,-1.12,.26,0xa65f50);badge.scale.z=.22;badge.name='argument-frame-indicator';
  const setMeshes=(group,visible)=>group.traverse(o=>{if(o.isMesh)o.visible=visible});
  sync=s=>{setMeshes(war,!s.frame);setMeshes(drawing,!!s.frame);revision.visible=!!s.frame&&!!s.example;pieces[1].position.x=-.4375+(s.example?.175:0);badge.material.color.setHex(s.frame?0xc59d61:0xa65f50);floor.material.color.setHex(s.frame?0x8fa396:0xb99b84)};
 }else if(id==='time-frames'){
  const ground=attach(root,new THREE.CylinderGeometry(4.52,4.52,.08,64),0x9ba88d,0,-.04,0);ground.name='time-common-ground';
  for(let i=0;i<9;i++)box(-3.2+i*.8,.02,1.55,.62,.06,.5,0xcbbfa6);
  // Irregular stepping stones connect the foreground to the shared workspace.
  {const shape=new THREE.Shape();shape.moveTo(-.34,-.22);shape.lineTo(-.22,-.29);shape.lineTo(.24,-.27);shape.lineTo(.36,-.12);shape.lineTo(.31,.2);shape.lineTo(.16,.27);shape.lineTo(-.27,.24);shape.lineTo(-.38,.1);shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelThickness:.008,bevelSize:.015,bevelSegments:1});for(const [x,z,a] of [[.2,2.12,-.12],[-.18,2.72,.1],[-.52,3.32,-.12],[-.83,3.88,.1]]){const stone=attach(root,geometry,0xcbbfa6,x,0,z);stone.rotation.set(-Math.PI/2,0,a);stone.name='time-approach-stone'}}
  for(const [x,z] of [[-1.8,2.55],[1.3,2.5],[1.85,3.05],[-1.95,3.15]]){const tuft=new THREE.Group();tuft.name='time-common-grass';tuft.position.set(x,0,z);root.add(tuft);for(let i=0;i<5;i++){const a=i*Math.PI*2/5,blade=attach(tuft,new THREE.ConeGeometry(.035,.24,4),0x788e6a,Math.cos(a)*.07,.12,Math.sin(a)*.07);blade.rotation.z=.22*Math.cos(a);blade.rotation.x=.22*Math.sin(a)}}
  // A broad stone arch frames both alternatives as one shared place.
  for(const x of [-3.5,3.5]){const pier=box(x,1.1,-1.65,.38,2.2,.38,0xd2c3a7);pier.name='time-arch-pier';for(const y of [.43,.86,1.29,1.72]){const joint=box(x,y,-1.45,.38,.018,.015,0xb2a58f);joint.name='time-arch-pier-joint'}box(x,2.18,-1.65,.52,.14,.48,0xd2c3a7);box(x,.08,-1.65,.52,.16,.48,0xd2c3a7)}
  const archShape=new THREE.Shape();for(let i=0;i<=40;i++){const a=Math.PI-i*Math.PI/40,x=3.69*Math.cos(a),y=1.67*Math.sin(a);if(i===0)archShape.moveTo(x,y);else archShape.lineTo(x,y)}for(let i=0;i<=40;i++){const a=i*Math.PI/40;archShape.lineTo(3.31*Math.cos(a),1.29*Math.sin(a))}archShape.closePath();
  const arch=attach(root,new THREE.ExtrudeGeometry(archShape,{depth:.38,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:1}),0xd2c3a7,0,2.2,-1.84);arch.name='time-stone-arch';
  for(let i=1;i<16;i++){const a=i*Math.PI/16,from=new THREE.Vector3(3.32*Math.cos(a),2.2+1.29*Math.sin(a),-1.445),to=new THREE.Vector3(3.68*Math.cos(a),2.2+1.67*Math.sin(a),-1.445),delta=to.clone().sub(from),joint=attach(root,new THREE.CylinderGeometry(.012,.012,delta.length(),6),0xb2a58f,0,0,0);joint.position.copy(from).add(to).multiplyScalar(.5);joint.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());joint.name='time-arch-joint'}
  {const vineCurve=new THREE.CatmullRomCurve3([[-3.52,.12,-1.43],[-3.6,.9,-1.43],[-3.43,1.76,-1.43],[-3.25,2.62,-1.43],[-2.72,3.22,-1.43],[-1.9,3.53,-1.43]].map(p=>new THREE.Vector3(...p)));const vine=attach(root,new THREE.TubeGeometry(vineCurve,40,.025,7,false),0x687b59,0,0,0);vine.name='time-arch-vine';for(let i=0;i<20;i++){const t=.08+i*.043,p=vineCurve.getPoint(t),side=i%2?1:-1,leaf=attach(root,new THREE.SphereGeometry(.12,9,7),i%3?0x769168:0x90a172,p.x+side*.1,p.y+.04,p.z+.025);leaf.scale.set(.8,1.25,.3);leaf.rotation.z=side*.65;leaf.name='time-arch-leaf'}}
  const money=new THREE.Group(),garden=new THREE.Group();money.name='money-detail';garden.name='garden-detail';root.add(money,garden);
  const mbox=(parent,x,y,z,w,h,d,color)=>attach(parent,new THREE.BoxGeometry(w,h,d),color,x,y,z);
  // A shallow stone work court belongs only to the money frame and remains
  // below the existing furniture and shared stepping stones.
  {const vertices=[],colors=[],shades=[0xb9ae99,0xc4b8a2,0xb3a994,0xcdc0a9];
   for(let row=0;row<7;row++)for(let col=0;col<12;col++){const x=-2.82+col*.47,z=-1.26+row*.47,x1=x+.455,z1=z+.455,c=new THREE.Color(shades[(row*7+col*3)%shades.length]);for(const p of [[x,.001,z],[x1,.001,z],[x,.001,z1],[x,.001,z1],[x1,.001,z],[x1,.001,z1]]){vertices.push(...p);colors.push(c.r,c.g,c.b)}}
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();const material=mat(0xffffff);material.vertexColors=true;material.side=THREE.DoubleSide;const court=new THREE.Mesh(geometry,material);court.name='time-money-paving';court.castShadow=false;court.receiveShadow=false;money.add(court);
  }
  const desk=mbox(money,0,.72,0,4.6,.16,1.8,0x795844);desk.name='time-money-desk';for(const x of [-2,2])for(const z of [-.65,.65])mbox(money,x,.36,z,.14,.72,.14,0x795844);
  const hourglass=new THREE.Group();hourglass.position.set(-1.1,.78,0);money.add(hourglass);
  for(const y of [.08,1.42]){const plate=attach(hourglass,new THREE.CylinderGeometry(.45,.45,.12,20),0x795844,0,y,0);if(y===.08)plate.name='time-hourglass-base'}
  for(const x of [-.3,.3])for(const z of [-.23,.23])attach(hourglass,new THREE.CylinderGeometry(.035,.035,1.24,10),0x795844,x,.75,z);
  const upper=attach(hourglass,new THREE.ConeGeometry(.31,.52,20),0xd0ae75,0,1,0),lower=attach(hourglass,new THREE.ConeGeometry(.31,.52,20),0xc3935d,0,.5,0);upper.rotation.z=Math.PI;upper.name='time-upper-sand';lower.name='time-lower-sand';
  for(const side of [-1,1]){const glass=new THREE.Mesh(new THREE.ConeGeometry(.35,.62,24),new THREE.MeshStandardMaterial({color:0xd7e2d6,transparent:true,opacity:.23,roughness:.25,side:THREE.DoubleSide,depthWrite:false}));glass.position.set(0,.75+side*.31,0);glass.rotation.z=side>0?Math.PI:0;hourglass.add(glass)}
  const coins=[];for(let stack=0;stack<3;stack++)for(let i=0;i<4;i++){const coin=attach(money,new THREE.CylinderGeometry(.19,.19,.07,16),[0x7d9b8b,0xd1aa69,0xb9785b][stack],.15+stack*.62,.835+i*.07,-.08);coin.name='time-coin';coins.push(coin)}
  const bookCover=mbox(money,1.25,.85,.55,.72,.1,.48,0x66837e);bookCover.name='time-desk-book';mbox(money,1.25,.91,.55,.65,.035,.43,0xe3d7bf);
  for(let i=0;i<3;i++){const page=mbox(money,1.25,.886+i*.008,.797,.61,.002,.006,0xb7a688);page.name='time-book-page-edge'}
  const bookSpine=mbox(money,.90,.854,.55,.018,.09,.46,0xc8aa72);bookSpine.name='time-book-spine';
  const pot=attach(money,new THREE.CylinderGeometry(.16,.12,.27,16),0xa77759,-2,.935,.5);pot.name='time-pencil-pot';for(let i=0;i<3;i++){const pencil=attach(money,new THREE.CylinderGeometry(.025,.025,.43,8),0x795844,-2+(i-1)*.08,1.2,.5);pencil.rotation.z=(i-1)*.18}
  mbox(money,-1.7,.37,1.47,.8,.12,.65,0x795844);for(const dx of [-.3,.3])for(const dz of [-.23,.23])mbox(money,-1.7+dx,.18,1.47+dz,.08,.36,.08,0x795844);
  // The chair belongs to the desk frame and stays clear of the path in the garden frame.
  for(const x of [-2,-1.4]){const upright=mbox(money,x,.72,1.7,.08,.72,.08,0x795844);upright.name='time-chair-back-post'}
  for(const y of [.73,1.02]){const rail=mbox(money,-1.7,y,1.7,.68,.085,.08,0x947052);rail.name='time-chair-back-rail'}
  // A cloth folds over the upper chair rail and hangs toward the seat; its
  // two surfaces and soft hem remain part of the money-frame group.
  {const positions=[],indices=[],rows=16,cols=12;for(let row=0;row<=rows;row++){const t=row/rows,y=1.075-.65*t;for(let col=0;col<=cols;col++){const u=col/cols*2-1,x=-1.7+u*.29,z=1.745+.025*Math.cos(u*Math.PI*3)*t+.035*Math.sin(t*Math.PI);positions.push(x,y,z);if(row<rows&&col<cols){const n=row*(cols+1)+col;indices.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1)}}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const cloth=attach(money,geometry,0x708e83,0,0,0);cloth.material.side=THREE.DoubleSide;cloth.name='time-chair-drape';cloth.castShadow=false;for(const x of [-1.97,-1.43]){const hem=mbox(money,x,.75,1.78,.012,.61,.008,0xc7b58c);hem.name='time-chair-drape-hem'}}
  // Fine joinery defines the desktop without lifting the objects that rest on it.
  for(const z of [-.42,.42]){const seam=mbox(money,0,.801,z,4.42,.003,.012,0x654a3a);seam.name='time-desk-plank-seam'}
  for(const x of [-2,2]){const stretcher=mbox(money,x,.18,0,.09,.09,1.3,0x947052);stretcher.name='time-desk-stretcher'}
  const bed=mbox(garden,0,.1875,0,5.2,.375,2.15,0x71614e);bed.name='time-garden-bed';const soil=mbox(garden,0,.39,0,4.95,.1,1.9,0x6b5744);soil.name='time-garden-soil';
  // Low, irregular soil clods add surface depth in both planted and fallow
  // examples without making the fixed decoration look like a changing crop.
  {const geometry=new THREE.DodecahedronGeometry(1,0),dummy=new THREE.Object3D();for(const [variant,color] of [[0,0x79634b],[1,0x5c4c3b]]){const clods=new THREE.InstancedMesh(geometry,mat(color),80);clods.name='time-soil-clods';for(let i=0;i<80;i++){const n=i+variant*80,fract=x=>x-Math.floor(x),x=-2.35+4.7*fract(Math.sin(n*12.9898+4)*43758.5453),z=-.84+1.68*fract(Math.sin(n*78.233+8)*12345.6789),size=.025+.035*fract(Math.sin(n*9.67+2)*5648.123);dummy.position.set(x,.442,z);dummy.rotation.set(0,n*.71,0);dummy.scale.set(size*1.4,.009+size*.12,size);dummy.updateMatrix();clods.setMatrixAt(i,dummy.matrix)}clods.computeBoundingSphere();clods.castShadow=false;clods.receiveShadow=false;garden.add(clods)}}
  for(let i=0;i<11;i++){const x=-2.5+i*.48;if(x>1.7)continue;const stone=attach(garden,new THREE.DodecahedronGeometry(.19,0),0xb4aa91,x,.14,1.12);stone.scale.set(1,.7,.8);stone.name='time-bed-stone'}
  // Faceted stones along both sides turn the exposed bed into an earthen
  // plot and leave the watering can and pergola supports unobstructed.
  {const geometry=new THREE.DodecahedronGeometry(1,0),stoneColors=[0xb4aa91,0xc2b69e,0x9f9e8c];for(const side of [-1,1])for(let i=0;i<5;i++){const stone=attach(garden,geometry,stoneColors[(i+(side>0?1:0))%3],side*2.68,.14,-.76+i*.38);stone.scale.set(.2+(i%2)*.025,.2,.22);stone.rotation.y=i*.9;stone.name='time-bed-side-stone'}}
  const sprouts=[];{const leafShape=new THREE.Shape();leafShape.moveTo(0,0);leafShape.bezierCurveTo(-.16,.12,-.14,.3,0,.44);leafShape.bezierCurveTo(.14,.3,.16,.12,0,0);const leafGeometry=new THREE.ShapeGeometry(leafShape,12),leafMaterials=[mat(0x789b70),mat(0x8aa679),mat(0x688b66)];leafMaterials.forEach(m=>m.side=THREE.DoubleSide);
   for(let i=0;i<5;i++){const plant=new THREE.Group();plant.name='time-garden-sprout';plant.position.set(-1.9+i*.95,.44,(i%2?-.08:.08));garden.add(plant);const height=.34+(i%3)*.035;attach(plant,new THREE.CylinderGeometry(.025,.035,height,8),0x67845e,0,height/2,0);
    for(let j=0;j<5;j++){const a=j*Math.PI*2/5+i*.43,up=.52+(j%2)*.14,direction=new THREE.Vector3(Math.cos(a),up,Math.sin(a)).normalize(),leaf=new THREE.Mesh(leafGeometry,leafMaterials[(i+j)%3]);leaf.position.set(0,.13+(j%3)*.055,0);leaf.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);leaf.rotateY(a*.3);leaf.scale.setScalar(.8+.08*((i+j)%3));leaf.name='time-garden-leaf';leaf.castShadow=false;plant.add(leaf)}sprouts.push(plant)}
  }
  // Border flowers remain outside the cultivated bed even when it is left fallow.
  const border=new THREE.Group();border.name='time-garden-border';garden.add(border);for(const x of [-2.35,-1.55,-.75,.05]){attach(border,new THREE.CylinderGeometry(.02,.025,.42,8),0x67845e,x,.21,-1.32);for(let i=0;i<5;i++){const a=i*Math.PI*2/5,petal=attach(border,new THREE.SphereGeometry(.065,8,6),0xe5c67b,x+Math.sin(a)*.065,.45,-1.32+Math.cos(a)*.065);petal.scale.set(.65,.22,1);petal.rotation.y=a}attach(border,new THREE.SphereGeometry(.035,8,6),0xb98054,x,.47,-1.32)}
  // Perennial flowers frame the plot outside the planted/fallow soil and path.
  for(const [x,z] of [[-2.85,2.35],[2.55,2.45],[3.75,.85]]){const cluster=new THREE.Group();cluster.name='time-garden-flower-cluster';cluster.position.set(x,0,z);garden.add(cluster);
   for(let i=0;i<7;i++){const a=i*2.399963,r=.08+.06*(i%3),leaf=attach(cluster,new THREE.SphereGeometry(.14,8,6),i%2?0x78946a:0x65835e,Math.cos(a)*r,.11,Math.sin(a)*r);leaf.scale.set(.55,.55,1.25);leaf.rotation.y=-a;leaf.name='time-garden-border-leaf'}
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3,px=Math.cos(a)*.13,pz=Math.sin(a)*.13,y=.31+i*.055;attach(cluster,new THREE.CylinderGeometry(.012,.015,y,6),0x6d8961,px,y/2,pz);for(let j=0;j<5;j++){const b=j*Math.PI*2/5,petal=attach(cluster,new THREE.SphereGeometry(.055,8,6),0xe4c879,px+Math.cos(b)*.05,y,pz+Math.sin(b)*.05);petal.scale.set(.8,.25,1.1);petal.rotation.y=-b}attach(cluster,new THREE.SphereGeometry(.03,8,6),0xa9784e,px,y+.015,pz)}
  }
  for(const x of [-2.8,2.8]){for(const z of [-1.3,1.3]){const post=mbox(garden,x,1.15,z,.14,2.3,.14,0x795844);post.name='time-pergola-post'}mbox(garden,x,2.25,0,.14,.14,2.6,0x795844)}
  mbox(garden,0,2.3,-1.3,5.7,.12,.18,0x795844);
  for(let x=-2.5;x<=2.5;x+=.5)mbox(garden,x,2.31,0,.07,.08,2.5,0x795844);
  // Foliage and hanging blossoms belong to the garden frame, independent of bed season.
  {const leafShape=new THREE.Shape();leafShape.moveTo(0,-.22);leafShape.bezierCurveTo(-.16,-.26,-.24,-.1,-.19,.02);leafShape.lineTo(-.34,.06);leafShape.lineTo(-.18,.21);leafShape.lineTo(-.2,.29);leafShape.lineTo(-.07,.3);leafShape.lineTo(0,.47);leafShape.lineTo(.07,.3);leafShape.lineTo(.2,.29);leafShape.lineTo(.18,.21);leafShape.lineTo(.34,.06);leafShape.lineTo(.19,.02);leafShape.bezierCurveTo(.24,-.1,.16,-.26,0,-.22);const leafGeometry=new THREE.ShapeGeometry(leafShape,6),leafMaterial=mat(0x81996c);leafMaterial.side=THREE.DoubleSide;
   const canopy=new THREE.InstancedMesh(leafGeometry,leafMaterial,144),dummy=new THREE.Object3D();canopy.name='time-pergola-leaves';for(let i=0;i<144;i++){const col=i%24,row=Math.floor(i/24),x=-2.5+col*5/23+.11*Math.sin(i*2.4),z=-1.08+row*2.16/5+.1*Math.cos(i*3.7),size=.46+.15*(.5+.5*Math.sin(i*5.1));dummy.position.set(x,2.39+.08*Math.sin(i*2.1),z);dummy.rotation.set(-Math.PI/2+.3*Math.sin(i),.12*Math.cos(i*1.7),i*2.399963);dummy.scale.setScalar(size);dummy.updateMatrix();canopy.setMatrixAt(i,dummy.matrix)}canopy.computeBoundingSphere();canopy.castShadow=false;garden.add(canopy);
   const blooms=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),mat(0xb49bb5),126);blooms.name='time-pergola-blossoms';for(let cluster=0;cluster<9;cluster++)for(let j=0;j<14;j++){const x=-2.15+cluster*.53,z=cluster%2?-.48:.52,a=j*2.399963,r=(.035+.055*(1-j/14))*Math.sqrt((j%4+1)/4);dummy.position.set(x+Math.cos(a)*r,2.27-j*.035,z+Math.sin(a)*r);dummy.rotation.set(0,0,0);dummy.scale.set(.045,.055,.045);dummy.updateMatrix();blooms.setMatrixAt(cluster*14+j,dummy.matrix)}blooms.computeBoundingSphere();garden.add(blooms)}
  const can=attach(garden,new THREE.CylinderGeometry(.27,.32,.5,16),0x76938a,2.1,.66,.72);can.name='time-watering-can';const spout=attach(garden,new THREE.CylinderGeometry(.06,.09,.55,10),0x76938a,1.76,.73,.72);spout.rotation.z=-.95;
  const handle=attach(garden,new THREE.TorusGeometry(.25,.035,8,24,Math.PI),0x76938a,2.1,.94,.72);handle.name='time-can-handle';
  const gardener=new THREE.Group();gardener.name='time-gardener';gardener.position.set(1.45,0,-1.5);gardener.scale.setScalar(1.3);garden.add(gardener);
  const torso=attach(gardener,new THREE.CylinderGeometry(.18,.27,.55,12),0xd7c6a8,0,.58,.05);torso.rotation.x=.3;attach(gardener,new THREE.SphereGeometry(.19,12,10),0xc99b7a,0,1.01,.13);const hair=attach(gardener,new THREE.SphereGeometry(.19,12,8),0x51463c,0,1.1,.1);hair.scale.y=.55;
  for(const side of [-1,1]){const thigh=attach(gardener,new THREE.SphereGeometry(.18,10,8),0x6f8d79,side*.17,.2,-.02);thigh.scale.set(.8,.65,1.25);const foot=attach(gardener,new THREE.BoxGeometry(.18,.09,.32),0x795844,side*.17,.045,-.18);foot.name='time-gardener-foot';
   function limb(a,b,r,color,name){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),mesh=attach(gardener,new THREE.CylinderGeometry(r*.85,r,delta.length(),9),color,0,0,0);mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.name=name}
   const shoulder=[side*.18,.77,.12],elbow=[side*.27,.50,.33],hand=[side*.2,.383,.64];limb(shoulder,elbow,.075,0xd7c6a8,'time-gardener-sleeve');limb(elbow,hand,.05,0xc99b7a,'time-gardener-forearm');const palm=attach(gardener,new THREE.SphereGeometry(.055,10,8),0xc99b7a,...hand);palm.scale.set(1,.8,1.3);palm.name='time-gardener-hand';
   const eye=attach(gardener,new THREE.SphereGeometry(.02,8,6),0x34413a,side*.065,1.02,.297);eye.name='time-gardener-eye'}
  const apron=attach(gardener,new THREE.CylinderGeometry(.22,.3,.34,12,1,true,0,Math.PI),0xb66c52,0,.43,.12);apron.rotation.y=Math.PI;apron.rotation.x=.18;apron.material.side=THREE.DoubleSide;apron.name='time-gardener-apron';
  for(let i=0;i<8;i++){const a=i*Math.PI*2/8,curl=attach(gardener,new THREE.SphereGeometry(.055,8,6),0x51463c,Math.cos(a)*.13,1.12+Math.sin(a)*.035,.035+Math.sin(a)*.075);curl.name='time-gardener-hair-curl'}
  // A mature fruit tree frames the plot independently of the seasonal bed state.
  const orchard=new THREE.Group();orchard.name='time-orchard-tree';orchard.position.set(3.65,0,-1.45);garden.add(orchard);
  attach(orchard,new THREE.CylinderGeometry(.1,.17,1.22,10),0x795844,0,.61,0);
  {const tips=[[-.38,1.45,0],[.36,1.5,.04],[0,1.73,-.14],[-.08,1.42,.31]];for(const [x,y,z] of tips){const from=new THREE.Vector3(0,.82,0),to=new THREE.Vector3(x,y,z),delta=to.clone().sub(from),branch=attach(orchard,new THREE.CylinderGeometry(.035,.065,delta.length(),8),0x795844,0,0,0);branch.position.copy(from.add(to).multiplyScalar(.5));branch.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize())}
   const geometry=new THREE.SphereGeometry(1,8,6),dummy=new THREE.Object3D();for(const [variant,color] of [[0,0x738b61],[1,0x8ca076]]){const leaves=new THREE.InstancedMesh(geometry,mat(color),80);leaves.name='time-orchard-leaves';for(let i=0;i<80;i++){const n=variant*80+i,tip=tips[n%tips.length],a=n*2.399963,r=.05+.28*Math.sqrt(((n*17)%79)/78);dummy.position.set(tip[0]+Math.cos(a)*r,tip[1]+Math.sin(a)*r*.7,tip[2]+.18*Math.sin(n*1.3));dummy.rotation.set(.25*Math.sin(n),a,.4*Math.cos(n));dummy.scale.set(.12,.065,.045);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)}leaves.computeBoundingSphere();orchard.add(leaves)}
  }
  for(const [x,y,z] of [[-.4,1.4,.23],[-.12,1.62,.29],[.25,1.42,.3],[.37,1.59,.14],[.04,1.82,.13]]){const fruit=attach(orchard,new THREE.SphereGeometry(.075,10,8),0xcf8c57,x,y,z);fruit.name='time-orchard-fruit'}
  for(let i=0;i<5;i++){const stone=attach(garden,new THREE.SphereGeometry(.2,12,8),0xb4aa91,-2.2+i*1.1,.15,1.18);stone.scale.y=.55}
  const setMeshes=(group,visible)=>group.traverse(o=>{if(o.isMesh)o.visible=visible});
  sync=s=>{money.visible=!s.frame;garden.visible=!!s.frame;setMeshes(money,!s.frame);setMeshes(garden,!!s.frame);upper.scale.y=s.example?.7:1;upper.scale.x=upper.scale.z=upper.scale.y*.94;lower.scale.y=s.example?1:.7;upper.position.y=.75+.26*upper.scale.y;lower.position.y=.13+.26*lower.scale.y;coins.forEach((coin,i)=>coin.visible=!s.frame&&!(s.example&&i%4===3));sprouts.forEach(plant=>plant.traverse(o=>{if(o.isMesh)o.visible=!!s.frame&&!s.example}));can.material.color.setHex(s.example?0xa1aaa0:0x76938a)};
 }else if(id==='emotion-orientation'){
  const terrain=attach(root,new THREE.CylinderGeometry(4.72,4.72,.08,64),0x8d9e87,0,-.04,0);terrain.name='emotion-courtyard-ground';
  // A curved stone approach connects the entry landing to the foreground.
  {const shape=new THREE.Shape();shape.moveTo(-.32,-.2);shape.lineTo(-.2,-.27);shape.lineTo(.23,-.25);shape.lineTo(.34,-.12);shape.lineTo(.3,.19);shape.lineTo(.14,.26);shape.lineTo(-.27,.23);shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:.026,bevelEnabled:true,bevelThickness:.006,bevelSize:.012,bevelSegments:1});for(const [x,z,angle] of [[-2.3,1.35,.12],[-2.55,1.85,-.08],[-2.65,2.38,.1],[-2.52,2.92,-.12],[-2.22,3.38,.18]]){const stone=attach(root,geometry,0xc9bea6,x,.006,z);stone.rotation.set(-Math.PI/2,0,angle);stone.name='emotion-approach-stone'}}
  // Groundcover and rocks frame the approach without occupying either stairway.
  for(const [x,z,size] of [[-3.55,2.2,.3],[-3.15,2.95,.24],[-1.48,3.35,.25],[.15,3.55,.3],[1.5,3.35,.27],[2.75,2.75,.24]]){
   const cluster=new THREE.Group();cluster.name='emotion-foreground-plant';cluster.position.set(x,0,z);root.add(cluster);
   for(let i=0;i<9;i++){const a=i*2.399963,r=.04+size*.65*Math.sqrt((i+.5)/9),leaf=attach(cluster,new THREE.SphereGeometry(size*.48,8,6),i%3?0x728d6c:0x91a17a,Math.cos(a)*r,.09+size*.18*(i%2),Math.sin(a)*r);leaf.scale.set(.58,.6,1.2);leaf.rotation.y=-a;leaf.name='emotion-foreground-leaf'}
  }
  for(const [x,z,sx,sy,sz] of [[-3.82,1.55,.4,.25,.28],[-3.55,2.65,.3,.2,.25],[-1.1,3.9,.34,.19,.23],[1.05,3.85,.35,.22,.25],[3.35,2.55,.3,.2,.22]]){const rock=attach(root,new THREE.DodecahedronGeometry(1,0),0xb1aa96,x,sy*.7,z);rock.scale.set(sx,sy,sz);rock.rotation.y=x;rock.name='emotion-foreground-rock'}
  // Two directions are complementary spatial metaphors, not a scale of actual mood.
  const landing=box(-2.15,.325,0,2.5,.65,2.2,0xc9bea6);landing.name='emotion-entry-landing';
  // Jointed paving and staggered masonry articulate the large common
  // landing while retaining its uninterrupted support for the traveler.
  {const vertices=[];for(const z of [-.88,-.44,0,.44,.88])vertices.push(-3.38,.653,z,-.92,.653,z);for(let row=0;row<5;row++)for(let x=-3.19+(row%2)*.22;x<-.98;x+=.44)vertices.push(x,.653,-1.09+row*.44,x,.653,-.65+row*.44);
   for(const y of [.216,.433])vertices.push(-3.38,y,1.102,-.92,y,1.102);for(let row=0;row<3;row++)for(let x=-3.18+(row%2)*.21;x<-.97;x+=.42)vertices.push(x,row*.216+.006,1.102,x,(row+1)*.216-.006,1.102);
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const joints=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xa99d89}));joints.name='emotion-landing-masonry';root.add(joints)}
  // Four grounded risers connect the lower approach to the raised junction.
  for(let i=0;i<4;i++){const height=.52-i*.13,step=box(-2.45,height/2,1.37+i*.54,.9,height,.55,0xc9bea6);step.name='emotion-landing-approach-step'}
  const traveler=dress(ball(-2.25,1.84,0,.25,0xc18d6c),0x789b9a);traveler.name='emotion-traveler';
  traveler.rotation.y=Math.PI/2;traveler.children[traveler.children.length-1].scale.set(.72,.5,.72);traveler.children[1].visible=false;traveler.children[3].visible=false;
  for(const side of [-1,1]){attach(traveler,new THREE.BoxGeometry(.16,.08,.22),0x795844,side*.13,-1.15,.04);attach(traveler,new THREE.SphereGeometry(.022,8,6),0x34413a,side*.07,.02,.23)}
  const bag=attach(traveler,new THREE.BoxGeometry(.28,.32,.13),0x795844,-.14,-.55,-.22);bag.rotation.z=.1;bag.name='emotion-traveler-bag';
  const flap=attach(traveler,new THREE.BoxGeometry(.29,.12,.145),0x98704b,-.14,-.43,-.22);flap.rotation.z=.1;const buckle=attach(traveler,new THREE.BoxGeometry(.045,.05,.015),0xd1ae70,-.14,-.44,-.3);buckle.name='emotion-bag-buckle';
  function travelerLimb(a,b,r,color,name){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),mesh=attach(traveler,new THREE.CylinderGeometry(r*.85,r,delta.length(),9),color,0,0,0);mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.name=name;return mesh}
  for(const pose of [{shoulder:[.22,-.33,0],elbow:[.29,-.55,.12],hand:[.11,-.19,.22]},{shoulder:[-.22,-.33,0],elbow:[-.28,-.55,.1],hand:[-.16,-.66,.16]}]){travelerLimb(pose.shoulder,pose.elbow,.07,0xe0d1b6,'emotion-traveler-sleeve');travelerLimb(pose.elbow,pose.hand,.045,0xc18d6c,'emotion-traveler-forearm');const hand=attach(traveler,new THREE.SphereGeometry(.055,10,8),0xc18d6c,...pose.hand);hand.name='emotion-traveler-hand'}
  {const vertices=[],indices=[],rows=10,cols=24;for(let row=0;row<=rows;row++){const t=row/rows;for(let col=0;col<=cols;col++){const a=Math.PI*.3+col/cols*Math.PI*1.4,fold=.009*Math.cos(a*8)*t;vertices.push(Math.sin(a)*(.19+.1*t+fold),-.27-.69*t-.035*t*Math.cos(a),Math.cos(a)*(.15+.07*t+fold)-.025);if(row<rows&&col<cols){const n=row*(cols+1)+col;indices.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1)}}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const cloak=attach(traveler,geometry,0x62867c,0,0,0);cloak.material.side=THREE.DoubleSide;cloak.name='emotion-traveler-cloak'}
  travelerLimb([.16,-.28,.16],[-.16,-.58,-.22],.022,0x98704b,'emotion-traveler-strap');
  for(let i=0;i<9;i++){const a=i*Math.PI*2/9,curl=attach(traveler,new THREE.SphereGeometry(.055,8,6),0x51463c,Math.cos(a)*.15,.15+Math.sin(a)*.045,-.08+Math.sin(a)*.09);curl.name='emotion-traveler-hair-curl'}
  const archFoundation=box(-3.65,.205,-.4,1.35,.41,.7,0xc9bea6);archFoundation.name='emotion-arch-foundation';
  const entry=new THREE.Group();entry.name='emotion-entry-arch';entry.position.set(-3.65,.41,-.4);root.add(entry);for(const x of [-.48,.48]){attach(entry,new THREE.BoxGeometry(.2,1.45,.25),0xc9bea6,x,.725,0);attach(entry,new THREE.BoxGeometry(.29,.12,.34),0xd5c8af,x,1.45,0);for(const y of [.35,.7,1.05])attach(entry,new THREE.BoxGeometry(.205,.014,.26),0xa99d89,x,y,0)}
  {const shape=new THREE.Shape();for(let i=0;i<=24;i++){const a=Math.PI-i*Math.PI/24,x=.58*Math.cos(a),y=.58*Math.sin(a);if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y)}for(let i=0;i<=24;i++){const a=i*Math.PI/24;shape.lineTo(.38*Math.cos(a),.38*Math.sin(a))}shape.closePath();const crown=attach(entry,new THREE.ExtrudeGeometry(shape,{depth:.25,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:1}),0xc9bea6,0,1.45,-.125);crown.name='emotion-entry-crown';for(let i=1;i<8;i++){const a=i*Math.PI/8,from=new THREE.Vector3(.39*Math.cos(a),1.45+.39*Math.sin(a),.135),to=new THREE.Vector3(.57*Math.cos(a),1.45+.57*Math.sin(a),.135),d=to.clone().sub(from),joint=attach(entry,new THREE.CylinderGeometry(.008,.008,d.length(),5),0xa99d89,0,0,0);joint.position.copy(from).add(to).multiplyScalar(.5);joint.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize())}}
  {const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.51,.12,.16),new THREE.Vector3(-.57,.7,.16),new THREE.Vector3(-.47,1.35,.16),new THREE.Vector3(-.25,1.83,.16),new THREE.Vector3(.05,1.98,.16)]),vine=attach(entry,new THREE.TubeGeometry(curve,32,.018,6,false),0x637a5a,0,0,0);vine.name='emotion-entry-vine';for(let i=0;i<14;i++){const t=.12+i*.055,p=curve.getPoint(t),side=i%2?1:-1,leaf=attach(entry,new THREE.SphereGeometry(.095,8,6),0x78916e,p.x+side*.07,p.y,.17);leaf.scale.set(.65,1.2,.25);leaf.rotation.z=side*.65;leaf.name='emotion-entry-leaf'}}
  box(-.7,.71,0,.65,.6,.22,0x795844);box(-.7,1.47,0,.12,1.05,.12,0x795844);
  const arrowShape=new THREE.Shape();arrowShape.moveTo(-.36,-.12);arrowShape.lineTo(.12,-.12);arrowShape.lineTo(.12,-.2);arrowShape.lineTo(.38,0);arrowShape.lineTo(.12,.2);arrowShape.lineTo(.12,.12);arrowShape.lineTo(-.36,.12);arrowShape.closePath();const arrowGeometry=new THREE.ExtrudeGeometry(arrowShape,{depth:.1,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:1});
  const upSign=attach(root,arrowGeometry,0xd0aa6e,-.32,1.79,-.05),downSign=attach(root,arrowGeometry,0x879a98,-.32,1.43,-.05);upSign.rotation.z=.16;downSign.rotation.z=-.16;upSign.name='emotion-up-sign';downSign.name='emotion-down-sign';
  const upSteps=[],downSteps=[];
  // Both branches meet the common landing; the short connector has the same
  // surface height as the landing before the first step changes elevation.
  for(const z of [-1.05,1.05]){const connection=box(-.69,.325,z,.44,.65,.92,0xc9bea6);connection.name='emotion-path-connector'}
  for(let i=0;i<5;i++){
   const x=-.1+i*.7,upHeight=.83+i*.19,downHeight=.65-i*.13;
   const up=box(x,upHeight/2,-1.05,.76,upHeight,.92,0xcfc0a3),down=box(x,downHeight/2,1.05,.76,downHeight,.92,0xbaa993);up.name='emotion-up-step';down.name='emotion-down-step';upSteps.push(up);downSteps.push(down);
   for(const [z,height] of [[-1.05,upHeight],[1.05,downHeight]]){const nosing=box(x-.36,height+.012,z,.025,.024,.9,0xe5d5b7);nosing.name='emotion-step-nosing'}
  }
  // Fine staggered joints divide the walking surfaces into individual stones
  // without creating raised obstacles or obscuring the active route marker.
  {const vertices=[];for(let i=0;i<5;i++){const x=-.1+i*.7;for(const [z,height] of [[-1.05,.83+i*.19],[1.05,.65-i*.13]]){const y=height+.003;vertices.push(x-.34,y,z,x+.34,y,z);for(const [dz,offset] of [[-.23,-.1],[.23,.1]])vertices.push(x+offset,y,z+dz-.21,x+offset,y,z+dz+.21)}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const joints=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xb1a48c}));joints.name='emotion-stair-tread-joints';root.add(joints)}
  // Courses on the exposed outer faces turn the solid stair supports into
  // readable masonry; the walking surfaces and route indicators stay clear.
  {const vertices=[];for(let i=0;i<5;i++){const x=-.1+i*.7;for(const [z,height] of [[-1.514,.83+i*.19],[1.514,.65-i*.13]]){const courses=Math.ceil(height/.22);for(let row=0;row<courses;row++){const y0=row*height/courses,y1=(row+1)*height/courses;if(row>0)vertices.push(x-.345,y0,z,x+.345,y0,z);const split=x+(row%2?.1:-.1);vertices.push(split,y0+.008,z,split,y1-.008,z)}}}
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const joints=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xa99b85}));joints.name='emotion-stair-masonry';root.add(joints)}
  // Faceted ground supports the upper pavilion and slopes alongside the ascending route.
  const hillProfile=new THREE.Shape();hillProfile.moveTo(-.35,0);hillProfile.lineTo(-.35,.12);hillProfile.lineTo(.12,.24);hillProfile.lineTo(.55,.43);hillProfile.lineTo(1.05,.51);hillProfile.lineTo(1.55,.78);hillProfile.lineTo(2.05,.91);hillProfile.lineTo(2.58,1.32);hillProfile.lineTo(2.58,0);hillProfile.closePath();
  const ridge=attach(root,new THREE.ExtrudeGeometry(hillProfile,{depth:1.2,bevelEnabled:false}),0x899681,0,0,-2.24);ridge.name='emotion-upper-hillside';
  // Continue the hillside through the gap between the two paths. Keeping
  // its banks inside the gap preserves both tread surfaces and the marker.
  const middleHill=attach(root,new THREE.ExtrudeGeometry(hillProfile,{depth:1.1,bevelEnabled:false}),0x899681,0,0,-.55);middleHill.name='emotion-middle-hillside';
  for(const [x,y,z] of [[.2,.275,-.08],[.95,.495,.12],[1.75,.832,-.1],[2.4,1.18,.12]]){const shrub=new THREE.Group();shrub.name='emotion-middle-hill-shrub';shrub.position.set(x,y,z);root.add(shrub);for(let i=0;i<9;i++){const a=i*2.399963,r=.04+.045*(i%3),leaf=attach(shrub,new THREE.SphereGeometry(.12,8,6),i%3?0x748c66:0xa5a96f,Math.cos(a)*r,.075+(i%2)*.035,Math.sin(a)*r);leaf.scale.set(.65,.7,1.25);leaf.rotation.y=-a}for(let i=0;i<3;i++){const a=i*Math.PI*2/3;attach(shrub,new THREE.SphereGeometry(.035,8,6),0xd4b775,Math.cos(a)*.1,.19,Math.sin(a)*.1)}}
  // Low foliage follows the outside slope behind the ascending route.
  for(const [x,y] of [[.2,.275],[.95,.495],[1.75,.832],[2.4,1.18]]){const shrub=new THREE.Group();shrub.name='emotion-hillside-shrub';shrub.position.set(x,y,-1.94);root.add(shrub);for(let i=0;i<7;i++){const a=i*2.399963,r=.045+.035*(i%3),leaf=attach(shrub,new THREE.SphereGeometry(.12,8,6),i%2?0x758b66:0x91a070,Math.cos(a)*r,.08+(i%2)*.025,Math.sin(a)*r);leaf.scale.set(.72,.65,1.25);leaf.rotation.y=-a}for(let i=0;i<3;i++){const a=i*Math.PI*2/3,flower=attach(shrub,new THREE.SphereGeometry(.035,8,6),0xd2b46f,Math.cos(a)*.09,.19,Math.sin(a)*.09);flower.name='emotion-hillside-flower'}}
  const rockProfile=new THREE.Shape();rockProfile.moveTo(-.625,0);rockProfile.lineTo(-.625,.47);rockProfile.lineTo(-.59,1.05);rockProfile.lineTo(-.57,1.7);rockProfile.lineTo(.57,1.7);rockProfile.lineTo(.66,1.29);rockProfile.lineTo(.61,.75);rockProfile.lineTo(.625,0);rockProfile.closePath();
  const pavilionBase=attach(root,new THREE.ExtrudeGeometry(rockProfile,{depth:1.3,bevelEnabled:false}),0xa8ac96,3.45,0,-1.7);pavilionBase.name='emotion-pavilion-base';
  for(const [x,y,z,sx,sy,sz] of [[2.9,.24,-1.69,.32,.25,.18],[3.3,.37,-1.72,.38,.4,.2],[3.78,.31,-1.7,.35,.3,.18],[4.04,.69,-1.53,.16,.5,.25]]){const rock=attach(root,new THREE.DodecahedronGeometry(1,0),0x9b9f8c,x,y,z);rock.scale.set(sx,sy,sz);rock.name='emotion-hillside-rock'}
  attach(root,new THREE.CylinderGeometry(.72,.82,.14,24),0xd0c0a3,3.45,1.78,-1.05);
  for(let i=0;i<6;i++){const a=i*Math.PI/3,x=3.45+Math.cos(a)*.52,z=-1.05+Math.sin(a)*.52;attach(root,new THREE.CylinderGeometry(.07,.07,.7,10),0xd0c0a3,x,2.18,z);for(const y of [1.86,2.51]){const cap=attach(root,new THREE.CylinderGeometry(.105,.105,.055,12),0xe0cba8,x,y,z);cap.name='emotion-pavilion-column-cap'}}
  const dome=attach(root,new THREE.SphereGeometry(.8,24,12,0,Math.PI*2,0,Math.PI/2),0xc8b896,3.45,2.53,-1.05);dome.scale.y=.58;attach(root,new THREE.SphereGeometry(.07,10,8),0xd0c0a3,3.45,3,-1.05);
  // Slender evergreens frame the upper destination from behind the walking route.
  for(const [x,height] of [[2.8,2.15],[3.45,2.55],[4.1,2.05]]){const tree=new THREE.Group();tree.name='emotion-pavilion-evergreen';tree.position.set(x,0,-2.08);root.add(tree);attach(tree,new THREE.CylinderGeometry(.045,.075,.65,8),0x795844,0,.325,0);const foliage=attach(tree,new THREE.ConeGeometry(.2,height-.38,10),0x637a5a,0,.38+(height-.38)/2,0);foliage.name='emotion-evergreen-crown'}
  const pavilionRim=attach(root,new THREE.TorusGeometry(.77,.045,8,32),0xe0cba8,3.45,2.55,-1.05);pavilionRim.rotation.x=Math.PI/2;
  for(const angle of [.24,.48,.72]){const ring=attach(root,new THREE.TorusGeometry(.8*Math.cos(angle),.012,6,48),0xa99d89,3.45,2.53+.464*Math.sin(angle),-1.05);ring.rotation.x=Math.PI/2;ring.name='emotion-dome-course'}
  const pond=attach(root,new THREE.CylinderGeometry(.62,.68,.2,24),0x789a9a,3.45,.1,1.05);pond.name='emotion-pool';
  // A low opening behind the pool gives the descending route a destination.
  const caveShape=new THREE.Shape();caveShape.moveTo(-.65,0);caveShape.lineTo(-.65,.72);for(let i=0;i<=24;i++){const a=Math.PI-i*Math.PI/24;caveShape.lineTo(Math.cos(a)*.65,.72+Math.sin(a)*.65)}caveShape.lineTo(.65,0);caveShape.closePath();
  const cave=attach(root,new THREE.ShapeGeometry(caveShape),0x4f655e,3.45,.06,-.28);cave.name='emotion-cave';cave.material.side=THREE.DoubleSide;
  // The arched inner shell extends behind the entrance to the recessed back,
  // so the opening is a shallow grotto rather than a painted facade.
  {const vertices=[],indices=[],segments=32;for(let i=0;i<=segments;i++){const a=Math.PI-i*Math.PI/segments,x=3.45+.65*Math.cos(a),y=.78+.65*Math.sin(a);vertices.push(x,y,.23,x,y,-.28);if(i<segments){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const shell=attach(root,geometry,0x718476,0,0,0);shell.name='emotion-cave-inner-shell';shell.material.side=THREE.DoubleSide;for(const x of [2.8,4.1]){const side=box(x,.42,-.025,.025,.72,.51,0x718476);side.name='emotion-cave-inner-wall'}}
  for(const x of [2.73,4.17])box(x,.43,.26,.2,.86,.22,0xb5aa92);
  attach(root,new THREE.TorusGeometry(.72,.11,8,32,Math.PI),0xb5aa92,3.45,.86,.26);
  // Radial joints suggest individual voussoirs around the cave entrance.
  {const vertices=[];for(let i=1;i<10;i++){const a=i*Math.PI/10;vertices.push(3.45+.62*Math.cos(a),.86+.62*Math.sin(a),.375,3.45+.82*Math.cos(a),.86+.82*Math.sin(a),.375)}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const joints=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0x8d8979}));joints.name='emotion-cave-arch-joints';root.add(joints)}
  // Faceted outcrops frame the low opening without obstructing its watercourse.
  {const rockGeometry=new THREE.DodecahedronGeometry(1,0);for(const [x,y,z,sx,sy,sz,angle] of [[2.49,.37,.08,.34,.4,.31,.2],[2.57,.85,-.02,.28,.4,.3,-.1],[4.41,.38,.08,.34,.4,.31,-.2],[4.33,.85,-.02,.28,.4,.3,.1],[3.45,1.68,.04,.55,.16,.24,.1]]){const rock=attach(root,rockGeometry,0x9f9b89,x,y,z);rock.scale.set(sx,sy,sz);rock.rotation.y=angle;rock.name='emotion-cave-outcrop'}}
  // Continuous rocky shoulders connect the cave surround to the pavilion
  // hill while leaving the recessed arch and the stream unobstructed.
  {const profiles=[[[2.38,0],[2.42,.52],[2.53,1.06],[2.65,1.46],[2.77,1.58],[2.77,0]],[[4.13,0],[4.13,1.58],[4.28,1.44],[4.39,1.02],[4.48,.45],[4.5,0]],[[2.76,1.7],[2.85,1.84],[3.22,1.93],[3.7,1.88],[4.13,1.7]]];
   for(const points of profiles){const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const shoulder=attach(root,new THREE.ExtrudeGeometry(shape,{depth:.38,bevelEnabled:false}),0x9b9f8d,0,0,-.2);shoulder.name='emotion-cave-rock-mass';shoulder.castShadow=false}
  }
  // A gently flared falling sheet meets the pool instead of a rigid rectangle.
  {const vertices=[],indices=[],rows=16,cols=8;for(let row=0;row<=rows;row++){const t=row/rows,y=.58*t,width=.14-.025*t,z=.022-.035*t;for(let col=0;col<=cols;col++){const u=col/cols*2-1;vertices.push(u*width,y,z+.008*Math.sin(t*8+u*4)*Math.sin(Math.PI*t));if(row<rows&&col<cols){const n=row*(cols+1)+col;indices.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1)}}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const fall=attach(root,geometry,0x91b7af,3.45,.2,-.18);fall.name='emotion-waterfall';fall.material.side=THREE.DoubleSide;fall.castShadow=false;
   const streaks=[];for(const x of [-.075,-.025,.025,.075])for(let i=0;i<7;i++){const t0=.09+i*.11,t1=t0+.07;streaks.push(x, t0*.58,.029-.035*t0,x+.008*Math.sin(i),t1*.58,.029-.035*t1)}const linesGeometry=new THREE.BufferGeometry();linesGeometry.setAttribute('position',new THREE.Float32BufferAttribute(streaks,3));const lines=new THREE.LineSegments(linesGeometry,new THREE.LineBasicMaterial({color:0xc7dcd1,transparent:true,opacity:.8}));lines.name='emotion-waterfall-streaks';lines.position.copy(fall.position);root.add(lines);
  }
  const water=box(3.45,.204,.45,.25,.008,1.28,0x8fb1aa);water.name='emotion-stream';for(const r of [.2,.38]){const ripple=attach(root,new THREE.TorusGeometry(r,.01,6,32),0xc5d6cb,3.45,.206,1.05);ripple.rotation.x=Math.PI/2;ripple.name='emotion-pool-ripple'}
  // A small autumn tree on the outer bank gives the descending destination
  // its own silhouette and warm colour, while leaving the watercourse open.
  {const tree=new THREE.Group();tree.name='emotion-autumn-tree';tree.position.set(4.17,0,1.62);root.add(tree);const wood=0x80624a;
   function branch(points,radius){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),part=attach(tree,new THREE.TubeGeometry(curve,18,radius,7,false),wood,0,0,0);part.name='emotion-autumn-branch';return curve}
   branch([[0,0,0],[-.04,.42,0],[-.08,.82,.02],[-.12,1.15,0]],.075);
   const boughs=[[[ -.06,.58,0],[-.27,.93,.03],[-.5,1.2,.02]],[[-.09,.82,.01],[.14,1.07,-.03],[.3,1.35,-.06]],[[-.1,1,0],[-.21,1.3,.12],[-.3,1.56,.12]],[[ -.06,.66,0],[.12,.91,.14],[.38,1.1,.2]]];
   const leafGeometry=new THREE.SphereGeometry(1,8,6),leafColors=[0xb76b4e,0xca815c,0xd59768];
   boughs.forEach((points,k)=>{const curve=branch(points,.035);for(let i=0;i<18;i++){const t=.52+.45*((i*7)%18)/17,p=curve.getPoint(t),a=i*2.399963,r=.035+.16*Math.sqrt((i+.5)/18),leaf=attach(tree,leafGeometry,leafColors[(i+k)%3],p.x+Math.cos(a)*r,p.y+Math.sin(a)*r*.55,p.z+Math.sin(a)*r);leaf.scale.set(.11,.032,.065);leaf.rotation.set(.25*Math.sin(a),a,.32*Math.cos(a));leaf.name='emotion-autumn-leaf'}});
  }
  for(let i=0;i<7;i++){const a=-Math.PI*.45+i*Math.PI*.9/6,rock=attach(root,new THREE.DodecahedronGeometry(.16,0),0xb9ad94,3.45+Math.cos(a)*.74,.12,1.05+Math.sin(a)*.74);rock.scale.y=.65}
  {const geometry=new THREE.SphereGeometry(1,8,6),dummy=new THREE.Object3D();for(const [x,z] of [[-3.5,-1.65],[-3.5,1.65],[3.7,1.7]]){const shrub=new THREE.Group();shrub.name='emotion-border-shrub';shrub.position.set(x,0,z);root.add(shrub);const leaves=new THREE.InstancedMesh(geometry,mat(0x728c6e),36);leaves.name='emotion-shrub-leaves';for(let i=0;i<36;i++){const a=i*2.399963,r=.04+.25*Math.sqrt(((i*13)%37)/36);dummy.position.set(Math.cos(a)*r,.08+(i%5)*.055,Math.sin(a)*r*.8);dummy.rotation.set(.3*Math.sin(i),a,.45*Math.cos(i));dummy.scale.set(.11,.07,.045);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)}leaves.computeBoundingSphere();shrub.add(leaves)}}
  for(const [x,z] of [[-3.15,1.45],[-3.4,-1.35],[1.3,-1.85],[2.2,1.8]])for(let i=0;i<3;i++){const leaf=ball(x+(i-1)*.12,.18,z,.13,i%2?0x9a805f:0x788f6d);leaf.scale.set(.7,1.3,.6)}
  const marker=ball(0,1,0,.13,0xe7c179);marker.name='emotion-path-marker';
  const halo=attach(root,new THREE.TorusGeometry(.24,.035,8,24),0xe7c179,0,1,0);halo.rotation.x=Math.PI/2;halo.name='emotion-path-halo';
  sync=s=>{const i=s.example?3:1,step=(s.frame?downSteps:upSteps)[i];marker.position.set(step.position.x,step.geometry.parameters.height+.16,step.position.z);halo.position.set(step.position.x,step.geometry.parameters.height+.035,step.position.z);upSign.material.color.setHex(s.frame?0xa5a99b:0xe4bb71);downSign.material.color.setHex(s.frame?0xe4bb71:0xa5a99b)};
 }
 const syncDetails=addStudyDetails(root,id);
 let state=null;return {setInteraction(s){state=s;sync(s);syncDetails(s)},update(t,value){root.rotation.y=(value-.5)*.08;if(state){sync(state);syncDetails(state)}},dispose(){scene.remove(root);disposeSceneGraph(root)}};
}
