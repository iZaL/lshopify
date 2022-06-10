<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Products;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class ProductUpdateControllerTest extends TestCase
{
    public function test_can_update_products_with_variants()
    {

        $variantOptions = [];
        $variantOptions[] = ['name' => 'Size', 'id' => 'Size', 'values' => [['id' => 'S', 'name' => 'S'], ['id' => 'M', 'name' => 'M']]];
        $variantOptions[] = ['name' => 'Color', 'id' => 'Color', 'values' => [['id' => 'Black', 'name' => 'Black'], ['id' => 'Blue', 'name' => 'Blue']]];
        $variantOptions[] = ['name' => 'Material', 'id' => 'Material', 'values' => [['id' => 'Cotton', 'name' => 'Cotton'], ['value' => 'id', 'name' => 'Satin']]];

        $variant = [];
        $variant['price'] = 200;
        $variant['compare_at_price'] = 220;
        $variant['options'] = $variantOptions;

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
        $this->assertDatabaseCount('variants', 12);
        $this->assertDatabaseHas('variants', ['default' => 1]);
        $response->assertStatus(302);
    }
    public function test_can_update_products()
    {

        $variantOptions = [];
        $variantOptions[] = ['name' => 'Size', 'id' => 'Size', 'values' => [['id' => 'S', 'name' => 'S'], ['id' => 'M', 'name' => 'M']]];
        $variantOptions[] = ['name' => 'Color', 'id' => 'Color', 'values' => [['id' => 'Black', 'name' => 'Black'], ['id' => 'Blue', 'name' => 'Blue']]];
        $variantOptions[] = ['name' => 'Material', 'id' => 'Material', 'values' => [['id' => 'Cotton', 'name' => 'Cotton'], ['value' => 'id', 'name' => 'Satin']]];

        $variant = [];
        $variant['price'] = 200;
        $variant['compare_at_price'] = 220;
        $variant['options'] = $variantOptions;

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
        $this->assertDatabaseCount('variants', 12);
        $this->assertDatabaseHas('variants', ['default' => 1]);
        $response->assertStatus(302);
    }
}
