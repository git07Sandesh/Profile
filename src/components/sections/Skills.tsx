import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs';

const skills = [
  { 
    category: 'Frontend',
    items: [
      { name: 'React', level: 80 },
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 70 },
      { name: 'HTML/CSS', level: 90 },
    ]
  },
  {
    category: 'Backend & Databases',
    items: [
      { name: 'Node.js', level: 75 },
      { name: 'Express', level: 85 },
      { name: 'MongoDB', level: 90 },
      { name: 'MySQL', level: 75 },
    ]
  },
  {
    category: 'Tools & Others',
    items: [
      { name: 'Git', level: 85 },
      { name: 'Webpack/Vite', level: 80 },
      { name: 'UI/UX Design', level: 75 },
      { name: 'Performance Optimization', level: 85 },
    ]
  }
];

const technologies = [
  'React', 'TypeScript', 'JavaScript', 'C', 'C++', 'Python', 'HTML5', 'CSS3', 'SASS', 'SCSS',
  'Node.js', 'Express', 'MongoDB', 'MySQL','Numpy', 'Pandas', 'Matplotlib', 'Scikit-learn','TensorFlow',
  'Tailwind CSS', 'Three.js', 'Anime.js', 'GSAP', 'Framer Motion', 'AWS', 'Netlify', 'Render', 'Chart.js',
  'Next.js', 'Webpack', 'Vite', 'Git', 'Github', 'Figma', 'Responsive Design',
];

const SkillCategory = ({ category, items, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      anime({
        targets: `.skill-progress-${index}`,
        width: (el, i) => `${items[i].level}%`,
        easing: 'easeInOutQuart',
        duration: 1500,
        delay: anime.stagger(100)
      });

      anime({
        targets: `.skill-number-${index}`,
        innerHTML: (el, i) => [0, items[i].level],
        round: 1,
        easing: 'easeInOutQuart',
        duration: 1500,
        delay: anime.stagger(100)
      });
    }
  }, [inView, items, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 rounded-lg blur-lg opacity-50" />
      <div className="relative bg-white dark:bg-dark-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-xl font-medium mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {category}
        </h3>
        <div className="space-y-4">
          {items.map((skill, i) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 dark:text-gray-200">{skill.name}</span>
                <span className={`skill-number-${index} text-primary-600 dark:text-primary-400 text-sm font-medium`}>
                  0
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`skill-progress-${index} h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full w-0`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-500/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            My Skills
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            I've honed my skills over the years, specializing in frontend development with
            a focus on creating interactive, animated user experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {skills.map((category, index) => (
            <SkillCategory
              key={category.category}
              category={category.category}
              items={category.items}
              index={index}
            />
          ))}
        </div>

        <div ref={ref} className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 rounded-lg blur-lg opacity-50" />
          <div className="relative bg-white dark:bg-dark-800 rounded-lg p-8 shadow-xl">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xl font-medium mb-6 text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            >
              Technologies I Work With
            </motion.h3>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 shadow-sm hover:scale-110 transition-transform duration-300"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;