<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Crypt;

class AiSetting extends Model
{
    protected $fillable = [
        'openai_key',
        'product_description_prompt',
        'product_image_prompt',
        'category_image_prompt',
        'product_example_image',
        'category_example_image',
        'model',
        'temperature',
    ];

    protected $casts = [
        'temperature' => 'float',
    ];

    protected function openaiKey(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? Crypt::decryptString($value) : null,
            set: fn ($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

}