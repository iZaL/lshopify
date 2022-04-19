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
        ];

        return Inertia::render('Discount/DiscountCreate', [
            'discount' => $discount,
        ]);
    }
}
