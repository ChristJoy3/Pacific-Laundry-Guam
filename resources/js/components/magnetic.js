import { gsap } from 'gsap';

/**
 * Magnetic buttons: [data-magnetic] elements lean toward the pointer, and their
 * [data-magnetic-inner] content leans a little further for a sense of depth.
 *
 * @param {{ enabled: boolean, strength?: number }} options
 */
export function initMagnetic({ enabled, strength = 0.35 }) {
    if (!enabled) {
        return;
    }

    document.querySelectorAll('[data-magnetic]').forEach((element) => {
        const inner = element.querySelector('[data-magnetic-inner]');
        const moveX = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'power3' });
        const moveY = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'power3' });
        const innerX = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' });
        const innerY = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' });

        element.addEventListener('pointermove', (event) => {
            if (event.pointerType !== 'mouse') {
                return;
            }

            const bounds = element.getBoundingClientRect();
            const offsetX = event.clientX - (bounds.left + bounds.width / 2);
            const offsetY = event.clientY - (bounds.top + bounds.height / 2);

            moveX(offsetX * strength);
            moveY(offsetY * strength);
            innerX?.(offsetX * strength * 0.5);
            innerY?.(offsetY * strength * 0.5);
        });

        element.addEventListener('pointerleave', () => {
            moveX(0);
            moveY(0);
            innerX?.(0);
            innerY?.(0);
        });
    });
}
