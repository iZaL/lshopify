<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition()
    {
        return [
            'order_id' => Order::factory()->create(),
            'amount' => rand(1, 100),
        ];
    }

    public function sale()
    {
        return $this->state(function (array $attributes) {
            return [
                'kind' => Transaction::KIND_SALE,
            ];
        });
    }

    public function refund()
    {
        return $this->state(function (array $attributes) {
            return [
                'kind' => Transaction::KIND_REFUND,
            ];
        });
    }

    public function success()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Transaction::STATUS_SUCCESS,
            ];
        });
    }

    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Transaction::STATUS_PENDING,
            ];
        });
    }
}
