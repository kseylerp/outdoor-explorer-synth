
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Map, BookmarkIcon, Users, ShieldQuestion, Info, Settings, PanelLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

// Secret routes that should only be accessible via direct URL
const ADMIN_MODE = false; // Set to true when you need to access hidden routes

const MainNav: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [isMobile]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggle = () => {
    setExpanded(!expanded);
  };

  // Check if we're on a guide portal route to conditionally render main nav
  const isGuidePortalRoute = location.pathname.startsWith('/guide-portal');
  if (isGuidePortalRoute) {
    return null; // Don't show main nav on guide portal routes
  }
  
  return (
    <div className={`main-nav transition-all duration-300 ${expanded ? 'w-64' : 'w-16'} relative`}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3 h-16 top-nav">
          {expanded ? (
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/9f6d8016-f016-4bc2-b123-529e15a7164a.png" alt="Full Logo Offbeat" className="h-10" />
            </Link>
          ) : (
            <Link to="/" className="mx-auto">
              <img src="/lovable-uploads/7c343b4f-ae71-4da6-a6e3-86d7a8654cf8.png" alt="Truncated Logo" className="h-8 w-8 object-contain" />
            </Link>
          )}
          
          <Button variant="ghost" size="sm" className={`${expanded ? '' : 'hidden'}`} onClick={toggle}>
            <PanelLeft size={20} />
          </Button>
        </div>
        
        <div className={`flex-1 overflow-y-auto py-4 ${isMobile && !expanded ? 'hidden' : ''}`}>
          <nav className="space-y-1 px-2">
            <MenuItem to="/" icon={<Compass size={20} />} label="Explore" active={isActive('/') || isActive('/explore')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/saved-trips" icon={<BookmarkIcon size={20} />} label="Saved Trips" active={isActive('/saved-trips')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/realtime-chat" icon={<MessageCircle size={20} />} label="AI Assistant" active={isActive('/realtime-chat')} expanded={expanded} onClick={() => {}} />
            
            {ADMIN_MODE && <MenuItem to="/maps" icon={<Map size={20} />} label="Maps" active={isActive('/maps')} expanded={expanded} onClick={() => {}} />}
            
            <MenuItem to="/companions" icon={<Users size={20} />} label="Companions" active={isActive('/companions')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/guides" icon={<ShieldQuestion size={20} />} label="Guides" active={isActive('/guides')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/about" icon={<Info size={20} />} label="About" active={isActive('/about')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/settings" icon={<Settings size={20} />} label="Settings" active={isActive('/settings')} expanded={expanded} onClick={() => {}} />
            
            {ADMIN_MODE && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <MenuItem to="/guide-portal" icon={<ShieldQuestion size={20} />} label="Guide Portal" active={isActive('/guide-portal')} expanded={expanded} onClick={() => {}} />
              </div>
            )}
          </nav>
        </div>
        
        {!expanded && (
          <Button variant="ghost" size="sm" className="absolute bottom-4 left-0 right-0 mx-auto" onClick={toggle}>
            <PanelLeft size={20} className="transform rotate-180" />
          </Button>
        )}
      </div>
    </div>
  );
};

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  to,
  icon,
  label,
  active,
  expanded,
  onClick
}) => {
  return (
    <Link 
      to={to} 
      className={`
        flex items-center px-2 py-2 text-sm font-medium rounded-md
        ${active ? 'bg-gray-100 text-[#65558F] dark:bg-gray-800 dark:text-[#9870FF]' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'}
        ${expanded ? '' : 'justify-center'}
      `} 
      onClick={onClick}
    >
      <div className="mr-3 flex-shrink-0">{icon}</div>
      {expanded && <span>{label}</span>}
    </Link>
  );
};

export default MainNav;
