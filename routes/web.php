<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

use App\Models\Category;
use App\Models\Product;
use App\Models\Brand;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'categories' => Category::where('is_active', true)->whereNull('parent_id')->orderBy('sort_order')->take(4)->get(),
        'featuredProducts' => Product::with('category')->where('is_active', true)->where('is_featured', true)->take(4)->get(),
    ]);
})->name('home');

Route::get('/shop', function () {
    return Inertia::render('shop', [
        'products' => Product::with(['category', 'brand'])->where('is_active', true)->orderBy('created_at', 'desc')->get(),
        'categories' => Category::where('is_active', true)->orderBy('sort_order')->get(),
        'brands' => Brand::where('is_active', true)->get(),
        'initialCategory' => request()->query('category'),
    ]);
})->name('shop');

Route::get('/category/{slug}', function ($slug) {
    $category = Category::where('slug', $slug)->firstOrFail();
    return redirect()->route('shop', ['category' => $category->name]);
})->name('category.show');

Route::get('/product/{slug}', function ($slug) {
    $product = Product::with(['category', 'brand'])->where('slug', $slug)->firstOrFail();

    $relatedProducts = Product::with('category')
        ->where('is_active', true)
        ->where('id', '!=', $product->id)
        ->where('category_id', $product->category_id)
        ->take(4)
        ->get();

    $price = number_format($product->price, 0, '.', ' ');

    $firstImage = collect($product->images)->first();
    $ogImage = $firstImage
        ? asset('storage/' . $firstImage)
        : asset('images/og-default.jpg');

    return Inertia::render('product', [
        'product'         => $product,
        'relatedProducts' => $relatedProducts,

        'meta' => [
            'title'       => $product->name . ' — купити за ' . $price . ' грн | ' . config('app.name'),
            'description' => $product->name . ' за ' . $price . ' грн. '
                           . \Illuminate\Support\Str::limit(strip_tags($product->description ?? ''), 120)
                           . ' Доставка по Україні.',
            'og_image'    => $ogImage,
            'canonical'   => route('product.show', $product->slug),
        ],

        'schema' => [
            '@context'    => 'https://schema.org',
            '@type'       => 'Product',
            'name'        => $product->name,
            'sku'         => $product->sku,
            'description' => strip_tags($product->description ?? ''),
            'image'       => collect($product->images)
                                ->map(fn($img) => asset('storage/' . $img))
                                ->values()
                                ->toArray(),
            'brand' => [
                '@type' => 'Brand',
                'name'  => $product->brand?->name ?? config('app.name'),
            ],
            'offers' => [
                '@type'           => 'Offer',
                'price'           => (string) $product->price,
                'priceCurrency'   => 'UAH',
                'availability'    => $product->in_stock
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                'itemCondition'   => 'https://schema.org/NewCondition',
                'url'             => route('product.show', $product->slug),
                'priceValidUntil' => now()->addYear()->toDateString(),
            ],
        ],
    ]);
})->name('product.show');

Route::inertia('/cart', 'cart')->name('cart');
Route::inertia('/about', 'about')->name('about');
Route::inertia('/contact', 'contact')->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

Route::get('/private/{path}', function (string $path) {
    $filePath = storage_path('app/private/' . $path);
    if (! file_exists($filePath)) {
        abort(404);
    }
    return response()->file($filePath);
})->where('path', '.*');
