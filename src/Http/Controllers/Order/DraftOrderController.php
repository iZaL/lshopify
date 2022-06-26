<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use IZal\Lshopify\Jobs\Order\CreateDraftOrder;
use IZal\Lshopify\Jobs\Order\UpdateDraftOrder;
use IZal\Lshopify\Cart\Condition;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\DraftOrderCustomerUpdateRequest;
use IZal\Lshopify\Http\Requests\DraftOrderStoreRequest;
use IZal\Lshopify\Http\Requests\DraftOrderUpdateRequest;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\OrderResource;
use IZal\Lshopify\Resources\ProductResource;
use IZal\Lshopify\Resources\VariantResource;
use Throwable;

class DraftOrderController extends Controller
{
    public function index(): Response
    {
        $orders = OrderResource::collection(
            DraftOrder::with(['customer', 'success_payments'])
                ->latest()
                ->get()
        );
        $cart = app('cart');
        return Inertia::render('Order/Draft/DraftOrderIndex', ['orders' => $orders, 'cartTotal' => $cart->total()]);
    }

    public function create(): Response
    {
        $products = Product::with(['variants.image', 'default_variant', 'image'])
            ->latest()
            ->get();

        $productsResource = ProductResource::collection($products);

        $cart = app('cart');

        session()->forget('cart_order');

        $cartData = [
            'total' => $cart->total(),
            'subtotal' => $cart->subtotal(),
            'discount_value' => $cart->discountedValue(),
            'items' => $cart->resolveItems(),
            'discount' => $cart->getConditionByName('cart'),
        ];

        $data = [
            'products' => $productsResource,
            'cart' => $cartData,
        ];

        return Inertia::render('Order/Draft/DraftOrderCreate', $data);
    }

    public function store(DraftOrderStoreRequest $request)
    {
        $cart = app('cart');

        if (!$cart->items()->count()) {
            return redirect()
                ->back()
                ->with('error', 'Products cannot be empty.');
        }

        $order = $this->dispatch(new CreateDraftOrder());

        return redirect()
            ->route('lshopify.draft.orders.edit', $order->id)
            ->with('success', 'Saved');
    }

    public function edit($id): Response
    {
        $cart = app('cart');

        session()->forget('cart_order');

        $products = Product::with(['variants'])
            ->latest()
            ->get();

        $productsResource = ProductResource::collection($products);

        $order = DraftOrder::with(['variants.discounts', 'discount', 'customer'])->find($id);
        $orderResource = new OrderResource($order);

        $customers = Customer::all();
        $customersResource = CustomerResource::collection($customers);

        if (!session()->has('cart_order') || session('cart_order') !== $order->id) {
            $cart->clear();
            session()->put('cart_order', $order->id);
            // sync DB orders with the cart, only on first request and ignore on subsequent requests.
            $discount = $order->discount;
            if ($discount) {
                $cartCondition = [
                    'value' => $discount->value,
                    'suffix' => $discount->value_type,
                    'reason' => $discount->reason,
                    'target' => 'subtotal',
                    'name' => 'cart',
                    'type' => 'discount',
                ];
                $cartDiscount = new Condition($cartCondition);
                $suffix = $cartCondition['suffix'] === 'percent' ? '%' : '';
                $cartDiscount->setActions([
                    [
                        'value' => '-' . $discount->value . $suffix,
                    ],
                ]);
                $cart->condition($cartDiscount);
            } else {
                $cart->removeConditionByName('cart');
            }

            foreach ($order->variants as $variant) {
                $cartItem = $cart->findByID($variant->id);
                if (!$cartItem) {
                    try {
                        $cartItem = $cart->add([
                            'id' => $variant->id,
                            'name' => $variant->id,
                            'price' => $variant->pivot->price,
                            'quantity' => $variant->pivot->quantity,
                            'variant' => new VariantResource($variant),
                        ]);
                    } catch (Exception $e) {
                        dd($e);
                    }
                }

                dd('x');
                $variantDiscount = Discount::find(optional($variant->pivot)->discount_id);

                if ($variantDiscount) {
                    $cartItemCondition = [
                        'value' => $variantDiscount->value,
                        'suffix' => $variantDiscount->value_type,
                        'reason' => $variantDiscount->reason,
                        'name' => $variant->id,
                        'target' => 'price',
                        'type' => 'discount',
                    ];
                    $discount = new Condition($cartItemCondition);
                    $suffix = $variantDiscount->suffix === 'percent' ? '%' : '';
                    $discount->setActions([
                        [
                            'value' => '-' . $variantDiscount->value . $suffix,
                        ],
                    ]);
                    $cart->update($cartItem->rowId, ['conditions' => $discount]);
                }
            }
        }

        $cartData = [
            ...$cart->getCartData(),
            'discount_value' => $cart->discountedValue(),
            'discount' => $cart->getConditionByName('cart'),
            'items' => $cart->resolveItems(),
        ];

        $data = [
            'order' => $orderResource,
            'cart' => $cartData,
            'products' => $productsResource,
            'customers' => $customersResource,
        ];

        return Inertia::render('Order/Draft/DraftOrderEdit', $data);
    }

    public function update($id, DraftOrderUpdateRequest $request): RedirectResponse
    {
        $order = DraftOrder::find($id);

        $this->dispatch(new UpdateDraftOrder($order, $request->all()));

        return redirect()
            ->back()
            ->with('success', 'Updated');
    }

    public function confirm($id): RedirectResponse
    {
        $draftOrder = DraftOrder::find($id);

        $draftOrder->confirm();

        return redirect()
            ->route('lshopify.orders.show', $draftOrder->id)
            ->with('success', 'Created Order');
    }

    public function attachCustomer($id, DraftOrderCustomerUpdateRequest $request): RedirectResponse
    {
        $order = DraftOrder::find($id);

        if (!$order) {
            $order = Order::find($id);
        }

        if ($request->customer_id) {
            $customer = Customer::find($request->customer_id);
            if ($customer) {
                $order->attachCustomer($customer);
            }
        } else {
            $order->detachCustomer();
        }

        return redirect()->back();
    }
}
