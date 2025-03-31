
import React from 'react';
import { Outlet } from 'react-router-dom';
import GuideNavigation from '@/components/guide/GuideNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const GuideLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen">
      <div className={`${isMobile ? 'w-16' : 'w-64'} h-full shrink-0`}>
        <GuideNavigation />
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default GuideLayout;
