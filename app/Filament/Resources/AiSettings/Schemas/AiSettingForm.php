<?php

namespace App\Filament\Resources\AiSettings\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class AiSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('openai_key')
                    ->columnSpanFull(),
                Textarea::make('product_description_prompt')
                    ->columnSpanFull(),
                Textarea::make('product_image_prompt')
                    ->columnSpanFull(),
                Textarea::make('category_image_prompt')
                    ->columnSpanFull(),
                FileUpload::make('product_example_image')
                    ->image(),
                FileUpload::make('category_example_image')
                    ->image(),
                TextInput::make('model')
                    ->required()
                    ->default('gpt-4o-mini'),
                TextInput::make('temperature')
                    ->required()
                    ->numeric()
                    ->default(0.7),
            ]);
    }
}
