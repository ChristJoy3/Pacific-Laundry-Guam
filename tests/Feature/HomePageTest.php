<?php

namespace Tests\Feature;

use Tests\TestCase;

class HomePageTest extends TestCase
{
    public function test_home_page_renders_every_section(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();

        foreach (['hero', 'about', 'services', 'why-us', 'facilities', 'equipment', 'trusted', 'contact'] as $sectionId) {
            $response->assertSee('id="'.$sectionId.'"', false);
        }
    }

    public function test_home_page_highlights_the_main_service_lines(): void
    {
        $response = $this->get(route('home'));

        $response->assertSeeInOrder(['Bulk Laundry Service', 'Linen Rental', 'Uniform Rental', 'Linen Sales', 'Healthcare Services', 'GreenEarth Dry Cleaning']);
    }

    public function test_every_service_shows_a_photo_with_alt_text(): void
    {
        $response = $this->get(route('home'));

        foreach (['bulk-laundry', 'linen-rental', 'uniform-rental', 'linen-sales', 'healthcare', 'dry-cleaning'] as $photo) {
            $this->assertFileExists(public_path("images/services/{$photo}.webp"));
            $response->assertSee("images/services/{$photo}.webp");
        }

        $response->assertSee('alt="Hospital ward with beds dressed in clean linen"', false);
    }

    public function test_equipment_section_follows_facilities_with_real_photos(): void
    {
        $response = $this->get(route('home'));

        $response->assertSeeInOrder(['id="facilities"', 'id="equipment"', 'id="trusted"'], false);
        $response->assertSeeInOrder(['Tunnel washers', 'BRAUN medical washer/extractors', 'Stand-alone dryers', 'Batch tunnel dryers', 'Flatwork ironers', 'Flatwork folders', 'Spreader/feeders', 'Union HL860', 'Our own fleet']);

        foreach (['tunnel-washer', 'braun-washer-extractor', 'flatwork-ironer', 'flatwork-folder', 'stand-alone-dryers', 'batch-tunnel-dryer', 'union-hl860', 'spreader-feeders', 'delivery-fleet'] as $photo) {
            $this->assertFileExists(public_path("images/equipment/{$photo}.webp"));
            $response->assertSee("images/equipment/{$photo}.webp");
        }
    }

    public function test_each_facility_shows_its_plant_photo(): void
    {
        $response = $this->get(route('home'));

        foreach (['main-plant', 'harmon-plant', 'maite-plant'] as $photo) {
            $this->assertFileExists(public_path("images/facilities/{$photo}.webp"));
        }

        $response->assertSeeInOrder(['images/facilities/main-plant.webp', 'images/facilities/harmon-plant.webp', 'images/facilities/maite-plant.webp']);
        $response->assertSee('alt="Harmon Plant, Routes 16 &amp; 27 intersection"', false);
    }

    public function test_footer_lists_the_related_links_from_the_original_site(): void
    {
        $response = $this->get(route('home'));

        $response->assertSee('aria-label="Related links"', false);

        foreach (['https://www.nanbo.com/', 'https://www.ghra.org/', 'https://www.kuam.com/', 'https://www.guampdn.com/'] as $url) {
            $response->assertSee('href="'.$url.'" target="_blank" rel="noopener"', false);
        }
    }

    public function test_home_page_shows_client_contact_details(): void
    {
        $response = $this->get(route('home'));

        $response->assertSeeInOrder(['Main Office', '(671) 646-7311', 'Harmon Office', '(671) 646-2490', 'Maite Office', '(671) 472-4486']);
        $response->assertSee('href="tel:+16716467311"', false);
        $response->assertSee('P.O. Box 24366');
    }

    public function test_home_page_offers_a_light_and_dark_theme_toggle(): void
    {
        $response = $this->get(route('home'));

        $response->assertSee('data-theme-toggle', false);
        $response->assertSee('aria-label="Switch to light mode"', false);
        // The saved/OS theme is applied by an inline script before first paint (no flash).
        $response->assertSeeInOrder(["localStorage.getItem('pl-theme')", '</head>'], false);
    }

    public function test_home_page_uses_the_original_logo_with_alt_text(): void
    {
        $response = $this->get(route('home'));

        $response->assertSee('PacificLogo.jpg');
        $response->assertSee('alt="Pacific Laundry &amp; Textile Rental Service"', false);
    }
}
