{{-- Small uppercase label shown above section headings. --}}
<p {{ $attributes->class('inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent') }} data-reveal>
    <span class="h-px w-8 bg-accent/60" aria-hidden="true"></span>
    {{ $slot }}
</p>
