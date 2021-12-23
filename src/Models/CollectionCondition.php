<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\CollectionConditionFactory;

class CollectionCondition extends BaseModel
{
    use HasFactory;

    protected $table = 'collection_conditions';
    public $timestamps = false;

    protected $fillable = ['collection_id', 'field', 'criteria', 'value'];

    public static function newFactory()
    {
        return CollectionConditionFactory::new();
    }

    public function collection()
    {
        return $this->belongsTo(Collection::class, 'collection_id');
    }
}
