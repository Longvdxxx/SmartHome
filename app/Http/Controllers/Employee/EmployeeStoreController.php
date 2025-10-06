<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\Product;
use App\Models\StoreInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogService;

class EmployeeStoreController extends Controller
{
    public function inventory(Store $store)
    {
        $products = Product::whereNull('deleted_at')->get();

        foreach ($products as $product) {
            StoreInventory::firstOrCreate(
                ['store_id' => $store->id, 'product_id' => $product->id],
                ['quantity' => 0]
            );
        }

        $inventories = StoreInventory::with('product')
            ->where('store_id', $store->id)
            ->get();

        return Inertia::render('Staff/InventoryIndex', [
            'store'       => $store,
            'inventories' => $inventories,
        ]);
    }

    public function updateInventory(Request $request, Store $store, StoreInventory $inventory)
    {
        $employee = auth('employee')->user();

        if (!$employee) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!in_array($employee->role, ['manager', 'stock'])) {
            return response()->json([
                'message' => "You are a {$employee->role}, you don't have permission to perform this action."
            ], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $oldQuantity = $inventory->quantity;
        $inventory->update(['quantity' => $request->quantity]);
        $newQuantity = $inventory->fresh()->quantity;

        LogService::log(
            'update_inventory',
            "Updated inventory for product #{$inventory->product_id} in store #{$store->id}. Old: {$oldQuantity}, New: {$newQuantity}"
        );

        return redirect()->back()->with('success', 'Quantity updated successfully');
    }
}
