<?php

use Illuminate\Support\Facades\Route;

Route::post('cart/add', \IZal\Lshopify\Http\Controllers\Cart\CartAddController::class)->name('cart.add');
Route::post('cart/update', \IZal\Lshopify\Http\Controllers\Cart\CartUpdateController::class)->name('cart.update');
Route::post('cart/remove', \IZal\Lshopify\Http\Controllers\Cart\CartRemoveController::class)->name('cart.remove');
Route::post('cart/clear', \IZal\Lshopify\Http\Controllers\Cart\CartClearController::class)->name('cart.clear');
Route::post('cart/discount/add', \IZal\Lshopify\Http\Controllers\Cart\CartDiscountAddController::class)->name('cart.discount.add');
Route::post('cart/discount/remove', \IZal\Lshopify\Http\Controllers\Cart\CartDiscountRemoveController::class)->name('cart.discount.remove');

/*
 * Products Controller
 */
Route::get('products', \IZal\Lshopify\Http\Controllers\Product\ProductIndexController::class)->name('products.index');
Route::get('products/new', \IZal\Lshopify\Http\Controllers\Product\ProductCreateController::class)->name('products.create');
Route::get('products/{id}/edit', \IZal\Lshopify\Http\Controllers\Product\ProductEditController::class)->name('products.edit');
Route::get('products/bulk_edit', \IZal\Lshopify\Http\Controllers\Product\ProductBulkEditController::class)->name('products.bulk_edit');
Route::post('products', \IZal\Lshopify\Http\Controllers\Product\ProductStoreController::class)->name('products.store');
Route::post('products/attributes', \IZal\Lshopify\Http\Controllers\Product\ProductAttributesController::class)->name('products.attributes');
Route::post('products/delete', \IZal\Lshopify\Http\Controllers\Product\ProductDeleteController::class)->name('products.delete');
Route::patch('products/{id}', \IZal\Lshopify\Http\Controllers\Product\ProductUpdateController::class)->name('products.update');

/*
 * Variants Controllers
 */
Route::get('products/{id}/variants/create', \IZal\Lshopify\Http\Controllers\Variant\VariantCreateController::class)->name('products.variants.create');
Route::get('products/{id}/variants/{variantID}/edit', \IZal\Lshopify\Http\Controllers\Variant\VariantEditController::class)->name('products.variants.edit');
Route::post('products/{id}/variants', \IZal\Lshopify\Http\Controllers\Variant\VariantStoreController::class)->name('products.variants.store');
Route::post('products/{id}/variants/attributes', \IZal\Lshopify\Http\Controllers\Variant\VariantAttributeController::class)->name('products.variants.attributes');
Route::post('products/{id}/variants/delete', \IZal\Lshopify\Http\Controllers\Variant\VariantDeleteController::class)->name('products.variants.destroy');
Route::patch('variants/{id}', \IZal\Lshopify\Http\Controllers\Variant\VariantUpdateController::class)->name('variants.update');

/*
 * Misc Controllers
 */
Route::post('products/{id}/images', \IZal\Lshopify\Http\Controllers\Image\ImageStoreController::class)->name('products.images.store');
Route::post('products/{id}/images/delete', \IZal\Lshopify\Http\Controllers\Image\ImageDeleteController::class)->name('products.images.destroy');

/*
 * Collections Controller
 */
Route::get('collections', \IZal\Lshopify\Http\Controllers\Collection\CollectionIndexController::class)->name('collections.index');
Route::get('collections/new', \IZal\Lshopify\Http\Controllers\Collection\CollectionCreateController::class)->name('collections.create');
Route::get('collections/{id}/edit', \IZal\Lshopify\Http\Controllers\Collection\CollectionEditController::class)->name('collections.edit');
Route::post('collections', \IZal\Lshopify\Http\Controllers\Collection\CollectionStoreController::class)->name('collections.store');
Route::post('collections/{id}/products', \IZal\Lshopify\Http\Controllers\Collection\CollectionProductUpdateController::class)->name('collections.products.update');
Route::patch('collections/{id}', \IZal\Lshopify\Http\Controllers\Collection\CollectionUpdateController::class)->name('collections.update');
Route::delete('collections/{id}', \IZal\Lshopify\Http\Controllers\Collection\CollectionDeleteController::class)->name('collections.destroy');

/*
 * Orders Controller
 */
Route::get('orders', \IZal\Lshopify\Http\Controllers\Order\OrderIndexController::class)->name('orders.index');
Route::get('orders/{id}', \IZal\Lshopify\Http\Controllers\Order\OrderShowController::class)->name('orders.show');
Route::post('orders', \IZal\Lshopify\Http\Controllers\Order\OrderStoreController::class)->name('orders.store');
Route::patch('orders/{id}', \IZal\Lshopify\Http\Controllers\Order\OrderUpdateController::class)->name('orders.update');
Route::get('orders/{id}/fulfillments', \IZal\Lshopify\Http\Controllers\Order\Fulfillment\FulfillmentIndexController::class)->name('orders.fulfillments');
Route::post('orders/{id}/fulfillments', \IZal\Lshopify\Http\Controllers\Order\Fulfillment\FulfillmentStoreController::class)->name('orders.fulfillments');
Route::post('orders/{id}/fulfillments/{fulfillment_id}/cancel', \IZal\Lshopify\Http\Controllers\Order\Fulfillment\FulfillmentCancelController::class)->name('orders.fulfillments.cancel');
Route::get('orders/{id}/return', \IZal\Lshopify\Http\Controllers\Order\Fulfillment\ReturnIndexController::class)->name('orders.return');
Route::post('orders/{id}/return', \IZal\Lshopify\Http\Controllers\Order\Fulfillment\ReturnStoreController::class)->name('orders.return');
Route::post('orders/{id}/return/{return_id}/edit', \IZal\Lshopify\Http\Controllers\Order\Fulfillment\ReturnEditController::class)->name('orders.return.edit');

Route::post('orders/{id}/payments', \IZal\Lshopify\Http\Controllers\Order\Transaction\PaymentStoreController::class)->name('orders.payments.store');
Route::get('orders/{id}/refund', \IZal\Lshopify\Http\Controllers\Order\Transaction\RefundShowController::class)->name('orders.refund.show');
Route::post('orders/{id}/refund', \IZal\Lshopify\Http\Controllers\Order\Transaction\RefundController::class)->name('orders.refund');

/*
 * Draft Orders Controller
 */
Route::get('draft_orders', \IZal\Lshopify\Http\Controllers\Order\Draft\DraftOrderIndexController::class)->name('draft.orders.index');
Route::get('draft_orders/new', \IZal\Lshopify\Http\Controllers\Order\Draft\DraftOrderCreateController::class)->name('draft.orders.create');
Route::get('draft_orders/{id}/edit', \IZal\Lshopify\Http\Controllers\Order\Draft\DraftOrderEditController::class)->name('draft.orders.edit');
Route::post('draft_orders', \IZal\Lshopify\Http\Controllers\Order\Draft\DraftOrderStoreController::class)->name('draft.orders.store');
Route::delete('draft_orders/{id}', \IZal\Lshopify\Http\Controllers\Order\Draft\DraftOrderDeleteController::class)->name('draft.orders.destroy');
Route::patch('draft_orders/{id}', [\IZal\Lshopify\Http\Controllers\Order\Draft\DraftOrderUpdateController::class, 'update'])->name('draft.orders.update');
Route::post('draft_orders/{id}/customer', [\IZal\Lshopify\Http\Controllers\Order\Draft\DraftOrderUpdateController::class, 'attachCustomer'])->name('draft.orders.customer.update');
Route::post('draft_orders/{id}/confirm', \IZal\Lshopify\Http\Controllers\Order\Draft\DraftOrderConfirmController::class)->name('draft.orders.confirm');

/*
 * Inventories Controllers
 *
 */
Route::get('inventories', \IZal\Lshopify\Http\Controllers\Variant\InventoriesIndexController::class)->name('inventories.index');

/*
 * Customers Controller
 */
Route::post('customers', \IZal\Lshopify\Http\Controllers\Customer\CustomerStoreController::class)->name('customers.store');

/*
 * Categories Controllers
 */
Route::post('categories', \IZal\Lshopify\Http\Controllers\Category\CategoryStoreController::class)->name('categories.store');
Route::post('tags', \IZal\Lshopify\Http\Controllers\Tag\TagStoreController::class)->name('tags.store');

Route::get('/', \IZal\Lshopify\Http\Controllers\DashboardController::class)->name('home');

