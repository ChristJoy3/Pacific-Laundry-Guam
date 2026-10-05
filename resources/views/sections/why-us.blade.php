@php
    $stats = [
        ['value' => now()->year - 1991, 'suffix' => '+', 'label' => 'Years serving Guam'],
        ['value' => 3, 'suffix' => '', 'label' => 'Industrial plants'],
        ['value' => 3, 'suffix' => '', 'label' => 'Tunnel washers'],
        ['value' => 118, 'suffix' => '+', 'label' => 'Team members'],
        ['value' => 3, 'suffix' => '', 'label' => 'Days of water reserve'],
    ];

    $assurances = [
        ['title' => 'Main and back-up boilers', 'body' => 'Every plant runs its own main boiler, with a back-up ready to take over.'],
        ['title' => 'Standby generators', 'body' => 'Operations continue during emergency power outages.'],
        ['title' => 'On-site water storage', 'body' => 'Tanks supply three full days of regular operations during water shortages.'],
        ['title' => 'Plants that back each other up', 'body' => 'Our facilities support each other, so service is never interrupted, even after typhoons and earthquakes.'],
    ];
@endphp

<section id="why-us" class="relative overflow-hidden py-28 md:py-44" aria-labelledby="why-title">
    {{-- Decorative parallax layer --}}
    <p class="text-outline pointer-events-none absolute top-16 -left-4 font-display text-[22vw] leading-none font-extrabold whitespace-nowrap select-none" aria-hidden="true" data-parallax="-0.3">
        Reliable
    </p>

    <div class="shell relative">
        <div class="max-w-3xl">
            <x-eyebrow>Why choose us</x-eyebrow>
            <h2 id="why-title" class="heading-section mt-6" data-split>Built to never stop.</h2>
            <p class="lead mt-8 max-w-xl" data-reveal>
                Hotels and hospitals can't pause, and neither do we. Our plants are engineered for continuity,
                so your linens keep moving whatever the island weather brings.
            </p>
        </div>

        <dl class="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-text/10 bg-text/10 md:grid-cols-3 lg:grid-cols-5">
            @foreach ($stats as $stat)
                <div class="flex flex-col-reverse gap-3 bg-background p-6 md:p-8 {{ $loop->last ? 'col-span-2 md:col-span-1' : '' }}" data-reveal>
                    <dt class="text-sm text-text/65">{{ $stat['label'] }}</dt>
                    <dd class="font-display text-5xl font-bold text-accent md:text-6xl">
                        <span data-counter="{{ $stat['value'] }}">{{ $stat['value'] }}</span>{{ $stat['suffix'] }}
                    </dd>
                </div>
            @endforeach
        </dl>

        <ul class="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
            @foreach ($assurances as $assurance)
                <li class="flex gap-5" data-reveal>
                    <span class="mt-2 size-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_18px] shadow-primary" aria-hidden="true"></span>
                    <div>
                        <h3 class="text-lg font-semibold">{{ $assurance['title'] }}</h3>
                        <p class="mt-2 leading-relaxed text-text/70">{{ $assurance['body'] }}</p>
                    </div>
                </li>
            @endforeach
        </ul>
    </div>
</section>
