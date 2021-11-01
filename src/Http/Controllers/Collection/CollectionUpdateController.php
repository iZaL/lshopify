<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\CollectionStoreRequest;
use IZal\Lshopify\Models\Collection;

class CollectionUpdateController extends Controller
{
    public function __invoke(
        $id,
        CollectionStoreRequest $request,
        Collection $collection
    ): \Illuminate\Http\RedirectResponse {
        $collection = $collection->find($id);
        $collection->update($request->only($collection->getFillable()));
        if ($request->type === 'smart') {
            foreach ($request->conditions as $condition) {
                $collectionCondition = $collection->conditions()->firstWhere('id', $condition['id']);
                if ($collectionCondition) {
                    $collectionCondition->update($condition);
                }
            }
        }

        return redirect()
            ->back()
            ->with('success', 'Updated');
    }
}
