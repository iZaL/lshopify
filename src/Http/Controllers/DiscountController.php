<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\Request;
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

        return Inertia::render('Discount/DiscountCreate', [
            'discount_type' => $discountType,
        ]);
    }
}
