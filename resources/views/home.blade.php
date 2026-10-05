<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#06140d">

        {{-- Apply the saved (or OS-preferred) theme before first paint to avoid a flash. See resources/js/components/theme.js. --}}
        <script>
            (() => {
                let theme = null;
                try { theme = localStorage.getItem('pl-theme'); } catch {}
                theme ??= matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                document.documentElement.dataset.theme = theme;
                if (theme === 'light') document.querySelector('meta[name="theme-color"]').content = '#f2f7f0';
            })();
        </script>

        <title>Pacific Laundry &amp; Textile Rental Service | Commercial Laundry &amp; Dry Cleaning in Guam</title>
        <meta name="description" content="Guam's leading commercial laundry since 1991. Bulk laundry, linen and uniform rental, linen sales, hospital clean-room laundry, and eco-friendly GreenEarth dry cleaning across three plants.">
        <link rel="canonical" href="{{ url('/') }}">

        <meta property="og:type" content="website">
        <meta property="og:title" content="Pacific Laundry &amp; Textile Rental Service">
        <meta property="og:description" content="Delivering the highest quality of service consistent with building &amp; maintaining long-term relationships. Guam's commercial laundry since 1991.">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:image" content="{{ asset('PacificLogo.jpg') }}">
        <meta name="twitter:card" content="summary">

        @fonts

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body id="top" class="min-h-screen bg-background font-sans text-text">
        <a href="#main" class="sr-only z-50 rounded-md bg-accent px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4">Skip to content</a>

        <x-preloader />

        {{-- Persistent Three.js canvas (decorative). --}}
        <canvas id="webgl" aria-hidden="true"></canvas>
        <div class="page-vignette" aria-hidden="true"></div>
        <div class="page-grain" aria-hidden="true"></div>

        @include('sections.navbar')

        <main id="main" class="relative z-10">
            @include('sections.hero')
            @include('sections.about')
            @include('sections.services')
            @include('sections.why-us')
            @include('sections.facilities')
            @include('sections.equipment')
            @include('sections.trusted')
            @include('sections.contact')
        </main>

        @include('sections.footer')
    </body>
</html>
