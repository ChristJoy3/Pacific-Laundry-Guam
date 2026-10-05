// Soft cotton shading: half-lambert key light, green-tinted shadows, satin sheen and a faint weave.
// Every color comes from the brand palette uniforms.

uniform vec3 uColorCloth;   // brand text (off-white)
uniform vec3 uColorShadow;  // fold shadow: a shade/tint of brand secondary (themes.js)
uniform vec3 uColorSheen;   // brand accent
uniform vec3 uColorRim;     // brand primary
uniform vec3 uColorFog;     // brand background
uniform vec3 uLightDirection;
uniform float uGlow;        // 0..1, extra bloom-like brightness (Trusted section)
uniform float uOpacity;
uniform vec2 uFog;          // fog near/far (view-space distance)

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vBillow;

void main() {
    vec3 normal = normalize(vNormal);
    normal = gl_FrontFacing ? normal : -normal;
    vec3 viewDirection = normalize(vViewPosition);

    float diffuse = dot(normal, normalize(uLightDirection)) * 0.5 + 0.5;
    diffuse = pow(smoothstep(0.0, 1.0, diffuse), 1.6);

    vec3 color = mix(uColorShadow, uColorCloth * 0.92, diffuse);

    // Satin sheen on grazing angles + a primary-green rim.
    float fresnel = pow(1.0 - clamp(dot(normal, viewDirection), 0.0, 1.0), 3.0);
    color += uColorSheen * fresnel * 0.35;
    color = mix(color, uColorRim, fresnel * 0.14);

    // Folds catching light read as slightly brighter.
    color += uColorSheen * clamp(vBillow, 0.0, 1.0) * 0.06;

    // Microscopic weave so it reads as fabric up close.
    float weave = sin(vUv.x * 900.0) * sin(vUv.y * 900.0);
    color *= 1.0 + weave * 0.025;

    color += uColorSheen * uGlow * 0.35;

    // Distance fog into the page background.
    float depth = length(vViewPosition);
    float fogAmount = smoothstep(uFog.x, uFog.y, depth);
    color = mix(color, uColorFog, fogAmount);

    gl_FragColor = vec4(color, uOpacity);

    #include <colorspace_fragment>
}
