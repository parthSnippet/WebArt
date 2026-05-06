import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createDesign, updateDesign, fetchDesign } from '../../redux/designSlice';
import toast from 'react-hot-toast';
import { FaUpload, FaImage } from 'react-icons/fa';

const categories = ['mehndi', 'nailart', 'bridal', 'arabic', 'traditional', 'modern'];

const DesignForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDesign } = useSelector((s) => s.designs);

  const [formData, setFormData] = useState({ title: '', description: '', category: 'mehndi' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchDesign(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (id && currentDesign) {
      setFormData({ title: currentDesign.title, description: currentDesign.description, category: currentDesign.category });
      setPreview(currentDesign.imageUrl);
    }
  }, [id, currentDesign]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (image) data.append('image', image);
    try {
      if (id) {
        await dispatch(updateDesign({ id, formData: data })).unwrap();
        toast.success('Design updated');
      } else {
        await dispatch(createDesign(data)).unwrap();
        toast.success('Design created');
      }
      navigate('/admin/designs');
    } catch (e) {
      toast.error(e || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-all";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">{id ? 'Edit Design' : 'Add New Design'}</h1>
        <p className="text-white/50 text-sm mt-1">{id ? 'Update design details' : 'Upload a new design to the gallery'}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-white/70 font-semibold mb-2 text-sm">Title *</label>
          <input
            type="text" name="title" value={formData.title} required placeholder="Enter design title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-white/70 font-semibold mb-2 text-sm">Category *</label>
          <select
            name="category" value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-purple-900 capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/70 font-semibold mb-2 text-sm">Description *</label>
          <textarea
            name="description" value={formData.description} required rows={4} placeholder="Describe this design..."
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block text-white/70 font-semibold mb-2 text-sm">Image {!id && '*'}</label>
          <label className="flex items-center gap-3 bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-pink-500/50 transition-all">
            <FaUpload className="text-pink-400 text-xl" />
            <span className="text-white/60">{image ? image.name : 'Click to upload image'}</span>
            <input type="file" accept="image/*" onChange={handleImageChange} required={!id} className="hidden" />
          </label>
          {preview && (
            <div className="mt-4 relative inline-block">
              <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-xl border border-white/20" />
              <div className="absolute top-2 right-2 bg-black/50 rounded-lg p-1">
                <FaImage className="text-white text-xs" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-60"
          >
            {loading ? 'Saving...' : id ? 'Update Design' : 'Create Design'}
          </button>
          <button
            type="button" onClick={() => navigate('/admin/designs')}
            className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DesignForm;
