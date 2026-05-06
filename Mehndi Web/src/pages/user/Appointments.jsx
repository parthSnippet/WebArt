import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAppointments, cancelAppointment } from '../../redux/appointmentSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { FaCalendar, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaPalette, FaInbox, FaCommentDots, FaStar, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const statusConfig = {
  approved: { icon: FaCheckCircle, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' },
  cancelled: { icon: FaTimesCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' },
  pending: { icon: FaHourglassHalf, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' },
};

const statusConfigDark = {
  approved: { icon: FaCheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  cancelled: { icon: FaTimesCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  pending: { icon: FaHourglassHalf, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
};

const Appointments = () => {
  const dispatch = useDispatch();
  const { myAppointments, loading } = useSelector((s) => s.appointments);
  const { isDark } = useTheme();

  useEffect(() => { dispatch(fetchMyAppointments()); }, [dispatch]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await dispatch(cancelAppointment(id)).unwrap();
      toast.success('Appointment cancelled');
    } catch (e) {
      toast.error(e || 'Failed to cancel');
    }
  };

  const textPrimary = isDark ? 'text-white' : 'text-purple-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-purple-600';
  const cardClass = isDark 
    ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
    : 'bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg';

  if (loading) return <Loader />;

  return (
    <div className="min-h-[80vh] py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header - Mobile Responsive */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black ${textPrimary} flex items-center gap-2 sm:gap-3`}>
              <FaCalendar className="text-pink-500 text-xl sm:text-2xl lg:text-3xl" /> 
              <span className="leading-tight">My Bookings</span>
            </h1>
            <p className={`${textSecondary} mt-1 text-sm sm:text-base`}>
              {myAppointments.length} total appointment{myAppointments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/book"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-105 w-full sm:w-fit text-sm sm:text-base"
          >
            <FaPlusCircle /> New Booking
          </Link>
        </div>

        {myAppointments.length === 0 ? (
          <div className={`${cardClass} rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center`}>
            <FaInbox className={`text-5xl sm:text-6xl lg:text-7xl mx-auto mb-4 sm:mb-5 ${isDark ? 'text-white/20' : 'text-purple-300'}`} />
            <p className={`${textPrimary} font-black text-xl sm:text-2xl mb-2`}>No bookings yet!</p>
            <p className={`${textSecondary} mb-6 sm:mb-8 text-sm sm:text-base`}>
              Book your first beauty session today <FaStar className="inline text-yellow-500" />
            </p>
            <Link to="/book" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base">
              <FaPalette /> Browse & Book
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {myAppointments.map((a) => {
              const statusConf = isDark ? statusConfigDark : statusConfig;
              const { icon: StatusIcon, color, bg, border } = statusConf[a.status] || statusConf.pending;
              return (
                <div key={a._id} className={`${cardClass} ${border} rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all`}>
                  
                  {/* Card Header - Mobile Stacked */}
                  <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-white/10' : 'border-purple-100'}`}>
                    <span className={`flex items-center gap-2 ${bg} ${color} px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold capitalize w-fit`}>
                      <StatusIcon /> {a.status}
                    </span>
                    <div className={`flex items-center gap-3 sm:gap-4 ${textSecondary} text-xs sm:text-sm`}>
                      <span className="flex items-center gap-1.5">
                        <FaCalendar className="text-pink-500" />
                        <span className="hidden sm:inline">{format(new Date(a.date), 'MMM dd, yyyy')}</span>
                        <span className="sm:hidden">{format(new Date(a.date), 'MMM dd')}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-purple-500" />
                        {a.time}
                      </span>
                    </div>
                  </div>

                  {/* Card Body - Mobile Optimized */}
                  <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">
                    
                    {/* Design Info */}
                    {a.designId && (
                      <div className={`flex items-center gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 ${isDark ? 'bg-white/5' : 'bg-purple-50'}`}>
                        <img
                          src={a.designId.imageUrl}
                          alt={a.designId.title}
                          className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl flex-shrink-0 border ${isDark ? 'border-white/10' : 'border-purple-200'}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`${textPrimary} font-bold text-base sm:text-lg truncate`}>{a.designId.title}</p>
                          <span className="text-pink-500 text-xs sm:text-sm flex items-center gap-1 mt-1">
                            <FaStar className="text-yellow-500" /> Premium Design
                          </span>
                          <span className={`${textSecondary} text-xs capitalize mt-1 block`}>{a.designId.category}</span>
                        </div>
                      </div>
                    )}

                    {/* Custom Design */}
                    {a.customDesignDescription && (
                      <div className={`rounded-xl p-3 sm:p-4 ${isDark ? 'bg-white/5' : 'bg-purple-50'}`}>
                        <p className={`${textSecondary} text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2`}>
                          <FaPalette className="text-pink-500" /> Custom Design Request
                        </p>
                        <p className={`${isDark ? 'text-white/80' : 'text-purple-800'} text-sm leading-relaxed`}>
                          {a.customDesignDescription}
                        </p>
                      </div>
                    )}

                    {/* Admin Remarks */}
                    {a.remarks && (
                      <div className={`rounded-xl p-3 sm:p-4 ${isDark ? 'bg-white/5' : 'bg-purple-50'}`}>
                        <p className={`${textSecondary} text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2`}>
                          <FaCommentDots className="text-purple-500" /> Admin Remarks
                        </p>
                        <p className={`${isDark ? 'text-white/80' : 'text-purple-800'} text-sm leading-relaxed`}>
                          {a.remarks}
                        </p>
                      </div>
                    )}

                    {/* Cancel Button */}
                    {a.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(a._id)}
                        className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto ${
                          isDark 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                            : 'bg-red-100 text-red-600 border border-red-300 hover:bg-red-200'
                        }`}
                      >
                        <FaTimesCircle /> Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;