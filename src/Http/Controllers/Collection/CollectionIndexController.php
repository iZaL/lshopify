<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Resources\CollectionResource;
use Inertia\Inertia;

class CollectionIndexController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        $collections = CollectionResource::collection(Collection::latest()->get());

        return Inertia::render('Collection/CollectionIndex', ['collections' => $collections]);
    }
}
