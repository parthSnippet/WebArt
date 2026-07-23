import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesigns } from '../../redux/designSlice';
import { createAppointment } from '../../redux/appointmentSlice';
import toast from 'react-hot-toast';
import { FaCalendar, FaClock, FaPalette, FaCheckCircle, FaEdit } from 'react-icons/fa';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { designs } = useSelector((s) => s.designs);
  const [mode, setMode] = useState('design');
  const [form, setForm] = useState({ designId: '', date: '', time: '', customDesignDescription: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { dispatch(fetchDesigns()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = mode === 'design'
        ? { designId: form.designId, date: form.date, time: form.time }
        : { date: form.date, time: form.time, customDesignDescription: form.customDesignDescription };
      await dispatch(createAppointment(data)).unwrap();
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (e) {
      toast.error(e || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border rounded-xl px-4 py-3 transition-all focus:outline-none text-base bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 shadow-sm';

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600 text-base">Schedule your beauty session with our expert artists</p>
        </div>

        {/* Mode Toggle - FIXED: Both buttons visible */}
        <div className="flex gap-3 mb-8 p-1.5 rounded-2xl border bg-white shadow-md border-blue-200">
          <button
            onClick={() => setMode('design')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              mode === 'design'
                ? 'bg-blue-400 text-white shadow-lg'
                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
            }`}
          >
            <FaPalette className="text-base" />
            <span>Choose Design</span>
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              mode === 'custom'
                ? 'bg-blue-400 text-white shadow-lg'
                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
            }`}
          >
            <FaEdit className="text-base" />
            <span>Custom Request</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-blue-200 shadow-xl rounded-2xl p-8 space-y-6">

          {mode === 'design' ? (
            <div>
              <label className="block text-blue-700 font-semibold mb-3 text-sm flex items-center gap-2">
                <FaPalette className="text-blue-500" /> Select Design *
              </label>
              <select value={form.designId} onChange={(e) => setForm({ ...form, designId: e.target.value })} required className={inputClass}>
                <option value="" className="bg-white">Choose a design...</option>
                {designs.map((d) => (
                  <option key={d._id} value={d._id} className="bg-white">
                    {d.title} — {d.category}
                  </option>
                ))}
              </select>

              {/* Design preview */}
              {form.designId && (() => {
                const selected = designs.find(d => d._id === form.designId);
                return selected ? (
                  <div className="mt-3 flex items-center gap-3 rounded-xl p-3 bg-blue-50 border border-blue-100">
                    <img src={selected.imageUrl} alt={selected.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0 shadow-md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 font-semibold text-base truncate">{selected.title}</p>
                      <p className="text-gray-600 text-xs capitalize">{selected.category}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          ) : (
            <div>
              <label className="block text-blue-700 font-semibold mb-3 text-sm">Describe Your Custom Design *</label>
              <textarea
                value={form.customDesignDescription}
                onChange={(e) => setForm({ ...form, customDesignDescription: e.target.value })}
                required rows={4} placeholder="E.g. Bridal full hand mehndi with floral patterns and peacock motifs..."
                className={`${inputClass} resize-none`}
              />
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-blue-700 font-semibold mb-3 text-sm flex items-center gap-2">
              <FaCalendar className="text-blue-500" /> Date *
            </label>
            <input
              type="date" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]} required
              className={inputClass}
            />
          </div>
          
          {/* Time Slot */}
          <div>
            <label className="block text-blue-700 font-semibold mb-3 text-sm flex items-center gap-2">
              <FaClock className="text-blue-500" /> Time Slot *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t} type="button"
                  onClick={() => setForm({ ...form, time: t })}
                  className={`py-3 px-3 rounded-xl text-sm font-bold transition-all ${
                    form.time === t
                      ? 'bg-blue-400 text-white shadow-lg scale-105'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 hover:scale-105'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit" disabled={loading || !form.time}
            className="w-full bg-blue-400 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
