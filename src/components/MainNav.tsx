
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Search, User, Compass, Map, Home, Info } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const MainNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/8b8622ba-f80e-476f-b72c-53a6a407f074.png" 
                  alt="Yugen Logo" 
                  className="h-10" 
                />
              </Link>
              <SidebarTrigger />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/')}
                  tooltip="Home"
                >
                  <Home className="mr-2" size={20} />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/explore')}
                  tooltip="Explore"
                >
                  <Compass className="mr-2" size={20} />
                  <span>Explore</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/destinations')}
                  tooltip="Destinations"
                >
                  <MapPin className="mr-2" size={20} />
                  <span>Destinations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/maps')}
                  tooltip="Maps"
                >
                  <Map className="mr-2" size={20} />
                  <span>Maps</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/about')}
                  tooltip="About"
                >
                  <Info className="mr-2" size={20} />
                  <span>About</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="bg-background/80 backdrop-blur-sm"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainNav;
