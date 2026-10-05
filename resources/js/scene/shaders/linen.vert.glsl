// The Linen: one cloth hanging from its top edge in the wind (hero, Trusted and Contact).
// Requires noise.glsl to be prepended.

uniform float uTime;
uniform float uWind;   // overall wind strength (0 = still)
uniform float uLift;   // 0..1, a gust lifts the sheet's hem toward the camera (hero exit)
uniform vec2 uSize;    // flat sheet width/height in world units

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vBillow;

vec3 sheetShape(vec2 uv) {
    vec3 p = vec3((uv - 0.5) * uSize, 0.0);

    // Pinned along the top edge: no movement at uv.y = 1, full movement at the hem.
    float freedom = pow(1.0 - uv.y, 1.25);
    float t = uTime * 0.35;

    float broad = snoise(vec3(p.x * 0.28 + t, p.y * 0.3, t * 0.55));
    float ripple = sin(p.x * 1.6 + uTime * 1.6 + p.y * 0.9) * 0.26;
    float detail = snoise(vec3(p.x * 0.9 - t * 1.4, p.y * 0.9, t)) * 0.12;

    p.z += (broad * 1.15 + ripple * 1.3 + detail) * freedom * uWind;
    p.x += snoise(vec3(p.y * 0.35, t * 0.6, 4.0)) * 0.18 * freedom * uWind;

    // Gust: hem swings up and toward the viewer.
    float lift = uLift * freedom * freedom;
    p.z += lift * 4.0;
    p.y += lift * 2.2;

    return p;
}

void main() {
    vec3 displaced = sheetShape(uv);

    // Normal from two neighbouring points on the cloth.
    float eps = 0.004;
    vec3 neighbourU = sheetShape(uv + vec2(eps, 0.0));
    vec3 neighbourV = sheetShape(uv + vec2(0.0, eps));
    vec3 objectNormal = normalize(cross(neighbourU - displaced, neighbourV - displaced));

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

    vNormal = normalize(normalMatrix * objectNormal);
    vViewPosition = -mvPosition.xyz;
    vUv = uv;
    vBillow = displaced.z * 0.3;

    gl_Position = projectionMatrix * mvPosition;
}
