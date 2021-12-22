<?php

namespace Database\Seeders;

use IZal\Lshopify\Models\Category;
use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::factory()->create(['name' => 'Shirts']);
        Category::factory()->create(['name' => 'Sports']);
    }
}
