<?php

namespace IZal\Lshopify\Tests\Http\Controllers;

use Inertia\Testing\Assert;
use Inertia\Testing\AssertableInertia;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Tests\TestCase;

class DiscountControllerTest extends TestCase
{
    public function test_get_index()
    {
        $response = $this->get(route('lshopify.discounts.index'));
        $response->assertStatus(200);
    }

    public function test_create()
    {
        $response = $this->get(route('lshopify.discounts.create'));
        $response->assertStatus(200);
    }

    public function test_store()
    {

        $data = [
            "title" => "XXXXX",
            "code" => "ZJ1GQMH1",
            "type" => "automatic",
            "value" => 300,
            "value_type" => "percentage",
            "target_type" => "all_products",
            "min_requirement_type" => "amount",
            "min_requirement_value" => "5",
            "once_per_customer" => true,
            'allocation_method' => 'each',
            "usage_limit" => "5",
            "customer_selection" => "all",
            "customers" => [],
        ];

        $dbValues = collect($data)->except(['customers'])->toArray();
        $response = $this->post(route('lshopify.discounts.store'), $data);

        $this->assertDatabaseHas('discounts',$dbValues);

    }

    public function test_edit()
    {
        $discount = Discount::factory()->create();
        $response = $this->get(route('lshopify.discounts.edit',1)) ;
        $response->assertInertia(
            fn (AssertableInertia $assert) =>
            $assert
            ->has('discount', fn (AssertableInertia $page) => $page
                ->where('title',$discount->title)
                ->where('id',$discount->id)
                ->where('code',$discount->code)
                ->where('type',$discount->type)
                ->where('value',$discount->value)
                ->where('value_type',$discount->value_type)
                ->where('target_type',$discount->target_type)
                ->where('min_requirement_type',$discount->min_requirement_type)
                ->where('min_requirement_value',$discount->min_requirement_value)
                ->where('once_per_customer',$discount->once_per_customer)
                ->where('usage_limit',$discount->usage_limit)
                ->where('customer_selection',$discount->customer_selection)
                ->where('customers',$discount->customers)
            )
        );
    }

}
