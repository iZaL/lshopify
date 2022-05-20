<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use IZal\Lshopify\Database\Factories\CollectionConditionFactory;

class CollectionCondition extends BaseModel
{
    use HasFactory;

    public $timestamps = false;

    protected string $table = 'collection_conditions';

    protected $fillable = ['collection_id', 'field', 'criteria', 'value'];

    public static function newFactory()
    {
        return CollectionConditionFactory::new();
    }

    public function collection()
    {
        return $this->belongsTo(Collection::class, 'collection_id');
    }

    public function getTitleAttribute()
    {
        return ucfirst(strtolower(Str::headline($this->field . ' ' . $this->criteria . ' ' . $this->value)));
    }
}
