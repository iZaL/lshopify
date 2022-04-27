<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use IZal\Lshopify\Actions\CustomerCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\CustomerStoreRequest;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Resources\CustomerResource;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::withCount('orders')->paginate(100);
        $customers = CustomerResource::collection($customers);
        return Inertia::render('Customer/CustomerIndex', ['customers' => $customers]);
    }

    public function store(
        CustomerStoreRequest $request,
        CustomerCreateAction $action
    ): \Illuminate\Http\RedirectResponse {
        $customer = $action->create($request->customer);
        if ($request->address) {
            $extraParams = [];
            if (!$customer->addresses()->count()) {
                $extraParams['default'] = 1;
            }
            $action->createCustomerAddress($customer, array_merge($request->address, $extraParams));
        }

        return redirect()
            ->back()
            ->with('success');
    }
}
