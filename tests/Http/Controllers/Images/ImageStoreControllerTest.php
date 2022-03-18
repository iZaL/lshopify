<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Images;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class ImageStoreControllerTest extends TestCase
{
    public function test_throws_error_when_images_array_missing()
    {
        $response = $this->post(route('lshopify.images.store', []), []);
        $response->assertSessionHasErrors(['images']);
    }

//    public function test_throws_error_when_images_array_is_not_file()
//    {
//        $product = Product::factory()->create();
//        $response = $this->post(route('lshopify.products.images.store',$product->id),['images' => [['id' => 1]]]);
//        $response->assertSessionHasErrors(['images']);
//    }
//
//    /**
//     * @fix
//     */
//    public function test_images_store()
//    {
//        $product = Product::factory()->create();
//        Storage::fake('images');
//        $images = [UploadedFile::fake()->image('image1.jpg'),UploadedFile::fake()->image('image2.jpg')];
//        $response = $this->post(route('lshopify.products.images.store',$product->id),['images' => $images]);
//        $this->assertDatabaseCount('images',2);
//        $response->assertSessionHasErrors(['images']);
//    }
}
