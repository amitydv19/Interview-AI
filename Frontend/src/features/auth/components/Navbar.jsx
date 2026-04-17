import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const handleLogoutClick = async () => { 
    await handleLogout();
    navigate('/login');
  };

  return (
    <nav className="interview-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Interview Portal</h2>
        </div>

        <div className="navbar-center">
          <span className="job-title">React Developer</span>
        </div>

        <div className="navbar-right">
          {user && (
            <div className="user-section">
              <div className="user-info">
                <span className="username">{user.username || user.email}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button className="logout-btn" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
