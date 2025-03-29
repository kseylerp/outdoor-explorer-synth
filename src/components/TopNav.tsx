
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TopNav: React.FC = () => {
  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-end px-6">
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link to="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
};

export default TopNav;
