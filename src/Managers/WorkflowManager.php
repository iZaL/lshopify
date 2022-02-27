<?php

namespace IZal\Lshopify\Managers;

use Illuminate\Support\Collection;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Variant;

class WorkflowManager {

    private Order $order;

    /**
     * @param Order $order
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function getFulfilledVariantsWithPivot():Collection
    {
        $fulfilledVariants = $this->getFulfilledVariants();
        return $fulfilledVariants->map(function ($variant) {
            $v = Variant::with(['product'])->find($variant->id)
                ->setAttribute('pivot', $variant->pivot);
            return $v;
        });
    }

    public function getFulfilledVariants():Collection
    {
        $fulfilledVariants = $this->getFulfilledVariantsWithQuantity();
        $workflowVariants = $this->getWorkflowVariantsWithQuantity();
        $remainingFulfillableVariants = $this->getFulfillableVariantsWithQuantity($fulfilledVariants, $workflowVariants);
        return $this->resolveVariants($remainingFulfillableVariants);
    }

    public function getFulfilledVariantsWithQuantity():Collection
    {
        $fulfilledWorkflows = $this->order->workflows()
            ->where('type','fulfill')
            ->orWhere('type','refund')
            ->get()
            ->map(function ($workflow) {
                $adjustmentTerm = $workflow->type === 'refund' ? '-' : '+';
                return $workflow->variants->map(function ($variant) use ($adjustmentTerm) {
                    return [
                        'variant_id' => $variant->id,
                        'quantity' => $variant->pivot->quantity,
                        'adjustment' => $adjustmentTerm
                    ];
                });
            })->collapse();
        return $fulfilledWorkflows;
    }

    private function getFulfillableVariantsWithQuantity(Collection $fulfilledVariants, Collection $allVariants): Collection
    {
        $fulfilledVariants=  $fulfilledVariants->groupBy('variant_id')->map(function ($item, $key) {
            $incrementingVariants = $item->where('adjustment','+')->sum('quantity');
            $decrementingVariants = $item->where('adjustment', '-')->sum('quantity');

            return [
                'variant_id' => $key,
                'quantity' => $incrementingVariants - $decrementingVariants
            ];
        })->reject(function ($item) {
            return $item['quantity'] <= 0;
        })->values();

        return $fulfilledVariants;
    }

    public function getUnfulfilledVariantsWithPivot():Collection
    {
        $unfulfilledVariants = $this->getUnfulfilledVariants();
        return $unfulfilledVariants->map(function ($variant) {
            $v = Variant::with(['product'])->find($variant->id)
                ->setAttribute('pivot', $variant->pivot);
            return $v;
        });
    }

    public function getUnfulfilledVariants():Collection
    {
        $orderVariants = $this->getOrderVariantsWithQuantity();
        $workflowVariants = $this->getWorkflowVariantsWithQuantity();
        $unfulfilledVariants = $this->getUnfulfilledVariantsWithQuantity($orderVariants, $workflowVariants);
        return $this->resolveVariants($unfulfilledVariants);
    }

    private function getOrderVariantsWithQuantity():Collection
    {
        $orderVariants = $this->order->variants()->get()->pluck('pivot.quantity', 'id')->map(function ($qty,$id) {
            return [
                'variant_id' => $id,
                'quantity' => $qty,
            ];
        })->values();

        return $orderVariants;
    }

    private function getWorkflowVariantsWithQuantity():Collection
    {
        $workflows = $this->order->workflows()->with('variants')->where('type','!=','refund')->get();
        $workflowVariants = collect();
        foreach ($workflows as $workflow) {
            $variants = $workflow->variants()->get()->pluck('pivot.quantity', 'pivot.variant_id')->map(function ($qty,$id) {
                return [
                    'variant_id' => $id,
                    'quantity' => $qty,
                ];
            })->toArray();
            $workflowVariants = $workflowVariants->merge($variants);
        }

        $workflowVariants = $workflowVariants->groupBy('variant_id')->map(function ($item, $key) {
            return [
                'variant_id' => $key,
                'quantity' => $item->sum('quantity'),
            ];
        })->values();

        return $workflowVariants;
    }

    /**
     * @param Collection $unfulfilledVariants
     * @return Collection
     */
    public function resolveVariants(Collection $unfulfilledVariants): Collection
    {
        return $unfulfilledVariants->map(function ($item) {
            $variant = $this->order->variants()->firstWhere('variants.id', $item['variant_id']);
            if ($variant) {
                $variant->pivot->quantity = $item['quantity'];
            }
            return $variant;
        })->reject(null);
    }

    /**
     * @param Collection $orderVariants
     * @param Collection $workflowVariants
     * @return Collection
     */
    private function getUnfulfilledVariantsWithQuantity(Collection $orderVariants, Collection $workflowVariants): Collection
    {

        return $orderVariants->map(function ($pivot) use ($workflowVariants) {
            $workflowVariant = $workflowVariants->firstWhere('variant_id', $pivot['variant_id']);
            if ($workflowVariant) {
                return [
                    'variant_id' => $pivot['variant_id'],
                    'quantity' => $pivot['quantity'] - $workflowVariant['quantity'],
                ];
            }
            return [
                'variant_id' => $pivot['variant_id'],
                'quantity' => $pivot['quantity'],
            ];
        })->reject(function ($item) {
            return $item['quantity'] <= 0;
        })->values();
    }

}
