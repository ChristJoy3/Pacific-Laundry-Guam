import { gsap } from 'gsap';

/**
 * Preloader: the logo mark draws itself in (CSS), a hairline follows the real loading progress,
 * then the screen irises in on the mark to reveal the page
 * (markup: resources/views/components/preloader.blade.php).
 *
 * Progress is driven by real tasks (each with a weight) and eased toward its target value,
 * so the line always moves smoothly instead of jumping.
 *
 *   const preloader = createPreloader();
 *   preloader.track(document.fonts.ready, 1);
 *   await preloader.finish();
 *
 * @param {{ reducedMotion: boolean }} options
 */
export function createPreloader({ reducedMotion }) {
    const root = document.querySelector('[data-preloader]');
    const mark = root?.querySelector('[data-preloader-mark]');
    const line = root?.querySelector('[data-preloader-line]');
    const bar = root?.querySelector('[data-preloader-bar]');

    const startedAt = performance.now();
    const tasks = [];
    let totalWeight = 0;
    let doneWeight = 0;
    let target = 0;
    const display = { value: 0 };

    const draw = () => {
        bar?.style.setProperty('transform', `scaleX(${display.value})`);
        line?.setAttribute('aria-valuenow', String(Math.round(display.value * 100)));
    };

    const render = () => {
        display.value += (target - display.value) * 0.06;
        draw();
    };

    gsap.ticker.add(render);

    return {
        /**
         * @param {Promise<unknown>} promise
         * @param {number} [weight]
         */
        track(promise, weight = 1) {
            totalWeight += weight;

            const task = Promise.resolve(promise)
                .catch((error) => console.warn('[preloader] task failed', error))
                .finally(() => {
                    doneWeight += weight;
                    target = Math.min(doneWeight / totalWeight, 0.98);
                });

            tasks.push(task);

            return task;
        },

        /**
         * Waits for all tasks (with a safety timeout) and the mark's draw-in, completes the line and plays
         * the exit. Resolves while the iris is closing, so the hero intro can overlap it.
         *
         * @param {{ minDuration?: number, maxWait?: number }} [options]
         */
        async finish({ minDuration = 1900, maxWait = 8000 } = {}) {
            await Promise.race([Promise.all(tasks), wait(maxWait)]);

            const remaining = minDuration - (performance.now() - startedAt);
            if (remaining > 0 && !reducedMotion) {
                await wait(remaining);
            }

            gsap.ticker.remove(render);

            if (!root) {
                return;
            }

            await gsap.to(display, { value: 1, duration: reducedMotion ? 0 : 0.5, ease: 'power2.inOut', onUpdate: draw });

            const exit = gsap.timeline({ onComplete: () => root.remove() });

            if (reducedMotion) {
                exit.to(root, { autoAlpha: 0, duration: 0.3 });
                await wait(300);

                return;
            }

            // The iris closes on the centre of the mark, so the mark is the last thing on screen.
            const bounds = mark.getBoundingClientRect();
            const centre = `${bounds.left + bounds.width / 2}px ${bounds.top + bounds.height / 2}px`;

            gsap.set(root, { clipPath: `circle(150% at ${centre})` });

            exit.to(line, { autoAlpha: 0, scaleX: 0.4, duration: 0.35, ease: 'power2.in' })
                .to(mark, { scale: 1.06, duration: 0.35, ease: 'power2.out' }, 0)
                .to(root, { clipPath: `circle(0% at ${centre})`, duration: 1.15, ease: 'expo.inOut' }, 0.2)
                .to(mark, { scale: 0.55, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, 0.75);

            // Hand over as the iris passes half way.
            await wait(900);
        },
    };
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
