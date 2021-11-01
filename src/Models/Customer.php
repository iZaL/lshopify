<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Customer extends BaseModel
{
    use HasFactory;

    protected $table = 'customers';

    protected $casts = [];

    protected $fillable = ['first_name', 'last_name', 'email', 'phone', 'accepts_marketing', 'tax_exempted'];

    public function getFullNameAttribute()
    {
        return Str::title($this->first_name.' '.$this->last_name);
    }

    public function orders()
    {
        return $this->hasMany(DraftOrder::class);
    }

    public function default_address()
    {
        $address = $this->hasOne(CustomerAddress::class)->where('default', 1);
        if (! $address) {
            $address = $this->hasOne(CustomerAddress::class)->latest();
        }

        return $address;
    }

    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }
}
