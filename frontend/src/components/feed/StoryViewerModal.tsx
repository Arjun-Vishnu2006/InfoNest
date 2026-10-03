import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Sparkles } from 'lucide-react';
import { Story } from '../../types';
import { sounds } from '../../services/soundManager';
import { useApp } from '../../context/AppContext';

interface StoryViewerModalProps {
  story: Story | null;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ story, onClose }) => {
  const { showToast } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setCurrentSlideIndex(0);
    setIsLiked(false);
  }, [story]);

  if (!story) return null;

  const currentSlide = story.slides[currentSlideIndex];

  const handleNext = () => {
    sounds.playClick();
    if (currentSlideIndex < story.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-md h-[680px] rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl flex flex-col justify-between bg-gradient-to-b from-slate-900 to-black">
        {/* Top Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
          {story.slides.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-cyan-400 transition-all duration-300 ${
                  idx < currentSlideIndex
                    ? 'w-full'
                    : idx === currentSlideIndex
                    ? 'w-full'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Creator Info & Close Bar */}
        <div className="relative z-20 pt-8 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={story.creator.avatar}
              alt={story.creator.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-400"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white">{story.creator.name}</span>
                <span className="text-[10px] text-cyan-400">✓</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{story.title}</span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="relative z-10 flex-1 px-6 py-6 flex flex-col justify-center">
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${currentSlide.bgGradient} border border-white/10 shadow-2xl`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-200">
                {currentSlide.type} insight
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 leading-snug">
              {currentSlide.title}
            </h3>

            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              {currentSlide.content}
            </p>

            {currentSlide.codeSnippet && (
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto">
                <pre className="whitespace-pre-wrap">{currentSlide.codeSnippet}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Left & Right Click Triggers */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Interactive Bar */}
        <div className="relative z-20 p-4 bg-black/70 backdrop-blur border-t border-white/10 space-y-2.5">
          {/* Quick Action Badges */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playChime();
                  showToast('Spark added to your Knowledge Trail! +10 KT', 'success');
                }}
                className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-1 transition-all"
              >
                <span>+ Add to Trail</span>
              </button>
              <button
                onClick={() => {
                  sounds.playLike();
                  showToast('Spark saved to Knowledge Vault!', 'info');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1 transition-all"
              >
                <span>Save Spark</span>
              </button>
            </div>
            <span className="text-slate-400">
              {currentSlideIndex + 1}/{story.slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Reply to ${story.creator.name}...`}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={() => {
                if (commentText.trim()) {
                  sounds.playChime();
                  showToast('Reply sent to creator discussion thread');
                  setCommentText('');
                }
              }}
              className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sounds.playLike();
                setIsLiked(!isLiked);
              }}
              className={`p-2.5 rounded-full border transition-all ${
                isLiked
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
