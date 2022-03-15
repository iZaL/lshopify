<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Http\Request;
use IZal\Lshopify\Actions\ProductUpdateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;

class ProductBulkUpdateController extends Controller
{
    public function __invoke(Request $request,ProductUpdateAction $action)
    {
        $products = $request->get('products');
        foreach ($products as $product) {
            $productModel = Product::find($product['id']);
            if($productModel) {
                $action->update($productModel, collect($product));
            }
        }
        return redirect()
            ->back()
            ->with('success', 'Saved');
    }
}
