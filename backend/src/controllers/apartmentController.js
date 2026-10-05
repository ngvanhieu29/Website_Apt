import Apartment from "../models/Apartment.js";

/* =========================================================
   HELPERS
========================================================= */

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/* =========================================================
   ADMIN FILTER
========================================================= */

const buildAdminFilter = (query) => {
  const {
    search = "",
    status = "all",
    district = "",
    bedrooms = "all",
    price = "all",
    area = "all",
    petFriendly = "false",
    pool = "false",
    gym = "false",
    furnished = "false",
  } = query;

  const filter = {};

  /* =========================
     SEARCH
  ========================= */

  const keyword = search.trim();

  if (keyword) {
    const safeKeyword = escapeRegex(keyword);

    filter.$or = [
      { title: { $regex: safeKeyword, $options: "i" } },
      { address: { $regex: safeKeyword, $options: "i" } },
      { ward: { $regex: safeKeyword, $options: "i" } },
      { district: { $regex: safeKeyword, $options: "i" } },
      { city: { $regex: safeKeyword, $options: "i" } },
      { description: { $regex: safeKeyword, $options: "i" } },
    ];
  }

  /* =========================
     STATUS
  ========================= */

  if (status === "available") {
    filter.available = true;
  }

  if (status === "hidden") {
    filter.available = false;
  }

  /* =========================
     DISTRICT
  ========================= */

  if (district.trim()) {
    filter.district = district.trim();
  }

  /* =========================
     BEDROOMS
  ========================= */

  if (bedrooms !== "all" && bedrooms !== "") {
    if (bedrooms === "3+") {
      filter.bedrooms = {
        $gte: 3,
      };
    } else {
      const bedroomNumber = Number(bedrooms);

      if (Number.isFinite(bedroomNumber)) {
        filter.bedrooms = bedroomNumber;
      }
    }
  }

  /* =========================
     PRICE
  ========================= */

  switch (price) {
    case "under10":
      filter.price = {
        $lt: 10_000_000,
      };
      break;

    case "10-15":
      filter.price = {
        $gte: 10_000_000,
        $lte: 15_000_000,
      };
      break;

    case "15-20":
      filter.price = {
        $gt: 15_000_000,
        $lte: 20_000_000,
      };
      break;

    case "20-30":
      filter.price = {
        $gt: 20_000_000,
        $lte: 30_000_000,
      };
      break;

    case "over30":
      filter.price = {
        $gt: 30_000_000,
      };
      break;

    default:
      break;
  }

  /* =========================
     AREA
  ========================= */

  switch (area) {
    case "under40":
      filter.area = {
        $lt: 40,
      };
      break;

    case "40-60":
      filter.area = {
        $gte: 40,
        $lte: 60,
      };
      break;

    case "60-80":
      filter.area = {
        $gt: 60,
        $lte: 80,
      };
      break;

    case "over80":
      filter.area = {
        $gt: 80,
      };
      break;

    default:
      break;
  }

  /* =========================
     FACILITIES
  ========================= */

  if (petFriendly === "true") {
    filter.petFriendly = true;
  }

  if (pool === "true") {
    filter.pool = true;
  }

  if (gym === "true") {
    filter.gym = true;
  }

  if (furnished === "true") {
    filter.furnished = true;
  }

  return filter;
};

/* =========================================================
   ADMIN SORT
========================================================= */

const buildSort = (sort) => {
  switch (sort) {
    case "price-asc":
      return {
        price: 1,
        createdAt: -1,
      };

    case "price-desc":
      return {
        price: -1,
        createdAt: -1,
      };

    case "area-asc":
      return {
        area: 1,
        createdAt: -1,
      };

    case "area-desc":
      return {
        area: -1,
        createdAt: -1,
      };

    case "newest":
    default:
      return {
        createdAt: -1,
      };
  }
};

/* =========================================================
   PUBLIC - GET APARTMENTS
========================================================= */

export const getApartments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      district,
      maxOccupants,
      furnished,
      petFriendly,
      gym,
      pool,
      sort = "price",
    } = req.query;

    /* =========================
       PAGINATION
    ========================= */

    let safePage = Number(page);

    if (!Number.isFinite(safePage) || safePage < 1) {
      safePage = 1;
    }

    safePage = Math.floor(safePage);

    let safeLimit = Number(limit);

    if (!Number.isFinite(safeLimit) || safeLimit < 1) {
      safeLimit = 9;
    }

    safeLimit = Math.floor(safeLimit);

    // Không cho frontend request quá nhiều căn
    safeLimit = Math.min(safeLimit, 50);

    /* =========================
       FILTER
    ========================= */

    const filter = {
      // PUBLIC WEBSITE CHỈ HIỂN THỊ AVAILABLE
      available: true,
    };

    /* =========================
       SEARCH
    ========================= */

    if (search?.trim()) {
      const safeKeyword = escapeRegex(search.trim());

      filter.$or = [
        {
          title: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
        {
          address: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
        {
          ward: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
        {
          district: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
        {
          city: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: safeKeyword,
            $options: "i",
          },
        },
      ];
    }

    /* =========================
       PRICE
    ========================= */

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        const min = Number(minPrice);

        if (Number.isFinite(min)) {
          filter.price.$gte = min;
        }
      }

      if (maxPrice) {
        const max = Number(maxPrice);

        if (Number.isFinite(max)) {
          filter.price.$lte = max;
        }
      }

      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    /* =========================
       BEDROOMS
    ========================= */

    if (bedrooms !== undefined && bedrooms !== "") {
      const value = Number(bedrooms);

      if (Number.isFinite(value)) {
        filter.bedrooms = value;
      }
    }

    /* =========================
       BATHROOMS
    ========================= */

    if (bathrooms !== undefined && bathrooms !== "") {
      const value = Number(bathrooms);

      if (Number.isFinite(value)) {
        filter.bathrooms = value;
      }
    }

    /* =========================
       MAX OCCUPANTS
    ========================= */

    if (maxOccupants !== undefined && maxOccupants !== "") {
      const value = Number(maxOccupants);

      if (Number.isFinite(value)) {
        filter.maxOccupants = {
          $gte: value,
        };
      }
    }

    /* =========================
       DISTRICT
    ========================= */

    if (district?.trim()) {
      filter.district = {
        $regex: escapeRegex(district.trim()),
        $options: "i",
      };
    }

    /* =========================
       AREA
    ========================= */

    if (minArea || maxArea) {
      filter.area = {};

      if (minArea) {
        const min = Number(minArea);

        if (Number.isFinite(min)) {
          filter.area.$gte = min;
        }
      }

      if (maxArea) {
        const max = Number(maxArea);

        if (Number.isFinite(max)) {
          filter.area.$lte = max;
        }
      }

      if (Object.keys(filter.area).length === 0) {
        delete filter.area;
      }
    }

    /* =========================
       FACILITIES
    ========================= */

    if (furnished === "true") {
      filter.furnished = true;
    }

    if (petFriendly === "true") {
      filter.petFriendly = true;
    }

    if (gym === "true") {
      filter.gym = true;
    }

    if (pool === "true") {
      filter.pool = true;
    }

    /* =========================
       SORT
    ========================= */

    let sortOption = {
      price: 1,
      createdAt: -1,
    };

    if (sort === "price-desc") {
      sortOption = {
        price: -1,
        createdAt: -1,
      };
    }

    if (sort === "area") {
      sortOption = {
        area: -1,
        createdAt: -1,
      };
    }

    if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      };
    }

    /* =========================
       TOTAL
    ========================= */

    const total = await Apartment.countDocuments(filter);

    const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);

    /* =========================
       ACTUAL PAGE
    ========================= */

    const actualPage = totalPages > 0 ? Math.min(safePage, totalPages) : 1;

    const skip = (actualPage - 1) * safeLimit;

    /* =========================
       GET APARTMENTS
    ========================= */

    const apartments = await Apartment.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(safeLimit)
      .lean();

    /* =========================
       RESPONSE
    ========================= */

    res.json({
      apartments,
      pagination: {
        page: actualPage,
        limit: safeLimit,
        total,
        totalPages,
        hasNextPage: actualPage < totalPages,
        hasPrevPage: actualPage > 1,
      },
    });
  } catch (error) {
    console.error("GET APARTMENTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   PUBLIC DETAIL
========================================================= */

export const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id).lean();

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    res.json(apartment);
  } catch (error) {
    console.error("GET APARTMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   DISTRICTS
========================================================= */

export const getDistricts = async (req, res) => {
  try {
    const districts = await Apartment.distinct("district", {
      available: true,
    });

    res.json(districts.filter(Boolean).sort());
  } catch (error) {
    console.error("GET DISTRICTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   ADMIN - GET ALL WITH PAGINATION
========================================================= */

export const getAllApartmentsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "newest" } = req.query;

    /* =========================
       PAGINATION
    ========================= */

    let safePage = Number(page);

    if (!Number.isFinite(safePage) || safePage < 1) {
      safePage = 1;
    }

    safePage = Math.floor(safePage);

    let safeLimit = Number(limit);

    if (!Number.isFinite(safeLimit) || safeLimit < 1) {
      safeLimit = 20;
    }

    safeLimit = Math.floor(safeLimit);

    safeLimit = Math.min(safeLimit, 50);

    /* =========================
       FILTER
    ========================= */

    const filter = buildAdminFilter(req.query);

    /* =========================
       SORT
    ========================= */

    const sortOption = buildSort(sort);

    /* =========================
       TOTAL FILTERED
    ========================= */

    const total = await Apartment.countDocuments(filter);

    const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);

    const actualPage = totalPages > 0 ? Math.min(safePage, totalPages) : 1;

    const skip = (actualPage - 1) * safeLimit;

    /* =========================
       ALL DATA / STATS
    ========================= */

    const [apartments, available, hidden, petFriendly, totalAll, districts] =
      await Promise.all([
        Apartment.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(safeLimit)
          .lean(),

        Apartment.countDocuments({
          available: true,
        }),

        Apartment.countDocuments({
          available: false,
        }),

        Apartment.countDocuments({
          petFriendly: true,
        }),

        Apartment.countDocuments({}),

        Apartment.distinct("district"),
      ]);

    /* =========================
       RESPONSE
    ========================= */

    res.json({
      apartments,

      pagination: {
        page: actualPage,
        limit: safeLimit,
        total,
        totalPages,
        hasNextPage: actualPage < totalPages,
        hasPrevPage: actualPage > 1,
      },

      stats: {
        total: totalAll,
        available,
        hidden,
        petFriendly,
      },

      districts: districts.filter(Boolean).sort(),
    });
  } catch (error) {
    console.error("GET ADMIN APARTMENTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   CREATE
========================================================= */

export const createApartment = async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);

    res.status(201).json({
      message: "Apartment created successfully",
      apartment,
    });
  } catch (error) {
    console.error("CREATE APARTMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE
========================================================= */

export const updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    res.json({
      message: "Apartment updated successfully",
      apartment,
    });
  } catch (error) {
    console.error("UPDATE APARTMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE
========================================================= */

export const deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    res.json({
      message: "Apartment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE APARTMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE AVAILABILITY
========================================================= */

export const updateAvailability = async (req, res) => {
  try {
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({
        message: "available phải là true hoặc false",
      });
    }

    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      {
        available,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    res.json({
      message: "Availability updated successfully",
      apartment,
    });
  } catch (error) {
    console.error("UPDATE AVAILABILITY ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
