import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesigns } from '../../redux/designSlice';
import DesignCard from '../../components/common/DesignCard';
import Loader from '../../components/common/Loader';
import { FaStar, FaUsers, FaPalette, FaAward, FaClock, FaCheckCircle, FaArrowRight, FaFire, FaHeart } from 'react-icons/fa';

const Home = () => {
  const dispatch = useDispatch();
  const { designs, loading } = useSelector((state) => state.designs);

  useEffect(() => {
    dispatch(fetchDesigns());
  }, [dispatch]);

  const featuredDesigns = designs.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce"><FaPalette className="text-pink-400" /></div>
        <div className="absolute top-40 right-20 text-6xl opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}><FaStar className="text-yellow-400" /></div>
        <div className="absolute bottom-20 left-20 text-6xl opacity-20 animate-bounce" style={{animationDelay: '1s'}}><FaHeart className="text-pink-400" /></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-block mb-6 animate-pulse">
              <span className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
                <FaFire className="text-orange-400" /> Premium Mehndi & Nail Art Services
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Adorn Your Beauty
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 animate-pulse flex items-center justify-center gap-3">With Tradition <FaStar className="text-yellow-400" /></span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-10 font-medium leading-relaxed flex items-center justify-center gap-2 flex-wrap">
              Experience the art of traditional Mehndi and modern nail designs
              <br />
              by expert artists who bring your vision to life <FaHeart className="text-pink-400 inline" />
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/designs" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <FaPalette /> Explore Designs
              </Link>
              <Link to="/signup" className="px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                Book Appointment <FaArrowRight />
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                <FaUsers className="text-4xl text-pink-400 mx-auto mb-3" />
                <div className="text-4xl font-black text-white mb-2">500+</div>
                <div className="text-white/70 font-semibold">Happy Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                <FaPalette className="text-4xl text-purple-400 mx-auto mb-3" />
                <div className="text-4xl font-black text-white mb-2">100+</div>
                <div className="text-white/70 font-semibold">Unique Designs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                <FaStar className="text-4xl text-yellow-400 mx-auto mb-3" />
                <div className="text-4xl font-black text-white mb-2">4.9</div>
                <div className="text-white/70 font-semibold">Client Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-pink-400 font-semibold text-sm uppercase tracking-wider mb-2 block flex items-center justify-center gap-2">
              <FaPalette /> Our Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
              Featured Designs <FaStar className="text-yellow-400" />
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Handpicked collection of our most popular and trending designs
            </p>
          </div>
          
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredDesigns.map((design) => (
                  <DesignCard key={design._id} design={design} />
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/designs" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105">
                  View All Designs <FaArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
              Why Choose Us? <FaStar className="text-yellow-400" />
            </h2>
            <p className="text-white/70 text-lg">
              Experience excellence in every detail
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Artists</h3>
              <p className="text-white/70 leading-relaxed">
                Certified professionals with years of experience in traditional and modern designs
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quick Booking</h3>
              <p className="text-white/70 leading-relaxed">
                Easy online booking system with instant confirmation and flexible scheduling
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Assured</h3>
              <p className="text-white/70 leading-relaxed">
                Premium products and hygienic practices ensuring your safety and satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 flex items-center justify-center gap-3">
              Ready to Transform Your Look? <FaStar />
            </h2>
            <p className="text-xl text-white/90 mb-8 flex items-center justify-center gap-2">
              Book your appointment today and experience the art of beauty <FaHeart />
            </p>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-10 py-4 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
