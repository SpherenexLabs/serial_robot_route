import { Bell, User, Settings } from 'lucide-react';

const Header = ({ title }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h2>{title}</h2>
          <p>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="header-actions">
          {/* Notifications */}
          <button className="header-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          {/* Settings */}
          <button className="header-btn">
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <div className="header-user">
            <div className="header-user-info">
              <p className="header-user-name">Admin User</p>
              <p className="header-user-email">admin@smartvision.com</p>
            </div>
            <div className="header-user-avatar">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
