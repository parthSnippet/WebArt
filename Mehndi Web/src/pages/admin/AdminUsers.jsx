import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUser, FaCrown, FaEnvelope } from 'react-icons/fa';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/users')
      .then((res) => setUsers(res.data.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 min-h-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-600 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['User', 'Email', 'Role', 'Joined'].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-gray-700 font-semibold text-sm">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-black font-bold text-sm flex-shrink-0 shadow-md">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-gray-800 font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaEnvelope className="text-blue-500" /> {u.email}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit border ${
                        u.role === 'admin' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {u.role === 'admin' ? <FaCrown /> : <FaUser />} {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-12 text-gray-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
