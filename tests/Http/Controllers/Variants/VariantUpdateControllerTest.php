<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Variants;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class VariantUpdateControllerTest extends TestCase
{
    public function castToJson($json)
    {
        if (is_array($json)) {
            $json = addslashes(json_encode($json));
        }

        return \DB::raw("CAST('{$json}' AS JSON)");
    }

    public function test_update_variants()
    {
        $product = Product::factory()->create();

        $options = [
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
        ];

        $optionsAfterUpdate = [
            [
                'name'=> 'Size',
                'id'=> 'M',
            ],
            [
                'name'=> 'Color',
                'id'=> 'Blue',
            ],
        ];

        $data = [
            'id'=> 0,
            'price'=> '10',
            'compare_at_price'=> '10',
            'cost_price'=> '10',
            'quantity'=> '0',
            'sku'=> '2001',
            'barcode'=> '222',
            'weight'=> '202',
            'hs_code'=> 'HS2020',
            'origin_country_id'=> '1',
            'taxable'=> false,
            'out_of_stock_sale'=> false,
            'tracked'=> false,
            'physical_product'=> true,
            'requires_shipping'=> true,
            'options'=> $optionsAfterUpdate,
        ];

        $variant = $product->variants()->create($data);
        $variant->options = $options;
        $variant->save();

        $response = $this->patch(route('lshopify.products.variants.update', $variant->id), $data);

        $variantData = collect($data)
            ->except('options', 'image', 'id')
            ->put('options', json_encode($optionsAfterUpdate))
            ->toArray();

        $this->assertDatabaseCount('variants', 1);
        $this->assertDatabaseHas('variants', $variantData);
    }
}
