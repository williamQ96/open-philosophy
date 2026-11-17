import * as THREE from 'three';

// Supplemental, scene-specific geometry belongs to the scene root and is disposed with it.
export function addSceneDetails(id, root){
 const detail=new THREE.Group();detail.name='scene-detail';const parent=id==='ship'?root.getObjectByName('ship-hull'):root;parent.add(detail);if(id==='ship')detail.position.y=parent.userData.deckLift||0;
 const palette={stone:0x887d6b,dark:0x343e39,gold:0xc99a64,wood:0x735b47,light:0xe3d9c3,blue:0x789b9a,red:0xa45e4b};
 const mats=Object.fromEntries(Object.entries(palette).map(([k,color])=>[k,new THREE.MeshStandardMaterial({color,roughness:.88})]));
 const used=new Set();
 function add(geometry,key,x,y,z){used.add(key);const o=new THREE.Mesh(geometry,mats[key]);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;detail.add(o);return o}
 const box=(w,h,d,k,x,y,z)=>add(new THREE.BoxGeometry(w,h,d),k,x,y,z);
 const sphere=(r,k,x,y,z)=>add(new THREE.SphereGeometry(r,12,8),k,x,y,z);
 const post=(r,h,k,x,y,z)=>add(new THREE.CylinderGeometry(r,r,h,12),k,x,y,z);
 const items=[];
 switch(id){
 case 'sisyphus':
  for(let i=0;i<12;i++){const a=i*Math.PI*2/12;const rock=add(new THREE.DodecahedronGeometry(.12+(i%3)*.05,0),'stone',Math.cos(a)*4.9,.03,Math.sin(a)*4.9);rock.rotation.set(i,i*.7,0)}break;
 case 'cave':
  for(let i=0;i<9;i++){const r=.16+(i%3)*.08;const rock=add(new THREE.DodecahedronGeometry(r,0),'stone',-3.7+i*.9,.15,-1.65);rock.scale.y=.6}
  break;
 case 'ship':
  for(let i=0;i<10;i++)for(const z of [-1.35,1.35])sphere(.04,'dark',-2+i*.44,1.12,z);
  for(const z of [-1.58,1.58])box(3.3,.07,.08,'gold',0,1.12,z);break;

 }
 for(const [key,mat] of Object.entries(mats))if(!used.has(key))mat.dispose();
 return (t,value)=>{
  if(id==='vat')items.slice(0,8).forEach((o,i)=>{o.position.y=.4+((t*(.1+value*.25)+i*.23)%1)*1.8});
  if(id==='trolley')items.forEach((o,i)=>o.scale.setScalar((value<.5?i<3:i>=3)?1.4:.65));
  if(id==='newcomb')items.forEach((o,i)=>o.scale.setScalar(value<.5?(i<3?1:.4):1));
  if(id==='recurrence')items.forEach((o,i)=>o.scale.z=(i/12<=value?1.8:1));
  if(id==='butterfly')items.forEach((o,i)=>o.scale.setScalar(.6+value*.5+Math.sin(t+i)*.12));
 };
}
