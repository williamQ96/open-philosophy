// Take ownership of one loaded mesh geometry; discard loader-created materials.
// A late result is fully released instead of being attached to a disposed scene.
export function applyBoulderAsset(target,root,isLive,handled){
 const meshes=[];root.traverse(object=>{if(object.isMesh)meshes.push(object)});
 const geometries=new Set(meshes.map(mesh=>mesh.geometry).filter(Boolean));
 const materials=new Set(meshes.flatMap(mesh=>[].concat(mesh.material||[])));
 const geometry=meshes.length===1?meshes[0].geometry:null;
 const adopted=Boolean(isLive&&geometry&&!handled.geometries.has(geometry));
 if(adopted){const old=target.geometry;target.geometry=geometry;handled.geometries.add(geometry);if(old!==geometry)old.dispose()}
 for(const item of geometries)if(!handled.geometries.has(item)){handled.geometries.add(item);item.dispose()}
 for(const item of materials)if(!handled.materials.has(item)){handled.materials.add(item);item.dispose()}
 return adopted;
}
