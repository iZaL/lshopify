<?php

namespace IZal\Lshopify\Http\Controllers;

use IZal\Lshopify\Actions\TagCreateAction;
use IZal\Lshopify\Http\Requests\TagStoreRequest;

class TagController extends Controller
{
    public function store(TagStoreRequest $request, TagCreateAction $action): \Illuminate\Http\RedirectResponse
    {
        $action->create($request->all());
        return redirect()->back();
    }
}
