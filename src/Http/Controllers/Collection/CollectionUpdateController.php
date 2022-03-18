<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use Illuminate\Http\UploadedFile;
use IZal\Lshopify\Actions\ImageUploadAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\CollectionStoreRequest;
use IZal\Lshopify\Models\Collection;
use function PHPUnit\Framework\isInstanceOf;

class CollectionUpdateController extends Controller
{
    public function __invoke(
        $id,
        CollectionStoreRequest $request,
        Collection $collection,
        ImageUploadAction $imageUploadAction
    ): \Illuminate\Http\RedirectResponse {
        $collection = $collection->find($id);
        $collection->update($request->only($collection->getFillable()));

        if ($image = $request->image) {
            if ($image instanceof UploadedFile) {
                $imageUploadAction->deleteImages($collection->images);
                $imageUploadAction
                    ->uploadToServer([$image])
                    ->saveInDB(['imageable_id' => $collection->id, 'imageable_type' => get_class($collection)]);
            }
        } else {
            $collection->image()->delete();
        }

        if ($request->type === 'smart') {
            $deletedConditions = array_diff(
                $collection->conditions->pluck('id')->toArray(),
                collect($request->conditions)
                    ->pluck('id')
                    ->toArray()
            );

            $collection->conditions()->delete($deletedConditions);

            foreach ($request->conditions as $condition) {
                $collectionCondition = $collection->conditions()->firstWhere('id', $condition['id']);
                if ($collectionCondition) {
                    $collectionCondition->update($condition);
                } else {
                    $collection->conditions()->create($condition);
                }
            }
        }

        return redirect()
            ->back()
            ->with('success', 'Updated');
    }
}
