<?php

namespace IZal\Lshopify\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use IZal\Lshopify\Models\Vendor;

class VendorFactory extends Factory
{
    protected $model = Vendor::class;

    public function definition()
    {
        return [
            'name' => Str::random(6),
        ];
    }
}
