import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import {
  FaTachometerAlt, FaImages, FaCalendarAlt, FaEdit,
  FaTags, FaUsers, FaSignOutAlt, FaBars, FaTimes,
  FaSpa, FaStar, FaCrown, FaChevronRight
} from 'react-icons/fa';

const navItems = [
  { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
  { path: '/admin/designs', icon: FaImages, label: 'Manage Designs' },
  { path: '/admin/appointments', icon: FaCalendarAlt, label: 'Appointments' },
  { path: '/admin/categories', icon: FaTags, label: 'Categories' },
  { path: '/admin/content', icon: FaEdit, label: 'Content Manager' },
  { path: '/admin/users', icon: FaUsers, label: 'Users' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 flex-shrink-0 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2.5 rounded-xl flex-shrink-0">
            <FaSpa className="text-xl text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-black text-lg leading-tight">Mehndi Studio</p>
              <p className="text-pink-300 text-xs flex items-center gap-1">
                <FaCrown className="text-yellow-400" /> Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`text-lg flex-shrink-0 ${active ? 'text-white' : 'text-pink-400'}`} />
                {sidebarOpen && (
                  <>
                    <span className="font-semibold flex-1">{label}</span>
                    {active && <FaChevronRight className="text-xs" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-white/50 text-xs flex items-center gap-1">
                  <FaStar className="text-yellow-400 text-xs" /> Admin
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
          >
            <FaSignOutAlt className="flex-shrink-0" />
            {sidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="text-white font-bold text-lg">
            {navItems.find((n) => n.path === location.pathname)?.label || 'Admin Panel'}
          </h1>
          <div className="ml-auto">
            <Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">
              ← View Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
