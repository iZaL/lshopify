<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('parent_id')->nullable();
            $table->unsignedInteger('user_id')->nullable();
            $table->unsignedInteger('order_id');
            $table->string('kind')->default('sale'); //  refund
            $table->string('gateway')->default('manual'); // visa
            $table->decimal('amount', 8, 2);
            $table->string('currency')->default('USD');
            $table->string('reference')->nullable();
            $table->json('payment_details')->nullable();
            $table->string('source')->default('web'); // iphone, android
            $table->string('error_code')->nullable(); // iphone, android
            $table->string('message')->nullable(); // iphone, android
            $table->string('status')->default('success'); // pending, failure, success, error
            $table->timestamp('processed_at')->default(\Carbon\Carbon::now()->toDateTimeString());
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
        Schema::dropIfExists('transactions');
    }
}
