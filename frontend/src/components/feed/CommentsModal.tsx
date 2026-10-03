import React, { useState } from 'react';
import { X, Send, Heart, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';

interface CommentsModalProps {
  postId: string | null;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ postId, onClose }) => {
  const { getCommentsForPost, addComment, posts } = useApp();
  const [inputText, setInputText] = useState('');

  if (!postId) return null;

  const comments = getCommentsForPost(postId);
  const post = posts.find(p => p.id === postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addComment(postId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg h-full glass-panel border-l border-white/10 bg-[#0A0C14]/95 flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Discussion & Q&A</h3>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
              {comments.length}
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Context summary */}
        {post && (
          <div className="px-5 py-3 bg-white/5 border-b border-white/5">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
              Thread Context
            </span>
            <p className="text-xs text-slate-300 truncate font-medium mt-0.5">
              {post.title}
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-mono text-xs">
              No questions yet. Be the first to spark the discussion!
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200">{comment.user.name}</span>
                        {comment.user.roleBadge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {comment.user.roleBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{comment.createdAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => sounds.playLike()}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-400 text-xs font-mono"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{comment.likesCount}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-10">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/40 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a technical question or share thoughts..."
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-glow-purple transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </form>
      </div>
    </div>
  );
};
