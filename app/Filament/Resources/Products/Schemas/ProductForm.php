<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Brand;
use App\Models\Category;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
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
                            ->rows(4),
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

                Section::make('Images')
                    ->schema([
                        FileUpload::make('images')
                            ->image()
                            ->multiple()
                            ->maxFiles(10)
                            ->reorderable()
                            ->disk('public') 
                            ->visibility('public')
                            ->directory('products')
                            ->columnSpanFull(),
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
            ]);
    }
}
