import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SkillConstellation3DProps {
  skills: string[];
  className?: string;
  height?: number;
}

export const SkillConstellation3D: React.FC<SkillConstellation3DProps> = ({
  skills,
  className = '',
  height = 300
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Nodes
    const nodeCount = Math.max(skills.length, 12);
    const radius = 2.0;
    const positions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      positions.push(pos);

      const geom = new THREE.SphereGeometry(0.1, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x8B5CF6 : 0x06B6D4
      });
      const node = new THREE.Mesh(geom, mat);
      node.position.copy(pos);
      group.add(node);
    }

    // Connect close nodes with lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.25
    });

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < 1.8) {
          const lineGeom = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
          const line = new THREE.Line(lineGeom, lineMat);
          group.add(line);
        }
      }
    }

    // Lighting
    const light = new THREE.PointLight(0x8B5CF6, 2, 10);
    light.position.set(0, 0, 4);
    scene.add(light);

    // Mouse tracking
    let targetX = 0;
    let targetY = 0;
    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.5;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.5;
    };
    mount.addEventListener('mousemove', onMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      group.rotation.y += (targetX - group.rotation.y) * 0.05 + 0.003;
      group.rotation.x += (-targetY - group.rotation.x) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      camera.aspect = nw / height;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [skills, height]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden glass-panel border border-white/10 ${className}`}>
      <div ref={mountRef} style={{ height }} className="w-full" />
      <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-purple-300/80 pointer-events-none">
        Skill Network · {skills.length} Mastered
      </div>
    </div>
  );
};
