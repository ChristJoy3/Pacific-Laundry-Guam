import { gsap } from 'gsap';

/**
 * Custom cursor: a precise dot plus a trailing ring that grows over interactive elements.
 * Add data-cursor-label="Call" to an element to show a short word inside the ring.
 *
 * Only for mouse/trackpad users with motion enabled; touch devices keep the native behaviour.
 *
 * @param {{ enabled: boolean, getAccent: () => string }} options  getAccent returns the current theme's accent hex
 */
export function initCursor({ enabled, getAccent }) {
    if (!enabled) {
        return;
    }

    // GSAP can't tween CSS variables, so build concrete colors from the brand accent.
    let accent = getAccent();
    const accentAt = (alpha) => withAlpha(accent, alpha);

    const ring = document.createElement('div');
    const label = document.createElement('span');
    const dot = document.createElement('div');

    ring.className = 'pointer-events-none fixed top-0 left-0 z-[70] flex size-10 items-center justify-center rounded-full border border-accent/60';
    label.className = 'text-[0.6rem] font-semibold tracking-[0.15em] text-background uppercase opacity-0';
    dot.className = 'pointer-events-none fixed top-0 left-0 z-[70] size-1.5 rounded-full bg-accent';
    ring.setAttribute('aria-hidden', 'true');
    dot.setAttribute('aria-hidden', 'true');
    ring.append(label);
    document.body.append(ring, dot);

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    document.documentElement.classList.add('has-custom-cursor');

    // quickTo reuses a single tween per axis: cheap enough to call on every pointer move.
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });

    let isVisible = false;
    let ringScale = 1;

    window.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') {
            return;
        }

        if (!isVisible) {
            gsap.set([ring, dot], { x: event.clientX, y: event.clientY });
            gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 });
            isVisible = true;
        }

        ringX(event.clientX);
        ringY(event.clientY);
        dotX(event.clientX);
        dotY(event.clientY);
    }, { passive: true });

    document.documentElement.addEventListener('pointerleave', () => {
        gsap.to([ring, dot], { autoAlpha: 0, duration: 0.3 });
        isVisible = false;
    });

    // Hover states via delegation, so elements added later work too.
    document.addEventListener('pointerover', (event) => {
        const interactive = event.target.closest('a, button, [data-cursor-label]');
        const text = interactive?.dataset.cursorLabel ?? '';

        label.textContent = text;
        ringScale = interactive ? (text ? 2.1 : 1.6) : 1;

        gsap.to(ring, {
            scale: ringScale,
            backgroundColor: text ? accentAt(1) : interactive ? accentAt(0.12) : accentAt(0),
            borderColor: interactive ? accentAt(1) : accentAt(0.6),
            duration: 0.4,
            ease: 'power3.out',
        });
        gsap.to(label, { opacity: text ? 1 : 0, scale: text ? 0.5 : 0.3, duration: 0.3 });
        gsap.to(dot, { scale: interactive ? 0 : 1, duration: 0.3 });
    });

    // Follow light/dark switches.
    window.addEventListener('themechange', () => {
        accent = getAccent();
        gsap.set(ring, { borderColor: accentAt(0.6), backgroundColor: accentAt(0) });
    });

    window.addEventListener('pointerdown', () => gsap.to(ring, { scale: ringScale * 0.8, duration: 0.15 }));
    window.addEventListener('pointerup', () => gsap.to(ring, { scale: ringScale, duration: 0.3, ease: 'back.out(3)' }));
}

/**
 * @param {string} hex  e.g. '#b8e986'
 * @param {number} alpha
 */
function withAlpha(hex, alpha) {
    const value = Number.parseInt(hex.replace('#', ''), 16);

    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}
