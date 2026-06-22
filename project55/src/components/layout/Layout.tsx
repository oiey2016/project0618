import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-grain">
      <Header />
      <main className="flex-1 container py-4 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
