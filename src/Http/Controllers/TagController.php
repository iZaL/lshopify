<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use IZal\Lshopify\Jobs\CreateTag;
use IZal\Lshopify\Http\Requests\TagStoreRequest;
use IZal\Lshopify\Models\Tag;

class TagController extends Controller
{
    public function store(TagStoreRequest $request): RedirectResponse
    {
        $this->dispatch(new CreateTag($request->all()));
        return redirect()->back();
    }
}
