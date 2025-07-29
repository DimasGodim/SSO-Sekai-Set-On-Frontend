'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsAnimated(true), 500);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 network-lines" />

      {/* Katakana background */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-9xl font-light text-neon-blue/5 pointer-events-none">
        確認済み
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <CardHeader className="space-y-4 pb-6">
            {/* Success icon with animation */}
            <div className="flex justify-center">
              <div
                className={`transition-all duration-1000 ${
                  isAnimated ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
              >
                <div className="relative">
                  <CheckCircle className="w-20 h-20 text-neon-blue mx-auto" />
                  <div className={`absolute inset-0 rounded-full border-2 border-neon-blue ${
                    isAnimated ? 'animate-ping' : ''
                  }`} />
                </div>
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-white">
              Email Verified Successfully!
            </CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Your email is verified! Welcome to Sekai-Set-On.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-lg">
              <Mail className="w-6 h-6 text-neon-blue mx-auto mb-2" />
              <p className="text-white/80 text-sm">
                Your account is now active and ready to use.
                You can start accessing the Japanese API platform immediately.
              </p>
            </div>

            <div className="space-y-2 text-sm text-white/60">
              <p>✓ Account activated</p>
              <p>✓ API access enabled</p>
              <p>✓ Dashboard access granted</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              asChild
              className="w-full bg-neon-blue text-black hover:bg-neon-cyan transition-all duration-300 h-11 text-lg font-medium"
            >
              <Link href="/dashboard" className="flex items-center justify-center space-x-2">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <div className="text-center">
              <Link
                href="/"
                className="text-neon-cyan hover:text-neon-blue transition-colors text-sm"
              >
                Return to Home
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm mb-2">
            開始準備完了 (Setup Complete)
          </p>
          <p className="text-white/60 text-xs">
            Need help getting started? Check out our{' '}
            <Link href="/docs" className="text-neon-blue hover:underline">
              documentation
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
