@php
    /**
     * Photos are the client's own, taken from the original pacificlaundryguam.com (frames cropped off).
     * Product shots ('fit' => 'contain') sit on their original #d7ffd8 studio backdrop, so the plate uses that colour.
     */
    $stages = ['Wash', 'Dry', 'Finish', 'Dry clean', 'Deliver'];

    $machines = [
        [
            'stage' => 0,
            'name' => 'Tunnel washers',
            'body' => 'Three tunnel washers with a counterflow wash zone and a separate rinse zone, so the cleanest water meets the cleanest laundry.',
            'image' => 'images/equipment/tunnel-washer.webp',
            'size' => [218, 212],
            'fit' => 'contain',
        ],
        [
            'stage' => 0,
            'name' => 'BRAUN medical washer/extractors',
            'body' => 'Clean-room loaders for healthcare: soiled in one side, clean out the other, behind a full barrier wall with negative airflow.',
            'image' => 'images/equipment/braun-washer-extractor.webp',
            'size' => [218, 212],
            'fit' => 'cover',
        ],
        [
            'stage' => 1,
            'name' => 'Stand-alone dryers',
            'body' => 'Every cycle tailored to the individual load, with concentrated drying for efficient use of energy.',
            'image' => 'images/equipment/stand-alone-dryers.webp',
            'size' => [218, 212],
            'fit' => 'cover',
        ],
        [
            'stage' => 1,
            'name' => 'Batch tunnel dryers',
            'body' => 'Inlet and outlet temperatures are monitored and the flame continually adjusted, for consistent drying and evenly distributed heat.',
            'image' => 'images/equipment/batch-tunnel-dryer.webp',
            'size' => [218, 212],
            'fit' => 'contain',
        ],
        [
            'stage' => 2,
            'name' => 'Flatwork ironers',
            'body' => 'Deep chest heating and large-diameter rolls produce crisp flatwork, with even pressure and minimal padding wear.',
            'image' => 'images/equipment/flatwork-ironer.webp',
            'size' => [492, 172],
            'fit' => 'contain',
        ],
        [
            'stage' => 2,
            'name' => 'Flatwork folders',
            'body' => 'Hand-folded quality accurate to 1/4", with precision folding for when presentation counts.',
            'image' => 'images/equipment/flatwork-folder.webp',
            'size' => [492, 172],
            'fit' => 'contain',
        ],
        [
            'stage' => 2,
            'name' => 'Spreader/feeders',
            'body' => 'Microprocessor-controlled spreading keeps every piece squared and centered, for edges of the highest quality.',
            'image' => 'images/equipment/spreader-feeders.webp',
            'size' => [492, 172],
            'fit' => 'contain',
        ],
        [
            'stage' => 3,
            'name' => 'Union HL860',
            'body' => 'Inline water-solvent separation, the Idromatic™ Still Cleaning System and self-cleaning EcoFilters for maximum solvent purity.',
            'image' => 'images/equipment/union-hl860.webp',
            'size' => [236, 302],
            'fit' => 'cover',
            'focus' => 'object-top',
        ],
        [
            'stage' => 4,
            'name' => 'Our own fleet',
            'body' => 'Five trucks and three delivery vans. Regular turnaround in 2–3 days, with 1-day service for emergencies.',
            'image' => 'images/equipment/delivery-fleet.webp',
            'size' => [488, 158],
            'fit' => 'cover',
        ],
    ];

    $total = str_pad(count($machines), 2, '0', STR_PAD_LEFT);
@endphp

{{--
    Desktop: the section pins and the machines play as a deck of cards, the top card tossed aside on each step
    while the "laundry line" rail and the outlined stage word follow along (resources/js/animations/equipment.js).
    Phones / reduced motion: the deck is a swipeable row (a 3-column grid on large screens).
    While pinned (.is-pinned, set by equipment.js) everything must fit one screen, so the deck width and the
    left column's type scale with the viewport height.
--}}
<section id="equipment" class="group/equipment relative overflow-hidden py-28 md:py-44 lg:py-0" aria-labelledby="equipment-title" data-equipment>
    {{-- Giant outlined stage word along the bottom of the section (desktop). --}}
    <div class="pointer-events-none absolute inset-x-0 bottom-[4vh] hidden h-[13vw] justify-center overflow-hidden select-none lg:flex" aria-hidden="true">
        @foreach ($stages as $stage)
            <span class="text-outline absolute font-display text-[13vw] leading-none font-extrabold whitespace-nowrap uppercase opacity-0 transition-[opacity,translate] duration-700 ease-out-expo translate-y-1/3 [&.is-active]:translate-y-0 [&.is-active]:opacity-100 {{ $loop->first ? 'is-active' : '' }}" data-equipment-word>
                {{ $stage }}
            </span>
        @endforeach
    </div>

    <div class="shell relative lg:flex lg:min-h-svh lg:items-center lg:gap-16 xl:gap-24 group-[.is-pinned]/equipment:pt-[max(5rem,9svh)] group-[.is-pinned]/equipment:pb-[4svh]">
        <div class="lg:flex-1">
            <x-eyebrow>Our equipment</x-eyebrow>
            <h2 id="equipment-title" class="heading-section mt-6 group-[.is-pinned]/equipment:mt-[2svh] group-[.is-pinned]/equipment:text-[clamp(2.25rem,7svh,4.75rem)]" data-split>From wash to delivery.</h2>
            <p class="lead mt-8 max-w-lg group-[.is-pinned]/equipment:mt-[2.4svh] group-[.is-pinned]/equipment:text-[clamp(0.95rem,2svh,1.2rem)]" data-reveal>
                State-of-the-art machinery with back-up units on standby, so our line runs round the clock
                without service interruptions.
            </p>

            {{-- The laundry line: stages light up as their machines take the top of the deck (desktop). --}}
            <div class="mt-14 hidden gap-6 lg:flex group-[.is-pinned]/equipment:mt-[5svh]" data-equipment-rail>
                <span class="relative w-px bg-text/15" aria-hidden="true">
                    <span class="absolute inset-0 origin-top scale-y-0 bg-accent" data-equipment-progress></span>
                </span>
                <ol class="grid gap-4 group-[.is-pinned]/equipment:gap-[1.6svh]">
                    @foreach ($stages as $stage)
                        <li class="flex items-baseline gap-4 text-text/40 transition-colors duration-500 [&.is-active]:text-text {{ $loop->first ? 'is-active' : '' }}" data-equipment-stage>
                            <span class="font-display text-sm font-bold text-accent/70">{{ str_pad($loop->iteration, 2, '0', STR_PAD_LEFT) }}</span>
                            <span class="font-display text-2xl font-bold group-[.is-pinned]/equipment:text-[clamp(1.125rem,3svh,1.5rem)]">{{ $stage }}</span>
                        </li>
                    @endforeach
                </ol>
            </div>
        </div>

        <ul class="-mx-5 mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:-mx-8 md:px-8 lg:mx-0 lg:mt-0 lg:grid lg:w-[min(28rem,36vw,56svh)] lg:shrink-0 lg:overflow-visible lg:px-0 lg:pb-0" aria-label="Our equipment, from wash to delivery" data-equipment-deck>
            @foreach ($machines as $machine)
                <li class="flex w-[82%] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] border border-text/10 bg-background shadow-2xl shadow-black/30 sm:w-[60%] md:w-[44%] lg:w-auto" data-equipment-card data-stage="{{ $machine['stage'] }}">
                    <div class="aspect-[5/4] overflow-hidden bg-[#d7ffd8] group-[.is-pinned]/equipment:aspect-[16/10] {{ $machine['fit'] === 'contain' ? 'p-6' : '' }}">
                        <img
                            src="{{ asset($machine['image']) }}"
                            alt="{{ $machine['name'] }} at Pacific Laundry"
                            width="{{ $machine['size'][0] }}"
                            height="{{ $machine['size'][1] }}"
                            loading="lazy"
                            decoding="async"
                            class="size-full {{ $machine['fit'] === 'contain' ? 'object-contain' : 'object-cover' }} {{ $machine['focus'] ?? '' }}"
                            data-equipment-image
                        >
                    </div>
                    <div class="flex grow flex-col p-7 group-[.is-pinned]/equipment:p-[clamp(1.25rem,3svh,1.75rem)]">
                        <div class="flex items-center justify-between gap-4 text-xs font-semibold tracking-[0.2em] uppercase">
                            <span class="text-accent">{{ $stages[$machine['stage']] }}</span>
                            <span class="text-text/45">{{ str_pad($loop->iteration, 2, '0', STR_PAD_LEFT) }} / {{ $total }}</span>
                        </div>
                        <h3 class="mt-3 font-display text-2xl font-bold group-[.is-pinned]/equipment:text-[clamp(1.25rem,3svh,1.5rem)]">{{ $machine['name'] }}</h3>
                        <p class="mt-3 text-sm leading-relaxed text-text/70">{{ $machine['body'] }}</p>
                    </div>
                </li>
            @endforeach
        </ul>
    </div>
</section>
