import { Settings } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  onActivityLimitChange: (limit: number) => void;
  currentLimit: number;
}

export default function SettingsPanel({ onActivityLimitChange, currentLimit }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const limits = [
    { value: 50, label: '50 activities' },
    { value: 100, label: '100 activities' },
    { value: 200, label: '200 activities' },
    { value: 500, label: '500 activities' },
    { value: 1000, label: '1000 activities' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Activity Fetch Limit
              </h3>
              <div className="space-y-2">
                {limits.map(limit => (
                  <button
                    key={limit.value}
                    onClick={() => {
                      onActivityLimitChange(limit.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentLimit === limit.value
                        ? 'bg-strava-orange text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {limit.label}
                    {currentLimit === limit.value && ' ✓'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Higher limits may take longer to load
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}