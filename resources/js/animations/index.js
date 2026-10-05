import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrubScene } from './scene.js';
import { initServices } from './services.js';
import { initStats } from './stats.js';
import { initFacilities } from './facilities.js';
import { initEquipment } from './equipment.js';
import { initReveals } from './reveals.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Builds every scroll-driven animation. Wrapped in gsap.matchMedia so that crossing a breakpoint
 * (or toggling reduced motion) reverts everything cleanly and rebuilds the right variant.
 *
 * Triggers are created in page order, which ScrollTrigger needs to account for pinned sections.
 *
 * Scene story: the hero linen is swept away by a gust → the camera drifts through rising
 * bubbles → a photo per service takes the stage → bubbles → the linen returns as the
 * hanging sheet and stays as the calm closing frame.
 *
 * @param {object} state  experience.state, or a stand-in when WebGL is unavailable
 */
export function initScrollAnimations(state) {
    const mm = gsap.matchMedia();

    mm.add(
        {
            // matchMedia only runs the callback when at least one condition matches, so phones need this.
            always: 'all',
            isDesktop: '(min-width: 1024px)',
            isTablet: '(min-width: 768px)',
            reducedMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
            const { isDesktop, isTablet, reducedMotion } = context.conditions;
            const options = { reducedMotion };
            const cleanups = [];

            // Hero → About: a gust lifts the sheet toward the camera as we push through it.
            scrubScene(state, '#hero', [
                ['linen', { lift: 1, z: 1.5, wind: 1.6, duration: 1 }, 0],
                ['linen', { opacity: 0, duration: 0.45 }, 0.55],
                ['camera', { z: 6.5, duration: 1 }, 0],
            ], { ...options, start: 'top top' });

            // About: drift forward through the rising bubbles.
            scrubScene(state, '#about', [
                ['camera', { z: 2, duration: 1 }, 0],
                ['target', { z: -10, duration: 1 }, 0],
                ['bubbles', { opacity: 0.7, duration: 1 }, 0],
            ], options);

            cleanups.push(initServices(state, { isDesktop, reducedMotion }));

            // Why Us: a calm frame with drifting bubbles.
            scrubScene(state, '#why-us', [
                ['camera', { y: -0.3, duration: 1 }, 0],
                ['bubbles', { opacity: 0.8, duration: 1 }, 0],
            ], options);
            initStats(options);

            cleanups.push(initFacilities(state, { isTablet, reducedMotion }));
            cleanups.push(initEquipment({ isDesktop, reducedMotion }));

            // Trusted: the linen returns, softly glowing.
            scrubScene(state, '#trusted', [
                ['camera', { x: 0, y: 0, z: 10, duration: 1 }, 0],
                ['target', { x: 0, y: 0, z: 0, duration: 1 }, 0],
                ['linen', { x: 0, y: 0, opacity: isDesktop ? 1 : 0, lift: 0, z: 0, wind: 0.8, glow: 0.6, duration: 0.7 }, 0],
            ], { ...options, start: 'top top', end: 'bottom bottom' });

            // Contact: the sheet stays as a calm closing frame, the wind settling down.
            scrubScene(state, '#contact', [
                ['linen', { x: isDesktop ? 0.9 : 0, y: isDesktop ? 0.5 : 0, wind: 0.45, glow: 0.2, duration: 1 }, 0],
                ['bubbles', { opacity: 0.5, duration: 1 }, 0],
            ], { ...options, start: 'top bottom', end: 'top top' });

            initReveals(options);

            return () => cleanups.forEach((cleanup) => cleanup?.());
        },
    );

    return mm;
}
