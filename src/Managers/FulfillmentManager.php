<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Workflow;

class FulfillmentManager
{
    private Workflow $workflow;

    /**
     * @param Workflow $workflow
     */
    public function __construct(Workflow $workflow)
    {
        $this->workflow = $workflow;
    }

    /**
     * @param $variantAttribute
     * Field $id
     * Field $pivot_quantity
     */

}
