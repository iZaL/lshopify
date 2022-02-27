<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CollectionConditionResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'criteria' => $this->criteria,
            'field' => $this->field,
            'value' => $this->value,
            'title' => $this->title,
        ];
    }
}
