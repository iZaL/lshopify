<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Variants;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class VariantControllerTest extends TestCase
{

    public function test_create_variants()
    {
        $product = Product::factory()->create();

        $data = [
            'id'=> 0,
            'options'=> [
                [
                    'id'=> '2',
                    'name'=> 'Color',
                    'values'=> [
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
                    'values'=> [
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
                    'values'=> [
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
