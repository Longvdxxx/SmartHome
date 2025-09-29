<?php

namespace App\Http\Controllers\Server;

use App\Models\Brand;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\LogService;
class BrandController extends Controller
{
    public function index(Request $request)
    {
        $query = Brand::query();
        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%$search%");
        }

        if ($request->filled('sortField') && $request->filled('sortOrder')) {
            $query->orderBy(
                $request->input('sortField'),
                $request->input('sortOrder') == 1 ? 'asc' : 'desc'
            );
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $brands = $query->paginate(10)->appends($request->query());

        return Inertia::render('Brands/Index', [
            'brands' => $brands,
            'filters' => $request->only('search', 'sortField', 'sortOrder'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $brand = Brand::create([
            'name' => $request->name,
        ]);

        LogService::log('create_brand', "Created brand: {$brand->name}", null, $brand);

        return redirect()->route('brands.index')->with('success', 'Brand created successfully.');
    }

    public function update(Request $request, Brand $brand)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $old = $brand->getOriginal();
        $brand->update(['name' => $request->name]);

        $changes = [];
        foreach ($brand->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        LogService::log('update_brand', "Updated brand: {$brand->name}", null, $brand, $changes);

        return redirect()->route('brands.index')->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand)
    {
        $brandName = $brand->name;

        $brand->delete();

        LogService::log('delete_brand', "Deleted brand: {$brandName}", null, $brand);

        return redirect()->back()->with('success', 'Brand deleted.');
    }

    public function edit(Brand $brand)
    {
        return Inertia::render('Brands/Edit', [
            'brand' => $brand
        ]);
    }

    public function create(Brand $brand)
    {
        return Inertia::render('Brands/Create', [
            'brand' => $brand
        ]);
    }
}
