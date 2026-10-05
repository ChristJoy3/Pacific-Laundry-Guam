/**
 * Frees GPU memory for an object and everything beneath it
 * (geometries, materials and any textures referenced by material properties or uniforms).
 *
 * @param {import('three').Object3D} root
 */
export function disposeObject(root) {
    root.traverse((child) => {
        child.geometry?.dispose();

        const materials = Array.isArray(child.material) ? child.material : [child.material];

        materials.filter(Boolean).forEach((material) => {
            Object.values(material).forEach((value) => value?.isTexture && value.dispose());
            Object.values(material.uniforms ?? {}).forEach(({ value }) => value?.isTexture && value.dispose());
            material.dispose();
        });
    });

    root.removeFromParent();
}
