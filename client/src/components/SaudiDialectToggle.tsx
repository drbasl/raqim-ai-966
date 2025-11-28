import React from 'react';

interface Props {
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
}

export default function SaudiDialectToggle({ isEnabled, onToggle }: Props) {
  return (
    <div className="flex items-center justify-end gap-4 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg shadow-sm">
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer"
          checked={isEnabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-600"></div>
      </label>
      <span className="text-sm font-bold text-green-800 flex items-center gap-2">
        <span className="text-xl">🇸🇦</span>
        تفعيل اللهجة السعودية الذكية
      </span>
    </div>
  );
}
