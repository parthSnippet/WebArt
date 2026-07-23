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
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-blue-100 flex items-center gap-3">
        <div className="bg-blue-500 p-2.5 rounded-xl flex-shrink-0 shadow-lg">
          <FaSpa className="text-xl text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-gray-800 font-black text-lg leading-tight truncate">Mehndi Studio</p>
          <p className="text-blue-600 text-xs flex items-center gap-1 font-semibold">
            <FaCrown className="text-yellow-500" /> Admin Panel
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                active
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <Icon className={`text-lg flex-shrink-0 ${active ? 'text-white' : 'text-blue-500'}`} />
              <span className="font-semibold text-sm flex-1 truncate">{label}</span>
              {active && <FaChevronRight className="text-xs text-white" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-blue-100">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-gray-800 font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <FaStar className="text-yellow-500 text-xs" /> Admin
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all font-semibold text-sm"
        >
          <FaSignOutAlt className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── DESKTOP SIDEBAR (always visible, lg+) ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-blue-100 shadow-sm fixed left-0 top-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-blue-100 shadow-2xl z-50 lg:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">

        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-blue-100 px-4 md:px-6 py-3 flex items-center gap-3 sticky top-0 z-20">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-600 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <FaBars className="text-xl" />
          </button>

          <h1 className="text-gray-800 font-bold text-lg truncate">
            {navItems.find((n) => n.path === location.pathname)?.label || 'Admin Panel'}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              ← <span className="hidden sm:inline">View Site</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
