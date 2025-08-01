'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { SignUp } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', nickname: '', email: '', password: '', confirmPassword: '', });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirmation password are not same.');
      setLoading(false);
      return;
    }
  
    try {
      await SignUp({ email: formData.email, password: formData.password, name: formData.name, nickname: formData.nickname, });
  
      router.push('/verify-email');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 network-lines" />
      <div className="absolute top-20 left-10 text-9xl font-light text-neon-blue/5 pointer-events-none">
        アカウント
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left panel */}
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
              Join the <span className="text-glow-blue">世界</span>
            </h1>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Get instant access to our comprehensive Japanese API platform.
              Start integrating with VoiceVox, weather services, transportation data, and more.
            </p>

            <div className="space-y-4">
              {[
                '🚀 Instant API key generation',
                '📚 Comprehensive documentation',
                '🔧 Developer-friendly SDKs',
                '🌐 Global CDN access',
                '⚡ Real-time support',
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full" />
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
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
                <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                <CardDescription className="text-white/60">
                  Enter your details to get started with Sekai-Set-On
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/80">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-neon-blue focus:ring-neon-blue/50"
                      required
                    />
                  </div>

                  {/* Nickname */}
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-white/80">
                      Nickname
                    </Label>
                    <Input
                      id="nickname"
                      type="text"
                      placeholder="Your nickname"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-neon-blue focus:ring-neon-blue/50"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-neon-blue focus:ring-neon-blue/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-neon-blue focus:ring-neon-blue/50"
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

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/80">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmationPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-neon-blue focus:ring-neon-blue/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmationPassword(!showConfirmationPassword)}
                        className="absolute right-3 top-3 text-white/40 hover:text-white/60"
                      >
                        {showConfirmationPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neon-blue text-black hover:bg-neon-cyan transition-all duration-300 h-11 text-lg font-medium"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-white/60 text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/signin"
                    className="text-neon-blue hover:text-neon-cyan transition-colors font-medium"
                  >
                    Sign in
                  </Link>
                </div>

                <div className="text-center text-white/40 text-xs">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-neon-blue hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-neon-blue hover:underline">
                    Privacy Policy
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
