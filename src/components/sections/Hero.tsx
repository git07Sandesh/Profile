import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { initHeroAnimation } from '../../lib/animations/heroAnimation';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initHeroAnimation(canvasRef.current);
      return cleanup;
    }
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ zIndex: 0 }}
      />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <span className="bg-primary-500/10 text-primary-700 dark:text-primary-400 py-1 px-3 rounded-full text-sm font-medium">
              Full Stack Developer
            </span>
            <span className="bg-primary-500/10 text-primary-700 dark:text-primary-400 py-1 px-3 rounded-full text-sm font-medium">
              ML Enthusiast
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6"
          >
            Crafting digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              experiences
            </span> that <br />
            inspire.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl"
          >
            I'm Sandesh, a creative developer focused on building 
            beautiful, interactive websites and applications with cutting-edge technologies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="group bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              View My Work
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="#contact"
              className="group bg-white dark:bg-dark-800 text-dark-900 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700 px-6 py-3 rounded-lg flex items-center transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              Contact Me
              <ArrowDownRight className="ml-2 h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <a
            href="#about"
            className="flex flex-col items-center text-dark-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors duration-300"
            aria-label="Scroll down"
          >
            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
              <motion.div
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-1.5 h-1.5 bg-current rounded-full mt-2"
              ></motion.div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;