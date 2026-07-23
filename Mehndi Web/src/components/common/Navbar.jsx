import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import {
  FaSignOutAlt, FaCalendarAlt, FaHome, FaImages,
  FaCrown, FaPlusCircle, FaBars, FaTimes, FaUser
} from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
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
        ? 'bg-blue-100 text-blue-900'
        : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-blue-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <img src="/logo.png" alt="Mehndi Studio" className="h-14 sm:h-16 w-auto rounded-2xl group-hover:scale-105 transition-all" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}><FaHome className="text-blue-500" /> Home</Link>
            <Link to="/designs" className={navLinkClass('/designs')}><FaImages className="text-blue-600" /> Designs</Link>
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Link to="/appointments" className={navLinkClass('/appointments')}><FaCalendarAlt className="text-blue-500" /> Bookings</Link>
                <Link to="/book" className={navLinkClass('/book')}><FaPlusCircle className="text-green-500" /> Book</Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-400 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-blue-500 transition-all hover:scale-105">
                    <FaCrown className="text-sm" /> <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link to="/profile" className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl transition-all text-xs sm:text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-50">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium hidden md:inline">{user?.name?.split(' ')[0]}</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-400 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-blue-500 transition-all hover:scale-105">
                  <FaSignOutAlt className="text-sm" /> <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block px-3 sm:px-4 py-2 font-semibold rounded-xl transition-all text-xs sm:text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-50">
                  Login
                </Link>
                <Link to="/signup" className="hidden sm:block px-3 sm:px-4 py-2 bg-blue-400 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-blue-500 transition-all hover:scale-105">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl transition-all text-blue-700 hover:bg-blue-50">
              {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            
            <div className="fixed top-14 sm:top-16 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-xl border-t border-blue-200 p-4 space-y-2 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
              
              <div className="space-y-1">
                <Link to="/" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/')} w-full justify-start`}>
                  <FaHome className="text-blue-500" /> Home
                </Link>
                <Link to="/designs" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/designs')} w-full justify-start`}>
                  <FaImages className="text-blue-600" /> Designs
                </Link>
                
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' ? (
                      <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-white text-black font-bold text-sm w-full rounded-xl border border-gray-200 hover:bg-gray-100">
                        <FaCrown /> Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link to="/appointments" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/appointments')} w-full justify-start`}>
                          <FaCalendarAlt className="text-blue-500" /> My Bookings
                        </Link>
                        <Link to="/book" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/book')} w-full justify-start`}>
                          <FaPlusCircle className="text-green-500" /> Book Appointment
                        </Link>
                        <Link to="/profile" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/profile')} w-full justify-start`}>
                          <FaUser className="text-blue-600" /> My Profile
                        </Link>
                      </>
                    )}
                    
                    <div className="flex items-center gap-3 p-4 rounded-xl mt-4 bg-blue-50">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">{user?.name}</p>
                        <p className="text-xs text-blue-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 mt-2 hover:bg-red-50">
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className={`${navLinkClass('/login')} w-full justify-center py-3`}>
                      Login
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-400 text-white font-bold rounded-xl text-sm w-full hover:bg-blue-500">
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