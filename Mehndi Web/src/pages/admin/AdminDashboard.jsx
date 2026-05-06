import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAppointments } from '../../redux/appointmentSlice';
import { fetchDesigns } from '../../redux/designSlice';
import { 
  FaCalendarAlt, FaImages, FaClock, FaCheckCircle, FaChartLine, 
  FaFire, FaPlus, FaEye, FaEdit, FaArrowRight, FaUsers, FaStar,
  FaArrowUp, FaArrowDown, FaBug
} from 'react-icons/fa';
import { format } from 'date-fns';
import ImageDebugger from '../../components/debug/ImageDebugger';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((s) => s.appointments);
  const { designs } = useSelector((s) => s.designs);
  const appointmentsLoading = useSelector(s => s.appointments.loading);
  const appointmentsError = useSelector(s => s.appointments.error);
  const designsLoading = useSelector(s => s.designs.loading);
  const designsError = useSelector(s => s.designs.error);
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    console.log('🚀 AdminDashboard: Dispatching data fetch actions');
    dispatch(fetchAllAppointments());
    dispatch(fetchDesigns());
  }, [dispatch]);

  // Add logging for Redux state
  useEffect(() => {
    console.log('📊 AdminDashboard Redux State:', {
      appointments: {
        count: appointments?.length || 0,
        data: appointments,
        loading: appointmentsLoading,
        error: appointmentsError
      },
      designs: {
        count: designs?.length || 0,
        data: designs,
        loading: designsLoading,
        error: designsError
      }
    });
  }, [appointments, designs, appointmentsLoading, appointmentsError, designsLoading, designsError]);

  const pending = appointments.filter((a) => a.status === 'pending').length;
  const approved = appointments.filter((a) => a.status === 'approved').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;

  const stats = [
    { 
      title: 'Total Designs', 
      value: designs.length, 
      icon: FaImages, 
      gradient: 'from-pink-500 to-rose-600', 
      link: '/admin/designs',
      change: '+12%',
      changeType: 'up'
    },
    { 
      title: 'Total Bookings', 
      value: appointments.length, 
      icon: FaCalendarAlt, 
      gradient: 'from-purple-500 to-indigo-600', 
      link: '/admin/appointments',
      change: '+8%',
      changeType: 'up'
    },
    { 
      title: 'Pending', 
      value: pending, 
      icon: FaClock, 
      gradient: 'from-yellow-500 to-orange-600', 
      link: '/admin/appointments',
      change: '-5%',
      changeType: 'down'
    },
    { 
      title: 'Approved', 
      value: approved, 
      icon: FaCheckCircle, 
      gradient: 'from-green-500 to-emerald-600', 
      link: '/admin/appointments',
      change: '+15%',
      changeType: 'up'
    },
  ];

  const quickActions = [
    { 
      to: '/admin/designs/new', 
      icon: FaPlus, 
      label: 'Add New Design',
      description: 'Upload a new design to gallery',
      gradient: 'from-pink-500 to-purple-600',
      hoverGradient: 'hover:from-pink-600 hover:to-purple-700'
    },
    { 
      to: '/admin/appointments', 
      icon: FaEye, 
      label: 'Manage Bookings',
      description: 'Review and approve appointments',
      gradient: 'from-blue-500 to-cyan-600',
      hoverGradient: 'hover:from-blue-600 hover:to-cyan-700'
    },
    { 
      to: '/admin/content', 
      icon: FaEdit, 
      label: 'Edit Content',
      description: 'Update website content',
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-teal-700'
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Debug Panel Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowDebugger(!showDebugger)}
          className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl font-semibold hover:bg-red-500/30 transition-all"
        >
          <FaBug /> {showDebugger ? 'Hide' : 'Show'} Image Debugger
        </button>
      </div>

      {/* Debug Panel */}
      {showDebugger && (
        <div className="mb-8">
          <ImageDebugger />
        </div>
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl sm:text-4xl animate-bounce">👑</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">Admin Dashboard</h1>
        </div>
        <p className="text-white/60 text-sm sm:text-base">Manage your glam empire ✨</p>
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ title, value, icon: Icon, gradient, link, change, changeType }, index) => (
          <Link
            key={title}
            to={link}
            className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-pink-500/50 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Icon */}
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <Icon className="text-white text-sm sm:text-base" />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1 group-hover:text-pink-200 transition-colors">
                {value}
              </p>
              <p className="text-white/60 font-semibold text-xs sm:text-sm mb-1">{title}</p>
              
              {/* Change Indicator */}
              <div className={`flex items-center gap-1 text-xs font-bold ${
                changeType === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {changeType === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                <span>{change}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
          <FaFire className="text-orange-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map(({ to, icon: Icon, label, description, gradient, hoverGradient }, index) => (
            <Link
              key={to}
              to={to}
              className={`group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${hoverGradient}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8" />
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl`}>
                <Icon className="text-lg sm:text-xl text-white" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-pink-200 transition-colors">
                  {label}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm group-hover:text-white/80 transition-colors">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <FaChartLine className="text-green-400" /> Recent Bookings
          </h2>
          <Link 
            to="/admin/appointments"
            className="text-pink-400 hover:text-pink-300 text-sm font-semibold transition-colors flex items-center gap-1"
          >
            View All <FaArrowRight className="text-xs" />
          </Link>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          {appointments.slice(0, 5).map((a, index) => (
            <div
              key={a._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-pink-500/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* User Info */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                  {a.userId?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-xs sm:text-sm truncate">
                    {a.userId?.name || 'Unknown User'}
                  </p>
                  <p className="text-white/50 text-xs">
                    {format(new Date(a.date), 'MMM dd, yyyy')} at {a.time}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1 w-fit ${
                a.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                a.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {a.status === 'approved' ? <FaCheckCircle /> : 
                 a.status === 'cancelled' ? <FaUsers /> : <FaClock />}
                {a.status}
              </span>
            </div>
          ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <FaCalendarAlt className="text-3xl sm:text-4xl text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-xs sm:text-sm">No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;