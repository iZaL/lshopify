<?php

namespace IZal\Lshopify\Http\Controllers;

use Carbon\Carbon;
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
//            'starts_at' => Carbon::parse('-1 day')->format('Y-m-d h:i:s'),
//            'ends_at' => Carbon::parse('-1 day')->format('Y-m-d h:i:s'),
        ];

        return Inertia::render('Discount/DiscountCreate', [
            'discount' => $discount,
            'customers' => CustomerResource::collection(Customer::all())
        ]);
    }

    public function store(DiscountStoreRequest $request)
    {
        try {
            $discountModel = $this->discount->create($request->only($this->discount->getFillable()));
            $this->updateStartEndDate($discountModel, $request);
            return redirect()->route('lshopify.discounts.edit',$discountModel->id)->with('success', 'Discount updated successfully');
        } catch (\Exception $e) {
            return redirect()->route('lshopify.discounts.edit',$discountModel->id)->with('error', $e->getMessage());
        }
    }

    public function edit($id)
    {
        $discount = $this->discount->with(['customers'])->findOrFail($id);
        return Inertia::render('Discount/DiscountCreate', [
            'discount' => new DiscountResource($discount),
            'customers' => CustomerResource::collection(Customer::all())
        ]);
    }

    public function update(DiscountStoreRequest $request, $id)
    {
        try {
            $discountModel = $this->discount->findOrFail($id);
            $discountModel->update($request->only($this->discount->getFillable()));
            $this->updateStartEndDate($discountModel, $request);
            return redirect()->route('lshopify.discounts.edit',$discountModel->id)->with('success', 'Discount updated successfully');
        } catch (\Exception $e) {
            return redirect()->route('lshopify.discounts.edit',$discountModel->id)->with('error', $e->getMessage());
        }
    }

    public function updateStartEndDate($discountModel, $request)
    {
        [$startsAt,$endsAt] = $this->parseDate([$request->starts_at,$request->ends_at]);
        $discountModel->starts_at = $startsAt;
        $discountModel->ends_at = $endsAt;
        $discountModel->save();
    }

    public function parseDate($dates)
    {
        $startsAt = Carbon::parse($dates[0]);
        $endsAt = Carbon::parse($dates[1]);

        if($startsAt->isPast()) {
            throw new \Exception('Start date must be in future');
        }

        if($startsAt->gt($endsAt)) {
            throw new \Exception('End date must be greater than start date');
        }
        return [
            $startsAt->format('Y-m-d h:i:s'),
            $endsAt->format('Y-m-d h:i:s')
        ];
    }

}
