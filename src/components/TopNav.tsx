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
  return <div className="h-16 border-b border-gray-200 flex items-center justify-between px-3 md:px-6 bg-[#202020]">
      {isMobile && <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleSidebar}>
            <PanelLeft size={20} />
          </Button>
          
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/26a595b5-d36b-4512-bf53-e6abc9dc51e5.png" alt="Offbeat Logo" className="h-11 object-contain" />
          </Link>
        </div>}
      
      <div className="flex gap-4 ml-auto">
        <Button variant="outline" asChild className="font-patano">
          <Link to="/login">Log In</Link>
        </Button>
        <Button asChild className="font-patano">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>;
};
export default TopNav;