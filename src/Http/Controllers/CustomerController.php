<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use IZal\Lshopify\Jobs\CreateCustomer;
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

    public function store(CustomerStoreRequest $request): RedirectResponse
    {
        $this->dispatch(new CreateCustomer($request->all()));
        return redirect()
            ->back()
            ->with('success');
    }
}
