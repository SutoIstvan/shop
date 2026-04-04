<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('images')
                    ->label('Image')
                    ->circular()
                    ->stacked()
                    ->limit(3),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                TextColumn::make('compare_price')
                    ->money('USD')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable(),
                TextColumn::make('quantity')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('brand.name')
                    ->label('Brand')
                    ->sortable()
                    ->searchable(),
                IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
                IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured')
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('in_stock')
                    ->boolean()
                    ->label('In Stock'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Category')
                    ->searchable()
                    ->preload(),
                SelectFilter::make('brand_id')
                    ->relationship('brand', 'name')
                    ->label('Brand')
                    ->searchable()
                    ->preload(),
                TernaryFilter::make('is_active')
                    ->label('Active'),
                TernaryFilter::make('is_featured')
                    ->label('Featured'),
                TernaryFilter::make('in_stock')
                    ->label('In Stock'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
