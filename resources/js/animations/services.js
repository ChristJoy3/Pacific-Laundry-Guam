import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addSteps, scrubScene } from './scene.js';

gsap.registerPlugin(ScrollTrigger);

const CLIP_SHOWN = 'inset(0% 0% 0% 0%)';

/**
 * Photos alternate sides: the 1st, 3rd, 5th... wipe in from the left, the others from the right.
 *
 * @param {number} index
 * @returns {{ clip: string, direction: 1 | -1 }}  clip: the hidden clip-path; direction: -1 = from the left
 */
function wipeFrom(index) {
    return index % 2 === 0
        ? { clip: 'inset(0% 100% 0% 0%)', direction: -1 }
        : { clip: 'inset(0% 0% 0% 100%)', direction: 1 };
}

/**
 * Services. Desktop: the section pins and each service takes the stage in turn while its photo
 * wipes over the previous one on the right, alternating from the left and from the right. Mobile / reduced motion: a normal stacked list over
 * drifting bubbles, each card showing its own photo.
 *
 * @param {object} state
 * @param {{ isDesktop: boolean, reducedMotion: boolean }} conditions
 * @returns {(() => void) | void} cleanup
 */
export function initServices(state, { isDesktop, reducedMotion }) {
    const section = document.querySelector('[data-services]');

    if (!section) {
        return;
    }

    if (!isDesktop || reducedMotion) {
        scrubScene(
            state,
            section,
            [
                // Leave the drum quickly, then let the bubbles drift behind the list.
                ['camera', { x: 0, y: 0, z: 9, duration: 0.15 }, 0],
                ['target', { x: 0, y: 0, z: 0, duration: 0.15 }, 0],
                ['bubbles', { opacity: 0.4 }, 0],
            ],
            { reducedMotion },
        );

        return;
    }

    const list = section.querySelector('[data-service-list]');
    const panels = gsap.utils.toArray('[data-service-panel]', section);
    const stage = section.querySelector('[data-service-stage]');
    const media = gsap.utils.toArray('[data-service-media]', section);
    const images = gsap.utils.toArray('[data-service-image]', section);
    const progress = section.querySelector('[data-service-progress]');
    const bar = section.querySelector('[data-service-bar]');
    const counter = section.querySelector('[data-service-count]');

    section.classList.add('is-pinned');
    list.classList.add('is-stacked');
    progress?.classList.replace('hidden', 'flex');
    gsap.set(panels.slice(1), { autoAlpha: 0, yPercent: 18 });
    gsap.set(bar, { scaleX: 1 / panels.length });
    gsap.set(stage, { autoAlpha: 0, scale: 0.96 });
    media.forEach((item, index) => gsap.set(item, { clipPath: wipeFrom(index).clip }));
    images.forEach((image, index) => gsap.set(image, { scale: 1.2, xPercent: wipeFrom(index).direction * 10 }));

    const hold = 0.6;
    const step = 1 + hold;

    const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${panels.length * window.innerHeight * 0.85}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        },
        onUpdate() {
            const active = panels.findIndex((panel) => Number(gsap.getProperty(panel, 'opacity')) > 0.5);
            if (counter && active >= 0) {
                counter.textContent = String(active + 1).padStart(2, '0');
            }
        },
    });

    // Fly back out of the washer drum while the frame fades in and the first photo wipes in from the left.
    addSteps(timeline, state, [
        ['camera', { x: 0, y: 0, z: 9, duration: 1, ease: 'power2.inOut' }],
        ['target', { x: 0, y: 0, z: 0, duration: 1, ease: 'power2.inOut' }],
        ['bubbles', { opacity: 0.45, duration: 1 }],
    ]);
    timeline
        .to(stage, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to(media[0], { clipPath: CLIP_SHOWN, duration: 1, ease: 'power3.inOut' }, 0)
        .to(images[0], { scale: 1.05, xPercent: 0, duration: 1 + hold, ease: 'power2.out' }, 0);

    panels.forEach((panel, index) => {
        if (index === 0) {
            return;
        }

        const at = 1 + hold + (index - 1) * step;
        const { direction } = wipeFrom(index);

        timeline
            .to(panels[index - 1], { autoAlpha: 0, yPercent: -18, duration: 0.45, ease: 'power2.in' }, at)
            .fromTo(panel, { autoAlpha: 0, yPercent: 18 }, { autoAlpha: 1, yPercent: 0, duration: 0.55, ease: 'power2.out', immediateRender: false }, at + 0.4)
            .to(bar, { scaleX: (index + 1) / panels.length, duration: 1, ease: 'power2.inOut' }, at)
            // The next photo wipes in from its side over the current one, which drifts the other way and dims.
            .to(media[index], { clipPath: CLIP_SHOWN, duration: 1, ease: 'power3.inOut' }, at)
            .to(images[index], { scale: 1.05, xPercent: 0, duration: step, ease: 'power2.out' }, at)
            .to(images[index - 1], { xPercent: -direction * 8, filter: 'brightness(0.7)', duration: 1, ease: 'power3.inOut' }, at);
    });

    // Let the last service breathe before the pin releases.
    timeline.to({}, { duration: hold });

    return () => {
        section.classList.remove('is-pinned');
        list.classList.remove('is-stacked');
        progress?.classList.replace('flex', 'hidden');
        gsap.set([stage, ...media, ...images], { clearProps: 'all' });
    };
}
