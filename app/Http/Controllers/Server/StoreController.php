<?php

namespace App\Http\Controllers\Server;

use App\Models\Store;
use App\Models\Product;
use App\Models\StoreInventory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use DB;
use App\Services\LogService;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $query = Store::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('address', 'like', "%$search%")
                  ->orWhere('phone', 'like', "%$search%");
        }

        if ($request->filled('sortField') && $request->filled('sortOrder')) {
            $query->orderBy(
                $request->input('sortField'),
                $request->input('sortOrder') == 1 ? 'asc' : 'desc'
            );
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $stores = $query->paginate(10)->appends($request->query());

        return Inertia::render('Stores/Index', [
            'stores'  => $stores,
            'filters' => $request->only('search', 'sortField', 'sortOrder'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone'   => 'nullable|string|max:255',
        ]);

        $store = Store::create($request->only('name','address','phone'));

        LogService::log('create_store', "Created store: {$store->name}", null, $store);

        return redirect()->route('stores.index')->with('success', 'Store created successfully.');
    }

    public function update(Request $request, Store $store)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone'   => 'nullable|string|max:255',
        ]);

        $old = $store->getOriginal();
        $store->update($request->only('name','address','phone'));

        $changes = [];
        foreach ($store->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        LogService::log('update_store', "Updated store: {$store->name}", null, $store, $changes);

        return redirect()->route('stores.index')->with('success', 'Store updated successfully.');
    }

    public function destroy(Store $store)
    {
        $name = $store->name;
        $store->delete();

        LogService::log('delete_store', "Deleted store: {$name}", null, $store);

        return redirect()->back()->with('success', 'Store deleted.');
    }

    public function edit(Store $store)
    {
        return Inertia::render('Stores/Edit', [
            'store' => $store
        ]);
    }

    public function create()
    {
        return Inertia::render('Stores/Create');
    }

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

        return Inertia::render('Stores/Inventory', [
            'store'       => $store,
            'inventories' => $inventories,
        ]);
    }

    public function updateInventory(Request $request, Store $store, StoreInventory $inventory)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $oldQuantity = $inventory->quantity;
        $inventory->update(['quantity' => $request->quantity]);

        LogService::log(
            'update_inventory',
            "Updated inventory for store #{$store->id}, product #{$inventory->product_id}",
            null,
            $inventory,
            ['quantity' => ['old' => $oldQuantity, 'new' => $request->quantity]]
        );

        return redirect()->back()->with('success', 'Inventory updated.');
    }
}
