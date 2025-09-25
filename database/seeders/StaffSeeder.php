<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Store;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $stores = Store::all();

        foreach ($stores as $store) {
            Employee::create([
                'store_id' => $store->id,
                'name'     => 'Manager of ' . $store->name,
                'email'    => strtolower(str_replace(' ', '', $store->name)) . '.manager@test.com',
                'phone'    => '0900000000',
                'role'     => 'manager',
                'password' => bcrypt('password123'),
            ]);

            Employee::create([
                'store_id' => $store->id,
                'name'     => 'Cashier of ' . $store->name,
                'email'    => strtolower(str_replace(' ', '', $store->name)) . '.cashier@test.com',
                'phone'    => '0910000000',
                'role'     => 'cashier',
                'password' => bcrypt('password123'),
            ]);

            Employee::create([
                'store_id' => $store->id,
                'name'     => 'Stock of ' . $store->name,
                'email'    => strtolower(str_replace(' ', '', $store->name)) . '.stock@test.com',
                'phone'    => '0920000000',
                'role'     => 'stock',
                'password' => bcrypt('password123'),
            ]);
        }
    }
}
