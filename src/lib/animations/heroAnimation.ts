
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export const initHeroAnimation = (canvas: HTMLCanvasElement) => {
  // Scene setup
  const scene = new THREE.Scene();
  const isDark = document.documentElement.classList.contains('dark');
  scene.background = new THREE.Color(isDark ? 0x0a0a0a : 0xfffada);

  // Reference to particle mesh and material for theme updates
  let particlesMesh: THREE.Points | null = null;
  let particlesMaterial: THREE.PointsMaterial | null = null;

  const updateBackground = () => {
    const isDarkNow = document.documentElement.classList.contains('dark');
    scene.background = new THREE.Color(isDarkNow ? 0x0a0a0a : 0xfffada);
    
    if (particlesMaterial) {
      // Update particle material properties
      particlesMaterial.color = new THREE.Color(isDarkNow ? 0x2563eb : 0x3b82f6);
      particlesMaterial.blending = isDarkNow ? THREE.AdditiveBlending : THREE.NormalBlending;
      
      // For more pronounced color changes, you might want to adjust these:
      particlesMaterial.opacity = isDarkNow ? 0.9 : 0.8;
      particlesMaterial.size = isDarkNow ? 2.5 : 2.2;
    }
  };
  
  const observer = new MutationObserver(updateBackground);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 40;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Postprocessing setup
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // glow strength (keeping original value)
    0.4, // radius
    0.1  // threshold
  );
  composer.addPass(bloomPass);

  // Mouse interaction
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Handle resize
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);
    bloomPass.setSize(width, height);
  };

  window.addEventListener('resize', handleResize);
  handleResize(); // Call once initially

  // 🌟 Load star texture THEN initialize scene
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    '/textures/star.png',
    (starTexture) => {
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1500;

      const posArray = new Float32Array(particlesCount * 3);
      const scaleArray = new Float32Array(particlesCount);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 60;
        posArray[i + 1] = (Math.random() - 0.5) * 100;
        posArray[i + 2] = (Math.random() - 0.5) * 20;
        scaleArray[i / 3] = Math.random();
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

      // Create particle material with theme-aware settings
      particlesMaterial = new THREE.PointsMaterial({
        size: 2.5,
        map: starTexture,
        alphaMap: starTexture,
        transparent: true,
        depthWrite: false,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        color: new THREE.Color(isDark ? 0x2563eb : 0x3b82f6), // blue for dark, lighter blue for light
        opacity: isDark ? 0.9 : 0.8,
      });

      particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      const clock = new THREE.Clock();

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        if (particlesMesh) {
          particlesMesh.rotation.x = elapsedTime * 0.3 + mouse.y * 0.009;
          particlesMesh.rotation.y = elapsedTime * 0.5 + mouse.x * 0.009;
        }
        composer.render();
        requestAnimationFrame(animate);
      };

      animate();

      // Run updateBackground once to ensure initial state is correct
      updateBackground();
    },
    undefined,
    (err) => {
      console.error('❌ Failed to load star texture:', err);
    }
  );

  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', () => {});
    observer.disconnect();
    renderer.dispose();
  };
};