<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\DraftOrderFactory;
use IZal\Lshopify\Traits\CartService;

class DraftOrder extends Order
{
    use HasFactory;
    use CartService;

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

    public function confirm()
    {
        abort_unless($this->draft(), 403);
        $this->forceFill(['draft' => 0]);
        $this->save();
    }
}
