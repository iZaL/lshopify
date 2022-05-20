<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\VendorFactory;

class Vendor extends BaseModel
{
    use HasFactory;

    protected string $table = 'vendors';

    protected $casts = [];

    protected $fillable = ['name'];

    public static function newFactory(): VendorFactory
    {
        return VendorFactory::new();
    }

    public function products(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Product::class, 'vendor_id');
    }
}
