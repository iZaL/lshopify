<?php

namespace IZal\Lshopify\Models;

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

    public function createOptions(array $options)
    {
        if ($this->default) {
            $options = $this->getOptionsMatrix($options);
            foreach ($options as $option) {
                $newVariant = $this->replicate(['default']);
                $newVariant->options = $option;
                $newVariant->save();
            }
        }
    }

    public function getOptionsMatrix(array $options): \Illuminate\Support\Collection
    {
        $optionValues = collect([]);
        foreach ($options as $option) {
            $values = [];
            foreach ($option['values'] as $value) {
                $values[] = [
                    'id' => $option['id'],
                    'name' => $value['name'],
                ];
            }
            $optionValues[] = $values;
        }

        /**
         * The following methods cross joins the products with its variants
         * for ex: Size (S,M) Color(Black, Brown)
         * result: [S Black, S brown, M Black, M Brown)
         */
        $firstOption = collect($optionValues->first()); // get the first item of the array

        $optionsExcludingFirst = $optionValues->slice(1)->all(); // get the rest items of array

        return $firstOption->crossJoin(...$optionsExcludingFirst);
    }
}
