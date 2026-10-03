import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { FeedCard } from '../components/feed/FeedCard';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import { ArrowLeft, MessageSquare, Send, Heart } from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, getCommentsForPost, addComment, currentUser } = useApp();

  const [commentText, setCommentText] = useState('');

  const post = posts.find(p => p.id === postId) || posts[0];

  if (!post) {
    return (
      <MainLayout showRightRail={false}>
        <div className="text-center py-24 glass-panel rounded-3xl border border-white/10 space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Post not found</h3>
          <p className="text-xs text-slate-400">This post doesn't exist or hasn't been loaded yet.</p>
          <Link to="/feed" className="inline-block mt-4 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-500">← Back to Feed</Link>
        </div>
      </MainLayout>
    );
  }

  const comments = getCommentsForPost(post.id);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full max-w-3xl space-y-6">
        {/* Back Link */}
        <Link
          to="/feed"
          onClick={() => sounds.playClick()}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to The Nest</span>
        </Link>

        {/* Post Card */}
        <FeedCard post={post} />

        {/* Deep Comments Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span>Discussion & Q&A Thread ({comments.length})</span>
            </h3>
            <span className="text-xs font-mono text-purple-300">Verified Peer Review</span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ask a technical question or share your analysis..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-glow-purple transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-2">
            {comments.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={c.user.avatar} alt={c.user.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10" />
                    <div>
                      <span className="text-xs font-bold text-white">{c.user.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 ml-2">{c.createdAt}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => sounds.playLike()}
                    className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-rose-400"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{c.likesCount}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-10.5">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
