<?php

namespace IZal\Lshopify\Jobs;

use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Vendor;

class VendorAction
{
    private Vendor $model;

    /**
     * @param Vendor $model
     */
    public function __construct(Vendor $model)
    {
        $this->model = $model;
    }

    public function create(array $attributes): Vendor
    {
        return $this->model->create(
            collect($attributes)
                ->only($this->model->getFillable())
                ->toArray()
        );
    }
}
