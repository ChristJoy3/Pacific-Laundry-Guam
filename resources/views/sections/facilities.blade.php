@php
    /**
     * 'image' is optional (null shows a generated gradient visual). The plant photos are the client's own,
     * taken from the original pacificlaundryguam.com with their frames cropped off.
     */
    $plants = [
        [
            'name' => 'Main Plant',
            'location' => 'Harmon Industrial Park',
            'summary' => 'Our main laundry operations facility, in the heart of Harmon Industrial Park.',
            'equipment' => ['10/batch tunnel washer', '6 steam dryers', '2 flatwork ironers', '2 flatwork folders', 'Conventional washers & dryers'],
            'map' => 'https://www.google.com/maps/search/?api=1&query=Harmon+Industrial+Park+Guam',
            'image' => 'images/facilities/main-plant.webp',
        ],
        [
            'name' => 'Harmon Plant',
            'location' => 'Routes 16 & 27 intersection',
            'summary' => 'Home of our dedicated hospital clean room, and a drop-off point for customers in the north.',
            'equipment' => ['2 tunnel washers (10/batch & 8/batch)', '5 flatwork ironers', '2 flatwork folders', '6 steam dryers', 'Clean room for Guam Memorial Hospital'],
            'map' => 'https://www.google.com/maps/search/?api=1&query=Route+16+and+Route+27+Harmon+Guam',
            'image' => 'images/facilities/harmon-plant.webp',
        ],
        [
            'name' => 'Maite Plant',
            'location' => 'Maite, central Guam',
            'summary' => 'Our main dry cleaning facility, and a drop-off point for customers in south and central Guam.',
            'equipment' => ['Union HL860 dry cleaning machine', 'GreenEarth solvent system', 'Steamed flat ironers', 'Conventional washers & dryers'],
            'map' => 'https://www.google.com/maps/search/?api=1&query=Maite+Guam',
            'image' => 'images/facilities/maite-plant.webp',
        ],
    ];
@endphp

{{-- On md+ screens the track scrolls horizontally while the section is pinned (step 4). --}}
<section id="facilities" class="relative py-28 md:overflow-x-auto md:py-0" aria-labelledby="facilities-title" data-facilities>
    <div class="md:flex md:min-h-svh md:items-center">
        <div class="flex flex-col gap-6 px-5 md:w-max md:flex-row md:items-stretch md:gap-8 md:px-[8vw]" data-h-track>
            <div class="flex flex-col justify-center md:w-[min(34rem,40vw)] md:pr-8">
                <x-eyebrow>Our facilities</x-eyebrow>
                <h2 id="facilities-title" class="heading-section mt-6" data-split>Three plants. One standard.</h2>
                <p class="lead mt-8" data-reveal>
                    Strategically located across northern and central Guam, our plants together can handle
                    the volume of the island's entire hotel industry.
                </p>
            </div>

            @foreach ($plants as $plant)
                <article class="group flex flex-col overflow-hidden rounded-3xl border border-text/10 bg-background/80 transition-colors duration-500 hover:border-primary/40 md:w-[min(28rem,72vw)]" data-h-card>
                    <div class="relative {{ $plant['image'] ? 'aspect-[21/9]' : 'aspect-[16/10]' }} overflow-hidden bg-gradient-to-br from-secondary via-secondary/40 to-background">
                        @if ($plant['image'])
                            <img src="{{ asset($plant['image']) }}" alt="{{ $plant['name'] }}, {{ $plant['location'] }}" width="492" height="172" class="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" loading="lazy" decoding="async">
                        @else
                            <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,var(--color-primary)_0%,transparent_55%)] opacity-50 transition-opacity duration-700 group-hover:opacity-80" aria-hidden="true"></div>
                            <span class="absolute right-6 bottom-2 font-display text-8xl font-extrabold text-text/10" aria-hidden="true">
                                {{ str_pad($loop->iteration, 2, '0', STR_PAD_LEFT) }}
                            </span>
                        @endif
                    </div>

                    <div class="flex grow flex-col p-8">
                        <p class="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{{ $plant['location'] }}</p>
                        <h3 class="mt-3 font-display text-3xl font-bold">{{ $plant['name'] }}</h3>
                        <p class="mt-4 leading-relaxed text-text/70">{{ $plant['summary'] }}</p>

                        <ul class="mt-6 grid gap-2 text-sm text-text/80">
                            @foreach ($plant['equipment'] as $equipment)
                                <li class="flex gap-3">
                                    <span class="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span>
                                    {{ $equipment }}
                                </li>
                            @endforeach
                        </ul>

                        <a href="{{ $plant['map'] }}" target="_blank" rel="noopener" data-cursor-label="Map" class="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-accent hover:underline">
                            Get directions
                            <span class="sr-only">to the {{ $plant['name'] }} (opens Google Maps in a new tab)</span>
                            <svg class="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4m0 0H5m7 0v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        </a>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
