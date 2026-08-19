import { useEffect, useState, useCallback } from 'react';
import { fetchApartments, fetchDistricts } from '../api/apartments';
import ApartmentCard from '../components/ApartmentCard';
import FilterPanel from '../components/FilterPanel';
import { Search, Loader2 } from 'lucide-react';
import TravelGuide from '../components/TravelGuide';
import Facilities from '../components/Facilities';

const defaultFilters = {
  search: '',
  district: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  bathrooms: '',
  minArea: '',
  maxArea: '',
  maxOccupants: '',
  furnished: '',
  petFriendly: '',
  nearMetro: '',
  sort: 'price',
};


export default function Home() {
  const [apartments, setApartments] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 9;
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) params[k] = v;
      });
      const { data } = await fetchApartments(params);
      setApartments(data);
    } catch (err) {
      console.error(err);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDistricts()
      .then((res) => setDistricts(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadData, 300); // debounce
    return () => clearTimeout(timer);
  }, [loadData]);

  const resetFilters = () => setFilters(defaultFilters);
 

  // Pagination
const totalPages = Math.ceil(apartments.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentApartments = apartments.slice(startIndex, startIndex + itemsPerPage);

// Khi filter thay đổi thì về trang 1
useEffect(() => {
  setCurrentPage(1);
}, [filters]);

  return (
    <div>
      {/* Hero */}
      <section className="relative font-playfair bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Find Your Perfect Home
            <br />
            <span className="text-primary-300">in Da Nang</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Curated premium apartments for expatriates. Modern, comfortable, and ready to move in.
          </p>

          {/* Quick search bar */}
          <div className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by district, address..."
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
    {/* Title */}
    <div>
      <h2 className="font-playfair lg:pb-2 font-semibold text-slate-900 uppercase text-xl xl:text-2xl">
        Apartment
      </h2>
      <p className="text-sm text-slate-500 mt-0.5">
        Available for rent: {loading ? 'Loading...' : `${apartments.length} Apartments`}
      </p>
    </div>

    {/* Sort + Filter button */}
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <select
        value={filters.sort}
        onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
        className="input-field text-sm  sm:flex-none sm:w-auto"
      >
        <option value="price">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="area">Largest Area</option>
        <option value="newest">Newest</option>
      </select>

      <button
        className="md:hidden btn-outline text-sm flex items-center gap-1.5 shrink-0"
        onClick={() => setMobileFilterOpen(true)}
      >
        Filters
      </button>
    </div>
  </div>
        <div className="flex gap-8">
          {/* Sidebar filters - desktop */}
          <aside className="hidden md:block w-72 shrink-0">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              districts={districts}
              onReset={resetFilters}
            />
          </aside>

          {/* Grid */}
          
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : apartments.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-slate-500 text-lg">No apartments match your filters.</p>
                <button onClick={resetFilters} className="btn-primary mt-4">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
  {currentApartments?.map((apt) => (
    <ApartmentCard key={apt._id} apartment={apt} />
  ))}
</div>
            )}
          </div>
          
        </div>
        {/* Pagination */}
{totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-10">
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="px-3 py-2 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`w-10 h-10 text-sm rounded-lg border transition ${
          currentPage === page
            ? 'bg-primary-600 text-white border-primary-600'
            : 'hover:bg-slate-50'
        }`}
      >
        {page}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      className="px-3 py-2 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
    >
      Next
    </button>
  </div>
)}
      </section>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white overflow-y-auto p-4 shadow-xl">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              districts={districts}
              onReset={resetFilters}
            />
            <button
              className="btn-primary w-full mt-4"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      <Facilities/>
      <TravelGuide />
    </div>
  );
}
