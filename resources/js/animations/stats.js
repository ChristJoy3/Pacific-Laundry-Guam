import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Why Us: counters tick up from zero when they come into view, and decorative
 * [data-parallax="speed"] layers drift at their own speed while the section scrolls.
 *
 * @param {{ reducedMotion: boolean }} conditions
 */
export function initStats({ reducedMotion }) {
    if (reducedMotion) {
        return; // final numbers are already in the HTML
    }

    gsap.utils.toArray('[data-counter]').forEach((element) => {
        const target = Number(element.dataset.counter);
        const counter = { value: 0 };

        element.textContent = '0';

        gsap.to(counter, {
            value: target,
            duration: target > 50 ? 2.2 : 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 90%', once: true },
            onUpdate: () => {
                element.textContent = String(Math.round(counter.value));
            },
        });
    });

    gsap.utils.toArray('[data-parallax]').forEach((layer) => {
        const speed = Number(layer.dataset.parallax) || 0.2;

        gsap.fromTo(
            layer,
            { yPercent: -speed * 100 },
            {
                yPercent: speed * 100,
                xPercent: speed * -20,
                ease: 'none',
                scrollTrigger: { trigger: layer.closest('section') ?? layer, start: 'top bottom', end: 'bottom top', scrub: true },
            },
        );
    });
}
