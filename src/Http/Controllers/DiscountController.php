<?php

namespace IZal\Lshopify\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use IZal\Lshopify\Http\Requests\DiscountStoreRequest;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\CollectionResource;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\DiscountResource;
use IZal\Lshopify\Resources\ProductResource;

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
        $discount = [
            'name' => Str::upper(Str::random(8)),
            'auto' => $request->auto ?: 0,
            'value' => 300,
            'value_type' => 'percent',
            'target_type' => 'all_products',
            'min_requirement_type' => null,
            'min_requirement_value' => 0,
            'once_per_customer' => false,
            'usage_limit' => null,
            'customer_selection' => 'all',
            'customers' => [],
            'collections' => [],
            'variants' => [],
        ];

        $collections = Collection::query();
        $products = Product::with(['variants.product', 'default_variant.product']);
        $customers = Customer::query();

        $collections = $collections->when($request->collection_search, function ($query, $term) {
            return $query->where('name', 'like', "%{$term}%");
        });

        $products = $products->when($request->product_search, function ($query, $term) {
            return $query->where('title', 'like', "%{$term}%");
        });

        $customers = $customers->when($request->customer_search, function ($query, $term) {
            return $query->where('first_name', 'like', "%{$term}%")->orWhere('last_time', 'like', "%{$term}%");
        });

        return Inertia::render('Discount/DiscountCreate', [
            'discount' => $discount,
            'customers' => CustomerResource::collection($customers->paginate(10)),
            'collections' => CollectionResource::collection($collections->paginate(10)),
            'products' => ProductResource::collection($products->paginate(10)),
        ]);
    }

    public function store(DiscountStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $discountModel = $this->discount->create($request->only($this->discount->getFillable()));
            $this->updateStartEndDate($discountModel, $request);

            if ($discountModel->target_type == 'products') {
                $discountModel->variants()->sync($request->variants);
            } elseif ($discountModel->target_type == 'collections') {
                $discountModel->collections()->sync($request->collections);
            }

            if ($request->customers) {
                $discountModel->customers()->sync($request->customers);
            }

            DB::commit();

            if ($request->has('back')) {
                return redirect()
                    ->back()
                    ->with('success', 'Discount created successfully');
            }

            return redirect()
                ->route('lshopify.discounts.edit', $discountModel->id)
                ->with('success', 'Discount updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    public function edit(Request $request, $id)
    {
        $discount = $this->discount->with(['customers', 'collections', 'variants.product'])->find($id);

        $collections = Collection::query();
        $products = Product::with(['variants.product', 'default_variant.product']);
        $customers = Customer::query();

        $collections = $collections->when($request->collection_search, function ($query, $term) {
            return $query->where('name', 'like', "%{$term}%");
        });

        $products = $products->when($request->product_search, function ($query, $term) {
            return $query->where('title', 'like', "%{$term}%");
        });

        $customers = $customers->when($request->customer_search, function ($query, $term) {
            return $query->where('first_name', 'like', "%{$term}%")->orWhere('last_time', 'like', "%{$term}%");
        });

        return Inertia::render('Discount/DiscountCreate', [
            'discount' => new DiscountResource($discount),
            'customers' => CustomerResource::collection($customers->paginate(10)),
            'collections' => CollectionResource::collection($collections->paginate(10)),
            'products' => ProductResource::collection($products->paginate(10)),
        ]);
    }

    public function update(DiscountStoreRequest $request, $id)
    {
        try {
            $discountModel = $this->discount->findOrFail($id);
            $discountModel->update($request->only($this->discount->getFillable()));

            if ($discountModel->target_type == 'products') {
                $discountModel->products()->sync($request->products);
            } elseif ($discountModel->target_type == 'collections') {
                $discountModel->collections()->sync($request->collections);
            }

            if ($request->customers) {
                $discountModel->customers()->sync($request->customers);
            }

            $this->updateStartEndDate($discountModel, $request);
            return redirect()
                ->route('lshopify.discounts.edit', $discountModel->id)
                ->with('success', 'Discount updated successfully');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    private function updateStartEndDate($discountModel, $request)
    {
        [$startsAt, $endsAt] = $this->parseDate([$request->starts_at, $request->ends_at]);
        $discountModel->starts_at = $startsAt;
        $discountModel->ends_at = $endsAt;
        $discountModel->save();
    }

    private function parseDate($dates)
    {
        $startsAt = Carbon::parse($dates[0]);
        $endsAt = Carbon::parse($dates[1]);

        if ($startsAt->isPast()) {
            throw new \Exception('Start date must be in future');
        }

        if ($startsAt->gt($endsAt)) {
            throw new \Exception('End date must be greater than start date');
        }
        return [$startsAt->format('Y-m-d h:i:s'), $endsAt->format('Y-m-d h:i:s')];
    }
}
