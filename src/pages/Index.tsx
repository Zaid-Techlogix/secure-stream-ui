import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WelcomePage } from './WelcomePage';
import { ProfilePage } from '@/components/auth/ProfilePage';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-foreground-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <ProfilePage /> : <WelcomePage />;
};

export default Index;
