<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\WorkflowFactory;
use IZal\Lshopify\Database\Factories\WorkflowVariantFactory;

class WorkflowVariant extends BaseModel
{
    use HasFactory;

    protected $table = 'workflow_variants';

    protected $guarded = ['id'];

    public static function newFactory()
    {
        return WorkflowVariantFactory::new();
    }

    public function workflow()
    {
        return $this->belongsTo(Workflow::class, 'workflow_id');
    }
}
