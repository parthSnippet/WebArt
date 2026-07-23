import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAppointments, cancelAppointment } from '../../redux/appointmentSlice';
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

const Appointments = () => {
  const dispatch = useDispatch();
  const { myAppointments, loading } = useSelector((s) => s.appointments);

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

  if (loading) return <Loader />;

  return (
    <div className="min-h-[80vh] py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
              <FaCalendar className="text-blue-500 text-xl sm:text-2xl lg:text-3xl" /> 
              <span className="leading-tight">My Bookings</span>
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {myAppointments.length} total appointment{myAppointments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/book"
            className="flex items-center justify-center gap-2 bg-blue-400 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-blue-500 transition-all hover:scale-105 w-full sm:w-fit text-sm sm:text-base"
          >
            <FaPlusCircle /> New Booking
          </Link>
        </div>

        {myAppointments.length === 0 ? (
          <div className="bg-white border border-blue-200 shadow-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
            <FaInbox className="text-5xl sm:text-6xl lg:text-7xl mx-auto mb-4 sm:mb-5 text-blue-300" />
            <p className="text-gray-900 font-black text-xl sm:text-2xl mb-2">No bookings yet!</p>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Book your first beauty session today <FaStar className="inline text-yellow-500" />
            </p>
            <Link to="/book" className="inline-flex items-center gap-2 bg-blue-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-500 transition-all hover:scale-105 text-sm sm:text-base">
              <FaPalette /> Browse & Book
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {myAppointments.map((a) => {
              const { icon: StatusIcon, color, bg, border } = statusConfig[a.status] || statusConfig.pending;
              return (
                <div key={a._id} className={`bg-white border ${border} shadow-xl rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl transition-all`}>
                  
                  {/* Card Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-blue-100">
                    <span className={`flex items-center gap-2 ${bg} ${color} px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold capitalize w-fit`}>
                      <StatusIcon /> {a.status}
                    </span>
                    <div className="flex items-center gap-3 sm:gap-4 text-gray-600 text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <FaCalendar className="text-blue-500" />
                        <span className="hidden sm:inline">{format(new Date(a.date), 'MMM dd, yyyy')}</span>
                        <span className="sm:hidden">{format(new Date(a.date), 'MMM dd')}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-blue-600" />
                        {a.time}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">
                    
                    {/* Design Info */}
                    {a.designId && (
                      <div className="flex items-center gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 bg-blue-50">
                        <img
                          src={a.designId.imageUrl}
                          alt={a.designId.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl flex-shrink-0 border border-blue-200"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-900 font-bold text-base sm:text-lg truncate">{a.designId.title}</p>
                          <span className="text-blue-500 text-xs sm:text-sm flex items-center gap-1 mt-1">
                            <FaStar className="text-yellow-500" /> Premium Design
                          </span>
                          <span className="text-gray-600 text-xs capitalize mt-1 block">{a.designId.category}</span>
                        </div>
                      </div>
                    )}

                    {/* Custom Design */}
                    {a.customDesignDescription && (
                      <div className="rounded-xl p-3 sm:p-4 bg-blue-50">
                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FaPalette className="text-blue-500" /> Custom Design Request
                        </p>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {a.customDesignDescription}
                        </p>
                      </div>
                    )}

                    {/* Admin Remarks */}
                    {a.remarks && (
                      <div className="rounded-xl p-3 sm:p-4 bg-blue-50">
                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FaCommentDots className="text-blue-600" /> Admin Remarks
                        </p>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {a.remarks}
                        </p>
                      </div>
                    )}

                    {/* Cancel Button */}
                    {a.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(a._id)}
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto bg-red-100 text-red-600 border border-red-300 hover:bg-red-200"
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