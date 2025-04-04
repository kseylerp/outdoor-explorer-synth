
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Settings, 
  UserCircle, 
  Briefcase, 
  Activity, 
  ThumbsUp,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const GuidePortalSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const menuItems = [
    {
      to: "/guide-portal",
      icon: <Activity size={20} />,
      label: "Dashboard",
      exact: true
    },
    {
      to: "/guide-portal/activities",
      icon: <Activity size={20} />,
      label: "Activities"
    },
    {
      to: "/guide-portal/add-activity",
      icon: <PlusCircle size={20} />,
      label: "Add Activity"
    },
    {
      to: "/guide-portal/services",
      icon: <Briefcase size={20} />,
      label: "Services"
    },
    {
      to: "/guide-portal/content",
      icon: <BookOpen size={20} />,
      label: "Content"
    },
    {
      to: "/guide-portal/profile",
      icon: <UserCircle size={20} />,
      label: "Profile"
    },
    {
      to: "/guide-portal/settings",
      icon: <Settings size={20} />,
      label: "Settings"
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-primary">Guide Portal</h1>
        <p className="text-sm text-muted-foreground">Manage your guide services</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md
                ${isActive(item.to, item.exact) 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default GuidePortalSidebar;
