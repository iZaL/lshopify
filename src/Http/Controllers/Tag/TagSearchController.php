<?php

namespace IZal\Lshopify\Http\Controllers\Tag;

use Illuminate\Http\Request;
use IZal\Lshopify\Actions\TagCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\TagStoreRequest;
use IZal\Lshopify\Models\Tag;

class TagSearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $searchTerm = $request->get('search');
        $tag = Tag::where('name', $request->name)->first();
        return response()->json($tag);
    }
}
