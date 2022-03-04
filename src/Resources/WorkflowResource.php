<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use IZal\Lshopify\Models\Workflow;

class WorkflowResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'status' => $this->status,
            'can_cancel' => $this->type == Workflow::TYPE_FULFILLMENT && $this->status == Workflow::STATUS_SUCCESS,
            'can_mark_as_returned' =>
                $this->type == Workflow::TYPE_RETURNED && $this->status == Workflow::STATUS_PENDING,
            'can_add_tracking' =>
                $this->type == Workflow::TYPE_FULFILLMENT && $this->status == Workflow::STATUS_SUCCESS,
            'can_return' => $this->type == Workflow::TYPE_RETURNED && $this->status == Workflow::STATUS_PENDING,
            //            'total_variants_count' => $this->variants_count,
            'variants' => WorkflowVariantResource::collection($this->whenLoaded('variants')),
            'order' => new OrderResource($this->whenLoaded('order')),
        ];
    }
}
