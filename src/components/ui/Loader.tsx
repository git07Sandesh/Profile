import React, { useEffect } from 'react';
import anime from 'animejs';

const Loader: React.FC = () => {
  useEffect(() => {
    // Animate the loader elements
    anime({
      targets: '.loader-circle',
      scale: [0, 1],
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 800,
      delay: anime.stagger(150)
    });
    
    anime({
      targets: '.loader-text',
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutExpo',
      duration: 1000,
      delay: 300
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-white dark:bg-dark-900 flex flex-col items-center justify-center z-50">
      <div className="flex space-x-3 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`loader-circle w-4 h-4 rounded-full bg-primary-${500 + i * 100}`}
            style={{ opacity: 0 }}
          ></div>
        ))}
      </div>
      <p className="loader-text text-xl text-dark-800 dark:text-gray-200 font-light tracking-wider" style={{ opacity: 0 }}>
        crafting experiences
      </p>
    </div>
  );
};

export default Loader;