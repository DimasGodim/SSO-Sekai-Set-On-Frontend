'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Mail } from 'lucide-react';
import { siGithub } from 'simple-icons/icons';

const GitHubIcon = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d={siGithub.path} />
  </svg>
);

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
          >
            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
              Sekai-Set-On
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/docs"
              className="text-white/80 hover:text-neon-blue transition-colors duration-200"
            >
              Docs
            </Link>
            <Link
              href="/dashboard"
              className="text-white/80 hover:text-neon-blue transition-colors duration-200"
            >
              Dashboard
            </Link>
            <a
              href="https://github.com/DimasGodim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-neon-blue transition-colors duration-200"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
            <a
              href="mailto:dimas.ngadinegaran@gmail.com"
              className="text-white/80 hover:text-neon-blue transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
            </a>
            <Button
              asChild
              className="bg-neon-blue/20 border border-neon-blue hover:bg-neon-blue/30 text-neon-blue hover:text-white transition-all duration-300"
            >
              <Link href="/signup">Get API Key</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white/80 hover:text-neon-blue transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg mt-2">
              <Link
                href="/docs"
                className="block px-3 py-2 text-white/80 hover:text-neon-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-white/80 hover:text-neon-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-4 px-3 py-2">
                <a
                  href="https://github.com/DimasGodim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-neon-blue transition-colors"
                >
                  <GitHubIcon className="w-5 h-5" />
                </a>
                <a
                  href="mailto:dimas.ngadinegaran@gmail.com"
                  className="text-white/80 hover:text-neon-blue transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <div className="px-3 py-2">
                <Button
                  asChild
                  className="w-full bg-neon-blue/20 border border-neon-blue hover:bg-neon-blue/30 text-neon-blue hover:text-white transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/signup">Get API Key</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}