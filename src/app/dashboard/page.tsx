'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Key,
  Copy,
  RotateCcw,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Globe,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [emailVerified] = useState(true); // Mock data
  const [apiKey] = useState('sk_live_1234567890abcdef1234567890abcdef'); // Mock API key
  const [userEmail] = useState('dimas.ngadinegaran@gmail.com');

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    // You could add a toast notification here
  };

  const regenerateApiKey = () => {
    // Handle API key regeneration
    console.log('Regenerating API key...');
  };

  const deleteApiKey = () => {
    // Handle API key deletion
    console.log('Deleting API key...');
  };

  // Mock usage data
  const usageStats = {
    currentMonth: 1547,
    limit: 10000,
    successfulCalls: 1523,
    errorRate: 1.6
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
      {/* Background elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="fixed inset-0 network-lines pointer-events-none" />

      {/* Katakana background */}
      <div className="fixed top-20 right-10 text-8xl font-light text-neon-blue/3 pointer-events-none">
        ダッシュボード
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Dashboard <span className="text-glow-blue">世界</span>
          </h1>
          <p className="text-white/60">
            Manage your API keys and monitor your usage
          </p>
        </div>

        {/* Email Status */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Mail className="w-5 h-5" />
              <span>Account Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {emailVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className="text-white/80">{userEmail}</span>
                </div>
                <Badge
                  variant={emailVerified ? "default" : "secondary"}
                  className={emailVerified ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"}
                >
                  {emailVerified ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>
              {!emailVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                >
                  Verify Email
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Key Management */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Key className="w-5 h-5" />
              <span>API Key</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              Your API key for accessing Sekai-Set-On services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    type={apiKeyVisible ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="bg-white/5 border-white/20 text-white font-mono"
                  />
                  <button
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="absolute right-3 top-3 text-white/40 hover:text-white/60"
                  >
                    {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyApiKey}
                  className="border-white/20 text-white/60 hover:text-white hover:border-neon-blue"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={regenerateApiKey}
                  className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteApiKey}
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="p-3 bg-neon-blue/10 border border-neon-blue/20 rounded-lg">
              <p className="text-sm text-white/80">
                <strong>Important:</strong> Keep your API key secure and never share it publicly.
                This key provides access to all your Sekai-Set-On services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                API Calls This Month
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-neon-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {usageStats.currentMonth.toLocaleString()}
              </div>
              <p className="text-xs text-white/60 mt-1">
                of {usageStats.limit.toLocaleString()} limit
              </p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div
                  className="bg-neon-blue h-2 rounded-full"
                  style={{ width: `${(usageStats.currentMonth / usageStats.limit) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                Successful Calls
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {usageStats.successfulCalls.toLocaleString()}
              </div>
              <p className="text-xs text-green-400 mt-1">
                98.4% success rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                Error Rate
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {usageStats.errorRate}%
              </div>
              <p className="text-xs text-white/60 mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                Avg Response Time
              </CardTitle>
              <Zap className="h-4 w-4 text-neon-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                247ms
              </div>
              <p className="text-xs text-neon-cyan mt-1">
                -12ms from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-white/60">
              Common tasks and useful links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 border-white/20 hover:border-neon-blue hover:bg-neon-blue/10 text-left flex flex-col items-start space-y-2"
              >
                <Globe className="h-5 w-5 text-neon-blue" />
                <div>
                  <div className="font-medium text-white">API Documentation</div>
                  <div className="text-sm text-white/60">View complete API reference</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 border-white/20 hover:border-neon-cyan hover:bg-neon-cyan/10 text-left flex flex-col items-start space-y-2"
              >
                <Zap className="h-5 w-5 text-neon-cyan" />
                <div>
                  <div className="font-medium text-white">API Testing</div>
                  <div className="text-sm text-white/60">Test endpoints in browser</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 border-white/20 hover:border-green-400 hover:bg-green-400/10 text-left flex flex-col items-start space-y-2"
              >
                <Clock className="h-5 w-5 text-green-400" />
                <div>
                  <div className="font-medium text-white">Usage History</div>
                  <div className="text-sm text-white/60">View detailed analytics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
