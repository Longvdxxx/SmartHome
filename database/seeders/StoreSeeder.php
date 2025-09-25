<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $stores = [
            [
                'name'    => 'Store Hanoi',
                'address' => '123 Láng Hạ, Hà Nội',
                'phone'   => '0901234567',
            ],
            [
                'name'    => 'Store HCM',
                'address' => '456 Nguyễn Trãi, TP HCM',
                'phone'   => '0912345678',
            ],
            [
                'name'    => 'Store Danang',
                'address' => '789 Lê Lợi, Đà Nẵng',
                'phone'   => '0923456789',
            ],
        ];

        foreach ($stores as $store) {
            Store::create($store);
        }
    }
}
