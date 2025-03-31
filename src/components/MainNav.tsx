
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Map, Compass, Heart, Info, Mountain, UserCircle } from 'lucide-react';

interface MainNavProps {
  className?: string;
}

const MainNav = ({ className }: MainNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      label: 'Explore',
      icon: <Compass className="h-4 w-4 mr-2" />,
      href: '/explore',
    },
    {
      label: 'Maps',
      icon: <Map className="h-4 w-4 mr-2" />,
      href: '/maps',
    },
    {
      label: 'Destinations',
      icon: <Mountain className="h-4 w-4 mr-2" />,
      href: '/destinations',
    },
    {
      label: 'Saved',
      icon: <Heart className="h-4 w-4 mr-2" />,
      href: '/saved-trips',
    },
    {
      label: 'About',
      icon: <Info className="h-4 w-4 mr-2" />,
      href: '/about',
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              isActive 
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
      
      {/* Guide Portal Link */}
      <Link
        to="/guide/login"
        className="flex items-center text-sm font-medium transition-colors hover:text-primary text-muted-foreground ml-2"
      >
        <UserCircle className="h-4 w-4 mr-2" />
        Guide Portal
      </Link>
    </nav>
  );
};

export default MainNav;
