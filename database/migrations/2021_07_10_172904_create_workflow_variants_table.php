<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkflowVariantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workflow_variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('workflow_id');
            $table->unsignedInteger('variant_id');
            $table->integer('quantity')->default(1);
            $table->decimal('price')->default(0.00);
            $table->decimal('unit_price')->default(0.00);
            $table->decimal('total')->default(0.00);
            $table->decimal('subtotal')->default(0.00);
            $table->decimal('tax')->default(0.00);
            $table->decimal('applied_discount')->default(0.00);
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
        Schema::dropIfExists('workflow_variants');
    }
}
