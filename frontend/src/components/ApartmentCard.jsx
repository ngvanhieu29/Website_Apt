import { Link } from "react-router-dom";

import { Bed, Bath, Maximize, Users, MapPin } from "lucide-react";

export default function ApartmentCard({ apartment }) {
  const {
    _id,
    title,
    address,
    ward,
    district,
    price,
    area,
    bedrooms,
    bathrooms,
    maxOccupants,
    images,
    gym,
    pool,
    petFriendly,
    description,
  } = apartment;

  // Hỗ trợ cả ảnh cũ dạng string
  // và ảnh mới dạng { url, publicId }
  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") {
      return image;
    }

    return image.url || "";
  };

  const imageUrl =
    getImageUrl(images?.[0]) ||
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600";

  // 1 USD = 26,000 VND
  const USD_RATE = 26000;

  const formatVND = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const formatUSD = (price) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(price / USD_RATE);
  };

  return (
    <Link to={`/apartment/${_id}`} className="block card group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute flex gap-2 top-3 left-3">
          {petFriendly && (
            <span className="bg-white/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-slate-700">
              Pet Friendly
            </span>
          )}

          {gym && (
            <span className="bg-primary-600/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-white">
              Gym
            </span>
          )}

          {pool && (
            <span className="bg-blue-600/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-white">
              Pool
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute px-3 py-2 text-white rounded-lg bottom-3 right-3 bg-slate-900/80 backdrop-blur">
          <div className="text-sm font-semibold">{formatVND(price)} VND</div>

          <div className="text-xs font-normal opacity-80">
            ≈ {formatUSD(price)} USD /mo
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-primary-600 mb-1.5">
          <MapPin className="w-3.5 h-3.5" />

          <span>
            {ward && `${ward}, `}
            {district}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-1 text-lg font-semibold leading-snug transition text-slate-900 line-clamp-1 group-hover:text-primary-700">
          {title}
        </h3>

        {/* Address */}
        <p className="mb-4 text-sm text-slate-500 line-clamp-1">{address}</p>

        {/* Description */}
        <p className="mb-4 text-sm text-slate-600 line-clamp-3">
          {description}
        </p>

        {/* Stats */}

        <div className="flex items-center justify-between gap-2 text-sm text-slate-600">
          <div
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
            title="Bedrooms"
          >
            <Bed className="w-4 h-4 shrink-0 text-slate-400" />

            <span>
              {bedrooms === 0
                ? "Studio"
                : `${bedrooms} Bedroom${bedrooms > 1 ? "s" : ""}`}
            </span>
          </div>

          <div
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
            title="Bathrooms"
          >
            <Bath className="w-4 h-4 shrink-0 text-slate-400" />

            <span>{bathrooms}</span>
          </div>

          <div
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
            title="Area"
          >
            <Maximize className="w-4 h-4 shrink-0 text-slate-400" />

            <span>{area} m²</span>
          </div>

          <div
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
            title="Max occupants"
          >
            <Users className="w-4 h-4 shrink-0 text-slate-400" />

            <span>{maxOccupants}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
