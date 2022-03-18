<?php

namespace IZal\Lshopify\Http\Controllers\Tag;

use IZal\Lshopify\Actions\TagCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\TagStoreRequest;
use IZal\Lshopify\Models\Tag;

class TagStoreController extends Controller
{
    public function __invoke(TagStoreRequest $request, TagCreateAction $action): \Illuminate\Http\RedirectResponse
    {
        $tag = Tag::where('name', $request->name)->first();

        //        if(!$tag) {
        $action->create($request->all());
        //        }
        return redirect()->back();
    }
}
