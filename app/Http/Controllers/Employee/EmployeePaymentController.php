<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StoreInventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeePaymentController extends Controller
{
    public function index(Request $request)
    {
        $employee = auth('employee')->user();
        if (!in_array($employee->role, ['manager', 'cashier'])) {
            abort(403);
        }

        $storeId = $employee->store_id;
        $query = StoreInventory::with('product')->where('store_id', $storeId);

        if ($search = $request->input('search')) {
            $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        $inventories = $query->get();

        return Inertia::render('Staff/PaymentSelectProducts', [
            'inventories' => $inventories,
            'flashError' => session('flash_error', null),
        ]);
    }

    public function checkout(Request $request)
    {
        $selectedProducts = $request->input('selectedProducts', []);
        if (empty($selectedProducts)) {
            session()->flash('flash_error', "Please select at least one product.");
            return back();
        }

        $employee = auth('employee')->user();
        $storeId = $employee->store_id;

        $inventories = StoreInventory::where('store_id', $storeId)
            ->whereIn('product_id', array_column($selectedProducts, 'product_id'))
            ->get()
            ->keyBy('product_id');

        $errorProducts = [];

        foreach ($selectedProducts as &$p) {
            if (!isset($inventories[$p['product_id']]) || $inventories[$p['product_id']]->quantity < $p['quantity']) {
                $p['quantity'] = $inventories[$p['product_id']]->quantity ?? 0;
                $errorProducts[] = $p['name'];
            }
        }

        if ($errorProducts) {
            session(['selectedProducts' => $selectedProducts]);
            session()->flash('flash_error', "Not enough stock for: " . implode(", ", $errorProducts));
            return redirect()->route('staff.payment.index')->with('clearLocalStorage', true);
        }

        session(['selectedProducts' => $selectedProducts]);
        return redirect()->route('staff.payment.checkoutPage');
    }

    public function checkoutPage(Request $request)
    {
        $selectedProducts = session('selectedProducts', []);
        if (empty($selectedProducts)) {
            return redirect()->route('staff.payment.index');
        }

        $employee = auth('employee')->user();
        $storeId = $employee->store_id;

        $inventories = StoreInventory::where('store_id', $storeId)
            ->whereIn('product_id', array_column($selectedProducts, 'product_id'))
            ->get()
            ->keyBy('product_id');

        $total = collect($selectedProducts)->sum(fn($p) => $p['price'] * $p['quantity']);

        return Inertia::render('Staff/PaymentCheckout', [
            'selectedProducts' => $selectedProducts,
            'total' => $total,
            'csrfToken' => csrf_token(),
        ]);
    }

    public function confirmPage(Request $request)
    {
        $data = session('paymentCustomer', null);
        if (!$data) {
            return redirect()->route('staff.payment.checkoutPage')->with('flash_error', 'Please fill customer info first.');
        }

        $selectedProducts = collect($data['selectedProducts'])->map(function ($p) {
            $inventory = StoreInventory::with('product')->find($p['inventoryId']);
            if (!$inventory || !$inventory->product) return null;
            $product = $inventory->product;

            return [
                'inventoryId' => $inventory->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $p['quantity'],
                'image' => $product->default_image ? '/' . ltrim($product->default_image, '/') : '/placeholder.png',
            ];
        })->filter()->values()->toArray();

        $total = collect($selectedProducts)->sum(fn($p) => $p['price'] * $p['quantity']);

        return Inertia::render('Staff/PaymentConfirm', [
            'customer' => $data['customer'],
            'selectedProducts' => $selectedProducts,
            'total' => $total,
            'csrfToken' => csrf_token(),
        ]);
    }

    public function confirm(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string|max:1000',
            'selectedProducts' => 'required|array|min:1',
        ]);

        session([
            'paymentCustomer' => [
                'customer' => [
                    'name' => $data['name'],
                    'phone' => $data['phone'],
                    'address' => $data['address'],
                ],
                'selectedProducts' => $data['selectedProducts'],
            ]
        ]);

        return redirect()->route('staff.payment.confirmPage');
    }

    public function store(Request $request)
    {
        $paymentData = session('paymentCustomer');
        if (!$paymentData) {
            return redirect()->route('staff.payment.index')->with('flash_error', 'No products to checkout.');
        }

        $customer = $paymentData['customer'];
        $selectedProducts = $paymentData['selectedProducts'];

        $employee = auth('employee')->user();
        $storeId = $employee->store_id;

        try {
            DB::transaction(function () use ($storeId, $employee, $customer, $selectedProducts) {
                $inventories = StoreInventory::where('store_id', $storeId)
                    ->whereIn('product_id', array_column($selectedProducts, 'product_id'))
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('product_id');

                foreach ($selectedProducts as $p) {
                    if (!isset($inventories[$p['product_id']]) || $inventories[$p['product_id']]->quantity < $p['quantity']) {
                        throw new \Exception("Not enough stock for '{$p['name']}'");
                    }
                }

                $total = collect($selectedProducts)->sum(fn($p) => $p['price'] * $p['quantity']);
                $order = Order::create([
                    'store_id' => $storeId,
                    'employee_id' => $employee->id,
                    'name' => $customer['name'],
                    'phone' => $customer['phone'],
                    'address' => $customer['address'],
                    'status' => 'completed',
                    'total_price' => $total,
                ]);

                foreach ($selectedProducts as $p) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $p['product_id'],
                        'quantity' => $p['quantity'],
                        'price' => $p['price'],
                    ]);

                    $inventories[$p['product_id']]->decrement('quantity', $p['quantity']);
                }
            });
        } catch (\Exception $e) {
            session(['selectedProducts' => $selectedProducts]);
            session()->flash('flash_error', $e->getMessage());
            return redirect()->route('staff.payment.index');
        }

        session()->forget(['selectedProducts', 'paymentCustomer']);
        return redirect()->route('staff.payment.index')->with('success', 'Order completed successfully.')
            ->with('clearLocalStorage', true);
    }
}
