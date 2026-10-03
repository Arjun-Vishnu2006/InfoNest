import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Maximize2,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';

interface FeedCardProps {
  post: Post;
  showCommentsInline?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const {
    toggleLikePost,
    toggleBookmarkPost,
    toggleFollowCreator,
    setActiveCommentsPostId,
    cloneRoadmapToMyGoals,
    reactToPost,
    setActiveTrailModalPost,
    setActiveVaultModalPost,
    showToast
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleShare = () => {
    sounds.playClick();
    navigator.clipboard?.writeText(`${window.location.origin}/post/${post.id}`);
    showToast('Post link copied to clipboard!');
  };

  const totalReactionsCount = post.reactions
    ? post.reactions.insightful + post.reactions.useful + post.reactions.mindOpening + post.reactions.practical + post.reactions.like
    : post.likesCount;

  // Drop type pill metadata
  const dropType = post.dropTypeLabel || (
    post.type === 'knowledge' ? 'KNOWLEDGE DROP' :
    post.type === 'lecture' ? 'LECTURE DROP' :
    post.type === 'research' ? 'RESEARCH DROP' :
    post.type === 'challenge' ? 'CHALLENGE DROP' :
    post.type === 'roadmap' ? 'ROADMAP DROP' :
    post.type === 'visual' ? 'VISUAL DROP' :
    post.type === 'code' ? 'CODE DROP' :
    'THOUGHT DROP'
  );

  const dropTypeBadgeColor =
    dropType.includes('KNOWLEDGE') ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' :
    dropType.includes('LECTURE') ? 'bg-purple-500/15 border-purple-500/30 text-purple-300' :
    dropType.includes('RESEARCH') ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' :
    dropType.includes('CHALLENGE') ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' :
    dropType.includes('ROADMAP') ? 'bg-teal-500/15 border-teal-500/30 text-teal-300' :
    dropType.includes('VISUAL') ? 'bg-pink-500/15 border-pink-500/30 text-pink-300' :
    'bg-amber-500/15 border-amber-500/30 text-amber-300';

  return (
    <article className="w-full glass-panel rounded-3xl border border-white/10 overflow-hidden mb-6 transition-all hover:border-white/20 shadow-xl">
      {/* 1. Header with Drop Type & Creator */}
      <div className="p-4 sm:p-5 border-b border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${dropTypeBadgeColor} uppercase flex items-center gap-1.5`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {dropType}
            </span>
            {post.coCreator && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                ✦ Co-Created with {post.coCreator.name}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono">{post.createdAt}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <Link
              to={`/creator/${post.creator.username}`}
              onClick={() => sounds.playClick()}
              className="relative group"
            >
              <img
                src={post.creator.avatar}
                alt={post.creator.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/30 group-hover:ring-purple-400 transition-all"
              />
              {post.creator.verified && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold ring-2 ring-[#08090E]">
                  ✓
                </span>
              )}
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/creator/${post.creator.username}`}
                  onClick={() => sounds.playClick()}
                  className="text-sm font-bold text-slate-100 hover:text-purple-300 transition-colors"
                >
                  {post.creator.name}
                </Link>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  {post.creator.handle}
                </span>
              </div>
              <span className="text-xs text-purple-400/90 font-mono block">
                {post.creator.role}
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleFollowCreator(post.creator.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              post.creator.isFollowed
                ? 'bg-white/5 text-slate-300 border border-white/10 hover:border-rose-500/30 hover:text-rose-400'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple hover:scale-105'
            }`}
          >
            {post.creator.isFollowed ? 'Following' : '+ Follow'}
          </button>
        </div>
      </div>

      {/* 2. Media / Content Arena */}
      <div className="relative w-full bg-black/40">
        {/* Knowledge Drop Large Diagram */}
        {post.type === 'knowledge' && (post.diagramUrl || post.carouselImages) && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 flex items-center justify-center group">
            <img
              src={post.diagramUrl || post.carouselImages?.[0]}
              alt={post.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-cyan-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span>✦ Architecture Topology Breakdown</span>
              <span className="text-slate-400 text-[11px]">Hover to expand view</span>
            </div>
          </div>
        )}

        {/* Visual Carousel Post */}
        {(post.type === 'carousel' || post.type === 'visual') && post.carouselImages && (
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            <img
              src={post.carouselImages[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {post.carouselImages.length > 1 && (
              <>
                {currentSlide > 0 && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCurrentSlide(prev => prev - 1);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white/80 hover:text-white backdrop-blur border border-white/10 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {currentSlide < post.carouselImages.length - 1 && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCurrentSlide(prev => prev + 1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white/80 hover:text-white backdrop-blur border border-white/10 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10">
                  {post.carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playClick();
                        setCurrentSlide(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentSlide ? 'w-4 bg-purple-400' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="absolute top-3 right-3 text-[11px] font-mono bg-black/60 backdrop-blur px-2.5 py-1 rounded-full border border-white/10 text-slate-300">
                  {currentSlide + 1} / {post.carouselImages.length}
                </span>
              </>
            )}
          </div>
        )}

        {/* B. Video Lecture Reel (Coursera Style) */}
        {post.type === 'lecture' && post.lectureData && (
          <div className="relative w-full bg-slate-950 aspect-[16/9] overflow-hidden group">
            <video
              src={post.lectureData.videoUrl}
              className="w-full h-full object-cover"
              controls={isPlayingVideo}
              onPlay={() => setIsPlayingVideo(true)}
              onPause={() => setIsPlayingVideo(false)}
            />

            {!isPlayingVideo && (
              <div
                onClick={() => {
                  sounds.playClick();
                  setIsPlayingVideo(true);
                }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/20 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-glow-purple group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
                <span className="mt-3 text-xs font-mono uppercase tracking-widest text-purple-200">
                  Play Lecture ({post.lectureData.duration})
                </span>
              </div>
            )}

            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/30 backdrop-blur border border-purple-400/40 text-xs font-mono text-purple-200">
                {post.lectureData.level} Lecture
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-xs font-mono text-slate-300">
                {post.lectureData.duration}
              </span>
            </div>

            <Link
              to={`/lecture/${post.lectureData.curriculumCourseId ? 'lec_1' : 'lec_dist_1'}`}
              onClick={() => sounds.playClick()}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur border border-white/20 text-xs font-medium text-white transition-all shadow-lg"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Lecture Theater</span>
            </Link>
          </div>
        )}

        {/* C. Interactive Roadmap Embed */}
        {post.type === 'roadmap' && post.roadmapData && (
          <div className="p-6 bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-black/80 border-y border-white/10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                    {post.roadmapData.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ⏱ {post.roadmapData.estimatedWeeks} Weeks
                  </span>
                </div>
                <Link
                  to={`/roadmap/${post.roadmapData.id}`}
                  onClick={() => sounds.playClick()}
                  className="text-lg font-bold text-white hover:text-purple-300 transition-colors leading-snug block"
                >
                  {post.roadmapData.title}
                </Link>
              </div>

              <button
                onClick={() => cloneRoadmapToMyGoals(post.roadmapData!)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Adopt to Goals</span>
              </button>
            </div>

            <div className="space-y-2 my-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Milestone Progression</span>
                <span className="text-emerald-400">
                  {post.roadmapData.completedMilestones}/{post.roadmapData.totalMilestones} Completed
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                  style={{
                    width: `${(post.roadmapData.completedMilestones / post.roadmapData.totalMilestones) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {post.roadmapData.milestones.slice(0, 4).map((m, idx) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-xs"
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] ${
                      m.status === 'completed'
                        ? 'bg-emerald-500 text-black font-bold'
                        : m.status === 'in-progress'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate text-slate-300 font-medium">{m.title}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-end">
              <Link
                to={`/roadmap/${post.roadmapData.id}`}
                onClick={() => sounds.playClick()}
                className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1"
              >
                <span>Launch Interactive 3D Roadmap →</span>
              </Link>
            </div>
          </div>
        )}

        {/* D. Thought / Code Drop */}
        {(post.type === 'thought' || post.type === 'code') && post.thoughtData && (
          <div className="p-6 bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-black/80 border-y border-white/10 space-y-4">
            <blockquote className="text-sm sm:text-base text-slate-200 italic font-sans leading-relaxed border-l-2 border-purple-500 pl-4 py-1">
              "{post.thoughtData.thought}"
            </blockquote>

            {post.thoughtData.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/60">
                <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{post.thoughtData.language || 'code'}</span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      navigator.clipboard?.writeText(post.thoughtData?.codeSnippet || '');
                      showToast('Code copied to clipboard!');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  {post.thoughtData.codeSnippet}
                </pre>
              </div>
            )}

            {post.thoughtData.keyTakeaways.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                  Key Architecture Takeaways
                </span>
                {post.thoughtData.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-cyan-400 font-mono mt-0.5">✦</span>
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* E. Knowledge Challenge Drop Payload */}
        {post.type === 'challenge' && post.challengeData && (
          <div className="p-5 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-black/90 border-y border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  {post.challengeData.difficulty} Difficulty
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">
                  +{post.challengeData.rewardTokens} KT Reward
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                ⏳ {post.challengeData.deadline}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-200 leading-relaxed font-mono">
              <p>{post.challengeData.prompt}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-slate-400">
                👥 {post.challengeData.participantsCount} Engineers Attempting
              </span>
              <button
                onClick={() => {
                  sounds.playTriumph();
                  showToast('Challenge opened! Solve and submit for +80 KT reward.', 'info');
                  navigate('/challenges');
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-xl text-xs shadow-glow-emerald hover:scale-105 transition-transform"
              >
                Solve Challenge →
              </button>
            </div>
          </div>
        )}

        {/* F. Research Drop Payload */}
        {post.type === 'research' && post.researchData && (
          <div className="p-5 bg-gradient-to-br from-blue-950/40 via-slate-900/80 to-black/90 border-y border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-blue-300 font-bold">📄 {post.researchData.venue}</span>
              <span className="text-slate-400">Verified Preprint</span>
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              {post.researchData.paperTitle}
            </h4>
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                Key Findings:
              </span>
              {post.researchData.keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400 font-mono">◆</span>
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. SIGNATURE ACTION SYSTEM: KNOWLEDGE REACTIONS, DISCUSSIONS, TRAILS, VAULT */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="relative flex items-center justify-between border-b border-white/5 pb-3">
          {/* Left Actions: Reactions & Discussions */}
          <div className="flex items-center gap-3">
            {/* Knowledge Reaction Button with Popover */}
            <div className="relative">
              <button
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all text-xs font-mono group"
              >
                <span className="text-sm">
                  {post.userReaction === 'insightful' ? '🔥' :
                   post.userReaction === 'useful' ? '💡' :
                   post.userReaction === 'mindOpening' ? '🧠' :
                   post.userReaction === 'practical' ? '⚡' :
                   post.userReaction === 'like' ? '❤️' : '⚡'}
                </span>
                <span className="font-bold">
                  {totalReactionsCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Reactions
                </span>
              </button>

              {/* Floating Reaction Picker Popover */}
              {showReactionPicker && (
                <div className="absolute left-0 bottom-12 z-50 flex items-center gap-2 p-2 rounded-2xl glass-panel border border-purple-500/30 shadow-2xl bg-[#0B0D17] animate-in fade-in zoom-in-95 duration-150">
                  {[
                    { type: 'insightful', emoji: '🔥', label: 'Insightful' },
                    { type: 'useful', emoji: '💡', label: 'Useful' },
                    { type: 'mindOpening', emoji: '🧠', label: 'Mind-opening' },
                    { type: 'practical', emoji: '⚡', label: 'Practical' },
                    { type: 'like', emoji: '❤️', label: 'Like' },
                  ].map(r => (
                    <button
                      key={r.type}
                      onClick={() => {
                        reactToPost(post.id, r.type as any);
                        setShowReactionPicker(false);
                      }}
                      title={r.label}
                      className="p-1.5 hover:scale-130 transition-transform text-lg flex flex-col items-center"
                    >
                      <span>{r.emoji}</span>
                      <span className="text-[8px] font-mono text-slate-400 mt-0.5 whitespace-nowrap">
                        {r.label.split('-')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Knowledge Discussion Drawer Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setActiveCommentsPostId(post.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-purple-300 border border-white/10 text-xs font-mono transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{post.commentsCount.toLocaleString()} Discussions</span>
            </button>
          </div>

          {/* Right Actions: Add to Trail, Save to Vault, Share */}
          <div className="flex items-center gap-2">
            {/* Add to Knowledge Trail Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTrailModalPost(post);
              }}
              title="Add to personal Knowledge Trail"
              className="px-2.5 py-1.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 border border-purple-500/30 text-xs font-mono font-medium flex items-center gap-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add to Trail</span>
            </button>

            {/* Save to Knowledge Vault Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setActiveVaultModalPost(post);
              }}
              title="Save to Knowledge Vault Folder"
              className={`p-1.5 rounded-xl border text-xs transition-colors ${
                post.isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-amber-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Share Link */}
            <button
              onClick={handleShare}
              title="Share Drop Permalink"
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. Post Title & Caption */}
        <div>
          <Link
            to={`/post/${post.id}`}
            onClick={() => sounds.playClick()}
            className="text-sm font-bold text-slate-100 hover:text-purple-300 transition-colors mb-1 leading-snug block"
          >
            {post.title}
          </Link>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isCaptionExpanded ? post.caption : `${post.caption.slice(0, 160)}... `}
            {post.caption.length > 160 && (
              <button
                onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                className="text-purple-400 hover:underline font-mono text-[11px] ml-1"
              >
                {isCaptionExpanded ? 'Show less' : 'more'}
              </button>
            )}
          </p>
        </div>

        {/* 5. Hashtags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/search?q=${encodeURIComponent(tag.replace('#', ''))}`}
              onClick={() => sounds.playClick()}
              className="text-[11px] font-mono text-purple-400/80 hover:text-purple-300 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};
