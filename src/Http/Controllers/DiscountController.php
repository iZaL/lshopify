<?php

namespace IZal\Lshopify\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use IZal\Lshopify\Jobs\Discount\CreateDiscount;
use IZal\Lshopify\Jobs\Discount\UpdateDiscount;
use IZal\Lshopify\Http\Requests\DiscountStoreRequest;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\CollectionResource;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\DiscountResource;
use IZal\Lshopify\Resources\ProductResource;
use Throwable;

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
        $discount = $this->dispatch(new CreateDiscount($request->except(['back'])));
        if ($request->has('back')) {
            return redirect()
                ->back()
                ->with('success', 'Discount created successfully');
        }
        return redirect()
            ->route('lshopify.discounts.edit', $discount->id)
            ->with('success', 'Discount updated successfully');
    }

    public function edit(Request $request, $id)
    {
        $discount = $this->discount->with(['customers', 'collections', 'variants.product'])->find($id);

        $collections = Collection::query();
        $customers = Customer::query();
        $products = Product::with(['variants.product', 'default_variant.product']);

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
            $this->dispatch(new UpdateDiscount($discountModel, $request->all()));
            return redirect()
                ->route('lshopify.discounts.edit', $discountModel->id)
                ->with('success', 'Discount updated successfully');
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
