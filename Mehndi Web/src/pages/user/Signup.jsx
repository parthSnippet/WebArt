import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../../redux/authSlice';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaStar, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { validateEmail, getPasswordRules, getPasswordStrength, STRENGTH_CONFIG } from '../../utils/validation';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});
  const [showRules, setShowRules] = useState(false);
  const rulesTimerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [isAuthenticated, error, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setShowRules(true);
      clearTimeout(rulesTimerRef.current);
      rulesTimerRef.current = setTimeout(() => setShowRules(false), 3500);
    }
  };

  useEffect(() => () => clearTimeout(rulesTimerRef.current), []);

  const handleBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const passwordRules = getPasswordRules(formData.password);
  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = STRENGTH_CONFIG[passwordStrength] || STRENGTH_CONFIG[0];
  const isEmailValid = formData.email ? validateEmail(formData.email) : null;
  const isPasswordValid = passwordRules.every((r) => r.passed);
  const isConfirmValid = formData.confirmPassword ? formData.password === formData.confirmPassword : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    dispatch(signup(signupData)).unwrap()
      .then((data) => {
        toast.success(`Welcome, ${data.user.name}!`, { duration: 4000 });
        navigate('/');
      })
      .catch(() => {});
  };

  const inputBase = 'w-full px-4 py-3 bg-blue-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all';

  return (
    <div className="min-h-[90vh] flex justify-center items-center px-4 py-12">
      <div className="bg-white border border-blue-200 shadow-2xl p-6 sm:p-10 rounded-3xl w-full max-w-md">

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm">Join us and book your beauty session</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-2">
              <FaUser className="text-blue-500" /> Full Name
            </label>
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} onBlur={handleBlur}
              required placeholder="Your full name"
              className={`${inputBase} ${touched.name && !formData.name ? 'border-red-400' : 'border-blue-200 focus:border-blue-400'}`}
            />
            {touched.name && !formData.name && (
              <p className="text-xs text-red-500 mt-1">Name is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> Email
            </label>
            <div className="relative">
              <input
                type="text" name="email" value={formData.email}
                onChange={handleChange} onBlur={handleBlur}
                required placeholder="your@email.com"
                className={`${inputBase} pr-10 ${
                  touched.email && formData.email
                    ? isEmailValid ? 'border-green-400' : 'border-red-400'
                    : 'border-blue-200 focus:border-blue-400'
                }`}
              />
              {touched.email && formData.email && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isEmailValid
                    ? <FaCheckCircle className="text-green-500" />
                    : <FaTimesCircle className="text-red-500" />}
                </span>
              )}
            </div>
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
                required placeholder="Min 8 characters"
                className={`${inputBase} pr-10 ${
                  touched.password && formData.password
                    ? isPasswordValid ? 'border-green-400' : 'border-red-400'
                    : 'border-blue-200 focus:border-blue-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center justify-center px-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Strength Meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= passwordStrength ? strengthInfo.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-semibold ${strengthInfo.text}`}>{strengthInfo.label}</p>
              </div>
            )}

            {/* Rules checklist */}
            {(showRules && formData.password) && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => (
                  <li key={rule.id} className={`text-xs flex items-center gap-1.5 ${rule.passed ? 'text-green-600' : 'text-red-500'}`}>
                    {rule.passed ? <FaCheckCircle className="flex-shrink-0" /> : <FaTimesCircle className="flex-shrink-0" />}
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-2">
              <FaLock className="text-blue-500" /> Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} onBlur={handleBlur}
                required placeholder="Repeat your password"
                className={`${inputBase} pr-10 ${
                  touched.confirmPassword && formData.confirmPassword
                    ? isConfirmValid ? 'border-green-400' : 'border-red-400'
                    : 'border-blue-200 focus:border-blue-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-2 flex items-center justify-center px-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched.confirmPassword && formData.confirmPassword && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${isConfirmValid ? 'text-green-600' : 'text-red-500'}`}>
                {isConfirmValid
                  ? <><FaCheckCircle /> Passwords match</>
                  : <><FaTimesCircle /> Passwords do not match</>}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-bold text-base hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Creating Account...' : <><FaStar /> Create Account</>}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 font-bold hover:text-blue-600 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
