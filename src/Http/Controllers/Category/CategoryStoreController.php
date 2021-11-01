<?php

namespace IZal\Lshopify\Http\Controllers\Category;

use IZal\Lshopify\Actions\CategoryCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\CategoryStoreRequest;

class CategoryStoreController extends Controller
{
    public function __invoke(
        CategoryStoreRequest $request,
        CategoryCreateAction $action
    ): \Illuminate\Http\RedirectResponse {
        $action->create($request->all());

        return redirect()->back();
    }
}
