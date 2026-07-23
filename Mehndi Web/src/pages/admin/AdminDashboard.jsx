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
      gradient: 'from-blue-500 to-blue-600', 
      link: '/admin/designs',
      change: '+12%',
      changeType: 'up'
    },
    { 
      title: 'Total Bookings', 
      value: appointments.length, 
      icon: FaCalendarAlt, 
      gradient: 'from-indigo-500 to-indigo-600', 
      link: '/admin/appointments',
      change: '+8%',
      changeType: 'up'
    },
    { 
      title: 'Pending', 
      value: pending, 
      icon: FaClock, 
      gradient: 'from-yellow-500 to-orange-500', 
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
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      to: '/admin/appointments', 
      icon: FaEye, 
      label: 'Manage Bookings',
      description: 'Review and approve appointments',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    { 
      to: '/admin/content', 
      icon: FaEdit, 
      label: 'Edit Content',
      description: 'Update website content',
      gradient: 'from-cyan-500 to-cyan-600'
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8 min-h-full">
      
      {/* Debug Panel Toggle */}
      <div className="mb-4 md:mb-6">
        <button
          onClick={() => setShowDebugger(!showDebugger)}
          className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-semibold hover:bg-red-500/30 transition-all text-sm md:text-base"
        >
          <FaBug /> {showDebugger ? 'Hide' : 'Show'} Image Debugger
        </button>
      </div>

      {/* Debug Panel */}
      {showDebugger && (
        <div className="mb-6 md:mb-8">
          <ImageDebugger />
        </div>
      )}

      {/* Header */}
      <div className="mb-4 md:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          {/* <span className="text-2xl md:text-3xl lg:text-4xl">📊</span> */}
          {/* <h1 className="text-xl md:text-3xl lg:text-5xl font-black text-gray-900">Dashboard Overview</h1> */}
        </div>
        {/* <p className="text-gray-700 text-sm md:text-base lg:text-lg font-medium">Welcome back! Here's what's happening today ✨</p> */}
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        {stats.map(({ title, value, icon: Icon, gradient, link, change, changeType }, index) => (
          <Link
            key={title}
            to={link}
            className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-lg p-2 md:p-3 lg:p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-300 shadow-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Icon */}
            <div 
              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: gradient.includes('blue') ? 'linear-gradient(to bottom right, #3b82f6, #2563eb)' :
                           gradient.includes('indigo') ? 'linear-gradient(to bottom right, #6366f1, #4f46e5)' :
                           gradient.includes('yellow') ? 'linear-gradient(to bottom right, #eab308, #f59e0b)' :
                           'linear-gradient(to bottom right, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Icon className="text-white text-xs md:text-sm" style={{ color: 'white', fontSize: '14px' }} />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <p className="text-lg md:text-xl lg:text-2xl font-black text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                {value}
              </p>
              <p className="text-gray-700 font-semibold text-xs md:text-sm mb-1 md:mb-2">{title}</p>
              
              {/* Change Indicator */}
              <div className={`flex items-center gap-1 text-xs font-bold ${
                changeType === 'up' ? 'text-green-600' : 'text-red-600'
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
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-3 md:mb-4 lg:mb-6 flex items-center gap-2">
          <FaFire className="text-orange-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {quickActions.map(({ to, icon: Icon, label, description, gradient }, index) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-lg p-3 md:p-4 text-center hover:border-blue-400 hover:shadow-lg transition-all duration-300 shadow-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon */}
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-lg md:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: gradient.includes('blue') ? 'linear-gradient(to bottom right, #3b82f6, #2563eb)' :
                             gradient.includes('indigo') ? 'linear-gradient(to bottom right, #6366f1, #4f46e5)' :
                             gradient.includes('cyan') ? 'linear-gradient(to bottom right, #06b6d4, #0891b2)' :
                             'linear-gradient(to bottom right, #3b82f6, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Icon className="text-base md:text-lg text-white" style={{ color: 'white', fontSize: '18px' }} />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                  {label}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm group-hover:text-gray-700 transition-colors">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaChartLine className="text-blue-600" /> Recent Bookings
          </h2>
          <Link 
            to="/admin/appointments"
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100"
          >
            View All <FaArrowRight className="text-xs" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {appointments.slice(0, 5).map((a, index) => (
            <div
              key={a._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-gray-100 hover:border-blue-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* User Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-black font-bold text-sm flex-shrink-0 shadow-md">
                  {a.userId?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-800 font-semibold text-sm truncate">
                    {a.userId?.name || 'Unknown User'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {format(new Date(a.date), 'MMM dd, yyyy')} at {a.time}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize flex items-center gap-1 w-fit ${
                a.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                a.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                {a.status === 'approved' ? <FaCheckCircle /> : 
                 a.status === 'cancelled' ? <FaUsers /> : <FaClock />}
                {a.status}
              </span>
            </div>
          ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-8">
              <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;