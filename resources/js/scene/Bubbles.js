import * as THREE from 'three';
import { createRandom } from './random.js';
import vertexShader from './shaders/bubbles.vert.glsl?raw';
import fragmentShader from './shaders/bubbles.frag.glsl?raw';

const RANGE = 14;

/**
 * Rising soap bubbles drawn with a single instanced draw call.
 * Skipped entirely on the low-power tier.
 */
export class Bubbles {
    /**
     * @param {{ colors: Record<string, THREE.Color>, count: number }} options
     */
    constructor({ colors, count }) {
        const random = createRandom(311);
        const base = new THREE.IcosahedronGeometry(1, 3);

        this.geometry = new THREE.InstancedBufferGeometry();
        this.geometry.index = base.index;
        this.geometry.setAttribute('position', base.getAttribute('position'));
        this.geometry.setAttribute('normal', base.getAttribute('normal'));
        this.geometry.instanceCount = count;

        const offsets = new Float32Array(count * 4);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            offsets[i * 4] = (random() - 0.5) * 14; // x
            offsets[i * 4 + 1] = -6 + random() * 8; // z
            offsets[i * 4 + 2] = random() * RANGE; // start y
            offsets[i * 4 + 3] = 0.06 + Math.pow(random(), 3) * 0.32; // radius: mostly small
            speeds[i] = 0.25 + random() * 0.45;
        }

        this.geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 4));
        this.geometry.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speeds, 1));
        this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uTime: { value: 0 },
                uRange: { value: RANGE },
                uColorA: { value: colors.bubbleA },
                uColorB: { value: colors.bubbleB },
                uColorC: { value: colors.bubbleC },
                uOpacity: { value: 1 },
            },
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'bubbles';
        this.mesh.frustumCulled = false;
    }

    /**
     * @param {number} elapsed
     * @param {{ opacity: number }} state
     * @param {number} [fade]  extra opacity multiplier (hero intro)
     */
    update(elapsed, state, fade = 1) {
        this.material.uniforms.uTime.value = elapsed;
        this.material.uniforms.uOpacity.value = state.opacity * fade;
        this.mesh.visible = this.material.uniforms.uOpacity.value > 0.001;
    }
}
