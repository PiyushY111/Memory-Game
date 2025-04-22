import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './Login.jsx';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  // <ToastContainer>
  <StrictMode>
    <AuthProvider>
      <ToastContainer theme='dark'/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  </StrictMode>
  // </ToastContainer>
);
