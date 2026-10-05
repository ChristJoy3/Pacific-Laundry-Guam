@php
    /** Related links carried over from the original pacificlaundryguam.com. */
    $relatedLinks = [
        ['href' => 'https://www.nanbo.com/', 'name' => 'Nanbo', 'type' => 'Insurance'],
        ['href' => 'https://www.ghra.org/', 'name' => 'GHRA', 'type' => 'Guam Hotel & Restaurant Association'],
        ['href' => 'https://www.kuam.com/', 'name' => 'KUAM', 'type' => 'News'],
        ['href' => 'https://www.guampdn.com/', 'name' => 'Pacific Daily News', 'type' => 'News'],
    ];
@endphp

<footer class="relative z-10 border-t border-text/10 bg-background">
    <div class="shell flex flex-col gap-12 py-16 md:flex-row md:items-start md:justify-between">
        <div class="max-w-sm">
            <x-logo size="h-12" />
            <p class="mt-6 text-sm leading-relaxed text-text/65">
                Guam's privately owned commercial laundry. Linen service, healthcare laundry
                and GreenEarth dry cleaning since 1991.
            </p>
        </div>

        <div class="flex flex-col gap-12 sm:flex-row sm:gap-20">
            <nav aria-label="Footer">
                <p class="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Explore</p>
                <ul class="mt-5 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                    <li><a href="#about" class="text-text/75 hover:text-accent">About</a></li>
                    <li><a href="#services" class="text-text/75 hover:text-accent">Services</a></li>
                    <li><a href="#why-us" class="text-text/75 hover:text-accent">Why Us</a></li>
                    <li><a href="#facilities" class="text-text/75 hover:text-accent">Facilities</a></li>
                    <li><a href="#equipment" class="text-text/75 hover:text-accent">Equipment</a></li>
                    <li><a href="#trusted" class="text-text/75 hover:text-accent">Clients</a></li>
                    <li><a href="#contact" class="text-text/75 hover:text-accent">Contact</a></li>
                </ul>
            </nav>

            <nav aria-label="Related links">
                <p class="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Related links</p>
                <ul class="mt-5 grid gap-3 text-sm">
                    @foreach ($relatedLinks as $link)
                        <li>
                            <a href="{{ $link['href'] }}" target="_blank" rel="noopener" class="group inline-flex items-baseline gap-2 text-text/75 hover:text-accent">
                                <span class="font-semibold text-text group-hover:text-accent">{{ $link['name'] }}</span>
                                <span class="text-text/55 group-hover:text-accent">{{ $link['type'] }}</span>
                                <span class="sr-only">(opens in a new tab)</span>
                                <svg class="size-3 self-center opacity-60" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4m0 0H5m7 0v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
                            </a>
                        </li>
                    @endforeach
                </ul>
            </nav>
        </div>
    </div>

    <div class="shell flex flex-col gap-3 border-t border-text/10 py-8 text-xs text-text/65 md:flex-row md:justify-between">
        <p>&copy; {{ now()->year }} Pacific Laundry &amp; Textile Rental Service. All rights reserved.</p>
        <a href="#top" class="hover:text-accent">Back to top &uarr;</a>
    </div>
</footer>
