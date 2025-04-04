
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: ReactNode;
}

// Placeholder function that always returns true for now
const hasGuidePermission = async (): Promise<boolean> => {
  return true;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkPermission = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to access the Guide Portal.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const permitted = await hasGuidePermission();
      
      setHasPermission(permitted);
      setLoading(false);
    };
    
    checkPermission();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For now, always allow access
  return <>{children}</>;
};

export default AuthGuard;
