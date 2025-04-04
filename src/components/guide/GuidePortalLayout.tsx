
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import GuidePortalSidebar from './GuidePortalSidebar';
import AuthGuard from './AuthGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GuidePortalLayout: React.FC = () => {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-background">
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
              <h1 className="text-xl font-semibold text-primary">Guide Portal</h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default GuidePortalLayout;
