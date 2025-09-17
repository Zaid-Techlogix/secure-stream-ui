import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const apiUrl = import.meta.env.VITE_API_URL
const baseUrl = location.origin

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) { }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-bac">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold gradient-text">Welcome Back</CardTitle>
        <CardDescription className="text-foreground-muted">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none z-40" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                autoFocus
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 z-40" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            variant="gradient"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="h-10 flex items-center w-full">
            <div className="relative w-full border-t border-gray-500 h-0.5">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                OR
              </span>
            </div>
          </div>


          <div className="flex gap-3 justify-center flex-wrap">
            <Link to={`${apiUrl}/auth/google?callback=${baseUrl}`} className="flex-1">
              <Button variant="outline" size="lg" className="flex items-center space-x-2 w-full" type="button">
                {/* Google Logo with brand colors */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 533.5 544.3" fill="none" className="">
                  <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.6-34.7-4.8-51.3H272.1v97h147.6c-6.4 34.3-25.9 63.4-55.5 82.9v68h89.5c52.4-48.4 82.8-119.4 82.8-196.6z" />
                  <path fill="#34A853" d="M272.1 544.3c74.1 0 136.3-24.5 181.7-66.6l-89.5-68c-25 17-56.7 27.2-92.2 27.2-71 0-131.2-47.9-152.8-112.3h-90v70.7c45.4 89.9 138 149 242.8 149z" />
                  <path fill="#FBBC05" d="M119.3 322.6c-10.7-31.4-10.7-65.8 0-97.2v-70.7h-90c-39.8 77-39.8 168.4 0 245.4l90-70.7z" />
                  <path fill="#EA4335" d="M272.1 107.7c38.9 0 74.1 13.4 101.7 39.6l76-76c-50.9-47.3-117.1-76-177.7-76-104.8 0-197.4 59.1-242.8 149l90 70.7c21.6-64.4 81.8-112.3 152.8-112.3z" />
                </svg>
                <span className="font-semibold">Sign in with Google</span>
              </Button>
            </Link>

            <Link to={`${apiUrl}/auth/github?callback=${baseUrl}`} className="flex-1">
              <Button variant="outline" size="lg" className="flex items-center space-x-2 w-full" type="button">
                {/* GitHub Logo in brand color */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8f8989" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                </svg>
                <span className="font-semibold">Sign in with GitHub</span>
              </Button>
            </Link>

            <Link to={`${apiUrl}/auth/twitter?callback=${baseUrl}`} className="flex-1">
              <Button variant="outline" size="lg" className="flex items-center space-x-2 w-full" type="button">
                {/* Twitter Logo in brand color */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1DA1F2" viewBox="0 0 24 24">
                  <path d="M23.954 4.57c-.885.385-1.83.647-2.825.765 1.014-.609 1.794-1.574 2.163-2.724-.949.569-2.005.982-3.127 1.206-.897-.957-2.178-1.555-3.594-1.555-2.722 0-4.928 2.206-4.928 4.928 0 .39.045.765.127 1.124-4.094-.205-7.725-2.165-10.158-5.146-.424.722-.666 1.562-.666 2.465 0 1.7.865 3.197 2.178 4.075-.803-.026-1.558-.246-2.217-.616v.061c0 2.374 1.689 4.354 3.933 4.801-.411.111-.844.171-1.291.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.376 4.6 3.416-1.68 1.319-3.809 2.106-6.102 2.106-.397 0-.781-.023-1.17-.069 2.18 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.496 14-13.986 0-.209 0-.423-.015-.637.961-.689 1.8-1.56 2.457-2.548l-.047-.02z" />
                </svg>
                <span className="font-semibold">Sign in with Twitter</span>
              </Button>
            </Link>
          </div>


          <div className="text-center text-sm text-foreground-muted">
            Don't have an account?{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-primary hover:text-primary-light"
              onClick={onSwitchToRegister}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
