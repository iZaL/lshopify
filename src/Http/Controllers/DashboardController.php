<?php

namespace IZal\Lshopify\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        return Inertia::render('Dashboard');
    }
}
