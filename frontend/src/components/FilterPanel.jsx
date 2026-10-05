import { Search, X, SlidersHorizontal } from "lucide-react";

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
    <div className="sticky p-5 bg-white border shadow-sm rounded-2xl border-slate-100 top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </h3>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
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
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Address, district..."
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            className="pl-10 text-sm input-field"
          />
        </div>
      </div>

      {/* District */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          District
        </label>

        <select
          value={filters.district || ""}
          onChange={(e) => handleChange("district", e.target.value)}
          className="text-sm input-field"
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
            value={filters.minPrice || ""}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="text-sm input-field"
          />

          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="text-sm input-field"
          />
        </div>
      </div>

      {/* Bedrooms */}

      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Bedrooms
        </label>

        <div className="flex flex-wrap gap-2">
          {[
            { value: "", label: "Any" },
            { value: "0", label: "Studio" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3+" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleChange("bedrooms", value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                filters.bedrooms === value
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary-300"
              }`}
            >
              {label}
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
          {["", "1", "2", "3"].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleChange("bathrooms", val)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                filters.bathrooms === val
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary-300"
              }`}
            >
              {val === "" ? "Any" : val}
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
            value={filters.minArea || ""}
            onChange={(e) => handleChange("minArea", e.target.value)}
            className="text-sm input-field"
          />

          <input
            type="number"
            placeholder="Max"
            value={filters.maxArea || ""}
            onChange={(e) => handleChange("maxArea", e.target.value)}
            className="text-sm input-field"
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
          value={filters.maxOccupants || ""}
          onChange={(e) => handleChange("maxOccupants", e.target.value)}
          className="text-sm input-field"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        {/* Gym */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.gym === "true"}
            onChange={(e) =>
              handleChange("gym", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">Gym</span>
        </label>

        {/* Pet Friendly */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.petFriendly === "true"}
            onChange={(e) =>
              handleChange("petFriendly", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">Pet Friendly</span>
        </label>

        {/* Pool */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.pool === "true"}
            onChange={(e) =>
              handleChange("pool", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">Pool</span>
        </label>
      </div>
    </div>
  );
}
