<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Variants;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class VariantStoreControllerTest extends TestCase
{
    public function castToJson($json)
    {
        if (is_array($json)) {
            $json = addslashes(json_encode($json));
        }

        return \DB::raw("CAST('{$json}' AS JSON)");
    }

    public function test_create_variants()
    {
        $product = Product::factory()->create();

        $data = [
            'id'=> 0,
            'price'=> '10',
            'compare_at_price'=> '10',
            'cost_price'=> '10',
            'quantity'=> '0',
            'sku'=> '2001',
            'barcode'=> '222',
            'weight'=> '20',
            'hs_code'=> 'HS2020',
            'origin_country_id'=> '1',
            'taxable'=> true,
            'out_of_stock_sale'=> true,
            'track_quantity'=> false,
            'physical_product'=> true,
            'requires_shipping'=> true,
            'options'=> [
                [
                    'id'=> '2',
                    'name'=> 'Color',
                    'options'=> [
                        [
                            'id'=> 'Black',
                            'name'=> 'Black',
                        ],
                        [
                            'id'=> 'Brown',
                            'name'=> 'Brown',
                        ],
                    ],
                ],
                [
                    'id'=> '1',
                    'name'=> 'Size',
                    'options'=> [
                        [
                            'id'=> 'XL',
                            'name'=> 'XL',
                        ],
                        [
                            'id'=> 'L',
                            'name'=> 'L',
                        ],
                    ],
                ],
                [
                    'id'=> '3',
                    'name'=> 'Material',
                    'options'=> [
                        [
                            'id'=> 'Cotton',
                            'name'=> 'Cotton',
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->post(route('lshopify.products.variants.store', $product->id), $data);

        $variantData = collect($data)
            ->except('options', 'image', 'id')
            ->put('options', json_encode($data['options']))
            ->toArray();

        $this->assertDatabaseCount('variants', 1);

        $this->assertDatabaseHas('variants', $variantData);
    }
}
