import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesigns } from '../../redux/designSlice';
import DesignCard from '../../components/common/DesignCard';
import Loader from '../../components/common/Loader';
import { FaFire, FaSearch, FaPalette, FaGem, FaRing, FaCrown, FaLeaf, FaStar } from 'react-icons/fa';

const categories = [
  { name: 'all', icon: FaStar, label: 'All' },
  { name: 'mehndi', icon: FaLeaf, label: 'Mehndi' },
  { name: 'nailart', icon: FaGem, label: 'Nail Art' },
  { name: 'bridal', icon: FaCrown, label: 'Bridal' },
  { name: 'arabic', icon: FaPalette, label: 'Arabic' },
  { name: 'traditional', icon: FaLeaf, label: 'Traditional' },
  { name: 'modern', icon: FaRing, label: 'Modern' },
];

const Designs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { designs, loading } = useSelector((state) => state.designs);

  useEffect(() => {
    dispatch(fetchDesigns(selectedCategory === 'all' ? '' : selectedCategory));
  }, [selectedCategory, dispatch]);

  const filtered = search.trim()
    ? designs.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
    : designs;

  return (
    <div className="min-h-[90vh] py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-white border border-blue-200 shadow-sm px-4 py-1.5 rounded-full text-blue-700 font-semibold text-sm mb-3">
            <FaFire className="text-orange-500" /> Hot Picks
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Browse Designs
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">Find your perfect style & book instantly!</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="bg-white border border-blue-200 shadow-sm rounded-2xl flex items-center gap-2 px-4 py-2">
            <FaSearch className="text-blue-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for designs..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none py-2 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold px-2"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter — grid on mobile, flex-wrap on desktop */}
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap sm:justify-center gap-2 mb-8">
          {categories.map(({ name, icon: Icon, label }) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-5 py-2.5 sm:py-2.5 rounded-xl sm:rounded-full font-semibold text-xs sm:text-sm transition-all ${
                selectedCategory === name
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Icon className="text-sm sm:text-base" />
              <span className="leading-tight text-center">{label}</span>
            </button>
          ))}
        </div>

        {/* Designs Grid */}
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FaSearch className="text-6xl text-blue-200 mx-auto mb-4" />
            <p className="text-xl text-gray-700 font-semibold">No designs found.</p>
            <p className="text-gray-500 mt-1 text-sm">Try a different category or search term.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((design) => (
                <DesignCard key={design._id} design={design} />
              ))}
            </div>

            <div className="text-center mt-10">
              <button className="bg-white border border-blue-200 text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all inline-flex items-center gap-2 shadow-sm text-sm">
                Load More <FaStar className="text-yellow-500" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Designs;
