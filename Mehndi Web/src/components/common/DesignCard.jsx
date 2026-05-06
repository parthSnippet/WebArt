import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaEye } from 'react-icons/fa';

const DesignCard = ({ design }) => {
  const categoryColors = {
    mehndi: 'from-green-400 to-emerald-500',
    nailart: 'from-pink-400 to-rose-500',
    bridal: 'from-purple-400 to-pink-500',
    arabic: 'from-blue-400 to-cyan-500',
    traditional: 'from-orange-400 to-red-500',
    modern: 'from-indigo-400 to-purple-500'
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 group border border-white/20">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img 
          src={design.imageUrl} 
          alt={design.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`bg-gradient-to-r ${categoryColors[design.category] || 'from-gray-400 to-gray-500'} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-md`}>
            {design.category}
          </span>
        </div>

        {/* Favorite Icon */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white hover:scale-110 shadow-md">
          <FaHeart className="text-red-400 text-sm" />
        </div>

        {/* View Button - Only on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            to={`/designs/${design._id}`}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0"
          >
            <FaEye className="text-sm" /> View
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 transition-all">
          {design.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 mb-3 line-clamp-2 text-sm leading-relaxed">
          {design.description}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-semibold text-gray-600">4.9</span>
            <span className="text-xs text-gray-400 ml-1">(124)</span>
          </div>
          <Link
            to={`/book-appointment?design=${design._id}`}
            className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-sm hover:from-purple-600 hover:to-pink-500 transition-all"
          >
            Book →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
