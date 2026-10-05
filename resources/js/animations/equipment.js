import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** How many cards stay visible behind the top one. */
const VISIBLE_BEHIND = 3;

/**
 * Resting pose for a card `depth` places behind the top of the deck: each one sits a little lower,
 * smaller and alternately tilted, like a hand-laid stack.
 *
 * @param {number} depth  0 = top card
 * @returns {gsap.TweenVars}
 */
function slot(depth) {
    return {
        y: Math.min(depth, VISIBLE_BEHIND) * 14,
        scale: 1 - Math.min(depth, VISIBLE_BEHIND) * 0.05,
        rotation: depth === 0 ? 0 : (depth % 2 ? -2.5 : 2.5),
        autoAlpha: depth <= VISIBLE_BEHIND ? 1 : 0,
    };
}

/**
 * Equipment. Desktop: the section pins and the machines play as a deck of cards. On each step the
 * top card is tossed aside (alternating left and right) and the deck moves up, while the
 * "laundry line" rail and the outlined stage word follow the current machine's stage.
 * Phones / reduced motion: the cards stay a swipeable row.
 *
 * @param {{ isDesktop: boolean, reducedMotion: boolean }} conditions
 * @returns {(() => void) | void} cleanup
 */
export function initEquipment({ isDesktop, reducedMotion }) {
    const section = document.querySelector('[data-equipment]');

    if (!section || !isDesktop || reducedMotion) {
        return;
    }

    const deck = section.querySelector('[data-equipment-deck]');
    const cards = gsap.utils.toArray('[data-equipment-card]', section);
    const images = gsap.utils.toArray('[data-equipment-image]', section);
    const stages = gsap.utils.toArray('[data-equipment-stage]', section);
    const words = gsap.utils.toArray('[data-equipment-word]', section);
    const progress = section.querySelector('[data-equipment-progress]');
    const stageCount = stages.length;
    let activeStage = -1;

    /** @param {number} index */
    const setStage = (index) => {
        if (index === activeStage) {
            return;
        }

        activeStage = index;
        [stages, words].forEach((items) => items.forEach((item, i) => item.classList.toggle('is-active', i === index)));
    };

    section.classList.add('is-pinned');
    deck.classList.add('is-stacked');
    cards.forEach((card, index) => gsap.set(card, { ...slot(index), zIndex: cards.length - index, transformOrigin: '50% 100%' }));
    gsap.set(progress, { scaleY: 1 / stageCount });

    const lead = 0.3;
    const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${cards.length * window.innerHeight * 0.7}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        },
        onUpdate() {
            // The top card is the first one still standing (tossed cards fade to 0).
            const top = cards.findIndex((card) => Number(gsap.getProperty(card, 'opacity')) > 0.5 && gsap.getProperty(card, 'yPercent') > -50);
            setStage(Number(cards[Math.max(top, 0)].dataset.stage));
        },
    });

    timeline.to({}, { duration: lead });

    cards.forEach((card, index) => {
        if (index === cards.length - 1) {
            return;
        }

        const at = lead + index;
        const side = index % 2 ? -1 : 1;
        const nextStage = Number(cards[index + 1].dataset.stage);

        // Toss the top card up and away, alternating sides. It stays solid until it has mostly cleared the deck.
        timeline
            .to(card, { yPercent: -125, xPercent: side * 35, rotation: side * 16, duration: 0.9, ease: 'power2.in' }, at)
            .to(card, { autoAlpha: 0, duration: 0.25, ease: 'none' }, at + 0.65);

        // The rest of the deck moves up one place; the new top photo settles from a slight zoom.
        cards.slice(index + 1, index + 2 + VISIBLE_BEHIND).forEach((behind, offset) => {
            timeline.to(behind, { ...slot(offset), duration: 0.9, ease: 'power2.inOut' }, at + 0.1);
        });
        timeline
            .fromTo(images[index + 1], { scale: 1.12 }, { scale: 1, duration: 1, ease: 'power2.out', immediateRender: false }, at + 0.1)
            .to(progress, { scaleY: (nextStage + 1) / stageCount, duration: 0.9, ease: 'power2.inOut' }, at + 0.1);
    });

    // Let the last card breathe before the pin releases.
    timeline.to({}, { duration: 0.6 });

    return () => {
        section.classList.remove('is-pinned');
        deck.classList.remove('is-stacked');
        gsap.set([...cards, ...images, progress], { clearProps: 'all' });
        setStage(0);
    };
}
