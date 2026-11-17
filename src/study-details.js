import * as THREE from 'three';

// Stylized, original visual detail; studies remain illustrations, not replicas or data.
// Attached to the study root so its existing lifecycle owns every resource.
export function addStudyDetails(root,id){
 const group=new THREE.Group();group.name='study-details';root.add(group);
 const palette={stone:0xb3a58c,light:0xe3d7bf,paving:0xc4b9a2,earth:0x998e78,wood:0x795844,dark:0x43554b,green:0x758d70,red:0xaa6a51,gold:0xc69e67,blue:0x7898a0};
 const materials=new Map();let activeParent=group;
 function material(key){if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color:palette[key],roughness:.88}));return materials.get(key)}
 function add(geometry,key,x,y,z,parent=activeParent){const mesh=new THREE.Mesh(geometry,material(key));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
 const box=(x,y,z,w,h,d,k,p)=>add(new THREE.BoxGeometry(w,h,d),k,x,y,z,p);
 const ball=(x,y,z,r,k,p)=>add(new THREE.SphereGeometry(r,12,8),k,x,y,z,p);
 const cylinder=(x,y,z,r,h,k,p)=>add(new THREE.CylinderGeometry(r,r,h,12),k,x,y,z,p);
 function line(a,b,r,k,p=activeParent){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from);const m=add(new THREE.CylinderGeometry(r,r,delta.length(),8),k,0,0,0,p);m.position.copy(from.add(to).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m}
 function table(x,z,w=1.7){box(x,.68,z,w,.12,.9,'wood');for(const dx of [-w*.4,w*.4])for(const dz of [-.32,.32])box(x+dx,.34,z+dz,.1,.68,.1,'wood')}
 function book(x,y,z,k='red'){box(x,y,z,.5,.1,.35,k);box(x,y+.02,z,.44,.05,.32,'light')}
 function plant(x,z){cylinder(x,.2,z,.18,.35,'red');line([x,.4,z],[x,.95,z],.035,'green');for(const [dx,dy,dz] of [[-.18,.72,0],[.17,.85,.02],[0,1.02,-.07]]){const leaf=ball(x+dx,dy,z+dz,.17,'green');leaf.scale.set(.7,1.3,.55)}}
 function wallFrame(x,y,z,w,h){for(const dx of [-w/2,w/2])box(x+dx,y,z,.12,h,.16,'wood');for(const dy of [-h/2,h/2])box(x,y+dy,z,w,.12,.16,'wood')}
 switch(id){
 case 'language-wall':
  // Individual paving slabs sit flush beneath the two workspaces.
  {const base=add(new THREE.CylinderGeometry(4.55,4.55,.045,64),'stone',0,-.0275,0);base.name='language-paving-base';
   // Voronoi slabs make irregular stone paving without changing the floor
   // height under the participants, furniture or message tray.
   const sites=[];for(let row=-6;row<=6;row++)for(let col=-6;col<=6;col++){const x=col*.72+.13*Math.sin(row*5.1+col*7.2),z=row*.72+.13*Math.sin(col*4.3-row*6.7);if(Math.hypot(x,z)<4.75)sites.push([x,z])}
   const vertices=[],colors=[],border=Array.from({length:64},(_,i)=>{const a=i*Math.PI*2/64;return [4.52*Math.cos(a),4.52*Math.sin(a)]});
   for(let cell=0;cell<sites.length;cell++){const [sx,sz]=sites[cell];let polygon=border.map(p=>p.slice());for(let other=0;other<sites.length&&polygon.length;other++){if(other===cell)continue;const [tx,tz]=sites[other],dx=tx-sx,dz=tz-sz;if(Math.abs(dx)>1.7||Math.abs(dz)>1.7)continue;const limit=(tx*tx+tz*tz-sx*sx-sz*sz)/2,inside=p=>p[0]*dx+p[1]*dz-limit,next=[];for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],da=inside(a),db=inside(b);if(da<=0)next.push(a);if((da<0&&db>0)||(da>0&&db<0)){const t=da/(da-db);next.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}polygon=next}if(polygon.length<3)continue;
    const center=polygon.reduce((a,p)=>[a[0]+p[0]/polygon.length,a[1]+p[1]/polygon.length],[0,0]),corners=polygon.map(p=>[center[0]+(p[0]-center[0])*.95,center[1]+(p[1]-center[1])*.95]),color=new THREE.Color(0xc8bba4).multiplyScalar(.94+.1*(.5+.5*Math.sin(cell*7.3)));for(let i=1;i<corners.length-1;i++)for(const p of [corners[0],corners[i+1],corners[i]]){vertices.push(p[0],-.004,p[1]);colors.push(color.r,color.g,color.b)}}
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();const slabMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,side:THREE.DoubleSide});const slabs=new THREE.Mesh(geometry,slabMaterial);slabs.name='language-paving-slabs';slabs.castShadow=false;slabs.receiveShadow=true;group.add(slabs)
  }
  for(const x of [-2.6,2.6]){table(x,-1.15,1.55);for(let i=0;i<3;i++)book(x-.48,.81+i*.1,-1.1,i%2?'blue':'red');plant(x,1.65)}
  for(const side of [-1,1]){for(const z of [-.62,.62]){const jamb=box(side*.16,1.23,z,.12,.28,.1,'wood');jamb.name='language-passage-frame'}for(const y of [1.06,1.4]){const rail=box(side*.16,y,0,.12,.08,1.34,'wood');rail.name='language-passage-frame'}}const tray=box(0,1.14,0,1.6,.08,1.2,'wood');tray.name='language-message-tray';
  // Masonry joints stop at the message opening, keeping the passage unobstructed.
  for(const side of [-1,1]){for(const y of [.3,.65,.95,1.48,1.8,2.12])for(const z of [-1.32,1.32])box(side*.129,y,z,.012,.016,1.25,'stone');
   for(const y of [.3,.65,.95,1.48,1.8,2.12])for(const z of [-1.72,-.92,.92,1.72])box(side*.13,y+.14,z,.012,.25,.018,'stone');
   // Continue the courses above and below the opening without crossing the slot.
   for(const y of [.3,.65,.95,1.48,1.8,2.12]){const joint=box(side*.13,y,0,.012,.016,1.26,'stone');joint.name='language-central-mortar';if(y!==.95)for(const z of [-.4,.4]){const upright=box(side*.131,y+.14,z,.012,.25,.018,'stone');upright.name='language-central-mortar'}}}
  // Neutral sketches on both faces identify the shared subject without revealing a build result.
  for(const side of [-1,1]){const x=side*.145,paper=box(x,1.91,0,.025,.68,.58,'light');paper.name='language-wall-sketch';const face=side*.163;for(const [a,b] of [[[-.19,1.69],[.19,1.69]],[[-.19,1.69],[-.19,1.94]],[[.19,1.69],[.19,1.94]],[[-.25,1.94],[0,2.13]],[[0,2.13],[.25,1.94]],[[-.055,1.69],[-.055,1.86]],[[-.055,1.86],[.055,1.86]],[[.055,1.86],[.055,1.69]]]){const stroke=line([face,a[1],a[0]],[face,b[1],b[0]],.009,'dark');stroke.name='language-wall-sketch-line'}for(const z of [-.25,.25]){const pin=ball(side*.166,2.21,z,.035,'wood');pin.scale.x=.35}}
  // Source-side sketch and receiver-side loose parts are visual props, not messages.
  box(-2.25,.755,-1.3,.65,.025,.45,'light');for(const [a,b] of [[[-2.48,.773,-1.17],[-2.02,.773,-1.17]],[[-2.48,.773,-1.17],[-2.48,.773,-1.38]],[[-2.02,.773,-1.17],[-2.02,.773,-1.38]],[[-2.48,.773,-1.38],[-2.25,.773,-1.52]],[[-2.25,.773,-1.52],[-2.02,.773,-1.38]]])line(a,b,.009,'dark');
  for(let i=0;i<3;i++){const piece=box(2.45+i*.23,.79,-1.4,.18,.1,.18,i===1?'blue':'stone');piece.name='language-loose-part'}
  // A pencil cup and a mallet identify the two workspaces without encoding a result.
  const pencilCup=cylinder(-2.7,.825,-1.05,.09,.17,'blue');pencilCup.name='language-pencil-cup';for(let i=-1;i<=1;i++){const pencil=line([-2.7+i*.04,.9,-1.05],[-2.7+i*.07,1.18,-1.05],.012,i===0?'dark':'gold');pencil.name='language-pencil'}
  const mallet=new THREE.Group();mallet.name='language-mallet';group.add(mallet);line([2.7,.79,-.93],[3.12,.79,-.93],.035,'wood',mallet);box(3.12,.83,-.93,.14,.18,.22,'dark',mallet);
  for(const x of [-3.8,3.8]){box(x,.95,-1.85,.65,1.8,.3,'wood');for(const y of [.4,.95,1.5]){box(x,y,-1.65,.6,.08,.35,'wood');for(let i=0;i<3;i++)box(x-.18+i*.18,y+.16,-1.65,.12,.25,.2,i===1?'red':'blue')}}
  break;
 case 'pigeon':
  for(const x of [-3.7,3.7])for(const z of [-1.9,1.9])box(x,1.4,z,.12,2.8,.12,'wood');
  // Clear panels delineate the chamber while keeping the bird and timer visible.
  {const glass=new THREE.MeshStandardMaterial({color:0xc1d7cc,transparent:true,opacity:.08,roughness:.2,side:THREE.DoubleSide,depthWrite:false});for(const x of [-3.7,3.7]){const pane=new THREE.Mesh(new THREE.PlaneGeometry(3.68,2.68),glass);pane.position.set(x,1.4,0);pane.rotation.y=Math.PI/2;pane.name='pigeon-side-pane';pane.castShadow=false;group.add(pane)}}
  {const front=new THREE.Mesh(new THREE.PlaneGeometry(7.26,2.68),new THREE.MeshStandardMaterial({color:0xc1d7cc,transparent:true,opacity:.045,roughness:.2,side:THREE.DoubleSide,depthWrite:false}));front.position.set(0,1.4,1.89);front.name='pigeon-front-pane';front.castShadow=false;group.add(front);const rail=box(0,.06,1.9,7.35,.12,.12,'wood');rail.name='pigeon-front-rail'}
  box(0,1.4,-1.95,7.4,2.8,.1,'light');box(0,2.82,-1.9,7.5,.12,.12,'wood');
  // A lower protective wall panel adds depth to the chamber's interior.
  const wallPanel=box(0,.42,-1.894,7.22,.76,.012,'green');wallPanel.name='pigeon-lower-wall-panel';
  const panelTrim=box(0,.81,-1.88,7.22,.035,.025,'wood');panelTrim.name='pigeon-wall-panel-trim';
  const floor=box(0,-.04,0,7.4,.08,3.8,'stone');floor.name='pigeon-floor';const foodTray=box(3,.12,-1.15,1.1,.15,.8,'wood');foodTray.name='pigeon-food-tray';
  for(const x of [-3.7,3.7])box(x,2.8,0,.12,.12,3.8,'wood');box(0,2.82,1.9,7.5,.12,.12,'wood');for(const x of [-3.1,-1.6,0]){const bar=box(x,2.8,0,.035,.05,3.8,'wood');bar.name='pigeon-roof-support';bar.castShadow=false}
  // A tapered outlet is separate from the state-controlled food in the tray.
  {const chute=add(new THREE.ConeGeometry(.24,.35,4),'dark',3,.52,-1.48);chute.rotation.z=Math.PI;chute.rotation.y=Math.PI/4;chute.name='pigeon-feeder-chute'}
  {const hopper=add(new THREE.CylinderGeometry(.35,.17,.25,4),'green',3,.825,-1.48);hopper.rotation.y=Math.PI/4;hopper.name='pigeon-feeder-hopper'}
  box(3,1.15,-1.7,.8,1.3,.35,'dark');
  // Fixed stored grain is behind the window; only the separate tray pellets indicate deliveries.
  {const grainGeometry=new THREE.SphereGeometry(.045,8,6);for(let row=0;row<4;row++)for(let col=0;col<6;col++){const grain=add(grainGeometry,'gold',2.76+col*.096,1.01+row*.095,-1.43);grain.name='pigeon-stored-grain'}const pane=new THREE.Mesh(new THREE.PlaneGeometry(.6,.65),new THREE.MeshStandardMaterial({color:0xaad0c5,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false}));pane.position.set(3,1.25,-1.36);pane.name='pigeon-storage-window';pane.castShadow=false;group.add(pane)}
  {const ring=add(new THREE.TorusGeometry(.67,.055,8,32),'wood',1.5,1.7,-1.58);ring.name='pigeon-clock-rim';ring.rotation.y=0}
  for(let x=-3.35;x<=3.36;x+=.4){const bar=box(x,2.81,0,.035,.045,3.8,'wood');bar.castShadow=false}
  for(const z of [-1.45,-1.25,-1.05,-.85])box(-3.68,1.25,z,.04,1.2,.045,'wood');
  // A tray rim encloses the state-controlled pellets; stored food is not drawn as a reward.
  for(const z of [-1.5,-.8])box(3,.23,z,1.08,.12,.08,'wood');for(const x of [2.5,3.5])box(x,.23,-1.15,.08,.12,.7,'wood');
  box(3,1.62,-1.46,.9,.12,.5,'green');for(const x of [2.65,3.35])box(x,1.25,-1.43,.07,.65,.08,'wood');for(const y of [.95,1.55])box(3,y,-1.43,.73,.07,.08,'wood');
  box(2.35,1.8,-1.68,.35,.3,.24,'green');for(let i=0;i<3;i++)box(2.23+i*.11,1.8,-1.54,.035,.23,.03,'gold');
  // A fixed dial and connecting tube decorate the timer; neither is a reward indicator.
  {const dial=add(new THREE.TorusGeometry(.13,.025,8,24),'gold',2.35,1.8,-1.54);dial.name='pigeon-mechanism-dial';for(let i=0;i<6;i++){const a=i*Math.PI/3;line([2.35,1.8,-1.535],[2.35+Math.sin(a)*.11,1.8+Math.cos(a)*.11,-1.535],.012,'gold')}line([2.5,1.8,-1.58],[2.7,1.8,-1.58],.035,'gold');line([2.7,1.8,-1.58],[2.7,1.62,-1.58],.035,'gold')}
  // A closed timer housing, visible gear and plain drum are fixed scenery;
  // they do not depict extra trials or add another response counter.
  {const housing=box(3,2.08,-1.72,1.02,.52,.3,'green');housing.name='pigeon-timer-housing';
   const rim=add(new THREE.TorusGeometry(.17,.025,7,24),'gold',2.76,2.08,-1.535);rim.name='pigeon-timer-gear';
   for(let i=0;i<8;i++){const a=i*Math.PI/4;line([2.76,2.08,-1.53],[2.76+Math.sin(a)*.15,2.08+Math.cos(a)*.15,-1.53],.012,'gold')}
   const hub=ball(2.76,2.08,-1.51,.045,'gold');hub.scale.z=.4;
   const drum=cylinder(3.21,2.08,-1.5,.13,.25,'light');drum.rotation.z=Math.PI/2;drum.name='pigeon-timer-drum';
   for(const x of [3.08,3.34]){const end=cylinder(x,2.08,-1.5,.14,.025,'gold');end.rotation.z=Math.PI/2}
   line([3.2,1.82,-1.63],[3.2,1.69,-1.63],.025,'gold');
  }
  for(const x of [-3.7,3.7])for(const z of [-1.9,1.9]){const cap=ball(x,2.8,z,.095,'gold');cap.name='pigeon-frame-cap'}
  break;
 case 'induction':
  // Keep the front open so the hen, food and path remain visible at the default view.
  for(let x=-3.8;x<3.9;x+=.55)box(x,.45,-1.7,.08,.9,.08,'wood');
  box(0,.62,-1.7,7.8,.08,.08,'wood');
  // The closed end gate is scenery; it does not encode a future outcome.
  for(const z of [-.65,-.43,-.21,.01,.23,.45,.67]){const slat=box(3.8,.46,z,.09,.8,.16,'wood');slat.name='induction-gate'}
  for(const y of [.25,.7])box(3.86,y,0,.08,.09,1.5,'wood');line([3.9,.24,-.65],[3.9,.7,.65],.045,'wood');
  for(const z of [-.89,.89]){for(let course=0;course<4;course++){const block=box(3.8,.14+course*.27,z,.43,.265,.4,course%2?'stone':'paving');block.name='induction-gate-pier'}const cap=box(3.8,1.12,z,.5,.1,.47,'light');cap.name='induction-gate-pier-cap'}
  // Revolved cross-section includes a real inner surface and a rounded rim.
  const bowlProfile=[[0,0],[.28,0],[.36,.035],[.45,.17],[.46,.23],[.41,.23],[.38,.17],[.3,.12],[0,.12]].map(([r,y])=>new THREE.Vector2(r,y));
  const bowl=add(new THREE.LatheGeometry(bowlProfile,32),'red',-2,0,1.1);bowl.name='induction-main-bowl';plant(3.5,-1.3);
  // A shallow open-front shelter has a back, side walls and a raised nesting floor.
  const shelterPartsStart=group.children.length;
  {const shelter=new THREE.Group();shelter.name='induction-shelter';shelter.position.set(-3.35,0,-1.35);group.add(shelter);
   for(const x of [-.425,.425]){const side=box(x,.55,0,.1,1.02,.5,'wood',shelter);side.name='induction-shelter-wall'}
   const back=box(0,.55,-.225,.76,1.02,.05,'dark',shelter);back.name='induction-shelter-wall';
   const floor=box(0,.16,0,.76,.12,.45,'wood',shelter);floor.name='induction-shelter-floor';
   box(0,.96,.23,.76,.18,.07,'wood',shelter);box(0,.27,.23,.76,.08,.07,'wood',shelter);
   for(let i=0;i<11;i++){const straw=box(-.29+i*.057,.235,-.03+(i%3)*.08,.17,.018,.025,'gold',shelter);straw.rotation.y=(i%3-1)*.48;straw.name='induction-shelter-straw'}
  }
  for(const side of [-1,1]){const roof=box(-3.35+side*.26,1.14,-1.35,.62,.1,.7,'red');roof.rotation.z=-side*.48;box(-3.35+side*.42,.57,-1.04,.08,1,.08,'stone')}
  for(let i=0;i<4;i++){const tile=box(-3.35+(i-1.5)*.2,1.21,-1.35,.16,.06,.7,'red');tile.rotation.z=i<2?.48:-.48}
  for(const x of [-3.62,-3.08])for(const y of [.3,.55,.8])box(x,y,-1.055,.15,.015,.012,'light');
  // Scale the complete shelter about its ground anchor, including roof and trim.
  {const assembly=new THREE.Group();assembly.name='induction-shelter-assembly';for(const child of group.children.slice(shelterPartsStart))assembly.add(child);group.add(assembly);assembly.scale.set(1.1,1.4,1.1);assembly.position.set(.335,0,.135)}
  // A small fixed lantern hangs at the edge of the shelter; it is scenery,
  // independent of the advancing days and their outcomes.
  {const lantern=new THREE.Group();lantern.name='induction-shelter-lantern';lantern.position.set(-2.86,.18,-1.35);group.add(lantern);
   line([0,1.52,0],[0,1.37,0],.018,'dark',lantern);const cap=add(new THREE.ConeGeometry(.15,.12,4),'dark',0,1.31,0,lantern);cap.rotation.y=Math.PI/4;
   const glow=add(new THREE.BoxGeometry(.18,.22,.18),'gold',0,1.14,0,lantern);glow.name='induction-lantern-glass';
   for(const x of [-.1,.1])for(const z of [-.1,.1])box(x,1.14,z,.025,.25,.025,'dark',lantern);box(0,1.005,0,.24,.035,.24,'dark',lantern);
  }
  // A wooden feed barrel sits beside the shelter, away from the hen and bowl.
  {const barrel=new THREE.Group();barrel.name='induction-feed-barrel';barrel.position.set(-3.7,0,1.35);group.add(barrel);const body=add(new THREE.CylinderGeometry(.23,.26,.62,16),'wood',0,.31,0,barrel);body.name='induction-barrel-body';
   for(const y of [.12,.49]){const hoop=add(new THREE.TorusGeometry(y<.3?.254:.237,.018,6,24),'dark',0,y,0,barrel);hoop.rotation.x=Math.PI/2;hoop.name='induction-barrel-hoop'}
   for(let i=0;i<12;i++){const a=i*Math.PI/6,stave=line([Math.sin(a)*.255,.04,Math.cos(a)*.255],[Math.sin(a)*.233,.58,Math.cos(a)*.233],.007,'dark',barrel);stave.name='induction-barrel-stave'}
   add(new THREE.CylinderGeometry(.224,.224,.015,16),'paving',0,.627,0,barrel);
  }
  // Irregular paving leads from the feeding area toward the closed gate.
  for(let i=0;i<7;i++){const shape=new THREE.Shape();shape.moveTo(-.29,-.17);shape.lineTo(-.2,-.23);shape.lineTo(.18,-.21);shape.lineTo(.3,-.12);shape.lineTo(.28,.14);shape.lineTo(.16,.22);shape.lineTo(-.22,.2);shape.lineTo(-.31,.1);shape.closePath();const step=add(new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:1}),i%3?'stone':'light',-1.35+i*.72,0,.24+.1*Math.sin(i*.9));step.rotation.set(-Math.PI/2,0,(i%2?1:-1)*.06);step.name='induction-path-stone'}
  // Individually varied flagstones form a loose, staggered forecourt.
  {const perimeter=[[-.38,-.21],[-.27,-.29],[.24,-.28],[.39,-.15],[.35,.2],[.23,.29],[-.3,.27],[-.4,.13]],geometries=[];
   for(let variant=0;variant<9;variant++){const shape=new THREE.Shape();perimeter.forEach(([x,z],i)=>{const scale=.9+.16*((variant*13+i*7)%17)/16,px=x*scale,pz=z*(.92+.14*((variant*5+i*11)%19)/18);if(i===0)shape.moveTo(px,pz);else shape.lineTo(px,pz)});shape.closePath();geometries.push(new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelThickness:.008,bevelSize:.012,bevelSegments:1}))}
   for(let row=0;row<4;row++)for(let col=-4;col<=4;col++){const x=col*.82+(row%2)*.4+.045*Math.sin(row*4+col*2),z=1.72+row*.62+.035*Math.cos(row+col*3);if(Math.hypot(Math.abs(x)+.44,z+.35)>4.48)continue;const variant=((row*7+col*5)%9+9)%9,slab=add(geometries[variant],(row+col)%3===0?'paving':'stone',x,0,z);slab.rotation.set(-Math.PI/2,0,.075*Math.sin(col*4+row));slab.scale.set(.91+.045*Math.sin(col*3+row),.91+.045*Math.cos(row*2-col),1);slab.name='induction-forecourt-stone'}
  }
  {const bladeGeometry=new THREE.ConeGeometry(.035,.27,4);for(const [x,z] of [[-1.25,1.28],[-.5,1.37],[.25,1.32],[1,1.35],[1.7,1.28],[2.05,-1.46],[-.4,-1.47],[.6,-1.48]])for(let i=0;i<5;i++){const a=i*Math.PI*2/5,blade=add(bladeGeometry,'green',x+Math.cos(a)*.07,.13,z+Math.sin(a)*.07);blade.rotation.z=.22*Math.cos(a);blade.rotation.x=.22*Math.sin(a);blade.name='induction-grass-blade'}}
  {const hay=new THREE.Group();hay.name='induction-hay';hay.position.set(3.05,.32,.85);group.add(hay);const bale=box(0,0,0,.9,.64,.68,'gold',hay);bale.name='induction-hay-bale';
   for(const x of [-.27,.27]){const curve=new THREE.CatmullRomCurve3([[x,-.29,-.35],[x,.29,-.35],[x,.33,-.3],[x,.33,.3],[x,.29,.35],[x,-.29,.35],[x,-.33,.3],[x,-.33,-.3]].map(p=>new THREE.Vector3(...p)),true);const rope=add(new THREE.TubeGeometry(curve,32,.018,6,true),'light',0,0,0,hay);rope.name='induction-hay-binding'}
   for(let i=0;i<44;i++){const x=-.42+(i%11)*.084,offset=.035*Math.sin(i*2.7),y=.322,z=-.3+Math.floor(i/11)*.2;const straw=line([x,y,z+offset],[x+.07,y,z+.07+offset],.008,i%3?'gold':'paving',hay);straw.name='induction-hay-straw'}
   for(let i=0;i<24;i++){const x=-.4+(i%8)*.11,y=-.22+Math.floor(i/8)*.2;const straw=line([x,y,.344],[x+.08,y+.035,.344],.008,i%3?'gold':'paving',hay);straw.name='induction-hay-straw'}
  }
  {const tree=new THREE.Group();tree.name='induction-tree';group.add(tree);const trunk=[[-2.45,0,-2],[-2.5,.55,-2],[-2.4,1.12,-2.02],[-2.5,1.7,-2.04],[-2.36,2.1,-2.08]];for(let i=0;i<trunk.length-1;i++){const segment=line(trunk[i],trunk[i+1],.22-i*.032,'wood',tree);segment.name='induction-tree-trunk'}
   const tips=[[-3.38,2.2,-2.12],[-3.08,2.67,-2.12],[-2.75,3.02,-2.12],[-2.35,3.18,-2.16],[-1.87,3.02,-2.13],[-1.38,2.72,-2.04],[-.95,2.4,-2.08]];for(let i=0;i<tips.length;i++){const branch=line(trunk[i<2?2:3],tips[i],.075,'wood',tree);branch.name='induction-tree-branch'}
   const foliageGeometry=new THREE.SphereGeometry(1,8,6),foliageMaterials=[material('green'),material('gold'),new THREE.MeshStandardMaterial({color:0x89966c,roughness:.88})],dummy=new THREE.Object3D();for(let variant=0;variant<3;variant++){const leaves=new THREE.InstancedMesh(foliageGeometry,foliageMaterials[variant],120);leaves.name='induction-tree-leaves';for(let i=0;i<120;i++){const index=variant*120+i,center=tips[index%tips.length],angle=index*2.399963,r=.1+.4*Math.sqrt(((index*17)%59)/58);dummy.position.set(center[0]+Math.cos(angle)*r,center[1]+Math.sin(angle)*r*.6,center[2]+.28*Math.sin(index*1.17));dummy.rotation.set(.2*Math.sin(index),angle,.4*Math.cos(index));dummy.scale.set(.16,.075,.07);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)}leaves.computeBoundingSphere();tree.add(leaves)}}
  for(let i=0;i<5;i++){const stem=box(2.2+i*.15,.19,1.48,.025,.35,.025,'green');stem.rotation.z=(i-2)*.12;ball(2.2+i*.15,.38,1.48,.055,'light')}
  break;
 case 'schedules':
  // Neutral surface maps distinguish the stone surrounds and timber ledges
  // without introducing extra state-dependent lights or counters.
  {const size=128;function surface(kind){const data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4,noise=((x*37+y*59+x*y*7)%31)/30,grain=kind==='wood'?Math.pow(Math.max(0,Math.sin((y+2*Math.sin(x*.065))*.42)),8)*17:0,shade=Math.round(248-noise*(kind==='wood'?8:15)-grain);data[i]=data[i+1]=data[i+2]=shade;data[i+3]=255}const texture=new THREE.DataTexture(data,size,size);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;return texture}material('stone').map=surface('stone');material('wood').map=surface('wood')}
  // A continuous earth bed supports the flagstones outside the apparatus
  // platform; its top remains just below the existing functional parts.
  {const ground=add(new THREE.CylinderGeometry(4.62,4.62,.047,64),'earth',0,-.0265,0);ground.name='schedule-forecourt-ground';ground.receiveShadow=true}
  // A single leafy stem in the rear gap is shared scenery, not another
  // response or progress indicator.
  {const plant=new THREE.Group();plant.name='schedule-background-plant';plant.position.set(0,0,-2.1);group.add(plant);line([0,0,0],[0,3.15,0],.038,'wood',plant);
   const leafShape=new THREE.Shape();leafShape.moveTo(0,0);leafShape.quadraticCurveTo(-.16,.18,0,.39);leafShape.quadraticCurveTo(.16,.18,0,0);const leafGeometry=new THREE.ShapeGeometry(leafShape,10),leafMaterials=[material('green'),new THREE.MeshStandardMaterial({color:0x92a079,roughness:.88})];leafMaterials.forEach(m=>m.side=THREE.DoubleSide);
   for(const side of [-1,1])for(let branch=0;branch<3;branch++){const startY=1.93+branch*.31,endX=side*(.48+branch*.06),endY=startY+.33;line([0,startY,0],[endX,endY,0],.022,'wood',plant);for(let i=0;i<5;i++){const t=.18+i*.18,leaf=new THREE.Mesh(leafGeometry,leafMaterials[(branch+i+(side>0?1:0))%2]);leaf.position.set(endX*t,startY+(endY-startY)*t,.025*(i%2));leaf.scale.setScalar(.78+(i%3)*.06);leaf.rotation.z=-side*(.5+i*.1);leaf.name='schedule-background-leaf';plant.add(leaf)}}
   for(let i=0;i<6;i++){const side=i%2?1:-1,leaf=new THREE.Mesh(leafGeometry,leafMaterials[i%2]);leaf.position.set(side*.025,1.97+i*.19,.035);leaf.scale.setScalar(.72);leaf.rotation.z=-side*.75;leaf.name='schedule-background-leaf';plant.add(leaf)}
   const crown=new THREE.Mesh(leafGeometry,leafMaterials[1]);crown.position.set(0,3.02,.01);crown.scale.setScalar(.75);crown.name='schedule-background-leaf';plant.add(crown);
  }
  for(let i=0;i<7;i++){const tile=box((i-3)*.72,.025,2.05,.65,.05,.45,'stone');tile.rotation.y=(i%2?1:-1)*.04}
  // Low flagstones fill the forecourt without introducing extra progress markers.
  {const shape=new THREE.Shape();shape.moveTo(-.34,-.2);shape.lineTo(-.24,-.27);shape.lineTo(.23,-.25);shape.lineTo(.35,-.14);shape.lineTo(.32,.18);shape.lineTo(.2,.25);shape.lineTo(-.25,.24);shape.lineTo(-.36,.12);shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:.04,bevelEnabled:false});
   for(let row=0;row<3;row++)for(let col=-4;col<=4;col++){const x=col*.72+(row%2)*.36,z=2.42+row*.56;if(Math.hypot(Math.abs(x)+.36,z+.27)>4.6)continue;const slab=add(geometry,(row+col)%3?'stone':'paving',x,-.003,z);slab.rotation.set(-Math.PI/2,0,.025*((col+row*3)%5));slab.name='schedule-forecourt-stone'}
  }
  for(const side of [-1,1]){const x=side*4.25;for(let i=0;i<3;i++){const stem=box(x+i*.12*side,.26,1.05,.04,.5,.04,'green');stem.rotation.z=side*(i-1)*.2;const leaf=ball(x+i*.12*side,.53,1.05,.13,'green');leaf.scale.set(.55,1,.45)}const rock=add(new THREE.DodecahedronGeometry(.24,0),'stone',x,.13,1.55);rock.scale.y=.65}
  // Framing ornaments surround the active mode lamps without adding extra indicators.
  for(const x of [-2.35,2.35]){
   // A deep masonry arch and side returns give each cabinet a three-dimensional shell.
   const crownBand=new THREE.Shape();for(let i=0;i<=32;i++){const a=Math.PI-i*Math.PI/32,px=1.27*Math.cos(a),py=.48*Math.sin(a);if(i===0)crownBand.moveTo(px,py);else crownBand.lineTo(px,py)}for(let i=0;i<=32;i++){const a=i*Math.PI/32;crownBand.lineTo(1.1*Math.cos(a),.30*Math.sin(a))}crownBand.closePath();
   const shell=add(new THREE.ExtrudeGeometry(crownBand,{depth:.24,bevelEnabled:true,bevelSize:.015,bevelThickness:.015,bevelSegments:2}), 'stone',x,2.18,-1.23);shell.name='schedule-cabinet-crown-shell';
   for(const side of [-1,1]){const returnWall=box(x+side*1.22,1.28,-1.12,.18,1.82,.45,'stone');returnWall.name='schedule-cabinet-return';for(const y of [.56,.88,1.2,1.52,1.84]){const joint=box(x+side*1.225,y,-.886,.18,.014,.018,'light');joint.name='schedule-return-joint'}}
   for(const dx of [-1.18,1.18]){box(x+dx,1.26,-.78,.14,1.72,.18,'stone');box(x+dx,.48,-.75,.23,.14,.23,'light');box(x+dx,2.04,-.75,.23,.14,.23,'light')}
   for(const y of [.42,2.08])box(x,y,-.76,2.45,.12,.2,'stone');
   const innerArch=add(new THREE.TorusGeometry(1.04,.025,6,32,Math.PI),'gold',x,2.18,-.94);innerArch.scale.y=.33;innerArch.name='schedule-cabinet-arch-trim';
   // Shallow joints articulate the stone crowns without acting as indicators.
   for(let i=1;i<8;i++){const a=i*Math.PI/8,joint=box(x+Math.cos(a)*1.15,2.18+Math.sin(a)*.38,-.90,.018,.11,.018,'stone');joint.rotation.z=a-Math.PI/2;joint.name='schedule-crown-joint'}
   for(const side of [-1,1])for(const y of [.72,1.08,1.44,1.8])box(x+side*1.18,y,-.675,.13,.018,.025,'light');
   const lampRim=add(new THREE.TorusGeometry(.235,.024,7,28),'gold',x,1.45,-.69);lampRim.name='schedule-mode-rim';
   for(const dx of [-.9,.9]){const support=box(x+dx,.22,.14,.13,.44,.16,'wood');support.name='schedule-cabinet-support'}
   // Fixed wooden work ledge and plank seams do not encode schedule progress.
   const ledge=box(x,.45,-.04,2.15,.1,.44,'wood');ledge.name='schedule-cabinet-ledge';
   for(let i=1;i<9;i++){const seam=box(x-1.075+i*.239,.503,-.04,.012,.006,.39,'dark');seam.name='schedule-ledge-joint'}
   for(const dx of [-1.02,1.02]){const cap=add(new THREE.SphereGeometry(.075,10,8),'gold',x+dx,.45,.19);cap.scale.z=.35;cap.name='schedule-ledge-cap'}
   // Metal rails and side brackets are fixed furniture, not schedule indicators.
   const rail=cylinder(x,.46,.19,.026,1.94,'gold');rail.rotation.z=Math.PI/2;rail.name='schedule-ledge-rail';for(const dx of [-1.02,1.02]){const bracket=box(x+dx,.49,-.04,.13,.18,.5,'wood');bracket.name='schedule-ledge-bracket';const hub=add(new THREE.TorusGeometry(.055,.012,6,20),'gold',x+dx,.47,.22);hub.name='schedule-ledge-hub'}
   for(const side of [-1,1]){const lineX=x+side*1.07;for(const offset of [-.035,.035]){const groove=box(lineX+offset,1.3,-.671,.014,1.25,.012,'light');groove.name='schedule-frame-groove'}}
  }
  // One common row of progress bezels follows the existing nineteen state markers.
  {const bezelGeometry=new THREE.TorusGeometry(.1,.012,6,20);for(let i=0;i<19;i++){const bezel=add(bezelGeometry,'gold',-2.6+(i%10)*.57,.17+Math.floor(i/10)*.22,.805);bezel.name='schedule-progress-bezel'}}
  for(const y of [.035,.505])box(0,y,.765,5.65,.025,.055,'wood');for(const x of [-2.82,2.82])box(x,.27,.765,.025,.46,.055,'wood');
  {const bezel=add(new THREE.TorusGeometry(.34,.035,8,28),'gold',-3.35,.335,1.05);bezel.rotation.x=Math.PI/2;bezel.name='schedule-button-bezel'}
  for(let x=-3.55;x<=3.56;x+=.55){const tile=box(x,.007,1.64,.51,.014,.32,'light');tile.name='schedule-paving'}
  for(const x of [-4.2,4.2]){line([x,.08,-1.3],[x,1.3,-1.3],.035,'wood');for(let i=0;i<4;i++){const leaf=ball(x+(i%2?-.13:.13),.55+i*.23,-1.3,.13,'green');leaf.scale.set(.6,1.15,.45);leaf.rotation.z=i%2?-.55:.55}}
  break;
 case 'stimulation':
  // Background laboratory shelving contains fixed props, not response indicators.
  {const shelf=new THREE.Group();shelf.name='stimulation-supply-shelf';shelf.position.set(4.4,0,-1.25);shelf.scale.setScalar(.75);group.add(shelf);
   for(const x of [-.62,.62])box(x,1.25,0,.1,2.6,.28,'wood',shelf);for(const y of [.45,1.45,2.55])box(0,y,0,1.35,.1,.3,'wood',shelf);
   for(let i=0;i<3;i++){const h=[.42,.52,.46][i];box(-.45+i*.17,2.6+h/2,0,.13,h,.2,i===1?'green':'red',shelf)}
   const flask=add(new THREE.CylinderGeometry(.07,.16,.28,12),'light',.19,2.74,0,shelf);flask.name='stimulation-supply-flask';cylinder(.19,2.92,0,.07,.1,'gold',shelf);
   const pot=cylinder(.46,2.7,0,.13,.2,'red',shelf);pot.name='stimulation-supply-pot';for(const [dx,dy] of [[-.09,.18],[.08,.23],[0,.3]]){const leaf=ball(.46+dx,2.7+dy,0,.11,'green',shelf);leaf.scale.set(.6,1.1,.5)}
   // Fixed reference books and closed containers occupy the lower shelves;
   // none of these props encode a response, reward, or experimental trace.
   for(let i=0;i<4;i++){const height=.46+(i%3)*.07,book=box(-.44+i*.14,1.5+height/2,.015,.12,height,.22,i%2?'green':'red',shelf);book.name='stimulation-shelf-book';for(const y of [1.57,1.5+height-.07])box(-.44+i*.14,y,.132,.10,.012,.012,'gold',shelf)}
   for(const [x,height,color] of [[.2,.38,'blue'],[.45,.3,'light']]){const jar=cylinder(x,1.5+height/2,.015,.095,height,color,shelf);jar.name='stimulation-shelf-jar';cylinder(x,1.5+height+.025,.015,.1,.05,'gold',shelf)}
   for(const [x,height] of [[-.38,.3],[-.12,.38],[.17,.27]]){const bottle=cylinder(x,.5+height/2,.015,.09,height,'light',shelf);bottle.name='stimulation-shelf-bottle';cylinder(x,.5+height+.035,.015,.04,.07,'gold',shelf)}
  }
  // A blank recorder is a prop; no animal response trace is invented.
  box(4.18,.16,.35,1.05,.25,.95,'wood');
  {const housing=new THREE.Group();housing.name='stimulation-recorder-housing';group.add(housing);
   for(const x of [3.76,4.6])box(x,.68,.35,.12,.9,.8,'light',housing);
   for(const y of [.29,1.07])box(4.18,y,.35,.72,.12,.8,'light',housing);
   box(4.18,.68,-.02,.72,.66,.06,'dark',housing);
  }
  {const roll=cylinder(4.18,.68,.5,.22,.5,'light');roll.rotation.z=Math.PI/2;roll.name='stimulation-blank-roll';for(const x of [3.93,4.43]){const hub=cylinder(x,.68,.5,.09,.055,'gold');hub.rotation.z=Math.PI/2}for(const x of [3.96,4.4])cylinder(x,1.18,.35,.09,.1,'gold')}
  for(const x of [3.91,4.45]){const axle=cylinder(x,.68,.5,.07,.05,'gold');axle.rotation.z=Math.PI/2}
  {const lamp=new THREE.Group();lamp.name='stimulation-desk-lamp';lamp.position.set(-4.3,0,1.2);group.add(lamp);
   cylinder(0,.05,0,.34,.2,'dark',lamp);cylinder(0,1.42,0,.055,2.55,'gold',lamp);const joint=ball(0,2.7,0,.11,'gold',lamp);joint.scale.z=.65;
   line([0,2.7,0],[.58,3.08,0],.045,'gold',lamp);ball(.58,3.08,0,.09,'gold',lamp);
   const profile=[[0,.42],[.13,.4],[.26,.32],[.36,.16],[.39,0],[.34,0],[.31,.13],[.22,.25],[.1,.31],[0,.32]].map(([r,y])=>new THREE.Vector2(r,y));const shade=add(new THREE.LatheGeometry(profile,24),'dark',.72,2.72,0,lamp);shade.name='stimulation-lamp-shade';
   const rim=add(new THREE.TorusGeometry(.37,.018,6,32),'gold',.72,2.72,0,lamp);rim.rotation.x=Math.PI/2;
  }
  break;
 }
 return ()=>{};
}
