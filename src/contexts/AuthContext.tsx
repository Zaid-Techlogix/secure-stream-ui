import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  email: string;
  profileUrl?: String;
  provider?: String;
  accounts?: [];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (data: Partial<{ username: string; profileUrl: string }>) => Promise<void>;
  logout: () => Promise<void>;
  deleteUserAccount: (password: string) => Promise<void>;
}

const API_URL=import.meta.env.VITE_API_URL
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user on app boot (validates cookie session)
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || data); // handle both {user: {...}} or plain user object
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUserAccount = async (password: string) => {
    try {
      const response = await fetch(`${API_URL}/user/delete`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user account');
      }

      // On success, clear user state and show toast
      setUser(null);
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
      });

      // Optionally redirect user or do other cleanup here

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      const data = await response.json();
      setUser(data.user || data);
      toast({
        title: "Welcome back!",
        description: `Hello ${data.user ? data.user.username : data.username}, you're now logged in.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        const err = Object.entries(error.errors ?? {})?.[0]?.[1];
        throw new Error((err || error.message || 'Registration failed') as string);
      }
      const data = await response.json();
      setUser(data.user || data);
      toast({
        title: "Account Created!",
        description: `Welcome ${data.user ? data.user.username : username}! Your account has been created successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<{ username: string; profileUrl: string }>) => {
    try {
      if (!user) throw new Error('No user logged in');

      const response = await fetch(`${API_URL}/user`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedUser = await response.json();

      setUser((prev) => ({
        ...prev!,
        ...updatedUser.user!,
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Profile Update Failed",
        description: error.message
      })
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/user/logout`, {
        method: 'GET',
        credentials: 'include',
      });
    } finally {
      setUser(null);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, updateUser, logout, deleteUserAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};