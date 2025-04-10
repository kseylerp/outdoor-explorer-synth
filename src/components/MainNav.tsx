import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, MapPin, Tent, Map, Users, Info, Settings, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MainNav: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Create sidebar navigation items
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />,
      isActive: location.pathname === '/'
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: <Compass className="h-5 w-5" />,
      isActive: location.pathname === '/explore'
    },
    {
      name: 'Saved Trips',
      href: '/saved-trips',
      icon: <Heart className="h-5 w-5" />,
      isActive: location.pathname === '/saved-trips'
    },
    {
      name: 'Trip Builder',
      href: '/trip-response',
      icon: <Sparkles className="h-5 w-5" />,
      isActive: location.pathname === '/trip-response'
    },
    {
      name: 'Maps',
      href: '/maps',
      icon: <MapPin className="h-5 w-5" />,
      isActive: location.pathname === '/maps'
    },
    {
      name: 'Campgrounds',
      href: '/campgrounds',
      icon: <Tent className="h-5 w-5" />,
      isActive: location.pathname === '/campgrounds'
    },
    {
      name: 'Destinations',
      href: '/destinations',
      icon: <Map className="h-5 w-5" />,
      isActive: location.pathname === '/destinations'
    },
    {
      name: 'Guides',
      href: '/guide',
      icon: <Users className="h-5 w-5" />,
      isActive: location.pathname.startsWith('/guide')
    },
    {
      name: 'About',
      href: '/about',
      icon: <Info className="h-5 w-5" />,
      isActive: location.pathname === '/about'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      isActive: location.pathname === '/settings'
    }
  ];

  return (
    <nav className={`flex flex-col ${isMobile ? 'w-full' : 'w-64'} p-4 bg-purple-50 border-r border-purple-200`}>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md
                ${isActive ? 'bg-purple-200 text-purple-800 font-medium' : 'text-gray-700 hover:bg-purple-100 hover:text-purple-700'}`
              }
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainNav;
