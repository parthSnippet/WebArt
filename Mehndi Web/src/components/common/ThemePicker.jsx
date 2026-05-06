import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaPalette, FaTimes, FaCheck } from 'react-icons/fa';

const ThemePicker = () => {
  const { themeKey, setThemeKey, themes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Theme Options Panel */}
      {open && (
        <div className="absolute bottom-16 right-0 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-56 shadow-2xl">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Choose Theme</p>
          <div className="space-y-2">
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => { setThemeKey(key); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  themeKey === key ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                {/* Color preview dots */}
                <div className="flex gap-1 flex-shrink-0">
                  {t.preview.map((color, i) => (
                    <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <span className="text-white text-sm font-medium flex-1 text-left">{t.name}</span>
                {themeKey === key && <FaCheck className="text-pink-400 text-xs flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/40 hover:scale-110 transition-all"
      >
        {open ? <FaTimes className="text-white" /> : <FaPalette className="text-white" />}
      </button>
    </div>
  );
};

export default ThemePicker;
