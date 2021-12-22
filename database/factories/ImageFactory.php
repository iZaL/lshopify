<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Image;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ImageFactory extends Factory
{
    protected $model = Image::class;

    public function definition()
    {
        return [
            'name' => Str::random(6),
            'imageable_id' => 1,
            'imageable_type' => 'App\Models\Product',
        ];
    }
}
