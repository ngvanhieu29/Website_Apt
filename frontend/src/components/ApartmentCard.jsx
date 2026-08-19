import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, Users, MapPin } from 'lucide-react';

export default function ApartmentCard({ apartment }) {
  const {
    _id,
    title,
    address,
    district,
    price,
    area,
    bedrooms,
    bathrooms,
    maxOccupants,
    images,
    furnished,
    nearMetro,
     description,
  } = apartment;

  return (
    <Link to={`/apartment/${_id}`} className="card group block">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {furnished && (
            <span className="bg-white/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-slate-700">
              Furnished
            </span>
          )}
          {nearMetro && (
            <span className="bg-primary-600/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-white">
              Near Metro
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
          ${price.toLocaleString()}
          <span className="text-xs font-normal opacity-80">/mo</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-sm text-primary-600 mb-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{district}</span>
        </div>
        <h3 className="font-semibold text-slate-900 text-lg leading-snug mb-1 line-clamp-1 group-hover:text-primary-700 transition">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-1">{address}</p>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">{ description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5" title="Bedrooms">
            <Bed className="w-4 h-4 text-slate-400" />
            <span>{bedrooms === 0 ? 'Studio' : bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Bathrooms">
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Area">
            <Maximize className="w-4 h-4 text-slate-400" />
            <span>{area} m²</span>
          </div>
          <div className="flex items-center gap-1.5" title="Max occupants">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{maxOccupants}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
