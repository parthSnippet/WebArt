import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clear old localStorage auth data (migrated to sessionStorage)
localStorage.removeItem('user');
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
