import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const projects = [
  {
    title: 'Roadmap.io (IN PROGRESS)',
    description: 'A fully interactive AI-powered roadmap app built with React. Users can create and edit roadmaps, add tasks, and track progress.',
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['React', 'Node.js', 'MongoDB', 'AI', 'Graph'],
    links: {
      live: '#',
      github: '#',
    },
  },
  {
    title: 'E-Commerce Dashboard',
    description: 'A responsive admin dashboard for e-commerce platforms with real-time analytics, inventory management, and sales reporting.',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
    links: {
      live: '#',
      github: '#',
    },
  },
  {
    title: 'Research Paper Parser',
    description: 'A cross-platform mobile application built with .NET MAUI that allows users to upload research papers (PDF/DOCX), extract key information, and generate concise summaries. Features user authentication, document history tracking, and integration with LLM APIs for intelligent summarization. Developed as a collaborative semester project.',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    tags: ['.NET MAUI', 'C#', 'SQLite', 'GEMINI API', 'PDF Parsing'],
    links: {
      live: '#',
      github: 'https://github.com/git07Sandesh/R.Paper-Parser',
    },
  },  
  {
    title: 'Chatty – Real-Time Chat App',
    description: 'A WhatsApp-inspired real-time chat application built with React and Firebase. Features include user authentication, message persistence, and responsive UI. Built as part of a hands-on learning project.',
    image: 'https://images.pexels.com/photos/3394652/pexels-photo-3394652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['React', 'Firebase', 'Authentication', 'Real-Time Database'],
    links: {
      live: 'https://chatty-clone.onrender.com/',
      github: 'https://github.com/git07Sandesh/Chat-App',
    },
  },
  {
    title: "Tara's Restro– Restaurant Landing Page",
    description: 'A modern and responsive landing page built for a local Nepali restaurant. Highlights the menu, location, and contact options with a clean, accessible UI. Designed to provide visitors with essential information and encourage table reservations.',
    image: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tags: ['React', 'JavaScript', 'Responsive Design'],
    links: {
      live: 'https://your-everest-spice-site.com',
      github: 'https://github.com/git07Sandesh/Tara-s-Restro',
    },
  }
    
];

const ProjectCard: React.FC<{ project: typeof projects[0]; index: number }> = ({ project, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-lg bg-white dark:bg-dark-800 shadow-md">
        <div className="overflow-hidden aspect-video">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-3">
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Live Demo
            </a>
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github className="h-4 w-4 mr-1" />
              Source Code
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-dark-900">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Featured Projects</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A selection of my recent work showcasing my design philosophy and technical capabilities.
            Each project reflects my commitment to creating beautiful, functional user experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="#"
            className="inline-flex items-center bg-white dark:bg-dark-800 text-dark-900 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700 px-6 py-3 rounded-lg transition-all duration-300 shadow-sm"
          >
            View All Projects
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;