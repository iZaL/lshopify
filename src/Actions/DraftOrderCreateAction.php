<?php

namespace IZal\Lshopify\Actions;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        $this->createOrderDiscount($order, $cart);
        $this->createVariantsFromCartItems($order, $cart);
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
        $this->createOrderDiscount($order, $cart);
        $this->createVariantsFromCartItems($order, $cart);
    }

    /**
     * @param  DraftOrder  $order
     * @param  Cart  $cart
     */
    private function createOrderDiscount(DraftOrder $order, Cart $cart): void
    {
        $cartDiscount = $cart->getConditionByName('cart');
        if ($cartDiscount && $cartDiscount->type === 'discount') {
            $discount = $order->discount;
            if ($discount) {
                $discount->update([
                    'value' => $cartDiscount->value,
                    'value_type' => $cartDiscount->suffix === 'percent' ? 'percent' : 'amount',
                    'reason' => $cartDiscount->reason,
                ]);
            } else {
                $discount = $order->discount()->create([
                    'name' => 'Admin cart discount',
                    'auto' => 1,
                    'value' => $cartDiscount->value,
                    'value_type' => $cartDiscount->suffix === 'percent' ? 'percent' : 'amount',
                    'reason' => $cartDiscount->reason,
                ]);
                $order->discount_id = $discount->id;
                $order->save();
            }
        }
    }

    /**
     * @param DraftOrder $order
     * @param Cart $cart
     * @return array
     */
    private function createVariantsFromCartItems(DraftOrder $order, Cart $cart): array
    {
        // delete order variants
        $order->variants()->sync([]);
        $variants = [];
        foreach ($cart->items() as $cartItem) {
            $variants[] = $this->createVariantFromCartItem($order, $cartItem);
        }
        return $variants;
    }

    /**
     * @param DraftOrder $order
     * @param ItemCollection $cartItem
     * @return Variant
     */
    public function createVariantFromCartItem(DraftOrder $order, ItemCollection $cartItem): Variant
    {
        $variant = $this->variant->find($cartItem->id);
        $variantDiscount = null;
        if ($variant) {
            if ($cartCondition = $cartItem->getConditionByName($variant->id)) {
                $variantDiscount = $this->createVariantCondition($order, $variant, $cartCondition);
            }
            $order->variants()->attach($variant->id,
            array_merge(
                ['discount_id' => $variantDiscount?->id],
                $this->getCartItemData($cartItem)
            ));
        }
        return $variant;
    }

    /**
     * @param DraftOrder $order
     * @param Variant $variant
     * @param $itemCondition
     * @return Model|BelongsTo
     */
    private function createVariantCondition(DraftOrder $order, Variant $variant, $itemCondition): Model|BelongsTo
    {
        $discount = $order->discount()->create([
            'name' => 'Admin discount',
            'auto' => 1,
            'value' => $itemCondition->value,
            'value_type' => $itemCondition->suffix === 'percent' ? 'percent' : 'amount',
            'reason' => $itemCondition->reason,
        ]);
        $variant->discounts()->attach($discount->id);
        return $discount;
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
