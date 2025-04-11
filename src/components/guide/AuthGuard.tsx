
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: ReactNode;
}

// For demonstration purposes, this function always returns true
// In a production environment, this would check against your permission system
const hasGuidePermission = async (): Promise<boolean> => {
  try {
    // This would be replaced with an actual permission check
    // For example, checking a roles table in your database
    // const { data, error } = await supabase
    //   .from('user_roles')
    //   .select('role')
    //   .eq('user_id', userId)
    //   .single();
    // 
    // return data?.role === 'guide';

    // For now, return true to allow all users access
    return true;
  } catch (error) {
    console.error('Error checking guide permission:', error);
    return false;
  }
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkPermission = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(`Authentication error: ${sessionError.message}`);
        }
        
        if (!session?.user) {
          toast({
            title: "Authentication required",
            description: "You need to be logged in to access the Guide Portal.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        // Set up a timeout to handle slow permission checks
        const timeoutId = setTimeout(() => {
          if (loading) {
            setError('Permission check is taking longer than expected. Please try again later.');
            setLoading(false);
          }
        }, 10000); // 10 second timeout
        
        const permitted = await hasGuidePermission();
        clearTimeout(timeoutId);
        
        setHasPermission(permitted);
        
        if (!permitted) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access the Guide Portal.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('AuthGuard error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        toast({
          title: "Authentication Error",
          description: err instanceof Error ? err.message : 'An unknown error occurred',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkPermission();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkPermission();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Skeleton className="w-12 h-12 rounded-full mb-4" />
        <Skeleton className="h-4 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">Authentication Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  // For demonstration purposes, always allow access
  // In a production environment, you would use:
  // if (!hasPermission) {
  //   return <Navigate to="/" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};

export default AuthGuard;
