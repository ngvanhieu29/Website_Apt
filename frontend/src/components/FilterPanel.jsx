import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function FilterPanel({
  filters,
  setFilters,
  districts,
  onReset,
}) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </h3>

        <button
          onClick={onReset}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Search
        </label>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="Address, district..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      {/* District */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          District
        </label>

        <select
          value={filters.district || ''}
          onChange={(e) => handleChange('district', e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All Districts</option>

          {districts?.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Price (VND / month)
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input-field text-sm"
          />

          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Bedrooms
        </label>

        <div className="flex flex-wrap gap-2">
          {['', '1', '2', '3'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleChange('bedrooms', val)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                filters.bedrooms === val
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
              }`}
            >
              {val === '' ? 'Any' : val}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Bathrooms
        </label>

        <div className="flex flex-wrap gap-2">
          {['', '1', '2', '3'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleChange('bathrooms', val)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                filters.bathrooms === val
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
              }`}
            >
              {val === '' ? 'Any' : val}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Area (m²)
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minArea || ''}
            onChange={(e) => handleChange('minArea', e.target.value)}
            className="input-field text-sm"
          />

          <input
            type="number"
            placeholder="Max"
            value={filters.maxArea || ''}
            onChange={(e) => handleChange('maxArea', e.target.value)}
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Max occupants */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Min. Occupants
        </label>

        <input
          type="number"
          placeholder="e.g. 2"
          value={filters.maxOccupants || ''}
          onChange={(e) =>
            handleChange('maxOccupants', e.target.value)
          }
          className="input-field text-sm"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        {/* Gym */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.gym === 'true'}
            onChange={(e) =>
              handleChange(
                'gym',
                e.target.checked ? 'true' : ''
              )
            }
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">
            Gym
          </span>
        </label>

        {/* Pet Friendly */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.petFriendly === 'true'}
            onChange={(e) =>
              handleChange(
                'petFriendly',
                e.target.checked ? 'true' : ''
              )
            }
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">
            Pet Friendly
          </span>
        </label>

        {/* Pool */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.pool === 'true'}
            onChange={(e) =>
              handleChange(
                'pool',
                e.target.checked ? 'true' : ''
              )
            }
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">
            Pool
          </span>
        </label>
      </div>
    </div>
  );
}