<?php

namespace IZal\Lshopify\Models;

class VariantOption extends BaseModel
{
    protected $fillable = [
        'variant_id',
        'name',
        'position',
        'values',
    ];

    protected $casts = [
        'values' => 'array',
    ];

    public function variant()
    {
        return $this->belongsTo(Variant::class,'variant_id');
    }

}
