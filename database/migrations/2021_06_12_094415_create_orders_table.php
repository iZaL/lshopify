<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->unsignedInteger('customer_id')->nullable();
            $table->unsignedInteger('draft_id')->nullable();
            $table->unsignedInteger('discount_id')->nullable();

            $table->decimal('total', 8, 2)->nullable();
            $table->decimal('subtotal', 8, 2)->nullable();
            $table->string('currency')->default('USD');
            $table->integer('quantity')->default(0);

            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();

            $table->string('shipping_first_name')->nullable();
            $table->string('shipping_last_name')->nullable();
            $table->string('shipping_company')->nullable();
            $table->text('shipping_address1')->nullable();
            $table->text('shipping_address2')->nullable();
            $table->string('shipping_zip')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_province')->nullable();
            $table->string('shipping_country')->nullable();
            $table->string('shipping_phone')->nullable();
            $table->string('shipping_street')->nullable();
            $table->float('shipping_latitude')->nullable();
            $table->float('shipping_longitude')->nullable();

            $table->string('billing_first_name')->nullable();
            $table->string('billing_last_name')->nullable();
            $table->string('billing_company')->nullable();
            $table->text('billing_address1')->nullable();
            $table->text('billing_address2')->nullable();
            $table->string('billing_zip')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_province')->nullable();
            $table->string('billing_country')->nullable();
            $table->string('billing_phone')->nullable();
            $table->string('billing_street')->nullable();

            $table->boolean('draft')->default(1);
            $table->string('status')->default('open'); // archived, cancelled

            $table->string('browser_ip')->nullable();
            $table->timestamp('cancelled_at')->nullable();
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
        Schema::dropIfExists('orders');
    }
}
