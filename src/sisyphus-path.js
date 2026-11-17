import * as THREE from 'three';

export function sisyphusGround(x,z){
 // The cone's apex is 2.95 and the circular base top is -0.15.
 // Path elevation is added separately when its mesh is built.
 return Math.max(-.15,2.95-Math.hypot(x,z)*3.4/4.7);
}

// Index the raised path triangles by horizontal cells for frequent height queries.
// Outside the path, fall back to the analytic hill surface.
export function sisyphusSurface(geometry){
 const positions=geometry.getAttribute('position'),index=geometry.getIndex(),cells=new Map(),cellSize=.75;
 const key=(x,z)=>`${x},${z}`;
 for(let i=0;i<index.count;i+=3){
  const vertices=[];for(let j=0;j<3;j++){const n=index.getX(i+j);vertices.push([positions.getX(n),positions.getY(n),positions.getZ(n)])}
  const [a,b,c]=vertices,den=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);if(Math.abs(den)<1e-10)continue;
  const triangle={a,b,c,den};const xs=vertices.map(v=>v[0]),zs=vertices.map(v=>v[2]);
  for(let x=Math.floor(Math.min(...xs)/cellSize);x<=Math.floor(Math.max(...xs)/cellSize);x++)for(let z=Math.floor(Math.min(...zs)/cellSize);z<=Math.floor(Math.max(...zs)/cellSize);z++){const k=key(x,z);if(!cells.has(k))cells.set(k,[]);cells.get(k).push(triangle)}
 }
 return (x,z)=>{let height=sisyphusGround(x,z);for(const {a,b,c,den} of cells.get(key(Math.floor(x/cellSize),Math.floor(z/cellSize)))||[]){const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/den,v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/den,w=1-u-v;if(u>=-1e-7&&v>=-1e-7&&w>=-1e-7)height=Math.max(height,u*a[1]+v*b[1]+w*c[1])}return height};
}

// Support each actual rotated vertex against the curved terrain and raised path.
// The same calculation works for the procedural fallback and the loaded GLB.
export function sisyphusSupport(geometry,yaw,roll,x,z,surface=sisyphusGround){
 const positions=geometry.getAttribute('position');if(!positions)return 0;
 const cy=Math.cos(yaw),sy=Math.sin(yaw),cr=Math.cos(roll),sr=Math.sin(roll);
 const ground=sisyphusGround(x,z);let support=-Infinity;
 for(let i=0;i<positions.count;i++){
  const px=positions.getX(i),py=positions.getY(i),pz=positions.getZ(i);
  const localX=cr*px-sr*py,localY=sr*px+cr*py;
  const worldX=cy*localX+sy*pz,worldZ=-sy*localX+cy*pz;
  support=Math.max(support,surface(x+worldX,z+worldZ)-ground-localY);
 }
 return Number.isFinite(support)?support:0;
}

// Find the closest point on the actual surface in the moving group's
// coordinates. Triangle projection avoids snapping between distant vertices.
// The geometry may be replaced asynchronously, so no topology is cached.
export function sisyphusHandTarget(geometry,roll,center,shoulder){
 const positions=geometry.getAttribute('position');if(!positions)return center.clone();
 const c=Math.cos(roll),s=Math.sin(roll),dx=shoulder.x-center.x,dy=shoulder.y-center.y,point=new THREE.Vector3(c*dx+s*dy,-s*dx+c*dy,shoulder.z-center.z),index=geometry.getIndex(),count=index?index.count:positions.count;
 const tri=new THREE.Triangle(),a=new THREE.Vector3(),b=new THREE.Vector3(),d=new THREE.Vector3(),candidate=new THREE.Vector3(),closest=new THREE.Vector3();let best=Infinity;
 for(let i=0;i+2<count;i+=3){tri.set(a.fromBufferAttribute(positions,index?index.getX(i):i),b.fromBufferAttribute(positions,index?index.getX(i+1):i+1),d.fromBufferAttribute(positions,index?index.getX(i+2):i+2));tri.closestPointToPoint(point,candidate);const distance=candidate.distanceToSquared(point);if(Number.isFinite(distance)&&distance<best){best=distance;closest.copy(candidate)}}
 if(!Number.isFinite(best))return center.clone();return new THREE.Vector3(center.x+c*closest.x-s*closest.y,center.y+s*closest.x+c*closest.y,center.z+closest.z);
}

// Shared by the path mesh, moving figures and scenery-clearance checks.
export function sisyphusPath(q){
 const angle=.35+q*4.5,radius=4.15-3.12*q;
 const x=Math.sin(angle)*radius,z=Math.cos(angle)*radius;
 return new THREE.Vector3(x,sisyphusGround(x,z),z);
}

// Arc-length samples allow a supporting foot to remain fixed as the figure
// moves around the curve; extrapolation keeps the initial step on the slope.
const gaitPath=Array.from({length:513},(_,i)=>sisyphusPath(i/512)),gaitDistances=[0];
for(let i=1;i<gaitPath.length;i++)gaitDistances.push(gaitDistances[i-1]+Math.hypot(gaitPath[i].x-gaitPath[i-1].x,gaitPath[i].z-gaitPath[i-1].z));
function pathDistance(q){const sample=THREE.MathUtils.clamp(q,0,1)*512,i=Math.min(511,Math.floor(sample)),u=sample-i;return THREE.MathUtils.lerp(gaitDistances[i],gaitDistances[i+1],u)}
function pathAtDistance(distance){let lo=0,hi=512;if(distance<=0)hi=1;else if(distance>=gaitDistances[512])lo=511;else while(hi-lo>1){const mid=(lo+hi)>>1;if(gaitDistances[mid]<=distance)lo=mid;else hi=mid}
 const a=gaitPath[lo],b=gaitPath[hi],length=gaitDistances[hi]-gaitDistances[lo],u=(distance-gaitDistances[lo])/length,tangent=new THREE.Vector2(b.x-a.x,b.z-a.z).normalize();return {x:THREE.MathUtils.lerp(a.x,b.x,u),z:THREE.MathUtils.lerp(a.z,b.z,u),tangent};
}
export function sisyphusGaitFoot(q,side){const distance=pathDistance(q),stride=.48,offset=side>0?.5:0,phase=distance/stride+offset,cycle=Math.floor(phase),fraction=phase-cycle,swing=THREE.MathUtils.clamp((fraction-.5)*2,0,1),ease=swing*swing*(3-2*swing),anchor=(cycle-offset+ease)*stride-.7,p=pathAtDistance(anchor),lateral=.35+side*.175;return {x:p.x-p.tangent.y*lateral,z:p.z+p.tangent.x*lateral,lift:.1*Math.sin(Math.PI*swing)}}

// Horizontal clearance is deliberately conservative: the boulder and figure move
// around the route center, so scenery must clear their whole footprint.
export function clearsSisyphusPath(x,z,radius,margin=1.25){
 for(let i=0;i<=120;i++){
  const p=sisyphusPath(i/120);
  if(Math.hypot(x-p.x,z-p.z)<radius+margin)return false;
 }
 return true;
}
