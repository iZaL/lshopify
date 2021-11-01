<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFulfillmentVariantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fulfillment_variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('fulfillment_id');
            $table->unsignedInteger('variant_id');
            $table->integer('quantity')->default(1);
            $table->decimal('price');
            $table->decimal('unit_price');
            $table->decimal('total');
            $table->decimal('subtotal');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fulfillment_variants');
    }
}
