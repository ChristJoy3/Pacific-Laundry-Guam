/**
 * Entry point: smooth scrolling + GSAP setup, the persistent 3D scene, preloader, then UI modules.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { device } from './core/device.js';
import { readBrand, readPalette } from './core/config.js';
import { bindAnchorLinks, initSmoothScroll, startScroll, stopScroll } from './core/smooth-scroll.js';
import { createSceneState } from './scene/state.js';
import { createPreloader } from './components/preloader.js';
import { initNavbar } from './components/navbar.js';
import { initCursor } from './components/cursor.js';
import { initMagnetic } from './components/magnetic.js';
import { getTheme, initThemeToggle } from './components/theme.js';
import { createHeroIntro } from './animations/hero.js';
import { initScrollAnimations } from './animations/index.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Loads three.js and the scene as a separate chunk (so text and layout aren't blocked by it),
 * pre-compiles the shaders and starts rendering behind the preloader.
 *
 * @param {ReturnType<typeof createSceneState>} state  shared with the scroll animations
 * @returns {Promise<import('./scene/Experience.js').Experience | null>}  null when WebGL is unavailable
 */
async function loadExperience(state) {
    const canvas = document.getElementById('webgl');

    if (!canvas) {
        return null;
    }

    try {
        const { Experience } = await import('./scene/Experience.js');
        const experience = new Experience({
            canvas,
            state,
            brand: readBrand(),
            theme: getTheme(),
            tier: device.tier,
            reducedMotion: device.prefersReducedMotion,
            pointerParallax: device.hasFinePointer,
        });

        await experience.warmUp();
        experience.start();

        window.addEventListener('themechange', (event) => experience.setTheme(event.detail.theme));

        return experience;
    } catch (error) {
        console.warn('[experience] WebGL unavailable, continuing without 3D.', error);
        canvas.remove();

        return null;
    }
}

function whenWindowLoaded() {
    return document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
}

async function init() {
    const root = document.documentElement;
    root.classList.toggle('reduced-motion', device.prefersReducedMotion);
    root.dataset.tier = device.tier;

    initSmoothScroll({ reducedMotion: device.prefersReducedMotion });
    bindAnchorLinks();
    stopScroll();

    const preloader = createPreloader({ reducedMotion: device.prefersReducedMotion });

    // Animations tween these plain numbers; the 3D scene (if WebGL is available) reads them every frame.
    const sceneState = createSceneState();
    const experienceReady = loadExperience(sceneState);

    preloader.track(document.fonts.ready, 1);
    preloader.track(whenWindowLoaded(), 1);
    preloader.track(experienceReady, 2);

    const heroIntro = createHeroIntro(sceneState, { reducedMotion: device.prefersReducedMotion });

    initNavbar();
    initThemeToggle();

    // Desktop-only micro-interactions (mouse/trackpad, motion allowed).
    const pointerFx = device.hasFinePointer && !device.prefersReducedMotion;
    initCursor({ enabled: pointerFx, getAccent: () => readPalette().accent });
    initMagnetic({ enabled: pointerFx });

    await preloader.finish();

    initScrollAnimations(sceneState);
    heroIntro.play();
    startScroll();
    ScrollTrigger.refresh();

    experienceReady.then((experience) => {
        window.dispatchEvent(new CustomEvent('app:ready', { detail: { experience } }));

        if (import.meta.env.DEV) {
            window.experience = experience; // handy for tweaking state from the console
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}
