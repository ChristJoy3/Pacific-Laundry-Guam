// Instanced soap bubbles rising and wobbling; the loop is computed on the GPU from uTime.

uniform float uTime;
uniform float uRange;       // vertical travel distance before wrapping

attribute vec4 aOffset;     // x, z, start y, radius
attribute float aSpeed;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vFade;
varying float vSeed;

void main() {
    float y = mod(aOffset.z + uTime * aSpeed, uRange) - uRange * 0.5;
    float sway = sin(uTime * aSpeed * 1.7 + aOffset.z) * 0.25;

    // Slight squash-and-stretch wobble.
    vec3 local = position * aOffset.w;
    local.y *= 1.0 + sin(uTime * 3.0 + aOffset.z * 4.0) * 0.04;

    vec3 worldPosition = local + vec3(aOffset.x + sway, y, aOffset.y);
    vec4 mvPosition = modelViewMatrix * vec4(worldPosition, 1.0);

    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;
    vSeed = aOffset.z;

    // Fade in at the bottom and out at the top of the loop.
    float edge = uRange * 0.5;
    vFade = smoothstep(-edge, -edge * 0.6, y) * (1.0 - smoothstep(edge * 0.6, edge, y));

    gl_Position = projectionMatrix * mvPosition;
}
