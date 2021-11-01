<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class CollectionCondition extends BaseModel
{
    use HasFactory;

    protected $table = 'collection_conditions';
    public $timestamps = false;

    protected $fillable = ['collection_id', 'field', 'criteria', 'value'];

    public function collection()
    {
        return $this->belongsTo(Collection::class, 'collection_id');
    }
}
