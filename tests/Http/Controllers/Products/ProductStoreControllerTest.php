<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Products;

use Illuminate\Support\Facades\DB;
use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Tag;
use Illuminate\Http\UploadedFile;
use IZal\Lshopify\Tests\TestCase;

class ProductStoreControllerTest extends TestCase
{
    public function castToJson($json)
    {
        if (is_array($json)) {
            $json = addslashes(json_encode($json));
        }

        return DB::raw("CAST('{$json}' AS JSON)");
    }

    public function test_store_products()
    {
        $collection = Collection::factory()->create();
        $tag1 = Tag::factory()->create();
        $tag2 = Tag::factory()->create();
        $category = Category::factory()->create();

        $images = [UploadedFile::fake()->image('image.jpg'), UploadedFile::fake()->image('image.jpg')];

        $data = collect([
            'title'=> 'Short sleeve t-shirt',
            'description'=> null,
            'default_variant'=> [
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
                'tracked'=> false,
                'physical_product'=> true,
                'requires_shipping'=> true,
                'options'=> [
                    [
                        'id'=> 'Color',
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
                        'id'=> 'Size',
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
                        'id'=> 'Material',
                        'name'=> 'Material',
                        'values'=> [
                            [
                                'id'=> 'Cotton',
                                'name'=> 'Cotton',
                            ],
                        ],
                    ],
                ],

            ],
            'status'=> 'draft',
            'category'=> [
                'id'=> $category->id,
                'name'=> $category->name,
            ],
            'shipping'=> [
                'physical_product'=> false,
            ],
            'collections'=> [
                [
                    'id'=> $collection->id,
                    'name'=> $collection->name,
                ],
            ],
            'images'=> $images,
            'tags'=> [
                [
                    'id'=> $tag1->id,
                    'name'=> $tag1->name,
                ],
                [
                    'id'=> $tag2->id,
                    'name'=> $tag2->id,
                ],
            ],
        ]);

        $response = $this->post(route('lshopify.products.store'), $data->toArray());

        $productData = $data->only(['title', 'description'])
            ->put('category_id', $category->id);

        $variantData = collect($data->get('default_variant'));

        $variantData = $variantData
            ->except('options', 'image', 'id')
//            ->put('options',$this->castToJson($variantData->get('options')))
            ->toArray();

        $this->assertDatabaseHas('products', $productData->toArray());

        $product = Product::first();

        $this->assertDatabaseHas('collection_products', ['product_id' => $product->id, 'collection_id' => $collection->id]);
        $this->assertDatabaseHas('taggables', ['taggable_id' => $product->id, 'taggable_type'=> get_class($product), 'tag_id' => $tag1->id]);
        $this->assertDatabaseHas('taggables', ['taggable_id' => $product->id, 'taggable_type'=> get_class($product), 'tag_id' => $tag2->id]);

        $this->assertDatabaseHas('variants', ['default' => true]);
        $this->assertDatabaseHas('variants', ['default' => false]);
        $this->assertDatabaseHas('variants', $variantData);

        $this->assertDatabaseCount('images', 2);
        $this->assertDatabaseCount('variants', 5);
    }
}
