<?php

namespace App\Http\Controllers\Server;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Services\LogService;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

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

        $categories = $query->paginate(10)->appends($request->query());

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only('search', 'sortField', 'sortOrder'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create([
            'name' => $request->name,
        ]);

        LogService::log('create_category', "Created category: {$category->name}", null, $category);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $old = $category->getOriginal();
        $category->update(['name' => $request->name]);

        $changes = [];
        foreach ($category->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        LogService::log('update_category', "Updated category: {$category->name}", null, $category, $changes);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $name = $category->name;
        $category->delete();

        LogService::log('delete_category', "Deleted category: {$name}", null, $category);

        return redirect()->back()->with('success', 'Category deleted.');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }

    public function create(Category $category)
    {
        return Inertia::render('Categories/Create', [
            'category' => $category
        ]);
    }
}
