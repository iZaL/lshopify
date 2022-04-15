<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    public $morphs = [
        'product' => 'IZal\Lshopify\Models\Product',
        'collection' => 'IZal\Lshopify\Models\Collection',
    ];
}
