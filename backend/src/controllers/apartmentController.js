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
  const andConditions = [];

  /* =========================
     SEARCH
  ========================= */

  const keyword = search.trim();

  if (keyword) {
    const safeKeyword = escapeRegex(keyword);

    andConditions.push({
      $or: [
        { title: { $regex: safeKeyword, $options: "i" } },
        { address: { $regex: safeKeyword, $options: "i" } },
        { ward: { $regex: safeKeyword, $options: "i" } },
        { district: { $regex: safeKeyword, $options: "i" } },
        { city: { $regex: safeKeyword, $options: "i" } },
        { description: { $regex: safeKeyword, $options: "i" } },
      ],
    });
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

  if (bedrooms !== undefined && bedrooms !== "" && bedrooms !== "all") {
    const bedroomValues = String(bedrooms)
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const exactBedrooms = [];
    let hasThreePlus = false;

    bedroomValues.forEach((value) => {
      if (value === "3+") {
        hasThreePlus = true;
        return;
      }

      const number = Number(value);

      if (Number.isFinite(number)) {
        exactBedrooms.push(number);
      }
    });

    const bedroomConditions = [];

    if (exactBedrooms.length > 0) {
      bedroomConditions.push({
        bedrooms: {
          $in: exactBedrooms,
        },
      });
    }

    if (hasThreePlus) {
      bedroomConditions.push({
        bedrooms: {
          $gte: 3,
        },
      });
    }

    if (bedroomConditions.length === 1) {
      andConditions.push(bedroomConditions[0]);
    }

    if (bedroomConditions.length > 1) {
      andConditions.push({
        $or: bedroomConditions,
      });
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

  /* =========================
     COMBINE AND CONDITIONS
  ========================= */

  if (andConditions.length > 0) {
    filter.$and = andConditions;
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

    /* =====================================================
       PAGINATION
    ===================================================== */

    let safePage = Number(page);

    if (!Number.isFinite(safePage) || safePage < 1) {
      safePage = 1;
    }

    safePage = Math.floor(safePage);

    let safeLimit = Number(limit);

    if (!Number.isFinite(safeLimit) || safeLimit < 1) {
      safeLimit = 9;
    }

    safeLimit = Math.min(Math.floor(safeLimit), 50);

    /* =====================================================
       FILTER
    ===================================================== */

    const filter = {
      available: true,
    };

    /* =====================================================
       SEARCH
    ===================================================== */

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

    /* =====================================================
       PRICE
    ===================================================== */

    if (minPrice || maxPrice) {
      const price = {};

      if (minPrice) {
        const min = Number(minPrice);

        if (Number.isFinite(min)) {
          price.$gte = min;
        }
      }

      if (maxPrice) {
        const max = Number(maxPrice);

        if (Number.isFinite(max)) {
          price.$lte = max;
        }
      }

      if (Object.keys(price).length > 0) {
        filter.price = price;
      }
    }

    /* =====================================================
       BEDROOMS
    ===================================================== */

    if (bedrooms !== undefined && bedrooms !== "") {
      const bedroomValues = String(bedrooms)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      const exactBedrooms = [];
      let hasThreePlus = false;

      bedroomValues.forEach((value) => {
        if (value === "3+") {
          hasThreePlus = true;
          return;
        }

        const number = Number(value);

        if (Number.isFinite(number)) {
          exactBedrooms.push(number);
        }
      });

      const bedroomConditions = [];

      if (exactBedrooms.length > 0) {
        bedroomConditions.push({
          bedrooms: {
            $in: exactBedrooms,
          },
        });
      }

      if (hasThreePlus) {
        bedroomConditions.push({
          bedrooms: {
            $gte: 3,
          },
        });
      }

      if (bedroomConditions.length === 1) {
        Object.assign(filter, bedroomConditions[0]);
      }

      if (bedroomConditions.length > 1) {
        filter.$and = filter.$and || [];

        filter.$and.push({
          $or: bedroomConditions,
        });
      }
    }

    /* =====================================================
       BATHROOMS
    ===================================================== */

    if (bathrooms !== undefined && bathrooms !== "") {
      const value = Number(bathrooms);

      if (Number.isFinite(value)) {
        filter.bathrooms = value;
      }
    }

    /* =====================================================
       MAX OCCUPANTS
    ===================================================== */

    if (maxOccupants !== undefined && maxOccupants !== "") {
      const value = Number(maxOccupants);

      if (Number.isFinite(value)) {
        filter.maxOccupants = {
          $gte: value,
        };
      }
    }

    /* =====================================================
       DISTRICT
    ===================================================== */

    if (district?.trim()) {
      filter.district = {
        $regex: escapeRegex(district.trim()),
        $options: "i",
      };
    }

    /* =====================================================
       AREA
    ===================================================== */

    if (minArea || maxArea) {
      const area = {};

      if (minArea) {
        const min = Number(minArea);

        if (Number.isFinite(min)) {
          area.$gte = min;
        }
      }

      if (maxArea) {
        const max = Number(maxArea);

        if (Number.isFinite(max)) {
          area.$lte = max;
        }
      }

      if (Object.keys(area).length > 0) {
        filter.area = area;
      }
    }

    /* =====================================================
       FACILITIES
    ===================================================== */

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

    /* =====================================================
       SORT
    ===================================================== */

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

    /* =====================================================
       PAGINATION
    ===================================================== */

    const skip = (safePage - 1) * safeLimit;

    /* =====================================================
       LISTING PROJECTION
       
       Không lấy description + các field không cần thiết
    ===================================================== */

    const listingProjection = {
      title: 1,
      address: 1,
      ward: 1,
      district: 1,
      city: 1,
      price: 1,
      area: 1,
      bedrooms: 1,
      bathrooms: 1,
      maxOccupants: 1,
      rooms: 1,
      furnished: 1,
      amenities: 1,
      images: 1,
      available: 1,
      gym: 1,
      petFriendly: 1,
      pool: 1,
      createdAt: 1,
    };

    /* =====================================================
       DB PERFORMANCE TEST
       
       Chỉ đo khi request có:
       X-Load-Test: true

       Không ảnh hưởng request bình thường.
    ===================================================== */

    const isLoadTest =
      req.headers["x-load-test"] === "true";

    const dbStart = Date.now();

    /* =====================================================
       COUNT + DATA CHẠY SONG SONG
    ===================================================== */

    const [total, apartments] = await Promise.all([
      Apartment.countDocuments(filter),

      Apartment.find(filter)
        .select(listingProjection)
        .sort(sortOption)
        .skip(skip)
        .limit(safeLimit)
        .lean(),
    ]);

    const dbTime = Date.now() - dbStart;

    /* =====================================================
       PERFORMANCE HEADER
    ===================================================== */

    if (isLoadTest) {
      res.set(
        "X-DB-Time",
        String(dbTime),
      );
    }

    /* =====================================================
       PAGINATION RESULT
    ===================================================== */

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / safeLimit);

    const actualPage =
      totalPages > 0
        ? Math.min(safePage, totalPages)
        : 1;

    /* =====================================================
       RESPONSE
    ===================================================== */

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
    console.error(
      "GET APARTMENTS ERROR:",
      error,
    );

    res.status(500).json({
      message: "Failed to get apartments",
    });
  }
};

/* =========================================================
   PUBLIC DETAIL
========================================================= */

export const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(
      req.params.id,
    ).lean();

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    res.json(apartment);
  } catch (error) {
    console.error(
      "GET APARTMENT ERROR:",
      error,
    );

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
    const districts = await Apartment.distinct(
      "district",
      {
        available: true,
      },
    );

    res.json(
      districts
        .filter(Boolean)
        .sort(),
    );
  } catch (error) {
    console.error(
      "GET DISTRICTS ERROR:",
      error,
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   ADMIN - GET ALL WITH PAGINATION
========================================================= */

export const getAllApartmentsAdmin = async (
  req,
  res,
) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "newest",
    } = req.query;

    /* =========================
       PAGINATION
    ========================= */

    let safePage = Number(page);

    if (
      !Number.isFinite(safePage) ||
      safePage < 1
    ) {
      safePage = 1;
    }

    safePage = Math.floor(safePage);

    let safeLimit = Number(limit);

    if (
      !Number.isFinite(safeLimit) ||
      safeLimit < 1
    ) {
      safeLimit = 20;
    }

    safeLimit = Math.floor(safeLimit);
    safeLimit = Math.min(safeLimit, 50);

    /* =========================
       FILTER
    ========================= */

    const filter = buildAdminFilter(
      req.query,
    );

    /* =========================
       SORT
    ========================= */

    const sortOption = buildSort(sort);

    /* =========================
       TOTAL FILTERED
    ========================= */

    const total =
      await Apartment.countDocuments(
        filter,
      );

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / safeLimit);

    const actualPage =
      totalPages > 0
        ? Math.min(
            safePage,
            totalPages,
          )
        : 1;

    const skip =
      (actualPage - 1) *
      safeLimit;

    /* =========================
       ALL DATA / STATS
    ========================= */

    const [
      apartments,
      available,
      hidden,
      petFriendly,
      totalAll,
      districts,
    ] = await Promise.all([
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
        hasNextPage:
          actualPage < totalPages,
        hasPrevPage:
          actualPage > 1,
      },

      stats: {
        total: totalAll,
        available,
        hidden,
        petFriendly,
      },

      districts:
        districts
          .filter(Boolean)
          .sort(),
    });
  } catch (error) {
    console.error(
      "GET ADMIN APARTMENTS ERROR:",
      error,
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   CREATE
========================================================= */

export const createApartment = async (
  req,
  res,
) => {
  try {
    const apartment =
      await Apartment.create(
        req.body,
      );

    res.status(201).json({
      message:
        "Apartment created successfully",
      apartment,
    });
  } catch (error) {
    console.error(
      "CREATE APARTMENT ERROR:",
      error,
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE
========================================================= */

export const updateApartment = async (
  req,
  res,
) => {
  try {
    const apartment =
      await Apartment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );

    if (!apartment) {
      return res.status(404).json({
        message:
          "Apartment not found",
      });
    }

    res.json({
      message:
        "Apartment updated successfully",
      apartment,
    });
  } catch (error) {
    console.error(
      "UPDATE APARTMENT ERROR:",
      error,
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE
========================================================= */

export const deleteApartment = async (
  req,
  res,
) => {
  try {
    const apartment =
      await Apartment.findByIdAndDelete(
        req.params.id,
      );

    if (!apartment) {
      return res.status(404).json({
        message:
          "Apartment not found",
      });
    }

    res.json({
      message:
        "Apartment deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE APARTMENT ERROR:",
      error,
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE AVAILABILITY
========================================================= */

export const updateAvailability = async (
  req,
  res,
) => {
  try {
    const { available } = req.body;

    if (
      typeof available !== "boolean"
    ) {
      return res.status(400).json({
        message:
          "available phải là true hoặc false",
      });
    }

    const apartment =
      await Apartment.findByIdAndUpdate(
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
        message:
          "Apartment not found",
      });
    }

    res.json({
      message:
        "Availability updated successfully",
      apartment,
    });
  } catch (error) {
    console.error(
      "UPDATE AVAILABILITY ERROR:",
      error,
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   TEMP - FAST APARTMENT TEST
========================================================= */

export const testApartmentsFast = async (
  req,
  res,
) => {
  try {
    const apartments =
      await Apartment.find({})
        .limit(9)
        .lean();

    res.json({
      count: apartments.length,
      apartments,
    });
  } catch (error) {
    console.error(
      "Test apartments fast error:",
      error,
    );

    res.status(500).json({
      message:
        "Test apartments failed",
    });
  }
};