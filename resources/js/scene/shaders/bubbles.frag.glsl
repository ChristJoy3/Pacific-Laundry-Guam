// Bubble film: transparent center, bright rim. The "iridescence" stays inside the brand greens.

uniform vec3 uColorA;   // primary
uniform vec3 uColorB;   // accent
uniform vec3 uColorC;   // text (highlight)
uniform float uOpacity;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vFade;
varying float vSeed;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), 2.5);

    float film = sin(fresnel * 9.0 + uTime * 0.8 + vSeed) * 0.5 + 0.5;
    vec3 color = mix(uColorA, uColorB, film);

    // Small specular highlight from the upper left.
    float highlight = pow(max(dot(normal, normalize(vec3(-0.5, 0.7, 0.6))), 0.0), 40.0);
    color = mix(color, uColorC, highlight);

    float alpha = (fresnel * 0.55 + highlight * 0.8 + 0.02) * vFade * uOpacity;

    gl_FragColor = vec4(color, alpha);

    #include <colorspace_fragment>
}
