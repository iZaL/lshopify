<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use IZal\Lshopify\Jobs\ImageUploadAction;
use IZal\Lshopify\Jobs\Product\CreateProduct;
use IZal\Lshopify\Jobs\Product\DeleteProduct;
use IZal\Lshopify\Jobs\Product\UpdateProduct;
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
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with(['category', 'vendor', 'tags'])
            ->withCount('variants');

        $searchTerm = $request->get('product_search');
        $tagTerm = $request->get('tag_search');

        if ($searchTerm) {
            $products->where('title', 'like', '%' . $searchTerm . '%');
        }

        if ($tagTerm) {
            $products->whereHas('tags', function ($query) use ($tagTerm) {
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

        if ($selectedVendors->count() > 0) {
            $products->whereIn('vendor_id', $selectedVendors->toArray());
        }

        $selectedCategories = collect($request->get('selected_categories') ?? [])->unique();
        if ($selectedCategories->count() > 0) {
            $products->whereIn('category_id', $selectedCategories->toArray());
        }

        $selectedCollections = collect($request->get('selected_collections') ?? [])->unique();
        if ($selectedCollections->count() > 0) {
            $products->whereHas('collections', function ($query) use ($selectedCollections) {
                $query->whereIn('collections.id', $selectedCollections->toArray());
            });
        }

        $products = ProductResource::collection($products->latest()->paginate(5));
        $vendors = VendorResource::collection(Vendor::all());
        $categories = CategoryResource::collection(Category::all());
        $collections = Collection::query();

        $collectionSearch = $request->get('collection_search');
        if ($collectionSearch) {
            $collections = $collections->where('name', 'like', '%' . $collectionSearch . '%');
        }
        $collections = CollectionResource::collection($collections->paginate(5));

        return Inertia::render('Product/ProductIndex', [
            'products' => $products,
            'categories' => $categories,
            'collections' => $collections,
            'search_attributes' => [
                'selected_status' => $statuses,
                'selected_vendors' => $selectedVendors,
                'selected_categories' => $selectedCategories,
                'selected_collections' => $selectedCollections,
                'product_search' => $searchTerm,
                'tag_search' => $tagTerm,
                'collection_search',
                $collectionSearch,
                'selected_view' => $selectedTab,
            ],
            'vendors' => $vendors,
        ]);
    }

    public function create(): Response
    {
        $data = [
            'collection' => CollectionResource::collection(Collection::all()),
            'tags' => TagResource::collection(Tag::all()),
            'default_variant_options' => Variant::defaultVariantOptions(),
            'categories' => CategoryResource::collection(Category::all()),
            'vendors' => VendorResource::collection(Vendor::all()),
        ];

        return Inertia::render('Product/ProductCreate', $data);
    }

    public function store(ProductStoreRequest $request, ImageUploadAction $imageUploadAction): RedirectResponse
    {
        $product = $this->dispatch(new CreateProduct($request->all(), $imageUploadAction));

        return redirect()
            ->route('lshopify.products.edit', $product->id)
            ->with('success', 'Saved');
    }

    public function edit($id): Response
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
            'default_variant_options' => Variant::defaultVariantOptions(),
            'categories' => CategoryResource::collection(Category::all()),
            'vendors' => VendorResource::collection(Vendor::all()),
            'variant_options' => $product->variant_option_values,
        ];

        return Inertia::render('Product/ProductEdit', $data);
    }

    public function update($id, ProductStoreRequest $request): RedirectResponse
    {
        $product = Product::find($id);

        $this->dispatch(new UpdateProduct($product, $request->all()));

        return redirect()
            ->route('lshopify.products.edit', $product->id, 303)
            ->with('success', 'Saved');
    }

    public function delete(Request $request): RedirectResponse
    {
        $this->validate($request, [
            'product_ids' => 'required|array',
        ]);

        $this->dispatch(new DeleteProduct($request->product_ids));

        return redirect()
            ->back()
            ->with('success', 'Products Deleted');
    }

}
