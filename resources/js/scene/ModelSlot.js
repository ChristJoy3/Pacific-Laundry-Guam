import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { disposeObject } from './dispose.js';

/**
 * A placeholder that can later be swapped for a real .glb model without touching the animations.
 *
 * Usage (e.g. in Experience.js):
 *   const slot = new ModelSlot(this.linen.mesh, this.loadingManager);
 *   await slot.load('/models/folded-towels.glb', { scale: 1.5 });
 *
 * The loaded model is added to the placeholder's parent, inherits its transform,
 * and the procedural placeholder is hidden (not destroyed, so it can be restored).
 */
export class ModelSlot {
    /**
     * @param {import('three').Object3D} placeholder
     * @param {import('three').LoadingManager} loadingManager
     */
    constructor(placeholder, loadingManager) {
        this.placeholder = placeholder;
        this.model = null;
        this.loader = new GLTFLoader(loadingManager);

        // Draco-compressed models decode with the decoder files served from public/draco/ (copy from three/examples/jsm/libs/draco/).
        const draco = new DRACOLoader(loadingManager);
        draco.setDecoderPath('/draco/');
        this.loader.setDRACOLoader(draco);
    }

    /**
     * @param {string} url  e.g. '/models/linen.glb'
     * @param {{ scale?: number }} [options]
     * @returns {Promise<import('three').Object3D>}
     */
    async load(url, { scale = 1 } = {}) {
        const gltf = await this.loader.loadAsync(url);
        const model = gltf.scene;

        model.position.copy(this.placeholder.position);
        model.quaternion.copy(this.placeholder.quaternion);
        model.scale.copy(this.placeholder.scale).multiplyScalar(scale);

        this.unload();
        this.placeholder.parent?.add(model);
        this.placeholder.visible = false;
        this.placeholder.userData.replacedByModel = true;
        this.model = model;

        return model;
    }

    /** Removes the loaded model and shows the procedural placeholder again. */
    unload() {
        if (this.model) {
            disposeObject(this.model);
            this.model = null;
        }

        this.placeholder.visible = true;
        this.placeholder.userData.replacedByModel = false;
    }
}
