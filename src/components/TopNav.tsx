
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ModelSelector from './ModelSelector';

const TopNav: React.FC<{ hideModelSelector?: boolean }> = ({ hideModelSelector = false }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent';
  };

  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center px-4 sm:px-6">
        <div className="mr-8 hidden md:flex">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="offbeat-gradient">OffBeat</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center space-x-2 sm:space-x-4 md:justify-start">
          <Link 
            to="/" 
            className={`h-8 rounded-md px-3 py-1.5 text-sm font-medium ${isActive('/')}`}
          >
            Home
          </Link>
          <Link 
            to="/explore" 
            className={`h-8 rounded-md px-3 py-1.5 text-sm font-medium ${isActive('/explore')}`}
          >
            Explore
          </Link>
          <Link 
            to="/chat" 
            className={`h-8 rounded-md px-3 py-1.5 text-sm font-medium ${isActive('/chat')}`}
          >
            Chat
          </Link>
          <Link 
            to="/agent" 
            className={`h-8 rounded-md px-3 py-1.5 text-sm font-medium ${isActive('/agent')}`}
          >
            AI Assistant
          </Link>
        </div>
        
        <div className="flex items-center">
          {!hideModelSelector && <ModelSelector />}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
