import React, { useEffect, useRef } from 'react';

interface SimpleFloatingBubblesProps {
  particleCount?: number;
}

const SimpleFloatingBubbles: React.FC<SimpleFloatingBubblesProps> = ({ 
  particleCount = 30 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    console.log(`[SimpleFloatingBubbles] Creating ${particleCount} particles`);

    // Clear existing particles
    container.innerHTML = '';

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Set styles directly
      particle.style.position = 'absolute';
      particle.style.width = (Math.random() * 8 + 4) + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.background = 'rgba(255, 255, 255, 0.6)';
      particle.style.borderRadius = '50%';
      particle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.4)';
      particle.style.animation = `float ${Math.random() * 10 + 10}s infinite linear`;
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.opacity = (Math.random() * 0.6 + 0.3).toString();
      
      container.appendChild(particle);
    }

    console.log(`[SimpleFloatingBubbles] Created ${particleCount} particles successfully`);

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [particleCount]);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};

export default SimpleFloatingBubbles;
