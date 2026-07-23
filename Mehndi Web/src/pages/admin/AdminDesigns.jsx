import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesigns, deleteDesign } from '../../redux/designSlice';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const categories = ['all', 'mehndi', 'nailart', 'bridal', 'arabic', 'traditional', 'modern'];

const AdminDesigns = () => {
  const dispatch = useDispatch();
  const { designs, loading } = useSelector((s) => s.designs);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchDesigns(filter === 'all' ? '' : filter));
  }, [filter, dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this design?')) return;
    try {
      await dispatch(deleteDesign(id)).unwrap();
      toast.success('Design deleted');
    } catch (e) {
      toast.error(e || 'Failed to delete');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-5 min-h-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Designs</h1>
          <p className="text-gray-500 text-sm mt-1">{designs.length} Total</p>
        </div>
        <Link
          to="/admin/designs/new"
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-sm w-full sm:w-auto justify-center"
        >
          <FaPlus /> Add Design
        </Link>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm capitalize transition-all ${
              filter === c
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {designs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 shadow-sm">
          No designs found
        </div>
      ) : (
        <>
          {/* ── MOBILE CARDS (hidden on lg+) ── */}
          <div className="flex flex-col gap-4 lg:hidden">
            {designs.map((d) => (
              <div key={d._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  {/* Image */}
                  <img
                    src={d.imageUrl}
                    alt={d.title}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                  />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-bold text-base truncate">{d.title}</p>
                    <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border border-blue-200">
                      {d.category}
                    </span>
                    <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {d.description}
                    </p>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex border-t border-gray-100">
                  <Link
                    to={`/admin/designs/edit/${d._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-all border-r border-gray-100"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-red-600 font-semibold text-sm hover:bg-red-50 transition-all"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP TABLE (hidden below lg) ── */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Image', 'Title', 'Category', 'Description', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-gray-700 font-semibold text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {designs.map((d) => (
                    <tr key={d._id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="px-5 py-4">
                        <img
                          src={d.imageUrl}
                          alt={d.title}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                        />
                      </td>
                      <td className="px-5 py-4 text-gray-800 font-semibold">{d.title}</td>
                      <td className="px-5 py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold capitalize border border-blue-200">
                          {d.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm max-w-xs">
                        {d.description?.substring(0, 60)}...
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/designs/edit/${d._id}`}
                            className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-all border border-blue-200"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-all border border-red-200"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDesigns;
