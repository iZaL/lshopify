<?php

namespace IZal\Lshopify\Models;

class Option extends BaseModel
{
    protected $table = 'options';
    public $timestamps = false;

    protected $fillable = ['name'];

}
