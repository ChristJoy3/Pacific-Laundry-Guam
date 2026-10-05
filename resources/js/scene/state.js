/**
 * Scene state shared by the animations and the 3D scene.
 * Deliberately free of three.js imports so the main bundle stays small:
 * three.js and the scene are loaded as a separate chunk (see app.js).
 */

/**
 * Default scene state (the hero frame). Every value is a plain number so GSAP can tween it.
 * Also used as a stand-in when WebGL is unavailable, so animation code never has to branch.
 */
export function createSceneState() {
    return {
        camera: { x: 0, y: 0, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        linen: { x: 0, y: 0, z: 0, rotationY: 0, wind: 1, lift: 0, glow: 0, opacity: 1 },
        bubbles: { opacity: 1 },
        intro: { z: 0, reveal: 1 },
    };
}
