import axiosInstance from '@/lib/axios';
import { use } from 'passport';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const getUserData = async () => {
    // Fetch user data from the server
    const response = await axiosInstance.get('/users/profile');
    setUserData(response.data);
  };

  return { isAuthenticated, isLoading, logout, userData, getUserData };
}
