<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'compare_price',
        'sku',
        'quantity',
        'category_id',
        'brand_id',
        'images',
        'is_active',
        'is_featured',
        'in_stock',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'images' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'in_stock' => 'boolean',
        ];
    }

    /**
     * Get the category that the product belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the brand that the product belongs to.
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
