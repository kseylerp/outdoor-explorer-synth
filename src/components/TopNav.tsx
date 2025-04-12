
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
    toggleSidebar,
    isOpen
  } = useSidebar();
  const location = useLocation();

  // Don't show TopNav on guide portal routes
  if (location.pathname.startsWith('/guide-portal')) {
    return null;
  }
  
  return (
    <div className="h-20 flex items-center justify-between px-3 md:px-6 bg-[#FBFFFB] dark:bg-[#1E1E1E] top-nav border-b border-white/20">
      {isMobile && (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9" 
            onClick={toggleSidebar}
          >
            <PanelLeft size={20} />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/70848957-e79d-4807-b3cf-df0ac2d7fcda.png" alt="Offbeet Logo" className="h-10 object-contain" />
          </Link>
        </div>
      )}
      
      <div className="flex gap-4 ml-auto">
        <Button variant="outline" asChild className="font-medium">
          <Link to="/login">Log In</Link>
        </Button>
        <Button 
          asChild 
          className="font-medium primary-button"
        >
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
};

export default TopNav;
