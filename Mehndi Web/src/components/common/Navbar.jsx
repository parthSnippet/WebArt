import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaSignOutAlt, FaCalendarAlt, FaHome, FaImages,
  FaCrown, FaSpa, FaStar, FaPlusCircle, FaBars, FaTimes, FaUser
} from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-3 sm:px-4 py-2 font-medium transition-all duration-200 rounded-xl text-sm ${
      isActive(path)
        ? isDark ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
        : isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-purple-700 hover:text-purple-900 hover:bg-purple-100'
    }`;

  const navBg = isDark
    ? 'bg-black/20 backdrop-blur-xl border-b border-white/10'
    : 'bg-white/90 backdrop-blur-xl border-b border-purple-200 shadow-sm';

  const logoText = isDark ? 'text-white' : 'text-purple-900';
  const subText = isDark ? 'text-pink-300' : 'text-purple-600';

  return (
    <nav className={`sticky top-0 z-50 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Logo - Responsive */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 sm:p-2.5 rounded-xl shadow-lg group-hover:shadow-pink-500/40 transition-all group-hover:scale-105">
              <FaSpa className="text-lg sm:text-xl text-white" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg sm:text-xl font-black leading-tight ${logoText}`}>Mehndi Studio</span>
              <span className={`text-xs hidden sm:flex items-center gap-1 ${subText}`}>
                <FaStar className="text-xs text-yellow-500" /> Premium Beauty
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}><FaHome className="text-pink-500" /> Home</Link>
            <Link to="/designs" className={navLinkClass('/designs')}><FaImages className="text-purple-500" /> Designs</Link>
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Link to="/appointments" className={navLinkClass('/appointments')}><FaCalendarAlt className="text-pink-500" /> Bookings</Link>
                <Link to="/book" className={navLinkClass('/book')}><FaPlusCircle className="text-green-500" /> Book</Link>
              </>
            )}
          </div>

          {/* Right Side - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl text-xs sm:text-sm hover:shadow-lg hover:shadow-yellow-500/30 transition-all hover:scale-105">
                    <FaCrown className="text-sm" /> <span className="hidden md:inline">Admin</span>
                  </Link>
                ) : (
                  <Link to="/profile" className={`hidden sm:flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl transition-all text-xs sm:text-sm ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-purple-700 hover:text-purple-900 hover:bg-purple-100'}`}>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium hidden md:inline">{user?.name?.split(' ')[0]}</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl text-xs sm:text-sm hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-105">
                  <FaSignOutAlt className="text-sm" /> <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`hidden sm:block px-3 sm:px-4 py-2 font-semibold rounded-xl transition-all text-xs sm:text-sm ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-purple-700 hover:text-purple-900 hover:bg-purple-100'}`}>
                  Login
                </Link>
                <Link to="/signup" className="hidden sm:block px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl text-xs sm:text-sm hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-105">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden p-2 rounded-xl transition-all ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-purple-700 hover:bg-purple-100'}`}>
              {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full screen overlay on small screens */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            
            {/* Mobile menu */}
            <div className={`fixed top-14 sm:top-16 left-0 right-0 lg:hidden ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl border-t ${isDark ? 'border-white/10' : 'border-purple-200'} p-4 space-y-2 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto`}>
              
              {/* Navigation Links */}
              <div className="space-y-1">
                <Link to="/" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/')} w-full justify-start`}>
                  <FaHome className="text-pink-500" /> Home
                </Link>
                <Link to="/designs" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/designs')} w-full justify-start`}>
                  <FaImages className="text-purple-500" /> Designs
                </Link>
                
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' ? (
                      <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-yellow-600 font-bold text-sm w-full rounded-xl hover:bg-yellow-50">
                        <FaCrown /> Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link to="/appointments" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/appointments')} w-full justify-start`}>
                          <FaCalendarAlt className="text-pink-500" /> My Bookings
                        </Link>
                        <Link to="/book" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/book')} w-full justify-start`}>
                          <FaPlusCircle className="text-green-500" /> Book Appointment
                        </Link>
                        <Link to="/profile" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/profile')} w-full justify-start`}>
                          <FaUser className="text-purple-500" /> My Profile
                        </Link>
                      </>
                    )}
                    
                    {/* User info in mobile */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl mt-4 ${isDark ? 'bg-white/10' : 'bg-purple-50'}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-purple-900'}`}>{user?.name}</p>
                        <p className={`text-xs ${isDark ? 'text-white/60' : 'text-purple-600'}`}>{user?.email}</p>
                      </div>
                    </div>
                    
                    <button onClick={handleLogout} className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 mt-2 ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/login')} w-full justify-center py-3`}>
                      Login
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl text-sm w-full">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;