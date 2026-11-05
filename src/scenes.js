import * as THREE from 'three';
const mat=(color,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness});
function mesh(geo,material,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m}
function limb(a,b,r,material){const d=new THREE.Vector3().subVectors(b,a);const m=mesh(new THREE.CylinderGeometry(r,r,d.length(),8),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m}
export function buildSisyphus(scene){
 const root=new THREE.Group(); scene.add(root);const stone=mat(0x988373), earth=mat(0x766c5c), dark=mat(0x41463e), figure=mat(0xd0aa88);
 const base=mesh(new THREE.CylinderGeometry(5.4,5.8,.4,64),dark,0,-.35,0);root.add(base);
 const hill=mesh(new THREE.ConeGeometry(4.7,3.4,6),earth,0,1.25,0);hill.rotation.y=.3;root.add(hill);
 // An inclined path makes the endless motion readable from the opening view.
 const path=mesh(new THREE.BoxGeometry(7,.08,1.65),mat(0xa4947d),0,1.38,3);path.rotation.z=.4;root.add(path);
 const moving=new THREE.Group();root.add(moving);const boulder=mesh(new THREE.IcosahedronGeometry(.83,1),stone,.65,.92,0);moving.add(boulder);
 const body=new THREE.Group();body.position.z=.55;moving.add(body);body.add(mesh(new THREE.SphereGeometry(.18,16,12),figure,-.52,1.13,0));
 const v=(x,y,z)=>new THREE.Vector3(x,y,z);body.add(limb(v(-.7,.45,0),v(-.43,.97,0),.12,figure));body.add(limb(v(-.43,.94,0),v(.05,.98,0),.075,figure));body.add(limb(v(-.7,.48,0),v(-1,.05,.17),.085,figure));body.add(limb(v(-.7,.48,0),v(-.38,.05,-.18),.085,figure));
 return {update(t,value){const cycle=(t*(.045+value*.12))%1;const up=cycle<.8;const q=up?cycle/.8:1-(cycle-.8)/.2;moving.position.set(-2.8+q*5.5,.25+q*2.28,3);boulder.rotation.z=-q*6;body.visible=up;},dispose(){scene.remove(root);dispose(root)}};
}
export function buildPanopticon(scene){
 const root=new THREE.Group();scene.add(root);const wall=mat(0xaaa596), dark=mat(0x4a534e), gold=mat(0xc38c56), floor=mat(0x737d70);
 root.add(mesh(new THREE.CylinderGeometry(5.2,5.5,.35,64),dark,0,-.25,0));root.add(mesh(new THREE.CylinderGeometry(4.95,4.95,.12,64),floor,0,-.02,0));
 const n=20;for(let i=0;i<n;i++){const a=i*2*Math.PI/n;const g=new THREE.Group();g.rotation.y=-a;g.position.set(Math.sin(a)*3.85,0,Math.cos(a)*3.85);root.add(g);
 g.add(mesh(new THREE.BoxGeometry(1.04,2.25,.18),wall,0,1.12,0));for(const side of [-.52,.52])g.add(mesh(new THREE.BoxGeometry(.12,2.25,1.05),wall,side,1.12,-.48));
 for(let j=-2;j<=2;j++)g.add(mesh(new THREE.BoxGeometry(.035,1.5,.035),dark,j*.19,1,-1));
 const person=mesh(new THREE.SphereGeometry(.12,12,8),gold,0,.48,-.55);g.add(person);g.add(mesh(new THREE.CylinderGeometry(.13,.18,.48,10),gold,0,.19,-.55));}
 root.add(mesh(new THREE.CylinderGeometry(.76,1,2.7,20),dark,0,1.35,0));root.add(mesh(new THREE.CylinderGeometry(1.15,1.15,.15,20),gold,0,2.78,0));root.add(mesh(new THREE.ConeGeometry(1.2,.65,20),dark,0,3.18,0));
 const beam=mesh(new THREE.ConeGeometry(1.05,3.5,32,1,true),new THREE.MeshBasicMaterial({color:0xe9cb82,transparent:true,opacity:.17,side:THREE.DoubleSide,depthWrite:false}));beam.rotation.z=Math.PI/2;beam.position.set(2.1,2,0);const pivot=new THREE.Group();pivot.add(beam);root.add(pivot);
 return {update(t,value){pivot.rotation.y=t*(.12+value*.7);beam.material.opacity=value===0?0:.08+value*.18},dispose(){scene.remove(root);dispose(root)}};
}
function dispose(root){root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){for(const m of [].concat(o.material))m.dispose()}})}
const v=(x,y,z)=>new THREE.Vector3(x,y,z);
function base(scene){const root=new THREE.Group();scene.add(root);root.add(mesh(new THREE.CylinderGeometry(5.2,5.5,.3,48),mat(0x4a534e),0,-.2,0));return root}
function lifecycle(scene,root,update){return {update,dispose(){scene.remove(root);dispose(root)}}}
function person(color=0xc8a380){const g=new THREE.Group(),m=mat(color);g.add(mesh(new THREE.SphereGeometry(.19,12,10),m,0,1.03,0));g.add(mesh(new THREE.CylinderGeometry(.14,.2,.68,10),m,0,.58,0));g.add(limb(v(0,.3,0),v(-.17,0,0),.07,m));g.add(limb(v(0,.3,0),v(.17,0,0),.07,m));return g}
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
export function buildCave(scene){const root=base(scene),rock=mat(0x817a69),shadow=mat(0x303932),gold=mat(0xd8ad6c);root.add(mesh(new THREE.BoxGeometry(8,3.8,.3),rock,0,1.9,-2));root.add(mesh(new THREE.BoxGeometry(8,.12,5),mat(0xa69b83),0,.02,0));const shapes=[],people=[];for(let i=0;i<3;i++){const p=person();p.position.set(-2+i*1.4,0,1.1);root.add(p);people.push(p);const s=mesh(new THREE.BoxGeometry(.55,1.2,.04),shadow,-2+i*1.4,1,-1.8);root.add(s);shapes.push(s)}const fire=mesh(new THREE.ConeGeometry(.35,1.1,8),gold,2.7,.58,.3);root.add(fire);const sun=mesh(new THREE.SphereGeometry(.55,20,16),gold,3.5,3.3,-1.7);root.add(sun);return lifecycle(scene,root,(t,value)=>{shapes.forEach((s,i)=>{s.scale.setScalar(i===2?1-value*.75:1);s.rotation.z=Math.sin(t+i)*.05});people[2].position.x=.8+value*1.7;people[2].rotation.y=value*Math.PI/2;sun.material.emissive.setHex(0x806032);sun.material.emissiveIntensity=value;fire.scale.y=1+Math.sin(t*4)*.1})}
export function buildShip(scene){const root=base(scene),wood=mat(0x9d7658),newWood=mat(0xd0b08a),dark=mat(0x4c554d);root.add(mesh(new THREE.CylinderGeometry(4.7,4.7,.08,48),mat(0x9daea9),0,0,0));const hull=new THREE.Group();root.add(hull);const planks=[];for(let i=0;i<10;i++){const p=mesh(new THREE.BoxGeometry(5.5,.23,.35),wood,0,.65,(i-4.5)*.36);hull.add(p);planks.push(p)}for(const z of [-2,2]){const side=mesh(new THREE.BoxGeometry(5.5,.7,.15),dark,0,.95,z);hull.add(side)}hull.add(mesh(new THREE.CylinderGeometry(.1,.14,3,12),dark,0,2.1,0));const sail=mesh(new THREE.BoxGeometry(.08,2,2),mat(0xede5d1),.1,2.35,1);hull.add(sail);return lifecycle(scene,root,(t,value)=>{const count=Math.round(value*planks.length);planks.forEach((p,i)=>p.material=i<count?newWood:wood);hull.rotation.z=Math.sin(t*.7)*.025})}
export function buildVeil(scene){const root=base(scene),floor=mat(0xb2aa96),gold=mat(0xd0a67f);root.add(mesh(new THREE.CylinderGeometry(4.6,4.6,.12,48),floor,0,0,0));for(let i=0;i<6;i++){const a=i*Math.PI/3;const p=person(i%2?0xc69473:0x8d9f8d);p.position.set(Math.sin(a)*3,.2,Math.cos(a)*3);root.add(p);root.add(mesh(new THREE.CylinderGeometry(.36,.36,.2+i*.18,16),gold,p.position.x,.1+i*.09,p.position.z))}const curtain=mesh(new THREE.CylinderGeometry(4,4,3.1,48,1,true),new THREE.MeshStandardMaterial({color:0xe8e2d0,transparent:true,opacity:.7,side:THREE.DoubleSide}),0,1.65,0);root.add(curtain);return lifecycle(scene,root,(t,value)=>{curtain.position.y=1.65+value*3.8;curtain.material.opacity=.7-value*.5})}
export const builders={sisyphus:buildSisyphus,panopticon:buildPanopticon,cave:buildCave,ship:buildShip,veil:buildVeil};


