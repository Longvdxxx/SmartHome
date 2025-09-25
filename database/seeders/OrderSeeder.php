<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Customer;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::factory()->count(5)->create();

        foreach ($customers as $customer) {
            $order = Order::create([
                'user_id'     => 1,
                'customer_id' => $customer->id,
                'status'      => 'pending',
                'total_price' => 0,
                'name'        => $customer->name,
                'email'       => $customer->email,
                'address'     => $customer->address,
                'phone'       => $customer->phone,
            ]);

            $products = Product::inRandomOrder()->limit(3)->get();
            $total = 0;

            foreach ($products as $product) {
                $qty = rand(1, 5);
                $price = $product->price * $qty;

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $product->id,
                    'quantity'   => $qty,
                    'price'      => $price,
                ]);

                $total += $price;
            }

            $order->update(['total_price' => $total]);
        }
    }
}
