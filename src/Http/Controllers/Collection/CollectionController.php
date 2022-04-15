<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use Illuminate\Http\Request;
use Inertia\Inertia;
use IZal\Lshopify\Actions\ImageUploadAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\CollectionStoreRequest;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\CollectionResource;
use IZal\Lshopify\Resources\ProductResource;

class CollectionController extends Controller
{
    public function index(): \Inertia\Response
    {
        $collections = Collection::with(['conditions', 'image'])->get();
        $collectionResources = CollectionResource::collection($collections);
        return Inertia::render('Collection/CollectionIndex', ['collections' => $collectionResources]);
    }

    public function create(): \Inertia\Response
    {
        $data = ['collections' => []];
        return Inertia::render('Collection/CollectionCreate', $data);
    }

    public function store(CollectionStoreRequest $request, Collection $collection): \Illuminate\Http\RedirectResponse
    {
        $collection = $collection->create($request->only($collection->getFillable()));
        if ($request->type === 'smart') {
            foreach ($request->conditions as $condition) {
                $collection->conditions()->create($condition);
            }
        }
        return redirect()
            ->route('lshopify.collections.edit', $collection->id)
            ->with('success', 'Saved');
    }

    public function edit(Request $request, $id): \Inertia\Response
    {
        $collection = new CollectionResource(Collection::with(['conditions', 'products.image','image'])->find($id));
        $products = Product::query();
        $searchTerm = $request->input('searchTerm');
        if ($searchTerm) {
            $products->where('title', 'like', "%{$searchTerm}%");
        }
        $products = ProductResource::collection($products->get());
        $data = [
            'collection' => $collection,
            'products' => $products,
        ];
        return Inertia::render('Collection/CollectionEdit', $data);
    }

    public function update(
        $id,
        CollectionStoreRequest $request,
        Collection $collection,
        ImageUploadAction $imageUploadAction
    ): \Illuminate\Http\RedirectResponse {
        $collection = $collection->find($id);
        $collection->update($request->only($collection->getFillable()));

        if ($image = $request->image) {
            if ($image instanceof UploadedFile) {
                $imageUploadAction->deleteImages($collection->images);
                $imageUploadAction
                    ->uploadToServer([$image])
                    ->saveInDB(['imageable_id' => $collection->id, 'imageable_type' => get_class($collection)]);
            }
        } else {
            $collection->image()->delete();
        }

        if ($request->type === 'smart') {
            $deletedConditions = array_diff(
                $collection->conditions->pluck('id')->toArray(),
                collect($request->conditions)
                    ->pluck('id')
                    ->toArray()
            );

            $collection->conditions()->delete($deletedConditions);

            foreach ($request->conditions as $condition) {
                $collectionCondition = $collection->conditions()->firstWhere('id', $condition['id']);
                if ($collectionCondition) {
                    $collectionCondition->update($condition);
                } else {
                    $collection->conditions()->create($condition);
                }
            }
        }

        return redirect()
            ->back()
            ->with('success', 'Updated');
    }

    public function delete($id): \Illuminate\Http\RedirectResponse
    {
        $collection = Collection::find($id);
        $collection->delete();
        return redirect()->back();
    }
}
