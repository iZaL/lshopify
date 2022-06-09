<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\Request;
use IZal\Lshopify\Jobs\VendorAction;
use IZal\Lshopify\Models\Product;

class VendorController extends Controller
{
    public function store(Request $request, VendorAction $action): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $vendor = $action->create($request->all());

        if ($request->product_id) {
            $product = Product::find($request->product_id);
            $product->vendor_id = $vendor->id;
            $product->save();
        }

        return redirect()->back();
    }
}
