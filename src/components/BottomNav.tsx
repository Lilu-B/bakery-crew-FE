import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠', ariaLabel: 'Home' },
    { path: '/events', label: '📅', ariaLabel: 'Events' },
    { path: '/donations', label: '🐷', ariaLabel: 'Donations' }
    // { path: '/messages', label: '💬', ariaLabel: 'Messages' }
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Bottom navigation"
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '2rem',
        borderTop: '1px solid var(--color-gray)',
        paddingTop: '1rem'
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          aria-label={item.ariaLabel} 
          style={{
            fontSize: '1.5rem',
            background: location.pathname === item.path ? '#eee' : 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;