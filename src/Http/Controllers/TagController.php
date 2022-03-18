<?php

namespace IZal\Lshopify\Http\Controllers;

use IZal\Lshopify\Actions\TagCreateAction;
use IZal\Lshopify\Http\Requests\TagStoreRequest;
use IZal\Lshopify\Models\Tag;

class TagController extends Controller
{
    public function store(TagStoreRequest $request, TagCreateAction $action): \Illuminate\Http\RedirectResponse
    {
        $tag = Tag::where('name', $request->name)->first();
        $action->create($request->all());
        return redirect()->back();
    }
}
