<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\CategoryFactory;

class Category extends BaseModel
{
    use HasFactory;
    use ImageableTrait;

    protected $table = 'categories';

    protected $fillable = ['name'];

    public static function newFactory()
    {
        return CategoryFactory::new();
    }
}
