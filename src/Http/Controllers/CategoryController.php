<?php

namespace IZal\Lshopify\Http\Controllers;

use IZal\Lshopify\Actions\CategoryCreateAction;
use IZal\Lshopify\Http\Requests\CategoryStoreRequest;

class CategoryController extends Controller
{
    public function store(
        CategoryStoreRequest $request,
        CategoryCreateAction $action
    ): \Illuminate\Http\RedirectResponse {
        $action->create($request->all());
        return redirect()->back();
    }
}
