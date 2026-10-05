{{--
    Client logo, used exactly as supplied. It is only resized proportionally (height set, width auto).
    The JPG has its own green background, so it sits on a rounded "badge plate":
    the plate gets the radius/shadow, the image itself gets no effects or filters.

    Usage: <x-logo size="h-10" />
--}}
@props(['size' => 'h-10'])

<span {{ $attributes->class('inline-flex shrink-0 overflow-hidden rounded-lg shadow-[0_10px_30px_-10px] shadow-primary/50 ring-1 ring-text/10') }}>
    <img
        src="{{ asset('PacificLogo.jpg') }}"
        alt="Pacific Laundry &amp; Textile Rental Service"
        width="398"
        height="102"
        class="{{ $size }} block w-auto max-w-none"
        decoding="async"
    >
</span>
