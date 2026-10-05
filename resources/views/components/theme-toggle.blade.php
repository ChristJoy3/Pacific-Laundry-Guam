{{--
    Light/dark switch (resources/js/components/theme.js). Shows a sun in dark mode and a moon in light mode.

    Usage: <x-theme-toggle />
--}}
<button
    type="button"
    data-theme-toggle
    data-magnetic
    aria-label="Switch to light mode"
    aria-pressed="false"
    {{ $attributes->class('relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-text/20 transition-colors hover:border-accent hover:text-accent') }}
>
    <span data-magnetic-inner class="relative inline-flex size-5 items-center justify-center">
        {{-- Sun (visible in dark mode) --}}
        <svg class="absolute size-5 transition-[opacity,scale,rotate] duration-500 ease-out-expo light:scale-50 light:rotate-90 light:opacity-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
        </svg>
        {{-- Moon (visible in light mode) --}}
        <svg class="absolute size-5 scale-50 -rotate-90 opacity-0 transition-[opacity,scale,rotate] duration-500 ease-out-expo light:scale-100 light:rotate-0 light:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
    </span>
</button>
