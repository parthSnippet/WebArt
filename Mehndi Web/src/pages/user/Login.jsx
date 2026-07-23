import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/authSlice';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaHandSparkles, FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';
import { validateEmail } from '../../utils/validation';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [isAuthenticated, error, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const isEmailValid = formData.email ? validateEmail(formData.email) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    dispatch(login(formData));
  };

  const inputBase = 'w-full px-4 py-3 bg-blue-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all';

  return (
    <div className="min-h-[90vh] flex justify-center items-center px-4 py-12">
      <div className="bg-white border border-blue-200 shadow-2xl p-6 sm:p-10 rounded-3xl w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3"><FaHandSparkles className="text-blue-500 mx-auto" /></div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Welcome Back!</h2>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
            Sign in to your account <FaStar className="text-yellow-500" />
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> Email
            </label>
            <input
              type="text" name="email" value={formData.email}
              onChange={handleChange} onBlur={handleBlur}
              required placeholder="your@email.com"
              className={`${inputBase} ${
                touched.email && formData.email
                  ? isEmailValid ? 'border-green-400' : 'border-red-400'
                  : 'border-blue-200 focus:border-blue-400'
              }`}
            />
            {touched.email && formData.email && !isEmailValid && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-2">
              <FaLock className="text-blue-500" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" value={formData.password}
                onChange={handleChange} onBlur={handleBlur}
                required placeholder="••••••••"
                className={`${inputBase} pr-10 ${
                  touched.password && !formData.password ? 'border-red-400' : 'border-blue-200 focus:border-blue-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched.password && !formData.password && (
              <p className="text-xs text-red-500 mt-1">Password is required</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-bold text-base hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : <><FaStar /> Login</>}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-600 text-sm">
          New here?{' '}
          <Link to="/signup" className="text-blue-500 font-bold hover:text-blue-600 transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
