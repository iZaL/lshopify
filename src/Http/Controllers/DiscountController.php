<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use IZal\Lshopify\Http\Requests\DiscountStoreRequest;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\DiscountResource;


class DiscountController extends Controller
{

    protected Discount $discount;

    public function __construct(Discount $discount)
    {
        $this->discount = $discount;
    }

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
            'title' => '',
            'code' => Str::upper(Str::random(8)),
            'type' => $discountType,
            'value' => 300,
            'value_type' => 'percentage',
            'target_type' => 'all_products',
            'min_requirement_type' => null,
            'min_requirement_value' => 0,
            'once_per_customer' => false,
            'usage_limit' => null,
            'customer_selection' => 'all',
            'customers' => [],
        ];

        return Inertia::render('Discount/DiscountCreate', [
            'discount' => $discount,
            'customers' => CustomerResource::collection(Customer::all())
        ]);
    }

    public function store(DiscountStoreRequest $request)
    {
        $discountModel = $this->discount->create($request->only($this->discount->getFillable()));
        return redirect()->route('lshopify.discounts.edit',$discountModel->id);
    }

    public function edit($id)
    {
        $discount = $this->discount->with(['customers'])->findOrFail($id);
        return Inertia::render('Discount/DiscountCreate', [
            'discount' => new DiscountResource($discount),
            'customers' => CustomerResource::collection(Customer::all())
        ]);
    }
}
