@php
    /**
     * Photos live in public/images/services (Pexels License: free for commercial use, no attribution required).
     */
    $services = [
        [
            'image' => 'images/services/bulk-laundry.webp',
            'alt' => 'White linens loaded into a cart beside an industrial washer',
            'title' => 'Bulk Laundry Service',
            'body' => 'Full laundry service for customers who own their linen. From housekeeping to food and beverage, we handle all of your linen needs and return them clean, well ironed, smooth and odorless, with quality results and cost control through efficient use of your linens.',
            'items' => ['Bed sheets', 'Pillow cases', 'Towels', 'Bath mats', 'Duvet covers', 'Comforters', 'Bedspreads', 'Table cloths', 'Napkins'],
        ],
        [
            'image' => 'images/services/linen-rental.webp',
            'alt' => 'Hotel bed made up with crisp white sheets and pillows',
            'title' => 'Linen Rental',
            'body' => 'Never purchase or replace worn linen again. Rent quality sheets and towels in sizes to suit your hotel, plus table linen for hotels and restaurants, and receive additional linen for unforeseen needs on a timely basis.',
            'items' => ['Sheets', 'Towels', 'Tablecloths in various textiles & colors', 'Matching napkins', 'Extra linen on demand'],
        ],
        [
            'image' => 'images/services/uniform-rental.webp',
            'alt' => 'Chef in a white chef coat and black apron',
            'title' => 'Uniform Rental',
            'body' => 'A uniform program designed to custom-fit your type of business or profession, with specialty uniforms for the food service industry and specialty garments for healthcare professionals.',
            'items' => ['Chef coats', 'Aprons', 'Patient gowns', 'Scrubwear', 'Doctor\'s pants & shirts'],
        ],
        [
            'image' => 'images/services/linen-sales.webp',
            'alt' => 'Neat stack of new white bed linen',
            'title' => 'Linen Sales',
            'body' => 'Quality bed linen, table linen and other textile products for sale to the hospitality, healthcare and food service industries, as well as the government and other markets.',
            'items' => ['Bed linen', 'Table linen', 'Textile products', 'Hospitality', 'Healthcare', 'Food service', 'Government'],
        ],
        [
            'image' => 'images/services/healthcare.webp',
            'alt' => 'Hospital ward with beds dressed in clean linen',
            'title' => 'Healthcare Services',
            'body' => 'We understand the unique linen, garment and laundry needs of medical institutions, and that our products have a direct impact on a patient\'s experience. As Guam Memorial Hospital\'s exclusive provider, we process its laundry in a dedicated clean room, isolated from all other clients, with an emphasis on sanitation.',
            'items' => ['Clean room processing', 'Isolated from other clients', 'Medical linens & garments', 'Exclusive GMH provider'],
        ],
        [
            'image' => 'images/services/dry-cleaning.webp',
            'alt' => 'Suits and shirts hanging on a garment rail',
            'title' => 'GreenEarth Dry Cleaning',
            'body' => 'We dry clean only with GreenEarth solvent on our Union HL860 machine, in compliance with EPA/OSHA and Clean Air Act regulations. Wools stay soft, silks are treated gently, and colors stay bright. We also clean wedding gowns, formal wear and Battle Dress Uniforms (BDUs) for our servicemen.',
            'items' => ['GreenEarth solvent', 'Union HL860', 'Wedding gowns', 'Formal wear & tuxedos', 'BDUs'],
        ],
    ];
@endphp

{{-- Desktop: the section pins and panels play in sequence while the matching photo is revealed on the right
     (resources/js/animations/services.js adds .is-pinned). Otherwise each card shows its own photo.
     While pinned, the whole composition must fit one screen, so its type and spacing scale with the viewport
     height (the svh-based group-[.is-pinned] sizes) and the top padding clears the navbar. --}}
<section id="services" class="group/services relative py-28 md:py-44 lg:py-0" aria-labelledby="services-title" data-services>
    <div class="shell lg:relative lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-12 group-[.is-pinned]/services:pt-[max(5.5rem,11svh)] group-[.is-pinned]/services:pb-[4svh]">
        <div class="max-w-3xl lg:max-w-2xl">
            <div class="flex items-center justify-between gap-6">
                <x-eyebrow>What we do</x-eyebrow>

                {{-- Progress indicator, shown only while pinned. --}}
                <div class="hidden items-center gap-4 text-sm font-bold" data-service-progress aria-hidden="true">
                    <span class="font-display text-accent" data-service-count>01</span>
                    <span class="h-px w-32 overflow-hidden bg-text/15">
                        <span class="block h-full origin-left bg-accent" data-service-bar></span>
                    </span>
                    <span class="font-display text-text/50">{{ str_pad(count($services), 2, '0', STR_PAD_LEFT) }}</span>
                </div>
            </div>
            <h2 id="services-title" class="heading-section mt-6 group-[.is-pinned]/services:mt-[2svh] group-[.is-pinned]/services:text-[clamp(2.25rem,6.6svh,4.75rem)]" data-split>Every linen need, handled.</h2>
            <p class="lead mt-8 max-w-xl lg:mt-6 group-[.is-pinned]/services:mt-[2.2svh] group-[.is-pinned]/services:text-[clamp(0.95rem,2svh,1.2rem)]" data-reveal>
                There is much more to laundry than washing and drying. You are in the hospitality business,
                so let Pacific Laundry be your partner in customer service.
            </p>
        </div>

        <ol class="mt-20 grid gap-6 md:mt-28 lg:mt-10 lg:max-w-2xl group-[.is-pinned]/services:mt-[3.5svh]" data-service-list>
            @foreach ($services as $service)
                <li
                    class="grid gap-6 rounded-3xl border border-text/10 bg-background/70 p-8 transition-colors duration-500 hover:border-primary/40 md:grid-cols-[auto_1fr] md:gap-12 md:p-12 lg:gap-8 lg:p-9 group-[.is-pinned]/services:gap-[clamp(1rem,3svh,2rem)] group-[.is-pinned]/services:p-[clamp(1.25rem,3.6svh,2.25rem)]"
                    data-service-panel
                >
                    <img
                        src="{{ asset($service['image']) }}"
                        alt="{{ $service['alt'] }}"
                        width="1200"
                        height="1500"
                        loading="lazy"
                        decoding="async"
                        class="aspect-[4/3] w-full rounded-2xl object-cover md:col-span-2 group-[.is-pinned]/services:hidden"
                    >
                    <span class="font-display text-5xl font-bold text-primary md:text-7xl lg:text-6xl group-[.is-pinned]/services:text-[clamp(2.25rem,6.5svh,3.75rem)]" aria-hidden="true">
                        {{ str_pad($loop->iteration, 2, '0', STR_PAD_LEFT) }}
                    </span>
                    <div>
                        <h3 class="font-display text-3xl font-bold md:text-4xl group-[.is-pinned]/services:text-[clamp(1.375rem,3.8svh,2.25rem)]">{{ $service['title'] }}</h3>
                        <p class="mt-5 max-w-2xl leading-relaxed text-text/75 lg:mt-4 group-[.is-pinned]/services:mt-[1.4svh] group-[.is-pinned]/services:text-[clamp(0.875rem,1.9svh,1rem)]">{{ $service['body'] }}</p>
                        <ul class="mt-7 flex flex-wrap gap-2 lg:mt-5 group-[.is-pinned]/services:mt-[2svh]" aria-label="{{ $service['title'] }} includes">
                            @foreach ($service['items'] as $item)
                                <li class="rounded-full border border-text/15 px-4 py-1.5 text-sm text-text/80 group-[.is-pinned]/services:py-1 group-[.is-pinned]/services:text-[clamp(0.75rem,1.6svh,0.875rem)] transition-colors duration-300 hover:border-accent/50 hover:text-text">{{ $item }}</li>
                            @endforeach
                        </ul>
                    </div>
                </li>
            @endforeach
        </ol>

        {{-- Pinned photo stage (desktop). Decorative: each card above carries the same photo with alt text. --}}
        <div class="pointer-events-none absolute inset-y-0 right-8 hidden items-center group-[.is-pinned]/services:flex" aria-hidden="true">
            <div class="relative aspect-[4/5] h-[min(76svh,40rem)] overflow-hidden rounded-[2rem] border border-text/10 bg-text/5 shadow-2xl shadow-black/30" data-service-stage>
                @foreach ($services as $service)
                    <div class="absolute inset-0 overflow-hidden" data-service-media>
                        <img src="{{ asset($service['image']) }}" alt="" width="1200" height="1500" loading="lazy" decoding="async" class="size-full object-cover" data-service-image>
                    </div>
                @endforeach
                <div class="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent"></div>
            </div>
        </div>
    </div>
</section>
