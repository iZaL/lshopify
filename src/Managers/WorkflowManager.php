<?php

namespace IZal\Lshopify\Managers;

use Illuminate\Support\Collection;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Workflow;

class WorkflowManager
{
    private Order $order;

    /**
     * @param Order $order
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function getFulfilledVariantsWithPivot(): Collection
    {
        $fulfilledVariants = $this->getFulfilledVariants();
        $variants = Variant::with(['product.image'])
            ->whereIn('id', $fulfilledVariants->pluck('id'))
            ->get();
        foreach ($variants as $variant) {
            $variant->setAttribute(
                'pivot',
                $fulfilledVariants->where('id', $variant->id)->first()->pivot
            );
        }
        return $variants;
    }

    private function getFulfilledVariants(): Collection
    {
        $fulfilledVariants = $this->getFulfilledVariantsForOrder();
        $remainingFulfillableVariants = $this->getFulfillableVariantsWithQuantity(
            $fulfilledVariants
        );
        return $this->resolveVariants($remainingFulfillableVariants);
    }

    private function getFulfilledVariantsForOrder(): Collection
    {
        $fulfilledWorkflows = $this->order
            ->workflows()
            ->where(function ($q) {
                $q->where('type', 'fulfilled')->orWhere('type', 'refund');
            })
            ->where('order_id', $this->order->id)
            ->get();

        return $fulfilledWorkflows
            ->map(function ($workflow) {
                $adjustmentTerm = $workflow->type === 'refund' ? '-' : '+';
                return $workflow->variants->map(function ($variant) use (
                    $adjustmentTerm
                ) {
                    return [
                        'variant_id' => $variant->id,
                        'quantity' => $variant->pivot->quantity,
                        'adjustment' => $adjustmentTerm,
                    ];
                });
            })
            ->collapse();
    }

    private function getFulfillableVariantsWithQuantity(
        Collection $fulfilledVariants
    ): Collection {
        return $fulfilledVariants
            ->groupBy('variant_id')
            ->map(function ($item, $key) {
                $incrementingVariants = $item
                    ->where('adjustment', '+')
                    ->sum('quantity');
                $decrementingVariants = $item
                    ->where('adjustment', '-')
                    ->sum('quantity');
                return [
                    'variant_id' => $key,
                    'quantity' => $incrementingVariants - $decrementingVariants,
                ];
            })
            ->reject(function ($item) {
                return $item['quantity'] <= 0;
            })
            ->values();
    }

    public function getUnfulfilledVariantsWithPivot(): Collection
    {
        $unfulfilledVariants = $this->getUnfulfilledVariants();
        $variants = Variant::with(['product.image'])
            ->whereIn('id', $unfulfilledVariants->pluck('id'))
            ->get();
        foreach ($variants as $variant) {
            $variant->setAttribute(
                'pivot',
                $unfulfilledVariants->where('id', $variant->id)->first()->pivot
            );
        }
        return $variants;
    }

    private function getUnfulfilledVariants(): Collection
    {
        $orderVariants = $this->getOrderVariantsWithQuantity();
        $workflowVariants = $this->getWorkflowVariantsWithQuantity();
        $unfulfilledVariants = $this->getUnfulfilledVariantsWithQuantity(
            $orderVariants,
            $workflowVariants
        );
        return $this->resolveVariants($unfulfilledVariants);
    }

    private function getOrderVariantsWithQuantity(): Collection
    {
        return $this->order->variants
            ->pluck('pivot.quantity', 'id')
            ->map(function ($qty, $id) {
                return [
                    'variant_id' => $id,
                    'quantity' => $qty,
                ];
            })
            ->values();
    }

    private function getWorkflowVariantsWithQuantity(): Collection
    {
        $workflows = $this->order->workflows->where('type', '!=', 'refund');
        $workflowVariants = collect();
        foreach ($workflows as $workflow) {
            $variants = $workflow->variants
                ->pluck('pivot.quantity', 'pivot.variant_id')
                ->map(function ($qty, $id) {
                    return [
                        'variant_id' => $id,
                        'quantity' => $qty,
                    ];
                })
                ->toArray();
            $workflowVariants = $workflowVariants->merge($variants);
        }

        return $workflowVariants
            ->groupBy('variant_id')
            ->map(function ($item, $key) {
                return [
                    'variant_id' => $key,
                    'quantity' => $item->sum('quantity'),
                ];
            })
            ->values();
    }

    /**
     * @param Collection $variants
     * @return Collection
     */
    private function resolveVariants(Collection $variants): Collection
    {
        return $variants
            ->map(function ($item) {
                $variant = $this->order
                    ->variants()
                    ->firstWhere('variants.id', $item['variant_id']);
                if ($variant) {
                    $variant->pivot->quantity = $item['quantity'];
                }
                return $variant;
            })
            ->reject(null);
    }

    /**
     * @param Collection $orderVariants
     * @param Collection $workflowVariants
     * @return Collection
     */
    private function getUnfulfilledVariantsWithQuantity(
        Collection $orderVariants,
        Collection $workflowVariants
    ): Collection {
        return $orderVariants
            ->map(function ($pivot) use ($workflowVariants) {
                $workflowVariant = $workflowVariants->firstWhere(
                    'variant_id',
                    $pivot['variant_id']
                );
                if ($workflowVariant) {
                    return [
                        'variant_id' => $pivot['variant_id'],
                        'quantity' =>
                            $pivot['quantity'] - $workflowVariant['quantity'],
                    ];
                }
                return [
                    'variant_id' => $pivot['variant_id'],
                    'quantity' => $pivot['quantity'],
                ];
            })
            ->reject(function ($item) {
                return $item['quantity'] <= 0;
            })
            ->values();
    }

    public function createRemovedFulfillments($fulfillments):Workflow
    {
            $removedWorkflow = $this->order->workflows()->create([
                'type' => Workflow::TYPE_REMOVED,
            ]);
            $this->createFulfillment($removedWorkflow,$fulfillments);
            return $removedWorkflow;
    }

    public function createFulfillments($fulfillments):Workflow
    {
            $removedWorkflow = $this->order->workflows()->create([
                'type' => Workflow::TYPE_REFUND,
            ]);
            $this->createFulfillment($removedWorkflow,$fulfillments);
            return $removedWorkflow;
    }

    private function createFulfillment($workflow,$fulfillments)
    {
        foreach ($fulfillments as $fulfillment) {
            $variant = $this->order->variants->firstWhere('id', $fulfillment['id']);
            if ($variant) {
                $refundingQuantity = $fulfillment['pivot_quantity'];
                if ($refundingQuantity > 0) {
                    $workflow->variants()->attach($variant->id, [
                        'quantity' => $refundingQuantity,
                        'price' => $variant->pivot->price,
                        'unit_price' => $variant->pivot->unit_price,
                        'total' => $refundingQuantity * $variant->pivot->unit_price,
                        'subtotal' => $refundingQuantity * $variant->pivot->unit_price,
                    ]);
                }
            }
        }

    }

}
