import React, { useEffect, useState } from 'react';
import anime from 'animejs';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      
      // Check if the cursor is over a clickable element
      const target = event.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer'
      );
    };
    
    const mouseDownHandler = () => setIsActive(true);
    const mouseUpHandler = () => setIsActive(false);

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    
    // Animate cursor on entry
    anime({
      targets: '.cursor-dot',
      scale: [0, 1],
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 600
    });
    
    anime({
      targets: '.cursor-ring',
      scale: [0, 1],
      opacity: [0, 0.5],
      easing: 'easeOutExpo',
      duration: 800
    });

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mousedown', mouseDownHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, []);

  // Hide on mobile/touch devices
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      <motion.div
        className="cursor-ring fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary-500 pointer-events-none z-50 hidden md:block mix-blend-difference"
        style={{ 
          translateX: position.x - 16,
          translateY: position.y - 16,
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          opacity: isActive ? 0.8 : 0.5,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1
        }}
      />
      <motion.div
        className="cursor-dot fixed top-0 left-0 w-2 h-2 bg-primary-500 rounded-full pointer-events-none z-50 hidden md:block mix-blend-difference"
        style={{ 
          translateX: position.x - 4,
          translateY: position.y - 4,
        }}
        animate={{
          scale: isActive ? 0.5 : 1,
        }}
      />
    </>
  );
};

export default CustomCursor;