/**
 * Maps the five brand colors to the roles used by the 3D scene, per theme.
 * Only brand hues are used; light mode just reassigns them.
 *
 * @param {{ primary: string, secondary: string, accent: string, background: string, text: string }} brand
 * @param {'dark' | 'light'} theme
 */
export function sceneTheme(brand, theme) {
    if (theme === 'light') {
        return {
            colors: {
                background: brand.text,
                cloth: brand.text,
                clothShadow: mix(brand.text, brand.secondary, 0.4), // soft sage tint
                sheen: brand.accent,
                rim: brand.primary,
                bubbleA: brand.secondary,
                bubbleB: brand.primary,
                bubbleC: brand.primary,
            },
        };
    }

    return {
        colors: {
            background: brand.background,
            cloth: brand.text,
            clothShadow: mix('#000000', brand.secondary, 0.35), // deep shade
            sheen: brand.accent,
            rim: brand.primary,
            bubbleA: brand.primary,
            bubbleB: brand.accent,
            bubbleC: brand.text,
        },
    };
}

/**
 * Blends two hex colors (t = 0 → a, 1 → b). Used only to make tints/shades of brand colors.
 *
 * @param {string} a
 * @param {string} b
 * @param {number} t
 */
function mix(a, b, t) {
    const channels = (hex) => [0, 2, 4].map((offset) => Number.parseInt(hex.replace('#', '').slice(offset, offset + 2), 16));
    const [from, to] = [channels(a), channels(b)];

    return `#${from.map((value, i) => Math.round(value + (to[i] - value) * t).toString(16).padStart(2, '0')).join('')}`;
}
