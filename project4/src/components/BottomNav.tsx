import { NavLink } from 'react-router-dom';
import { Home, Utensils, Cat, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: '餐厅' },
  { path: '/menu', icon: Utensils, label: '菜谱' },
  { path: '/cats', icon: Cat, label: '猫咪' },
  { path: '/decor', icon: Palette, label: '装饰' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-rose-100 z-50 shadow-lg">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-300',
                isActive
                  ? 'text-rose-500 scale-110'
                  : 'text-gray-400 hover:text-rose-400'
              )
            }
          >
            <item.icon className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
