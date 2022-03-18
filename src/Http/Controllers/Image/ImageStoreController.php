<?php

namespace IZal\Lshopify\Http\Controllers\Image;

use IZal\Lshopify\Actions\ImageUploadAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\ImageStoreRequest;
use IZal\Lshopify\Models\Product;

class ImageStoreController extends Controller
{
    public function __invoke(
        $productID,
        ImageStoreRequest $request,
        ImageUploadAction $imageUploadAction
    ): \Illuminate\Http\RedirectResponse {
        $product = Product::find($productID);
        if (!empty($request->images)) {
            $imageUploadAction
                ->uploadToServer($request->images)
                ->saveInDB(['imageable_id' => $product->id, 'imageable_type' => get_class($product)]);
        }

        return redirect()->back();
    }
}
