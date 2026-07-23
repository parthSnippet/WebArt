import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaSave, FaShieldAlt } from 'react-icons/fa';
import api from '../../services/api';
import { setCredentials } from '../../redux/authSlice';

const UserProfile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const inputClass = 'w-full border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all focus:outline-none text-sm sm:text-base bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 shadow-sm';

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

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your account details</p>
        </div>

        {/* Avatar Card */}
        <div className="bg-white border border-blue-200 shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-black text-2xl sm:text-3xl flex-shrink-0 shadow-lg">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-center sm:text-left min-w-0 flex-1">
            <p className="text-gray-900 font-black text-xl sm:text-2xl truncate">{user?.name}</p>
            <p className="text-gray-600 text-sm mt-0.5 truncate">{user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize bg-blue-100 text-blue-700">
              <FaUser className="text-xs" /> {user?.role}
            </span>
          </div>
        </div>

        {/* Edit Profile */}
        <form onSubmit={handleProfileUpdate} className="bg-white border border-blue-200 shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
            <FaUser className="text-blue-500" /> Edit Profile
          </h2>
          <div>
            <label className="block text-blue-700 text-sm mb-2">Full Name</label>
            <input 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              placeholder="Your name" 
              className={inputClass} 
            />
          </div>
          <div>
            <label className="block text-blue-700 text-sm mb-2 flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> Email
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-400 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all disabled:opacity-60 text-sm sm:text-base"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordChange} className="bg-white border border-blue-200 shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
            <FaShieldAlt className="text-blue-500" /> Change Password
          </h2>
          {[
            { key: 'current', label: 'Current Password' },
            { key: 'newPass', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-blue-700 text-sm mb-2">{label}</label>
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-60 text-sm sm:text-base"
          >
            <FaLock /> {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default UserProfile;