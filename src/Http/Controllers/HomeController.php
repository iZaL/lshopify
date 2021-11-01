<?php

namespace IZal\Lshopify\Http\Controllers;

use IZal\Lshopify\Http\Controllers\Controller;
use Inertia\Inertia;

class HomeController extends Controller
{

    public function __invoke()
    {
        return Inertia::render('Dashboard');
    }

}
