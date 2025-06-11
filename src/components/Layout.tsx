import { Outlet } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <>
      <header className="fixed-header" role="banner" aria-label="Bakery Crew Hub name and profile menu">
        <h1>Bakery Crew Hub</h1>
        <ProfileMenu />
      </header>

      <main className="main-content" role="main" aria-live="polite">
        <Outlet /> 
      </main>

      <footer className="fixed-footer" role="contentinfo" aria-label="Main navigation">
        <BottomNav />
      </footer>
    </>
  );
}