
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Compass, 
  Map, 
  Globe, 
  BookMarked,
  Menu, 
  X,
  Info
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MainNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Automatically close nav when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Default to closed on mobile when component mounts
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const toggleNav = () => setIsOpen(!isOpen);

  const NavItems = [
    { name: 'Explore', icon: <Compass className="h-5 w-5" />, path: '/explore' },
    { name: 'Saved Trips', icon: <BookMarked className="h-5 w-5" />, path: '/saved-trips' },
    { name: 'Destinations', icon: <Globe className="h-5 w-5" />, path: '/destinations' },
    { name: 'Maps', icon: <Map className="h-5 w-5" />, path: '/maps' },
    { name: 'About', icon: <Info className="h-5 w-5" />, path: '/about' },
  ];

  // When closed on mobile, just show a narrow strip with the toggle button
  if (isMobile && !isOpen) {
    return (
      <div className="fixed left-0 top-0 bottom-0 z-50 w-12 bg-white shadow-md flex flex-col items-center pt-4">
        <Button 
          onClick={toggleNav} 
          variant="ghost" 
          size="icon" 
          className="mb-6"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed left-0 top-0 bottom-0 z-50 bg-white shadow-md transition-all duration-300 ${isMobile ? 'w-64' : 'w-64'}`}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8">
          <NavLink to="/" className="flex items-center" onClick={() => isMobile && setIsOpen(false)}>
            <img 
              src="/lovable-uploads/634c6424-71cf-4efb-ad76-3068d848e0a4.png" 
              alt="Offbeat Logo" 
              className="h-10"
            />
          </NavLink>
          
          {isMobile && (
            <Button onClick={toggleNav} variant="ghost" size="icon">
              <X className="h-5 w-5" />
              <span className="sr-only">Close Menu</span>
            </Button>
          )}
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {NavItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="px-4 py-2">
            <h4 className="text-sm font-medium text-gray-400">
              Version 1.0.0
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
