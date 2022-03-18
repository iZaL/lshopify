<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Customers;

use IZal\Lshopify\Tests\TestCase;

class CustomerStoreControllerTest extends TestCase
{
    public function test_can_store_customer()
    {
        $customerData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'johndoe@example.com',
            'accepts_marketing' => 1,
            'tax_exempted' => 0,
        ];
        $addressData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
        ];

        $data = [
            'customer' => $customerData,
            'address' => $addressData,
        ];


        $req = $this->post(route('lshopify.customers.store'), $data);

        $this->assertDatabaseHas('customers', $customerData);
        $this->assertDatabaseHas('customer_addresses', array_merge($addressData, ['default' => 1]));
    }
}
