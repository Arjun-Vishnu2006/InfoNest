import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoadmapMilestone } from '../../types';
import { sounds } from '../../services/soundManager';

interface RoadmapNodes3DProps {
  milestones: RoadmapMilestone[];
  activeMilestoneId: string;
  onSelectMilestone: (id: string) => void;
  className?: string;
}

export const RoadmapNodes3D: React.FC<RoadmapNodes3DProps> = ({
  milestones,
  activeMilestoneId,
  onSelectMilestone,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef(activeMilestoneId);
  selectedIdRef.current = activeMilestoneId;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Nodes group
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x8B5CF6, 3, 20);
    pointLight.position.set(0, 3, 6);
    scene.add(pointLight);

    // Calculate node positions in an arc/wave
    const nodeCount = milestones.length;
    const nodeMeshes: { id: string; mesh: THREE.Mesh; ring: THREE.Mesh; pos: THREE.Vector3 }[] = [];
    const positions: THREE.Vector3[] = [];

    const spacing = 2.4;
    const startX = -((nodeCount - 1) * spacing) / 2;

    milestones.forEach((m, idx) => {
      const x = startX + idx * spacing;
      const y = Math.sin(idx * 1.1) * 0.8;
      const z = Math.cos(idx * 0.9) * 0.5;
      const pos = new THREE.Vector3(x, y, z);
      positions.push(pos);

      // Node sphere
      let color = 0x64748B; // locked
      let emissive = 0x1E293B;
      if (m.status === 'completed') {
        color = 0x10B981; // emerald
        emissive = 0x065F46;
      } else if (m.status === 'in-progress') {
        color = 0x8B5CF6; // violet
        emissive = 0x4C1D95;
      }

      const geom = new THREE.DodecahedronGeometry(0.42, 0);
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive,
        shininess: 80,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      mesh.userData = { id: m.id };
      graphGroup.add(mesh);

      // Pulsing outer orbit ring
      const ringGeom = new THREE.RingGeometry(0.55, 0.62, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: m.status === 'completed' ? 0x34D399 : m.status === 'in-progress' ? 0xA78BFA : 0x475569,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      graphGroup.add(ring);

      nodeMeshes.push({ id: m.id, mesh, ring, pos });
    });

    // Connecting Energy Beam spline
    const curve = new THREE.CatmullRomCurve3(positions);
    const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.045, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.45,
    });
    const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
    graphGroup.add(tubeMesh);

    // Floating background dust
    const starsGeom = new THREE.BufferGeometry();
    const starCount = 60;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 14;
      starPositions[i + 1] = (Math.random() - 0.5) * 8;
      starPositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    starsGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0x94A3B8, size: 0.035, transparent: true, opacity: 0.5 });
    const starField = new THREE.Points(starsGeom, starsMat);
    scene.add(starField);

    // Raycasting for clicking nodes
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.id;
        if (hitId) {
          sounds.playLike();
          onSelectMilestone(hitId);
        }
      }
    };

    mount.addEventListener('click', handleClick);

    // Mouse tilt
    let targetRotY = 0;
    let targetRotX = 0;
    const handleMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 0.5;
      targetRotX = ny * 0.3;
    };
    mount.addEventListener('mousemove', handleMove);

    // Render loop
    let animId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const time = clock.getElapsedTime();

      // Smooth inertia
      graphGroup.rotation.y += (targetRotY - graphGroup.rotation.y) * 0.05;
      graphGroup.rotation.x += (targetRotX - graphGroup.rotation.x) * 0.05;

      nodeMeshes.forEach((item) => {
        const isCurrentActive = item.id === selectedIdRef.current;
        const speed = isCurrentActive ? 1.8 : 0.8;
        item.mesh.rotation.x = time * 0.4 * speed;
        item.mesh.rotation.y = time * 0.6 * speed;
        item.ring.rotation.z = -time * 0.7 * speed;

        const baseScale = isCurrentActive ? 1.35 : 1.0;
        const pulse = Math.sin(time * 3 + item.pos.x) * 0.08;
        item.mesh.scale.setScalar(baseScale + pulse);
      });

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('click', handleClick);
      mount.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [milestones, onSelectMilestone]);

  return (
    <div className={`relative w-full h-[320px] rounded-2xl overflow-hidden glass-panel border border-white/10 ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-pointer" />
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-300/80">3D Constellation Space</span>
      </div>
      <div className="absolute bottom-3 right-4 text-xs font-mono text-slate-400 pointer-events-none bg-black/40 backdrop-blur px-2.5 py-1 rounded-full border border-white/5">
        Click any 3D node to inspect milestone
      </div>
    </div>
  );
};
