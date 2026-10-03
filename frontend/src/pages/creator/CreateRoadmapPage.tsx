import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { RoadmapConstellation3D } from '../../components/3d/RoadmapConstellation3D';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import confetti from 'canvas-confetti';
import {
  Layers,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { RoadmapMilestone } from '../../types';

export const CreateRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [title, setTitle] = useState('Full-Stack Autonomous Web3 & ZK Architect');
  const [category, setCategory] = useState('Cybersecurity & Cryptography');
  const [estimatedWeeks, setEstimatedWeeks] = useState(12);

  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([
    {
      id: 'm_new_1',
      order: 1,
      title: 'Phase 1: Arithmetic Circuits & Polynomial Math',
      description: 'Lagrange interpolation, Schwartz-Zippel lemma, and R1CS constraint generation.',
      status: 'completed',
      estimatedHours: 20,
      skills: ['Polynomials', 'R1CS', 'Modular Arithmetic'],
      recommendedLectures: ['Cryptographic Pairings Overview']
    },
    {
      id: 'm_new_2',
      order: 2,
      title: 'Phase 2: Groth16 & PLONK Proving Engines',
      description: 'KZG polynomial commitments, trusted setups, and constant-size proof generation in Rust.',
      status: 'in-progress',
      estimatedHours: 26,
      skills: ['PLONK', 'Groth16', 'Rust', 'KZG'],
      recommendedLectures: ['Building Provers in Rust']
    },
    {
      id: 'm_new_3',
      order: 3,
      title: 'Phase 3: Production Rollups & Verifier Contracts',
      description: 'On-chain verification contracts, state root synchronization, and batch proving pipelines.',
      status: 'locked',
      estimatedHours: 30,
      skills: ['Rollups', 'Smart Contracts', 'Gas Optimization'],
      recommendedLectures: ['High Throughput Batching']
    }
  ]);

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(milestones[0].id);

  const handleAddMilestone = () => {
    if (newMilestoneTitle.trim()) {
      sounds.playClick();
      const newM: RoadmapMilestone = {
        id: `m_new_${Date.now()}`,
        order: milestones.length + 1,
        title: newMilestoneTitle.trim(),
        description: 'Key skills and deliverables for this phase.',
        status: 'locked',
        estimatedHours: 20,
        skills: ['Core Concepts'],
        recommendedLectures: ['Masterclass Overview']
      };
      setMilestones(prev => [...prev, newM]);
      setNewMilestoneTitle('');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playTriumph();
    confetti({ particleCount: 100, spread: 80 });
    showToast(`Roadmap "${title}" published to Learning Cosmos!`);
    navigate('/roadmaps');
  };

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-2 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300">
            <Layers className="w-3.5 h-3.5" />
            <span>Roadmap Visual Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Create Learning Roadmap</h1>
          <p className="text-xs text-slate-400">Design an interactive 3D milestone trajectory for serious engineers.</p>
        </div>

        {/* 3D Realtime Constellation Preview */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Realtime 3D Constellation Simulation</span>
          </span>
          <RoadmapConstellation3D
            milestones={milestones}
            activeMilestoneId={selectedMilestoneId}
            onSelectMilestone={(id) => setSelectedMilestoneId(id)}
            height={320}
          />
        </div>

        {/* Setup Form */}
        <form onSubmit={handlePublish} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-mono text-slate-400 block mb-1">Roadmap Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Estimated Weeks</label>
              <input
                type="number"
                value={estimatedWeeks}
                onChange={(e) => setEstimatedWeeks(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono"
              />
            </div>
          </div>

          {/* Milestones list */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-purple-300 uppercase tracking-wider block">
              Configured Milestone Sequence ({milestones.length})
            </span>

            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMilestones(prev => prev.filter(item => item.id !== m.id))}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Next Milestone Phase Title..."
                className="flex-1 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold"
              >
                + Add Milestone
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/roadmaps')}
              className="px-5 py-2.5 rounded-xl bg-white/5 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-bold rounded-xl text-xs shadow-glow-cyan"
            >
              Publish Roadmap to Cosmos 🚀
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
