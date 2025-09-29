<?php

namespace App\Http\Controllers\Server;

use App\Models\Banner;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\LogService;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::with('product')->latest();

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $banners = $query->paginate(10)->appends($request->all());
        $products = Product::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Banners/Index', [
            'banners'  => $banners,
            'products' => $products,
            'filters'  => $request->only(['search', 'product_id']),
        ]);
    }

    public function create()
    {
        $products = Product::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Banners/Create', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'product_id'  => 'nullable|exists:products,id',
            'image'       => 'required|image|max:20480',
        ]);

        $path = $request->file('image')->store('banners', 'public');

        $banner = Banner::create([
            'name'        => $request->name,
            'description' => $request->input('description'),
            'product_id'  => $request->product_id,
            'image_url'   => 'storage/' . $path,
        ]);

        LogService::log('create_banner', "Created banner: {$banner->name}");

        return redirect()->route('banners.index')->with('success', 'Banner created successfully.');
    }

    public function edit(Banner $banner)
    {
        $products = Product::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Banners/Edit', [
            'banner'   => $banner->load('product'),
            'products' => $products
        ]);
    }

    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'product_id'  => 'nullable|exists:products,id',
            'image'       => 'nullable|image|max:20480',
        ]);

        $old = $banner->getOriginal();

        $data = [
            'name'        => $request->name,
            'description' => $request->description,
            'product_id'  => $request->product_id,
        ];

        if ($request->hasFile('image')) {
            if ($banner->image_url && Storage::exists(str_replace('storage/', 'public/', $banner->image_url))) {
                Storage::delete(str_replace('storage/', 'public/', $banner->image_url));
            }

            $path = $request->file('image')->store('banners', 'public');
            $data['image_url'] = 'storage/' . $path;
        }

        $banner->update($data);

        $changes = [];
        foreach ($banner->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        LogService::log('update_banner', "Updated banner: {$banner->name}", null, null, $changes);

        return redirect()->route('banners.index')->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner)
    {
        $bannerName = $banner->name;
        $bannerId   = $banner->id;

        if ($banner->image_url && Storage::exists(str_replace('storage/', 'public/', $banner->image_url))) {
            Storage::delete(str_replace('storage/', 'public/', $banner->image_url));
        }

        $banner->delete();

        LogService::log('delete_banner', "Deleted banner: {$bannerName} (ID: {$bannerId})");

        return redirect()->route('banners.index')->with('success', 'Banner deleted successfully.');
    }
}
