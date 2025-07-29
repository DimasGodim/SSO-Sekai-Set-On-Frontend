'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { SignIn } from '@/lib/auth';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identification: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await SignIn({
        identification: formData.identification,
        password: formData.password,
      });      
      Cookies.set('access-token', res.access_token, { path: '/' });
      Cookies.set('refresh_token', res.refresh_token, { path: '/' });
      router.push('/dashboard');
    } catch (_) {
      console.log(_)
      alert('Login gagal');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 network-lines" />

      {/* Katakana background */}
      <div className="absolute top-20 right-10 text-9xl font-light text-neon-cyan/5 pointer-events-none">
        ログイン
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Info panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-cyan transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome back to <span className="text-glow-cyan">世界</span>
            </h1>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Access your dashboard and manage your API keys.
              Continue building amazing applications with Japanese services.
            </p>

            <div className="space-y-4">
              {[
                "⚡ Instant dashboard access",
                "🔑 Manage your API keys",
                "📊 Usage analytics",
                "🛠️ API testing tools",
                "💬 Community support"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full" />
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            {/* Mobile back button */}
            <div className="lg:hidden mb-6">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-cyan transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-white">
                  Sign In
                </CardTitle>
                <CardDescription className="text-white/60">
                  Welcome back! Please sign in to your account
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identication" className="text-white/80">
                      Identification
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                      <Input
                        id="identification"
                        type="identification"
                        placeholder="Enter your email or nickname"
                        value={formData.identification}
                        onChange={(e) => setFormData({...formData, identification: e.target.value})}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-neon-cyan focus:ring-neon-cyan/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white/80">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-neon-cyan hover:text-neon-blue transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-neon-cyan focus:ring-neon-cyan/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-white/40 hover:text-white/60"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-neon-cyan text-black hover:bg-neon-blue transition-all duration-300 h-11 text-lg font-medium"
                  >
                    Sign In
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-white/60 text-sm">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/signup"
                    className="text-neon-cyan hover:text-neon-blue transition-colors font-medium"
                  >
                    Create one
                  </Link>
                </div>

                <div className="text-center text-white/40 text-xs">
                  Having trouble?{' '}
                  <Link href="/support" className="text-neon-cyan hover:underline">
                    Contact Support
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}