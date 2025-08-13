import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { ROUTES, STYLES, APP_CONFIG } from '../../lib/constants';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (data: Record<string, string>) => Promise<void>;
  loading?: boolean;
  error?: string;
}

interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
}

export function AuthForm({ type, onSubmit, loading = false, error }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const isSignUp = type === 'signup';
  
  const [formState, setFormState] = useState<FormState>({
    values: isSignUp
      ? { name: '', nickname: '', email: '', password: '', confirmPassword: '' }
      : { identification: '', password: '' },
    errors: {},
  });
  
  const setValue = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      errors: { ...prev.errors, [field]: '' }, // Clear error when typing
    }));
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const { values } = formState;
    
    if (isSignUp) {
      if (!values.name?.trim()) errors.name = 'Name is required';
      if (!values.nickname?.trim()) errors.nickname = 'Nickname is required';
      if (!values.email?.trim()) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Invalid email format';
      if (!values.password?.trim()) errors.password = 'Password is required';
      else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
      if (!values.confirmPassword?.trim()) errors.confirmPassword = 'Confirm password is required';
      else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    } else {
      if (!values.identification?.trim()) errors.identification = 'Identification is required';
      if (!values.password?.trim()) errors.password = 'Password is required';
    }
    
    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitData: Record<string, string> = {};
    
    if (isSignUp) {
      submitData.name = formState.values.name || '';
      submitData.nickname = formState.values.nickname || '';
      submitData.email = formState.values.email || '';
      submitData.password = formState.values.password || '';
    } else {
      submitData.identification = formState.values.identification || '';
      submitData.password = formState.values.password || '';
    }
    
    await onSubmit(submitData);
  };
  
  const pageConfig = {
    signin: {
      title: 'Sign In',
      description: 'Welcome back! Please sign in to your account',
      subtitle: 'Welcome back to',
      features: [
        '⚡ Instant dashboard access',
        '🔑 Manage your API keys',
        '📊 Usage analytics',
        '🛠️ API testing tools',
        '💬 Community support',
      ],
      linkText: "Don't have an account?",
      linkLabel: 'Create one',
      linkHref: ROUTES.SIGNUP,
      buttonText: 'Sign In',
      katakana: 'ログイン',
    },
    signup: {
      title: 'Create Account',
      description: 'Enter your details to get started with Sekai Set On',
      subtitle: 'Join the',
      features: [
        '🚀 Instant API key generation',
        '📚 Comprehensive documentation',
        '🔧 Developer-friendly SDKs',
        '🌐 Global CDN access',
        '⚡ Real-time support',
      ],
      linkText: 'Already have an account?',
      linkLabel: 'Sign in',
      linkHref: ROUTES.SIGNIN,
      buttonText: 'Create Account',
      katakana: 'アカウント',
    },
  };
  
  const config = pageConfig[type];
  const isFormValid = Object.keys(formState.errors).length === 0 && 
    Object.values(formState.values).some(value => value.trim() !== '');
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 network-lines" />
      
      {/* Katakana background */}
      <div className="absolute top-20 right-10 lg:left-10 text-9xl font-light text-neon-cyan/5 lg:text-neon-blue/5 pointer-events-none">
        {config.katakana}
      </div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Info panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16">
          <div className="max-w-md">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-cyan transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <h1 className="text-4xl font-bold text-white mb-6">
              {config.subtitle} <span className="text-glow-cyan lg:text-glow-blue">世界</span>
            </h1>
            
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              {isSignUp
                ? 'Get instant access to our comprehensive Japanese API platform. Start integrating with VoiceVox, weather services, transportation data, and more.'
                : 'Access your dashboard and manage your API keys. Continue building amazing applications with Japanese services.'
              }
            </p>
            
            <div className="space-y-4">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-cyan lg:bg-neon-blue rounded-full" />
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
                href={ROUTES.HOME}
                className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-cyan transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
            
            <Card className={STYLES.CARD_BASE}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-white">
                  {config.title}
                </CardTitle>
                <CardDescription className="text-white/60">
                  {config.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <>
                      <FormField
                        id="name"
                        label="Full Name"
                        type="text"
                        placeholder="Your full name"
                        value={formState.values.name || ''}
                        onChange={(value) => setValue('name', value)}
                        error={formState.errors.name}
                        required
                      />
                      
                      <FormField
                        id="nickname"
                        label="Nickname"
                        type="text"
                        placeholder="Your nickname"
                        value={formState.values.nickname || ''}
                        onChange={(value) => setValue('nickname', value)}
                        error={formState.errors.nickname}
                        required
                      />
                    </>
                  )}
                  
                  <FormField
                    id={isSignUp ? 'email' : 'identification'}
                    label={isSignUp ? 'Email Address' : 'Identification'}
                    type={isSignUp ? 'email' : 'text'}
                    placeholder={isSignUp ? 'your@email.com' : 'Enter your email or nickname'}
                    value={isSignUp ? (formState.values.email || '') : (formState.values.identification || '')}
                    onChange={(value) => setValue(isSignUp ? 'email' : 'identification', value)}
                    error={isSignUp ? formState.errors.email : formState.errors.identification}
                    icon={Mail}
                    required
                  />
                  
                  <FormField
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isSignUp ? 'Create a strong password' : 'Enter your password'}
                    value={formState.values.password || ''}
                    onChange={(value) => setValue('password', value)}
                    error={formState.errors.password}
                    icon={Lock}
                    showToggle
                    isVisible={showPassword}
                    onToggleVisibility={() => setShowPassword(!showPassword)}
                    required
                  />
                  
                  {isSignUp && (
                    <FormField
                      id="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formState.values.confirmPassword || ''}
                      onChange={(value) => setValue('confirmPassword', value)}
                      error={formState.errors.confirmPassword}
                      icon={Lock}
                      showToggle
                      isVisible={showConfirmPassword}
                      onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                      required
                    />
                  )}
                  
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={`w-full ${STYLES.BUTTON_PRIMARY} h-11 text-lg font-medium`}
                  >
                    {loading ? 'Loading...' : config.buttonText}
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-white/60 text-sm">
                  {config.linkText}{' '}
                  <Link
                    href={config.linkHref}
                    className="text-neon-cyan hover:text-neon-blue transition-colors font-medium"
                  >
                    {config.linkLabel}
                  </Link>
                </div>
                
                {!isSignUp && (
                  <div className="text-center text-white/40 text-xs">
                    Having trouble?{' '}
                    <a
                      href={`mailto:${APP_CONFIG.CONTACT_EMAIL}`}
                      className="text-neon-cyan hover:underline"
                    >
                      Contact Support
                    </a>
                  </div>
                )}
                
                {isSignUp && (
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
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  showToggle?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  required?: boolean;
}

function FormField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  showToggle = false,
  isVisible = false,
  onToggleVisibility,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white/80">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-4 w-4 text-white/40" />
        )}
        
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${Icon ? 'pl-10' : ''} ${showToggle ? 'pr-10' : ''} ${STYLES.INPUT_BASE}`}
          required={required}
        />
        
        {showToggle && onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute right-3 top-3 text-white/40 hover:text-white/60"
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      
      {error && <div className="text-red-400 text-sm">{error}</div>}
    </div>
  );
}
