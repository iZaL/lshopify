<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Images;

use IZal\Lshopify\Models\Image;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class ImageDeleteControllerTest extends TestCase
{
    public function test_can_delete_images()
    {
        $product = Product::factory()->has(Image::factory()->count(3), 'images')->create();

        $images = $product->images()->get();

        $image1 = $images[0];
        $image2 = $images[1];
        $image3 = $images[2];

        $response = $this->post(route('lshopify.products.images.delete', $product->id), ['images' => [$image1, $image3]]);

        $this->assertDatabaseHas('images', ['id' => $image2->id]);
        $this->assertDatabaseMissing('images', ['id' => $image1->id]);
        $this->assertDatabaseMissing('images', ['id' => $image3->id]);
    }
}
