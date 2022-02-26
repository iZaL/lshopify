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
            $table->unsignedInteger('location_id')->nullable();
            $table->decimal('subtotal', 8, 2)->default(0.00);
            $table->decimal('total', 8, 2)->default(0.00);
            $table->string('adjustment_term')->default('increment'); // increment, decrement, or none
            $table->boolean('restock')->default(1);
            $table->string('type')->default('fulfill'); // fulfill, refund, cancel, return
            $table->string('status')->default('pending'); // pending, processing, completed, failed
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
