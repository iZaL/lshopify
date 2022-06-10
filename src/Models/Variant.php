<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use IZal\Lshopify\Database\Factories\VariantFactory;
use IZal\Lshopify\Models\Traits\DiscountableTrait;
use IZal\Lshopify\Models\Traits\ImageableTrait;

class Variant extends BaseModel
{
    use HasFactory;
    use ImageableTrait;
    use DiscountableTrait;

    protected $table = 'variants';

    protected $casts = [
        'taxable' => 'boolean',
        'requires_shipping' => 'boolean',
        'default' => 'boolean',
        'tracked' => 'boolean',
        'physical_product' => 'boolean',
        'out_of_stock_sale' => 'boolean',
        'price' => 'decimal:3',
        'compare_at_price' => 'decimal:3',
        //        'options' => AsArrayObject::class,
        //        'options' => AsCollection::class,
        'options' => 'array',
    ];

    protected $fillable = [
        'product_id',
        'price',
        'position',
        'sku',
        'compare_at_price',
        'fulfillment_service',
        'inventory_management',
        'barcode',
        'weight',
        'hs_code',
        'origin_country_id',
        'weight_unit',
        'cost_price',
        'quantity',
        'default',
        'taxable',
        'requires_shipping',
        'tracked',
        'physical_product',
        'out_of_stock_sale',
        'image_id',
        'options',
    ];

    public static function newFactory()
    {
        return VariantFactory::new();
    }

    public static function defaultVariantOptions(): array
    {
        return [
            ['id' => 'Size', 'name' => 'Size'],
            ['id' => 'Color', 'name' => 'Color'],
            ['id' => 'Material', 'name' => 'Material'],
            ['id' => 'Style', 'name' => 'Style'],
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }

    public function orders()
    {
        return $this->belongsToMany(DraftOrder::class, 'order_variants');
    }

    public function getDisplayImageAttribute()
    {
        $image = $this->image;
        if (!$this->image) {
            $image = $this->product->image;
        }
        return $image;
    }

    public function getTitleAttribute()
    {
        return collect($this->options)
            ->pluck('name')
            ->join(' / ');
    }
}
