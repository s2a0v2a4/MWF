import { useNavigate, useLocation } from 'react-router-dom';
const menuItems = [
  { label: 'Profil', path: '/profile', icon: '👤' },
  { label: 'Map', path: '/map', icon: '🗺️' },
  { label: 'Saved Events', path: '/map', icon: '📍' },
  { label: 'Create Event', path: '/events', icon: '🎉' },
];
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {/* <button
        style={{
          position: 'fixed',
          bottom: '7rem',
          right: '1.5rem',
          backgroundColor: '#2e7d32',
          color: 'white',
          width: 190,
          height: 50,
          borderRadius: '30px',
          fontSize: '1.3rem',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 1200,
          boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
        }}
        onClick={() => navigate('/selectlocation')}
      >
        <span style={{ transform: 'translateX(1.5px)' }}>Go to map</span>
      </button> */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100vw',
          background: '#fff',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.07)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0.6rem 0 0.4rem 0',
          zIndex: 1100,
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.path + item.label}
            onClick={() => navigate(item.path)}
            style={{
              background: 'none',
              border: 'none',
              color: location.pathname === item.path ? '#2e7d32' : '#333',
              fontWeight: location.pathname === item.path ? 700 : 500,
              fontSize: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '4px 10px',
              borderBottom: location.pathname === item.path ? '2.5px solid #2e7d32' : '2.5px solid transparent',
              transition: 'all 0.2s',
              minWidth: 60,
            }}
          >
            <span style={{ fontSize: 22, marginBottom: 2 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
};
export default NavBar;
