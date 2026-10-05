{{--
    Pill call-to-action link. Magnetic hover is wired up in JS via [data-magnetic].

    Usage: <x-button href="#contact">Contact us</x-button>
           <x-button href="tel:+16716467311" variant="ghost">Call</x-button>
--}}
@props(['href', 'variant' => 'primary'])

<a
    href="{{ $href }}"
    data-magnetic
    {{ $attributes->class([
        'group relative inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold tracking-wide transition-colors duration-300',
        'bg-primary text-background hover:bg-accent' => $variant === 'primary',
        'border border-text/20 text-text hover:border-accent hover:text-accent' => $variant === 'ghost',
    ]) }}
>
    <span data-magnetic-inner class="relative inline-flex items-center gap-3">
        {{ $slot }}
        <svg class="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 8h13m0 0L9 3m5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </span>
</a>
