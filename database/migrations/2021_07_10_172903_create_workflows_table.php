<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkflowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workflows', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('order_id');
            $table->unsignedInteger('shipment_id')->nullable();
            $table->unsignedInteger('location_id')->nullable();
            $table->string('type')->default('fulfilled'); // fulfillment, refund, cancel, returned
            $table->string('status')->default('pending'); // pending, success, error, failure, cancelled
            //pending: App has created the fulfillment and is waiting for the third-party fulfillment service to transition it to 'open' or 'success'.
            //success: The fulfillment was successful.
            //cancelled: The fulfillment was cancelled.
            //error: There was an error with the fulfillment request.
            //failure: The fulfillment request failed.
            $table->boolean('restock')->default(1);
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
        Schema::dropIfExists('workflows');
    }
}
