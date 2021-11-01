<?php

namespace IZal\Lshopify\Http\Controllers\Order\Draft;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class DraftOrderCreateController extends Controller
{
    public function __invoke(Request $request): \Inertia\Response
    {
        $products = Product::with(['variants'])
            ->latest()
            ->get();
        $productsResource = ProductResource::collection($products);

        $cart = app('cart');

        $items = [];

        foreach ($cart->items() as $item) {
            $items[] = array_merge(
                Arr::only($item->toArray(), ['id', 'name', 'quantity', 'rowId', 'price', 'variant']),
                [
                    'total' => $item->total(),
                    'subtotal' => $item->subtotal(),
                    'unit_price' => round($item->unit_price(), 2),
                    'discount' => $item->getConditionByName($item->name),
                ]
            );
        }

        $cartData = [
            'total' => $cart->total(),
            'subtotal' => $cart->subtotal(),
            'discount_value' => round($cart->subtotal() - $cart->total(), 2),
            'items' => $items,
            'discount' => $cart->getConditionByName('cart'),
        ];

        $data = [
            'products' => $productsResource,
            'cart' => $cartData,
        ];

        return Inertia::render('Order/Draft/DraftOrderCreate', $data);
    }
}
