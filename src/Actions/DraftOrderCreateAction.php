<?php

namespace IZal\Lshopify\Actions;

use Illuminate\Support\Str;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\CustomerAddress;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Variant;
use Illuminate\Support\Arr;

class DraftOrderCreateAction extends OrderCreateAction
{
    /**
     * @var DraftOrder
     */
    private $order;
    /**
     * @var Variant
     */
    private $variant;

    /**
     * DraftOrderCreateAction constructor.
     * @param  DraftOrder  $order
     * @param  Variant  $variant
     */
    public function __construct(DraftOrder $order, Variant $variant)
    {
        $this->order = $order;
        $this->variant = $variant;
    }

    /**
     * @param  Cart  $cart
     * @return DraftOrder
     */
    public function create(Cart $cart): DraftOrder
    {
        $order = $this->order->create($this->getCartData($cart));

        $this->createCartCondition($order, $cart);

        $this->createVariants($order, $cart);

        return $order;
    }

    /**
     * @param  DraftOrder  $order
     * @param  Cart  $cart
     * @param  array  $attributes
     */
    public function update(DraftOrder $order, Cart $cart, array $attributes)
    {
        $order->update(array_merge($this->getCartData($cart), Arr::only($attributes, $order->getFillable())));
        $this->createCartCondition($order, $cart);
        $this->createVariants($order, $cart);
    }

    /**
     * @param  DraftOrder  $order
     * @param  Cart  $cart
     * @param  ItemCollection  $cartItem
     */
    public function createVariant(DraftOrder $order, Cart $cart, ItemCollection $cartItem)
    {
        $variant = $this->variant->find($cartItem->id);

        if ($variant) {
            $order->variants()->attach($variant->id, $this->getCartItemData($cartItem));
            $variant->discounts()->sync([]);
            $this->createCartItemCondition($order, $cartItem, $variant->id);
        }
    }

    /**
     * @param  DraftOrder  $order
     * @param  Cart  $cart
     */
    private function createVariants(DraftOrder $order, Cart $cart): void
    {
        // delete order variants
        $order->variants()->sync([]);

        foreach ($cart->items() as $cartItem) {
            $this->createVariant($order, $cart, $cartItem);
        }
    }

    /**
     * @param  DraftOrder  $order
     * @param  Cart  $cart
     */
    private function createCartCondition(DraftOrder $order, Cart $cart): void
    {
        $cartCondition = $cart->getConditionByName('cart');
        if ($cartCondition) {
            if ($cartCondition->type === 'discount') {
                $discount = $order->discount()->create([
                    'name' => 'Admin Discount ' . Str::uuid(),
                    'type' => 'automatic',
                    'value' => $cartCondition->value,
                    'value_type' => $cartCondition->suffix === 'percent' ? 'percent' : 'amount',
                    'reason' => $cartCondition->reason,
                ]);
                $order->discount_id = $discount->id;
                $order->save();
            }
        }
    }

    /**
     * @param  DraftOrder  $order
     * @param  ItemCollection  $cartItem
     * @param  int  $variantID
     */
    private function createCartItemCondition(DraftOrder $order, ItemCollection $cartItem, int $variantID): void
    {
        $itemCondition = $cartItem->getConditionByName($variantID);
        if ($itemCondition) {
            if ($itemCondition->type === 'discount') {
                $discount = $order->discount()->create([
                    'name' => 'Admin Discount ' . Str::uuid(),
                    'type' => 'automatic',
                    'value' => $itemCondition->value,
                    'value_type' => $itemCondition->suffix === 'percent' ? 'percent' : 'amount',
                    'reason' => $itemCondition->reason,
                ]);
                $discount->variants()->sync([$variantID]);
            }
        }
    }

    /**
     * @param Order|DraftOrder $order
     * @param Customer $customer
     */
    public function attachCustomer(Order|DraftOrder $order, Customer $customer)
    {
        $order->update(['customer_id' => $customer->id]);

        $this->updateShippingAddress($order);

        $this->updateBillingAddress($order);
    }

    /**
     * @param Order|DraftOrder $order
     */
    public function detachCustomer(Order|DraftOrder $order)
    {
        $order->update(['customer_id' => null]);
    }

    /**
     * @param  DraftOrder|Order  $order
     * @param  array  $attributes
     */
    public function updateShippingAddress(Order|DraftOrder $order, array $attributes = [])
    {
        $shippingAttributes = empty($attributes) ? $this->getShippingAddress($order) : $attributes;
        $attributes = CustomerAddress::parseShippingAddress($shippingAttributes, $this->order->getFillable());
        $order->update($attributes);
    }

    /**
     * @param DraftOrder|Order $order
     * @param array $attributes
     */
    public function updateBillingAddress(DraftOrder|Order $order, array $attributes = [])
    {
        $billingAttributes = empty($attributes) ? $this->getBillingAddress($order) : $attributes;
        $attributes = CustomerAddress::parseBillingAddress($billingAttributes, $this->order->getFillable());
        $order->update($attributes);
    }

    /**
     * @param  Cart  $cart
     * @return array
     */
    private function getCartData(Cart $cart): array
    {
        return [
            'total' => $cart->total(),
            'subtotal' => $cart->subtotal(),
            'quantity' => $cart->quantity(),
        ];
    }

    /**
     * @param  ItemCollection  $cartItem
     * @return array
     */
    private function getCartItemData(ItemCollection $cartItem): array
    {
        return [
            'price' => $cartItem->price(),
            'unit_price' => $cartItem->unit_price(),
            'total' => $cartItem->total(),
            'subtotal' => $cartItem->subtotal(),
            'quantity' => $cartItem->quantity(),
        ];
    }
}
