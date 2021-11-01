<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use IZal\Lshopify\Http\Controllers\Controller;
use Inertia\Inertia;

class CollectionCreateController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        $data = ['collections' => []];

        return Inertia::render('Collection/CollectionCreate', $data);
    }
}
