import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-menu" ref={menuRef} style={{ position: 'relative' }}>
      <button
        title="Profile"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Toggle profile menu"
        style={{ fontSize: '1.8rem', cursor: 'pointer', backgroundColor: 'transparent' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        😊
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '2.2rem',
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 999
          }}
        >
          <button onClick={() => navigate('/profile')} aria-label="Edit Profile" style={{ display: 'block', marginBottom: '0.5rem', backgroundColor: 'transparent', color: 'inherit' }}>
            Edit Profile
          </button>
          <button onClick={handleLogout} aria-label="Logout" style={{ backgroundColor: 'transparent', color: 'inherit' }}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;