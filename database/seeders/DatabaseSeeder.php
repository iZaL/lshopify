<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    protected $tables = [
        'users',
        'collections',
        'products',
        'collection_products',
        'variants',
        'images',
        'tags',
        'categories',
        'countries',
        'taggables',
        'tags',
        'vendors',
        'orders',
        'order_variants',
        'customers',
    ];

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        foreach ($this->tables as $table) {
            DB::table($table)->truncate();
        }

        $this->call([
            CollectionsTableSeeder::class,
            CategoriesTableSeeder::class,
            TagsTableSeeder::class,
            ProductsTableSeeder::class,
        ]);

        Model::reguard();
    }
}
