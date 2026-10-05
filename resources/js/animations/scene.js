import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * @typedef {[key: string, vars: gsap.TweenVars, position?: number]} SceneStep
 *   key      — a branch of the scene state: 'camera' | 'target' | 'linen' | 'bubbles'
 *   vars     — values to reach by the end of the section (plus optional duration/ease)
 *   position — where the step starts inside the 0..1 section timeline (default 0)
 */

/**
 * Scrubs the 3D scene state while a section scrolls by.
 * Section ranges are chosen to be contiguous (never overlapping) so two timelines never fight over a value.
 * Scene timelines use `scrub: true` (no extra lag): Lenis already smooths the scroll, and a lagging
 * scrub could finish after the next section's timeline and overwrite its values.
 *
 * With reduced motion the scene doesn't move with the scroll; it simply eases to the section's
 * final values when that section becomes active.
 *
 * @param {object} state  Experience state (or a stand-in when WebGL is off)
 * @param {string | Element} trigger
 * @param {SceneStep[]} steps
 * @param {{ start?: string, end?: string, reducedMotion?: boolean, scrub?: number | boolean }} [options]
 */
export function scrubScene(state, trigger, steps, { start = 'top top', end = 'bottom top', reducedMotion = false, scrub = true } = {}) {
    if (reducedMotion) {
        return ScrollTrigger.create({
            trigger,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => self.isActive && applySteps(state, steps),
        });
    }

    const timeline = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: { trigger, start, end, scrub },
    });

    addSteps(timeline, state, steps);

    return timeline;
}

/**
 * Adds scene steps to an existing timeline (used inside pinned section timelines).
 *
 * @param {gsap.core.Timeline} timeline
 * @param {object} state
 * @param {SceneStep[]} steps
 * @param {number} [offset]
 */
export function addSteps(timeline, state, steps, offset = 0) {
    steps.forEach(([key, vars, position = 0]) => {
        timeline.to(state[key], { ...vars }, offset + position);
    });

    return timeline;
}

/** Eases the scene to the end values of the given steps (reduced-motion fallback). */
export function applySteps(state, steps) {
    steps.forEach(([key, vars]) => {
        const { duration, ease, ...values } = vars;
        gsap.to(state[key], { ...values, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
    });
}
