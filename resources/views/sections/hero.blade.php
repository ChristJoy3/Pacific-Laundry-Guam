<section id="hero" class="relative flex min-h-svh items-end pt-32 pb-24 md:items-center md:pb-0" aria-labelledby="hero-title">
    <div class="shell">
        <x-eyebrow>Commercial laundry &middot; Guam &middot; Since 1991</x-eyebrow>

        {{-- The client's own tagline (from their original site banner). --}}
        <h1 id="hero-title" class="mt-6 font-display text-[clamp(2.1rem,5vw,4.75rem)] leading-[1] font-extrabold tracking-[-0.03em]" data-split>
            Delivering the<br>
            <span class="text-accent">highest quality</span><br>
            of service
        </h1>

        <p class="mt-6 max-w-2xl font-display text-[clamp(1.15rem,2vw,1.75rem)] leading-snug font-semibold text-text/85" data-reveal>
            consistent with building &amp; maintaining
            <span class="text-accent"><span class="whitespace-nowrap">long-term</span> relationships.</span>
        </p>

        <p class="lead mt-6 max-w-xl" data-reveal>
            Pacific Laundry &amp; Textile Rental Service is Guam's privately owned commercial laundry,
            trusted by the island's hotels, restaurants and hospital since 1991.
        </p>

        <div class="mt-10 flex flex-wrap gap-4" data-reveal>
            <x-button href="#services">Explore our services</x-button>
            <x-button href="#contact" variant="ghost">Contact us</x-button>
        </div>
    </div>

    {{-- Scroll hint --}}
    <div class="pointer-events-none absolute right-5 bottom-8 hidden items-center gap-4 text-xs font-semibold tracking-[0.3em] text-text/50 uppercase md:right-8 md:flex" aria-hidden="true">
        Scroll
        <span class="relative h-12 w-px overflow-hidden bg-text/15">
            <span class="absolute inset-x-0 top-0 h-1/2 animate-[scroll-hint_2s_var(--ease-out-expo)_infinite] bg-accent"></span>
        </span>
    </div>
</section>
