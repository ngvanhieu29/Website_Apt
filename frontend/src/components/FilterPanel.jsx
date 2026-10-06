import { useEffect, useRef, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

const PRICE_MIN = 0;
const PRICE_MAX = 50000000;
const PRICE_STEP = 500000;

export default function FilterPanel({
  filters,
  setFilters,
  districts,
  onReset,
  onApply,
  onClose,
}) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================
  // PRICE
  // =========================

  const getInitialPrice = () => {
    const min =
      filters.minPrice !== undefined && filters.minPrice !== ""
        ? Number(filters.minPrice)
        : PRICE_MIN;

    const max =
      filters.maxPrice !== undefined && filters.maxPrice !== ""
        ? Number(filters.maxPrice)
        : PRICE_MAX;

    return [
      Math.max(PRICE_MIN, Math.min(min, PRICE_MAX)),
      Math.max(PRICE_MIN, Math.min(max, PRICE_MAX)),
    ];
  };

  const [priceRange, setPriceRange] = useState(getInitialPrice);

  const [minPriceInput, setMinPriceInput] = useState(
    filters.minPrice ? Number(filters.minPrice).toLocaleString("vi-VN") : "",
  );

  const [maxPriceInput, setMaxPriceInput] = useState(
    filters.maxPrice ? Number(filters.maxPrice).toLocaleString("vi-VN") : "",
  );

  const [dragging, setDragging] = useState(null);

  const sliderRef = useRef(null);

  // Đồng bộ khi filters thay đổi từ bên ngoài
  useEffect(() => {
    const min =
      filters.minPrice !== undefined && filters.minPrice !== ""
        ? Number(filters.minPrice)
        : PRICE_MIN;

    const max =
      filters.maxPrice !== undefined && filters.maxPrice !== ""
        ? Number(filters.maxPrice)
        : PRICE_MAX;

    setPriceRange([
      Math.max(PRICE_MIN, Math.min(min, PRICE_MAX)),
      Math.max(PRICE_MIN, Math.min(max, PRICE_MAX)),
    ]);

    setMinPriceInput(
      filters.minPrice ? Number(filters.minPrice).toLocaleString("vi-VN") : "",
    );

    setMaxPriceInput(
      filters.maxPrice ? Number(filters.maxPrice).toLocaleString("vi-VN") : "",
    );
  }, [filters.minPrice, filters.maxPrice]);

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (value) => {
    return Number(value).toLocaleString("vi-VN");
  };

  const updatePriceInputs = (range) => {
    setMinPriceInput(range[0] === PRICE_MIN ? "" : formatPrice(range[0]));

    setMaxPriceInput(range[1] === PRICE_MAX ? "" : formatPrice(range[1]));
  };

  // =========================
  // COMMIT PRICE TO FILTER STATE
  // =========================

  const commitPrice = (range) => {
    let min = Number(range[0]);
    let max = Number(range[1]);

    min = Math.max(PRICE_MIN, Math.min(min, PRICE_MAX));
    max = Math.max(PRICE_MIN, Math.min(max, PRICE_MAX));

    if (min > max) {
      [min, max] = [max, min];
    }

    const newMin = min === PRICE_MIN ? "" : String(min);
    const newMax = max === PRICE_MAX ? "" : String(max);

    if (
      String(filters.minPrice || "") === newMin &&
      String(filters.maxPrice || "") === newMax
    ) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      minPrice: newMin,
      maxPrice: newMax,
    }));
  };

  // =========================
  // DRAG SLIDER
  // =========================

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();

      let percentage = (e.clientX - rect.left) / rect.width;

      percentage = Math.max(0, Math.min(1, percentage));

      let value = PRICE_MIN + percentage * (PRICE_MAX - PRICE_MIN);

      value = Math.round(value / PRICE_STEP) * PRICE_STEP;

      setPriceRange((prev) => {
        let newRange;

        if (dragging === "min") {
          newRange = [Math.min(value, prev[1] - PRICE_STEP), prev[1]];
        } else {
          newRange = [prev[0], Math.max(value, prev[0] + PRICE_STEP)];
        }

        updatePriceInputs(newRange);

        return newRange;
      });
    };

    const handlePointerUp = () => {
      setPriceRange((currentRange) => {
        commitPrice(currentRange);
        return currentRange;
      });

      setDragging(null);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);

      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging]);

  // =========================
  // HANDLE CLICK ON TRACK
  // =========================

  const handleTrackClick = (e) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();

    let percentage = (e.clientX - rect.left) / rect.width;

    percentage = Math.max(0, Math.min(1, percentage));

    let value = PRICE_MIN + percentage * (PRICE_MAX - PRICE_MIN);

    value = Math.round(value / PRICE_STEP) * PRICE_STEP;

    const distanceToMin = Math.abs(value - priceRange[0]);

    const distanceToMax = Math.abs(value - priceRange[1]);

    let newRange;

    if (distanceToMin <= distanceToMax) {
      newRange = [Math.min(value, priceRange[1] - PRICE_STEP), priceRange[1]];
    } else {
      newRange = [priceRange[0], Math.max(value, priceRange[0] + PRICE_STEP)];
    }

    setPriceRange(newRange);
    updatePriceInputs(newRange);
    commitPrice(newRange);
  };

  // =========================
  // INPUT MIN
  // =========================

  const handleMinInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    setMinPriceInput(raw ? Number(raw).toLocaleString("vi-VN") : "");
  };

  const commitMinInput = () => {
    let value = Number(minPriceInput.replace(/\D/g, ""));

    if (!Number.isFinite(value)) {
      value = PRICE_MIN;
    }

    value = Math.max(PRICE_MIN, Math.min(value, priceRange[1] - PRICE_STEP));

    const newRange = [value, priceRange[1]];

    setPriceRange(newRange);

    setMinPriceInput(value === PRICE_MIN ? "" : formatPrice(value));

    commitPrice(newRange);
  };

  // =========================
  // INPUT MAX
  // =========================

  const handleMaxInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    setMaxPriceInput(raw ? Number(raw).toLocaleString("vi-VN") : "");
  };

  const commitMaxInput = () => {
    let value = Number(maxPriceInput.replace(/\D/g, ""));

    if (!Number.isFinite(value)) {
      value = PRICE_MAX;
    }

    value = Math.min(PRICE_MAX, Math.max(value, priceRange[0] + PRICE_STEP));

    const newRange = [priceRange[0], value];

    setPriceRange(newRange);

    setMaxPriceInput(value === PRICE_MAX ? "" : formatPrice(value));

    commitPrice(newRange);
  };

  // =========================
  // RESET
  // =========================

  const handleReset = () => {
    setPriceRange([PRICE_MIN, PRICE_MAX]);

    setMinPriceInput("");
    setMaxPriceInput("");

    onReset();
  };

  const handleApply = () => {
    if (onApply) {
      onApply();
    }
  };

  const minPercent =
    ((priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const maxPercent =
    ((priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="sticky p-5 bg-white border shadow-sm top-24 rounded-2xl border-slate-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </h3>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
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

      {/* DISTRICT */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          District
        </label>

        <select
          value={filters.district || ""}
          onChange={(e) => handleChange("district", e.target.value)}
          className="text-sm input-field"
        >
          <option value="">All Districts</option>

          {districts?.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE */}
      <div className="mb-6">
        <label className="block mb-2 text-xs font-medium text-slate-500">
          Price (VND / month)
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Min"
            value={minPriceInput}
            onChange={handleMinInput}
            onBlur={commitMinInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="w-full text-sm text-center input-field"
          />

          <span className="shrink-0 text-slate-400">~</span>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Max"
            value={maxPriceInput}
            onChange={handleMaxInput}
            onBlur={commitMaxInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="w-full text-sm text-center input-field"
          />
        </div>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="relative h-6 mt-2 cursor-pointer touch-none"
          onPointerDown={(e) => {
            if (e.target === sliderRef.current) {
              handleTrackClick(e);
            }
          }}
        >
          <div className="absolute left-0 right-0 h-1 -translate-y-1/2 rounded-full top-1/2 bg-slate-300" />

          <div
            className="absolute h-1 -translate-y-1/2 rounded-full top-1/2 bg-primary-600"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          {/* MIN THUMB */}
          <button
            type="button"
            aria-label="Minimum price"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragging("min");
            }}
            className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 bg-white border-4 rounded-full shadow-sm top-1/2 cursor-grab border-primary-600 active:cursor-grabbing"
            style={{
              left: `${minPercent}%`,
            }}
          />

          {/* MAX THUMB */}
          <button
            type="button"
            aria-label="Maximum price"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragging("max");
            }}
            className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 bg-white border-4 rounded-full shadow-sm top-1/2 cursor-grab border-primary-600 active:cursor-grabbing"
            style={{
              left: `${maxPercent}%`,
            }}
          />
        </div>

        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>0 ₫</span>
          <span>50M ₫</span>
        </div>
      </div>

      {/* BEDROOMS */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          Bedrooms
        </label>

        <div className="flex flex-wrap gap-2">
          {[
            { value: "0", label: "Studio" },
            { value: "1", label: "1 Bedroom" },
            { value: "2", label: "2 Bedrooms" },
            { value: "3+", label: "3+ Bedrooms" },
          ].map(({ value, label }) => {
            const selected = Array.isArray(filters.bedrooms)
              ? filters.bedrooms.includes(value)
              : filters.bedrooms === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  const current = Array.isArray(filters.bedrooms)
                    ? filters.bedrooms
                    : filters.bedrooms
                      ? [filters.bedrooms]
                      : [];

                  const next = current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value];

                  handleChange("bedrooms", next);
                }}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  selected
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {Array.isArray(filters.bedrooms) && filters.bedrooms.length > 0 && (
          <button
            type="button"
            onClick={() => handleChange("bedrooms", [])}
            className="mt-2 text-xs font-medium text-slate-400 hover:text-primary-600"
          >
            Clear bedroom filter
          </button>
        )}
      </div>

      {/* BATHROOMS */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          Bathrooms
        </label>

        <div className="flex flex-wrap gap-2">
          {["", "1", "2", "3"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleChange("bathrooms", value)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                filters.bathrooms === value
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
              }`}
            >
              {value === "" ? "Any" : value}
            </button>
          ))}
        </div>
      </div>

      {/* AREA */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
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

      {/* OCCUPANTS */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
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

      {/* CHECKBOXES */}
      <div className="space-y-3">
        {/* GYM */}
        <label className="flex cursor-pointer items-center gap-2.5">
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

        {/* PET */}
        <label className="flex cursor-pointer items-center gap-2.5">
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

        {/* POOL */}
        <label className="flex cursor-pointer items-center gap-2.5">
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

      {/* APPLY BUTTON */}
      <div className="pt-5 mt-5 border-t border-slate-100">
        <button
          type="button"
          onClick={handleApply}
          className="w-full px-4 py-3 text-sm font-semibold text-white transition rounded-xl bg-primary-600 hover:bg-primary-700"
        >
          Apply Filters
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 mt-2 text-sm font-medium transition rounded-xl text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
