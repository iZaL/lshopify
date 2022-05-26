<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiscountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');// discount code, or Summer50% title etc
            $table->float('value')->nullable();
            $table->string('value_type')->default('percent');// amount, percentage
            $table->string('target_type')->default('all_products'); // all_products, products, collections;
            $table->string('min_requirement_type')->nullable()->default('amount'); // amount, quantity, null
            $table->float('min_requirement_value')->nullable();
            $table->string('allocation_method',)->default('each'); // each products, across;
            $table->string('customer_selection',)->default('all'); // all, custom, none;
            $table->integer('usage_limit')->nullable()->default(1);
            $table->text('reason')->nullable();
            $table->boolean('once_per_customer',)->default(1);
            $table->boolean('auto')->default(0); // is automatic
            $table->boolean('active')->default(1);
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();
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
        Schema::dropIfExists('discounts');
    }
};
