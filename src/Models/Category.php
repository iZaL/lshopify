<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends BaseModel
{
    use HasFactory;
    use ImageableTrait;

    protected $table = 'categories';

    protected $fillable = ['name'];
}
