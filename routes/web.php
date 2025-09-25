<?php

use App\Http\Controllers\Server\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Server\{ProductController, CategoryController, BrandController, BannerController, ReviewController, ProductImageController, OrderItemController, OrderController, CustomerController, UserController};
use App\Http\Controllers\Client\{DashboardController, ProductPageController, CustomerAuthController, SelectRoleController, ProductListController, CheckoutController, CartController, OrderPageController};
use App\Http\Controllers\Client\CustomerProfileController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [SelectRoleController::class, 'show'])->name('select.role');

Route::prefix('server')->group(function () {

    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    })->name('welcome');

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    Route::get('/uikit/button', function () {
        return Inertia::render('main/uikit/button/page');
    })->name('button');

    Route::middleware(['auth', 'isAdmin'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');

        Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
        Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
        Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');
        Route::get('/customers/create', [CustomerController::class, 'create'])->name('customers.create');
        Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');

        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
        Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
        Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    });

    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
                return Inertia::render('Dashboard');
            })->name('dashboard');

        Route::get('/brands', [BrandController::class, 'index'])->name('brands.index');
        Route::post('/brands', [BrandController::class, 'store'])->name('brands.store');
        Route::put('/brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
        Route::delete('/brands/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');
        Route::get('/brands/create', [BrandController::class, 'create'])->name('brands.create');
        Route::get('/brands/{brand}/edit', [BrandController::class, 'edit'])->name('brands.edit');

        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
        Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');

        Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
        Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');

        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::get('/orders/{order}/edit', action: [OrderController::class, 'edit'])->name('orders.edit');

        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');

        // Route::get('/order-items', [OrderItemController::class, 'index'])->name('order-items.index');
        // Route::post('/order-items', [OrderItemController::class, 'store'])->name('order-items.store');
        // Route::put('/order-items/{orderItem}', [OrderItemController::class, 'update'])->name('order-items.update');
        // Route::delete('/order-items/{orderItem}', [OrderItemController::class, 'destroy'])->name('order-items.destroy');
        // Route::get('/order-items/create', [OrderItemController::class, 'create'])->name('order-items.create');
        // Route::get('/order-items/{orderItem}/edit', [OrderItemController::class, 'edit'])->name('order-items.edit');

        Route::get('/product-images', [ProductImageController::class, 'index'])->name('product-images.index');
        Route::post('/product-images', [ProductImageController::class, 'store'])->name('product-images.store');
        Route::put('/product-images/{productImage}', [ProductImageController::class, 'update'])->name('product-images.update');
        Route::delete('/product-images/{productImage}', [ProductImageController::class, 'destroy'])->name('product-images.destroy');
        Route::get('/product-images/create', [ProductImageController::class, 'create'])->name('product-images.create');
        Route::get('/product-images/{productImage}/edit', [ProductImageController::class, 'edit'])->name('product-images.edit');

        Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
        Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
        Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
        Route::get('/reviews/create', [ReviewController::class, 'create'])->name('reviews.create');
        Route::get('/reviews/{review}/edit', [ReviewController::class, 'edit'])->name('reviews.edit');
        Route::get('reviews/{review}', [ReviewController::class, 'show'])->name('reviews.show');

        Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');
        Route::post('/banners', [BannerController::class, 'store'])->name('banners.store');
        Route::put('/banners/{banner}', [BannerController::class, 'update'])->name('banners.update');
        Route::delete('/banners/{banner}', [BannerController::class, 'destroy'])->name('banners.destroy');
        Route::get('/banners/create', [BannerController::class, 'create'])->name('banners.create');
        Route::get('/banners/{banner}/edit', [BannerController::class, 'edit'])->name('banners.edit');
    });

    require __DIR__.'/auth.php';
});

Route::prefix('shop')->group(function () {

    Route::middleware(['web', 'customer.auth'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('client.dashboard');
        Route::get('/products/{id}', [ProductPageController::class, 'show'])
            ->name('client.products');
        Route::get('/products', [ProductListController::class, 'index'])
            ->name('client-products.index');
        Route::get('/profile', [CustomerProfileController::class, 'edit'])->name('customer.profile.edit');
        Route::put('/profile', [CustomerProfileController::class, 'update'])->name('customer.profile.update');

        Route::get('/change-password', [CustomerProfileController::class, 'editPassword'])->name('customer.password.edit');
        Route::put('/change-password', [CustomerProfileController::class, 'updatePassword'])->name('customer.password.update');

        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
        Route::post('/cart/update/{id}/{quantity}', [CartController::class, 'update'])->name('cart.update');
        Route::put('/cart/update-all', [CartController::class, 'updateAll'])->name('cart.updateAll');
        Route::delete('/cart/remove/{item}', [CartController::class, 'remove'])->name('cart.remove');

        Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/checkout/confirm', [CheckoutController::class, 'confirm'])->name('checkout.confirm');
        Route::post('/checkout/place-order', [CheckoutController::class, 'placeOrder'])->name('checkout.placeOrder');
        Route::post('/checkout/pay', [CheckoutController::class, 'payWithPaypal'])->name('paypal.pay');
        Route::get('/checkout/paypal-success', [CheckoutController::class, 'paypalSuccess'])->name('paypal.success');
        Route::get('/checkout/paypal-cancel', [CheckoutController::class, 'paypalCancel'])->name('paypal.cancel');

        Route::get('/orders', [OrderPageController::class, 'index'])->name('client-order.index');
        Route::get('/orders/{order}', [OrderPageController::class, 'show'])->name('client-orders.show');
        Route::post('/orders/{order}/cancel', [OrderPageController::class, 'cancel'])->name('client-orders.cancel');
        Route::post('/orders/{order}/confirm', [OrderPageController::class, 'confirm'])->name('orders.confirm');
        Route::post('/orders/{order}/products/{product}/review', [OrderPageController::class, 'review'])->name('orders.review');
    });

    Route::middleware(['web','customer.guest'])->group(function () {
        Route::get('/login', [CustomerAuthController::class, 'showLogin'])
            ->name('client.login');
        Route::post('/login', [CustomerAuthController::class, 'login']);

        Route::get('/register', [CustomerAuthController::class, 'showRegisterForm'])
            ->name('client.register');
        Route::post('/register', [CustomerAuthController::class, 'register']);
    });

    Route::post('/logout', [CustomerAuthController::class, 'logout'])
        ->name('client.logout');
     Route::get('/logout', [CustomerAuthController::class, 'logout'])
        ->name('client.getLogout');
});