<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use IZal\Lshopify\Jobs\CreateCategory;
use IZal\Lshopify\Http\Requests\CategoryStoreRequest;
use IZal\Lshopify\Models\Product;

class CategoryController extends Controller
{
    /**
     * @param CategoryStoreRequest $request
     * @return RedirectResponse
     */
    public function store(CategoryStoreRequest $request): RedirectResponse
    {
        $this->dispatch(new CreateCategory($request->all()));

        return redirect()->back();
    }
}
