/**
 * Light / dark theme switching.
 *
 * The initial theme is applied by a tiny inline script in <head> (home.blade.php) before the
 * first paint, so there is no flash. This module wires up the toggle buttons and announces
 * changes with a `themechange` event that the 3D scene and the cursor listen to.
 */

const STORAGE_KEY = 'pl-theme';
const META_COLORS = { dark: '#06140d', light: '#f2f7f0' };

let switchingTimeout;

/** @returns {'dark' | 'light'} */
export function getTheme() {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/**
 * @param {'dark' | 'light'} theme
 * @param {{ persist?: boolean }} [options]
 */
export function setTheme(theme, { persist = true } = {}) {
    const root = document.documentElement;

    // Briefly enable color transitions on everything so the switch cross-fades (see app.css).
    root.classList.add('theme-switching');
    clearTimeout(switchingTimeout);
    switchingTimeout = setTimeout(() => root.classList.remove('theme-switching'), 500);

    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLORS[theme]);

    if (persist) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Storage can be unavailable (private mode); the theme still applies for this visit.
        }
    }

    syncToggles(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function initThemeToggle() {
    syncToggles(getTheme());

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));
    });

    // Follow the OS setting live, unless the visitor has picked a theme themselves.
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
        if (!hasSavedTheme()) {
            setTheme(event.matches ? 'light' : 'dark', { persist: false });
        }
    });
}

function hasSavedTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
        return false;
    }
}

/** @param {'dark' | 'light'} theme */
function syncToggles(theme) {
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
        button.setAttribute('aria-pressed', String(theme === 'light'));
    });
}
