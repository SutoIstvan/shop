<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\AiSetting;
use App\Models\Category;
use App\Services\OpenAiService;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        $aiConfigured = app(OpenAiService::class)->isConfigured();

        return $schema
            ->components([
                Grid::make(3) // 3 колонки
                    ->columnSpanFull()
                    ->schema([

                        // 👈 ЛЕВАЯ ЧАСТЬ (2/3 ширины)
                        Grid::make(1)
                            ->columnSpan(2)
                            ->schema([

                                Section::make('Product Information')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('name')
                                                    ->required()
                                                    ->maxLength(255),

                                                TextInput::make('slug')
                                                    ->required()
                                                    ->unique(ignoreRecord: true)
                                                    ->maxLength(255),
                                            ]),

                                        Textarea::make('description')
                                            ->columnSpanFull()
                                            ->rows(6)
                                            ->hintActions(
                                                $aiConfigured
                                                    ? [static::getGenerateDescriptionAction()]
                                                    : []
                                            ),
                                    ]),

                                Section::make('Pricing & Inventory')
                                    ->schema([
                                        Grid::make(3)
                                            ->schema([
                                                TextInput::make('price')
                                                    ->required()
                                                    ->numeric()
                                                    ->prefix('$'),

                                                TextInput::make('compare_price')
                                                    ->numeric()
                                                    ->prefix('$')
                                                    ->label('Compare at Price'),

                                                TextInput::make('sku')
                                                    ->label('SKU')
                                                    ->unique(ignoreRecord: true)
                                                    ->maxLength(255),
                                            ]),

                                        TextInput::make('quantity')
                                            ->required()
                                            ->numeric()
                                            ->default(0),
                                    ]),

                                Section::make('Associations')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                Select::make('category_id')
                                                    ->label('Category')
                                                    ->relationship('category', 'name')
                                                    ->searchable()
                                                    ->preload(),

                                                Select::make('brand_id')
                                                    ->label('Brand')
                                                    ->relationship('brand', 'name')
                                                    ->searchable()
                                                    ->preload(),
                                            ]),
                                    ]),

                                Section::make('Status')
                                    ->schema([
                                        Grid::make(3)
                                            ->schema([
                                                Toggle::make('is_active')
                                                    ->label('Active')
                                                    ->default(true),

                                                Toggle::make('is_featured')
                                                    ->label('Featured')
                                                    ->default(false),

                                                Toggle::make('in_stock')
                                                    ->label('In Stock')
                                                    ->default(true),
                                            ]),
                                    ]),
                            ]),

                        // 👉 ПРАВАЯ ЧАСТЬ (1/3 ширины)
                        Grid::make(1)
                            ->columnSpan(1)
                            ->schema([
                                Section::make('Images')
                                    ->schema([
                                        FileUpload::make('images')
                                            ->image()
                                            ->multiple()
                                            ->maxFiles(10)
                                            ->reorderable()
                                            ->disk('public')
                                            ->visibility('public')
                                            ->directory('products'),
                                    ])
                                    ->headerActions(
                                        $aiConfigured
                                            ? [static::getEnhanceImageAction()]
                                            : []
                                    ),
                            ]),
                    ]),
            ]);
    }

    protected static function getGenerateDescriptionAction(): Action
    {
        return Action::make('generateDescription')
            ->label('AI Generate')
            ->icon('heroicon-o-sparkles')
            ->color('primary')
            ->action(function ($component, $set, $get) {
                $name = $get('name');

                if (! filled($name)) {
                    Notification::make()
                        ->warning()
                        ->title('Product name is required')
                        ->body('Please fill in the product name first before generating a description.')
                        ->send();

                    return;
                }

                $categoryName = null;
                $categoryId = $get('category_id');
                if (! empty($categoryId)) {
                    $categoryName = Category::find($categoryId)?->name;
                }

                $price = $get('price');

                try {
                    $service = app(OpenAiService::class);
                    $description = $service->generateProductDescription(
                        $name,
                        $categoryName,
                        $price ? (float) $price : null
                    );

                    $set('description', $description);

                    Notification::make()
                        ->success()
                        ->title('Description generated!')
                        ->body('AI-generated description has been added.')
                        ->send();
                } catch (\Throwable $e) {
                    Notification::make()
                        ->danger()
                        ->title('AI Generation Failed')
                        ->body($e->getMessage())
                        ->send();
                }
            });
    }

    protected static function getEnhanceImageAction(): Action
    {
        return Action::make('enhanceImage')
            ->label('AI Enhance')
            ->icon('heroicon-o-sparkles')
            ->color('primary')
            ->requiresConfirmation()
            ->modalHeading('Enhance Product Image')
            ->modalDescription('This will enhance the first uploaded image using AI (improve lighting, sharpen, clean background). This may take up to 60 seconds.')
            ->action(function ($component, $set, $get) {
                $images = $get('images') ?? [];

                if (empty($images)) {
                    Notification::make()
                        ->warning()
                        ->title('No images to enhance')
                        ->body('Please upload at least one image first.')
                        ->send();

                    return;
                }

                // Take the first image for enhancement
                $imagesList = is_array($images) ? array_values($images) : [$images];
                $firstImage = $imagesList[0];

                try {
                    $service = app(OpenAiService::class);
                    $newPath = $service->enhanceProductImage($firstImage);

                    // Replace the first image with the enhanced version
                    $keys = array_keys($images);
                    $images[$keys[0]] = $newPath;
                    $set('images', $images);

                    Notification::make()
                        ->success()
                        ->title('Image enhanced!')
                        ->body('The first product image has been enhanced using AI.')
                        ->send();
                } catch (\Throwable $e) {
                    Notification::make()
                        ->danger()
                        ->title('AI Enhancement Failed')
                        ->body($e->getMessage())
                        ->send();
                }
            });
    }
}