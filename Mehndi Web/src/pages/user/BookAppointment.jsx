import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesigns } from '../../redux/designSlice';
import { createAppointment } from '../../redux/appointmentSlice';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { FaCalendar, FaClock, FaPalette, FaCheckCircle, FaEdit } from 'react-icons/fa';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { designs } = useSelector((s) => s.designs);
  const { isDark } = useTheme();
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

  const textPrimary = isDark ? 'text-white' : 'text-purple-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-purple-600';
  const textLabel = isDark ? 'text-white/70' : 'text-purple-700';

  const inputClass = `w-full border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all focus:outline-none text-sm sm:text-base ${
    isDark
      ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-pink-500'
      : 'bg-white border-purple-200 text-purple-900 placeholder-purple-400 focus:border-purple-500 shadow-sm'
  }`;

  const cardClass = isDark 
    ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
    : 'bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg';

  const toggleBg = isDark ? 'bg-white/5 border-white/10' : 'bg-purple-50 border-purple-200';

  return (
    <div className="min-h-[80vh] py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header - Mobile Responsive */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black ${textPrimary} mb-2`}>Book Appointment</h1>
          <p className={`${textSecondary} text-sm sm:text-base px-4 sm:px-0`}>Schedule your beauty session with our expert artists</p>
        </div>

        {/* Mode Toggle - Mobile Responsive */}
        <div className={`flex gap-2 sm:gap-3 mb-6 sm:mb-8 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border ${toggleBg}`}>
          {[
            { key: 'design', label: 'Choose Design', icon: FaPalette },
            { key: 'custom', label: 'Custom Request', icon: FaEdit },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
                mode === key
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : isDark ? 'text-white/50 hover:text-white' : 'text-purple-600 hover:text-purple-800'
              }`}
            >
              <Icon className="text-sm sm:text-base" />
              <span className="leading-tight text-center">{label}</span>
            </button>
          ))}
        </div>

        {/* Form - Mobile Responsive */}
        <form onSubmit={handleSubmit} className={`${cardClass} rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6`}>

          {mode === 'design' ? (
            <div>
              <label className={`block ${textLabel} font-semibold mb-2 sm:mb-3 text-sm flex items-center gap-2`}>
                <FaPalette className="text-pink-500" /> Select Design *
              </label>
              <select value={form.designId} onChange={(e) => setForm({ ...form, designId: e.target.value })} required className={inputClass}>
                <option value="" className={isDark ? 'bg-purple-900' : 'bg-white'}>Choose a design...</option>
                {designs.map((d) => (
                  <option key={d._id} value={d._id} className={isDark ? 'bg-purple-900' : 'bg-white'}>
                    {d.title} — {d.category}
                  </option>
                ))}
              </select>

              {/* Design preview - Mobile Responsive */}
              {form.designId && (() => {
                const selected = designs.find(d => d._id === form.designId);
                return selected ? (
                  <div className={`mt-3 flex items-center gap-3 rounded-xl p-3 ${isDark ? 'bg-white/5' : 'bg-purple-50'}`}>
                    <img src={selected.imageUrl} alt={selected.title} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className={`${textPrimary} font-semibold text-sm sm:text-base truncate`}>{selected.title}</p>
                      <p className={`${textSecondary} text-xs capitalize`}>{selected.category}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          ) : (
            <div>
              <label className={`block ${textLabel} font-semibold mb-2 sm:mb-3 text-sm`}>Describe Your Custom Design *</label>
              <textarea
                value={form.customDesignDescription}
                onChange={(e) => setForm({ ...form, customDesignDescription: e.target.value })}
                required rows={4} placeholder="E.g. Bridal full hand mehndi with floral patterns and peacock motifs..."
                className={`${inputClass} resize-none`}
              />
            </div>
          )}

          {/* Date & Time - Mobile Stacked */}
          <div className="space-y-5">
            <div>
              <label className={`block ${textLabel} font-semibold mb-2 sm:mb-3 text-sm flex items-center gap-2`}>
                <FaCalendar className="text-pink-500" /> Date *
              </label>
              <input
                type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]} required
                className={inputClass}
              />
            </div>
            
            <div>
              <label className={`block ${textLabel} font-semibold mb-2 sm:mb-3 text-sm flex items-center gap-2`}>
                <FaClock className="text-pink-500" /> Time Slot *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => setForm({ ...form, time: t })}
                    className={`py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      form.time === t
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : isDark
                          ? 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button - Mobile Full Width */}
          <button
            type="submit" disabled={loading || !form.time}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:shadow-2xl hover:shadow-pink-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;