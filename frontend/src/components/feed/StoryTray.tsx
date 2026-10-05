import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import { Story } from '../../types';

export const StoryTray: React.FC = () => {
  const navigate = useNavigate();
  const { stories, setActiveStory, role, currentUser } = useApp();

  if (stories.length === 0 && role !== 'creator') {
    return null;
  }

  const handleStoryClick = (story: Story) => {
    sounds.playClick();
    setActiveStory(story);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-white/10 mb-6 overflow-hidden">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            Knowledge Sparks
          </span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            · Quick educational moments
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
          Tap to view spark
        </span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
        {/* Creator add story pill */}
        {role === 'creator' && (
          <div
            onClick={() => {
              sounds.playClick();
              navigate('/create/post');
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group select-none"
          >
            <div className="relative w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-cyan-400/50 flex items-center justify-center group-hover:border-cyan-300 transition-colors">
              <img
                src={currentUser.avatar}
                alt="My Spark"
                className="w-full h-full rounded-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-black border-2 border-[#0B0D14] shadow-glow-cyan">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 font-medium">New Spark</span>
          </div>
        )}

        {/* Sparks list */}
        {stories.map((story) => {
          const categoryColors: Record<string, string> = {
            'Flashcard': 'from-purple-500 via-indigo-500 to-purple-400',
            'Quick Tip': 'from-cyan-400 via-blue-500 to-cyan-300',
            'Mini Lecture': 'from-pink-500 via-rose-500 to-purple-500',
            'Challenge': 'from-emerald-400 via-teal-500 to-emerald-300',
            'Thought': 'from-amber-400 via-orange-500 to-amber-300',
            'Research': 'from-blue-400 via-indigo-500 to-cyan-400'
          };
          const ringGradient = categoryColors[story.category] || 'from-purple-500 via-cyan-400 to-pink-500';

          return (
            <div
              key={story.id}
              onClick={() => handleStoryClick(story)}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group select-none w-18"
            >
              <div
                className={`relative w-16 h-16 rounded-full p-[2.5px] transition-transform duration-300 group-hover:scale-105 ${
                  story.hasUnseen
                    ? `bg-gradient-to-tr ${ringGradient} shadow-glow-purple`
                    : 'bg-white/20'
                }`}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-[#090B12]">
                  <img
                    src={story.creator.avatar}
                    alt={story.creator.name}
                    className="w-full h-full rounded-full object-cover group-hover:brightness-110 transition-all"
                  />
                </div>
                {/* Category Pill Tag */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold uppercase tracking-tight px-1 rounded bg-[#090B12] text-cyan-300 border border-white/20 whitespace-nowrap">
                  {story.category}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white truncate max-w-[76px] text-center mt-1">
                {story.creator.name.split(' ')[0]}
              </span>
              <span className="text-[9px] font-mono text-slate-400 truncate max-w-[76px] text-center -mt-1">
                {story.timestamp || story.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
