<?php

namespace IZal\Lshopify\Http\Controllers\Cart;

use IZal\Lshopify\Actions\DraftOrderCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartRemoveController extends Controller
{
    public function __invoke(
        Request $request,
        DraftOrderCreateAction $orderCreateAction
    ): \Illuminate\Http\RedirectResponse {
        $this->validate($request, [
            'rowId' => 'required',
        ]);
        $cart = app('cart');
        $cart->remove($request->rowId);

        return redirect()->back();
    }
}
