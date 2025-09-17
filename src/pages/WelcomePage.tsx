import React, { useEffect, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Zap } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '../hooks/use-toast';

type AuthMode = 'welcome' | 'login' | 'register';

export const WelcomePage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const location = useLocation()
  const [query] = useSearchParams(location.search);
  const message = query.get('message')
  const err = query.get("err")
  const navigate = useNavigate();

  useEffect(() => {
    const localMode = sessionStorage.getItem('mode');
    if (localMode) {
      setMode(localMode as AuthMode)
    }

    if (err || message) {
      toast({
        title: 'Notice',
        description: err || message,
        variant: err ? "destructive" : "default"
      });

      navigate(location.pathname, { replace: true })
    }

  }, [])

  useEffect(() => {
    sessionStorage.setItem('mode', mode)
  }, [mode])

  if (mode === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <LoginForm onSwitchToRegister={() => setMode('register')} />
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setMode('welcome')}
              className="text-foreground-muted hover:text-foreground"
            >
              ← Back to welcome
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <RegisterForm onSwitchToLogin={() => setMode('login')} />
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setMode('welcome')}
              className="text-foreground-muted hover:text-foreground"
            >
              ← Back to welcome
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-gradient-primary glow-primary">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight">
            Secure Access
          </h1>
          <p className="text-xl md:text-2xl text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            Your gateway to a secure and personalized experience. Join thousands of users who trust our platform.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="space-y-4 p-6 glass-card rounded-xl">
            <div className="flex justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Modern Design</h3>
            <p className="text-foreground-muted">
              Beautiful, responsive interface that works seamlessly across all devices.
            </p>
          </div>
          <div className="space-y-4 p-6 glass-card rounded-xl">
            <div className="flex justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Bank-Level Security</h3>
            <p className="text-foreground-muted">
              Your data is protected with industry-leading encryption and security measures.
            </p>
          </div>
          <div className="space-y-4 p-6 glass-card rounded-xl">
            <div className="flex justify-center">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Lightning Fast</h3>
            <p className="text-foreground-muted">
              Optimized performance ensures quick loading and smooth interactions.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            variant="gradient"
            className="px-8 py-6 text-lg font-semibold"
            onClick={() => setMode('register')}
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg"
            onClick={() => setMode('login')}
          >
            Sign In
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-12 text-foreground-subtle">
          <p className="text-sm">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};