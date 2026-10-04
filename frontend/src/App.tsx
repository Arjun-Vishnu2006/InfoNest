import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';

import { FeedPage } from './pages/FeedPage';
import { ExplorePage } from './pages/ExplorePage';
import { SearchPage } from './pages/SearchPage';
import { CreatorsPage } from './pages/CreatorsPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LecturePlayerPage } from './pages/LecturePlayerPage';
import { RoadmapsPage } from './pages/RoadmapsPage';
import { RoadmapDetailPage } from './pages/RoadmapDetailPage';
import { GoalsPage } from './pages/GoalsPage';
import { SavedVaultPage } from './pages/SavedVaultPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MessagesPage } from './pages/MessagesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { MissionsPage } from './pages/MissionsPage';
import { OrbitRoomsPage } from './pages/OrbitRoomsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { CreatorDashboardPage } from './pages/creator/CreatorDashboardPage';
import { CreatorContentPage } from './pages/creator/CreatorContentPage';
import { CreatorStudioPage } from './pages/creator/CreatorStudioPage';
import { CreatePostPage } from './pages/creator/CreatePostPage';
import { CreateCoursePage } from './pages/creator/CreateCoursePage';
import { CreateRoadmapPage } from './pages/creator/CreateRoadmapPage';

const Protected = ({ children }: { children: React.ReactNode }) => <ProtectedRoute>{children}</ProtectedRoute>;

const StartPage = () => {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="min-h-screen bg-[#07080D] text-white flex items-center justify-center">Loading InfoNest…</div>;
  return <Navigate to={user ? '/feed' : '/login'} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Protected><Logout /></Protected>} />
          <Route path="/" element={<StartPage />} />
          <Route path="/home" element={<StartPage />} />
          <Route path="/feed" element={<Protected><FeedPage /></Protected>} />
          <Route path="/explore" element={<Protected><ExplorePage /></Protected>} />
          <Route path="/search" element={<Protected><SearchPage /></Protected>} />
          <Route path="/creators" element={<Protected><CreatorsPage /></Protected>} />
          <Route path="/creator/:username" element={<Protected><CreatorProfilePage /></Protected>} />
          <Route path="/courses" element={<Protected><CoursesPage /></Protected>} />
          <Route path="/course/:courseId" element={<Protected><CourseDetailPage /></Protected>} />
          <Route path="/course/:courseId/learn" element={<Navigate to="/lecture/lec_1" replace />} />
          <Route path="/lecture/:lectureId" element={<Protected><LecturePlayerPage /></Protected>} />
          <Route path="/roadmaps" element={<Protected><RoadmapsPage /></Protected>} />
          <Route path="/roadmap/:roadmapId" element={<Protected><RoadmapDetailPage /></Protected>} />
          <Route path="/goals" element={<Protected><GoalsPage /></Protected>} />
          <Route path="/progress" element={<Navigate to="/goals" replace />} />
          <Route path="/missions" element={<Protected><MissionsPage /></Protected>} />
          <Route path="/orbit-rooms" element={<Protected><OrbitRoomsPage /></Protected>} />
          <Route path="/challenges" element={<Protected><ChallengesPage /></Protected>} />
          <Route path="/saved" element={<Protected><SavedVaultPage /></Protected>} />
          <Route path="/notifications" element={<Protected><NotificationsPage /></Protected>} />
          <Route path="/messages" element={<Protected><MessagesPage /></Protected>} />
          <Route path="/profile" element={<Protected><UserProfilePage /></Protected>} />
          <Route path="/profile/:profileId" element={<Protected><PublicProfilePage /></Protected>} />
          <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
          <Route path="/post/:postId" element={<Protected><PostDetailPage /></Protected>} />
          <Route path="/creator" element={<Navigate to="/creator/dashboard" replace />} />
          <Route path="/creator/dashboard" element={<Protected><CreatorDashboardPage /></Protected>} />
          <Route path="/creator/content" element={<Protected><CreatorContentPage /></Protected>} />
          <Route path="/creator/studio" element={<Protected><CreatorStudioPage /></Protected>} />
          <Route path="/create/post" element={<Protected><CreatePostPage /></Protected>} />
          <Route path="/create/course" element={<Protected><CreateCoursePage /></Protected>} />
          <Route path="/create/roadmap" element={<Protected><CreateRoadmapPage /></Protected>} />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}
