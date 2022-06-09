<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use IZal\Lshopify\Jobs\Order\UpdateOrder;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\OrderStoreRequest;
use IZal\Lshopify\Http\Requests\OrderUpdateRequest;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;
use IZal\Lshopify\Resources\WorkflowVariantResource;

class OrderController extends Controller
{
    public function index()
    {
        $orders = OrderResource::collection(
            Order::with(['customer', 'success_payments'])
                ->latest()
                ->get()
        );
        return Inertia::render('Order/OrderIndex', ['orders' => $orders]);
    }

    public function show($id): \Inertia\Response
    {
        $order = Order::with(['workflows.variants.product.image', 'workflows.variants.image', 'customer'])->find($id);
        $customers = Customer::all();
        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariantsWithPivot();
        $totalUnfulfilledVariantsCount = $unfulfilledVariants->sum('pivot.quantity');
        $pendingFulfillments = WorkflowVariantResource::collection($unfulfilledVariants)->additional([
            'unfulfilled_variants_count' => $totalUnfulfilledVariantsCount,
        ]);
        $orderResource = new OrderResource($order);
        return Inertia::render('Order/OrderView', [
            'order' => $orderResource,
            'pending_fulfillments' => $pendingFulfillments,
            'customers' => CustomerResource::collection($customers),
        ]);
    }

    public function store(OrderStoreRequest $request): \Illuminate\Http\RedirectResponse
    {
        return redirect()->route('lshopify.orders.index');
    }

    public function edit($id): \Inertia\Response
    {
        $order = Order::find($id);
        $orderResource = new OrderResource($order);

        return Inertia::render('Order/OrderEdit', ['order' => $orderResource]);
    }

    public function update($id, OrderUpdateRequest $request, UpdateOrder $action): \Illuminate\Http\RedirectResponse
    {
        $order = Order::find($id);

        $action->update($order, $request->except('shipping', 'billing', 'customer_id', 'total', 'subtotal'));

        if ($request->shipping) {
            $action->updateShippingAddress($order, $request->shipping);
        }

        if ($request->billing) {
            $action->updateBillingAddress($order, $request->billing);
        }

        return redirect()
            ->back()
            ->with('success', 'Updated');
    }
}
