@php
    $links = [
        ['href' => '#about', 'label' => 'About'],
        ['href' => '#services', 'label' => 'Services'],
        ['href' => '#why-us', 'label' => 'Why Us'],
        ['href' => '#facilities', 'label' => 'Facilities'],
        ['href' => '#contact', 'label' => 'Contact'],
    ];
@endphp

{{-- Hides on scroll down, reappears on scroll up (resources/js/components/navbar.js). --}}
<header id="site-header" class="fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500" data-navbar>
    <div class="shell flex h-20 items-center justify-between gap-6">
        <a href="#top" class="rounded-lg" aria-label="Pacific Laundry, back to top">
            <x-logo size="h-8 md:h-10" />
        </a>

        <nav aria-label="Primary" class="hidden md:block">
            <ul class="flex items-center gap-8 text-sm font-medium text-text/75">
                @foreach ($links as $link)
                    <li>
                        <a href="{{ $link['href'] }}" class="relative py-2 transition-colors hover:text-text after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 after:ease-out-expo hover:after:scale-x-100" data-nav-link>
                            {{ $link['label'] }}
                        </a>
                    </li>
                @endforeach
            </ul>
        </nav>

        <div class="flex items-center gap-3">
            <x-theme-toggle />

            <a href="tel:+16716467311" data-cursor-label="Call" class="hidden rounded-full border border-text/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent lg:inline-flex" data-magnetic>
                <span data-magnetic-inner>(671) 646-7311</span>
            </a>

            <button
                type="button"
                class="relative inline-flex size-11 items-center justify-center rounded-full border border-text/20 md:hidden"
                aria-expanded="false"
                aria-controls="mobile-menu"
                data-menu-toggle
            >
                <span class="sr-only">Open menu</span>
                <span class="absolute h-px w-5 -translate-y-1 bg-text transition-transform duration-300" data-menu-bar="top"></span>
                <span class="absolute h-px w-5 translate-y-1 bg-text transition-transform duration-300" data-menu-bar="bottom"></span>
            </button>
        </div>
    </div>
</header>

{{-- Mobile menu overlay --}}
<div id="mobile-menu" class="invisible fixed inset-0 z-30 flex flex-col justify-center bg-background/95 opacity-0 backdrop-blur-md transition-[opacity,visibility] duration-500 md:hidden" data-mobile-menu>
    <nav aria-label="Mobile" class="shell">
        <ul class="flex flex-col gap-2">
            @foreach ($links as $link)
                <li>
                    <a href="{{ $link['href'] }}" class="block py-2 font-display text-4xl font-bold transition-colors hover:text-accent" data-mobile-link>
                        {{ $link['label'] }}
                    </a>
                </li>
            @endforeach
        </ul>
        <a href="tel:+16716467311" class="mt-10 inline-block text-lg text-accent">(671) 646-7311</a>
    </nav>
</div>
