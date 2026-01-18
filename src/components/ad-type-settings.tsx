'use client'
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface AdTypeSettingsProps {
  adType: string;
  settings: {
    show: boolean;
    slot: string;
    format: string;
    fullWidth: boolean;
    frequency?: number;
    count?: number;
  };
  onSettingsChange: (newSettings: any) => void;
}

export function AdTypeSettings({ adType, settings, onSettingsChange }: AdTypeSettingsProps) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-2 border-b border-gray-200 pb-4 mb-4">
      <h3 className="text-lg font-semibold text-white capitalize">{adType} Ads</h3>
      <div className="flex items-center justify-between">
        <Label htmlFor={`show-${adType}-ads`} className="text-white">Show {adType} Ads</Label>
        <Switch
          id={`show-${adType}-ads`}
          checked={settings.show}
          onCheckedChange={(checked) => updateSetting('show', checked)}
          className="bg-gray-500"
        />
      </div>
      {settings.frequency !== undefined && (
        <div className="flex flex-col space-y-2">
          <Label htmlFor={`${adType}-ad-frequency`} className="text-white">Ad Frequency</Label>
          <Input
            id={`${adType}-ad-frequency`}
            type="number"
            value={settings.frequency}
            onChange={(e) => updateSetting('frequency', parseInt(e.target.value))}
            placeholder="Enter frequency"
            className="border-gray-300"
          />
        </div>
      )}
      {adType === "sidebar" && (
        <div>
          <Label htmlFor={`${adType}_ad_count`} className="text-white">
            {adType.charAt(0).toUpperCase() + adType.slice(1)} Ad Count
          </Label>
          <Input
            id={`${adType}_ad_count`}
            type="number"
            value={settings.count || 0}
            onChange={(e) =>
              onSettingsChange({ ...settings, count: parseInt(e.target.value, 10) || 0 })
            }
            placeholder="Enter ad count"
            className="border-gray-300"
          />
        </div>
      )}
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`${adType}-ad-slot`} className="text-white">Ad Slot</Label>
        <Input
          id={`${adType}-ad-slot`}
          value={settings.slot}
          onChange={(e) => updateSetting('slot', e.target.value)}
          placeholder="Enter ad slot"
          className="border-gray-300"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`${adType}-ad-format`} className="text-white">Ad Format</Label>
        <Input
          id={`${adType}-ad-format`}
          value={settings.format}
          onChange={(e) => updateSetting('format', e.target.value)}
          placeholder="Enter ad format"
          className="border-gray-300"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor={`${adType}-ad-full-width`} className="text-white">Ad Full Width</Label>
        <Switch
          id={`${adType}-ad-full-width`}
          checked={settings.fullWidth}
          onCheckedChange={(checked) => updateSetting('fullWidth', checked)}
          className="bg-gray-500"
        />
      </div>
    </div>
  );
}