@php
    $milestones = [
        [
            'year' => '1989',
            'title' => 'Incorporated in Guam',
            'body' => 'Guam Tamagawa Co., Ltd. (formerly Nanbo-Tamagawa & Associates, Inc.) is incorporated on October 26 to provide laundry service and linen rental on the island.',
        ],
        [
            'year' => '1991',
            'title' => 'Doors open',
            'body' => 'Pacific Laundry, then called Pacific Textile, begins operating on April 1 with 35 employees and two clients: Palace Hotel Guam and Guam Dai-Ichi Hotel.',
        ],
        [
            'year' => '2004',
            'title' => 'Becoming the market leader',
            'body' => 'An operating agreement brings the facilities of Global Laundry, then our leading competitor, under our operation and makes Pacific Laundry the leader in the island\'s laundry industry.',
        ],
        [
            'year' => '2006',
            'title' => 'Full integration',
            'body' => 'All Global Laundry equipment comes under Pacific Laundry\'s control, further increasing our operating capacity.',
        ],
        [
            'year' => 'Today',
            'title' => 'Guam\'s most modern laundry',
            'body' => 'Three plants, over 118 team members, and the capacity to support the laundry needs of Guam\'s entire hotel industry.',
        ],
    ];
@endphp

<section id="about" class="relative py-28 md:py-44" aria-labelledby="about-title">
    <div class="shell grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div class="lg:sticky lg:top-32 lg:self-start">
            <x-eyebrow>About us</x-eyebrow>
            <h2 id="about-title" class="heading-section mt-6" data-split>From two hotels to an entire island.</h2>
            <p class="lead mt-8 max-w-lg" data-reveal>
                Since opening in 1991, we have kept up with Guam's changing needs, expanding our plants
                and keeping our equipment current with the latest laundry technology and infrastructure.
            </p>
            <p class="lead mt-5 max-w-lg" data-reveal>
                Through good years and hard ones, after typhoons and earthquakes,
                our customers have had continuous, uninterrupted service.
            </p>
        </div>

        <ol class="relative border-l border-text/10" data-timeline>
            @foreach ($milestones as $milestone)
                <li class="relative pb-14 pl-10 last:pb-0 md:pl-14" data-reveal>
                    <span class="absolute top-2 -left-[5px] size-[9px] rounded-full bg-primary ring-4 ring-background" aria-hidden="true"></span>
                    <p class="font-display text-3xl font-bold text-accent md:text-4xl">{{ $milestone['year'] }}</p>
                    <h3 class="mt-3 text-xl font-semibold">{{ $milestone['title'] }}</h3>
                    <p class="mt-3 max-w-md leading-relaxed text-text/70">{{ $milestone['body'] }}</p>
                </li>
            @endforeach
        </ol>
    </div>
</section>
