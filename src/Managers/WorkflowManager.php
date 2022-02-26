<?php

namespace IZal\Lshopify\Managers;

use Illuminate\Support\Collection;
use IZal\Lshopify\Models\Order;

class WorkflowManager {
    private Order $order;

    /**
     * @param Order $order
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function getUnfulfilledVariants():array
    {
        $orderVariants = $this->getOrderVariantsWithQuantity();

        $workflowVariants = $this->getWorkflowVariantsWithQuantity();

        // compare order variants with workflow variants and find the quantity difference
        $unfulfilledVariants = $orderVariants->map(function($pivot) use ($workflowVariants) {
            $workflowVariant = $workflowVariants->firstWhere('variant_id',$pivot['variant_id']);
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
        })->values()->all();

        return $unfulfilledVariants;
    }

    public function getOrderVariantsWithQuantity():Collection
    {
        $orderVariants = $this->order->variants()->get()->pluck('pivot.quantity', 'id')->map(function ($qty,$id) {
            return [
                'variant_id' => $id,
                'quantity' => $qty,
            ];
        })->values();

        return $orderVariants;
    }

    public function getWorkflowVariantsWithQuantity():Collection
    {
        $workflows = $this->order->workflows()->with('variants')->get();
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


}
