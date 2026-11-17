import * as THREE from 'three';

// A bounded keyboard equivalent to orbit and zoom. Unhandled keys keep their browser behavior.
export function orbitWithKey(camera,controls,key){
 const offset=new THREE.Vector3().subVectors(camera.position,controls.target);
 const spherical=new THREE.Spherical().setFromVector3(offset);
 const step=Math.PI/18;
 switch(key){
  case 'ArrowLeft': spherical.theta-=step;break;
  case 'ArrowRight': spherical.theta+=step;break;
  case 'ArrowUp': spherical.phi-=step;break;
  case 'ArrowDown': spherical.phi+=step;break;
  case '+': case '=': spherical.radius*=0.9;break;
  case '-': case '_': spherical.radius/=0.9;break;
  default:return false;
 }
 spherical.phi=THREE.MathUtils.clamp(spherical.phi,Math.max(controls.minPolarAngle,0.001),Math.min(controls.maxPolarAngle,Math.PI-0.001));
 spherical.radius=THREE.MathUtils.clamp(spherical.radius,controls.minDistance,controls.maxDistance);
 camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
 controls.update();
 return true;
}

// Preserve browser and assistive-technology modifier shortcuts, including zoom and history.
export function handleOrbitKey(event,camera,controls){
 if(event.ctrlKey||event.metaKey||event.altKey)return false;
 const handled=orbitWithKey(camera,controls,event.key);
 if(handled)event.preventDefault();
 return handled;
}
