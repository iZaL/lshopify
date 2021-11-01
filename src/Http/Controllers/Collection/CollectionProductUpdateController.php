<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Collection;
use Illuminate\Http\Request;

class CollectionProductUpdateController extends Controller
{
    public function __invoke($id, Request $request, Collection $collection): \Illuminate\Http\RedirectResponse
    {
        $this->validate($request, ['products' => 'nullable|array']);
        $collection = $collection->find($id);
        $selectedProductIDs = $request->products;
        $collection->products()->sync($selectedProductIDs);

        return redirect()
            ->back()
            ->with('success', 'Updated');
    }
}
