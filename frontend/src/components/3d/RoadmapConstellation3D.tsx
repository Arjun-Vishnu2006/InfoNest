import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoadmapMilestone } from '../../types';
import { sounds } from '../../services/soundManager';

interface RoadmapConstellation3DProps {
  milestones: RoadmapMilestone[];
  activeMilestoneId: string;
  onSelectMilestone: (id: string) => void;
  className?: string;
  height?: number;
}

export const RoadmapConstellation3D: React.FC<RoadmapConstellation3DProps> = ({
  milestones,
  activeMilestoneId,
  onSelectMilestone,
  className = '',
  height = 360
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef(activeMilestoneId);
  selectedIdRef.current = activeMilestoneId;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const h = height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 1000);
    camera.position.set(0, 1.2, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const pLight1 = new THREE.PointLight(0x8B5CF6, 3.5, 25);
    pLight1.position.set(2, 4, 6);
    scene.add(pLight1);
    const pLight2 = new THREE.PointLight(0x06B6D4, 2.5, 25);
    pLight2.position.set(-3, -3, 5);
    scene.add(pLight2);

    // Compute 3D node positions along an orbital sinusoidal curve
    const nodeCount = milestones.length;
    const nodeMeshes: { id: string; mesh: THREE.Mesh; halo: THREE.Mesh; pos: THREE.Vector3 }[] = [];
    const positions: THREE.Vector3[] = [];

    const spacing = 2.5;
    const startX = -((nodeCount - 1) * spacing) / 2;

    milestones.forEach((m, idx) => {
      const x = startX + idx * spacing;
      const y = Math.sin(idx * 0.9) * 0.9;
      const z = Math.cos(idx * 1.2) * 0.6;
      const pos = new THREE.Vector3(x, y, z);
      positions.push(pos);

      // Color scheme based on status
      let color = 0x475569; // locked
      let emissive = 0x1E293B;
      if (m.status === 'completed') {
        color = 0x10B981; // emerald
        emissive = 0x065F46;
      } else if (m.status === 'in-progress') {
        color = 0x8B5CF6; // violet
        emissive = 0x4C1D95;
      }

      const geom = new THREE.IcosahedronGeometry(0.44, 1);
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive,
        shininess: 90,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      mesh.userData = { id: m.id };
      graphGroup.add(mesh);

      // Outer glowing halo ring
      const haloGeom = new THREE.TorusGeometry(0.65, 0.03, 16, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: m.status === 'completed' ? 0x34D399 : m.status === 'in-progress' ? 0xA855F7 : 0x64748B,
        transparent: true,
        opacity: 0.65,
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      halo.position.copy(pos);
      graphGroup.add(halo);

      nodeMeshes.push({ id: m.id, mesh, halo, pos });
    });

    // Connecting Energy Beam Tube
    if (positions.length > 1) {
      const curve = new THREE.CatmullRomCurve3(positions);
      const tubeGeom = new THREE.TubeGeometry(curve, 72, 0.05, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x8B5CF6,
        transparent: true,
        opacity: 0.4,
      });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      graphGroup.add(tubeMesh);
    }

    // Floating Stardust Particles
    const starCount = 85;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 16;
      starPos[i + 1] = (Math.random() - 0.5) * 9;
      starPos[i + 2] = (Math.random() - 0.5) * 8;
    }
    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xCBD5E1,
      size: 0.04,
      transparent: true,
      opacity: 0.55
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // Interactive Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

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

    // Mouse tilt tracking
    let rotX = 0;
    let rotY = 0;
    const handleMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      rotY = nx * 0.45;
      rotX = ny * 0.25;
    };
    mount.addEventListener('mousemove', handleMove);

    // Render loop
    let animId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const time = clock.getElapsedTime();

      // Damping
      graphGroup.rotation.y += (rotY - graphGroup.rotation.y) * 0.05;
      graphGroup.rotation.x += (rotX - graphGroup.rotation.x) * 0.05;

      nodeMeshes.forEach((item) => {
        const isSelected = item.id === selectedIdRef.current;
        const speed = isSelected ? 1.8 : 0.8;
        item.mesh.rotation.x = time * 0.35 * speed;
        item.mesh.rotation.y = time * 0.5 * speed;
        item.halo.rotation.z = -time * 0.6 * speed;

        const baseScale = isSelected ? 1.4 : 1.0;
        const pulse = Math.sin(time * 3 + item.pos.x) * 0.08;
        item.mesh.scale.setScalar(baseScale + pulse);
      });

      starField.rotation.y = time * 0.02;
      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      camera.aspect = nw / h;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, h);
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
  }, [milestones, onSelectMilestone, height]);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden glass-panel border border-white/10 ${className}`}>
      <div ref={mountRef} style={{ height }} className="w-full cursor-pointer select-none" />
      <div className="absolute top-3.5 left-4 flex items-center gap-2 pointer-events-none">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold">
          3D Learning Constellation
        </span>
      </div>
      <div className="absolute bottom-3.5 right-4 text-[11px] font-mono text-slate-400 pointer-events-none bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">
        Click node to inspect milestone
      </div>
    </div>
  );
};
