<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriesData = [
            ['name' => 'Кофе'],
            ['name' => 'Шоколад'],
            ['name' => 'Сыр'],
            ['name' => 'Продукты питания'],
        ];

        $brandsData = [
            'Кофе' => ['Lavazza', 'Illy', 'Jacobs'],
            'Шоколад' => ['Milka', 'Lindt', 'Ritter Sport'],
            'Сыр' => ['President', 'Hochland', 'Galbani'],
            'Продукты питания' => ['Barilla', 'Knorr', 'Heinz'],
        ];

        $productsData = [
            'Кофе' => [
                'Lavazza Qualita Oro (Зерно)', 'Lavazza Crema e Gusto', 'Lavazza Espresso', 'Lavazza Dek',
                'Illy Classico', 'Illy Intenso', 'Illy Decaffeinato',
                'Jacobs Monarch', 'Jacobs Kronung', 'Jacobs Barista',
            ],
            'Шоколад' => [
                'Milka Alpine Milk', 'Milka Hazelnut', 'Milka Strawberry',
                'Lindt Excellence 70%', 'Lindt Excellence 85%', 'Lindt Lindor',
                'Ritter Sport Marzipan', 'Ritter Sport Alpine Milk', 'Ritter Sport Whole Hazelnuts', 'Ritter Sport Peppermint'
            ],
            'Сыр' => [
                'President Camembert', 'President Brie', 'President Myzithra',
                'Hochland Almette', 'Hochland Processed Cheese', 'Hochland Cheddar',
                'Galbani Mozzarella', 'Galbani Ricotta', 'Galbani Mascarpone', 'Galbani Gorgonzola'
            ],
            'Продукты питания' => [
                'Barilla Spaghetti', 'Barilla Penne Rigate', 'Barilla Pesto Genovese',
                'Knorr Chicken Bouillon', 'Knorr Mushroom Soup', 'Knorr Tomato Soup',
                'Heinz Tomato Ketchup', 'Heinz Mayonnaise', 'Heinz Baked Beans', 'Heinz Mustard'
            ],
        ];

        foreach ($categoriesData as $catData) {
            $catSlug = Str::slug($catData['name']) ?: Str::random(10);
            
            $category = Category::firstOrCreate(
                ['name' => $catData['name']],
                [
                    'slug' => $catSlug,
                    'description' => 'Отборные товары из категории ' . $catData['name'],
                    'is_active' => true,
                ]
            );

            $brandModels = [];
            foreach ($brandsData[$catData['name']] as $brandName) {
                $brandSlug = Str::slug($brandName) ?: Str::random(10);
                
                $brand = Brand::firstOrCreate(
                    ['name' => $brandName],
                    [
                        'slug' => $brandSlug,
                        'description' => 'Описание бренда ' . $brandName,
                        'is_active' => true,
                    ]
                );
                $brandModels[] = $brand;
            }

            foreach ($productsData[$catData['name']] as $index => $productName) {
                $brand = $brandModels[$index % count($brandModels)];
                $productSlug = Str::slug($productName) ?: Str::random(12);

                Product::firstOrCreate(
                    ['name' => $productName],
                    [
                        'slug' => $productSlug . '-' . Str::random(4),
                        'description' => 'Отличное качество: ' . $productName,
                        'price' => rand(300, 5000),
                        'compare_price' => rand(5100, 7500),
                        'sku' => strtoupper(Str::random(8)),
                        'quantity' => rand(10, 100),
                        'category_id' => $category->id,
                        'brand_id' => $brand->id,
                        'is_active' => true,
                        'is_featured' => rand(0, 1) == 1,
                        'in_stock' => true,
                    ]
                );
            }
        }
    }
}
