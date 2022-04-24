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
//        title: string | null;
//        code: string;
//        type: 'code' | 'automatic';
//        value: string;
//        value_type: 'fixed_amount' | 'percentage';
//        target_type: 'all_products' | 'products' | 'collections';
//        min_requirement_type: 'amount' | 'quantity' | null;
//        min_requirement_value: string;
//        once_per_customer: boolean;
//        usage_limit: string | null;
//        customers: Customer[];
//        customer_selection: 'all' | 'custom' | 'none';
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('code')->nullable();
            $table->string('type')->default('code'); // code, automatic
            $table->float('value')->nullable();
            $table->string('value_type')->default('percentage');// fixed_amount, percentage
            $table->string('target_type')->default('all_products'); // all_products, products, collections;
            $table->string('min_requirement_type')->nullable()->default('amount'); // amount, quantity, null
            $table->float('min_requirement_value')->nullable(); // all_products, products, collections;
            $table->string('allocation_method',)->default('each'); // each products, across;
            $table->string('customer_selection',)->default('all'); // all, custom, none;
            $table->boolean('once_per_customer',)->default(1);
            $table->integer('usage_limit')->nullable()->default(1);
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
