import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPopup from '../components/LoginPopup';
import { useNavigate } from 'react-router-dom';

function Layout({ children }) {
  const route = useNavigate()
  const [showLoginPage, setShowLoginPage] = useState(false);

  const handleLoginClick = () => {
    route("/Login")
    // console.log('handleLoginClick called');
    // setShowLoginPage(true);
  };

  const handleCloseLoginPage = () => {
    setShowLoginPage(false);
  };

  return (
    <AuthProvider>
      <Header onLoginClick={handleLoginClick} />
      <main>{children}</main>
      <Footer />
      {/* {showLoginPage && <LoginPopup onClose={handleCloseLoginPage} />} */}
    </AuthProvider>
  );
}

export default Layout;
