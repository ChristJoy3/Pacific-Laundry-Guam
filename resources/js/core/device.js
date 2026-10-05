/**
 * Device capability detection, evaluated once at startup.
 * Used to pick a lighter 3D scene on mobile / low-power devices and to
 * disable desktop-only interactions on touch screens.
 */

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

export const device = {
    /** User asked the OS to minimise motion. */
    prefersReducedMotion: reducedMotionQuery.matches,

    /** Mouse/trackpad present (enables custom cursor + magnetic buttons). */
    hasFinePointer: finePointerQuery.matches,

    /** Small viewport (phones / small tablets). */
    isSmallScreen: window.innerWidth < 768,

    /**
     * 'high' = full scene, 'low' = simpler geometry, fewer bubbles, lower resolution.
     * Treat touch-only or low core-count devices as low tier.
     */
    get tier() {
        const lowCores = (navigator.hardwareConcurrency || 4) <= 4;

        return this.isSmallScreen || !this.hasFinePointer || lowCores ? 'low' : 'high';
    },
};

// Keep the flag live if the user toggles the OS setting mid-session.
reducedMotionQuery.addEventListener('change', (event) => {
    device.prefersReducedMotion = event.matches;
});
