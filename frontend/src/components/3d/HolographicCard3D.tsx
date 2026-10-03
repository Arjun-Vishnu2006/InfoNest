import React, { useState, useRef } from 'react';
import { sounds } from '../../services/soundManager';

interface HolographicCard3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'cyan' | 'gold' | 'emerald';
}

export const HolographicCard3D: React.FC<HolographicCard3DProps> = ({
  children,
  className = '',
  glowColor = 'purple'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const glowStyles = {
    purple: 'hover:shadow-[0_0_35px_rgba(139,92,246,0.3)] border-purple-500/30',
    cyan: 'hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] border-cyan-500/30',
    gold: 'hover:shadow-[0_0_35px_rgba(245,158,11,0.3)] border-amber-500/30',
    emerald: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.3)] border-emerald-500/30'
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25
    });
  };

  const handleMouseEnter = () => {
    sounds.playClick();
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="inline-block w-full transition-transform duration-200"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out, box-shadow 0.3s ease'
        }}
        className={`relative overflow-hidden rounded-2xl glass-panel border ${glowStyles[glowColor]} ${className}`}
      >
        {/* Holographic light sheen */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(139, 92, 246, 0.2) 30%, transparent 70%)`
          }}
        />

        {/* Shimmer gradient line */}
        <div className="pointer-events-none absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-shimmer" />

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
