import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (session) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error('Authentication Failed', {
        description: error.message,
      });
    } else {
      toast.success('Welcome back', {
        description: 'Successfully authenticated to ACTS.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Decorative branding area */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-900 overflow-hidden">
        {/* Subtle geometric pattern / gradient overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-slate-950/90 mix-blend-multiply" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ACTS Platform</span>
          </div>

          <div className="space-y-6 max-w-xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Elevate Your Academic Management
            </h1>
            <p className="text-lg text-slate-300">
              A comprehensive, modern system for seamless course tracking, student performance analytics, and dynamic curriculum management.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} The Strategist. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[540px] 2xl:w-[600px] border-l border-border bg-card">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-foreground">ACTS</span>
          </div>

          <div>
            <h2 className="mt-2 text-2xl font-bold leading-9 tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Please sign in to your account to continue
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@university.edu" 
                    autoComplete="email"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                    {...register('email')} 
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1">{errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    autoComplete="current-password"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                    {...register('password')} 
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1">{errors.password.message}</p>}
              </div>
              
              <Button type="submit" className="w-full h-11 text-sm font-semibold rounded-lg group overflow-hidden relative" disabled={isLoading}>
                <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full ease-out duration-500 transition-all -translate-x-full z-10 skew-x-12" />
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign in to your account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
