import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApartmentById } from '../api/apartments';

import {
  Bed,
  Bath,
  Maximize,
  Users,
  MapPin,
  ArrowLeft,
  Check,
  Loader2,
} from 'lucide-react';

export default function ApartmentDetail({ onOpenContact }) {
  const { id } = useParams();

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchApartmentById(id)
      .then((data) => {
        setApartment(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading apartment:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="text-center py-40">
        <p className="text-slate-500 text-lg">
          Apartment not found.
        </p>

        <Link
          to="/"
          className="btn-primary inline-block mt-4"
        >
          Back to list
        </Link>
      </div>
    );
  }

  const {
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
    amenities,
    city,
    rooms,
    pool,
    petFriendly,
    description,
  } = apartment;

  // =====================================================
  // IMAGE HELPER
  // Hỗ trợ cả:
  // 1. Ảnh cũ: "https://..."
  // 2. Ảnh Cloudinary: { url, publicId }
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return '';

    if (typeof image === 'string') {
      return image;
    }

    return image.url || '';
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000';

  const currentImage =
    getImageUrl(images?.[activeImage]) ||
    getImageUrl(images?.[0]) ||
    defaultImage;

  // =====================================================
  // PRICE
  // =====================================================

  const USD_RATE = 25000;

  const formatVND = (price) =>
    new Intl.NumberFormat('vi-VN').format(price);

  const formatUSD = (price) =>
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(price / USD_RATE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to apartments
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* =====================================================
            LEFT - IMAGES & DESCRIPTION
        ===================================================== */}

        <div className="lg:col-span-2 space-y-6">
          {/* Main image */}
          <div className="rounded-2xl overflow-hidden bg-slate-100">
  <img
    src={currentImage}
    alt={title}
    className="w-full h-[450px] sm:h-[550px] lg:h-[700px] object-cover"
  />
</div>

          {/* Thumbnails */}
          {images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => {
                const imageUrl = getImageUrl(image);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition ${
                      activeImage === index
                        ? 'border-primary-600'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={imageUrl || defaultImage}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-xl font-semibold mb-3">
              About this apartment
            </h2>

            <p className="text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-xl font-semibold mb-4">
              Amenities
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenities?.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <Check className="w-4 h-4 text-primary-600 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT - INFO CARD
        ===================================================== */}

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
            {/* Location */}
            <div className="flex items-start gap-1.5 text-primary-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />

              <div>
                <div>
                  {ward && `${ward}, `}
                  {district}
                  {city && `, ${city}`}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl font-bold text-slate-900 leading-snug mb-1">
              {title}
            </h1>

            {/* Address */}
            <p className="text-sm text-slate-500 mb-5">
              {address}
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-primary-700">
                {formatVND(price)}

                <span className="text-base font-normal text-slate-500">
                  {' '}
                  VND / month
                </span>
              </div>

              <div className="text-base text-slate-500 mt-1">
                ≈ ${formatUSD(price)} USD / month
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Bedrooms */}
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <Bed className="w-5 h-5 text-primary-600 mx-auto mb-1" />

                <p className="text-sm font-semibold">
                  {bedrooms === 0
                    ? 'Studio'
                    : `${bedrooms} Bed`}
                </p>
              </div>

              {/* Bathrooms */}
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <Bath className="w-5 h-5 text-primary-600 mx-auto mb-1" />

                <p className="text-sm font-semibold">
                  {bathrooms} Bath
                </p>
              </div>

              {/* Area */}
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <Maximize className="w-5 h-5 text-primary-600 mx-auto mb-1" />

                <p className="text-sm font-semibold">
                  {area} m²
                </p>
              </div>

              {/* Occupants */}
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <Users className="w-5 h-5 text-primary-600 mx-auto mb-1" />

                <p className="text-sm font-semibold">
                  Up to {maxOccupants}
                </p>
              </div>
            </div>

            {/* Additional information */}
            <div className="space-y-2 text-sm text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Address</span>

                <span className="font-medium text-slate-800 text-right max-w-[60%]">
                  {address || '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Ward</span>

                <span className="font-medium text-slate-800">
                  {ward || '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>District</span>

                <span className="font-medium text-slate-800">
                  {district || '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total rooms</span>

                <span className="font-medium text-slate-800">
                  {rooms}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Gym</span>

                <span className="font-medium text-slate-800">
                  {gym ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Pet friendly</span>

                <span className="font-medium text-slate-800">
                  {petFriendly ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Pool</span>

                <span className="font-medium text-slate-800">
                  {pool ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Contact */}
            <button
              onClick={onOpenContact}
              className="btn-primary w-full text-center"
            >
              Contact Agent
            </button>

            <p className="text-xs text-center text-slate-400 mt-3">
              Contact information will be available soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}