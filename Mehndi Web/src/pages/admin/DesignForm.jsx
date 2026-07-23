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

  const inputClass = "w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all";

  return (
    <div className="max-w-2xl space-y-6 min-h-full">
      <div>
        {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{id ? 'Edit Design' : 'Add New Design'}</h1> */}
        <p className="text-gray-600 text-sm mt-1">{id ? 'Update design details' : 'Upload a new design to the gallery'}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Title *</label>
          <input
            type="text" name="title" value={formData.title} required placeholder="Enter design title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Category *</label>
          <select
            name="category" value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-white capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Description *</label>
          <textarea
            name="description" value={formData.description} required rows={4} placeholder="Describe this design..."
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Image {!id && '*'}</label>
          <label className="flex items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
            <FaUpload className="text-blue-500 text-xl" />
            <span className="text-gray-600">{image ? image.name : 'Click to upload image'}</span>
            <input type="file" accept="image/*" onChange={handleImageChange} required={!id} className="hidden" />
          </label>
          {preview && (
            <div className="mt-4 relative inline-block">
              <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-xl border border-gray-200 shadow-md" />
              <div className="absolute top-2 right-2 bg-black/50 rounded-lg p-1">
                <FaImage className="text-white text-xs" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-black py-3 rounded-xl border-2 font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-60 shadow-md"
          >
            {loading ? 'Saving...' : id ? 'Update Design' : 'Create Design'}
          </button>
          <button
            type="button" onClick={() => navigate('/admin/designs')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl border-2 font-bold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DesignForm;
