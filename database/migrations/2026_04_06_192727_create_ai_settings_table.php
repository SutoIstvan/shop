<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_settings', function (Blueprint $table) {
            $table->id();

            // OpenAI key
            $table->text('openai_key')->nullable();

            // prompts
            $table->text('product_description_prompt')->nullable();
            $table->text('product_image_prompt')->nullable();
            $table->text('category_image_prompt')->nullable();

            // reference images (1 per type)
            $table->string('product_example_image')->nullable();
            $table->string('category_example_image')->nullable();

            // generation settings
            $table->string('model')->default('gpt-4o-mini');
            $table->float('temperature')->default(0.7);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_settings');
    }
};