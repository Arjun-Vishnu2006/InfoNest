import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { sounds } from '../../services/soundManager';

interface KnowledgeCore3DProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KnowledgeCore3D: React.FC<KnowledgeCore3DProps> = ({ className = '', size = 'md' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 320;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Group to hold all 3D core elements
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Inner glowing faceted core (Icosahedron)
    const innerGeom = new THREE.IcosahedronGeometry(1.1, 1);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x7C3AED, // Violet
      emissive: 0x4C1D95,
      specular: 0xA855F7,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0.88,
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    coreGroup.add(innerCore);

    // 2. Outer holographic wireframe cage
    const outerGeom = new THREE.IcosahedronGeometry(1.55, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerCage = new THREE.Mesh(outerGeom, wireMat);
    coreGroup.add(outerCage);

    // 3. Dual Orbital Energy Rings
    const ringGeom = new THREE.TorusGeometry(1.85, 0.025, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.65,
    });
    const ring1 = new THREE.Mesh(ringGeom, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x10B981, // Emerald
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ringGeom, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    coreGroup.add(ring2);

    // 4. Floating star particles / Knowledge nodes
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.2 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xE2E8F0,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    coreGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8B5CF6, 3, 20);
    pointLight1.position.set(4, 5, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06B6D4, 2.5, 20);
    pointLight2.position.set(-4, -4, 3);
    scene.add(pointLight2);

    // Mouse interactive tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = -y * 1.5;
    };

    mount.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      const speedMultiplier = isHovered.current ? 2.2 : 1.0;

      // Rotations
      innerCore.rotation.x = elapsedTime * 0.35 * speedMultiplier;
      innerCore.rotation.y = elapsedTime * 0.45 * speedMultiplier;

      outerCage.rotation.x = -elapsedTime * 0.2 * speedMultiplier;
      outerCage.rotation.y = -elapsedTime * 0.25 * speedMultiplier;

      ring1.rotation.z = elapsedTime * 0.5 * speedMultiplier;
      ring2.rotation.z = -elapsedTime * 0.4 * speedMultiplier;
      particles.rotation.y = elapsedTime * 0.08;

      coreGroup.rotation.y = mouseX;
      coreGroup.rotation.x = -mouseY;

      // Subtle breath / pulse scale
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.03;
      innerCore.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => {
        isHovered.current = true;
        sounds.playClick();
      }}
      onMouseLeave={() => {
        isHovered.current = false;
      }}
      className={`relative cursor-grab active:cursor-grabbing select-none flex items-center justify-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent pointer-events-none rounded-3xl" />
    </div>
  );
};
