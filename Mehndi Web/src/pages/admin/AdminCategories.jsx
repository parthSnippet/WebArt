import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaTag } from 'react-icons/fa';

const DEFAULT_CATEGORIES = ['mehndi', 'nailart', 'bridal', 'arabic', 'traditional', 'modern'];

const AdminCategories = () => {
  const [categories, setCategories] = useState(
    () => JSON.parse(localStorage.getItem('categories') || JSON.stringify(DEFAULT_CATEGORIES))
  );
  const [newCat, setNewCat] = useState('');

  const save = (updated) => {
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
  };

  const handleAdd = () => {
    const val = newCat.trim().toLowerCase().replace(/\s+/g, '');
    if (!val) return toast.error('Enter a category name');
    if (categories.includes(val)) return toast.error('Category already exists');
    save([...categories, val]);
    setNewCat('');
    toast.success('Category added');
  };

  const handleDelete = (cat) => {
    if (!window.confirm(`Delete "${cat}" category?`)) return;
    save(categories.filter((c) => c !== cat));
    toast.success('Category removed');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-white">Categories</h1>
        <p className="text-white/50 text-sm mt-1">Manage design categories dynamically</p>
      </div>

      {/* Add New */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4">Add New Category</h2>
        <div className="flex gap-3">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. floral, geometric..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-all"
          />
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-pink-500/30 transition-all"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4">All Categories ({categories.length})</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-pink-500/20 p-2 rounded-lg">
                  <FaTag className="text-pink-400 text-sm" />
                </div>
                <span className="text-white font-semibold capitalize">{cat}</span>
              </div>
              <button
                onClick={() => handleDelete(cat)}
                className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/40 transition-all"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
