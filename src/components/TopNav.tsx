
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface TopNavProps {
  hideModelSelector?: boolean;
}

const TopNav: React.FC<TopNavProps> = ({
  hideModelSelector
}) => {
  const isMobile = useIsMobile();
  const {
    toggleSidebar
  } = useSidebar();
  const location = useLocation();

  // Don't show TopNav on guide portal routes
  if (location.pathname.startsWith('/guide-portal')) {
    return null;
  }
  
  return (
    <div className="h-20 flex items-center justify-between px-3 md:px-6 bg-[#F4F7F3] dark:bg-[#1E1E1E] top-nav">
      {isMobile && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleSidebar}>
            <PanelLeft size={20} />
          </Button>
          
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/9f6d8016-f016-4bc2-b123-529e15a7164a.png" alt="Offbeat Logo" className="h-10 object-contain" />
          </Link>
        </div>
      )}
      
      <div className="flex gap-4 ml-auto">
        <Button variant="outline" asChild className="font-patano">
          <Link to="/login">Log In</Link>
        </Button>
        <Button 
          asChild 
          className="font-patano primary-button"
        >
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
};

export default TopNav;
