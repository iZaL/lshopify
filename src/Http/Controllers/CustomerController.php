<?php

namespace IZal\Lshopify\Http\Controllers;

use Inertia\Inertia;
use IZal\Lshopify\Actions\CreateCustomer;
use IZal\Lshopify\Actions\CreateCustomerAddress;
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
        CreateCustomer $createCustomer,
        CreateCustomerAddress $createCustomerAddress
    ): \Illuminate\Http\RedirectResponse {
        $customer = $createCustomer->run($request->customer);
        $createCustomerAddress->run($customer, $request->address);
        return redirect()
            ->back()
            ->with('success');
    }
}
