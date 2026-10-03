import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Compass, Map, BookOpen, User, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';

export const MobileNav: React.FC = () => {
  const { role } = useApp();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-white/10 px-4 py-2 flex items-center justify-around">
      <NavLink
        to="/feed"
        onClick={() => sounds.playClick()}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono ${
            isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Sparkles className="w-5 h-5" />
        <span>Feed</span>
      </NavLink>

      <NavLink
        to="/explore"
        onClick={() => sounds.playClick()}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono ${
            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Compass className="w-5 h-5" />
        <span>Explore</span>
      </NavLink>

      {role === 'creator' && (
        <NavLink
          to="/create/post"
          onClick={() => sounds.playClick()}
          className="flex flex-col items-center gap-1 text-[10px] font-mono text-cyan-400 -mt-4"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-white shadow-glow-cyan">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span>Drop</span>
        </NavLink>
      )}

      <NavLink
        to="/roadmaps"
        onClick={() => sounds.playClick()}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono ${
            isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Map className="w-5 h-5" />
        <span>Roadmaps</span>
      </NavLink>

      <NavLink
        to="/courses"
        onClick={() => sounds.playClick()}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono ${
            isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <BookOpen className="w-5 h-5" />
        <span>Courses</span>
      </NavLink>

      <NavLink
        to="/profile"
        onClick={() => sounds.playClick()}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono ${
            isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
