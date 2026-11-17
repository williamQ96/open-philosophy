// Scene meshes can share geometry and materials, while every InstancedMesh owns
// its own GPU instance buffers. Release both types of resource on navigation.
export function disposeSceneGraph(root){
 const geometries=new Set(),materials=new Set(),textures=new Set();
 root.traverse(object=>{
  if(object.isInstancedMesh)object.dispose();
  if(object.geometry)geometries.add(object.geometry);
  if(object.material)for(const material of [].concat(object.material))if(material)materials.add(material);
 });
 for(const material of materials)for(const value of Object.values(material))if(value?.isTexture)textures.add(value);
 for(const geometry of geometries)geometry.dispose();
 for(const material of materials)material.dispose();
 for(const texture of textures)texture.dispose();
}
