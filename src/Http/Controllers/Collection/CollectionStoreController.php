<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\CollectionStoreRequest;
use IZal\Lshopify\Models\Collection;

class CollectionStoreController extends Controller
{
    public function __invoke(CollectionStoreRequest $request, Collection $collection): \Illuminate\Http\RedirectResponse
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
}
