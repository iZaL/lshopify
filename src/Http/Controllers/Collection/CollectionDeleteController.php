<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Collection;

class CollectionDeleteController extends Controller
{
    public function __invoke($id): \Illuminate\Http\RedirectResponse
    {
        $collection = Collection::find($id);
        $collection->delete();

        return redirect()->back();
    }
}
