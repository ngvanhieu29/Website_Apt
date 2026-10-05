import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    ward: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      default: "Da Nang",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },

    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },

    maxOccupants: {
      type: Number,
      required: true,
      min: 1,
    },

    rooms: {
      type: Number,
      required: true,
      min: 1,
    },

    furnished: {
      type: Boolean,
      default: true,
    },

    amenities: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
      default: "",
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    available: {
      type: Boolean,
      default: true,
    },

    gym: {
      type: Boolean,
      default: false,
    },

    petFriendly: {
      type: Boolean,
      default: false,
    },

    pool: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "apartments",
  },
);
// =====================================================
// DATABASE INDEXES
// =====================================================

// Public listing:
// available + price + newest
apartmentSchema.index({
  available: 1,
  price: 1,
  createdAt: -1,
});

// Public filter theo khu vực + giá
apartmentSchema.index({
  available: 1,
  district: 1,
  price: 1,
});

// Public filter theo số phòng ngủ
apartmentSchema.index({
  available: 1,
  bedrooms: 1,
});

// Public sort căn mới nhất
apartmentSchema.index({
  available: 1,
  createdAt: -1,
});

// Admin filter/sort
apartmentSchema.index({
  district: 1,
  price: 1,
});

// Admin sort theo diện tích
apartmentSchema.index({
  area: 1,
  createdAt: -1,
});

apartmentSchema.index({
  area: -1,
  createdAt: -1,
});
export default mongoose.model("Apartment", apartmentSchema);
