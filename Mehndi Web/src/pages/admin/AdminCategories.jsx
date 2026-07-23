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
    <div className="space-y-6 max-w-2xl min-h-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-600 text-sm mt-1">Manage design categories dynamically</p>
      </div>

      {/* Add New */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-gray-800 font-bold mb-4">Add New Category</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. floral, geometric..."
            className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-sm w-full sm:w-auto"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-gray-800 font-bold mb-4">All Categories ({categories.length})</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center justify-between py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 border border-blue-200 p-2 rounded-lg">
                  <FaTag className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-800 font-semibold capitalize">{cat}</span>
              </div>
              <button
                onClick={() => handleDelete(cat)}
                className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-all border border-red-200"
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
