
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: ReactNode;
}

// This is a placeholder function - in a real app, you'd check this against your backend
const hasGuidePermission = async (userId: string): Promise<boolean> => {
  try {
    // This would be replaced with a real check against your permissions system
    // For demo purposes, it returns true for authenticated users
    return !!userId;
  } catch (error) {
    console.error('Error checking guide permission:', error);
    return false;
  }
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
      
      const permitted = await hasGuidePermission(session.user.id);
      
      if (!permitted) {
        toast({
          title: "Access denied",
          description: "You don't have permission to access the Guide Portal.",
          variant: "destructive"
        });
      }
      
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

  if (!hasPermission) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
