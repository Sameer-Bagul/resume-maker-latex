import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useGuardedRoute() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: 'Unauthorized',
        description: 'You are logged out. Please log in again.',
        variant: 'destructive',
      });
      
      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
    }
  }, [user, isLoading, toast]);

  return { user, isLoading };
}
