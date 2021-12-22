<?php

namespace Database\Seeders;

use IZal\Lshopify\Models\Collection;
use Illuminate\Database\Seeder;

class CollectionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Collection::factory()->create(['name' => 'Home page']);
        Collection::factory()->create(['name' => 'Summer collections']);
    }
}
