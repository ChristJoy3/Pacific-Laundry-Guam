import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

/**
 * Hero entrance, played once when the preloader lifts.
 * Initial (hidden) states are applied immediately so nothing flashes behind the curtain.
 *
 * @param {object} state  scene state
 * @param {{ reducedMotion: boolean }} options
 * @returns {{ play: () => void }}
 */
export function createHeroIntro(state, { reducedMotion }) {
    const hero = document.querySelector('#hero');
    const title = hero?.querySelector('[data-split]');
    const reveals = hero ? gsap.utils.toArray('[data-reveal]', hero) : [];
    const header = document.querySelector('[data-navbar]');

    if (!hero || !title) {
        return { play: () => {} };
    }

    gsap.set([title, ...reveals, header], { autoAlpha: 0 });

    if (reducedMotion) {
        return {
            play: () => gsap.to([title, ...reveals, header], { autoAlpha: 1, duration: 0.6, stagger: 0.05 }),
        };
    }

    // The scene starts dark and pulled back, then dollies in as it fades up.
    gsap.set(state.intro, { z: 3.5, reveal: 0 });

    return {
        play() {
            // Split now (fonts are loaded) so line breaks are measured correctly.
            const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });

            gsap.timeline({
                defaults: { ease: 'expo.out' },
                // Restore the plain markup so the heading reflows naturally on resize.
                onComplete: () => split.revert(),
            })
                .to(state.intro, { reveal: 1, duration: 2.4, ease: 'power2.out' }, 0)
                .to(state.intro, { z: 0, duration: 3, ease: 'expo.out' }, 0)
                .set(title, { autoAlpha: 1 }, 0.1)
                .from(split.lines, { yPercent: 115, duration: 1.5, stagger: 0.12 }, 0.1)
                .to(reveals, { autoAlpha: 1, duration: 0.01 }, 0.55)
                .from(reveals, { y: 32, duration: 1.3, stagger: 0.1 }, 0.55)
                .to(header, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 0.7);
        },
    };
}
