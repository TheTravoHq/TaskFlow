import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../lib/axios';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      // Only redirect to /auth if not on home route
      if (window.location.pathname !== '/') {
        window.location.href = '/auth';
      }
      return;
    }

    try {
      const result = await axios.get('/users/profile');
      setUserData(result.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/auth');
  };

  return { isAuthenticated, isLoading, logout, checkAuth, userData };
}
