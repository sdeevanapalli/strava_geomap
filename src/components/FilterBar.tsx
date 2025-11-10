import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: ActivityFilters) => void;
}

export interface ActivityFilters {
  activityTypes: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Run', 'Ride', 'Walk']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const activityTypes = [
    { value: 'Run', label: 'Run', color: 'bg-orange-500' },
    { value: 'Ride', label: 'Ride', color: 'bg-blue-500' },
    { value: 'Walk', label: 'Walk', color: 'bg-green-500' },
  ];

  const toggleActivityType = (type: string) => {
    let newTypes: string[];
    if (selectedTypes.includes(type)) {
      newTypes = selectedTypes.filter(t => t !== type);
    } else {
      newTypes = [...selectedTypes, type];
    }
    setSelectedTypes(newTypes);
    onFilterChange({
      activityTypes: newTypes,
      dateRange: { start: startDate, end: endDate }
    });
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    onFilterChange({
      activityTypes: selectedTypes,
      dateRange: { start, end }
    });
  };

  const clearFilters = () => {
    setSelectedTypes(['Run', 'Ride', 'Walk']);
    setStartDate('');
    setEndDate('');
    onFilterChange({
      activityTypes: ['Run', 'Ride', 'Walk'],
      dateRange: { start: '', end: '' }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Type
          </label>
          <div className="flex flex-wrap gap-2">
            {activityTypes.map(type => (
              <button
                key={type.value}
                onClick={() => toggleActivityType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTypes.includes(type.value)
                    ? `${type.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, endDate)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-strava-orange focus:border-transparent text-sm"
              placeholder="Start date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(startDate, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-strava-orange focus:border-transparent text-sm"
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedTypes.length < 3 || startDate || endDate) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Active filters: 
            {selectedTypes.length < 3 && (
              <span className="ml-2 text-gray-900 font-medium">
                {selectedTypes.join(', ')}
              </span>
            )}
            {startDate && (
              <span className="ml-2 text-gray-900 font-medium">
                From {new Date(startDate).toLocaleDateString()}
              </span>
            )}
            {endDate && (
              <span className="ml-2 text-gray-900 font-medium">
                To {new Date(endDate).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}