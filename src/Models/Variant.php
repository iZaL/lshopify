<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\VariantFactory;

class Variant extends BaseModel
{
    use HasFactory;
    use ImageableTrait;

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
    ];

    public static function newFactory()
    {
        return VariantFactory::new();
    }

    public static function defaultVariantOptions()
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

    public function image()
    {
        return $this->belongsTo(Image::class);
    }

    public function orders()
    {
        return $this->belongsToMany(DraftOrder::class, 'order_variants');
    }

    public function new_options()
    {
        return $this->hasMany(VariantOption::class, 'variant_id');
    }

    public function getTitleAttribute()
    {
//        $title = $this->options;
//
//        if(!$title) {
//            $title = 'Default variant';
//        } else {
//            dd($title);
//            $title = implode(', ', $title);
//        }

        return collect($this->options)
            ->pluck('name')
            ->join(' / ');
    }

    public function getVariantOptionsAttribute(): array
    {
        return collect($this->options)
            ->map(function ($option) {
                dd($option);
                return [
                    'id' => $option['id'],
                    'name' => $option['name'],
                ];
            })
            ->toArray();
    }

//    public function getVariantOptionsValuesAttribute(): array
//    {
//        $variants = $this
//            ->pluck('options')
//            ->collapse()
//            ->unique('name')
//            ->toArray();
//        return [...$variants];
//    }

    public function getOptionsArrayAttribute()
    {

        //

        return $this->options;
        $options = $this->variant_options;
        dd($options);
    }
}


// variants =
