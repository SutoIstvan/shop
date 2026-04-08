<?php

namespace App\Services;

use App\Models\AiSetting;
use OpenAI;
use OpenAI\Client;

class OpenAiService
{
    protected ?AiSetting $settings = null;

    public function getSettings(): ?AiSetting
    {
        if ($this->settings === null) {
            $this->settings = AiSetting::first();
        }

        return $this->settings;
    }

    public function isConfigured(): bool
    {
        $settings = $this->getSettings();

        return $settings && filled($settings->openai_key);
    }

    public function client(): Client
    {
        $settings = $this->getSettings();

        if (! $settings || ! filled($settings->openai_key)) {
            throw new \RuntimeException('OpenAI API key is not configured. Please set it in AI Settings.');
        }

        return OpenAI::factory()
            ->withApiKey($settings->openai_key)
            ->withHttpClient(new \GuzzleHttp\Client(['timeout' => 120]))
            ->make();
    }

    public function generateProductDescription(string $productName, ?string $categoryName = null, ?float $price = null): string
    {
        $settings = $this->getSettings();
        $model = $settings->model ?? 'gpt-4o-mini';
        $temperature = $settings->temperature ?? 0.7;

        $systemPrompt = $settings->product_description_prompt
            ?? 'You are a professional e-commerce copywriter. Write compelling, SEO-friendly product descriptions. Keep it concise (2-3 paragraphs). Write in the same language as the product name.';

        $userMessage = "Write a product description for: \"{$productName}\"";
        if ($categoryName) {
            $userMessage .= "\nCategory: {$categoryName}";
        }
        if ($price) {
            $userMessage .= "\nPrice: \${$price}";
        }

        $response = $this->client()->chat()->create([
            'model' => $model,
            'temperature' => $temperature,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userMessage],
            ],
        ]);

        return trim($response->choices[0]->message->content);
    }

    public function enhanceProductImage(string $imagePath): string
    {
        $settings = $this->getSettings();

        $prompt = $settings->product_image_prompt
            ?? 'Enhance this product image: improve lighting, make the background clean white, increase sharpness and make it look professional for an e-commerce store.';

        $absolutePath = storage_path("app/public/{$imagePath}");

        if (! file_exists($absolutePath)) {
            throw new \RuntimeException("Image file not found: {$absolutePath}");
        }

        $response = $this->client()->images()->edit([
            'model' => 'gpt-image-1',
            'image' => [fopen($absolutePath, 'r')],
            'prompt' => $prompt,
        ]);

        // Property is b64_json (with underscore)
        $b64 = $response->data[0]->b64_json;

        if (empty($b64) && ! empty($response->data[0]->url)) {
            // If b64_json is empty, download from URL
            $imageData = file_get_contents($response->data[0]->url);
        } else {
            $imageData = base64_decode($b64);
        }

        $newFilename = 'products/ai_' . time() . '_' . basename($imagePath);
        $newPath = storage_path("app/public/{$newFilename}");

        // Ensure directory exists
        $dir = dirname($newPath);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($newPath, $imageData);

        return $newFilename;
    }
}
