<?php

namespace IZal\Lshopify\Http\Controllers\Order\Draft;

use IZal\Lshopify\Actions\DraftOrderCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\DraftOrderStoreRequest;
use DB;

class DraftOrderStoreController extends Controller
{
    /**
     * @throws \Throwable
     */
    public function __invoke(
        DraftOrderStoreRequest $request,
        DraftOrderCreateAction $action
    ): \Illuminate\Http\RedirectResponse {
        $cart = app('cart');

        if (!$cart->items()->count()) {
            return redirect()
                ->back()
                ->with('error', 'Products cannot be empty.');
        }

        DB::beginTransaction();

        try {
            $order = $action->create($cart);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }

        return redirect()
            ->route('lshopify.draft.orders.edit', $order->id)
            ->with('success', 'Saved');
    }
}
