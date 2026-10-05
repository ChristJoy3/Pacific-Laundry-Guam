{{--
    Preloader: the logo mark (the two figures only, redrawn as SVG with client approval; traced from
    PacificLogo.jpg and coloured with the theme greens so it reads on both backgrounds) draws itself in,
    a hairline fills with the real loading progress, then the screen irises in on the mark to reveal the page
    (resources/js/components/preloader.js). The draw-in is pure CSS, so it plays before the JS bundle arrives.
    Hidden when JS is unavailable.
--}}
<div class="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-12 bg-background [clip-path:circle(150%_at_50%_50%)]" data-preloader>
    <svg class="preloader-mark h-28 w-auto overflow-visible md:h-32" viewBox="18 4 90 88" role="img" aria-label="Pacific Laundry" data-preloader-mark>
        <defs>
            <linearGradient id="preloader-mark-fill" x1="0" y1="8" x2="0" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--color-accent)" />
                <stop offset="1" stop-color="var(--color-primary)" />
            </linearGradient>
        </defs>
        <g fill="none" stroke="url(#preloader-mark-fill)" stroke-width="11.2" stroke-linecap="round" stroke-linejoin="round">
            <path class="preloader-stroke" style="--delay: 0.15s" pathLength="1" d="M32 27 V83.5" />
            <path class="preloader-stroke" style="--delay: 0.35s" pathLength="1" d="M33 27 C42 25 47 31 48 42 L49.2 73 L67 32.5" />
            <path class="preloader-stroke" style="--delay: 0.6s" pathLength="1" d="M59 30.8 H95 Q99 30.8 99 35 V46" />
            <path class="preloader-stroke" style="--delay: 0.75s" pathLength="1" d="M81 32 V84" />
        </g>
        <g fill="url(#preloader-mark-fill)">
            <circle class="preloader-head" style="--delay: 1s" cx="31.8" cy="14.6" r="6.6" />
            <circle class="preloader-head" style="--delay: 1.12s" cx="81.2" cy="14.6" r="6.6" />
        </g>
    </svg>

    <div class="preloader-line h-px w-28 overflow-hidden bg-text/15" role="progressbar" aria-label="Loading" data-preloader-line>
        <div class="h-full origin-left scale-x-0 bg-accent" data-preloader-bar></div>
    </div>
</div>
<noscript><style>[data-preloader] { display: none; }</style></noscript>
