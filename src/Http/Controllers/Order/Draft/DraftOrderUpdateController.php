<?php

namespace IZal\Lshopify\Http\Controllers\Order\Draft;

use IZal\Lshopify\Actions\DraftOrderCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\DraftOrderCustomerUpdateRequest;
use IZal\Lshopify\Http\Requests\DraftOrderUpdateRequest;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Order;

class DraftOrderUpdateController extends Controller
{
    /**
     * @var DraftOrderCreateAction
     */
    private $action;

    /**
     * @param  DraftOrderCreateAction  $action
     */
    public function __construct(DraftOrderCreateAction $action)
    {
        $this->action = $action;
    }

    public function update($id, DraftOrderUpdateRequest $request): \Illuminate\Http\RedirectResponse
    {
        $order = DraftOrder::find($id);

        $cart = app('cart');

        $this->action->update(
            $order,
            $cart,
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

    public function attachCustomer($id, DraftOrderCustomerUpdateRequest $request): \Illuminate\Http\RedirectResponse
    {
        $order = DraftOrder::find($id);

        if(!$order) {
            $order = Order::find($id);
        }

        if ($request->customer_id) {
            $customer = Customer::find($request->customer_id);
            if ($customer) {
                $this->action->attachCustomer($order, $customer);
            }
        } else {
            $this->action->detachCustomer($order);
        }

        return redirect()->back();
    }
}
