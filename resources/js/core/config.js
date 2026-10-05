/**
 * Site-wide configuration.
 *
 * LOGO: the client's logo file, used exactly as supplied (never redrawn or recolored).
 * To swap in an SVG later, change `src` (and the intrinsic size) here and in
 * resources/views/components/logo.blade.php.
 */
export const LOGO = {
    src: '/PacificLogo.jpg',
    alt: 'Pacific Laundry & Textile Rental Service',
    width: 398,
    height: 102,
};

const PALETTE_KEYS = ['primary', 'secondary', 'accent', 'background', 'text'];

/**
 * Normalises any CSS color string to #rrggbb. The production CSS minifier shortens hex values
 * (e.g. #006633 → #063), and the scene/cursor helpers expect the full six-digit form.
 *
 * @param {string} value
 */
let colorContext;

function toHex(value) {
    colorContext ??= document.createElement('canvas').getContext('2d');
    const context = colorContext;
    context.fillStyle = '#000000';
    context.fillStyle = value; // invalid values are ignored by the browser

    return context.fillStyle; // opaque colors serialise as #rrggbb
}

/** @param {string} prefix  '--brand' or '--color' */
function readColors(prefix) {
    const styles = getComputedStyle(document.documentElement);

    return Object.fromEntries(
        PALETTE_KEYS.map((key) => [key, toHex(styles.getPropertyValue(`${prefix}-${key}`).trim())]),
    );
}

/**
 * Reads the raw brand colors (--brand-* in app.css). These never change with the theme,
 * which is what the 3D scene needs to build its own light/dark mapping (scene/themes.js).
 *
 * @returns {{ primary: string, secondary: string, accent: string, background: string, text: string }}
 */
export function readBrand() {
    return readColors('--brand');
}

/**
 * Reads the current theme's UI color roles (--color-* in app.css). These change with
 * light/dark mode, so read them again after a `themechange` event.
 *
 * @returns {{ primary: string, secondary: string, accent: string, background: string, text: string }}
 */
export function readPalette() {
    return readColors('--color');
}
