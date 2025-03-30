
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

const TopNav: React.FC = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-3 md:px-6">
      {isMobile && (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9" 
            onClick={toggleSidebar}
          >
            <PanelLeft size={20} />
          </Button>
          
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/26a595b5-d36b-4512-bf53-e6abc9dc51e5.png" 
              alt="Offbeat Logo" 
              className="h-11 object-contain" /* Increased logo size by 35% from h-8 to h-11 */
            />
          </Link>
        </div>
      )}
      
      <div className="flex gap-4 ml-auto">
        <Button variant="outline" asChild className="font-patano">
          <Link to="/login">Log In</Link>
        </Button>
        <Button asChild className="font-patano">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
};

export default TopNav;
