import Apartment from '../models/Apartment.js';

// GET /api/apartments
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
      nearMetro,
      sort = 'price',
    } = req.query;

    const filter = { available: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (bathrooms) filter.bathrooms = Number(bathrooms);
    if (maxOccupants) filter.maxOccupants = { $gte: Number(maxOccupants) };
    if (district) filter.district = { $regex: district, $options: 'i' };

    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = Number(minArea);
      if (maxArea) filter.area.$lte = Number(maxArea);
    }

    if (furnished === 'true') filter.furnished = true;
    if (petFriendly === 'true') filter.petFriendly = true;
    if (nearMetro === 'true') filter.nearMetro = true;

    let sortOption = {};
    if (sort === 'price') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'area') sortOption = { area: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const apartments = await Apartment.find(filter).sort(sortOption);
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/apartments/:id
export const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ message: 'Apartment not found' });
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/districts (for filter dropdown)
export const getDistricts = async (req, res) => {
  try {
    const districts = await Apartment.distinct('district');
    res.json(districts.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
