<?php

namespace IZal\Lshopify\Http\Controllers\Cart;

use IZal\Lshopify\Actions\DraftOrderCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\CartUpdateRequest;

class CartUpdateController extends Controller
{
    public function __invoke(
        CartUpdateRequest $request,
        DraftOrderCreateAction $orderCreateAction
    ): \Illuminate\Http\RedirectResponse {
        $cart = app('cart');
        $cart->item($request->rowId);
        $cart->update($request->rowId, $request->item);

        return redirect()->back();
    }
}
