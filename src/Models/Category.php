<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\CategoryFactory;
use IZal\Lshopify\Models\Traits\ImageableTrait;

class Category extends BaseModel
{
    use HasFactory;
    use ImageableTrait;

    /**
     * @var string
     */
    protected $table = 'categories';

    protected $fillable = ['name'];

    public static function newFactory(): CategoryFactory
    {
        return CategoryFactory::new();
    }
}
