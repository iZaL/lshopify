<?php

namespace IZal\Lshopify\Actions;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\CustomerAddress;
use IZal\Lshopify\Models\Discount;
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
    private Cart $cart;

    /**
     * DraftOrderCreateAction constructor.
     * @param DraftOrder $order
     * @param Variant $variant
     * @param Cart $cart
     */
    public function __construct(DraftOrder $order, Variant $variant, Cart $cart)
    {
        $this->order = $order;
        $this->variant = $variant;
        $this->cart = $cart;
    }

    /**
     * @return DraftOrder
     */
    public function create(): DraftOrder
    {
        $order = $this->order->create($this->getCartData());
        $this->createOrderDiscount($order);
        $this->createVariantsFromCartItems($order);
        return $order;
    }

    /**
     * @param  DraftOrder  $order
     * @param  array  $attributes
     */
    public function update(DraftOrder $order, array $attributes)
    {
        $order->update(array_merge($this->getCartData(), Arr::only($attributes, $order->getFillable())));
        if($order->discount) {
            $this->updateOrderDiscount($order->discount);
        } else {
            $this->createOrderDiscount($order);
        }
        $this->updateVariantsFromCartItems($order);
    }

    private function updateOrderDiscount(Discount $discount) {
        $cartDiscount = $this->cart->getConditionByName('cart');
        if($cartDiscount) {
            $discount->update([
                'value' => $cartDiscount->value,
                'value_type' => $cartDiscount->suffix === 'percent' ? 'percent' : 'amount',
                'reason' => $cartDiscount->reason,
            ]);
        }
    }

    private function createOrderDiscount(Order $order)
    {
        $cart = $this->cart;
        $cartDiscount = $cart->getConditionByName('cart');
        if($cartDiscount) {
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

    /**
     * @param DraftOrder $order
     * @return void
     */
    private function createVariantsFromCartItems(DraftOrder $order): void
    {
        foreach ($this->cart->items() as $cartItem) {
            $this->createVariantFromCartItem($order, $cartItem);
        }
    }

    /**
     * @param DraftOrder $order
     * @param ItemCollection $cartItem
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
     * @return void
     */
    private function updateVariantsFromCartItems(DraftOrder $order): void
    {
        $oldVariants = $order->variants->modelKeys();
//        dd($oldVariants);
        $newVariants = [];
        foreach ($this->cart->items() as $cartItem) {
            $variant = $this->variant->find($cartItem->id);
            if($variant) {
                $newVariants[] = $variant->id;
                $this->updateVariantFromCartItem($order, $variant, $cartItem);
            }
        }
        // get diff of oldVariants and newVariants
        $diffVariants = collect($oldVariants)->diff($newVariants);
        $order->variants()->detach($diffVariants);
    }

    public function updateVariantFromCartItem(DraftOrder $order, Variant $variant, ItemCollection $cartItem): Variant
    {
        $variantDiscount = null;
        if ($cartCondition = $cartItem->getConditionByName($variant->id)) {
            $variantDiscount = $this->createVariantCondition($order, $variant, $cartCondition);
        }
        $order->variants()->updateExistingPivot($variant->id,
            array_merge(
                ['discount_id' => $variantDiscount?->id],
                $this->getCartItemData($cartItem)
            ));
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
     * @return array
     */
    private function getCartData(): array
    {
        $cart = $this->cart;
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
