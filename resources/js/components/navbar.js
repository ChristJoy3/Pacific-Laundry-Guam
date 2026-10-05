import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startScroll, stopScroll } from '../core/smooth-scroll.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Sticky navbar:
 *  - hides when scrolling down, slides back in when scrolling up
 *  - gains a blurred background once the page has scrolled past the top
 *  - mobile menu overlay with focus handling and Escape to close
 */
export function initNavbar() {
    const header = document.querySelector('[data-navbar]');

    if (!header) {
        return;
    }

    const showAnim = gsap
        .from(header, { yPercent: -110, paused: true, duration: 0.45, ease: 'power3.out' })
        .progress(1);

    ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
            const pastTop = self.scroll() > 80;

            header.classList.toggle('bg-background/70', pastTop);
            header.classList.toggle('backdrop-blur-md', pastTop);
            header.classList.toggle('border-b', pastTop);
            header.classList.toggle('border-text/10', pastTop);

            // Keep the bar visible near the top or while the mobile menu is open.
            if (!pastTop || header.dataset.menuOpen === 'true' || self.direction === -1) {
                showAnim.play();
            } else {
                showAnim.reverse();
            }
        },
    });

    initActiveLinks(header);
    initMobileMenu(header);
}

/**
 * Highlights the nav link of the section currently in the middle of the viewport.
 *
 * @param {HTMLElement} header
 */
function initActiveLinks(header) {
    header.querySelectorAll('[data-nav-link]').forEach((link) => {
        const section = document.querySelector(link.getAttribute('href'));

        if (!section) {
            return;
        }

        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            // Refresh after the pinned sections so positions include their pin spacing.
            refreshPriority: -1,
            onToggle: (self) => {
                link.classList.toggle('text-text', self.isActive);
                link.classList.toggle('after:scale-x-100', self.isActive);

                if (self.isActive) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            },
        });
    });
}

/**
 * @param {HTMLElement} header
 */
function initMobileMenu(header) {
    const toggle = header.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');

    if (!toggle || !menu) {
        return;
    }

    const label = toggle.querySelector('.sr-only');
    const [topBar, bottomBar] = toggle.querySelectorAll('[data-menu-bar]');

    const setOpen = (isOpen) => {
        header.dataset.menuOpen = String(isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        label.textContent = isOpen ? 'Close menu' : 'Open menu';

        menu.classList.toggle('invisible', !isOpen);
        menu.classList.toggle('opacity-0', !isOpen);

        // Morph the two bars into an X.
        topBar.style.transform = isOpen ? 'rotate(45deg)' : '';
        bottomBar.style.transform = isOpen ? 'rotate(-45deg)' : '';

        if (isOpen) {
            stopScroll();
            menu.querySelector('a')?.focus();
        } else {
            startScroll();
        }
    };

    toggle.addEventListener('click', () => setOpen(header.dataset.menuOpen !== 'true'));

    // Close before the anchor scroll runs so scrolling is unlocked.
    menu.querySelectorAll('[data-mobile-link]').forEach((link) => {
        link.addEventListener('click', () => setOpen(false), { capture: true });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.dataset.menuOpen === 'true') {
            setOpen(false);
            toggle.focus();
        }
    });
}
