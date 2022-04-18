<?php

use Illuminate\Support\Facades\Route;
use IZal\Lshopify\Http\Controllers\CartController;
use IZal\Lshopify\Http\Controllers\CartDiscountController;
use IZal\Lshopify\Http\Controllers\CategoryController;
use IZal\Lshopify\Http\Controllers\Collection\CollectionController;
use IZal\Lshopify\Http\Controllers\Collection\CollectionProductController;
use IZal\Lshopify\Http\Controllers\CustomerController;
use IZal\Lshopify\Http\Controllers\DashboardController;
use IZal\Lshopify\Http\Controllers\DiscountController;
use IZal\Lshopify\Http\Controllers\ImageController;
use IZal\Lshopify\Http\Controllers\InventoryController;
use IZal\Lshopify\Http\Controllers\Order\DraftOrderController;
use IZal\Lshopify\Http\Controllers\Order\FulfillmentController;
use IZal\Lshopify\Http\Controllers\Order\OrderController;
use IZal\Lshopify\Http\Controllers\Order\PaymentController;
use IZal\Lshopify\Http\Controllers\Order\RefundController;
use IZal\Lshopify\Http\Controllers\Order\ReturnController;
use IZal\Lshopify\Http\Controllers\Product\ProductBulkEditorController;
use IZal\Lshopify\Http\Controllers\Product\ProductController;
use IZal\Lshopify\Http\Controllers\TagController;
use IZal\Lshopify\Http\Controllers\Product\VariantController;
use IZal\Lshopify\Http\Controllers\VendorController;

Route::group(['prefix' => 'cart', 'as' => 'cart.'], function () {
    Route::controller(CartController::class)->group(function () {
        Route::post('add','add')->name('add');
        Route::post('update', 'update')->name('update');
        Route::post('remove', 'remove')->name('remove');
        Route::post('clear', 'clear')->name('clear');
    });
    Route::controller(CartDiscountController::class)->group(function () {
        Route::post('discount/add', 'add')->name('discount.add');
        Route::post('discount/remove', 'remove')->name('discount.remove');
    });
});

Route::controller(CategoryController::class)->group(function () {
    Route::post('categories', 'store')->name('categories.store');
});

Route::group(['prefix' => 'products','as' => 'products.'], function () {
    Route::controller(ProductController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::get('/{id}/edit', 'edit')->name('edit');
        Route::post('/', 'store')->name('store');
        Route::post('delete', 'delete')->name('delete');
        Route::patch('/{id}/update', 'update')->name('update');
    });
    Route::controller(ProductBulkEditorController::class)->group(function () {
        Route::get('bulk_editor', 'index')->name('bulk_editor.index');
        Route::post('bulk_editor', 'update')->name('bulk_editor.update');
    });
    Route::controller(VariantController::class)->group(function () {
        Route::get('/{id}/variants/create', 'create')->name('variants.create');
        Route::get('/{id}/variants/{variantID}/edit', 'edit')->name('variants.edit');
        Route::post('/{id}/variants', 'store')->name('variants.store');
        Route::post('/{id}/variants/attributes', 'attributes')->name('variants.attributes');
        Route::post('/{id}/variants/delete', 'delete')->name('variants.delete');
        Route::patch('/variants/{id}', 'update')->name('variants.update');
    });
});

Route::group(['prefix' => 'collections','as' => 'collections.'], function () {
    Route::controller(CollectionController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::get('/{id}/edit', 'edit')->name('edit');
        Route::post('/', 'store')->name('store');
        Route::patch('/{id}', 'update')->name('update');
        Route::delete('/{id}', 'delete')->name('destroy');
    });
    Route::post('/{id}/products', [CollectionProductController::class,'store'])->name('products.store');
});

Route::group(['prefix' => 'orders','as' => 'orders.'], function () {
    Route::controller(OrderController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{id}', 'show')->name('show');
        Route::post('/', 'store')->name('store');
        Route::post('/{id}/edit', 'edit')->name('edit');
        Route::patch('/{id}', 'update')->name('update');
    });
    Route::controller(FulfillmentController::class)->group(function () {
        Route::get('/{id}/fulfillments', 'index')->name('fulfillments.index');
        Route::post('/{id}/fulfillments', 'store')->name('fulfillments.store');
        Route::post('/{id}/fulfillments/{fulfillment_id}/delete', 'delete')->name('fulfillments.delete');
    });

    Route::controller(RefundController::class)->group(function () {
        Route::get('/{id}/refund', 'index')->name('refund.index');
        Route::post('/{id}/refund', 'store')->name('refund.store');
    });

    Route::controller(ReturnController::class)->group(function () {
        Route::get('/{id}/return', 'index')->name('return.index');
        Route::post('/{id}/return', 'store')->name('return.store');
        Route::post('/{id}/return/{return_id}/edit', 'edit')->name('return.edit');
    });

    Route::post('/{id}/payments', [PaymentController::class,'store'])->name('payments.store');
});

Route::group(['prefix' => 'draft/orders','as' => 'draft.orders.'], function () {
    Route::controller(DraftOrderController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}/edit', 'edit')->name('edit');
        Route::patch('/{id}', 'update')->name('update');
        Route::delete('/{id}', 'delete')->name('destroy');
        Route::post('/{id}/customer', 'attachCustomer')->name('customer.update');
        Route::post('/{id}/confirm','confirm')->name('confirm');
    });
});

Route::controller(ImageController::class)->group(function () {
    Route::post('images', 'store')->name('images.store');
    Route::post('images/delete', 'delete')->name('images.delete');
});

Route::get('inventories', [InventoryController::class,'index'])->name('inventories.index');

Route::group(['prefix' => 'customers','as' => 'customers.'], function () {
    Route::get('/', [CustomerController::class, 'index'])->name('index');
    Route::post('/', [CustomerController::class, 'store'])->name('store');
});


Route::group(['prefix' => 'discounts','as' => 'discounts.'], function () {
    Route::get('/', [DiscountController::class, 'index'])->name('index');
    Route::get('/create', [DiscountController::class, 'create'])->name('create');
    Route::post('/', [DiscountController::class, 'store'])->name('store');
});


Route::post('vendors', [VendorController::class,'store'])->name('vendors.store');

Route::post('tags', [TagController::class,'store'])->name('tags.store');

Route::get('/', DashboardController::class)->name('home');

