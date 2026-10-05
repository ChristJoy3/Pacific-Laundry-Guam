import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Generic scroll reveals used across sections:
 *  - [data-split]  headings rise line by line from behind a mask
 *  - [data-reveal] elements fade up, staggered when several enter together
 * The hero is excluded (it has its own intro).
 *
 * @param {{ reducedMotion: boolean }} options
 */
export function initReveals({ reducedMotion }) {
    const outsideHero = (element) => !element.closest('#hero');
    const headings = gsap.utils.toArray('[data-split]').filter(outsideHero);
    const items = gsap.utils.toArray('[data-reveal]').filter(outsideHero);

    if (reducedMotion) {
        gsap.set([...headings, ...items], { autoAlpha: 0 });
        ScrollTrigger.batch([...headings, ...items], {
            start: 'top 90%',
            once: true,
            onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, duration: 0.5, stagger: 0.05 }),
        });

        return;
    }

    headings.forEach((heading) => {
        SplitText.create(heading, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true, // re-splits on resize / font load; the returned tween is recreated with it
            onSplit: (self) =>
                gsap.from(self.lines, {
                    yPercent: 115,
                    duration: 1.3,
                    stagger: 0.1,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
                }),
        });
    });

    gsap.set(items, { autoAlpha: 0, y: 40 });
    ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, overwrite: true }),
    });
}
