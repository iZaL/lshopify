<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\DraftOrderFactory;

class DraftOrder extends Order
{
    use HasFactory;

    protected $table = 'orders';

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope('draft', function (Builder $builder) {
            $builder->where('draft', 1);
        });
        static::creating(function ($model) {
            $model->draft = 1;
        });
    }

    public static function newFactory()
    {
        return DraftOrderFactory::new();
    }

    public function archive()
    {
        $this->status = 'archived';
        $this->save();
    }
}
