import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { contentService } from '../../services/contentService';
import { FaEdit, FaSave, FaTimes, FaImage } from 'react-icons/fa';

const sections = ['hero', 'header', 'footer'];

const AdminContent = () => {
  const [contents, setContents] = useState({});
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const results = await Promise.allSettled(sections.map((s) => contentService.getContent(s)));
      const map = {};
      results.forEach((r, i) => { map[sections[i]] = r.status === 'fulfilled' ? (r.value?.data || {}) : {}; });
      setContents(map);
    } catch {
      toast.error('Failed to load content');
    }
  };

  const startEdit = (section) => {
    setEditing(section);
    setForm({
      title: contents[section]?.title || '',
      description: contents[section]?.description || '',
      imageUrl: contents[section]?.imageUrl || '',
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await contentService.updateContent(editing, form);
      toast.success(`${editing} section updated`);
      setEditing(null);
      fetchAll();
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Content Manager</h1>
        <p className="text-white/50 text-sm mt-1">Edit website sections dynamically</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map((section) => (
          <div key={section} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold capitalize text-lg">{section} Section</h2>
              <button onClick={() => startEdit(section)} className="bg-pink-500/20 text-pink-400 p-2 rounded-lg hover:bg-pink-500/40 transition-all">
                <FaEdit />
              </button>
            </div>
            {contents[section]?.imageUrl && (
              <img src={contents[section].imageUrl} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
            )}
            <p className="text-white font-semibold mb-1">{contents[section]?.title || <span className="text-white/30 italic">No title set</span>}</p>
            <p className="text-white/50 text-sm line-clamp-2">{contents[section]?.description || <span className="italic">No description set</span>}</p>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-purple-900/90 border border-white/20 rounded-2xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white capitalize">Edit {editing} Section</h2>
              <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Section title" className={inputClass} />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Section description" className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2 flex items-center gap-2"><FaImage /> Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={loading} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60">
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(null)} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
