import React, { useState } from 'react';
import { X, Bookmark, FolderPlus, Folder, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';

export const SaveToVaultModal: React.FC = () => {
  const {
    activeVaultModalPost,
    setActiveVaultModalPost,
    saveToVaultFolder
  } = useApp();

  const defaultFolders = [
    { name: 'AI & Frontier Models', icon: '🧠', count: 18 },
    { name: 'Distributed Systems', icon: '⚡', count: 12 },
    { name: 'DSA & Algorithms', icon: '⚔️', count: 24 },
    { name: 'Web Development', icon: '🌐', count: 15 },
    { name: 'Research & Papers', icon: '📄', count: 8 },
    { name: 'Exam Prep & Placement', icon: '🎯', count: 10 },
    { name: 'Projects & Repos', icon: '💻', count: 7 },
    { name: 'Career & Architecture', icon: '🚀', count: 9 }
  ];

  const [customFolder, setCustomFolder] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('AI & Frontier Models');

  if (!activeVaultModalPost) return null;

  const handleSave = (folder: string) => {
    saveToVaultFolder(activeVaultModalPost.id, folder);
    setActiveVaultModalPost(null);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFolder.trim()) return;
    handleSave(customFolder.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-amber-500/30 p-6 shadow-2xl bg-[#090B14] space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-1.5">
                <span>Save to Knowledge Vault</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vault Folder
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Organize your personal learning archive
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveVaultModalPost(null);
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Drop */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 truncate font-mono">
          <span>Drop: </span>
          <strong className="text-white">{activeVaultModalPost.title}</strong>
        </div>

        {/* Folders Grid */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Select Vault Folder:
          </span>

          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {defaultFolders.map((f) => (
              <button
                key={f.name}
                onClick={() => handleSave(f.name)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 transition-all text-left group flex items-start gap-2.5"
              >
                <span className="text-lg shrink-0">{f.icon}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors block truncate">
                    {f.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {f.count} items
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Folder Input */}
        <form onSubmit={handleCreateCustom} className="pt-2 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={customFolder}
              onChange={(e) => setCustomFolder(e.target.value)}
              placeholder="+ New custom folder..."
              className="flex-1 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl text-xs shadow-glow-purple hover:scale-105 transition-transform"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
