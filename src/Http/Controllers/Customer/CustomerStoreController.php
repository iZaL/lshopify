<?php

namespace IZal\Lshopify\Http\Controllers\Customer;

use IZal\Lshopify\Actions\CustomerCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\CustomerStoreRequest;

class CustomerStoreController extends Controller
{
    public function __invoke(
        CustomerStoreRequest $request,
        CustomerCreateAction $action
    ): \Illuminate\Http\RedirectResponse {
        $customer = $action->create($request->customer);
        if ($request->address) {
            $extraParams = [];
            if (! $customer->addresses()->count()) {
                $extraParams['default'] = 1;
            }

            $action->createCustomerAddress($customer, array_merge($request->address, $extraParams));
        }

        return redirect()->back()->with('success');
    }
}
