import { NavLink, useLocation } from 'react-router-dom';
import { Home, Swords, Shield, ShoppingBag, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/battle', icon: Swords, label: '战斗' },
  { path: '/equipment', icon: Shield, label: '装备' },
  { path: '/shop', icon: ShoppingBag, label: '商店' },
  { path: '/settings', icon: Settings, label: '设置' },
];

export function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="container">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="nav-item"
              >
                <motion.div
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                    isActive ? 'text-mint-500' : 'text-coffee-400'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  animate={isActive ? { y: -2 } : { y: 0 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-mint-500' : ''}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 w-8 h-1 bg-mint-400 rounded-full"
                      layoutId="navIndicator"
                    />
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
