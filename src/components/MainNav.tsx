
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Map, BookmarkIcon, Users, ShieldQuestion, Info, Settings, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const MainNav: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Default to collapsed menu on mobile
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [isMobile]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggle = () => {
    setExpanded(!expanded);
  };

  return <div className={`border-r border-gray-200 h-screen bg-sidebar transition-all duration-300 ${expanded ? 'w-64' : 'w-16'} relative`}>
      <div className="h-full flex flex-col">
        {/* Header with logo and toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {expanded ? <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/26a595b5-d36b-4512-bf53-e6abc9dc51e5.png" alt="Full Logo Offbeat" className="h-[18.9px]" />
            </Link> : <Link to="/" className="mx-auto">
              <img src="/lovable-uploads/5cd21b79-7686-4d3e-8585-a855c80c5d21.png" alt="Truncated Logo" className="h-[10.8px] w-[10.8px] object-contain" />
            </Link>}
          
          <Button variant="ghost" size="sm" className={`${expanded ? '' : 'hidden'}`} onClick={toggle}>
            <PanelLeft size={20} />
          </Button>
        </div>
        
        {/* Main menu - hidden on mobile when collapsed */}
        <div className={`flex-1 overflow-y-auto py-4 ${isMobile && !expanded ? 'hidden' : ''}`}>
          <nav className="space-y-1 px-2">
            <MenuItem to="/" icon={<Compass size={20} />} label="Explore" active={isActive('/') || isActive('/explore')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/saved-trips" icon={<BookmarkIcon size={20} />} label="Saved Trips" active={isActive('/saved-trips')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/maps" icon={<Map size={20} />} label="Maps" active={isActive('/maps')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/buddies" icon={<Users size={20} />} label="Buddies" active={isActive('/buddies')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/guides" icon={<ShieldQuestion size={20} />} label="Guides" active={isActive('/guides')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/about" icon={<Info size={20} />} label="About" active={isActive('/about')} expanded={expanded} onClick={() => {}} />
            
            <MenuItem to="/settings" icon={<Settings size={20} />} label="Settings" active={isActive('/settings')} expanded={expanded} onClick={() => {}} />
          </nav>
        </div>
        
        {/* Mobile toggle button - only shown on mobile */}
        {!expanded && <Button variant="ghost" size="sm" className="absolute bottom-4 left-0 right-0 mx-auto" onClick={toggle}>
            <PanelLeft size={20} className="transform rotate-180" />
          </Button>}
      </div>
    </div>;
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
  return <Link to={to} className={`
        flex items-center px-2 py-2 text-sm font-medium rounded-md
        ${active ? 'bg-purple-100 text-[#9870FF]' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
        ${expanded ? '' : 'justify-center'}
      `} onClick={onClick}>
      <div className="mr-3 flex-shrink-0">{icon}</div>
      {expanded && <span className="font-patano">{label}</span>}
    </Link>;
};

export default MainNav;
