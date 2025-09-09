<?php

namespace App\Http\Controllers\Server;

use App\Models\Review;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'product'])
            ->when($request->search, function($q) {
                $q->where('comment', 'like', '%' . request('search') . '%')
                  ->orWhereHas('user', function($sub) {
                      $sub->where('name', 'like', '%' . request('search') . '%');
                  })
                  ->orWhereHas('product', function($sub) {
                      $sub->where('name', 'like', '%' . request('search') . '%');
                  });
            })
            ->orderBy($request->sortField ?? 'created_at', $request->sortOrder == -1 ? 'desc' : 'asc');

        $reviews = $query->paginate(10)->appends(request()->query());

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews,
            'filters' => $request->only('search', 'sortField', 'sortOrder'),
            'auth' => [
                'user' => [
                    'role' => auth()->user()->role
                ]
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Reviews/Create', [
            'users'    => User::select('id', 'name')->get(),
            'products' => Product::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'    => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        Review::create($request->only('user_id', 'product_id', 'rating', 'comment'));

        return redirect()->route('reviews.index')->with('success', 'Review created successfully.');
    }

    public function edit(Review $review)
    {
        return Inertia::render('Reviews/Edit', [
            'review'   => $review,
            'users'    => User::select('id', 'name')->get(),
            'products' => Product::select('id', 'name')->get()
        ]);
    }

    public function update(Request $request, Review $review)
    {
        $request->validate([
            'user_id'    => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        $review->update($request->only('user_id', 'product_id', 'rating', 'comment'));

        return redirect()->route('reviews.index')->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return redirect()->back()->with('success', 'Review deleted.');
    }
}
