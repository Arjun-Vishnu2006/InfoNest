export type UserRole = 'student' | 'creator';

export interface CurrentUser {
  id: string;
  username: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  role: string;
  bio: string;
  headline: string;
  location: string;
  about: string;
  education: string;
  experience: string;
  certificates: string[];
  email: string;
  phone: string;
  reputationScore: number;
  isVerified: boolean;
  expertiseArea: string;
  knowledgeTokens: number;
  knowledgeScore: number;
  streakDays: number;
  enrolledCoursesCount: number;
  activeRoadmapsCount: number;
  completedCertificatesCount: number;
  skills: string[];
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface Creator {
  id: string;
  username: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  role: string;
  specialty: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  studentCount: number;
  totalLectures: number;
  rating: number;
  isFollowed: boolean;
  verified: boolean;
  knowledgeTokens: number;
  knowledgeScore: number;
  expertiseTags: string[];
  recentDropsCount?: number;
  recentContent?: string[];
  weeklyGrowth?: {
    followers: string;
    views: string;
    students: string;
  };
}

export type SparkCategory =
  | 'Flashcard'
  | 'Quick Tip'
  | 'Mini Lecture'
  | 'Thought'
  | 'Challenge'
  | 'Research';

export interface StorySlide {
  id: string;
  type: 'tip' | 'code' | 'insight' | 'quiz';
  title: string;
  content: string;
  codeSnippet?: string;
  language?: string;
  bgGradient: string;
}

export interface Story {
  id: string;
  creatorId: string;
  creator: Creator;
  title: string;
  category: SparkCategory;
  categoryColor?: string;
  previewImage: string;
  hasUnseen: boolean;
  timestamp?: string;
  viewed?: boolean;
  slides: StorySlide[];
}

export interface QuizCheckpoint {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface TranscriptLine {
  time: string;
  text: string;
}

export interface LectureChapter {
  id: string;
  title: string;
  timestamp: string;
  durationSeconds: number;
  completed?: boolean;
}

export interface LectureResource {
  id: string;
  title: string;
  type: 'pdf' | 'github' | 'cheatsheet' | 'dataset';
  url: string;
  size?: string;
}

export interface LectureData {
  videoUrl: string;
  duration: string;
  durationSeconds: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  chapters: LectureChapter[];
  resources: LectureResource[];
  notes: string;
  transcriptSnippet?: string;
  transcript?: TranscriptLine[];
  quizCheckpoint?: QuizCheckpoint;
  curriculumCourseId?: string;
}

export interface ThoughtData {
  thought: string;
  codeSnippet?: string;
  language?: string;
  keyTakeaways: string[];
}

export interface RoadmapMilestone {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked';
  estimatedHours: number;
  skills: string[];
  recommendedLectures: string[];
  projectIdea?: string;
}

export interface RoadmapData {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  totalMilestones: number;
  completedMilestones: number;
  estimatedWeeks: number;
  milestones: RoadmapMilestone[];
  clonesCount: number;
  skillsCovered: string[];
  certificatePath: string;
}

export type PostType =
  | 'knowledge'
  | 'lecture'
  | 'thought'
  | 'visual'
  | 'code'
  | 'roadmap'
  | 'challenge'
  | 'research'
  | 'carousel'
  | 'quiz';

export type KnowledgeReactionType =
  | 'insightful'
  | 'useful'
  | 'mindOpening'
  | 'practical'
  | 'like';

export interface KnowledgeReactions {
  insightful: number;
  useful: number;
  mindOpening: number;
  practical: number;
  like: number;
}

export interface ChallengePayload {
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Extreme';
  participantsCount: number;
  rewardTokens: number;
  deadline: string;
  prompt: string;
}

export interface ResearchPayload {
  paperTitle: string;
  venue: string;
  keyFindings: string[];
  pdfUrl?: string;
}

export interface Post {
  id: string;
  creatorId: string;
  creator: Creator;
  coCreator?: Creator;
  type: PostType;
  dropTypeLabel?: string;
  title: string;
  caption: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  reactions: KnowledgeReactions;
  userReaction?: KnowledgeReactionType;
  carouselImages?: string[];
  lectureData?: LectureData;
  thoughtData?: ThoughtData;
  roadmapData?: RoadmapData;
  challengeData?: ChallengePayload;
  researchData?: ResearchPayload;
  diagramUrl?: string;
  pinnedComment?: Comment;
}

export interface Comment {
  id: string;
  postId: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    roleBadge?: string;
  };
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  isPinned?: boolean;
  replies?: Comment[];
}

export interface CourseLecture {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isFreePreview: boolean;
  isCompleted: boolean;
  notes?: string;
  resources?: LectureResource[];
  quiz?: QuizCheckpoint;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lectures: CourseLecture[];
}

export interface CourseReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CertificateDetails {
  title: string;
  issuer: string;
  credentialId: string;
  skillsCertified: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  creator: Creator;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  category: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  estimatedHours: number;
  coverImage: string;
  tags: string[];
  modules: CourseModule[];
  whatYouWillLearn: string[];
  requirements: string[];
  certificateAvailable: boolean;
  certificateDetails?: CertificateDetails;
  reviews: CourseReview[];
  isEnrolled: boolean;
  progressPercent: number;
  instructor?: string;
  learners?: number;
  duration?: string;
  difficulty?: string;
  youtubeUrl?: string;
  thumbnail?: string;
  skills?: string[];
  completedLessons?: number;
  totalLessons?: number;
}

export interface UserGoal {
  id: string;
  title?: string;
  category?: string;
  description?: string;
  status?: 'active' | 'archived' | 'pending';
  backendId?: string;
  progressPercent?: number;
  completedHours?: number;
  roadmapTitle: string;
  roadmapId?: string;
  targetHoursPerWeek: number;
  loggedHoursThisWeek: number;
  targetCompletionDate: string;
  streakDays: number;
  completedTasks: number;
  totalTasks: number;
  weeklyHistory: number[];
  courseId?: string;
  instructor?: string;
  completedLessons?: number;
  totalLessons?: number;
  startDate?: string;
}

export interface NotificationItem {
  id: string;
  category:
    | 'social'
    | 'learning'
    | 'creator'
    | 'goals'
    | 'system'
    | 'missions';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'post' | 'lecture' | 'course' | 'roadmap';
  status: 'published' | 'draft' | 'archived';
  date: string;
  views: number;
  likes: number;
  comments: number;
}

export interface AnalyticsData {
  followerGrowth: { date: string; followers: number }[];
  watchTime: { date: string; hours: number }[];
  enrollments: { date: string; count: number }[];
  audienceActivity: { time: string; active: number }[];
}

export interface KnowledgeTrailItem {
  id: string;
  title: string;
  type: 'drop' | 'lecture' | 'course' | 'quiz' | 'project';
  duration?: string;
  completed?: boolean;
  sourceUrl?: string;
}

export interface KnowledgeTrail {
  id: string;
  title: string;
  category: string;
  description: string;
  items: KnowledgeTrailItem[];
  createdAt: string;
}

export interface MissionTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface LearningMission {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'roadmap' | 'course' | 'community';
  description: string;
  tasks: MissionTask[];
  rewardTokens: number;
  progress: number;
  total: number;
  completed: boolean;
  claimed: boolean;
}

export interface OrbitRoom {
  id: string;
  name: string;
  tag: string;
  description: string;
  membersCount: number;
  activeNow: number;
  icon: string;
  gradient: string;
  topTopics: string[];
  recentDropTitle: string;
}

export interface KnowledgeChallenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Extreme';
  category: string;
  participants: number;
  deadline: string;
  rewardTokens: number;
  description: string;
  tags: string[];
  solved?: boolean;
}

export interface KnowledgeProof {
  id: string;
  proofNumber: number;
  title: string;
  completedDate: string;
  lecturesCount: number;
  projectsCount: number;
  quizzesCount: number;
  totalHours: number;
  verificationHash: string;
  badgeColor: string;
}

export interface LearningDNATopic {
  name: string;
  percentage: number;
  level: string;
  color: string;
}

export interface KnowledgeWeatherItem {
  topic: string;
  trend: 'Rising' | 'Hot' | 'Emerging' | 'Stable';
  arrow: '↑' | '↗' | '→';
  color: string;
}
