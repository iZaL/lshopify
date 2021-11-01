<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use IZal\Lshopify\Actions\OrderUpdateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\OrderUpdateRequest;
use IZal\Lshopify\Models\Order;

class OrderUpdateController extends Controller
{
    /**
     * @var OrderUpdateAction
     */
    private $action;

    /**
     * @param  OrderUpdateAction  $action
     */
    public function __construct(OrderUpdateAction $action)
    {
        $this->action = $action;
    }

    public function __invoke($id, OrderUpdateRequest $request): \Illuminate\Http\RedirectResponse
    {
        $order = Order::find($id);

        $this->action->update(
            $order,
            $request->except('shipping', 'billing', 'customer_id', 'total', 'subtotal')
        );

        if ($request->shipping) {
            $this->action->updateShippingAddress($order, $request->shipping);
        }

        if ($request->billing) {
            $this->action->updateBillingAddress($order, $request->billing);
        }

        return redirect()
            ->back()
            ->with('success', 'Updated');
    }
}
