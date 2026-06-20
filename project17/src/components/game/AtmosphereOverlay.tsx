import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AtmosphereOverlay() {
  const [flickerOpacity, setFlickerOpacity] = useState(1);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const flickerInterval = setInterval(() => {
      setFlickerOpacity(0.95 + Math.random() * 0.05);
    }, 500 + Math.random() * 500);

    const shadowInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setShowShadow(true);
        setTimeout(() => setShowShadow(false), 200);
      }
    }, 15000);

    return () => {
      clearInterval(flickerInterval);
      clearInterval(shadowInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        animate={{ opacity: flickerOpacity }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(26, 21, 16, 0.15) 60%, rgba(26, 21, 16, 0.35) 100%)
          `,
        }}
      />
      
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div
        className="absolute inset-0 opacity-05"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(26, 21, 16, 0.05) 3px, rgba(26, 21, 16, 0.05) 6px)',
        }}
      />
      
      {showShadow && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: [0, 0.15, 0], x: ['100%', '50%', '-100%'] }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute top-1/4 w-32 h-64 bg-black/15 blur-xl rounded-full"
        />
      )}
    </div>
  );
}
