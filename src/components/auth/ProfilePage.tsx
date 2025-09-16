import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Mail, Shield, Trash2, MessageCircleWarningIcon, Settings2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaGithub, FaGoogle, FaTwitter, FaFacebook } from 'react-icons/fa';


export const ProfilePage: React.FC = () => {
  const { user, logout, updateUser, deleteUserAccount } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  // Local editable fields state
  const [editedUsername, setEditedUsername] = useState(user?.username || '');

  // Profile image selection state
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [savingImage, setSavingImage] = useState(false);

  // Delete account confirmation input state
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!user) {
    return null;
  }

  const initials = user.username
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleCancel = () => {
    setEditedUsername(user.username);
    setSelectedImageFile(null);
    setPreviewImageUrl(null);
    setIsEditing(false);
  };

  const getProfileUrl = async () => {
    return new Promise((res, rej) => {
      const reader = new FileReader();

      reader.onload = (e) => res(e.target.result as string)

      reader.onerror = (e) => rej

      reader.readAsDataURL(selectedImageFile)
    })
  }

  const handleSave = async () => {
    setSavingImage(true);
    try {
      let profileUrl = user.profileUrl;
      if (selectedImageFile) {
        profileUrl = await getProfileUrl();
      }
      await updateUser({ username: editedUsername, profileUrl: profileUrl as string });
      setIsEditing(false);
      setSelectedImageFile(null);
      setPreviewImageUrl(null);
    } catch (error) {
      console.log(error.code)
      console.error('Failed to update profile:', error);
    } finally {
      setSavingImage(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setDeleting(true);
    try {
      await deleteUserAccount(deleteConfirmInput);
    } catch (error) {
      setDeleteError('Failed to delete account. Please try again.');
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

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
            <div className="flex items-center justify-between gap-5 flex-wrap ">
              <div className="flex justify-center mb-4 md:w-1/2">
                <Avatar className={`h-40 w-auto text-2xl rounded-sm`}>
                  {previewImageUrl || user.profileUrl ? (
                    <AvatarImage src={previewImageUrl ?? user.profileUrl as string} className='object-cover' />
                  ) : (
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">{initials}</AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className='flex-1'>
                {isEditing ? (
                  <>
                    <Input
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="text-3xl text-foreground text-center font-semibold mb-4"
                      autoFocus
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImageFile(file);
                          setPreviewImageUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="mx-auto"
                    />
                  </>
                ) : (
                  <CardTitle className="text-3xl text-foreground">{user.username}</CardTitle>
                )}

                <CardDescription className="text-foreground-muted">{user.email}</CardDescription>
              </div>
            </div>
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
                    {isEditing ? (
                      <Input value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} />
                    ) : (
                      <p className="text-sm text-foreground-muted">{user.username}</p>
                    )}
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
                    <p className="text-sm text-foreground-muted font-mono">{user.provider ?? 'Auth'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts */}

            {user.provider == 'auth' ?? (
              <div className="space-y-4 pt-4 border-t border-border/20">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users /> Connected Accounts
                </h3>
                <div className="flex items-center space-x-0">
                  {user.accounts.map((account, index) => {
                    const iconsMap: Record<string, React.ElementType> = {
                      github: FaGithub,
                      google: FaGoogle,
                      twitter: FaTwitter,
                      facebook: FaFacebook,
                    };

                    const IconComponent = iconsMap[account.toLowerCase()] || Users;

                    return (
                      <div
                        key={account}
                        className={`relative  border-foreground rounded-full bg-background shadow-sm`}
                        style={{ marginLeft: index === 0 ? 0 : -10 }}
                        title={account}
                      >
                        <IconComponent className="w-8 h-8 text-indigo-200" />
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-border/20">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Settings2 /> Account Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleCancel} disabled={savingImage}>
                      Cancel
                    </Button>
                    <Button
                      variant="gradient"
                      className="flex items-center gap-2"
                      onClick={handleSave}
                      disabled={editedUsername.trim() === '' || savingImage}
                    >
                      {savingImage ? 'Saving...' : 'Update'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex gap-3 justify-stretch w-full">

                      <Button variant="secondary" className="flex flex-1 items-center gap-2" onClick={() => setIsEditing(true)}>
                        <User className="w-4 h-4" />
                        Edit Profile
                      </Button>
                      <Button variant="destructive" className="flex flex-1 items-center gap-2" onClick={logout}>
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Delete Account Section */}
            <div className="space-y-4 pt-6 border-t border-border/20 ">
              <h3 className="text-lg font-semibold text-destructive-foreground flex items-center gap-2 text-red-400">
                <Trash2 className="w-5 h-5 text-red-400" />
                Delete My Account
              </h3>
              <Alert variant="default" className='text-red-400'>
                <MessageCircleWarningIcon color='coral' />
                <AlertTitle className='ms-2'>Note !</AlertTitle>
                <AlertDescription className='ms-2 pt-2'>
                  <ul className='list-disc list-inside flex flex-col gap-1'>
                    <li>This Action Is Not Reversible.</li>
                    <li>Current Email Cannot Be Used Again</li>
                    <li>All Data Would Be Lost !</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <Input
                placeholder="Type your password to confirm"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                autoComplete="off"
              />
              {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
              <Button
                variant="destructive"
                disabled={!deleteConfirmInput || deleting}
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
