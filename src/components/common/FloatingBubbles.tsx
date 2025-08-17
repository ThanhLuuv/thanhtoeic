import React, { useEffect, useRef } from 'react';
import styles from './FloatingBubbles.module.css';

interface FloatingBubblesProps {
  particleCount?: number;
  className?: string;
  variant?: 'bubbles' | 'stars' | 'snow' | 'mixed';
}

const FloatingBubbles: React.FC<FloatingBubblesProps> = ({ 
  particleCount = 50, 
  className = '',
  variant = 'bubbles'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';

    // Create particles based on variant
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Set base class
      particle.className = styles.particle;
      
      // Add variant-specific class
      if (variant === 'stars') {
        particle.classList.add(styles.star);
      } else if (variant === 'snow') {
        particle.classList.add(styles.snowflake);
      } else if (variant === 'mixed') {
        // Randomly assign different types
        const types = [styles.bubble, styles.star, styles.snowflake];
        const randomType = types[Math.floor(Math.random() * types.length)];
        particle.classList.add(randomType);
      } else {
        particle.classList.add(styles.bubble);
      }
      
      // Random horizontal position
      particle.style.left = Math.random() * 100 + '%';
      
      // Random size based on variant - make them bigger for background effect
      let size: number;
      if (variant === 'stars') {
        size = Math.random() * 10 + 5; // 5-15px for stars
      } else if (variant === 'snow') {
        size = Math.random() * 8 + 6; // 6-14px for snow
      } else {
        size = Math.random() * 12 + 8; // 8-20px for bubbles
      }
      
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // Random delay to avoid all particles appearing at once
      particle.style.animationDelay = Math.random() * 15 + 's';
      
      // Random animation duration based on variant
      let duration: number;
      if (variant === 'stars') {
        duration = Math.random() * 8 + 6; // 6-14s for stars
      } else if (variant === 'snow') {
        duration = Math.random() * 12 + 8; // 8-20s for snow
      } else {
        duration = Math.random() * 10 + 10; // 10-20s for bubbles
      }
      
      particle.style.animationDuration = duration + 's';
      
      // Random opacity - make particles more visible for background effect
      particle.style.opacity = (Math.random() * 0.8 + 0.4).toString();
      
      // Random rotation for some particles
      if (Math.random() > 0.5) {
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
      }
      
      container.appendChild(particle);
    }


    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [particleCount, variant]);

  return (
    <div 
      ref={containerRef} 
      className={`${styles.floatingParticles} ${className}`}
      aria-hidden="true"
    />
  );
};

export default FloatingBubbles;
