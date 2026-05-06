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
  { name: 'modern', icon: FaRing, label: 'Modern' }
];

const Designs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dispatch = useDispatch();
  const { designs, loading } = useSelector((state) => state.designs);

  useEffect(() => {
    const category = selectedCategory === 'all' ? '' : selectedCategory;
    dispatch(fetchDesigns(category));
  }, [selectedCategory, dispatch]);

  return (
    <div className="min-h-[90vh] py-12 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-2 rounded-full text-white font-semibold mb-4 flex items-center gap-2 justify-center w-fit mx-auto">
            <FaFire className="text-orange-400" /> Hot Picks
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 flex items-center justify-center gap-3">
            Browse Designs <FaPalette className="text-pink-400" />
          </h1>
          <p className="text-xl text-white/80">Find your perfect style & book instantly!</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-full flex items-center gap-3">
            <FaSearch className="text-white/50 ml-4" />
            <input
              type="text"
              placeholder="Search for designs..."
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none py-3"
            />
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all">
              Search
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-2xl shadow-pink-500/50'
                    : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <IconComponent />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Designs Grid */}
        {loading ? (
          <Loader />
        ) : designs.length === 0 ? (
          <div className="text-center py-20">
            <FaSearch className="text-8xl text-white/20 mx-auto mb-6" />
            <p className="text-2xl text-white font-semibold">No designs found in this category.</p>
            <p className="text-white/70 mt-2">Try selecting a different category!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {designs.map((design) => (
                <DesignCard key={design._id} design={design} />
              ))}
            </div>
            
            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white/20 transition-all flex items-center gap-2 mx-auto">
                Load More Designs <FaStar className="text-yellow-400" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Designs;
