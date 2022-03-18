<?php

namespace IZal\Lshopify\Http\Controllers\Order\Draft;

use IZal\Lshopify\Cart\Condition;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\OrderResource;
use IZal\Lshopify\Resources\ProductResource;
use IZal\Lshopify\Resources\VariantResource;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class DraftOrderEditController extends Controller
{
    public function __invoke($id): \Inertia\Response
    {
        $cart = app('cart');

        $products = Product::with(['variants'])
            ->latest()
            ->get();

        $productsResource = ProductResource::collection($products);

        $order = DraftOrder::with(['variants', 'discounts', 'cart_discount', 'customer'])->find($id);
        $orderResource = new OrderResource($order);

        $customers = Customer::all();
        $customersResource = CustomerResource::collection($customers);

        if (!session()->has('cartOrder') || session('cartOrder') !== $order->id) {
            $cart->clear();
            session()->put('cartOrder', $order->id);
            // sync DB orders with the cart, only on first request and ignore on subsequent requests.

            if ($order->cart_discount) {
                $discount = new Condition(
                    Arr::only($order->cart_discount->toArray(), ['value', 'suffix', 'type', 'target', 'name', 'reason'])
                );
                $suffix = $discount->suffix === 'percentage' ? '%' : '';
                $discount->setActions([
                    [
                        'value' => '-' . $discount->value . $suffix,
                    ],
                ]);
                $cart->removeConditionByName('cart');
                $cart->condition($discount);
            }

            foreach ($order->variants as $variant) {
                $cartItem = $cart->findByID($variant->id);
                if (!$cartItem) {
                    $cartItem = $cart->add([
                        'id' => $variant->id,
                        'name' => $variant->id,
                        'price' => $variant->pivot->price,
                        'quantity' => $variant->pivot->quantity,
                        'variant' => new VariantResource($variant),
                    ]);
                    $variantDiscounts = $order
                        ->discounts()
                        ->where('variant_id', $variant->id)
                        ->get();
                    foreach ($variantDiscounts as $discount) {
                        $discount = new Condition(
                            Arr::only($discount->toArray(), ['value', 'suffix', 'type', 'target', 'name', 'reason'])
                        );
                        $suffix = $discount->suffix === 'percentage' ? '%' : '';
                        $discount->setActions([
                            [
                                'value' => '-' . $discount->value . $suffix,
                            ],
                        ]);
                        $cart->update($cartItem->rowId, ['conditions' => $discount]);
                    }
                }
            }
        }

        $items = [];

        foreach ($cart->items() as $item) {
            $items[] = array_merge(
                Arr::only($item->toArray(), ['id', 'name', 'quantity', 'rowId', 'price', 'variant']),
                [
                    'total' => $item->total(),
                    'subtotal' => $item->subtotal(),
                    'unit_price' => $item->unit_price(),
                    'discount' => $item->getConditionByName($item->name),
                ]
            );
        }

        $cartData = [
            'total' => $cart->total(),
            'subtotal' => $cart->subtotal(),
            'discount_value' => $cart->discountedValue(),
            'discount' => $cart->getConditionByName('cart'),
            'items' => $items,
        ];

        $data = [
            'order' => $orderResource,
            'cart' => $cartData,
            'products' => $productsResource,
            'customers' => $customersResource,
        ];

        return Inertia::render('Order/Draft/DraftOrderEdit', $data);
    }
}
