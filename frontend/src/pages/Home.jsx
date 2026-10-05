import { useRef, useEffect, useState, useCallback } from "react";

import { fetchApartments, fetchDistricts } from "../api/apartments";

import ApartmentCard from "../components/ApartmentCard";

import FilterPanel from "../components/FilterPanel";

import { Search, Loader2 } from "lucide-react";

import TravelGuide from "../components/TravelGuide";

import Facilities from "../components/Facilities";

/* =========================================================
   DEFAULT FILTERS
========================================================= */

const defaultFilters = {
  search: "",
  district: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  minArea: "",
  maxArea: "",
  maxOccupants: "",
  pool: "",
  petFriendly: "",
  gym: "",
  sort: "price",
};

export default function Home() {
  /* =======================================================
     STATE
  ======================================================= */

  const [apartments, setApartments] = useState([]);

  const [districts, setDistricts] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [loading, setLoading] = useState(true);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const itemsPerPage = 9;

  const apartmentSectionRef = useRef(null);

  /* =======================================================
     LOAD APARTMENTS
  ======================================================= */

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      /* ===============================================
           FILTERS
        =============================================== */

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params[key] = value;
        }
      });

      /* ===============================================
           API
        =============================================== */

      const data = await fetchApartments(params);

      /* ===============================================
           APARTMENTS
        =============================================== */

      const apartmentList = Array.isArray(data?.apartments)
        ? data.apartments
        : [];

      setApartments(apartmentList);

      /* ===============================================
           PAGINATION
        =============================================== */

      const paginationData = data?.pagination;

      setPagination(
        paginationData || {
          page: currentPage,
          limit: itemsPerPage,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      );

      /* ===============================================
           BACKEND CÓ THỂ TRẢ VỀ PAGE CUỐI
           NẾU CURRENT PAGE KHÔNG CÒN TỒN TẠI
        =============================================== */

      if (paginationData?.page && paginationData.page !== currentPage) {
        setCurrentPage(paginationData.page);
      }
    } catch (err) {
      console.error("Error loading apartments:", err);

      setApartments([]);

      setPagination({
        page: 1,
        limit: itemsPerPage,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  /* =======================================================
     LOAD DISTRICTS
  ======================================================= */

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await fetchDistricts();

        setDistricts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading districts:", err);

        setDistricts([]);
      }
    };

    loadDistricts();
  }, []);

  /* =======================================================
     LOAD APARTMENTS WHEN FILTERS / PAGE CHANGE
  ======================================================= */

  useEffect(() => {
    const timer = setTimeout(
      () => {
        loadData();
      },
      filters.search.trim() ? 350 : 0,
    );

    return () => clearTimeout(timer);
  }, [loadData, filters.search]);

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setFilters({
      ...defaultFilters,
    });

    setCurrentPage(1);
  };

  /* =======================================================
     RESET PAGE WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.search,
    filters.district,
    filters.minPrice,
    filters.maxPrice,
    filters.bedrooms,
    filters.bathrooms,
    filters.minArea,
    filters.maxArea,
    filters.maxOccupants,
    filters.pool,
    filters.petFriendly,
    filters.gym,
    filters.sort,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = pagination.totalPages;

  /* =======================================================
     VISIBLE PAGE NUMBERS
  ======================================================= */

  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));

  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const visiblePages = [];

  for (let page = startPage; page <= endPage; page++) {
    visiblePages.push(page);
  }

  /* =======================================================
     CHANGE PAGE
  ======================================================= */

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);

    setTimeout(() => {
      apartmentSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div>
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden text-white font-playfair bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600"
            alt=""
            className="object-cover w-full h-full"
          />
        </div>

        <div className="relative px-4 py-20 mx-auto text-center max-w-7xl sm:px-6 lg:px-8 md:py-28">
          <h1 className="mb-4 text-4xl font-bold leading-tight font-display md:text-5xl lg:text-6xl">
            Find Your Perfect Home
            <br />
            <span className="text-primary-300">in Da Nang</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl text-slate-300">
            Curated premium apartments for expatriates. Modern, comfortable, and
            ready to move in.
          </p>

          {/* Quick search */}

          <div className="flex max-w-xl gap-2 mx-auto">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search by district, address..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <section
        ref={apartmentSectionRef}
        className="px-4 mx-auto my-8 max-w-7xl sm:px-6 lg:px-8 md:py-10"
      >
        {/* ==================================================
            TITLE + SORT
        ================================================== */}

        <div className="flex flex-col gap-4 my-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}

          <div>
            <h2 className="text-xl font-semibold uppercase font-playfair lg:pb-2 text-slate-900 xl:text-2xl">
              Apartment
            </h2>

            <p className="text-[16px] text-slate-500 mt-0.5">
              Available for rent: {loading ? "Loading..." : pagination.total}
            </p>
          </div>

          {/* Sort + Filter */}

          <div className="flex items-center w-full gap-3 sm:w-auto">
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sort: e.target.value,
                }))
              }
              className="text-sm input-field sm:flex-none sm:w-auto"
            >
              <option value="price">Price: Low to High</option>

              <option value="price-desc">Price: High to Low</option>

              <option value="area">Largest Area</option>

              <option value="newest">Newest</option>
            </select>

            {/* Mobile filter button */}

            <button
              className="md:hidden btn-outline text-sm flex items-center gap-1.5 shrink-0"
              onClick={() => setMobileFilterOpen(true)}
            >
              Filters
            </button>
          </div>
        </div>

        {/* ==================================================
            FILTER + APARTMENTS
        ================================================== */}

        <div className="flex gap-8">
          {/* Desktop filter */}

          <aside className="hidden md:block w-72 shrink-0">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              districts={districts}
              onReset={resetFilters}
            />
          </aside>

          {/* Apartment grid */}

          <div className="flex-1">
            {loading ? (
              /* ============================================
                 LOADING
              ============================================ */

              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : apartments.length === 0 ? (
              /* ============================================
                 NO RESULT
              ============================================ */

              <div className="py-32 text-center">
                <p className="text-lg text-slate-500">
                  No apartments match your filters.
                </p>

                <button onClick={resetFilters} className="mt-4 btn-primary">
                  Reset Filters
                </button>
              </div>
            ) : (
              /* ============================================
                 APARTMENT CARDS
              ============================================ */

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {apartments.map((apt) => (
                  <ApartmentCard key={apt._id} apartment={apt} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {/* Previous */}

            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>

            {/* Visible pages */}

            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 text-sm rounded-lg border transition ${
                  currentPage === page
                    ? "bg-primary-600 text-white border-primary-600"
                    : "hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page */}

            {endPage < totalPages && (
              <>
                <span className="px-1 text-slate-500">...</span>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-10 h-10 text-sm border rounded-lg hover:bg-slate-50"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* ==================================================
          MOBILE FILTER DRAWER
      ================================================== */}

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer */}

          <div className="absolute top-0 bottom-0 right-0 max-w-full p-4 overflow-y-auto bg-white shadow-xl w-80">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              districts={districts}
              onReset={resetFilters}
            />

            <button
              className="w-full mt-4 btn-primary"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          FACILITIES
      ================================================== */}

      <Facilities />

      {/* ==================================================
          TRAVEL GUIDE
      ================================================== */}

      <TravelGuide />
    </div>
  );
}
