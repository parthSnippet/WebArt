import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAppointments, updateAppointmentStatus } from '../../redux/appointmentSlice';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const AdminAppointments = () => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((s) => s.appointments);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    dispatch(fetchAllAppointments(filter === 'all' ? '' : filter));
  }, [filter, dispatch]);

  const handleUpdate = async (id, status) => {
    try {
      await dispatch(updateAppointmentStatus({ id, statusData: { status, remarks } })).unwrap();
      toast.success(`Appointment ${status}`);
      setSelected(null);
      setRemarks('');
    } catch (e) {
      toast.error(e || 'Failed to update');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Appointments</h1>
        <p className="text-white/50 text-sm mt-1">{appointments.length} total bookings</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm capitalize transition-all ${
              filter === s
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Customer', 'Design', 'Date & Time', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-white/60 font-semibold text-sm">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-5 py-4">
                    <p className="text-white font-semibold">{a.userId?.name}</p>
                    <p className="text-white/50 text-xs">{a.userId?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    {a.designId ? (
                      <div className="flex items-center gap-3">
                        <img src={a.designId.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <span className="text-white text-sm">{a.designId.title}</span>
                      </div>
                    ) : (
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">Custom</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white text-sm">{format(new Date(a.date), 'MMM dd, yyyy')}</p>
                    <p className="text-purple-400 text-sm font-semibold">{a.time}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {a.status === 'pending' && (
                      <button
                        onClick={() => { setSelected(a); setRemarks(a.remarks || ''); }}
                        className="bg-pink-500/20 text-pink-400 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-pink-500/40 transition-all"
                      >
                        Manage
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-white/40">No appointments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-purple-900/90 border border-white/20 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-5">Manage Appointment</h2>
            <div className="bg-white/5 rounded-xl p-4 mb-5 space-y-2 text-sm">
              <p className="text-white"><span className="text-white/50">Customer:</span> {selected.userId?.name}</p>
              <p className="text-white"><span className="text-white/50">Date:</span> {format(new Date(selected.date), 'MMM dd, yyyy')}</p>
              <p className="text-white"><span className="text-white/50">Time:</span> {selected.time}</p>
            </div>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Add remarks (optional)"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 resize-none mb-5"
            />
            <div className="flex gap-3">
              <button onClick={() => handleUpdate(selected._id, 'approved')} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all">
                Approve
              </button>
              <button onClick={() => handleUpdate(selected._id, 'cancelled')} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all">
                Cancel
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
