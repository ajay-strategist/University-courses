import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  GraduationCap,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CalendarCheck,
  ClipboardCheck,
  Users,
  BarChart3
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('educore_remember_me') === 'true';
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: localStorage.getItem('educore_saved_email') || '',
      password: '',
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('educore_saved_email');
    if (savedEmail) {
      setValue('email', savedEmail);
    }
  }, [setValue]);

  if (session) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    if (rememberMe) {
      localStorage.setItem('educore_saved_email', data.email);
      localStorage.setItem('educore_remember_me', 'true');
    } else {
      localStorage.removeItem('educore_saved_email');
      localStorage.removeItem('educore_remember_me');
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error('Authentication Failed', {
        description: error.message,
      });
    } else {
      toast.success('Welcome to EduCore', {
        description: 'Successfully authenticated to your academic workspace.',
      });
    }
    setIsLoading(false);
  };

  const handleOrgSignIn = async () => {
    toast.info('Organization Single Sign-On', {
      description: 'Redirecting to Microsoft 365 / Azure AD portal...',
    });
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: window.location.origin,
        },
      });
    } catch (err: any) {
      toast.error('SSO Initialization Failed', {
        description: err.message || 'Unable to connect to organization provider.',
      });
    }
  };

  const handleQuickFill = (email: string) => {
    setValue('email', email);
    setValue('password', '123456');
    toast.info(`Filled credentials for ${email}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden bg-[#f4f6f8]">
      {/* Decorative Golden Corner Swoosh - Top Right */}
      <div className="absolute -top-16 -right-16 w-80 h-80 pointer-events-none z-0 hidden lg:block">
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-60">
          <path
            d="M 120 0 C 140 60, 180 80, 200 90 L 200 0 Z"
            fill="none"
            stroke="#e5a93c"
            strokeWidth="12"
          />
          <path
            d="M 150 0 C 160 40, 185 60, 200 70 L 200 0 Z"
            fill="#f7d492"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* Decorative Golden Corner Swoosh - Bottom Right */}
      <div className="absolute -bottom-16 -right-16 w-96 h-96 pointer-events-none z-0 hidden lg:block">
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-65">
          <path
            d="M 200 130 C 140 145, 120 180, 100 200 L 200 200 Z"
            fill="#e5a93c"
            opacity="0.3"
          />
          <path
            d="M 200 115 C 130 140, 100 170, 75 200"
            fill="none"
            stroke="#e5a93c"
            strokeWidth="8"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* LEFT BRANDING PANEL */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[54%] xl:w-[56%] bg-gradient-to-br from-[#0c382b] via-[#093024] to-[#06241b] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden z-10">
        
        {/* Background Organic Curves & Wave Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Subtle Emerald Glow */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-[#e5a93c]/10 blur-3xl" />

          {/* Organic Wave Transition along the right border */}
          <svg
            className="absolute top-0 right-0 h-full w-28 xl:w-36 text-[#f4f6f8] hidden lg:block translate-x-[99%]"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 0 C 40 250, 70 450, 20 700 C -15 880, 50 960, 100 1000 L 0 1000 Z"
              fill="#093024"
            />
          </svg>

          {/* Golden accent wave border */}
          <svg
            className="absolute top-0 right-0 h-full w-28 xl:w-36 pointer-events-none hidden lg:block"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            <path
              d="M 98 0 C 138 250, 168 450, 118 700 C 83 880, 148 960, 198 1000"
              fill="none"
              stroke="#e5a93c"
              strokeWidth="4"
              opacity="0.85"
            />
          </svg>
        </div>

        {/* TOP: Company Logo Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-md border border-white/20 transition-transform hover:scale-[1.02]">
            <img
              src="/kvj-analytics-logo.png"
              alt="KVJ Analytics"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>

          <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-300/80 bg-white/5 border border-white/10 px-3 py-1 rounded-full hidden sm:inline-block">
            Enterprise Edition
          </span>
        </div>

        {/* MIDDLE: Application Name & Description */}
        <div className="relative z-10 my-8 sm:my-10 space-y-4 max-w-xl">
          {/* Main Logo & Title */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#f8be43] to-[#e89619] flex items-center justify-center shadow-lg shadow-black/25 shrink-0 transition-transform hover:rotate-3">
              <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9 text-[#093024]" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
                EduCore
              </h1>
            </div>
          </div>

          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-heading">
            Academic Management Platform
          </h2>

          {/* Gold Accent Bar */}
          <div className="w-14 h-1 rounded-full bg-[#f8be43]" />

          {/* Narrative Descriptor */}
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Plan, Manage, Track, and Report<br />
            University Academic Operations.
          </p>

          {/* 5 Feature Module Cards Row */}
          <div className="grid grid-cols-5 gap-2 sm:gap-2.5 pt-4">
            {[
              { label: 'Academics', icon: GraduationCap },
              { label: 'Attendance', icon: CalendarCheck },
              { label: 'Assessments', icon: ClipboardCheck },
              { label: 'Workload', icon: Users },
              { label: 'Reports', icon: BarChart3 },
            ].map((module, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-3 px-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center transition-all hover:bg-white/15 hover:-translate-y-0.5 shadow-sm"
              >
                <module.icon className="w-5 h-5 text-[#f8be43] mb-1.5" />
                <span className="text-[11px] font-medium text-white/95 tracking-tight">
                  {module.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: Neoclassical Campus Hall Visual */}
        <div className="relative z-10 pt-2">
          <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl max-w-lg bg-[#06241b] group">
            <img
              src="/campus-photo.jpg"
              alt="University Academic Campus"
              className="w-full h-32 sm:h-36 object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="text-[11px] text-emerald-200/60 mt-3 font-mono">
            &copy; {new Date().getFullYear()} KVJ Analytics &bull; EduCore Platform
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT AUTHENTICATION PANEL */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[46%] xl:w-[44%] flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 z-10">
        
        {/* Floating Login Card */}
        <div className="w-full max-w-[430px] bg-white rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 space-y-6 relative">
          
          {/* Card Header Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#fdedd8] flex items-center justify-center mb-3 shadow-inner">
              <GraduationCap className="w-7 h-7 text-[#0a3528]" />
            </div>
            <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 font-heading">
              Sign In to EduCore
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Access your academic workspace
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  className="pl-10 h-11 rounded-xl border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a3528] focus:ring-1 focus:ring-[#0a3528]"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive font-medium pl-1 animate-in slide-in-from-top-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="pl-10 pr-10 h-11 rounded-xl border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0a3528] focus:ring-1 focus:ring-[#0a3528]"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium pl-1 animate-in slide-in-from-top-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0a3528] focus:ring-[#0a3528] h-4 w-4 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  toast.info('Password Assistance', {
                    description: 'Please contact your university administrator to reset your password.',
                  })
                }
                className="font-medium text-[#c87a20] hover:text-[#a86517] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Primary Action Button */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#134938] hover:bg-[#0c3327] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">or</span>
              </div>
            </div>

            {/* Microsoft 365 / Organization Sign-in */}
            <Button
              type="button"
              variant="outline"
              onClick={handleOrgSignIn}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              Sign in with Organization Account
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 text-center">
              Quick Demo Access
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('mail@thestrategist.co.in')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0a3528] hover:text-white text-slate-600 transition-colors font-mono"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('baijuanoop810@gmail.com')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0a3528] hover:text-white text-slate-600 transition-colors font-mono"
              >
                Trainer (Anoop)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('info@thestrategist.co.in')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0a3528] hover:text-white text-slate-600 transition-colors font-mono"
              >
                Trainer (Jomon)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ajay.thestrategist@gmail.com')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0a3528] hover:text-white text-slate-600 transition-colors font-mono"
              >
                Coordinator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
