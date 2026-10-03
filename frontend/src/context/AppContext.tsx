import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  Post,
  Story,
  Course,
  RoadmapData,
  UserGoal,
  Comment,
  Creator,
  NotificationItem,
  ContentItem,
  ToastNotification,
  KnowledgeTrail,
  KnowledgeTrailItem,
  LearningMission,
  OrbitRoom,
  KnowledgeChallenge,
  KnowledgeProof,
  KnowledgeReactionType
} from '../types';
import { CURRENT_USER } from '../data/mockData';
import { sounds } from '../services/soundManager';
import { usersApi, goalsApi, contentApi, roadmapsApi, notificationsApi } from '../services/api';
import { useAuth } from './AuthContext';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  currentUser: typeof CURRENT_USER;
  creators: Creator[];
  posts: Post[];
  stories: Story[];
  courses: Course[];
  roadmaps: RoadmapData[];
  activeRoadmap: RoadmapData | null;
  setActiveRoadmap: (rm: RoadmapData) => void;
  goals: UserGoal[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  creatorContent: ContentItem[];
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;

  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
  activeCommentsPostId: string | null;
  setActiveCommentsPostId: (postId: string | null) => void;

  // Social interactions
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  addComment: (postId: string, text: string) => void;
  getCommentsForPost: (postId: string) => Comment[];
  createPost: (newPost: Partial<Post>) => void;
  reactToPost: (postId: string, reaction: KnowledgeReactionType) => void;
  saveToVaultFolder: (postId: string, folder: string) => void;

  // Signature InfoNest Features
  knowledgeTrails: KnowledgeTrail[];
  addDropToTrail: (trailId: string, dropTitle: string, dropType: string) => void;
  createKnowledgeTrail: (title: string, category: string, description: string) => void;

  learningMissions: LearningMission[];
  toggleMissionTask: (missionId: string, taskId: string) => void;
  claimMissionReward: (missionId: string) => void;

  orbitRooms: OrbitRoom[];
  joinOrbitRoom: (roomId: string) => void;

  challenges: KnowledgeChallenge[];
  submitChallengeSolution: (challengeId: string) => void;

  knowledgeProofs: KnowledgeProof[];

  activeTrailModalPost: Post | null;
  setActiveTrailModalPost: (post: Post | null) => void;
  activeVaultModalPost: Post | null;
  setActiveVaultModalPost: (post: Post | null) => void;

  // Learning interactions
  enrollInCourse: (courseId: string) => void;
  markLectureComplete: (courseId: string, lectureId: string) => void;
  toggleMilestoneComplete: (roadmapId: string, milestoneId: string) => void;
  cloneRoadmapToMyGoals: (roadmap: RoadmapData) => void;
  logStudyHours: (goalId: string, hours: number) => Promise<void>;
  createGoal: (data: { title: string; category: string; description: string; targetHoursPerWeek: number; targetCompletionDate?: string }) => Promise<void>;
  updateGoal: (goalId: string, data: Record<string, unknown>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  updateProfile: (data: Record<string, unknown>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteContentItem: (id: string) => void;

  // Data loading
  refreshCreators: () => Promise<void>;
  refreshContent: () => Promise<void>;
  refreshRoadmaps: () => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // Audio system
  isMuted: boolean;
  toggleMute: () => void;
  isAmbientPlaying: boolean;
  toggleAmbient: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const EMPTY_CURRENT_USER: typeof CURRENT_USER = {
  id: '',
  username: '',
  name: '',
  handle: '',
  avatar: '/infonest-logo.png',
  coverImage: '',
  role: 'Learner',
  bio: '',
  headline: '',
  location: '',
  about: '',
  education: '',
  experience: '',
  certificates: [],
  email: '',
  phone: '',
  reputationScore: 0,
  isVerified: false,
  expertiseArea: '',
  knowledgeTokens: 0,
  knowledgeScore: 0,
  streakDays: 0,
  enrolledCoursesCount: 0,
  activeRoadmapsCount: 0,
  completedCertificatesCount: 0,
  skills: []
};

const mapBackendUser = (u: any): typeof CURRENT_USER => ({
  ...EMPTY_CURRENT_USER,
  id: u?._id || u?.id || '',
  name: u?.name || '',
  email: u?.email || '',
  phone: u?.phone || '',
  username: u?.email ? String(u.email).split('@')[0] : '',
  handle: u?.email ? `@${String(u.email).split('@')[0]}` : '',
  avatar: u?.profilePicture || '/infonest-logo.png',
  role: u?.role === 'ContentCreator' ? 'Content Creator' : (u?.role === 'Admin' ? 'Admin' : 'Learner'),
  expertiseArea: u?.expertiseArea || '',
  reputationScore: u?.reputationScore ?? 0,
  headline: u?.headline || '',
  location: u?.location || '',
  about: u?.about || '',
  certificates: Array.isArray(u?.certificates) ? u.certificates : [],
  education: u?.education || '',
  experience: u?.experience || '',
  skills: Array.isArray(u?.skills) ? u.skills : [],
});

const mapBackendGoal = (g: any): UserGoal => ({
  id: String(g?._id || g?.id),
  backendId: String(g?._id || g?.id),
  title: g?.title || 'Learning Goal',
  category: g?.category || 'General',
  description: g?.description || '',
  status: g?.status || 'active',
  roadmapTitle: g?.title || 'Learning Goal',
  roadmapId: undefined,
  targetHoursPerWeek: Number(g?.targetHoursPerWeek ?? 10),
  loggedHoursThisWeek: Number(g?.completedHours ?? 0),
  targetCompletionDate: g?.targetCompletionDate ? new Date(g.targetCompletionDate).toLocaleDateString() : 'Flexible',
  streakDays: Number(g?.streakDays ?? 0),
  completedTasks: Math.round(Number(g?.progressPercent ?? 0) / 10),
  totalTasks: 10,
  weeklyHistory: [0,0,0,0,0,0,0],
  progressPercent: Number(g?.progressPercent ?? 0),
});

// Map backend Creator (User with role ContentCreator) to frontend Creator type
const mapBackendCreator = (u: any): Creator => ({
  id: String(u?._id || u?.id || ''),
  username: u?.email ? String(u.email).split('@')[0] : '',
  name: u?.name || '',
  handle: u?.email ? `@${String(u.email).split('@')[0]}` : '',
  avatar: u?.profilePicture || '/infonest-logo.png',
  coverImage: '',
  role: u?.headline || u?.expertiseArea || 'Content Creator',
  specialty: u?.expertiseArea || '',
  bio: u?.about || '',
  followersCount: 0,
  followingCount: 0,
  studentCount: 0,
  totalLectures: 0,
  rating: 0,
  isFollowed: false,
  verified: u?.isVerified || false,
  knowledgeTokens: 0,
  knowledgeScore: u?.reputationScore || 0,
  expertiseTags: Array.isArray(u?.skills) ? u.skills : [],
});

// Map backend content to frontend Post type for feed display
const mapContentToPost = (item: any): Post => ({
  id: String(item?._id || item?.id || ''),
  creatorId: String(item?.creatorId?._id || item?.creatorId || ''),
  creator: {
    id: String(item?.creatorId?._id || item?.creatorId || ''),
    username: '',
    name: item?.creatorId?.name || 'Unknown Creator',
    handle: '',
    avatar: item?.creatorId?.profilePicture || '/infonest-logo.png',
    coverImage: '',
    role: item?.creatorId?.expertiseArea || 'Creator',
    specialty: item?.creatorId?.expertiseArea || '',
    bio: '',
    followersCount: 0,
    followingCount: 0,
    studentCount: 0,
    totalLectures: 0,
    rating: 0,
    isFollowed: false,
    verified: false,
    knowledgeTokens: 0,
    knowledgeScore: item?.creatorId?.reputationScore || 0,
    expertiseTags: [],
  },
  type: item?.contentType === 'guide' ? 'knowledge' : (item?.contentType || 'knowledge'),
  dropTypeLabel: `${(item?.contentType || 'KNOWLEDGE').toUpperCase()} DROP`,
  title: item?.title || 'Untitled',
  caption: item?.description || '',
  tags: item?.category ? [`#${item.category}`] : [],
  createdAt: item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
  likesCount: 0,
  commentsCount: 0,
  bookmarksCount: 0,
  sharesCount: 0,
  isLiked: false,
  isBookmarked: false,
  reactions: { insightful: 0, useful: 0, mindOpening: 0, practical: 0, like: 0 },
});

// Map backend notification
const mapBackendNotification = (n: any): NotificationItem => ({
  id: String(n?._id || n?.id || ''),
  category: (n?.type === 'roadmap' ? 'learning' : n?.type === 'chat' ? 'social' : n?.type === 'review' ? 'creator' : n?.type === 'announcement' ? 'system' : 'system') as NotificationItem['category'],
  title: n?.type ? `${n.type.charAt(0).toUpperCase()}${n.type.slice(1)} Notification` : 'Notification',
  description: n?.message || '',
  timestamp: n?.createdAt ? new Date(n.createdAt).toLocaleString() : '',
  read: n?.isRead || false,
  avatar: undefined,
  actionUrl: n?.link || undefined,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Role State
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('infonest_role') as UserRole) || 'student';
  });

  const setRole = (newRole: UserRole) => {
    sounds.playSwoop();
    setRoleState(newRole);
    localStorage.setItem('infonest_role', newRole);
  };

  const toggleRole = () => {
    setRole(role === 'student' ? 'creator' : 'student');
  };

  // 2. Data States — ALL initialized empty, loaded from backend APIs
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<typeof CURRENT_USER>(EMPTY_CURRENT_USER);

  // AuthContext is the single source of truth for the signed-in account.
  useEffect(() => {
    if (authUser) setCurrentUser(mapBackendUser(authUser));
    else setCurrentUser(EMPTY_CURRENT_USER);
  }, [authUser]);

  // All data states start EMPTY — no mock data
  const [creators, setCreators] = useState<Creator[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories] = useState<Story[]>([]);
  const [courses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapData[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapData | null>(null);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [creatorContent, setCreatorContent] = useState<ContentItem[]>([]);

  // =====================================================
  // LOAD REAL DATA FROM BACKEND
  // =====================================================

  const refreshCreators = useCallback(async () => {
    try {
      const res = await usersApi.creators();
      const list = res.data?.data?.creators || [];
      setCreators(list.map(mapBackendCreator));
    } catch { /* empty */ }
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      const res = await contentApi.feed();
      const list = res.data?.data || [];
      setPosts(list.map(mapContentToPost));
      // Also populate creatorContent for creator dashboard
      setCreatorContent(list.map((item: any) => ({
        id: String(item._id || item.id),
        title: item.title || '',
        type: item.contentType || 'article',
        status: item.status || 'pending',
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
        views: 0,
        likes: 0,
        comments: 0,
      })));
    } catch { /* empty */ }
  }, []);

  const refreshRoadmaps = useCallback(async () => {
    try {
      const res = await roadmapsApi.list();
      const list = res.data?.data?.roadmaps || [];
      const mapped: RoadmapData[] = list.map((rm: any) => ({
        id: String(rm._id || rm.id),
        title: rm.title || '',
        category: rm.goalId?.category || '',
        level: 'Intermediate' as const,
        description: rm.description || '',
        totalMilestones: (rm.steps || []).length,
        completedMilestones: (rm.steps || []).filter((s: any) => s.completed).length,
        estimatedWeeks: 0,
        clonesCount: 0,
        skillsCovered: [],
        certificatePath: '',
        milestones: (rm.steps || []).map((s: any) => ({
          id: `step_${s.order}`,
          order: s.order,
          title: s.title,
          description: s.description || '',
          status: s.completed ? 'completed' as const : 'in-progress' as const,
          estimatedHours: 0,
          skills: [],
          recommendedLectures: [],
        })),
      }));
      setRoadmaps(mapped);
      if (mapped.length > 0 && !activeRoadmap) setActiveRoadmap(mapped[0]);
    } catch { /* empty */ }
  }, [activeRoadmap]);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await notificationsApi.list();
      const list = res.data?.data || [];
      setNotifications(list.map(mapBackendNotification));
    } catch { /* empty */ }
  }, []);

  // Load all data when authenticated
  useEffect(() => {
    const token = localStorage.getItem('infonest_token');
    if (!token) return;
    (async () => {
      // Load user profile
      let backendUser: any = null;
      try {
        const profile = await usersApi.me();
        backendUser = profile.data?.data?.user || profile.data?.user;
        if (backendUser) setCurrentUser(mapBackendUser(backendUser));
      } catch { /* auth context handles session errors */ }

      // Load goals
      try {
        const list = await goalsApi.list(backendUser?._id ? { createdBy: backendUser._id } : undefined);
        const backendGoals = list.data?.data?.goals || [];
        setGoals(backendGoals.map(mapBackendGoal));
      } catch { /* keep empty */ }

      // Load other data in parallel
      await Promise.allSettled([
        refreshCreators(),
        refreshContent(),
        refreshRoadmaps(),
        refreshNotifications(),
      ]);
    })();
  }, [refreshCreators, refreshContent, refreshRoadmaps, refreshNotifications]);

  // 3. UI and Audio States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Toast dispatch
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Audio toggles
  const toggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    showToast(muted ? 'Sound effects muted' : 'Sound effects unmuted', 'info');
  };

  const toggleAmbient = () => {
    const playing = sounds.toggleAmbient();
    setIsAmbientPlaying(playing);
    showToast(playing ? 'Space drone ambient sound ON' : 'Ambient sound OFF', 'info');
  };

  // Social interactions
  const toggleLikePost = (postId: string) => {
    sounds.playLike();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  const toggleBookmarkPost = (postId: string) => {
    sounds.playClick();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextBookmarked = !p.isBookmarked;
          showToast(nextBookmarked ? 'Saved to Knowledge Vault' : 'Removed from Saved', 'info');
          return {
            ...p,
            isBookmarked: nextBookmarked,
            bookmarksCount: nextBookmarked ? p.bookmarksCount + 1 : p.bookmarksCount - 1
          };
        }
        return p;
      })
    );
  };

  const reactToPost = (postId: string, reactionType: KnowledgeReactionType) => {
    sounds.playReaction(reactionType);
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const prevReaction = p.userReaction;
          const reactions = { ...(p.reactions || { insightful: 0, useful: 0, mindOpening: 0, practical: 0, like: 0 }) };

          if (prevReaction === reactionType) {
            reactions[reactionType] = Math.max(0, reactions[reactionType] - 1);
            return {
              ...p,
              userReaction: undefined,
              reactions,
              isLiked: reactionType === 'like' ? false : p.isLiked,
              likesCount: reactionType === 'like' ? Math.max(0, p.likesCount - 1) : p.likesCount
            };
          } else {
            if (prevReaction) {
              reactions[prevReaction] = Math.max(0, reactions[prevReaction] - 1);
            }
            reactions[reactionType] = (reactions[reactionType] || 0) + 1;
            const labels: Record<KnowledgeReactionType, string> = {
              insightful: '🔥 Insightful',
              useful: '💡 Useful',
              mindOpening: '🧠 Mind-opening',
              practical: '⚡ Practical',
              like: '❤️ Like'
            };
            showToast(`Reacted with ${labels[reactionType]}! +5 Knowledge Tokens earned`, 'success');
            return {
              ...p,
              userReaction: reactionType,
              reactions,
              isLiked: reactionType === 'like' ? true : p.isLiked,
              likesCount: reactionType === 'like' && !prevReaction ? p.likesCount + 1 : p.likesCount
            };
          }
        }
        return p;
      })
    );
  };

  const saveToVaultFolder = (postId: string, folder: string) => {
    sounds.playLike();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isBookmarked: true,
            bookmarksCount: p.isBookmarked ? p.bookmarksCount : p.bookmarksCount + 1
          };
        }
        return p;
      })
    );
    showToast(`Added to Knowledge Vault [${folder}]! +10 Knowledge Tokens`, 'success');
  };

  const toggleFollowCreator = (creatorId: string) => {
    sounds.playChime();
    let followed = false;
    let creatorName = '';

    setCreators(prev =>
      prev.map(c => {
        if (c.id === creatorId) {
          followed = !c.isFollowed;
          creatorName = c.name;
          return {
            ...c,
            isFollowed: followed,
            followersCount: followed ? c.followersCount + 1 : c.followersCount - 1
          };
        }
        return c;
      })
    );

    setPosts(prev =>
      prev.map(p => {
        if (p.creator.id === creatorId) {
          return {
            ...p,
            creator: {
              ...p.creator,
              isFollowed: !p.creator.isFollowed,
              followersCount: p.creator.isFollowed ? p.creator.followersCount - 1 : p.creator.followersCount + 1
            }
          };
        }
        return p;
      })
    );

    showToast(followed ? `Following ${creatorName}` : `Unfollowed ${creatorName}`, 'info');
  };

  // Comments store (frontend-only for now; backend comments use separate contentId-based API)
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});

  const addComment = (postId: string, text: string) => {
    sounds.playChime();
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      user: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        roleBadge: currentUser.role
      },
      text,
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));

    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    showToast('Comment posted to discussion thread');
  };

  const getCommentsForPost = (postId: string): Comment[] => {
    return commentsMap[postId] || [];
  };

  const createPost = (newPostData: Partial<Post>) => {
    sounds.playTriumph();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const created: Post = {
      id: `post_${Date.now()}`,
      creatorId: currentUser.id || 'current-user',
      creator: {
        id: currentUser.id || 'current-user',
        username: currentUser.username,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        coverImage: currentUser.coverImage,
        role: currentUser.role,
        specialty: 'Knowledge Sharing',
        bio: currentUser.bio,
        followersCount: 0,
        followingCount: 0,
        studentCount: 0,
        totalLectures: 0,
        rating: 0,
        isFollowed: false,
        verified: false,
        knowledgeTokens: currentUser.knowledgeTokens,
        knowledgeScore: currentUser.knowledgeScore,
        expertiseTags: currentUser.skills || []
      },
      type: newPostData.type || 'thought',
      title: newPostData.title || 'Untitled Post',
      caption: newPostData.caption || '',
      tags: newPostData.tags || ['#Knowledge', '#InfoNest'],
      createdAt: 'Just now',
      likesCount: 1,
      commentsCount: 0,
      bookmarksCount: 0,
      sharesCount: 0,
      isLiked: true,
      isBookmarked: false,
      reactions: { insightful: 0, useful: 0, mindOpening: 0, practical: 0, like: 1 },
      userReaction: 'like',
      carouselImages: newPostData.carouselImages,
      lectureData: newPostData.lectureData,
      thoughtData: newPostData.thoughtData,
      roadmapData: newPostData.roadmapData,
      challengeData: newPostData.challengeData,
      researchData: newPostData.researchData,
      diagramUrl: newPostData.diagramUrl
    };

    setPosts(prev => [created, ...prev]);

    const newContentItem: ContentItem = {
      id: created.id,
      title: created.title,
      type: (created.type === 'lecture' || created.type === 'roadmap') ? created.type : 'post',
      status: 'published',
      date: 'Just now',
      views: 1,
      likes: 1,
      comments: 0
    };
    setCreatorContent(prev => [newContentItem, ...prev]);

    showToast('Drop published to The Nest! 🚀');
  };

  const enrollInCourse = (courseId: string) => {
    sounds.playTriumph();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    setCurrentUser(u => ({ ...u, enrolledCoursesCount: u.enrolledCoursesCount + 1 }));
    showToast('Enrolled in Masterclass! Course added to your vault.');
  };

  const markLectureComplete = (courseId: string, lectureId: string) => {
    sounds.playTriumph();
    confetti({ particleCount: 75, spread: 60 });
    setCurrentUser(u => ({ ...u, knowledgeTokens: u.knowledgeTokens + 100 }));
    showToast('Lecture completed! +100 Knowledge Tokens earned.');
  };

  const toggleMilestoneComplete = (roadmapId: string, milestoneId: string) => {
    sounds.playTriumph();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

    setRoadmaps(prevRoadmaps =>
      prevRoadmaps.map(rm => {
        if (rm.id === roadmapId) {
          const updatedMilestones = rm.milestones.map(m => {
            if (m.id === milestoneId) {
              const nextStatus: 'completed' | 'in-progress' =
                m.status === 'completed' ? 'in-progress' : 'completed';
              return { ...m, status: nextStatus };
            }
            return m;
          });
          const completedMilestones = updatedMilestones.filter(m => m.status === 'completed').length;
          return { ...rm, completedMilestones, milestones: updatedMilestones };
        }
        return rm;
      })
    );

    setActiveRoadmap(prev => {
      if (prev && prev.id === roadmapId) {
        const updated = prev.milestones.map(m => {
          if (m.id === milestoneId) {
            const nextStatus: 'completed' | 'in-progress' =
              m.status === 'completed' ? 'in-progress' : 'completed';
            return { ...m, status: nextStatus };
          }
          return m;
        });
        const completedMilestones = updated.filter(m => m.status === 'completed').length;
        return { ...prev, completedMilestones, milestones: updated };
      }
      return prev;
    });

    setCurrentUser(u => ({
      ...u,
      knowledgeTokens: u.knowledgeTokens + 250,
      knowledgeScore: u.knowledgeScore + 15
    }));

    showToast('Milestone achieved! +250 Knowledge Tokens awarded.');
  };

  const cloneRoadmapToMyGoals = (targetRoadmap: RoadmapData) => {
    sounds.playTriumph();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    const newGoal: UserGoal = {
      id: `goal_${Date.now()}`,
      roadmapTitle: targetRoadmap.title,
      roadmapId: targetRoadmap.id,
      targetHoursPerWeek: 10,
      loggedHoursThisWeek: 0,
      targetCompletionDate: '3 Months Target',
      streakDays: 1,
      completedTasks: targetRoadmap.completedMilestones,
      totalTasks: targetRoadmap.totalMilestones,
      weeklyHistory: [0, 0, 0, 0, 0, 0, 0]
    };

    setGoals(prev => [newGoal, ...prev]);
    setCurrentUser(u => ({ ...u, activeRoadmapsCount: u.activeRoadmapsCount + 1 }));
    showToast(`Roadmap "${targetRoadmap.title}" cloned to your learning goals!`);
  };

  const logStudyHours = async (goalId: string, hours: number) => {
    const target = goals.find(g => g.id === goalId || g.backendId === goalId);
    if (!target || hours <= 0) return;

    const nextLogged = (target.loggedHoursThisWeek || 0) + hours;
    const targetHours = target.targetHoursPerWeek || 1;
    const progressPercent = Math.min(100, Math.round((nextLogged / targetHours) * 100));
    setGoals(prev => prev.map(g => g.id === goalId || g.backendId === goalId ? { ...g, loggedHoursThisWeek: nextLogged, progressPercent } : g));

    try {
      if (target.backendId) await goalsApi.update(target.backendId, { completedHours: nextLogged, progressPercent });
      sounds.playChime();
      if (nextLogged >= targetHours) { sounds.playTriumph(); confetti({ particleCount: 50, spread: 50 }); }
      setCurrentUser(u => ({ ...u, knowledgeTokens: u.knowledgeTokens + Math.round(hours * 25) }));
      showToast(`Logged +${hours} hr study! Progress saved.`, 'success');
    } catch {
      setGoals(prev => prev.map(g => g.id === goalId || g.backendId === goalId ? target : g));
      showToast('Could not save your study progress. Please try again.', 'warning');
    }
  };

  const createGoal = async (data: { title: string; category: string; description: string; targetHoursPerWeek: number; targetCompletionDate?: string }) => {
    const response = await goalsApi.create(data);
    const created = response.data?.data?.goal || response.data?.goal;
    if (created) setGoals(prev => [mapBackendGoal(created), ...prev]);
    showToast('Goal saved to your InfoNest profile.', 'success');
  };

  const updateGoal = async (goalId: string, data: Record<string, unknown>) => {
    const response = await goalsApi.update(goalId, data);
    const updated = response.data?.data?.goal || response.data?.goal;
    if (updated) setGoals(prev => prev.map(g => g.backendId === goalId || g.id === goalId ? mapBackendGoal(updated) : g));
    showToast('Goal updated.', 'success');
  };

  const deleteGoal = async (goalId: string) => {
    await goalsApi.remove(goalId);
    setGoals(prev => prev.filter(g => g.backendId !== goalId && g.id !== goalId));
    showToast('Goal removed.', 'info');
  };

  const updateProfile = async (data: Record<string, unknown>) => {
    const response = await usersApi.profile(data);
    const updated = response.data?.data?.user || response.data?.user;
    if (updated) setCurrentUser(mapBackendUser(updated));
    showToast('Profile updated successfully.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    notificationsApi.markRead(id).catch(() => {});
  };

  const markAllNotificationsRead = () => {
    sounds.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    notificationsApi.markAllRead().catch(() => {});
    showToast('All notifications marked as read');
  };

  const deleteContentItem = (id: string) => {
    sounds.playClick();
    setCreatorContent(prev => prev.filter(c => c.id !== id));
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast('Content item archived');
  };

  // ---------------- SIGNATURE INFONEST DOMAIN FEATURES ----------------
  const [knowledgeTrails, setKnowledgeTrails] = useState<KnowledgeTrail[]>([]);
  const [learningMissions, setLearningMissions] = useState<LearningMission[]>([]);
  const [orbitRooms] = useState<OrbitRoom[]>([]);
  const [challenges, setChallenges] = useState<KnowledgeChallenge[]>([]);
  const [knowledgeProofs] = useState<KnowledgeProof[]>([]);

  const [activeTrailModalPost, setActiveTrailModalPost] = useState<Post | null>(null);
  const [activeVaultModalPost, setActiveVaultModalPost] = useState<Post | null>(null);

  const addDropToTrail = (trailId: string, dropTitle: string, dropType: string) => {
    sounds.playChime();
    setKnowledgeTrails(prev =>
      prev.map(tr => {
        if (tr.id === trailId) {
          const newItem: KnowledgeTrailItem = {
            id: `ti_${Date.now()}`,
            title: dropTitle,
            type: dropType as any,
            duration: '5 min',
            completed: false
          };
          return { ...tr, items: [...tr.items, newItem] };
        }
        return tr;
      })
    );
    showToast(`Added to Knowledge Trail! +10 Knowledge Tokens`, 'success');
  };

  const createKnowledgeTrail = (title: string, category: string, description: string) => {
    sounds.playTriumph();
    const newTrail: KnowledgeTrail = {
      id: `trail_${Date.now()}`,
      title,
      category,
      description,
      items: [],
      createdAt: 'Just now'
    };
    setKnowledgeTrails(prev => [newTrail, ...prev]);
    showToast(`Created new Knowledge Trail: "${title}"`, 'success');
  };

  const toggleMissionTask = (missionId: string, taskId: string) => {
    sounds.playClick();
    setLearningMissions(prev =>
      prev.map(m => {
        if (m.id === missionId) {
          const updatedTasks = m.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const allCompleted = completedCount === updatedTasks.length;
          if (allCompleted && !m.completed) {
            sounds.playMissionComplete();
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
            showToast(`Mission Ready to Claim: +${m.rewardTokens} Knowledge Tokens!`, 'success');
          }
          return { ...m, tasks: updatedTasks, progress: completedCount, completed: allCompleted };
        }
        return m;
      })
    );
  };

  const claimMissionReward = (missionId: string) => {
    sounds.playTriumph();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    let rewardAmt = 80;
    setLearningMissions(prev =>
      prev.map(m => {
        if (m.id === missionId) {
          rewardAmt = m.rewardTokens;
          showToast(`Claimed +${m.rewardTokens} Knowledge Tokens!`, 'success');
          return { ...m, claimed: true };
        }
        return m;
      })
    );
    setCurrentUser(prev => ({ ...prev, knowledgeTokens: prev.knowledgeTokens + rewardAmt }));
  };

  const joinOrbitRoom = (roomId: string) => {
    sounds.playChime();
    const room = orbitRooms.find(r => r.id === roomId);
    showToast(`Joined ${room?.name || 'Orbit Room'}! Welcome to the focus sphere.`, 'info');
  };

  const submitChallengeSolution = (challengeId: string) => {
    sounds.playTriumph();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 } });
    setChallenges(prev =>
      prev.map(c => (c.id === challengeId ? { ...c, solved: true, participants: c.participants + 1 } : c))
    );
    setCurrentUser(prev => ({ ...prev, knowledgeTokens: prev.knowledgeTokens + 100 }));
    showToast('Challenge Solution Submitted! +100 Knowledge Tokens awarded.', 'success');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        currentUser,
        creators,
        posts,
        stories,
        courses,
        roadmaps,
        activeRoadmap,
        setActiveRoadmap,
        goals,
        notifications,
        unreadNotificationsCount,
        creatorContent,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        activeStory,
        setActiveStory,
        activeCommentsPostId,
        setActiveCommentsPostId,
        toggleLikePost,
        toggleBookmarkPost,
        toggleFollowCreator,
        addComment,
        getCommentsForPost,
        createPost,
        reactToPost,
        saveToVaultFolder,
        knowledgeTrails,
        addDropToTrail,
        createKnowledgeTrail,
        learningMissions,
        toggleMissionTask,
        claimMissionReward,
        orbitRooms,
        joinOrbitRoom,
        challenges,
        submitChallengeSolution,
        knowledgeProofs,
        activeTrailModalPost,
        setActiveTrailModalPost,
        activeVaultModalPost,
        setActiveVaultModalPost,
        enrollInCourse,
        markLectureComplete,
        toggleMilestoneComplete,
        cloneRoadmapToMyGoals,
        logStudyHours,
        createGoal,
        updateGoal,
        deleteGoal,
        updateProfile,
        markNotificationRead,
        markAllNotificationsRead,
        deleteContentItem,
        refreshCreators,
        refreshContent,
        refreshRoadmaps,
        refreshNotifications,
        isMuted,
        toggleMute,
        isAmbientPlaying,
        toggleAmbient
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
