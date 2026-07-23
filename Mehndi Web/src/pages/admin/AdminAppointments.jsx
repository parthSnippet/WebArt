import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAppointments, updateAppointmentStatus } from '../../redux/appointmentSlice';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { FaCalendar, FaClock, FaUser, FaPalette, FaEnvelope } from 'react-icons/fa';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  approved: 'bg-green-100 text-green-700 border border-green-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
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

  const clientMessage = selected?.customDesignDescription?.trim() || 'No additional information provided.';

  return (
    <div className="space-y-5 min-h-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">{appointments.length} total bookings</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm capitalize transition-all ${
              filter === s
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 shadow-sm">
          No appointments found
        </div>
      ) : (
        <>
          {/* ── MOBILE CARDS (hidden on lg+) ── */}
          <div className="flex flex-col gap-4 lg:hidden">
            {appointments.map((a) => (
              <div key={a._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[a.status]}`}>
                    {a.status}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaCalendar className="text-blue-400" />
                      {format(new Date(a.date), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-blue-400" />
                      {a.time}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Customer */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-blue-500 text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-800 font-semibold text-sm truncate">{a.userId?.name}</p>
                      <p className="text-gray-500 text-xs flex items-center gap-1 truncate">
                        <FaEnvelope className="text-gray-400 flex-shrink-0" /> {a.userId?.email}
                      </p>
                    </div>
                  </div>

                  {/* Design */}
                  {a.designId ? (
                    <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                      <img src={a.designId.imageUrl} alt="" className="w-12 h-12 object-cover rounded-lg border border-blue-100 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-gray-800 font-semibold text-sm truncate">{a.designId.title}</p>
                        <p className="text-gray-500 text-xs capitalize">{a.designId.category}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-yellow-50 rounded-xl p-3">
                      <FaPalette className="text-yellow-500" />
                      <span className="text-yellow-700 text-sm font-semibold">Custom Design Request</span>
                    </div>
                  )}

                  {/* Custom description */}
                  {a.customDesignDescription && (
                    <p className="text-gray-600 text-xs bg-gray-50 rounded-xl p-3 leading-relaxed">
                      {a.customDesignDescription}
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                {a.status === 'pending' && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => { setSelected(a); setRemarks(a.remarks || ''); }}
                      className="w-full bg-blue-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
                    >
                      Manage Appointment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── DESKTOP TABLE (hidden below lg) ── */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Customer', 'Design', 'Date & Time', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-gray-700 font-semibold text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a._id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="px-5 py-4">
                        <p className="text-gray-800 font-semibold">{a.userId?.name}</p>
                        <p className="text-gray-500 text-xs">{a.userId?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        {a.designId ? (
                          <div className="flex items-center gap-3">
                            <img src={a.designId.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                            <span className="text-gray-700 text-sm">{a.designId.title}</span>
                          </div>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">Custom</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-800 text-sm">{format(new Date(a.date), 'MMM dd, yyyy')}</p>
                        <p className="text-blue-600 text-sm font-semibold">{a.time}</p>
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
                            className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-all border border-blue-200"
                          >
                            Manage
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Appointment</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <p className="text-gray-800"><span className="text-gray-500">Customer:</span> {selected.userId?.name}</p>
              <p className="text-gray-800"><span className="text-gray-500">Date:</span> {format(new Date(selected.date), 'MMM dd, yyyy')}</p>
              <p className="text-gray-800"><span className="text-gray-500">Time:</span> {selected.time}</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-sm font-bold text-blue-900">Additional Notes</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                {clientMessage}
              </p>
            </div>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Add remarks (optional)"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none mb-4 text-sm"
            />
            <div className="flex gap-3">
              <button onClick={() => handleUpdate(selected._id, 'approved')} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all text-sm">
                Approve
              </button>
              <button onClick={() => handleUpdate(selected._id, 'cancelled')} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all text-sm">
                Cancel
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">
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
