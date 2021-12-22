<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\CustomerAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerAddressFactory extends Factory
{
    protected $model = CustomerAddress::class;

    public function definition()
    {
        return [
            'customer_id' => Customer::factory()->create(),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'company' => $this->faker->company,
            'address1' => $this->faker->address,
            'address2' => $this->faker->address,
            'city' => $this->faker->city,
            'province' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'zip' => $this->faker->randomDigit,
            'country' => $this->faker->country,
            'phone' => $this->faker->phoneNumber,
        ];
    }

    public function default()
    {
        return $this->state(function (array $attributes) {
            return [
                'default' => 1,
            ];
        });
    }
}
