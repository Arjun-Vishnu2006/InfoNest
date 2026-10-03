import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { RightRail } from './RightRail';
import { MobileNav } from './MobileNav';
import { ToastContainer } from './ToastContainer';
import { StoryViewerModal } from '../feed/StoryViewerModal';
import { CommentsModal } from '../feed/CommentsModal';
import { AddToTrailModal } from '../modals/AddToTrailModal';
import { SaveToVaultModal } from '../modals/SaveToVaultModal';
import { useApp } from '../../context/AppContext';
import { CosmicChatWidget } from '../ai/CosmicChatWidget';

interface MainLayoutProps {
  children: React.ReactNode;
  showRightRail?: boolean;
  showSidebar?: boolean;
  fullWidth?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showRightRail = false,
  showSidebar = true,
  fullWidth = false
}) => {
  const { activeStory, setActiveStory, activeCommentsPostId, setActiveCommentsPostId } = useApp();

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white pb-20 lg:pb-0">
      {/* Persistent Glass Navigation */}
      <Navbar />

      {/* Main Layout Grid */}
      <div className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 ${fullWidth ? 'max-w-full' : 'max-w-7xl'}`}>
        {/* Left Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Dynamic Center Page Viewport */}
        <main className="flex-1 min-w-0 py-6">
          {children}
        </main>

        {/* Right Rail Sidebar (Optional, e.g. on /feed) */}
        {showRightRail && <RightRail />}
      </div>

      {/* Mobile Bottom Bar */}
      <MobileNav />

      {/* Floating Micro-Toasts */}
      <ToastContainer />

      {/* Global Modals for Stories, Discussions, Trails, and Vault */}
      <StoryViewerModal
        story={activeStory}
        onClose={() => setActiveStory(null)}
      />

      <CommentsModal
        postId={activeCommentsPostId}
        onClose={() => setActiveCommentsPostId(null)}
      />

      <AddToTrailModal />
      <SaveToVaultModal />

      {/* Floating Cosmos AI assistant */}
      <CosmicChatWidget />
    </div>
  );
};
