<?php

namespace IZal\Lshopify\Http\Controllers\Variant;

use IZal\Lshopify\Actions\VariantUpdateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\VariantStoreRequest;
use IZal\Lshopify\Models\Variant;

class VariantUpdateController extends Controller
{
    public function __invoke(
        $variantID,
        VariantStoreRequest $request,
        VariantUpdateAction $variantUpdateAction
    ): \Illuminate\Http\RedirectResponse {
        $variant = Variant::find($variantID);
        $imageID = null;

        if ($request->image && ! $request->file('image')) {
            $imageID = $request->image['id'] ?? null;
        }

        $variant->update(
            array_merge(
                collect($request->all())
                    ->only($variant->getFillable())
                    ->toArray(),
                ['image_id' => $imageID]
            )
        );

        $options = $request->get('options');

        if (isset($options)) {
            $variantUpdateAction->updateVariantOptions($variant, $options);
        }

        return redirect()
            ->back()
            ->with('success', 'Saved');
    }
}
