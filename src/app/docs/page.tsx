'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Shield, Copy, ExternalLink, PlayCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { ListNews, FilterNews } from '@/lib/news';
import { ListTrain, ScheduleTrain } from '@/lib/train';
import { ListCharacter, ChangeTTS } from '@/lib/tts';
import { ForecastWeather } from '@/lib/weather';

// Define proper types for endpoints
interface EndpointData {
  method: string;
  endpoint: string;
  description: string;
  category: string;
  queryParams?: Record<string, string>;
  bodyParams?: Record<string, string>;
  pathParams?: Record<string, string>;
  queryExample?: string;
  bodyExample?: Record<string, unknown>;
  pathExample?: string;
  response: Record<string, unknown>;
  testFunction?: string;
  testParams?: Record<string, unknown>;
}

// Test result interface
interface TestResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  loading: boolean;
}

export default function DocsPage() {
  const [apiKey, setApiKey] = useState('');
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isTesting, setIsTesting] = useState(false);

  const endpoints: EndpointData[] = [
    // ===================== NEWS =====================
    {
      method: 'GET',
      endpoint: '/api/news/list',
      description: 'Get the latest NHK news (up to 20 articles)',
      category: 'News',
      queryParams: {},
      queryExample: '/api/news/list',
      testFunction: 'ListNews',
      testParams: {},
      response: {
        status: 200,
        data: {
          status: 'success',
          total: 20,
          data: [
            {
              title: 'ニュースタイトル',
              summary: '要約テキスト',
              content: '詳細な内容',
              link: 'https://nhk.or.jp/news/abc123',
              published_at: '2025-08-04T10:00:00Z'
            }
          ]
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/news/filter',
      description: 'Search news articles by title keyword',
      category: 'News',
      queryParams: {
        title: 'string (required) - Keyword in the news title'
      },
      queryExample: '/api/news/filter?title=earthquake',
      testFunction: 'FilterNews',
      testParams: { title: '地震' },
      response: {
        status: 200,
        data: {
          status: 'success',
          total: 5,
          data: [
            {
              title: '地震速報',
              summary: '要約テキスト',
              content: '詳細な内容',
              link: 'https://nhk.or.jp/news/xyz789',
              published_at: '2025-08-04T11:00:00Z'
            }
          ]
        }
      }
    },
  
    // ===================== TTS =====================
    {
      method: 'GET',
      endpoint: '/api/tts/list_characters',
      description: 'Get available VoiceVox characters and their styles',
      category: 'Text-to-Speech',
      queryParams: {},
      queryExample: '/api/tts/list_characters',
      testFunction: 'ListCharacter',
      testParams: {},
      response: {
        status: 200,
        data: {
          status: 'success',
          data: [
            {
              character: 'ずんだもん',
              style: 'ノーマル',
              speaker_id: 1
            }
          ]
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/tts/change',
      description: 'Convert text to speech using selected character and mode',
      category: 'Text-to-Speech',
      queryParams: {
        char: 'string (required) - Character name',
        mode: 'string (required) - Voice style',
        text: 'string (required) - Text to synthesize'
      },
      queryExample: '/api/tts/change?char=Shikoku Metan&mode=Normal&text=Hello World',
      testFunction: 'ChangeTTS',
      testParams: { char: 'Shikoku Metan', mode: 'Normal', text: 'Hello World' },
      response: {
        status: 200,
        data: {
          status: 'success',
          content: {
            character: 'Shikoku Metan',
            mode: 'Normal',
            text: 'Hello World',
            download_url: 'https://api.tts.quest/audio/12345.mp3',
            streaming_url: 'https://api.tts.quest/audio/12345/stream'
          }
        }
      }
    },
  
    // ===================== TRAIN =====================
    {
      method: 'GET',
      endpoint: '/api/train/schedule',
      description: 'Get optimized train schedule between two stations (scraped from Jorudan)',
      category: 'Transportation',
      queryParams: {
        from_station: 'string (required)',
        to_station: 'string (required)',
        date: 'string (required, format: YYYY-MM-DD)',
        time: 'string (required, format: HH:MM)'
      },
      queryExample: '/api/train/schedule?from_station=akihabara&to_station=Akabane&date=2025-08-04&time=09:00',
      testFunction: 'ScheduleTrain',
      testParams: { 
        from_station: 'akihabara', 
        to_station: 'Akabane', 
        date: new Date(), 
        time: { hour: 9, minute: 0 } 
      },
      response: {
        status: 200,
        data: {
          status: 'success',
          data: {
            from: 'akihabara',
            to: 'Akabane',
            date: '2025-08-04',
            time: '09:00',
            total_results: 1,
            routes: [
              {
                route_number: 1,
                departure_time: '09:15',
                arrival_time: '09:45',
                duration: '30m',
                fare: '280 yen',
                labels: ['Local'],
                detailed_route: {
                  stations: [],
                  lines: [],
                  transfers: [],
                  total_fare: '280 yen'
                }
              }
            ]
          }
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/train/list',
      description: 'Get railway station list (filtered by city or prefecture)',
      category: 'Transportation',
      queryParams: {
        city: 'string (optional) - Filter by city name',
        prefektur: 'string (optional) - Filter by prefecture name'
      },
      queryExample: '/api/train/list?city=tokyo&prefektur=tokyo',
      testFunction: 'ListTrain',
      testParams: {}, // No optional parameters for testing
      response: {
        status: 200,
        data: {
          status: 'success',
          data: [
            {
              romaji: 'tokyo',
              city: 'Tokyo',
              prefecture: 'Tokyo',
              lat: 35.681236,
              lon: 139.767125
            }
          ]
        }
      }
    },
  
    // ===================== WEATHER =====================
    {
      method: 'GET',
      endpoint: '/api/weather/forecast',
      description: 'Get daily weather forecast for a Japanese city (via Open-Meteo)',
      category: 'Weather',
      queryParams: {
        city: 'string (required) - City name in Japan'
      },
      queryExample: '/api/weather/forecast?city=tokyo',
      testFunction: 'ForecastWeather',
      testParams: { city: 'tokyo' },
      response: {
        status: 200,
        data: {
          status: 'success',
          data: {
            city: 'Tokyo',
            forecast: [
              {
                date: '2025-08-04',
                temperature_min: 22.5,
                temperature_max: 29.3,
                weather_code: 2
              }
            ]
          }
        }
      }
    }
  ];

  // API testing function
  const testEndpoint = async (endpoint: EndpointData) => {
    if (!apiKey.trim()) {
      alert('Please enter your API key first');
      return;
    }

    setIsTesting(true);
    setTestResults(prev => ({
      ...prev,
      [endpoint.endpoint]: { success: false, loading: true, error: undefined }
    }));

    try {
      let result;
      
      switch (endpoint.testFunction) {
        case 'ListNews':
          result = await ListNews(apiKey);
          break;
        case 'FilterNews':
          result = await FilterNews(apiKey, endpoint.testParams?.title as string || '地震');
          break;
        case 'ListCharacter':
          result = await ListCharacter(apiKey);
          break;
                 case 'ChangeTTS':
           result = await ChangeTTS(apiKey, endpoint.testParams?.text as string || 'Hello World', endpoint.testParams?.char as string || 'Shikoku Metan', endpoint.testParams?.mode as string || 'Normal');
           break;
                 case 'ScheduleTrain':
           result = await ScheduleTrain(apiKey, endpoint.testParams?.from_station as string || 'akihabara', endpoint.testParams?.to_station as string || 'Akabane', endpoint.testParams?.date as Date || new Date(), endpoint.testParams?.time as { hour: number; minute: number } || { hour: 9, minute: 0 });
           break;
                 case 'ListTrain':
           result = await ListTrain(apiKey, endpoint.testParams?.city as string || '', endpoint.testParams?.prefekture as string || '');
           break;
        case 'ForecastWeather':
          result = await ForecastWeather(apiKey, endpoint.testParams?.city as string || 'tokyo');
          break;
        default:
          throw new Error('Unknown test function');
      }

      setTestResults(prev => ({
        ...prev,
        [endpoint.endpoint]: { success: true, data: result, loading: false }
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setTestResults(prev => ({
        ...prev,
        [endpoint.endpoint]: { 
          success: false, 
          error: errorMessage, 
          loading: false 
        }
      }));
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 network-lines" />
      
      {/* Japan map silhouette - smaller and positioned differently */}
      <div className="absolute right-10 top-20 w-32 h-32 opacity-5">
        <svg viewBox="0 0 400 400" className="w-full h-full text-neon-blue">
          <path
            fill="currentColor"
            d="M300 80c20 0 40 20 40 40v40l-20 20-40-10-20 30-30-20v-40l30-30 40-30zm-80 60l-20 40-40 20-30-10v-30l20-20h70zm-60 80l-30 40-20 30-40-10v-40l30-30 60-10z"
          />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold katakana-overlay text-white mb-4">
            API文書
          </h1>
          <p className="text-xl sm:text-2xl text-neon-cyan font-light tracking-wide">
            Documentation
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Introduction */}
          <div className="mb-16 text-center">
            <p className="text-lg sm:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Welcome to the Sekai-Set-On API documentation. Our platform provides seamless access 
              to Japanese services including VoiceVox synthesis, weather data, transportation schedules, and more.
            </p>
          </div>

          {/* Combined Authentication & Testing Section */}
          <div className="mb-16 p-6 sm:p-8 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/30 transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex flex-col sm:flex-row sm:items-center">
              <Shield className="w-7 h-7 text-neon-blue mb-2 sm:mb-0 sm:mr-3" />
              Authentication & Testing
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-6 leading-relaxed">
              All API requests require authentication using your API key in the Authorization header. Enter your API key below to test the endpoints directly:
            </p>
            
            {/* API Key Input */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
              <input
                type="password"
                placeholder="Enter your API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-neon-blue focus:outline-none transition-all duration-300"
              />
              <Button 
                onClick={() => setApiKey('')}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Clear
              </Button>
            </div>

            {/* Header Example */}
            <div className="bg-black/50 rounded-lg p-4 sm:p-6 font-mono text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <span className="text-neon-cyan mb-2 sm:mb-0 text-sm sm:text-base font-semibold">Required Header</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-white/60 hover:text-white self-start sm:self-auto"
                  onClick={() => copyToClipboard(`Authorization: ApiKey ${apiKey || 'YOUR_API_KEY'}`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <code className="text-white text-sm sm:text-base break-all">
                Authorization: ApiKey {apiKey || 'YOUR_API_KEY'}
              </code>
            </div>
          </div>

          {/* Endpoints */}
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
              <Code className="w-8 h-8 sm:w-10 sm:h-10 text-neon-blue mb-2 sm:mb-0 sm:mr-4 mx-auto sm:mx-0" />
              API Endpoints
            </h2>

            {endpoints.map((endpoint, index) => {
              const testResult = testResults[endpoint.endpoint];
              
              return (
                <div key={index} className="p-6 sm:p-8 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300">
                  {/* Method and endpoint */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 lg:mb-0">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold text-center sm:text-left ${
                        endpoint.method === 'GET' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-neon-cyan font-mono text-base sm:text-lg break-all">
                        {endpoint.endpoint}
                      </code>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70 text-center">
                        {endpoint.category}
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-neon-blue hover:text-neon-cyan"
                        onClick={() => testEndpoint(endpoint)}
                        disabled={isTesting || !apiKey.trim()}
                      >
                        {testResult?.loading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : testResult?.success ? (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        ) : testResult?.error ? (
                          <XCircle className="w-4 h-4 mr-2 text-red-400" />
                        ) : (
                          <PlayCircle className="w-4 h-4 mr-2" />
                        )}
                        {testResult?.loading ? 'Testing...' : testResult?.success ? 'Success' : testResult?.error ? 'Failed' : 'Try it'}
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 mb-6 text-base sm:text-lg leading-relaxed">{endpoint.description}</p>

                  {/* Test Results */}
                  {testResult && (testResult.success || testResult.error) && (
                    <div className="mb-6 p-4 rounded-lg border">
                      {testResult.success ? (
                        <div className="border-green-500/30 bg-green-500/10">
                          <h5 className="text-green-400 font-medium mb-2 text-sm flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Test Successful
                          </h5>
                          <div className="bg-black/50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                            <pre className="text-green-300 whitespace-pre-wrap break-words">
                              {JSON.stringify(testResult.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="border-red-500/30 bg-red-500/10">
                          <h5 className="text-red-400 font-medium mb-2 text-sm flex items-center">
                            <XCircle className="w-4 h-4 mr-2" />
                            Test Failed
                          </h5>
                          <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
                            <code className="text-red-300 break-words">
                              {testResult.error}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Example URL only */}
                  {endpoint.queryExample && (
                    <div className="mb-6">
                      <h5 className="text-white/80 font-medium mb-2 text-sm">Example URL:</h5>
                      <div className="bg-black/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                        <code className="text-neon-cyan break-all">{endpoint.queryExample}</code>
                      </div>
                    </div>
                  )}
                  
                  {/* Body Example only */}
                  {endpoint.bodyExample && (
                    <div className="mb-6">
                      <h5 className="text-white/80 font-medium mb-2 text-sm">Example JSON Body:</h5>
                      <div className="bg-black/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                        <pre className="text-white/90 whitespace-pre-wrap break-words">
                          {JSON.stringify(endpoint.bodyExample, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                                     {/* Path Example only */}
                   {endpoint.pathExample && (
                     <div className="mb-6">
                       <h5 className="text-white/80 font-medium mb-2 text-sm">Example URL:</h5>
                       <div className="bg-black/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                         <code className="text-neon-cyan break-all">{endpoint.pathExample}</code>
                       </div>
                     </div>
                   )}

                   {/* Optional Parameters Examples */}
                   {endpoint.endpoint === '/api/train/list' && (
                     <div className="mb-6">
                       <h5 className="text-white/80 font-medium mb-2 text-sm">Optional Parameters Examples:</h5>
                       <div className="space-y-3">
                         <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
                           <div className="text-neon-cyan mb-1">All stations:</div>
                           <code className="text-white break-all">/api/train/list</code>
                         </div>
                         <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
                           <div className="text-neon-cyan mb-1">Filter by city:</div>
                           <code className="text-white break-all">/api/train/list?city=tokyo</code>
                         </div>
                         <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
                           <div className="text-neon-cyan mb-1">Filter by prefecture:</div>
                           <code className="text-white break-all">/api/train/list?prefektur=tokyo</code>
                         </div>
                         <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
                           <div className="text-neon-cyan mb-1">Filter by both:</div>
                           <code className="text-white break-all">/api/train/list?city=tokyo&prefektur=tokyo</code>
                         </div>
                       </div>
                     </div>
                   )}

                  {/* Response example */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h4 className="text-white font-semibold text-lg mb-2 sm:mb-0">Response Example:</h4>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white/60 hover:text-white self-start sm:self-auto"
                        onClick={() => copyToClipboard(JSON.stringify(endpoint.response, null, 2))}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-black/50 rounded-lg p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto">
                      <pre className="text-white/90 whitespace-pre-wrap break-words">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>



          {/* Support */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md mx-auto">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-neon-blue text-neon-blue hover:text-white hover:bg-neon-blue/10 transition-all duration-300"
              >
                <Link href="https://github.com/DimasGodim" target="_blank" className="flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  GitHub
                </Link>
              </Button>
                              <Button
                  variant="outline"
                  size="lg"
                  className="border-neon-blue text-neon-blue hover:text-white hover:bg-neon-blue/10 transition-all duration-300"
                  onClick={() => window.open('mailto:dimas.ngadinegaran@gmail.com', '_blank')}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Gmail
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}