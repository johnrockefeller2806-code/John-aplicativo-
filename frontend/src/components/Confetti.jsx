import React, { useEffect, useState } from 'react';

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
    const newParticles = [];
    
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Confetti;
