import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../../redux/authSlice';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaStar, FaHeart, FaGem } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    dispatch(signup(signupData));
  };

  return (
    <div className="min-h-[90vh] flex justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-10 text-6xl opacity-20 animate-bounce"><FaGem className="text-pink-400" /></div>
      <div className="absolute bottom-20 left-10 text-6xl opacity-20 animate-bounce" style={{animationDelay: '1s'}}><FaHeart className="text-pink-400" /></div>
      
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce"><FaStar className="text-yellow-400 mx-auto" /></div>
          <h2 className="text-4xl font-black text-white mb-2">Join the Glam Fam!</h2>
          <p className="text-white/70 flex items-center justify-center gap-2">Create your account & start your glow up! <FaGem className="text-pink-400" /></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white font-semibold mb-2 flex items-center gap-2">
              <FaUser className="text-pink-400" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your awesome name"
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-500 transition-all backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 flex items-center gap-2">
              <FaEnvelope className="text-pink-400" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-500 transition-all backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 flex items-center gap-2">
              <FaLock className="text-pink-400" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Min 6 characters"
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-500 transition-all backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 flex items-center gap-2">
              <FaLock className="text-pink-400" /> Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-500 transition-all backdrop-blur-sm"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : <><span>Sign Up</span> <FaStar /></>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-400 font-bold hover:text-pink-300 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
