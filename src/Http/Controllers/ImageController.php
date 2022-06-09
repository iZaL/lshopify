<?php

namespace IZal\Lshopify\Http\Controllers;

use IZal\Lshopify\Jobs\ImageUploadAction;
use IZal\Lshopify\Http\Requests\ImageDeleteRequest;
use IZal\Lshopify\Http\Requests\ImageStoreRequest;
use IZal\Lshopify\Models\Image;

class ImageController extends Controller
{
    public function store(
        ImageStoreRequest $request,
        ImageUploadAction $imageUploadAction
    ): \Illuminate\Http\RedirectResponse {
        if (!empty($request->images)) {
            $imageableID = $request->imageable_id;
            $imageableType = $request->imageable_type;
            $imageUploadAction
                ->uploadToServer($request->images)
                ->saveInDB(['imageable_id' => $imageableID, 'imageable_type' => $imageableType]);
        }
        return redirect()->back();
    }

    public function delete(
        ImageDeleteRequest $request,
        ImageUploadAction $imageUploadAction
    ): \Illuminate\Http\RedirectResponse {
        if (!empty($request->images)) {
            $imageIDs = collect($request->images)
                ->pluck('id')
                ->toArray();
            $images = Image::whereIn('id', $imageIDs)->get();
            if ($images->count()) {
                $imageUploadAction->deleteImages($images);
            }
        }
        return redirect()->back();
    }
}
