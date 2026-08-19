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
  Home as HomeIcon,
} from 'lucide-react';

export default function ApartmentDetail() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchApartmentById(id)
      .then((res) => {
        setApartment(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
        <p className="text-slate-500 text-lg">Apartment not found.</p>
        <Link to="/" className="btn-primary inline-block mt-4">
          Back to list
        </Link>
      </div>
    );
  }

  const {
    title,
    address,
    district,
    city,
    price,
    area,
    bedrooms,
    bathrooms,
    maxOccupants,
    rooms,
    amenities,
    description,
    images,
    furnished,
    petFriendly,
    nearMetro,
  } = apartment;

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
        {/* Left - Images & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main image */}
          <div className="rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={images?.[activeImage] || images?.[0]}
              alt={title}
              className="w-full h-[400px] object-cover"
            />
          </div>
          {/* Thumbnails */}
          {images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === i ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-xl font-semibold mb-3">About this apartment</h2>
            <p className="text-slate-600 leading-relaxed">{description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenities?.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-primary-600 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Info card */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-1.5 text-primary-600 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              {district}, {city}
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 leading-snug mb-1">
              {title}
            </h1>
            <p className="text-sm text-slate-500 mb-5">{address}</p>

            <div className="text-3xl font-bold text-primary-700 mb-6">
              ${price.toLocaleString()}
              <span className="text-base font-normal text-slate-500"> / month</span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <Bed className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-semibold">{bedrooms === 0 ? 'Studio' : `${bedrooms} Bed`}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <Bath className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-semibold">{bathrooms} Bath</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <Maximize className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-semibold">{area} m²</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <Users className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-semibold">Up to {maxOccupants}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Total rooms</span>
                <span className="font-medium text-slate-800">{rooms}</span>
              </div>
              <div className="flex justify-between">
                <span>Furnished</span>
                <span className="font-medium text-slate-800">{furnished ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Pet friendly</span>
                <span className="font-medium text-slate-800">{petFriendly ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Near metro</span>
                <span className="font-medium text-slate-800">{nearMetro ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <button className="btn-primary w-full text-center">
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
