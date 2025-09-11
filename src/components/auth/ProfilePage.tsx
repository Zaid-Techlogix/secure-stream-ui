import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const initials = user.username
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen p-6 flex items-start justify-center pt-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Profile</h1>
          <p className="text-foreground-muted">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="border-border/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24 text-2xl border-2 border-primary">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl text-foreground">{user.username}</CardTitle>
            <CardDescription className="text-foreground-muted">{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/20">
                  <User className="w-5 h-5 text-foreground-muted" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Username</p>
                    <p className="text-sm text-foreground-muted">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/20">
                  <Mail className="w-5 h-5 text-foreground-muted" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Address</p>
                    <p className="text-sm text-foreground-muted">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border/20">
                  <Shield className="w-5 h-5 text-foreground-muted" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Account ID</p>
                    <p className="text-sm text-foreground-muted font-mono">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-border/20">
              <h3 className="text-lg font-semibold text-foreground">Account Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    // TODO: Implement edit profile
                    console.log('Edit profile clicked');
                  }}
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-2"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};