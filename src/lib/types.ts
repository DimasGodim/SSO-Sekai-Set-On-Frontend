// User Types
export interface User {
  name: string;
  nickname: string;
  email: string;
  activate: boolean;
  api_keys?: ApiKey[];
  total_api_usage: number;
  average_success_rate: number;
  average_error_rate: number;
  average_response_time: number;
}

export interface UserCreateData {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

export interface UserSignInData {
  identification: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
  token_type: string;
}

export interface UserUpdateData {
  name: string;
  nickname: string;
}

// API Key Types
export interface ApiKey {
  identifier: string;
  title: string;
  detail: string;
  created_at?: string;
  expired?: string | null;
  total_requests?: number;
  logs?: ApiKeyLog[];
}

export interface ApiKeyCreateData {
  title: string;
  desc: string;
}

export interface ApiKeyLog {
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number;
  timestamp: string;
}

// Dashboard Types
export interface UsageStats {
  currentMonth: number;
  limit: number;
  successfulCalls: number;
  errorRate: number;
  averageResponseTime: number;
  successRate: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  status: string;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Form Types
export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  nickname?: string;
  confirmPassword?: string;
  identification?: string;
}

// News API Types
export interface NewsItem {
  title: string;
  summary: string;
  content: string;
  link: string;
  published_at: string;
}

// TTS API Types
export interface TTSCharacter {
  character: string;
  style: string;
  speaker_id: number;
}

export interface TTSResponse {
  character: string;
  mode: string;
  text: string;
  download_url: string;
  streaming_url: string;
}

// Train API Types
export interface TrainStation {
  romaji: string;
  city: string;
  prefecture: string;
  lat: number;
  lon: number;
}

export interface TrainRoute {
  route_number: number;
  departure_time: string;
  arrival_time: string;
  duration: string;
  fare: string;
  labels: string[];
  detailed_route: {
    stations: string[];
    lines: string[];
    transfers: string[];
    total_fare: string;
  };
}

// Weather API Types
export interface WeatherForecast {
  date: string;
  temperature_min: number;
  temperature_max: number;
  weather_code: number;
}
