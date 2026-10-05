import Apartment from '../models/Apartment.js';


// =====================================================
// GET ALL APARTMENTS
// =====================================================

export const getApartments = async (req, res) => {
  try {
    const {
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
  
      sort = 'price',
    } = req.query;

    const filter = {available: true};

    // =========================
    // SEARCH
    // =========================

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          address: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          ward: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          district: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    // =========================
    // PRICE
    // =========================

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // =========================
    // BEDROOMS
    // =========================

    if (bedrooms !== undefined && bedrooms !== '') {
      filter.bedrooms = Number(bedrooms);
    }

    // =========================
    // BATHROOMS
    // =========================

    if (bathrooms !== undefined && bathrooms !== '') {
      filter.bathrooms = Number(bathrooms);
    }

    // =========================
    // MAX OCCUPANTS
    // =========================

    if (maxOccupants) {
      filter.maxOccupants = {
        $gte: Number(maxOccupants),
      };
    }

    // =========================
    // DISTRICT
    // =========================

    if (district) {
      filter.district = {
        $regex: district,
        $options: 'i',
      };
    }

    // =========================
    // AREA
    // =========================

    if (minArea || maxArea) {
      filter.area = {};

      if (minArea) {
        filter.area.$gte = Number(minArea);
      }

      if (maxArea) {
        filter.area.$lte = Number(maxArea);
      }
    }

    // =========================
    // BOOLEAN FILTER
    // =========================

    if (furnished === 'true') {
      filter.furnished = true;
    }

    if (petFriendly === 'true') {
      filter.petFriendly = true;
    }

    if (gym === 'true') {
      filter.gym = true;
    }

    if (pool === 'true') {
      filter.pool = true;
    }

    

    // =========================
    // SORT
    // =========================

    let sortOption = {};

    if (sort === 'price') {
      sortOption = {
        price: 1,
      };
    }

    if (sort === 'price-desc') {
      sortOption = {
        price: -1,
      };
    }

    if (sort === 'area') {
      sortOption = {
        area: -1,
      };
    }

    if (sort === 'newest') {
      sortOption = {
        createdAt: -1,
      };
    }

    console.log('FILTER:', filter);

    const apartments = await Apartment.find(filter)
      .sort(sortOption)
      .lean();

    console.log(
      'APARTMENTS FOUND:',
      apartments.length
    );

    res.json(apartments);
  } catch (error) {
    console.error(
      'GET APARTMENTS ERROR:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// GET APARTMENT BY ID
// =====================================================

export const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(
      req.params.id
    ).lean();

    if (!apartment) {
      return res.status(404).json({
        message: 'Apartment not found',
      });
    }

    res.json(apartment);
  } catch (error) {
    console.error(
      'GET APARTMENT ERROR:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// GET DISTRICTS
// =====================================================

export const getDistricts = async (req, res) => {
  try {
    const districts = await Apartment.distinct(
      'district'
    );

    res.json(districts.sort());
  } catch (error) {
    console.error(
      'GET DISTRICTS ERROR:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// CREATE APARTMENT
// =====================================================

export const createApartment = async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);

    res.status(201).json({
      message: 'Apartment created successfully',
      apartment,
    });
  } catch (error) {
    console.error(
      'CREATE APARTMENT ERROR:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE APARTMENT
// =====================================================

export const updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!apartment) {
      return res.status(404).json({
        message: 'Apartment not found',
      });
    }

    res.json({
      message: 'Apartment updated successfully',
      apartment,
    });
  } catch (error) {
    console.error(
      'UPDATE APARTMENT ERROR:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllApartmentsAdmin = async (req, res) => {
  try {
    const apartments = await Apartment.find({})
      .sort({ createdAt: -1 });

    res.json(apartments);
  } catch (error) {
    console.error('GET ADMIN APARTMENTS ERROR:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// =====================================================
// DELETE APARTMENT
// =====================================================

export const deleteApartment = async (req, res) => {
  try {
    const apartment =
      await Apartment.findByIdAndDelete(
        req.params.id
      );

    if (!apartment) {
      return res.status(404).json({
        message: 'Apartment not found',
      });
    }

    res.json({
      message: 'Apartment deleted successfully',
    });
  } catch (error) {
    console.error(
      'DELETE APARTMENT ERROR:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE AVAILABILITY
// =====================================================

export const updateAvailability = async (
  req,
  res
) => {
  try {
    const { available } = req.body;

    if (typeof available !== 'boolean') {
      return res.status(400).json({
        message: 'available phải là true hoặc false',
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
        }
      );

    if (!apartment) {
      return res.status(404).json({
        message: 'Apartment not found',
      });
    }

    res.json({
      message: 'Availability updated successfully',
      apartment,
    });
  } catch (error) {
    console.error(
      'UPDATE AVAILABILITY ERROR:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};