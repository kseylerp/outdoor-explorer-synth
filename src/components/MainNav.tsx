
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Map, Home, Info, Settings, BookmarkIcon, Users, ShieldQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MainNav: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`border-r border-gray-200 h-screen bg-sidebar transition-all duration-300 ${expanded ? 'w-64' : 'w-16'} relative`}>
      <div className="h-full flex flex-col">
        {/* Header with logo and toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {expanded ? (
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/276785dd-4ac8-4986-89e4-8c33996a2328.png" 
                alt="Yugen Logo" 
                className="h-10" 
              />
            </Link>
          ) : (
            <Link to="/" className="mx-auto">
              <img 
                src="/lovable-uploads/415e5bda-5480-4158-9919-7aa03de8a8ba.png" 
                alt="Yugen Logo" 
                className="h-10 w-10 object-contain" 
              />
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${expanded ? '' : 'hidden'}`} 
            onClick={toggle}
          >
            <img 
              src="/lovable-uploads/415e5bda-5480-4158-9919-7aa03de8a8ba.png" 
              alt="Toggle" 
              className="h-6 w-6"
            />
          </Button>
        </div>
        
        {/* Main menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            <MenuItem 
              to="/explore" 
              icon={<Compass size={20} />} 
              label="Explore" 
              active={isActive('/explore')} 
              expanded={expanded} 
              onClick={() => {}} 
            />
            
            <MenuItem 
              to="/saved-trips" 
              icon={<BookmarkIcon size={20} />} 
              label="Saved Trips" 
              active={isActive('/saved-trips')} 
              expanded={expanded} 
              onClick={() => {}} 
            />
            
            <MenuItem 
              to="/maps" 
              icon={<Map size={20} />} 
              label="Maps" 
              active={isActive('/maps')} 
              expanded={expanded} 
              onClick={() => {}} 
            />
            
            <MenuItem 
              to="/buddies" 
              icon={<Users size={20} />} 
              label="Buddies" 
              active={isActive('/buddies')} 
              expanded={expanded} 
              onClick={() => {}} 
            />
            
            <MenuItem 
              to="/guides" 
              icon={<ShieldQuestion size={20} />} 
              label="Guides" 
              active={isActive('/guides')} 
              expanded={expanded} 
              onClick={() => {}} 
            />
            
            <MenuItem 
              to="/about" 
              icon={<Info size={20} />} 
              label="About" 
              active={isActive('/about')} 
              expanded={expanded} 
              onClick={() => {}} 
            />
            
            <MenuItem 
              to="/settings" 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={isActive('/settings')} 
              expanded={expanded} 
              onClick={() => {}} 
            />
          </nav>
        </div>
        
        {/* Expand button when collapsed */}
        {!expanded && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute bottom-4 left-0 right-0 mx-auto" 
            onClick={toggle}
          >
            <img 
              src="/lovable-uploads/415e5bda-5480-4158-9919-7aa03de8a8ba.png" 
              alt="Toggle" 
              className="h-6 w-6 transform rotate-180"
            />
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
        ${active 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }
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
