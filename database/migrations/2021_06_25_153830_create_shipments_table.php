<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('pending');
            //pending: working on it
            //attempted_delivery: Delivery of the shipment was attempted, but unable to be completed.
            //ready_for_pickup: The shipment is ready for pickup at a shipping depot.
            //confirmed: The carrier is aware of the shipment, but hasn't received it yet.
            //in_transit: The shipment is being transported between shipping facilities on the way to its destination.
            //out_for_delivery: The shipment is being delivered to its final destination.
            //delivered: The shipment was succesfully delivered.
            //failure: Something went wrong when pulling tracking information for the shipment, such as the tracking number was invalid or the shipment was canceled.

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
        Schema::dropIfExists('shipments');
    }
}
