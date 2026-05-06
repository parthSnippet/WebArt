import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/authSlice';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaHandSparkles, FaStar } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    dispatch(login(formData));
  };

  return (
    <div className="min-h-[90vh] flex justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce"><FaHandSparkles className="text-pink-400" /></div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-bounce" style={{animationDelay: '1s'}}><FaStar className="text-yellow-400" /></div>
      
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce"><FaHandSparkles className="text-pink-400 mx-auto" /></div>
          <h2 className="text-4xl font-black text-white mb-2">Welcome Back!</h2>
          <p className="text-white/70 flex items-center justify-center gap-2">Let's get you glammed up! <FaStar className="text-yellow-400" /></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-500 transition-all backdrop-blur-sm"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : <><span>Login</span> <FaStar /></>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            New here?{' '}
            <Link to="/signup" className="text-pink-400 font-bold hover:text-pink-300 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
