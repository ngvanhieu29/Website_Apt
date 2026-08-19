import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, default: 'Ho Chi Minh City' },
    price: { type: Number, required: true }, // USD / month
    area: { type: Number, required: true }, // m²
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    maxOccupants: { type: Number, required: true },
    rooms: { type: Number, required: true }, // total rooms
    amenities: [{ type: String }],
    description: { type: String },
    images: [{ type: String }],
    available: { type: Boolean, default: true },
    furnished: { type: Boolean, default: true },
    petFriendly: { type: Boolean, default: false },
    nearMetro: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Apartment', apartmentSchema);
