import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export const initHeroAnimation = (canvas: HTMLCanvasElement) => {
  // Scene setup
  const scene = new THREE.Scene();
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
    1.5, // glow strength
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

      const particlesMaterial = new THREE.PointsMaterial({
        size: 1.5,
        map: starTexture,
        alphaMap: starTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: new THREE.Color(0x5D87FF),
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      const clock = new THREE.Clock();

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.x = elapsedTime * 0.03 + mouse.y * 0.001;
        particlesMesh.rotation.y = elapsedTime * 0.05 + mouse.x * 0.001;
        composer.render();
        requestAnimationFrame(animate);
      };

      animate();

      // Add cleanup if needed (e.g., store particlesMesh in outer scope)
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
    renderer.dispose();
  };
};
