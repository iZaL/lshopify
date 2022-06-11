<?php

namespace IZal\Lshopify\Tests\Http\Controllers;

use Carbon\Carbon;
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

        $startsAt = "2022-04-27T09:30:00.434Z";
        $endsAt = "2022-04-28T09:30:00.434Z";

        $data = [
            "name" => "XXXXX",
            "auto" => 1,
            "value" => 300,
            "value_type" => "percent",
            "target_type" => "all_products",
            "min_requirement_type" => "amount",
            "min_requirement_value" => "5",
            "once_per_customer" => true,
            'allocation_method' => 'each',
            "usage_limit" => "5",
            "customer_selection" => "all",
            "customers" => [],
            "starts_at" => $startsAt,
            "ends_at" => $endsAt
        ];

        $startsAtParsed = Carbon::parse($startsAt)->subDay(1);

        $this->travelTo($startsAtParsed);

        $dbValues = collect($data)->except(['customers','starts_at','ends_at'])->toArray();
        $dbValues['starts_at'] = Carbon::parse($startsAt)->toDateTimeString();
        $dbValues['ends_at'] = Carbon::parse($endsAt)->toDateTimeString();
        $response = $this->post(route('lshopify.discounts.store'), $data);

        $this->assertDatabaseHas('discounts',$dbValues);

    }

    public function test_edit()
    {
        $discount = Discount::factory()->create();

        $response = $this->get(route('lshopify.discounts.edit',$discount->id)) ;

        $response->assertStatus(200);

//        $discount = Discount::factory()->create();
//        $response->assertInertia(
//            fn (AssertableInertia $assert) =>
//            $assert
//            ->has('discount', fn (AssertableInertia $page) => $page
//                ->where('id',$discount->id)
//                ->where('name',$discount->name)
//                ->where('value',$discount->value)
//                ->where('value_type',$discount->value_type)
//                ->where('target_type',$discount->target_type)
//                ->where('min_requirement_type',$discount->min_requirement_type)
//                ->where('min_requirement_value',$discount->min_requirement_value)
//                ->where('once_per_customer',$discount->once_per_customer)
//                ->where('usage_limit',$discount->usage_limit)
//                ->where('customer_selection',$discount->customer_selection)
//                ->where('customers',$discount->customers)
//            )
//        );
    }

    public function test_update()
    {

        $startsAt = "2022-04-27T09:30:00.434Z";
        $endsAt = "2022-04-28T09:30:00.434Z";


        $data = [
            "name" => "XXXXX",
            "auto" => 1,
            "value" => 300,
            "value_type" => "percent",
            "target_type" => "all_products",
            "min_requirement_type" => "amount",
            "min_requirement_value" => "5",
            "once_per_customer" => true,
            'allocation_method' => 'each',
            "usage_limit" => "5",
            "customer_selection" => "all",
            "customers" => [],
            "starts_at" => $startsAt,
            "ends_at" => $endsAt
        ];

        $startsAtParsed = Carbon::parse($startsAt)->subDay(1);

        $this->travelTo($startsAtParsed);

        $dbValues = collect($data)->except(['customers','starts_at','ends_at'])->toArray();
        $dbValues['starts_at'] = Carbon::parse($startsAt)->toDateTimeString();
        $dbValues['ends_at'] = Carbon::parse($endsAt)->toDateTimeString();

        $discount = Discount::factory()->create();

        $this->patch(route('lshopify.discounts.update',$discount->id), $data);

        $this->assertDatabaseHas('discounts',$dbValues);

    }

}
