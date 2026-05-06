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
    console.log('🎨 AdminDesigns: Fetching designs with filter:', filter);
    dispatch(fetchDesigns(filter === 'all' ? '' : filter));
  }, [filter, dispatch]);

  // Add logging for designs data
  useEffect(() => {
    console.log('🖼️ AdminDesigns: Designs data updated:', {
      count: designs?.length || 0,
      loading,
      designs: designs?.map(d => ({
        id: d._id,
        title: d.title,
        imageUrl: d.imageUrl,
        category: d.category,
        fullDesign: d
      }))
    });
  }, [designs, loading]);

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Designs</h1>
          <p className="text-white/50 text-sm mt-1">{designs.length} designs total</p>
        </div>
        <Link
          to="/admin/designs/new"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
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
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-5 py-4 text-left text-white/60 font-semibold text-sm">Image</th>
                <th className="px-5 py-4 text-left text-white/60 font-semibold text-sm">Title</th>
                <th className="px-5 py-4 text-left text-white/60 font-semibold text-sm">Category</th>
                <th className="px-5 py-4 text-left text-white/60 font-semibold text-sm">Description</th>
                <th className="px-5 py-4 text-left text-white/60 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((d) => (
                <tr key={d._id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-5 py-4">
                    {console.log('🖼️ Image Debug for design:', {
                      id: d._id,
                      title: d.title,
                      imageUrl: d.imageUrl,
                      fullPath: d.imageUrl ? `http://localhost:5000${d.imageUrl}` : 'No imageUrl',
                      design: d
                    })}
                    <img 
                      src={d.imageUrl} 
                      alt={d.title} 
                      className="w-14 h-14 object-cover rounded-xl"
                      onLoad={() => console.log('✅ Image loaded successfully:', d.imageUrl)}
                      onError={(e) => {
                        console.error('❌ Image failed to load:', {
                          src: e.target.src,
                          imageUrl: d.imageUrl,
                          designId: d._id,
                          error: e
                        });
                      }}
                    />
                  </td>
                  <td className="px-5 py-4 text-white font-semibold">{d.title}</td>
                  <td className="px-5 py-4">
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold capitalize">
                      {d.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-sm">{d.description?.substring(0, 50)}...</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/designs/edit/${d._id}`}
                        className="bg-blue-500/20 text-blue-400 p-2 rounded-lg hover:bg-blue-500/40 transition-all"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/40 transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {designs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-white/40">No designs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDesigns;
