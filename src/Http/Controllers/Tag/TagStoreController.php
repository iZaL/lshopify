<?php

namespace IZal\Lshopify\Http\Controllers\Tag;

use IZal\Lshopify\Actions\TagCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\TagStoreRequest;

class TagStoreController extends Controller
{
    public function __invoke(TagStoreRequest $request, TagCreateAction $action): \Illuminate\Http\RedirectResponse
    {
        $action->create($request->all());

        return redirect()->back();
    }
}
