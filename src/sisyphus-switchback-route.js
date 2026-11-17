import * as THREE from 'three';

// Switchback geometry shared by the production scene and review preview.
export const turnRadius=1.05;
const radius=turnRadius,arc=Math.PI*radius;
// Lines and semicircles meet with matching tangents; each turn has a fixed
// radius larger than the road half-width, so its inner edge cannot fold over.
const segments=[
 {length:4.85,point:u=>[-2.8+4.85*u,3.6],tangent:()=>[1,0]},
 {length:arc,point:u=>[2.05+radius*Math.sin(Math.PI*u),2.55+radius*Math.cos(Math.PI*u)],tangent:u=>[Math.cos(Math.PI*u),-Math.sin(Math.PI*u)]},
 {length:3.9,point:u=>[2.05-3.9*u,1.5],tangent:()=>[-1,0]},
 {length:arc,point:u=>[-1.85-radius*Math.sin(Math.PI*u),.45+radius*Math.cos(Math.PI*u)],tangent:u=>[-Math.cos(Math.PI*u),-Math.sin(Math.PI*u)]},
 {length:2.85,point:u=>[-1.85+2.85*u,-.6],tangent:()=>[1,0]},
 {length:arc,point:u=>[1+radius*Math.sin(Math.PI*u),-1.65+radius*Math.cos(Math.PI*u)],tangent:u=>[Math.cos(Math.PI*u),-Math.sin(Math.PI*u)]},
 {length:.95,point:u=>[1-.95*u,-2.7],tangent:()=>[-1,0]},
];
export const routeLength=segments.reduce((sum,s)=>sum+s.length,0);
// Keep the figure's feet on the route at the start, reserve room for the
// boulder at the summit, and return continuously along the same route.
export function cyclePosition(elapsed,period=25){const phase=((elapsed/period)%1+1)%1,start=1.7/routeLength,end=1-.8/routeLength,ascending=phase<.8,fraction=ascending?phase/.8:(1-phase)/.2;return {q:start+(end-start)*fraction,ascending}}
const total=routeLength;
function sample(t){let distance=THREE.MathUtils.clamp(t,0,1)*total;for(const s of segments){if(distance<=s.length)return {s,u:distance/s.length};distance-=s.length}return {s:segments.at(-1),u:1}}
export const roadHalfWidth=.72;
export function route(t){const {s,u}=sample(t),[x,z]=s.point(u);return new THREE.Vector3(x,height(x,z)+.04,z)}
export function tangent(t){const {s,u}=sample(t),[x,z]=s.tangent(u);return new THREE.Vector2(x,z)}
export function behind(t,distance,side=0){const q=Math.max(0,t-distance/routeLength),p=route(q),d=tangent(q);p.x-=d.y*side;p.z+=d.x*side;p.y=height(p.x,p.z)+.04;return p}
// Anchor each stance to a fixed distance on the road; the opposite foot swings
// to its next anchor on the same curve, including through hairpin turns.
export function gaitFoot(t,side){
 const stride=.55,offset=side>0?.5:0,phase=t*routeLength/stride+offset,cycle=Math.floor(phase),fraction=phase-cycle,swing=THREE.MathUtils.clamp((fraction-.5)*2,0,1),ease=swing*swing*(3-2*swing),anchor=(cycle-offset+ease)*stride-1.15+side*.12;
 const foot=behind(t,t*routeLength-anchor,side*.18);foot.y+=.04125+.1*Math.sin(Math.PI*swing);return foot;
}
export function curbPoints(){const points=[];for(let i=1;i<240;i+=2){const t=i/240,p=route(t),d=tangent(t);for(const side of [-1,1]){const x=p.x-d.y*(roadHalfWidth+.07)*side,z=p.z+d.x*(roadHalfWidth+.07)*side;points.push({x,z,y:height(x,z)+.08,angle:Math.atan2(-d.y,d.x)})}}return points}
// The downhill faces extend to the cut ground; the coping remains outside
// the protected boulder corridor.
export function retainingWallGeometry(steps=480){
 const vertices=[],indices=[],inner=roadHalfWidth+.025,outer=roadHalfWidth+.18;
 for(const side of [-1,1]){const base=vertices.length/3;for(let i=0;i<=steps;i++){const p=route(i/steps),d=tangent(i/steps);for(const offset of [inner,outer]){const x=p.x-d.y*offset*side,z=p.z+d.x*offset*side,y=height(x,z),bottom=Math.min(y-.10,terrainHeight(x,z)-.04);vertices.push(x,bottom,z,x,y+.13,z)}if(i<steps){const n=base+i*4,k=n+4;indices.push(n,n+1,k,n+1,k+1,k,n+2,k+2,n+3,n+3,k+2,k+3,n+1,n+3,k+1,n+3,k+3,k+1)}}}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
export function height(x,z){
 // A sloping shelf in the center blends into the lower perimeter of the mound.
 const r=Math.hypot(x,z),shelf=THREE.MathUtils.clamp(.1+.60*(3.6-z),-.15,3.55);
 return -.15+(shelf+.15)*THREE.MathUtils.smoothstep(5.35-r,0,.4);
}
const terrainRoadSamples=Array.from({length:401},(_,i)=>route(i/400));
export function terrainHeight(x,z){const r=Math.hypot(x,z);let distance=Infinity,nearestZ=z;for(const p of terrainRoadSamples){const d=Math.hypot(x-p.x,z-p.z);if(d<distance){distance=d;nearestZ=p.z}}
 // The protected road remains level with its supporting shelf; the land beyond
 // the coping rises into broken ridges, rather than a smooth inclined slab.
 const clearance=THREE.MathUtils.smoothstep(distance,.84,1.65),rear=THREE.MathUtils.smoothstep(-z,-1.5,2.5),edge=1-THREE.MathUtils.smoothstep(r,4.65,5.35),rib=Math.pow(Math.abs(Math.sin(x*1.45+z*.48+.45*Math.sin(z*1.5))),1.3),fracture=Math.abs(Math.sin(x*2.2-z*1.7));
 // Narrow, irregular cuts break the rear ridges into rock slabs. They fade
 // before the retaining wall, leaving the movement corridor unchanged.
 const fissurePhase=x*2.7+z*1.5+.7*Math.sin(z*3.1)+.25*Math.sin(x*2),fissure=.18*Math.pow(Math.max(0,1-Math.abs(Math.sin(fissurePhase))/.2),2);
 // Asymmetric, angular peaks break the flat upper silhouette. They taper
 // before reaching either the movement corridor or the rim of the plinth.
 const peaks=[[-2.1,-3.25,1.45,1.55,1.9],[0,-3.85,1.35,1.25,2.35],[2.1,-3.35,1.4,1.45,1.95]];
 let crest=0;for(const [cx,cz,sx,sz,h] of peaks){const wedge=Math.max(0,1-Math.abs(x-cx)/sx-Math.abs(z-cz)/sz);crest=Math.max(crest,h*Math.pow(wedge,.75))}
 // Recess a narrow strip on the downhill side, exposing the masonry below
 // the road while keeping the full road width at its original elevation.
 const cut=.58*THREE.MathUtils.smoothstep(distance,.73,.93)*(1-THREE.MathUtils.smoothstep(distance,1.1,1.6))*THREE.MathUtils.smoothstep(z-nearestZ,.02,.5);
 // Outside that corridor, the perimeter descends gradually to the plinth
 // instead of dropping almost vertically from the road's underlying shelf.
 const shelf=height(x,z),perimeter=THREE.MathUtils.smoothstep(r,3.25,5.25)*clearance,erodedShelf=-.15+(shelf+.15)*(1-.78*perimeter);
 return Math.max(-.15,erodedShelf+clearance*edge*((.22+.78*rear)*(.55+.8*rib+.18*fracture-fissure*rear)+crest)-cut*edge)}
export const outcrops=[[-3.5,-3,.72,1.25,.55],[-2.8,-3.55,.7,1.45,.57],[-1.7,-4,.52,.9,.45],[-.5,-4.35,.42,.63,.36],[.7,-4.42,.4,.6,.36],[3.35,-3.15,.38,.55,.36],[4.3,-.7,.34,.48,.3]];
export function terrainGeometry(){
 const positions=[],colors=[],uvs=[],indices=[],rings=75,steps=160;
 for(let j=0;j<=rings;j++)for(let i=0;i<=steps;i++){const r=5.35*j/rings,a=i*2*Math.PI/steps,x=r*Math.cos(a),z=r*Math.sin(a),elevation=terrainHeight(x,z),lift=elevation-height(x,z);
  positions.push(x,elevation,z);uvs.push(x/3,z/3);
  // Weathered rock faces emerge on raised ridges; fine bands follow the
  // terrain instead of adding loose geometry in the walking corridor.
  const rock=THREE.MathUtils.smoothstep(lift,.06,.55),strata=.5+.5*Math.sin(x*3.8+z*2.3+elevation*5.1),variation=.94+.1*strata;
  const color=new THREE.Color(0x777d6a).lerp(new THREE.Color(0x5d6e68),rock).lerp(new THREE.Color(0x9b907a),rock*.22*strata).multiplyScalar(variation);
  colors.push(color.r,color.g,color.b);if(i<steps&&j<rings){const k=j*(steps+1)+i;indices.push(k,k+1,k+steps+1,k+1,k+steps+2,k+steps+1)}
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
export function roadGeometry(segments=400){
 const vertices=[],indices=[],colors=[],uvs=[],across=12;
 for(let i=0;i<=segments;i++){
  const t=i/segments,p=route(t),d=tangent(t),nx=-d.y,nz=d.x;
  for(let j=0;j<=across;j++){const side=2*j/across-1,x=p.x+nx*roadHalfWidth*side,z=p.z+nz*roadHalfWidth*side;vertices.push(x,height(x,z)+.04,z);uvs.push(x/3,z/3);
   // Fine irregular variation and darker shoulders break up the uniform ribbon.
   const hash=Math.sin(i*127.1+j*311.7)*43758.5453,noise=.015*(hash-Math.floor(hash)-.5),edge=Math.pow(Math.abs(side),3)*.065;
   colors.push(.64+noise-edge,.49+noise*.82-edge*.8,.34+noise*.65-edge*.55);
   if(i<segments&&j<across){const n=i*(across+1)+j;indices.push(n,n+across+1,n+1,n+1,n+across+1,n+across+2)}
  }
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
