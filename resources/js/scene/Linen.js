import * as THREE from 'three';
import noise from './shaders/noise.glsl?raw';
import vertexShader from './shaders/linen.vert.glsl?raw';
import fragmentShader from './shaders/linen.frag.glsl?raw';

const WIDTH = 5.2;
const HEIGHT = 3.6;

/**
 * The Linen: one cloth hanging in the wind (hero, Trusted, Contact).
 * Its shape and motion are computed in the vertex shader; JS only updates uniforms.
 */
export class Linen {
    /**
     * @param {{ colors: Record<string, THREE.Color>, segments: number }} options  colors: theme roles (themes.js)
     */
    constructor({ colors, segments }) {
        this.geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, segments, Math.round(segments * (HEIGHT / WIDTH)));

        this.material = new THREE.ShaderMaterial({
            vertexShader: `${noise}\n${vertexShader}`,
            fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uWind: { value: 1 },
                uLift: { value: 0 },
                uSize: { value: new THREE.Vector2(WIDTH, HEIGHT) },
                uColorCloth: { value: colors.cloth },
                uColorShadow: { value: colors.clothShadow },
                uColorSheen: { value: colors.sheen },
                uColorRim: { value: colors.rim },
                uColorFog: { value: colors.background },
                uLightDirection: { value: new THREE.Vector3(0.9, 0.55, 0.4) },
                uGlow: { value: 0 },
                uOpacity: { value: 1 },
                uFog: { value: new THREE.Vector2(9, 22) },
            },
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'linen';
        this.mesh.rotation.set(-0.1, -0.55, 0.05);
        // Poses extend well beyond the flat plane's bounds, so never frustum-cull it.
        this.mesh.frustumCulled = false;
    }

    /**
     * @param {number} elapsed  seconds
     * @param {{ wind: number, lift: number, glow: number, opacity: number }} state
     * @param {number} [fade]  extra opacity multiplier (hero intro)
     */
    update(elapsed, state, fade = 1) {
        const uniforms = this.material.uniforms;

        uniforms.uTime.value = elapsed;
        uniforms.uWind.value = state.wind;
        uniforms.uLift.value = state.lift;
        uniforms.uGlow.value = state.glow;
        uniforms.uOpacity.value = state.opacity * fade;

        // Skip the draw call once fully faded out, and stay hidden if a .glb has replaced it (ModelSlot).
        this.mesh.visible = uniforms.uOpacity.value > 0.001 && !this.mesh.userData.replacedByModel;
    }
}
