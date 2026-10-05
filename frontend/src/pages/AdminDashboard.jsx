import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  LogOut,
  Eye,
  EyeOff,
  X,
  Save,
  RefreshCw,
  Building2,
  CheckCircle2,
  CircleOff,
  PawPrint,
  MapPin,
  BedDouble,
  Bath,
  Users,
  Ruler,
  Search,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Dumbbell,
  Waves,
  Sofa,
  RotateCcw,
  ImagePlus,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import {
  getAdminApartments,
  createApartment,
  updateApartment,
  deleteApartment,
  updateAvailability,
  uploadImages,
  deleteImage,
} from "../api/admin";

const EMPTY_FORM = {
  title: "",
  address: "",
  ward: "",
  district: "",
  city: "Da Nang",
  price: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  maxOccupants: "",
  rooms: "",
  furnished: true,
  amenities: "",
  description: "",
  images: [],
  available: true,
  gym: false,
  petFriendly: false,
  pool: false,
};

const formatPrice = (price) => {
  return `${(Number(price) / 1_000_000).toFixed(
    Number(price) % 1_000_000 === 0 ? 0 : 1,
  )}M`;
};

const formatVnd = (price) => {
  return `${Number(price || 0).toLocaleString("vi-VN")} VND`;
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/*
  Hỗ trợ cả:

  Cấu trúc mới:
  {
    url: '...',
    publicId: '...'
  }

  Và dữ liệu cũ:
  'https://...'
*/
const normalizeImages = (images) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => {
      if (typeof image === "string") {
        return {
          url: image,
          publicId: "",
        };
      }

      if (image && typeof image === "object") {
        return {
          url: image.url || "",
          publicId: image.publicId || "",
        };
      }

      return null;
    })
    .filter((image) => image?.url);
};

const getInitialForm = (apartment = null) => {
  if (!apartment) return { ...EMPTY_FORM };

  return {
    title: apartment.title || "",
    address: apartment.address || "",
    ward: apartment.ward || "",
    district: apartment.district || "",
    city: apartment.city || "Da Nang",
    price: apartment.price ?? "",
    area: apartment.area ?? "",
    bedrooms: apartment.bedrooms ?? "",
    bathrooms: apartment.bathrooms ?? "",
    maxOccupants: apartment.maxOccupants ?? "",
    rooms: apartment.rooms ?? "",
    furnished: apartment.furnished ?? true,
    amenities: Array.isArray(apartment.amenities)
      ? apartment.amenities.join(", ")
      : "",
    description: apartment.description || "",
    images: normalizeImages(apartment.images),
    available: apartment.available ?? true,
    gym: apartment.gym ?? false,
    petFriendly: apartment.petFriendly ?? false,
    pool: apartment.pool ?? false,
  };
};

export default function AdminDashboard() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    hidden: 0,
    petFriendly: 0,
  });

  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    district: "",
    bedrooms: "all",
    price: "all",
    area: "all",
    petFriendly: false,
    pool: false,
    gym: false,
    furnished: false,
  });

  const [sortBy, setSortBy] = useState("newest");

  const [showModal, setShowModal] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  /*
    File mới mà Admin chọn từ máy.
    Chúng ta chưa upload ngay.
    Chỉ upload khi bấm Save.
  */
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const showingStart =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;

  const showingEnd = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );
  // =========================
  // LOAD APARTMENTS
  // =========================

  const loadApartments = async (targetPage = page, targetLimit = limit) => {
    try {
      setLoading(true);

      const data = await getAdminApartments({
        page: targetPage,
        limit: targetLimit,

        search: search.trim(),

        status: filters.status,
        district: filters.district,
        bedrooms: filters.bedrooms,
        price: filters.price,
        area: filters.area,

        petFriendly: filters.petFriendly,
        pool: filters.pool,
        gym: filters.gym,
        furnished: filters.furnished,

        sort: sortBy,
      });

      const list = Array.isArray(data?.apartments) ? data.apartments : [];

      setApartments(list);

      setPagination(
        data?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      );

      setStats(
        data?.stats || {
          total: 0,
          available: 0,
          hidden: 0,
          petFriendly: 0,
        },
      );

      setDistricts(Array.isArray(data?.districts) ? data.districts : []);

      /*
      Backend có thể trả về page nhỏ hơn targetPage
      nếu page cũ không còn tồn tại sau khi xóa/filter.
    */
      if (data?.pagination?.page && data.pagination.page !== targetPage) {
        setPage(data.pagination.page);
      }
    } catch (error) {
      console.error("LOAD ADMIN APARTMENTS ERROR:", error);

      alert(error.message || "Không thể tải danh sách căn hộ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = search.trim() ? 350 : 0;

    const timer = setTimeout(() => {
      loadApartments(page, limit);
    }, delay);

    return () => clearTimeout(timer);
  }, [page, limit, search, filters, sortBy]);

  // =========================
  // FILTER COUNT
  // =========================

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.status !== "all") count++;
    if (filters.district) count++;
    if (filters.bedrooms !== "all") count++;
    if (filters.price !== "all") count++;
    if (filters.area !== "all") count++;
    if (filters.petFriendly) count++;
    if (filters.pool) count++;
    if (filters.gym) count++;
    if (filters.furnished) count++;

    return count;
  }, [filters]);

  // =========================
  // FILTER + SORT
  // =========================

  const filteredApartments = apartments;

  // =========================
  // FORM
  // =========================

  const openCreateModal = () => {
    setEditingApartment(null);
    setForm({ ...EMPTY_FORM });
    setSelectedFiles([]);
    setShowModal(true);
  };

  const openEditModal = (apartment) => {
    setEditingApartment(apartment);
    setForm(getInitialForm(apartment));
    setSelectedFiles([]);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving || uploadingImages) return;

    setShowModal(false);
    setEditingApartment(null);
    setForm({ ...EMPTY_FORM });
    setSelectedFiles([]);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // IMAGE SELECT
  // =========================

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const currentCount = form.images.length + selectedFiles.length;

    if (currentCount + files.length > 15) {
      alert("Mỗi căn hộ tối đa 15 ảnh.");
      e.target.value = "";
      return;
    }

    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/"),
    );

    if (invalidFiles.length) {
      alert("Chỉ được chọn file ảnh.");
      e.target.value = "";
      return;
    }

    const tooLargeFiles = files.filter((file) => file.size > 10 * 1024 * 1024);

    if (tooLargeFiles.length) {
      alert("Mỗi ảnh tối đa 10MB. Vui lòng chọn ảnh nhỏ hơn.");
      e.target.value = "";
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setSelectedFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const removeExistingImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  // =========================
  // SAVE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Vui lòng nhập tên căn hộ");
      return;
    }

    if (!form.address.trim()) {
      alert("Vui lòng nhập địa chỉ");
      return;
    }

    if (!form.ward.trim()) {
      alert("Vui lòng nhập phường");
      return;
    }

    if (!form.district.trim()) {
      alert("Vui lòng nhập quận");
      return;
    }

    if (!form.price) {
      alert("Vui lòng nhập giá thuê");
      return;
    }

    try {
      setSaving(true);

      let finalImages = [...form.images];

      /*
        Lưu lại ảnh cũ trước khi edit.

        Dùng để biết ảnh nào Admin đã xóa.
      */
      const oldImages = editingApartment
        ? normalizeImages(editingApartment.images)
        : [];

      /*
        ============================
        UPLOAD ẢNH MỚI
        ============================
      */

      let uploadedImages = [];

      if (selectedFiles.length > 0) {
        setUploadingImages(true);

        try {
          const response = await uploadImages(selectedFiles);

          uploadedImages = response?.images || [];

          finalImages = [...finalImages, ...uploadedImages];
        } finally {
          setUploadingImages(false);
        }
      }

      /*
        ============================
        PAYLOAD
        ============================
      */

      const payload = {
        title: form.title.trim(),
        address: form.address.trim(),
        ward: form.ward.trim(),
        district: form.district.trim(),
        city: form.city.trim() || "Da Nang",

        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        maxOccupants: Number(form.maxOccupants),
        rooms: Number(form.rooms),

        furnished: Boolean(form.furnished),

        amenities: form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        description: form.description.trim(),

        images: finalImages,

        available: Boolean(form.available),
        gym: Boolean(form.gym),
        petFriendly: Boolean(form.petFriendly),
        pool: Boolean(form.pool),
      };

      /*
        ============================
        CREATE
        ============================
      */

      if (!editingApartment) {
        const response = await createApartment(payload);

        setPage(1);
        await loadApartments(1, limit);
      }

      /*
        ============================
        UPDATE
        ============================
      */

      if (editingApartment) {
        const response = await updateApartment(editingApartment._id, payload);

        const updatedApartment = response?.apartment || response;

        await updateApartment(editingApartment._id, payload);

        await loadApartments(page, limit);

        /*
          Sau khi MongoDB update thành công,
          mới xóa ảnh cũ khỏi Cloudinary.

          Như vậy nếu update MongoDB lỗi,
          ảnh cũ vẫn an toàn.
        */

        const currentPublicIds = new Set(
          finalImages.map((image) => image.publicId).filter(Boolean),
        );

        const removedImages = oldImages.filter(
          (image) => image.publicId && !currentPublicIds.has(image.publicId),
        );

        for (const image of removedImages) {
          try {
            await deleteImage(image.publicId);
          } catch (error) {
            console.error("DELETE OLD CLOUDINARY IMAGE ERROR:", error);
          }
        }
      }

      setShowModal(false);
      setEditingApartment(null);
      setForm({ ...EMPTY_FORM });
      setSelectedFiles([]);
    } catch (error) {
      console.error("SAVE APARTMENT ERROR:", error);

      /*
        Nếu đã upload ảnh mới nhưng MongoDB
        thất bại, cố gắng xóa ảnh vừa upload
        để tránh ảnh rác trên Cloudinary.
      */

      if (uploadedImages?.length) {
        for (const image of uploadedImages) {
          if (image.publicId) {
            try {
              await deleteImage(image.publicId);
            } catch (cleanupError) {
              console.error("CLEANUP CLOUDINARY IMAGE ERROR:", cleanupError);
            }
          }
        }
      }

      alert(error.message || "Không thể lưu căn hộ");
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  // =========================
  // AVAILABILITY
  // =========================

  const handleAvailability = async (apartment) => {
    try {
      setActionId(apartment._id);

      const newAvailable = !apartment.available;

      const response = await updateAvailability(apartment._id, newAvailable);
      await loadApartments(page, limit);
      const updatedApartment = response?.apartment || response;

      setApartments((prev) =>
        prev.map((item) =>
          item._id === apartment._id
            ? {
                ...item,
                ...updatedApartment,
                available: newAvailable,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("UPDATE AVAILABILITY ERROR:", error);

      alert(error.message || "Không thể thay đổi trạng thái căn hộ");
    } finally {
      setActionId(null);
    }
  };

  // =========================
  // DELETE APARTMENT
  // =========================

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await deleteApartment(deleteTarget._id);

      /*
        Xóa toàn bộ ảnh Cloudinary của căn hộ.

        Chỉ ảnh có publicId mới xóa được.
        Ảnh cũ chỉ lưu URL sẽ được bỏ qua.
      */

      const imagesToDelete = normalizeImages(deleteTarget.images);

      for (const image of imagesToDelete) {
        if (!image.publicId) continue;

        try {
          await deleteImage(image.publicId);
        } catch (error) {
          console.error("DELETE APARTMENT IMAGE ERROR:", error);
        }
      }

      setDeleteTarget(null);

      await loadApartments(page, limit);
    } catch (error) {
      console.error("DELETE APARTMENT ERROR:", error);

      alert(error.message || "Không thể xóa căn hộ");
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // RESET FILTER
  // =========================
  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    setPage(1);
  };
  const resetFilters = () => {
    setFilters({
      status: "all",
      district: "",
      bedrooms: "all",
      price: "all",
      area: "all",
      petFriendly: false,
      pool: false,
      gym: false,
      furnished: false,
    });

    setSearch("");
    setSortBy("newest");

    setPage(1);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={30} className="animate-spin text-slate-400" />

          <p className="text-sm text-slate-500">Loading apartments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-5 bg-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* TOP ACTIONS */}

        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Apartment Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your apartment listings
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadApartments}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw size={16} />

              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Add apartment
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-red-600"
              title="Logout"
            >
              <LogOut size={17} />

              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
          <StatCard
            label="Total"
            value={stats.total}
            icon={<Building2 size={20} />}
            iconClass="bg-slate-100 text-slate-600"
          />

          <StatCard
            label="Available"
            value={stats.available}
            valueClass="text-emerald-600"
            icon={<CheckCircle2 size={20} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Hidden"
            value={stats.hidden}
            valueClass="text-slate-600"
            icon={<CircleOff size={20} />}
            iconClass="bg-slate-100 text-slate-500"
          />

          <StatCard
            label="Pet Friendly"
            value={stats.petFriendly}
            valueClass="text-amber-600"
            icon={<PawPrint size={20} />}
            iconClass="bg-amber-50 text-amber-600"
          />
        </div>

        {/* MAIN CONTENT */}

        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
          {/* SEARCH + SORT */}

          <div className="p-4 border-b border-slate-100">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search apartments..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                    showFilters || activeFilterCount > 0
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] ${
                        showFilters
                          ? "bg-white text-slate-900"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="relative flex-1 sm:flex-none">
                  <ArrowUpDown
                    size={15}
                    className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-slate-400"
                  />

                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 sm:w-[190px]"
                  >
                    <option value="newest">Newest</option>

                    <option value="price-asc">Price: Low → High</option>

                    <option value="price-desc">Price: High → Low</option>

                    <option value="area-asc">Area: Small → Large</option>

                    <option value="area-desc">Area: Large → Small</option>
                  </select>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 mt-4 border rounded-xl border-slate-200 bg-slate-50">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <FilterSelect
                    label="Status"
                    value={filters.status}
                    onChange={(value) => updateFilter("status", value)}
                    options={[
                      ["all", "All status"],
                      ["available", "Available"],
                      ["hidden", "Hidden"],
                    ]}
                  />

                  <FilterSelect
                    label="District"
                    value={filters.district}
                    onChange={(value) => updateFilter("district", value)}
                    options={[
                      ["", "All districts"],
                      ...districts.map((district) => [district, district]),
                    ]}
                  />

                  <FilterSelect
                    label="Bedrooms"
                    value={filters.bedrooms}
                    onChange={(value) => updateFilter("bedrooms", value)}
                    options={[
                      ["all", "All bedrooms"],
                      ["0", "Studio"],
                      ["1", "1 Bedroom"],
                      ["2", "2 Bedrooms"],
                      ["3+", "3+ Bedrooms"],
                    ]}
                  />

                  <FilterSelect
                    label="Price"
                    value={filters.price}
                    onChange={(value) => updateFilter("price", value)}
                    options={[
                      ["all", "All prices"],
                      ["under10", "Under 10M"],
                      ["10-15", "10M – 15M"],
                      ["15-20", "15M – 20M"],
                      ["20-30", "20M – 30M"],
                      ["over30", "Over 30M"],
                    ]}
                  />

                  <FilterSelect
                    label="Area"
                    value={filters.area}
                    onChange={(value) => updateFilter("area", value)}
                    options={[
                      ["all", "All areas"],
                      ["under40", "Under 40m²"],
                      ["40-60", "40 – 60m²"],
                      ["60-80", "60 – 80m²"],
                      ["over80", "Over 80m²"],
                    ]}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <FacilityFilter
                    active={filters.petFriendly}
                    onClick={() =>
                      updateFilter("petFriendly", !filters.petFriendly)
                    }
                    icon={<PawPrint size={14} />}
                  >
                    Pet Friendly
                  </FacilityFilter>

                  <FacilityFilter
                    active={filters.pool}
                    onClick={() => updateFilter("pool", !filters.pool)}
                    icon={<Waves size={14} />}
                  >
                    Pool
                  </FacilityFilter>

                  <FacilityFilter
                    active={filters.gym}
                    onClick={() => updateFilter("gym", !filters.gym)}
                    icon={<Dumbbell size={14} />}
                  >
                    Gym
                  </FacilityFilter>

                  <FacilityFilter
                    active={filters.furnished}
                    onClick={() =>
                      updateFilter("furnished", !filters.furnished)
                    }
                    icon={<Sofa size={14} />}
                  >
                    Furnished
                  </FacilityFilter>

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"
                    >
                      <RotateCcw size={14} />
                      Reset filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RESULT COUNT */}

          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {showingStart}-{showingEnd}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {pagination.total}
              </span>{" "}
              apartments
            </p>

            {(search || activeFilterCount > 0) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Clear all
              </button>
            )}
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <TableHead>Apartment</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>

                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredApartments.length === 0 ? (
                  <EmptyTable />
                ) : (
                  filteredApartments.map((apartment) => {
                    const images = normalizeImages(apartment.images);

                    return (
                      <tr
                        key={apartment._id}
                        className="transition border-b border-slate-100 hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 overflow-hidden shrink-0 rounded-xl bg-slate-100">
                              {images[0]?.url ? (
                                <img
                                  src={images[0].url}
                                  alt={apartment.title}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <Building2
                                  size={20}
                                  className="text-slate-400"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[250px] truncate font-semibold text-slate-900">
                                {apartment.title}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Added {formatDate(apartment.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin
                              size={16}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {apartment.district}
                              </p>

                              <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                                {apartment.address}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            <DetailBadge icon={<BedDouble size={13} />}>
                              {apartment.bedrooms === 0
                                ? "Studio"
                                : `${apartment.bedrooms} BR`}
                            </DetailBadge>

                            <DetailBadge icon={<Bath size={13} />}>
                              {apartment.bathrooms}
                            </DetailBadge>

                            <DetailBadge icon={<Ruler size={13} />}>
                              {apartment.area}m²
                            </DetailBadge>

                            {apartment.petFriendly && (
                              <FeatureBadge
                                icon={<PawPrint size={13} />}
                                className="bg-amber-50 text-amber-700"
                              >
                                Pet
                              </FeatureBadge>
                            )}

                            {apartment.pool && (
                              <FeatureBadge
                                icon={<Waves size={13} />}
                                className="bg-cyan-50 text-cyan-700"
                              >
                                Pool
                              </FeatureBadge>
                            )}

                            {apartment.gym && (
                              <FeatureBadge
                                icon={<Dumbbell size={13} />}
                                className="bg-violet-50 text-violet-700"
                              >
                                Gym
                              </FeatureBadge>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-900">
                            {formatPrice(apartment.price)}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {formatVnd(apartment.price)}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            disabled={actionId === apartment._id}
                            onClick={() => handleAvailability(apartment)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                              apartment.available
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {apartment.available ? (
                              <>
                                <Eye size={13} />
                                Available
                              </>
                            ) : (
                              <>
                                <EyeOff size={13} />
                                Hidden
                              </>
                            )}
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(apartment)}
                              className="p-2 transition rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(apartment)}
                              className="p-2 transition rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>

                            <ChevronRight
                              size={17}
                              className="mt-2 text-slate-300"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}

          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredApartments.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <Building2 size={35} className="mx-auto mb-3 text-slate-300" />

                <p className="font-semibold text-slate-700">
                  No apartments found
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              filteredApartments.map((apartment) => {
                const images = normalizeImages(apartment.images);

                return (
                  <div key={apartment._id} className="p-4">
                    <div className="flex gap-3">
                      <div className="w-24 h-24 overflow-hidden shrink-0 rounded-xl bg-slate-100">
                        {images[0]?.url ? (
                          <img
                            src={images[0].url}
                            alt={apartment.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <Building2 size={22} className="text-slate-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-bold truncate text-slate-900">
                              {apartment.title}
                            </h3>

                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                              <MapPin size={12} />
                              {apartment.district}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAvailability(apartment)}
                            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                              apartment.available
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {apartment.available ? "AVAILABLE" : "HIDDEN"}
                          </button>
                        </div>

                        <p className="mt-2 text-lg font-bold text-slate-900">
                          {formatPrice(apartment.price)}

                          <span className="ml-1 text-xs font-normal text-slate-400">
                            /month
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <DetailBadge icon={<BedDouble size={13} />}>
                        {apartment.bedrooms} BR
                      </DetailBadge>

                      <DetailBadge icon={<Bath size={13} />}>
                        {apartment.bathrooms} Bath
                      </DetailBadge>

                      <DetailBadge icon={<Ruler size={13} />}>
                        {apartment.area}m²
                      </DetailBadge>

                      <DetailBadge icon={<Users size={13} />}>
                        {apartment.maxOccupants}
                      </DetailBadge>

                      {apartment.petFriendly && (
                        <FeatureBadge
                          icon={<PawPrint size={13} />}
                          className="bg-amber-50 text-amber-700"
                        >
                          Pet
                        </FeatureBadge>
                      )}

                      {apartment.pool && (
                        <FeatureBadge
                          icon={<Waves size={13} />}
                          className="bg-cyan-50 text-cyan-700"
                        >
                          Pool
                        </FeatureBadge>
                      )}

                      {apartment.gym && (
                        <FeatureBadge
                          icon={<Dumbbell size={13} />}
                          className="bg-violet-50 text-violet-700"
                        >
                          Gym
                        </FeatureBadge>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(apartment)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(apartment)}
                        className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* =========================
          CREATE / EDIT MODAL
      ========================= */}
      {/* PAGINATION */}

      {pagination.total > 0 && (
        <div className="flex flex-col gap-3 px-4 py-4 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT */}

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Per page</span>

            <select
              value={limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value);

                setLimit(newLimit);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-slate-400"
            >
              <option value={10}>10</option>

              <option value={20}>20</option>

              <option value={50}>50</option>
            </select>
          </div>

          {/* RIGHT */}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1">
              {/* PREVIOUS */}

              <button
                type="button"
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage(pagination.page - 1)}
                className="flex items-center justify-center px-2 text-sm font-semibold transition bg-white border rounded-lg h-9 min-w-9 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ←
              </button>

              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1,
              )
                .filter((pageNumber) => {
                  const current = pagination.page;

                  return (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    Math.abs(pageNumber - current) <= 1
                  );
                })
                .map((pageNumber, index, visiblePages) => {
                  const previous = visiblePages[index - 1];

                  const showDots = previous && pageNumber - previous > 1;

                  return (
                    <div key={pageNumber} className="flex items-center gap-1">
                      {showDots && (
                        <span className="px-1 text-slate-400">...</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
                          pagination.page === pageNumber
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </div>
                  );
                })}

              {/* NEXT */}

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage(pagination.page + 1)}
                className="flex items-center justify-center px-2 text-sm font-semibold transition bg-white border rounded-lg h-9 min-w-9 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingApartment ? "Edit apartment" : "Add apartment"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  {editingApartment
                    ? "Update apartment information"
                    : "Create a new apartment listing"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 transition rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="grid gap-5 p-5 md:grid-cols-2">
                {/* BASIC INFO */}

                <div className="md:col-span-2">
                  <h3 className="mb-3 text-sm font-bold text-slate-900">
                    Basic information
                  </h3>

                  <div className="grid gap-3 md:grid-cols-2">
                    <FormField
                      label="Title"
                      required
                      value={form.title}
                      onChange={(value) => handleChange("title", value)}
                      placeholder="Modern 1 Bedroom Apartment"
                    />

                    <FormField
                      label="City"
                      value={form.city}
                      onChange={(value) => handleChange("city", value)}
                      placeholder="Da Nang"
                    />

                    <FormField
                      label="Address"
                      required
                      value={form.address}
                      onChange={(value) => handleChange("address", value)}
                      placeholder="123 Example Street"
                    />

                    <FormField
                      label="Ward"
                      required
                      value={form.ward}
                      onChange={(value) => handleChange("ward", value)}
                      placeholder="My An"
                    />

                    <FormField
                      label="District"
                      required
                      value={form.district}
                      onChange={(value) => handleChange("district", value)}
                      placeholder="Ngu Hanh Son"
                    />
                  </div>
                </div>

                {/* PROPERTY DETAILS */}

                <div className="md:col-span-2">
                  <h3 className="mb-3 text-sm font-bold text-slate-900">
                    Property details
                  </h3>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <FormField
                      label="Price (VND)"
                      required
                      type="number"
                      value={form.price}
                      onChange={(value) => handleChange("price", value)}
                      placeholder="12000000"
                    />

                    <FormField
                      label="Area (m²)"
                      type="number"
                      value={form.area}
                      onChange={(value) => handleChange("area", value)}
                      placeholder="50"
                    />

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Bedrooms
                      </label>

                      <select
                        value={form.bedrooms}
                        onChange={(e) =>
                          handleChange("bedrooms", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                      >
                        <option value="">Select</option>
                        <option value="0">Studio</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                      </select>
                    </div>

                    <FormField
                      label="Bathrooms"
                      type="number"
                      value={form.bathrooms}
                      onChange={(value) => handleChange("bathrooms", value)}
                      placeholder="1"
                    />

                    <FormField
                      label="Max occupants"
                      type="number"
                      value={form.maxOccupants}
                      onChange={(value) => handleChange("maxOccupants", value)}
                      placeholder="2"
                    />

                    <FormField
                      label="Rooms"
                      type="number"
                      value={form.rooms}
                      onChange={(value) => handleChange("rooms", value)}
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* FACILITIES */}

                <div className="md:col-span-2">
                  <h3 className="mb-3 text-sm font-bold text-slate-900">
                    Facilities
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <ToggleButton
                      active={form.furnished}
                      onClick={() => handleChange("furnished", !form.furnished)}
                    >
                      <Sofa size={15} />
                      Furnished
                    </ToggleButton>

                    <ToggleButton
                      active={form.petFriendly}
                      onClick={() =>
                        handleChange("petFriendly", !form.petFriendly)
                      }
                    >
                      <PawPrint size={15} />
                      Pet Friendly
                    </ToggleButton>

                    <ToggleButton
                      active={form.pool}
                      onClick={() => handleChange("pool", !form.pool)}
                    >
                      <Waves size={15} />
                      Pool
                    </ToggleButton>

                    <ToggleButton
                      active={form.gym}
                      onClick={() => handleChange("gym", !form.gym)}
                    >
                      <Dumbbell size={15} />
                      Gym
                    </ToggleButton>

                    <ToggleButton
                      active={form.available}
                      onClick={() => handleChange("available", !form.available)}
                    >
                      {form.available ? (
                        <Eye size={15} />
                      ) : (
                        <EyeOff size={15} />
                      )}

                      {form.available ? "Available" : "Hidden"}
                    </ToggleButton>
                  </div>
                </div>

                {/* AMENITIES */}

                <div className="md:col-span-2">
                  <FormTextarea
                    label="Amenities"
                    value={form.amenities}
                    onChange={(value) => handleChange("amenities", value)}
                    placeholder="Balcony, Washing machine, Refrigerator, WiFi"
                    rows={2}
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">
                  <FormTextarea
                    label="Description"
                    value={form.description}
                    onChange={(value) => handleChange("description", value)}
                    placeholder="Describe the apartment..."
                    rows={4}
                  />
                </div>

                {/* =========================
                    IMAGES
                ========================= */}

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Apartment images
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Maximum 15 images · 10MB per image
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      {form.images.length + selectedFiles.length} / 15
                    </span>
                  </div>

                  {/* UPLOAD BUTTON */}

                  <label
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-7 text-center transition ${
                      form.images.length + selectedFiles.length >= 15
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                        : "border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2 bg-white shadow-sm h-11 w-11 rounded-xl text-slate-500">
                      <ImagePlus size={21} />
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      Choose apartment images
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      You can select multiple images
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={form.images.length + selectedFiles.length >= 15}
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>

                  {/* EXISTING IMAGES */}

                  {form.images.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold text-slate-500">
                        Saved images
                      </p>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {form.images.map((image, index) => (
                          <ImagePreview
                            key={`${image.url}-${index}`}
                            src={image.url}
                            onRemove={() => removeExistingImage(index)}
                            label="Saved"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NEW IMAGES */}

                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold text-slate-500">
                        New images
                      </p>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {selectedFiles.map((file, index) => (
                          <NewImagePreview
                            key={`${file.name}-${file.size}-${index}`}
                            file={file}
                            onRemove={() => removeNewImage(index)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {uploadingImages && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-600">
                      <Upload size={14} className="animate-pulse" />
                      Uploading images to Cloudinary...
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving || uploadingImages}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />

                      {uploadingImages ? "Uploading images..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save size={16} />

                      {editingApartment ? "Save changes" : "Create apartment"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md p-5 bg-white shadow-2xl rounded-2xl">
            <div className="flex items-center justify-center w-12 h-12 text-red-600 rounded-xl bg-red-50">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Delete apartment?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                "{deleteTarget.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse gap-2 mt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  valueClass = "text-slate-900",
  icon,
  iconClass,
}) {
  return (
    <div className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>

        <div className={`rounded-xl p-2.5 ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-white border rounded-lg outline-none border-slate-200 focus:border-slate-400"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   FACILITY FILTER
========================================================= */

function FacilityFilter({ active, onClick, icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/* =========================================================
   TABLE HEAD
========================================================= */

function TableHead({ children }) {
  return (
    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </th>
  );
}

/* =========================================================
   EMPTY TABLE
========================================================= */

function EmptyTable() {
  return (
    <tr>
      <td colSpan="6" className="px-5 py-16 text-center">
        <Building2 size={35} className="mx-auto mb-3 text-slate-300" />

        <p className="font-semibold text-slate-700">No apartments found</p>

        <p className="mt-1 text-sm text-slate-400">
          Try changing your search or filters.
        </p>
      </td>
    </tr>
  );
}

/* =========================================================
   DETAIL BADGE
========================================================= */

function DetailBadge({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100">
      {icon}
      {children}
    </span>
  );
}

/* =========================================================
   FEATURE BADGE
========================================================= */

function FeatureBadge({ icon, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

/* =========================================================
   IMAGE PREVIEW
========================================================= */

function ImagePreview({ src, onRemove, label }) {
  return (
    <div className="relative overflow-hidden border group aspect-square rounded-xl border-slate-200 bg-slate-100">
      <img src={src} alt={label} className="object-cover w-full h-full" />

      <div className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-1 text-[9px] font-semibold text-white">
        {label}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600"
        title="Remove image"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* =========================================================
   NEW IMAGE PREVIEW
========================================================= */

function NewImagePreview({ file, onRemove }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="relative overflow-hidden border group aspect-square rounded-xl border-slate-200 bg-slate-100">
      {preview ? (
        <img
          src={preview}
          alt={file.name}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <ImageIcon size={22} className="text-slate-300" />
        </div>
      )}

      <div className="absolute left-1.5 top-1.5 rounded-md bg-slate-900/70 px-1.5 py-1 text-[9px] font-semibold text-white">
        New
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600"
        title="Remove image"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function FormTextarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}

/* =========================================================
   TOGGLE BUTTON
========================================================= */

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
