<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Products;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class ProductUpdateControllerTest extends TestCase
{
    public function test_can_update_products()
    {
        $variant = [];
        $variant['price'] = 200;
        $variant['compare_at_price'] = 220;
        $options = [];
        $options[] = ['value' => '1', 'label' => 'Size', 'options' => [['value' => '1', 'label' => 'M'], ['value' => '1', 'label' => 'L']]];
        $options[] = ['value' => '2', 'label' => 'Color', 'options' => [['value' => '1', 'label' => 'Black'], ['value' => '1', 'label' => 'Blue']]];
        $options[] = ['value' => '3', 'label' => 'Material', 'options' => [['value' => '1', 'label' => 'Satin'], ['value' => '1', 'label' => 'Cotton']]];
        $variant['options'] = $options;

        $product = Product::factory()
            ->hasVariants(1, function (array $attributes, Product $product) {
                return ['product_id' => $product->id, 'default' => 1];
            })
            ->hasVariants(3, function (array $attributes, Product $product) use ($variant) {
                return array_merge($variant, ['product_id' => $product->id]);
            })
            ->create();

        $productData = ['title' => 'Short sleeve t-shirt', 'description' => 'Short sleeve t-shirt description'];
        $data = $productData;

        $data['default_variant'] = $variant;
        $data['variants'] = [];
        foreach ($product->variants as $v) {
            $data['variants'][] = $v->toArray();
        }

        $response = $this->patch(route('lshopify.products.update',[$product->id]), $data);

        $this->assertDatabaseHas('products', $productData);
        $this->assertDatabaseCount('variants', 4);
        $this->assertDatabaseHas('variants', ['default' => 1]);
        $response->assertStatus(302);
    }
}
