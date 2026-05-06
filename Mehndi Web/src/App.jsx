import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { useSocket } from './hooks/useSocket';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Layouts
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Designs from './pages/user/Designs';
import DesignDetail from './pages/user/DesignDetail';

// User Pages
import Appointments from './pages/user/Appointments';
import BookAppointment from './pages/user/BookAppointment';
import UserProfile from './pages/user/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDesigns from './pages/admin/AdminDesigns';
import DesignForm from './pages/admin/DesignForm';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminContent from './pages/admin/AdminContent';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';

const PublicLayout = ({ children }) => {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900'
        : 'bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100'
    }`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

function AppContent() {
  useSocket();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
        <Route path="/designs" element={<PublicLayout><Designs /></PublicLayout>} />
        <Route path="/designs/:id" element={<PublicLayout><DesignDetail /></PublicLayout>} />

        {/* User Routes (Protected - normal layout, NO sidebar) */}
        <Route path="/appointments" element={<ProtectedRoute><PublicLayout><Appointments /></PublicLayout></ProtectedRoute>} />
        <Route path="/book" element={<ProtectedRoute><PublicLayout><BookAppointment /></PublicLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PublicLayout><UserProfile /></PublicLayout></ProtectedRoute>} />

        {/* Admin Routes (sidebar layout) */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="designs" element={<AdminDesigns />} />
          <Route path="designs/new" element={<DesignForm />} />
          <Route path="designs/edit/:id" element={<DesignForm />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;