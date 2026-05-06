import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAppointments } from '../../redux/appointmentSlice';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaPlusCircle, FaPalette } from 'react-icons/fa';
import { format } from 'date-fns';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { myAppointments } = useSelector((s) => s.appointments);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

  const pending = myAppointments.filter((a) => a.status === 'pending').length;
  const approved = myAppointments.filter((a) => a.status === 'approved').length;
  const cancelled = myAppointments.filter((a) => a.status === 'cancelled').length;

  const stats = [
    { label: 'Total Bookings', value: myAppointments.length, icon: FaCalendarAlt, color: 'from-pink-500 to-purple-600' },
    { label: 'Pending', value: pending, icon: FaClock, color: 'from-yellow-500 to-orange-500' },
    { label: 'Approved', value: approved, icon: FaCheckCircle, color: 'from-green-500 to-teal-500' },
    { label: 'Cancelled', value: cancelled, icon: FaTimesCircle, color: 'from-red-500 to-pink-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-white/50 mt-1">Here's your beauty journey overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="text-white" />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="text-white/50 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/book"
          className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 flex items-center gap-4 hover:shadow-2xl hover:shadow-pink-500/30 transition-all group"
        >
          <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
            <FaPlusCircle className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-white font-black text-lg">Book Appointment</p>
            <p className="text-white/70 text-sm">Schedule your next session</p>
          </div>
        </Link>
        <Link
          to="/designs"
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/20 transition-all group"
        >
          <div className="bg-pink-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
            <FaPalette className="text-pink-400 text-2xl" />
          </div>
          <div>
            <p className="text-white font-black text-lg">Browse Designs</p>
            <p className="text-white/50 text-sm">Explore our gallery</p>
          </div>
        </Link>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Recent Appointments</h2>
          <Link to="/appointments" className="text-pink-400 text-sm hover:text-pink-300 transition-colors">View all →</Link>
        </div>
        <div className="space-y-3">
          {myAppointments.slice(0, 4).map((a) => (
            <div key={a._id} className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl">
              <div>
                <p className="text-white font-semibold text-sm">
                  {a.designId?.title || 'Custom Design'}
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {format(new Date(a.date), 'MMM dd, yyyy')} · {a.time}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                a.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                a.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {a.status}
              </span>
            </div>
          ))}
          {myAppointments.length === 0 && (
            <p className="text-white/30 text-center py-6">No appointments yet. Book your first session!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
