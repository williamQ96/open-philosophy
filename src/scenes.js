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
 const body=new THREE.Group();moving.add(body);body.add(mesh(new THREE.SphereGeometry(.18,16,12),figure,-.52,1.13,0));
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
export const builders={sisyphus:buildSisyphus,panopticon:buildPanopticon};

