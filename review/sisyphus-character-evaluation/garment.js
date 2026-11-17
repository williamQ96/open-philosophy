import * as THREE from 'three';

// Static design study in rest-world coordinates; follows the pelvis rigidly.
export function createCandidateGarment(){
 const group=new THREE.Group();group.name='candidate-garment';
 const cloth=new THREE.MeshStandardMaterial({color:0x9f5947,roughness:1,side:THREE.DoubleSide,vertexColors:true});
 const positions=[],colors=[],indices=[],segments=48,rows=8;
 for(let row=0;row<=rows;row++){
  const t=row/rows,y=.94-.41*t;
  for(let i=0;i<=segments;i++){
   const a=i*Math.PI*2/segments,fold=.012*Math.sin(a*8+.4)*(.3+.7*t),rx=.225+.07*t+fold,rz=.145+.07*t+fold;
   positions.push(Math.cos(a)*rx,y+.012*t*Math.sin(a*3),-.045+Math.sin(a)*rz);
   const c=new THREE.Color(0x9f5947).multiplyScalar(.9+.1*Math.cos(a*8+.4));colors.push(c.r,c.g,c.b);
   if(row<rows&&i<segments){const n=row*(segments+1)+i;indices.push(n,n+segments+1,n+1,n+1,n+segments+1,n+segments+2)}
  }
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();const skirt=new THREE.Mesh(geometry,cloth);skirt.name='candidate-pleated-wrap';group.add(skirt);
 const belt=new THREE.Mesh(new THREE.TorusGeometry(.225,.023,8,48),new THREE.MeshStandardMaterial({color:0x704537,roughness:1}));belt.rotation.x=Math.PI/2;belt.scale.y=.7;belt.position.set(0,.935,-.045);belt.name='candidate-belt';group.add(belt);
 const plainCloth=new THREE.MeshStandardMaterial({color:0x9f5947,roughness:1,side:THREE.DoubleSide});
 const knot=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),plainCloth);knot.position.set(.21,.92,.035);knot.scale.set(.9,.6,.7);group.add(knot);
 const tail=new THREE.Mesh(new THREE.PlaneGeometry(.105,.28,4,8),plainCloth);tail.position.set(.215,.77,.04);tail.rotation.set(.1,.2,.18);group.add(tail);
 return group;
}
