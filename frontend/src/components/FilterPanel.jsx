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
    filters.minPrice
      ? Number(filters.minPrice).toLocaleString("vi-VN")
      : ""
  );

  const [maxPriceInput, setMaxPriceInput] = useState(
    filters.maxPrice
      ? Number(filters.maxPrice).toLocaleString("vi-VN")
      : ""
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
      filters.minPrice
        ? Number(filters.minPrice).toLocaleString("vi-VN")
        : ""
    );

    setMaxPriceInput(
      filters.maxPrice
        ? Number(filters.maxPrice).toLocaleString("vi-VN")
        : ""
    );
  }, [filters.minPrice, filters.maxPrice]);

  // =========================
  // FORMAT PRICE
  // =========================
  const formatPrice = (value) => {
    return Number(value).toLocaleString("vi-VN");
  };
const updatePriceInputs = (range) => {
  setMinPriceInput(
    range[0] === PRICE_MIN
      ? ""
      : formatPrice(range[0])
  );

  setMaxPriceInput(
    range[1] === PRICE_MAX
      ? ""
      : formatPrice(range[1])
  );
};
  // =========================
  // COMMIT PRICE
  // Chỉ gọi API khi thả chuột
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
  // =========================
// DRAG SLIDER
// =========================
useEffect(() => {
  if (!dragging) return;

  const handlePointerMove = (e) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();

    let percentage =
      (e.clientX - rect.left) / rect.width;

    percentage = Math.max(0, Math.min(1, percentage));

    let value =
      PRICE_MIN +
      percentage * (PRICE_MAX - PRICE_MIN);

    value =
      Math.round(value / PRICE_STEP) * PRICE_STEP;

    setPriceRange((prev) => {
      let newRange;

      if (dragging === "min") {
        newRange = [
          Math.min(value, prev[1] - PRICE_STEP),
          prev[1],
        ];
      } else {
        newRange = [
          prev[0],
          Math.max(value, prev[0] + PRICE_STEP),
        ];
      }

      // Cập nhật số trong 2 ô ngay khi kéo
      updatePriceInputs(newRange);

      return newRange;
    });
  };

  const handlePointerUp = () => {
    setPriceRange((currentRange) => {
      // Chỉ lúc thả chuột mới chạy query
      commitPrice(currentRange);

      return currentRange;
    });

    setDragging(null);
  };

  document.addEventListener(
    "pointermove",
    handlePointerMove
  );

  document.addEventListener(
    "pointerup",
    handlePointerUp
  );

  return () => {
    document.removeEventListener(
      "pointermove",
      handlePointerMove
    );

    document.removeEventListener(
      "pointerup",
      handlePointerUp
    );
  };
}, [dragging]);

  // =========================
  // HANDLE CLICK ON TRACK
  // =========================
  const handleTrackClick = (e) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();

    let percentage =
      (e.clientX - rect.left) / rect.width;

    percentage = Math.max(0, Math.min(1, percentage));

    let value =
      PRICE_MIN +
      percentage * (PRICE_MAX - PRICE_MIN);

    value =
      Math.round(value / PRICE_STEP) * PRICE_STEP;

    const distanceToMin = Math.abs(
      value - priceRange[0]
    );

    const distanceToMax = Math.abs(
      value - priceRange[1]
    );

    let newRange;

    if (distanceToMin <= distanceToMax) {
      newRange = [
        Math.min(value, priceRange[1] - PRICE_STEP),
        priceRange[1],
      ];
    } else {
      newRange = [
        priceRange[0],
        Math.max(value, priceRange[0] + PRICE_STEP),
      ];
    }

    setPriceRange(newRange);
    commitPrice(newRange);
  };

  // =========================
  // INPUT MIN
  // =========================
  const handleMinInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    setMinPriceInput(
      raw ? Number(raw).toLocaleString("vi-VN") : ""
    );
  };

  const commitMinInput = () => {
    let value = Number(
      minPriceInput.replace(/\D/g, "")
    );

    if (!Number.isFinite(value)) {
      value = PRICE_MIN;
    }

    value = Math.max(
      PRICE_MIN,
      Math.min(value, priceRange[1] - PRICE_STEP)
    );

    const newRange = [
      value,
      priceRange[1],
    ];

    setPriceRange(newRange);

    setMinPriceInput(
      value === PRICE_MIN
        ? ""
        : formatPrice(value)
    );

    commitPrice(newRange);
  };

  // =========================
  // INPUT MAX
  // =========================
  const handleMaxInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    setMaxPriceInput(
      raw ? Number(raw).toLocaleString("vi-VN") : ""
    );
  };

  const commitMaxInput = () => {
    let value = Number(
      maxPriceInput.replace(/\D/g, "")
    );

    if (!Number.isFinite(value)) {
      value = PRICE_MAX;
    }

    value = Math.min(
      PRICE_MAX,
      Math.max(value, priceRange[0] + PRICE_STEP)
    );

    const newRange = [
      priceRange[0],
      value,
    ];

    setPriceRange(newRange);

    setMaxPriceInput(
      value === PRICE_MAX
        ? ""
        : formatPrice(value)
    );

    commitPrice(newRange);
  };

  // =========================
  // RESET PRICE
  // =========================
  const handleReset = () => {
    setPriceRange([
      PRICE_MIN,
      PRICE_MAX,
    ]);

    setMinPriceInput("");
    setMaxPriceInput("");

    onReset();
  };

  const minPercent =
    ((priceRange[0] - PRICE_MIN) /
      (PRICE_MAX - PRICE_MIN)) *
    100;

  const maxPercent =
    ((priceRange[1] - PRICE_MIN) /
      (PRICE_MAX - PRICE_MIN)) *
    100;

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          Search
        </label>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Address, district..."
            value={filters.search || ""}
            onChange={(e) =>
              handleChange(
                "search",
                e.target.value
              )
            }
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      {/* District */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          District
        </label>

        <select
          value={filters.district || ""}
          onChange={(e) =>
            handleChange(
              "district",
              e.target.value
            )
          }
          className="input-field text-sm"
        >
          <option value="">
            All Districts
          </option>

          {districts?.map((district) => (
            <option
              key={district}
              value={district}
            >
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* =========================
          PRICE
      ========================= */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-medium text-slate-500">
          Price (VND / month)
        </label>

       

        {/* Min / Max */}
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
            className="input-field w-full text-center text-sm"
          />

          <span className="shrink-0 text-slate-400">
            ~
          </span>

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
            className="input-field w-full text-center text-sm"
          />
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="relative mt-2 h-6 cursor-pointer touch-none"
          onPointerDown={(e) => {
            if (
              e.target === sliderRef.current
            ) {
              handleTrackClick(e);
            }
          }}
        >
          {/* Background */}
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-300" />

          {/* Active range */}
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary-600"
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
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-4 border-primary-600 bg-white shadow-sm active:cursor-grabbing"
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
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-4 border-primary-600 bg-white shadow-sm active:cursor-grabbing"
            style={{
              left: `${maxPercent}%`,
            }}
          />
        </div>

        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>0 ₫</span>
          <span>50M ₫</span>
        </div>
      </div>


     {/* Bedrooms */}
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

      {/* Bathrooms */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          Bathrooms
        </label>

        <div className="flex flex-wrap gap-2">
          {["", "1", "2", "3"].map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  handleChange(
                    "bathrooms",
                    value
                  )
                }
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  filters.bathrooms === value
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
                }`}
              >
                {value === ""
                  ? "Any"
                  : value}
              </button>
            )
          )}
        </div>
      </div>

      {/* Area */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          Area (m²)
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minArea || ""}
            onChange={(e) =>
              handleChange(
                "minArea",
                e.target.value
              )
            }
            className="input-field text-sm"
          />

          <input
            type="number"
            placeholder="Max"
            value={filters.maxArea || ""}
            onChange={(e) =>
              handleChange(
                "maxArea",
                e.target.value
              )
            }
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Max occupants */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          Min. Occupants
        </label>

        <input
          type="number"
          placeholder="e.g. 2"
          value={filters.maxOccupants || ""}
          onChange={(e) =>
            handleChange(
              "maxOccupants",
              e.target.value
            )
          }
          className="input-field text-sm"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">

        {/* Gym */}
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={
              filters.gym === "true"
            }
            onChange={(e) =>
              handleChange(
                "gym",
                e.target.checked
                  ? "true"
                  : ""
              )
            }
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">
            Gym
          </span>
        </label>

        {/* Pet Friendly */}
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={
              filters.petFriendly === "true"
            }
            onChange={(e) =>
              handleChange(
                "petFriendly",
                e.target.checked
                  ? "true"
                  : ""
              )
            }
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">
            Pet Friendly
          </span>
        </label>

        {/* Pool */}
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={
              filters.pool === "true"
            }
            onChange={(e) =>
              handleChange(
                "pool",
                e.target.checked
                  ? "true"
                  : ""
              )
            }
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />

          <span className="text-sm text-slate-700">
            Pool
          </span>
        </label>

      </div>
    </div>
  );
}