<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use IZal\Lshopify\Cart\Condition;
use IZal\Lshopify\Http\Requests\DiscountStoreRequest;

class DiscountController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Discount/DiscountIndex', []);
    }

    public function create(Request $request)
    {
        $validDiscountTypes = [
            'code' => 'Code',
            'automatic' => 'Automatic',
        ];
        $discountType = $request->type ?? 'code';
        if(!in_array($discountType, array_keys($validDiscountTypes))) {
            $discountType = 'code';
        }

        $discount = [
            'code' => Str::upper(Str::random(8)),
            'type' => $discountType,
            'value' => 300,
            'value_type' => 'fixed_amount',
            'target_type' => 'all_products',
            'min_requirement_type' => 'none',
            'min_requirement_value' => 0,
            'once_per_customer' => 0,
            'usage_limit' => 1,
        ];

        return Inertia::render('Discount/DiscountCreate', [
            'discount' => $discount,
        ]);
    }
}
