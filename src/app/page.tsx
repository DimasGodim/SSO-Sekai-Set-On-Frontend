import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield, Code } from 'lucide-react';

export default function HomePage() {
  console.log(process.env.NEXT_PUBLIC_RESTAPI_URL)
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 network-lines" />

      {/* Japan map silhouette */}
      <div className="absolute left-1/2 bottom-10 transform -translate-x-1/2 w-64 h-64 opacity-10">
        <svg viewBox="0 0 400 400" className="w-full h-full text-neon-blue">
          <path
            fill="currentColor"
            d="M300 80c20 0 40 20 40 40v40l-20 20-40-10-20 30-30-20v-40l30-30 40-30zm-80 60l-20 40-40 20-30-10v-30l20-20h70zm-60 80l-30 40-20 30-40-10v-40l30-30 60-10z"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero title */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold katakana-overlay">
              世界
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-light">
              Sekai-Set-On
            </h2>
            <p className="text-lg sm:text-xl text-neon-cyan font-light tracking-wide">
              Connect to Japan. Seamlessly.
            </p>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-white/70 leading-relaxed">
              An open-source Japanese API platform that empowers developers to integrate
              with Japanese services like VoiceVox, weather data, train schedules, and more.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-neon-blue text-black hover:bg-neon-cyan transition-all duration-300 text-lg px-8 py-3"
            >
              <Link href="/signup" className="flex items-center space-x-2">
                <span>Get Your API Key</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-neon-blue text-neon-blue hover:text-white hover:bg-neon-blue/10 transition-all duration-300 text-lg px-8 py-3"
            >
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </div>

          {/* Japanese subtitle */}
          <p className="text-sm text-white/40 font-light tracking-wider">
            Japanese API platform for developers
          </p>
        </div>
      </div>

      {/* Features section */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose <span className="text-glow-blue">Sekai-Set-On</span>?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Optimized for speed with minimal latency to Japanese services"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Access",
                description: "Access Japanese APIs from anywhere in the world"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with 99.9% uptime guarantee"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Developer First",
                description: "Comprehensive docs, SDKs, and community support"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 group"
              >
                <div className="text-neon-blue mb-4 group-hover:text-neon-cyan transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-white/60 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
