import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addSteps, scrubScene } from './scene.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Facilities: on tablet/desktop the section pins and the plant cards travel horizontally,
 * while the camera pans gently through the bubbles.
 * On phones / reduced motion the cards simply stack vertically.
 *
 * @param {object} state
 * @param {{ isTablet: boolean, reducedMotion: boolean }} conditions
 * @returns {(() => void) | void} cleanup
 */
export function initFacilities(state, { isTablet, reducedMotion }) {
    const section = document.querySelector('[data-facilities]');

    if (!section) {
        return;
    }

    const track = section.querySelector('[data-h-track]');
    const cards = gsap.utils.toArray('[data-h-card]', section);
    const sceneSteps = [
        ['camera', { x: 0, y: 0, z: 10 }],
    ];

    if (!isTablet || reducedMotion) {
        scrubScene(state, section, sceneSteps, { reducedMotion });

        if (!reducedMotion) {
            cards.forEach((card) => {
                gsap.from(card, {
                    y: 60,
                    autoAlpha: 0,
                    duration: 1.1,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                });
            });
        }

        return;
    }

    // Native horizontal scrolling is the no-JS fallback; GSAP takes over here.
    section.classList.replace('md:overflow-x-auto', 'md:overflow-hidden');

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        },
    });

    timeline.to(track, { x: () => -distance(), duration: 1 }, 0);
    addSteps(timeline, state, [
        ['camera', { x: 1.2, y: 0, z: 10, duration: 1 }],
        ['bubbles', { opacity: 0.8, duration: 0.5 }],
    ]);

    // Each card swings in as it enters from the right edge.
    cards.forEach((card) => {
        gsap.from(card, {
            yPercent: 12,
            rotate: 2.5,
            autoAlpha: 0.15,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                containerAnimation: timeline,
                start: 'left 100%',
                end: 'left 55%',
                scrub: true,
            },
        });
    });

    return () => {
        section.classList.replace('md:overflow-hidden', 'md:overflow-x-auto');
    };
}
