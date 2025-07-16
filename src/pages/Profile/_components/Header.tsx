import { FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const goBack = () => {
    navigate(-1);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const menuItems = [
    {
      label: 'Map',
      icon: '🗺️',
      path: '/map',
      description: 'View events on map'
    },
    {
      label: 'Events',
      icon: '📅',
      path: '/events',
      description: 'Create and manage events'
    },
    {
      label: 'Interests',
      icon: '🎯',
      path: '/interests',
      description: 'Select your interests'
    },
    {
      label: 'Profile',
      icon: '👤',
      path: '/profile',
      description: 'Your profile and settings'
    },
    {
      label: 'Settings',
      icon: '⚙️',
      action: () => alert('Settings coming soon! �️'),
      description: 'App settings and preferences'
    },
    {
      label: 'Help',
      icon: '❓',
      action: () => window.open('mailto:help@mittweida-events.com'),
      description: 'Get help and support'
    }
  ];

  const handleMenuItemClick = (item: any) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
    closeMenu();
  };

  return (
    <div className="header-bar">
      <FaArrowLeft className="icon" onClick={goBack} title="Go back" />
      <div className="header-title">{title}</div>
      <div className="menu-container" ref={menuRef}>
        {isMenuOpen ? (
          <FaTimes className="icon" onClick={toggleMenu} title="Close menu" />
        ) : (
          <FaBars className="icon" onClick={toggleMenu} title="Open menu" />
        )}
        
        {isMenuOpen && (
          <div className="dropdown-menu">
            <div className="menu-header">
              <h3>Navigation</h3>
              <p>Choose where to go</p>
            </div>
            <div className="menu-items">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="menu-item"
                  onClick={() => handleMenuItemClick(item)}
                  title={item.description}
                >
                  <span className="menu-item-icon">{item.icon}</span>
                  <div className="menu-item-content">
                    <span className="menu-item-label">{item.label}</span>
                    <span className="menu-item-description">{item.description}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="menu-footer">
              <small>Mittweida Events App</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
