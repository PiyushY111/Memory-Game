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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"></script>
<script>
  {`
var setVanta = ()=>{
if (window.VANTA) window.VANTA.GLOBE({
  el: "body",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00
})
}
_strk.push(function() {
  setVanta()
  window.edit_page.Event.subscribe( "Page.beforeNewOneFadeIn", setVanta )
})
  `}
</script>
  </StrictMode>
  // </ToastContainer>
);
