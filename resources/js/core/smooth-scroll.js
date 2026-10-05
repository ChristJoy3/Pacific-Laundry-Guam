import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the viewport when the address bar shows/hides; recalculating every
// trigger then causes a visible jump, so ScrollTrigger ignores those height-only resizes.
ScrollTrigger.config({ ignoreMobileResize: true });

/** @type {Lenis | null} */
let lenis = null;

/**
 * Creates the Lenis instance and drives it from GSAP's ticker so Lenis,
 * ScrollTrigger and every tween share a single requestAnimationFrame loop.
 * With reduced motion we skip Lenis entirely and keep native scrolling.
 *
 * @param {{ reducedMotion: boolean }} options
 * @returns {Lenis | null}
 */
export function initSmoothScroll({ reducedMotion }) {
    if (reducedMotion) {
        return null;
    }

    lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        autoRaf: false,
    });

    // Every Lenis scroll tick updates ScrollTrigger positions.
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP's ticker reports seconds; Lenis expects milliseconds.
    gsap.ticker.add((time) => lenis.raf(time * 1000));

    // Avoid GSAP "catching up" after a hitch, which would cause a visible scroll jump.
    gsap.ticker.lagSmoothing(0);

    return lenis;
}

export function getLenis() {
    return lenis;
}

/** Locks scrolling (e.g. while the preloader is visible). */
export function stopScroll() {
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
}

export function startScroll() {
    document.documentElement.style.overflow = '';
    lenis?.start();
}

/**
 * Smoothly scrolls to a selector/element, falling back to native scrolling.
 *
 * @param {string | HTMLElement | number} target  Selector, element, or a pixel position.
 * @param {{ offset?: number }} [options]
 */
export function scrollToTarget(target, { offset = 0 } = {}) {
    if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });

        return;
    }

    if (typeof target === 'number') {
        window.scrollTo({ top: target + offset });

        return;
    }

    const element = typeof target === 'string' ? document.querySelector(target) : target;
    element?.scrollIntoView({ behavior: 'auto', block: 'start' });
}

/**
 * Intercepts in-page anchor links (href="#section") and routes them through Lenis.
 */
export function bindAnchorLinks() {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');

        if (!link) {
            return;
        }

        const hash = link.getAttribute('href');
        const target = hash === '#' || hash === '#top' ? 0 : document.querySelector(hash);

        if (target === null) {
            return;
        }

        event.preventDefault();
        scrollToTarget(target);

        // Move focus for keyboard / screen-reader users without a second jump.
        if (target instanceof HTMLElement) {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    });
}
