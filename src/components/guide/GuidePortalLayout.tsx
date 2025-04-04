
import React from 'react';
import { Outlet } from 'react-router-dom';
import GuidePortalSidebar from './GuidePortalSidebar';
import AuthGuard from './AuthGuard';

const GuidePortalLayout: React.FC = () => {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-background">
        <GuidePortalSidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
};

export default GuidePortalLayout;
