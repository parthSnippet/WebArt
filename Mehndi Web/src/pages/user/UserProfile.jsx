import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaSave, FaShieldAlt, FaMoon, FaSun, FaPalette } from 'react-icons/fa';
import api from '../../services/api';
import { setCredentials } from '../../redux/authSlice';

const UserProfile = () => {
  const { user } = useSelector((s) => s.auth);
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const inputClass = `w-full border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all focus:outline-none text-sm sm:text-base ${
    isDark
      ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-pink-500'
      : 'bg-white border-purple-200 text-purple-900 placeholder-purple-400 focus:border-purple-500 shadow-sm'
  }`;

  const cardClass = isDark 
    ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
    : 'bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg';

  const textPrimary = isDark ? 'text-white' : 'text-purple-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-purple-600';
  const textLabel = isDark ? 'text-white/60' : 'text-purple-700';

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', form);
      dispatch(setCredentials({ user: res.data.data }));
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.newPass.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.current, newPassword: passwords.newPass });
      toast.success('Password changed successfully');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch {
      toast.error('Current password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">

        {/* Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black ${textPrimary}`}>My Profile</h1>
          <p className={`${textSecondary} mt-1 text-sm sm:text-base`}>Manage your account details</p>
        </div>

        {/* Avatar Card - Mobile Responsive */}
        <div className={`${cardClass} rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5`}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl sm:text-3xl flex-shrink-0 shadow-lg shadow-pink-500/30">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-center sm:text-left min-w-0 flex-1">
            <p className={`${textPrimary} font-black text-xl sm:text-2xl truncate`}>{user?.name}</p>
            <p className={`${textSecondary} text-sm mt-0.5 truncate`}>{user?.email}</p>
            <span className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
              isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
            }`}>
              <FaUser className="text-xs" /> {user?.role}
            </span>
          </div>
        </div>

        {/* Theme Toggle - Mobile Responsive */}
        <div className={`${cardClass} rounded-xl sm:rounded-2xl p-4 sm:p-6`}>
          <h2 className={`${textPrimary} font-bold text-lg flex items-center gap-2 mb-3 sm:mb-4`}>
            <FaPalette className="text-pink-500" /> Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 mr-4">
              <p className={`${textPrimary} font-semibold text-sm sm:text-base`}>Theme Mode</p>
              <p className={`${textSecondary} text-xs sm:text-sm`}>Choose your preferred color scheme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-all flex-shrink-0 ${
                isDark ? 'bg-purple-600' : 'bg-purple-300'
              }`}
            >
              <div className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                isDark ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
              }`}>
                {isDark ? <FaMoon className="text-purple-600 text-xs" /> : <FaSun className="text-yellow-500 text-xs" />}
              </div>
            </button>
          </div>
        </div>

        {/* Edit Profile - Mobile Responsive */}
        <form onSubmit={handleProfileUpdate} className={`${cardClass} rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5`}>
          <h2 className={`${textPrimary} font-bold text-lg flex items-center gap-2`}>
            <FaUser className="text-pink-500" /> Edit Profile
          </h2>
          <div>
            <label className={`block ${textLabel} text-sm mb-2`}>Full Name</label>
            <input 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              placeholder="Your name" 
              className={inputClass} 
            />
          </div>
          <div>
            <label className={`block ${textLabel} text-sm mb-2 flex items-center gap-2`}>
              <FaEnvelope className="text-pink-500" /> Email
            </label>
            <input 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              placeholder="your@email.com" 
              className={inputClass} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-60 text-sm sm:text-base"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Change Password - Mobile Responsive */}
        <form onSubmit={handlePasswordChange} className={`${cardClass} rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5`}>
          <h2 className={`${textPrimary} font-bold text-lg flex items-center gap-2`}>
            <FaShieldAlt className="text-pink-500" /> Change Password
          </h2>
          {[
            { key: 'current', label: 'Current Password' },
            { key: 'newPass', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={`block ${textLabel} text-sm mb-2`}>{label}</label>
              <input
                type="password" 
                value={passwords[key]} 
                placeholder="••••••••"
                onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                className={inputClass}
              />
            </div>
          ))}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-60 text-sm sm:text-base"
          >
            <FaLock /> {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default UserProfile;