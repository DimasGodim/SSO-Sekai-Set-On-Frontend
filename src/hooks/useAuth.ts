import { useState, useEffect, useCallback } from 'react';
import type { User } from '../lib/types';
import { UserDetail } from '../lib/user';
import { authCookies } from '../lib/utils/auth-helpers';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = !!user && authCookies.hasValidSession();
  
  const fetchUser = useCallback(async () => {
    if (!authCookies.hasValidSession()) {
      setIsLoading(false);
      return;
    }
    
    try {
      setError(null);
      const response = await UserDetail();
      setUser(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    authCookies.clear();
    setUser(null);
    setError(null);
  }, []);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    refetchUser: fetchUser,
    logout,
  };
}
