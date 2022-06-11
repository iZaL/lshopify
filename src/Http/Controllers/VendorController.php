<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use IZal\Lshopify\Jobs\CreateVendor;
use IZal\Lshopify\Models\Product;

class VendorController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $this->dispatch(new CreateVendor($request->all()));

        return redirect()->back();
    }
}
