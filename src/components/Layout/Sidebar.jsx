import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  PlaySquare, 
  Monitor, 
  Menu, 
  X,
  LogOut 
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/media', icon: Upload, label: 'Media Library' },
    { path: '/playlists', icon: PlaySquare, label: 'Playlists' },
    // Devices - Commented out for now, will implement later
    // { path: '/devices', icon: Monitor, label: 'Devices' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-btn"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <h1>SmartVision</h1>
          <p>Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-logout">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <p>Version 1.0.0</p>
          <p>© 2025 SmartVision</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
