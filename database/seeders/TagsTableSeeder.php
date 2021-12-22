<?php

namespace Database\Seeders;

use IZal\Lshopify\Models\Tag;
use Illuminate\Database\Seeder;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Tag::factory()->create(['name' => 'Cotton']);
        Tag::factory()->create(['name' => 'Summer']);
    }
}
