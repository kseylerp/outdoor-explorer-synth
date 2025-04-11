
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExploreHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Let's find an <span className="offbeat-gradient">offbeat</span> adventure
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powered by local guides: explore, plan, and experience better trips
        </p>
      </div>

      <div className="mb-6 flex justify-end">
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </>
  );
};

export default ExploreHeader;
