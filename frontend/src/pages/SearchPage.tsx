import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { Search, Filter, BookOpen, Users, Sparkles, Layers, ArrowRight, Star } from 'lucide-react';
import { sounds } from '../services/soundManager';
import { usersApi } from '../services/api';
import { mockCreatorAvatar } from '../data/demoData';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<'all' | 'courses' | 'creators' | 'learners' | 'posts' | 'roadmaps'>('all');
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'popular'>('relevant');

  const { courses, creators, posts, roadmaps } = useApp();
  const [learners, setLearners] = useState<any[]>([]);
  const [loadingLearners, setLoadingLearners] = useState(false);
  const learnerAvatar = (person: any) => {
    const profilePicture = person.profilePicture || '';
    const seed = String(person._id || person.name || '').split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
    return profilePicture && !profilePicture.includes('infonest-logo.png') ? profilePicture : mockCreatorAvatar(person.name || 'InfoNest Learner', seed);
  };

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setSearchParams({ q: query });
  };

  const q = query.toLowerCase().trim();

  useEffect(() => {
    if (q.length < 2) { setLearners([]); setLoadingLearners(false); return; }
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoadingLearners(true);
      try {
        const response = await usersApi.search(q);
        if (active) setLearners(response.data?.data?.users || []);
      } catch {
        if (active) setLearners([]);
      } finally {
        if (active) setLoadingLearners(false);
      }
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [q]);

  // Match across the content users can see, including descriptions and creator details.
  const matchedCourses = courses.filter(c =>
    !q || [c.title, c.subtitle, c.description, c.category, c.level, c.creator?.name,
      ...(c.tags || []), ...(c.whatYouWillLearn || []), ...(c.requirements || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(q)
  );
  const matchedLearners = learners.filter(person => person.role === 'Learner');
  const matchedDbCreators = learners.filter(person => person.role === 'ContentCreator');
  const matchedCreators = creators.filter(cr =>
    !q || [cr.name, cr.role, cr.specialty, cr.bio, cr.username, ...(cr.expertiseTags || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(q)
  );
  const matchedPosts = posts.filter(p =>
    !q || [p.title, p.caption, p.type, p.creator?.name, ...(p.tags || []), ...(p.researchData?.keyFindings || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(q)
  );
  const matchedRoadmaps = roadmaps.filter(r =>
    !q || [r.title, r.category, r.description, ...(r.skillsCovered || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(q)
  );
  // Sort results based on selected sort criteria
  const sortArray = <T,>(arr: T[], getPopularity: (item: T) => number, getDate: (item: T) => string | undefined): T[] => {
    if (sortBy === 'popular') return [...arr].sort((a, b) => getPopularity(b) - getPopularity(a));
    if (sortBy === 'newest') return [...arr].sort((a, b) => {
      const da = getDate(a) || '';
      const db = getDate(b) || '';
      return db.localeCompare(da);
    });
    return arr; // 'relevant' = default filter order
  };

  const sortedCourses = sortArray(matchedCourses, c => c.studentsCount || 0, () => undefined);
  const sortedCreators = sortArray(matchedCreators, cr => cr.followersCount || 0, () => undefined);
  const sortedPosts = sortArray(matchedPosts, p => p.likesCount || 0, p => p.createdAt);
  const sortedRoadmaps = sortArray(matchedRoadmaps, r => r.clonesCount || 0, () => undefined);

  const totalResults =
    (filterType === 'all' || filterType === 'courses' ? matchedCourses.length : 0) +
    (filterType === 'all' || filterType === 'creators' ? matchedCreators.length + matchedDbCreators.length : 0) +
    (filterType === 'all' || filterType === 'learners' ? matchedLearners.length : 0) +
    (filterType === 'all' || filterType === 'posts' ? matchedPosts.length : 0) +
    (filterType === 'all' || filterType === 'roadmaps' ? matchedRoadmaps.length : 0);

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-6">
        {/* Search Header Bar */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-black">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Knowledge Search Engine</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Index across peer-reviewed masterclasses, architecture blueprints, roadmaps, and verified educators.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, architecture, author, or skill (e.g. eBPF, Transformers, Three.js, Raft)..."
              className="w-full pl-12 pr-28 py-3.5 bg-white/5 border border-white/15 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-glow-purple"
            >
              Search
            </button>
          </form>

          {/* Filter Chips & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              {[
                { id: 'all', label: 'All Results' },
                { id: 'courses', label: 'Courses' },
                { id: 'creators', label: 'Creators' },
                { id: 'learners', label: 'Learners' },
                { id: 'posts', label: 'Posts & Drops' },
                { id: 'roadmaps', label: 'Roadmaps' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setFilterType(tab.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    filterType === tab.id
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="relevant">Most Relevant</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
          <span>Found {totalResults} matches for "{query || 'all'}"</span>
        </div>

        {/* Results Sections */}
        {totalResults === 0 ? (
          <div className="text-center py-24 glass-panel rounded-3xl border border-white/10 space-y-3">
            <Search className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No knowledge matches found</h3>
            <p className="text-xs text-slate-400">Try searching for keywords like "AI", "Kafka", "Three.js", or "Reasoning".</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Courses Results */}
            {(filterType === 'all' || filterType === 'courses') && matchedCourses.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Masterclass Courses ({matchedCourses.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedCourses.map(course => (
                    <Link
                      key={course.id}
                      to={`/course/${course.id}`}
                      onClick={() => sounds.playClick()}
                      className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-purple-500/40 flex gap-4 transition-all group"
                    >
                      <img src={course.coverImage} alt={course.title} className="w-28 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
                      <div className="min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-cyan-300">{course.level}</span>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-300">{course.title}</h4>
                          <span className="text-[11px] text-slate-400 truncate block">{course.creator.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                          <span className="text-amber-400">★ {course.rating}</span>
                          <span>{course.estimatedHours}h</span>
                          <span>{course.studentsCount.toLocaleString()} learners</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Creators Results */}
            {(filterType === 'all' || filterType === 'creators') && matchedCreators.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>Educators & Authors ({matchedCreators.length + matchedDbCreators.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedCreators.map(creator => (
                    <Link
                      key={creator.id}
                      to={`/creator/${creator.username}`}
                      onClick={() => sounds.playClick()}
                      className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-purple-500/40 flex items-center gap-3 transition-all group"
                    >
                      <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-purple-400" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300">{creator.name}</h4>
                        <span className="text-[11px] text-slate-400 truncate block">{creator.role}</span>
                        <span className="text-[10px] font-mono text-purple-400">{creator.followersCount.toLocaleString()} followers</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(filterType === 'all' || filterType === 'learners') && (matchedLearners.length > 0 || loadingLearners) && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4" /><span>Learner Profiles{loadingLearners ? ' (searching)' : ` (${matchedLearners.length})`}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedLearners.map((person) => (
                    <Link key={person._id} to={`/profile/${person._id}`} className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-cyan-400/40 flex items-center gap-3 transition-all group">
                      <img src={learnerAvatar(person)} alt="" className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10" />
                      <div className="min-w-0"><h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-200">{person.name}</h4><span className="text-[11px] text-slate-400 truncate block">{person.headline || person.expertiseArea || person.role}</span><span className="text-[10px] text-slate-500 truncate block">{(person.skills || []).slice(0, 3).join(' � ')}</span></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Roadmaps Results */}
            {(filterType === 'all' || filterType === 'roadmaps') && matchedRoadmaps.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Interactive Roadmaps ({matchedRoadmaps.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedRoadmaps.map(rm => (
                    <Link
                      key={rm.id}
                      to={`/roadmap/${rm.id}`}
                      onClick={() => sounds.playClick()}
                      className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-emerald-500/40 space-y-2 group transition-all"
                    >
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{rm.category}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">{rm.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{rm.description}</p>
                      <div className="pt-2 flex justify-between text-xs font-mono text-slate-400 border-t border-white/5">
                        <span>{rm.totalMilestones} Phases</span>
                        <span>{rm.estimatedWeeks} Weeks</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Results */}
            {(filterType === 'all' || filterType === 'posts') && matchedPosts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Posts & Code Drops ({matchedPosts.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedPosts.map(post => (
                    <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      onClick={() => sounds.playClick()}
                      className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-amber-500/40 space-y-2 group transition-all"
                    >
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">{post.type}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{post.caption}</p>
                      <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1">
                        <span>By {post.creator.name}</span>
                        <span>❤️ {post.likesCount}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
