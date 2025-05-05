import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs';

const timelineItems = [
  {
    year: '2018',
    title: 'Discovered Programming',
    description: 'Started learning the basics of programming using C and Python through coursework and online tutorials.',
    icon: '📘',
  },
  {
    year: '2022',
    title: 'Started Undergraduate Studies',
    description: 'Began my Computer Science degree and explored basic web development by building simple projects like a to-do app, calculator, and personal portfolio using HTML, CSS, and JavaScript.',
    icon: '💡',
  },
  {
    year: '2023',
    title: 'Diving Into Full-Stack',
    description: 'Learned React, Node.js, and MongoDB. Built dynamic applications like a blog platform and food ordering app.',
    icon: '🌐',
  },
  {
    year: '2024',
    title: 'Working on Real-World & Research Projects',
    description: 'Started contributing to more complex projects, including research tools, authentication systems, and AI-powered apps.',
    icon: '🛠️',
  },
  {
    year: '2025',
    title: 'Building a Developer Identity',
    description: 'Focused on polishing my portfolio, contributing to open source, applying for internships, and planning for post-grad goals.',
    icon: '🚀',
  },
];

const About = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const timelineRef = useRef(null);

  useEffect(() => {
    if (inView && timelineRef.current) {
      anime({
        targets: timelineRef.current.querySelectorAll('.timeline-item'),
        translateY: [100, 0],
        opacity: [0, 1],
        scale: [0.95, 1],
        easing: 'easeOutExpo',
        duration: 800,
        delay: anime.stagger(200),
      });
    }
  }, [inView]);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            About Me
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            With over 5 years of experience in frontend development, I've worked on a variety of projects,
            from small business websites to complex web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - intro card */}
          <div className="relative">
            <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-semibold mb-6">
                My Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                I'm passionate about creating intuitive and engaging user experiences. My journey in frontend development
                has been driven by a constant curiosity and desire to push the boundaries of what's possible on the web.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                I specialize in React, TypeScript, and modern CSS techniques, with a strong focus on
                creating performant and accessible websites. I'm also experienced with animation libraries
                like Three.js and Anime.js, which help me create immersive digital experiences.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                When I'm not coding, you can find me exploring new design trends, contributing to open-source projects,
                or sharing my knowledge through blog posts and community engagement.
              </p>
            </div>
          </div>

          {/* Right side - timeline */}
          <div ref={ref} className="relative">
            <div className="relative" ref={timelineRef}>
              {timelineItems.map((item, index) => (
                <div
                  key={index}
                  className="timeline-item mb-12 last:mb-0 relative opacity-0"
                >
                  <div className="absolute -left-3 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
                  <div className="absolute -left-5 top-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 shadow-lg">
                    <span>{item.icon}</span>
                  </div>
                  <div className="ml-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <span className="inline-block bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-400 py-1 px-3 rounded-full text-sm font-medium mb-2">
                      {item.year}
                    </span>
                    <h4 className="text-xl font-medium mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
