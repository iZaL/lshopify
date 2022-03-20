<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use IZal\Lshopify\Actions\ProductCreateAction;
use IZal\Lshopify\Actions\ProductUpdateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\ProductStoreRequest;
use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Tag;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Vendor;
use IZal\Lshopify\Resources\CategoryResource;
use IZal\Lshopify\Resources\CollectionResource;
use IZal\Lshopify\Resources\ProductResource;
use IZal\Lshopify\Resources\TagResource;
use IZal\Lshopify\Resources\VendorResource;

class ProductController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $products = Product::query()
            ->with(['category', 'vendor','tags'])
            ->withCount('variants');

        $searchTerm = $request->search_term;
        $tagTerm = $request->get('tag_term');

        if ($searchTerm) {
            $products->where('title', 'like', '%' . $searchTerm . '%');
        }

        if($tagTerm) {
            $products->whereHas('tags', function($query) use ($tagTerm) {
                $query->where('name', 'like', '%' . $tagTerm . '%');
            });
        }

        $statuses = collect($request->get('selected_status') ?? [])->unique();

        $selectedTab = $request->selected_view ?? 'all';
        if ($statuses->count() > 0) {
            $products->whereIn('status', $statuses->toArray());
        } else {
            if ($selectedTab && $selectedTab != 'all') {
                $products->where('status', $selectedTab);
            }
        }

        $selectedVendors = collect($request->get('selected_vendors') ?? [])->unique();

        if($selectedVendors->count() > 0) {
            $products->whereIn('vendor_id', $selectedVendors->toArray());
        }

        $products = ProductResource::collection($products->get());
        $vendors = VendorResource::collection(Vendor::all());

        return Inertia::render('Product/ProductIndex', [
            'products' => $products,
            'search_attributes' => [
                'selected_status' => $statuses,
                'selected_vendors' => $selectedVendors,
                'search_term' => $searchTerm,
                'selected_view' => $selectedTab,
                'tag_term' => $tagTerm
            ],
            'vendors' => $vendors,
        ]);
    }

    public function create(): \Inertia\Response
    {
        $data = [
            'collection' => CollectionResource::collection(Collection::all()),
            'tags' => TagResource::collection(Tag::all()),
            'variants' => Variant::defaultVariants(),
            'categories' => CategoryResource::collection(Category::all()),
            'vendors' => VendorResource::collection(Vendor::all()),
        ];

        return Inertia::render('Product/ProductCreate', $data);
    }

    public function store(
        ProductStoreRequest $request,
        ProductCreateAction $productCreateAction
    ): \Illuminate\Http\RedirectResponse {
        $product = Product::getModel();

        DB::beginTransaction();

        try {
            $action = $productCreateAction->create($product, collect($request->all()));
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }

        return redirect()
            ->route('lshopify.products.edit', $action->id)
            ->with('success', 'Saved');
    }

    public function edit($id): \Inertia\Response
    {
        $product = Product::with([
            'images',
            'variants.image',
            'category',
            'tags',
            'collections',
            'vendor',
            'default_variant',
        ])->find($id);

        $product = new ProductResource($product);

        $data = [
            'product' => $product,
            'collection' => CollectionResource::collection(Collection::all()),
            'tags' => TagResource::collection(Tag::all()),
            'variants' => Variant::defaultVariants(),
            'categories' => CategoryResource::collection(Category::all()),
            'vendors' => VendorResource::collection(Vendor::all()),
            'variant_options' => $product->variant_options,
            'variant_values' => $product->variant_options_values,
        ];

        return Inertia::render('Product/ProductEdit', $data);
    }

    public function update(
        ProductStoreRequest $request,
        ProductUpdateAction $action,
        $id
    ): \Illuminate\Http\RedirectResponse {
        $product = Product::find($id);
        try {
            $action->update($product, collect($request->all()));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }

        return redirect()
            ->route('lshopify.products.edit', $product->id, 303)
            ->with('success', 'Saved');
    }

    public function delete(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->validate($request, [
            'product_ids' => 'required|array',
        ]);

        $products = Product::whereIn('id', $request->product_ids);

        $products->delete();

        return redirect()
            ->back()
            ->with('success', 'Products Deleted');
    }
}
