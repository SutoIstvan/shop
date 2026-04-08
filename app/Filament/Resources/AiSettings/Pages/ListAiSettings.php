<?php

namespace App\Filament\Resources\AiSettings\Pages;

use App\Filament\Resources\AiSettings\AiSettingResource;
use App\Models\AiSetting;
use Filament\Resources\Pages\ListRecords;

class ListAiSettings extends ListRecords
{
    protected static string $resource = AiSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function mount(): void
    {
        $record = AiSetting::first();

        if ($record) {
            $this->redirect(
                AiSettingResource::getUrl('edit', ['record' => $record])
            );
        } else {
            $this->redirect(
                AiSettingResource::getUrl('create')
            );
        }
    }
}