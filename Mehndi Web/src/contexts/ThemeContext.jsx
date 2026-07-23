import { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Blue and white theme
  const theme = {
    bg: {
      card: 'bg-white border border-blue-200 shadow-lg',
      hover: 'hover:bg-blue-50',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      muted: 'text-gray-600',
      accent: 'text-blue-600',
    },
    button: {
      primary: 'bg-blue-400 text-white hover:bg-blue-500',
      secondary: 'bg-blue-500 text-white hover:bg-blue-600',
      ghost: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
