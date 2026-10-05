@php
    $offices = [
        ['name' => 'Main Office', 'phone' => '(671) 646-7311', 'fax' => '(671) 646-7177'],
        ['name' => 'Harmon Office', 'phone' => '(671) 646-2490', 'fax' => '(671) 646-2494'],
        ['name' => 'Maite Office', 'phone' => '(671) 472-4486', 'fax' => '(671) 472-4488'],
    ];

    $toTel = fn (string $number): string => 'tel:+1'.preg_replace('/\D/', '', $number);
@endphp

<section id="contact" class="relative flex min-h-svh items-center py-28 md:py-44" aria-labelledby="contact-title">
    <div class="shell">
        <x-eyebrow>Contact</x-eyebrow>
        <h2 id="contact-title" class="mt-6 max-w-5xl font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.03em]" data-split>
            Let's keep your linens <span class="text-accent">moving.</span>
        </h2>
        <p class="lead mt-8 max-w-xl" data-reveal>
            Ask about bulk laundry, linen and uniform rental, linen sales, healthcare or dry cleaning, or visit one of our drop-off stations.
            Our team is a phone call away.
        </p>

        <div class="mt-10 flex flex-wrap gap-4" data-reveal>
            <x-button :href="$toTel($offices[0]['phone'])" data-cursor-label="Call">Call the main office</x-button>
            <x-button href="#facilities" variant="ghost">Find a location</x-button>
        </div>

        <div class="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            @foreach ($offices as $office)
                <div class="rounded-3xl border border-text/10 bg-background/80 p-8 transition-colors duration-500 hover:border-primary/40" data-reveal>
                    <h3 class="font-display text-xl font-bold">{{ $office['name'] }}</h3>
                    <dl class="mt-5 grid gap-3 text-sm">
                        <div class="flex justify-between gap-4">
                            <dt class="text-text/60">Phone</dt>
                            <dd><a href="{{ $toTel($office['phone']) }}" class="font-semibold text-accent hover:underline" data-cursor-label="Call">{{ $office['phone'] }}</a></dd>
                        </div>
                        <div class="flex justify-between gap-4">
                            <dt class="text-text/60">Fax</dt>
                            <dd class="text-text/85">{{ $office['fax'] }}</dd>
                        </div>
                    </dl>
                </div>
            @endforeach

            <div class="rounded-3xl border border-text/10 bg-background/80 p-8" data-reveal>
                <h3 class="font-display text-xl font-bold">Mailing address</h3>
                <address class="mt-5 text-sm leading-relaxed text-text/85 not-italic">
                    Pacific Laundry &amp; Textile Rental Service<br>
                    P.O. Box 24366<br>
                    GMF, Guam 96921
                </address>
            </div>
        </div>
    </div>
</section>
