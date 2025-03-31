
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Map, Calendar, User, LogOut, PlusCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const GuideNavigation: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    {
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      href: '/guide/dashboard',
    },
    {
      label: 'My Trips',
      icon: <Map className="h-5 w-5" />,
      href: '/guide/trips',
    },
    {
      label: 'Create Trip',
      icon: <PlusCircle className="h-5 w-5" />,
      href: '/guide/create-trip',
    },
    {
      label: 'Bookings',
      icon: <Calendar className="h-5 w-5" />,
      href: '/guide/bookings',
    },
    {
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      href: '/guide/profile',
    },
    {
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/guide/settings',
    },
  ];

  return (
    <nav className={`${isMobile ? 'px-2 py-3' : 'px-4 py-6'} border-r h-full flex flex-col`}>
      <div className="mb-6">
        <Link to="/guide/dashboard" className="flex items-center">
          <span className="text-lg font-bold">Guide Portal</span>
        </Link>
      </div>
      
      <div className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {item.icon}
            <span className={isMobile ? 'sr-only' : ''}>{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <Link to="/">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            <span className={isMobile ? 'sr-only' : ''}>Exit Guide Portal</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default GuideNavigation;
