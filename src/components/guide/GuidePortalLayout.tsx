
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import GuidePortalSidebar from './GuidePortalSidebar';
import AuthGuard from './AuthGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import TopNav from '@/components/TopNav';

const GuidePortalLayout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean);
  const currentSection = path.length > 1 ? path[1].charAt(0).toUpperCase() + path[1].slice(1) : 'Dashboard';
  
  // Determine the page title based on the current route
  let pageTitle = 'Guide Portal';
  if (currentSection === 'Add-activity') {
    pageTitle = 'Add New Activity';
  } else if (currentSection.startsWith('Edit-activity')) {
    pageTitle = 'Edit Activity';
  } else if (currentSection !== 'Dashboard') {
    pageTitle = `${currentSection}`;
  }

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen w-full bg-background">
        <TopNav hideModelSelector={true} />
        <div className="flex flex-1 overflow-hidden">
          <GuidePortalSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Main App
                  </Link>
                </Button>
                <div className="flex items-center">
                  <Link to="/guide-portal" className="hover:text-primary">
                    <Home className="h-4 w-4 mr-2 inline" />
                  </Link>
                  <span className="text-muted-foreground mx-2">/</span>
                  <h1 className="text-xl font-semibold text-primary">{pageTitle}</h1>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default GuidePortalLayout;
