<?php

namespace IZal\Lshopify\Http\Controllers\Image;

use IZal\Lshopify\Actions\ImageUploadAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\ImageDeleteRequest;
use IZal\Lshopify\Models\Product;

class ImageDeleteController extends Controller
{
    public function __invoke(
        $productID,
        ImageDeleteRequest $request,
        ImageUploadAction $imageUploadAction
    ): \Illuminate\Http\RedirectResponse {
        $product = Product::find($productID);
        if (!empty($request->images)) {
            $imageIDs = collect($request->images)
                ->pluck('id')
                ->toArray();
            $images = $product
                ->images()
                ->whereIn('id', $imageIDs)
                ->get();
            if ($images->count()) {
                $imageUploadAction->deleteImages($images);
            }
        }

        return redirect()->back();
    }
}
