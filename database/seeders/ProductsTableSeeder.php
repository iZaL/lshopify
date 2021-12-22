<?php

namespace Database\Seeders;

use IZal\Lshopify\Models\Image;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use Illuminate\Database\Seeder;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $product = Product::factory()->create([
            'title' => 'Short sleeve t-shirt',
            'description' => 'Short sleeve t-shirt Short sleeve t-shirt Short sleeve t-shirt',
        ]);

        $defaultVariant = Variant::factory()->create(['product_id' => $product->id, 'default' => 1]);

        $variant1 = Variant::factory()->create(
            [
                'product_id' => $product->id,
                'price' => 10,
                'quantity' => 10,
                'image_id' => 1,
                'options' => [
                    ['id' => 'M', 'name' => 'Size'],
                    ['id' => 'Black', 'name' => 'Color'],
                    ['id' => 'Cotton', 'name' => 'Material'],
                ],
            ]
        );
        $image1 = Image::factory()->create(['imageable_type' => get_class($variant1), 'imageable_id' => $variant1->id, 'name' => 'images/'.$variant1->id.'.jpg']);

        $variant2 = Variant::factory()->create(
            [
                'product_id' => $product->id,
                'price' => 15,
                'quantity' => 10,
                'image_id' => 2,
                'options' => [
                    ['id' => 'L', 'name' => 'Size'],
                    ['id' => 'Black', 'name' => 'Color'],
                    ['id' => 'Cotton', 'name' => 'Material'],
                ],
            ]
        );
        $image1 = Image::factory()->create(['imageable_type' => get_class($variant2), 'imageable_id' => $variant2->id, 'name' => 'images/'.$variant2->id.'.jpg']);

        $variant3 = Variant::factory()->create(
            [
                'product_id' => $product->id,
                'price' => 25,
                'quantity' => 5,
                'image_id' => 3,
                'options' => [
                    ['id' => 'M', 'name' => 'Size'],
                    ['id' => 'Blue', 'name' => 'Color'],
                    ['id' => 'Cotton', 'name' => 'Material'],
                ],
            ]
        );
        $image1 = Image::factory()->create(['imageable_type' => get_class($variant3), 'imageable_id' => $variant3->id, 'name' => 'images/'.$variant3->id.'.jpg']);

        $variant4 = Variant::factory()->create(
            [
                'product_id' => $product->id,
                'price' => 7,
                'quantity' => 3,
                'image_id' => 4,
                'options' => [
                    ['id' => 'L', 'name' => 'Size'],
                    ['id' => 'Blue', 'name' => 'Color'],
                    ['id' => 'Cotton', 'name' => 'Material'],
                ],
            ]
        );
        $image1 = Image::factory()->create(['imageable_type' => get_class($variant4), 'imageable_id' => $variant4->id, 'name' => 'images/'.$variant4->id.'.jpg']);
    }
}
