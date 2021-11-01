<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Support\Facades\DB;
use IZal\Lshopify\Actions\ProductCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\ProductStoreRequest;
use IZal\Lshopify\Models\Product;

class ProductStoreController extends Controller
{
    /**
     * @throws \Throwable
     */
    public function __invoke(
        ProductStoreRequest $request,
        ProductCreateAction $productCreateAction
    ): \Illuminate\Http\RedirectResponse {
        $product = Product::getModel();

        DB::beginTransaction();

        try {
            $action = $productCreateAction->create($product, collect($request->all()));

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }

        return redirect()
            ->route('lshopify.products.edit', $action->id)
            ->with('success', 'Saved');
    }
}
