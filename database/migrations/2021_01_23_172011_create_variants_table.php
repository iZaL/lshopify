<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVariantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //"id": 39760447996102,
        //"product_id": 6663764902086,
        //"title": "XS / Green",
        //"price": "10.000",
        //"sku": "",
        //"position": 12,
        //"inventory_policy": "deny",
        //"compare_at_price": null,
        //"fulfillment_service": "manual",
        //"inventory_management": null,
        //"option1": "XS",
        //"option2": "Green",
        //"option3": null,
        //"created_at": "2021-05-04T13:42:51+04:00",
        //"updated_at": "2021-05-04T13:43:47+04:00",
        //"taxable": true,
        //"barcode": "",
        //"grams": 0,
        //"image_id": null,
        //"weight": 0,
        //"weight_unit": "kg",
        //"inventory_item_id": 41854940610758,
        //"requires_shipping": true,
        //"admin_graphql_api_id": "gid://shopify/ProductVariant/39760447996102"

        Schema::create('variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('product_id');
            $table->unsignedInteger('image_id')->nullable();
            $table->unsignedInteger('origin_country_id')->nullable();
            $table->string('title')->nullable();
            $table->decimal('price', 9, 3)->nullable();
            $table->integer('position')->default(1);
            $table->integer('quantity')->default(0)->nullable();
            $table->string('sku')->nullable();
            $table->decimal('compare_at_price', 9, 3)->nullable();
            $table->decimal('cost_price', 9, 3)->nullable();
            $table->string('fulfillment_service')->default('manual');
            $table->string('barcode')->nullable()->notest('ISBN, UPC, GTIN, etc.');
            $table->decimal('weight', 8, 2)->nullable()->notes('Used to calculate shipping rates at checkout and label prices during fulfillment.');
            $table->string('weight_unit')->default('kg');
            $table->string('hs_code')->nullable();
            $table->json('options')->nullable();
            $table->boolean('out_of_stock_sale')->default(0)->notes('continue for sell continue when out of stock');
            $table->boolean('taxable')->default(1)->notes('Charge tax on this product');
            $table->boolean('tracked')->default(1);
            $table->boolean('requires_shipping')->default(1);
            $table->boolean('physical_product')->default(1);
            $table->boolean('default')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('variants');
    }
}
