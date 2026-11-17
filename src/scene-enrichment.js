import * as THREE from 'three';
import {clearsSisyphusPath,sisyphusGround,sisyphusPath} from './sisyphus-path.js';

// Original low-poly geometry inspired by the review images, not historical reconstruction.
// Everything is attached to the scene root (or a moving child) for existing disposal.
export function enrichScene(id, root) {
 const group=new THREE.Group();group.name='render-inspired-detail';
 const parent=id==='ship'?root.getObjectByName('ship-hull'):root;parent.add(group);if(id==='ship')group.position.y=parent.userData.deckLift||0;
 const palette={stone:0xb4a58a,light:0xe0d4b9,wood:0x73523e,dark:0x3b5048,leaf:0x778261,gold:0xb99056,red:0xa8654b,water:0x87a9a2,rockA:0x9a8873,rockB:0x776e60};
 const materials=new Map();
 const mat=k=>{if(!materials.has(k))materials.set(k,new THREE.MeshStandardMaterial({color:palette[k],roughness:.88}));return materials.get(k)};
 function add(g,k,x=0,y=0,z=0,parent=group){const m=new THREE.Mesh(g,mat(k));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 const box=(w,h,d,k,x,y,z,p)=>add(new THREE.BoxGeometry(w,h,d),k,x,y,z,p);
 const sphere=(r,k,x,y,z,p)=>add(new THREE.IcosahedronGeometry(r,1),k,x,y,z,p);
 const cyl=(r1,r2,h,k,x,y,z,p)=>add(new THREE.CylinderGeometry(r1,r2,h,12),k,x,y,z,p);
 function link(a,b,r,k,p=group){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);const m=add(new THREE.CylinderGeometry(r,r,delta.length(),8),k,0,0,0,p);m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m}
 function shrub(x,z,s=1){const g=new THREE.Group();g.position.set(x,.12,z);g.scale.setScalar(s);group.add(g);for(const [dx,dy,dz,r] of [[0,.25,0,.28],[-.2,.18,.07,.19],[.2,.18,-.05,.2]])sphere(r,'leaf',dx,dy,dz,g)}
 function tree(x,z,s=1){const g=new THREE.Group();g.name='free-will-border-tree';g.position.set(x,.05,z);g.scale.setScalar(s);group.add(g);const trunk=[[0,0,0],[0,.55,0],[.1,1.05,0],[-.03,1.43,-.02]];for(let i=0;i<trunk.length-1;i++)link(trunk[i],trunk[i+1],.12-i*.022,'wood',g);const tips=[];for(let i=0;i<9;i++){const a=i*2.399963,r=.43+(i%3)*.08,tip=[Math.cos(a)*r,1.65+(i%3)*.14,Math.sin(a)*r];link(trunk[i%2?2:3],tip,.035,'wood',g);tips.push(tip)}const leaves=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),mat('leaf'),99),dummy=new THREE.Object3D();leaves.name='free-will-border-leaves';for(let i=0;i<99;i++){const tip=tips[i%9],a=i*2.399963,r=.04+.18*((i*11)%23)/22;dummy.position.set(tip[0]+Math.cos(a)*r,tip[1]+.1*Math.sin(i*1.3),tip[2]+Math.sin(a)*r);dummy.rotation.set(.2*Math.sin(i),a,.4*Math.cos(i));dummy.scale.set(.12,.065,.05);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix)}leaves.computeBoundingSphere();g.add(leaves);return g}
 function oliveTree(x,z,s=1){
  const g=new THREE.Group();g.name='sisyphus-olive';g.position.set(x,sisyphusGround(x,z),z);g.scale.setScalar(s);group.add(g);
  // Forked trunk and small leaf sprays give the tree a distinct silhouette.
  const trunk=[[0,0,0],[.09,.55,.02],[-.02,1.05,0],[.08,1.42,-.03]];
  for(let i=0;i<trunk.length-1;i++)link(trunk[i],trunk[i+1],.12-i*.025,'wood',g);
  const tips=[];for(let i=0;i<11;i++){
   const a=i*2.399963,r=.48+.16*(i%3),base=trunk[i%3?2:1],middle=[Math.cos(a)*r*.58,1.34+(i%3)*.12,Math.sin(a)*r*.58],tip=[Math.cos(a)*r,1.62+(i%4)*.09,Math.sin(a)*r];
   link(base,middle,.035,'wood',g);link(middle,tip,.018,'wood',g);tips.push(tip);
  }
  const leaves=new THREE.InstancedMesh(new THREE.SphereGeometry(.075,7,5),mat('leaf'),tips.length*9),dummy=new THREE.Object3D();leaves.name='sisyphus-olive-leaves';let index=0;
  for(let i=0;i<tips.length;i++)for(let j=0;j<9;j++){const a=j*2.399963+i*.31,r=.035+.12*(j%3)/2,t=tips[i];dummy.position.set(t[0]+Math.cos(a)*r,t[1]+(j%4)*.055,t[2]+Math.sin(a)*r);dummy.rotation.set(.45*Math.sin(a),a,.7*Math.cos(a));dummy.scale.set(.48,1.8,.35);dummy.updateMatrix();leaves.setMatrixAt(index++,dummy.matrix)}
  leaves.computeBoundingSphere();g.add(leaves);return g;
 }
 function arch(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);group.add(g);for(const side of [-1,1]){box(.27,2,.3,'stone',side*.8,1,0,g);box(.38,.16,.4,'light',side*.8,2,0,g);box(.4,.12,.42,'light',side*.8,.07,0,g)}const top=add(new THREE.TorusGeometry(.8,.14,8,24,Math.PI),'stone',0,2,0,g);return g}
 function book(x,y,z,k='red',p=group){box(.55,.1,.38,k,x,y,z,p);box(.48,.055,.34,'light',x,y+.01,z,p)}
 function paving(x,z,count=5){for(let i=0;i<count;i++)box(.55,.035,.46,i%2?'stone':'light',x+i*.58,.05,z)}
 const dynamic=[];
 switch(id){
 case 'sisyphus':
  oliveTree(-3.3,3.3,.9);for(const [x,z,s] of [[-4,1,.6],[-3,-2,.8],[3,-3,.7],[4,-1,.6]])shrub(x,z,s);
  // Shared rock geometry keeps the added faceted terrain economical. A conservative
  // horizontal exclusion corridor keeps it clear of the boulder and its figure.
  {const geometry=new THREE.DodecahedronGeometry(1,0);let accepted=0;
   for(let i=0;i<500&&accepted<34;i++){const angle=i*2.399963,r=1.1+3.2*(((Math.sin(i*12.9898)*43758.5453)%1+1)%1),size=.22+.25*((i*7)%4)/3,x=Math.sin(angle)*r,z=Math.cos(angle)*r;
    if(!clearsSisyphusPath(x,z,size*1.35,1.3))continue;
    const y=2.95-r*3.4/4.7-.06,rock=add(geometry,accepted%3?'rockA':'rockB',x,y,z);rock.name='sisyphus-crag';rock.scale.set(size*1.35,size*.8,size);rock.rotation.set(i*.37,i*.81,i*.19);accepted++;
   }}
  // Connected faceted strata rise out of the cone only beyond a safety corridor.
  // Triangles near the route are omitted so the analytic contact surface remains authoritative.
  {const radial=30,angular=96,positions=[],distance=[],indices=[],route=Array.from({length:121},(_,i)=>sisyphusPath(i/120));
   for(let j=0;j<=radial;j++){const r=.35+j*4.25/radial;for(let i=0;i<=angular;i++){const a=i*Math.PI*2/angular,x=Math.sin(a)*r,z=Math.cos(a)*r;let d=Infinity;for(const p of route)d=Math.min(d,Math.hypot(x-p.x,z-p.z));
    const blend=THREE.MathUtils.smoothstep(d,1.75,2.5),ridge=.22+.23*Math.abs(Math.sin(a*7+r*1.4))+.12*Math.cos(a*13-r*2);positions.push(x,sisyphusGround(x,z)-.035+blend*ridge,z);distance.push(d);
   }}
   for(let j=0;j<radial;j++)for(let i=0;i<angular;i++){const a=j*(angular+1)+i,b=a+angular+1;for(const tri of [[a,b,a+1],[a+1,b,b+1]])if(tri.every(k=>distance[k]>1.75))indices.push(...tri)}
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const strata=add(geometry,'rockB');strata.name='sisyphus-connected-strata';strata.material.side=THREE.DoubleSide;
  }
  // Larger buried rock masses break up the conical silhouette while remaining
  // outside the full moving figure/boulder corridor.
  {const geometry=new THREE.DodecahedronGeometry(1,0),placed=[];
   for(let i=0;i<700&&placed.length<18;i++){const angle=i*2.399963,r=1.6+2.8*(((Math.sin(i*3.99)*43758.5453)%1+1)%1),x=Math.sin(angle)*r,z=Math.cos(angle)*r,size=.4+(i%4)*.08;
    if(!clearsSisyphusPath(x,z,size,1.4)||placed.some(p=>Math.hypot(x-p.x,z-p.z)<size+p.size*.8))continue;
    const mass=add(geometry,placed.length%2?'rockA':'rockB',x,sisyphusGround(x,z)-.08,z);mass.name='sisyphus-rock-mass';mass.scale.set(size,.65+size*.9,size*.8);mass.rotation.y=i*.73;placed.push({x,z,size});
   }}
  // A low two-course wall sits farther down the slope than the path edging.
  // Keep the entire block footprint outside the conservative motion corridor.
  {const geometry=new THREE.BoxGeometry(.27,.22,.20);let previous=null,travel=.3,count=0;
   for(let i=200;i<=900;i++){const q=i/1000,a=.35+q*4.5,r=5.7-3.12*q,x=Math.sin(a)*r,z=Math.cos(a)*r,here=new THREE.Vector2(x,z);
    if(previous)travel+=here.distanceTo(previous);previous=here;if(travel<.27)continue;travel=0;
    if(!clearsSisyphusPath(x,z,.17,1.32))continue;
    const nextQ=q+.001,nextA=.35+nextQ*4.5,nextR=5.7-3.12*nextQ,yaw=Math.atan2(-(Math.cos(nextA)*nextR-z),Math.sin(nextA)*nextR-x),c=Math.cos(yaw),s=Math.sin(yaw);let floor=Infinity;
    for(const u of [-.135,.135])for(const v of [-.1,.1])floor=Math.min(floor,sisyphusGround(x+c*u+s*v,z-s*u+c*v));
    for(let course=0;course<2;course++){const block=add(geometry,(count+course)%3?'rockA':'stone',x,floor+.03+course*.22,z);block.name='sisyphus-retaining-block';block.rotation.y=yaw}count++;
   }}break;
 case 'cave':
  for(let i=0;i<8;i++){const rock=sphere(.5+(i%3)*.17,'stone',-3.5+i,-.05,-2.3);rock.scale.set(1,.6,1)}
  cyl(.42,.5,.18,'dark',2.7,.12,.3);for(let i=0;i<4;i++){const log=box(.6,.09,.1,'wood',2.7,.24,.3);log.rotation.y=i*Math.PI/4}
  paving(2.1,1.7,4);break;
 case 'ship':
  {const rise=parent.userData.sailRise||0,yard=cyl(.065,.065,3.8,'wood',0,3.43+rise,0);yard.name='ship-yard';yard.rotation.z=Math.PI/2;
   for(const z of [-1.55,1.55])for(let x=-1.7;x<=1.7;x+=.5)box(.08,.42,.08,'wood',x,1.3,z);
   for(const z of [-1.55,1.55])box(3.7,.1,.1,'wood',0,1.5,z);
   for(const x of [-2.5,2.5])link([x,1.15,0],[0,3.5+rise,0],.025,'gold');
   for(const x of [-1.72,1.72])link([x,3.43+rise,0],[x*1.2,1.15,0],.02,'gold');}
  break;
 case 'trolley':
  {const tree=new THREE.Group();tree.name='trolley-garden-tree';tree.position.set(-3.15,.04,-3.15);group.add(tree);const trunk=[[0,0,0],[0,.48,0],[-.08,.92,-.02],[.04,1.35,0]];for(let i=0;i<trunk.length-1;i++)link(trunk[i],trunk[i+1],.13-i*.025,'wood',tree);const tips=[];for(let i=0;i<18;i++){const a=i*2.399963,r=.52+(i%4)*.12,tip=[Math.cos(a)*r,1.55+(i%4)*.11,Math.sin(a)*r];link(trunk[i%2?2:3],tip,.035,'wood',tree);tips.push(tip)}
   const leafGeometry=new THREE.BufferGeometry();leafGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,-1,0,-1,0,0,0,1,0,1,0,0,0,0,.18],3));leafGeometry.setIndex([0,1,4,1,2,4,2,3,4,3,0,4]);leafGeometry.computeVertexNormals();const leafMaterial=mat('leaf').clone();leafMaterial.side=THREE.DoubleSide;
   const foliage=new THREE.InstancedMesh(leafGeometry,leafMaterial,540),dummy=new THREE.Object3D(),tones=[new THREE.Color(0xffffff),new THREE.Color(0xdce4c5),new THREE.Color(0xcad9b8)];foliage.name='trolley-tree-leaves';for(let i=0;i<540;i++){const tip=tips[i%tips.length],a=i*2.399963,r=.04+.22*((i*13)%17)/16,size=.8+.2*((i*7)%5)/4;dummy.position.set(tip[0]+Math.cos(a)*r,tip[1]+.16*Math.sin(i*1.7),tip[2]+Math.sin(a)*r);dummy.rotation.set(.25*Math.sin(i),a,.45*Math.cos(i));dummy.scale.set(.16*size,.095*size,.055*size);dummy.updateMatrix();foliage.setMatrixAt(i,dummy.matrix);foliage.setColorAt(i,tones[i%3])}foliage.computeBoundingSphere();tree.add(foliage)}
  // A flared, uneven trunk and substantial forked limbs join the existing canopy.
  {const tree=group.getObjectByName('trolley-garden-tree'),geometry=new THREE.CylinderGeometry(.12,.23,.72,24,8),p=geometry.getAttribute('position');for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),t=(y+.36)/.72,variation=1+.09*Math.cos(a*5+t*2);p.setXYZ(i,x*variation+.025*Math.sin(t*4),y,z*variation)}geometry.computeVertexNormals();const trunk=add(geometry,'wood',0,.36,0,tree);trunk.name='trolley-tree-flared-trunk';for(const [a,b,r] of [[[0,.42,0],[-.43,1.37,.08],.07],[[0,.55,0],[.48,1.45,-.08],.07],[[-.04,.78,0],[.02,1.65,.4],.055],[[-.04,.78,0],[-.18,1.58,-.45],.055]]){const branch=link(a,b,r,'wood',tree);branch.name='trolley-tree-main-branch'}}
  group.getObjectByName('trolley-garden-tree').scale.set(1.3,1.45,1.3);
  shrub(3.5,2.8,.65);shrub(-2.8,2.9,.6);for(let i=0;i<12;i++){const a=i*Math.PI/6;sphere(.09,'stone',Math.sin(a)*4.7,.08,Math.cos(a)*4.7)}
  // Low meadow clusters remain beyond the railway beds and the switch housing.
  {const sites=[[-3.65,1.9],[-2.45,3.45],[-.75,3.7],[.8,3.65],[2.3,3.25],[3.5,2.65],[3.3,-3],[2,-3.95],[-1.4,-4.05],[-3.4,-2.9]],
   stems=new THREE.InstancedMesh(new THREE.CylinderGeometry(.018,.025,.22,5),mat('leaf'),sites.length*7),
   blossoms=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.055,1),mat('light'),sites.length*7),dummy=new THREE.Object3D();
   stems.name='trolley-meadow-stems';blossoms.name='trolley-meadow-flowers';let n=0;
   for(const [x,z] of sites)for(let j=0;j<7;j++){const a=j*2.399963,r=.12+.055*(j%3),height=.18+.04*(j%3);dummy.position.set(x+Math.cos(a)*r,.045+height/2,z+Math.sin(a)*r);dummy.rotation.set(0,0,.18*Math.sin(a));dummy.scale.set(1,height/.22,1);dummy.updateMatrix();stems.setMatrixAt(n,dummy.matrix);dummy.position.y=.045+height;dummy.rotation.set(0,0,0);dummy.scale.set(1,.75,1);dummy.updateMatrix();blossoms.setMatrixAt(n++,dummy.matrix)}
   stems.computeBoundingSphere();blossoms.computeBoundingSphere();group.add(stems,blossoms);
   for(const [x,z,s] of [[-3.9,2.3,.32],[-1.8,3.8,.36],[1.6,3.75,.3],[3.75,-2.45,.35]]){const rock=sphere(s,'stone',x,.1,z);rock.name='trolley-meadow-rock';rock.scale.set(1,.55,.8)}
  }
  paving(-.9,-3.1,4);const ruin=arch(0,-3.1,.85);ruin.name='trolley-garden-arch';ruin.position.y=.059;
  // Split the single round opening into a pair of smaller arcades supported
  // by a central column, echoing the garden ruin in the reference.
  {const oldTop=ruin.children.find(child=>child.geometry?.type==='TorusGeometry');ruin.remove(oldTop);oldTop.geometry.dispose();
   box(.22,2,.28,'stone',0,1,0,ruin);box(.32,.16,.36,'light',0,2,0,ruin);box(.35,.12,.38,'light',0,.07,0,ruin);
   for(const x of [-.4,.4]){const arc=add(new THREE.TorusGeometry(.4,.115,8,24,Math.PI),'stone',x,2,0,ruin);arc.name='trolley-arcade-arch'}
   // A narrow vine follows the outer pier and the crown, keeping the track clear.
   const points=[[-.8,.12,.18],[-.88,.65,.18],[-.8,1.2,.18],[-.86,1.85,.18],[-.66,2.24,.18],[-.3,2.38,.18],[.05,2.3,.18]].map(p=>new THREE.Vector3(...p)),vine=new THREE.CatmullRomCurve3(points);const stem=add(new THREE.TubeGeometry(vine,36,.018,6,false),'leaf',0,0,0,ruin);stem.name='trolley-arcade-vine';for(let i=0;i<24;i++){const p=vine.getPoint(.08+i*.038),side=i%2?1:-1,leaf=sphere(.09,'leaf',p.x+side*.07,p.y,p.z+.02,ruin);leaf.name='trolley-arcade-leaf';leaf.scale.set(.7,1.2,.3);leaf.rotation.z=side*.65}
  }
  const bench=new THREE.Group();bench.name='trolley-garden-bench';bench.position.set(1.65,.04,-3.25);group.add(bench);box(.95,.1,.38,'stone',0,.51,0,bench);for(const x of [-.34,.34])box(.16,.46,.28,'stone',x,.23,0,bench);
  break;
 case 'free-will':
  for(const [x,z,s] of [[-3.7,1,.8],[3.8,1,.7],[-2.8,-3,.6],[3,-3,.6]])shrub(x,z,s);
  tree(-3.8,-2.6,.65);tree(3.8,-2.6,.65);break;

 }
 return (t,value)=>{if(id==='recurrence')dynamic.forEach((o,i)=>o.scale.setScalar(i/12<=value?1.3:.75));if(id==='butterfly')dynamic.forEach((o,i)=>o.rotation.y=t*.15+i)};
}
