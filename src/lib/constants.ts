// API Constants
export const API_LIMITS = {
  MONTHLY: 10000,
  RATE_LIMIT: 100,
} as const;

// App Constants
export const APP_CONFIG = {
  NAME: 'Sekai Set On',
  DESCRIPTION: 'Connect to Japan. Seamlessly. An open-source Japanese API platform for developers integrating with Japanese services like VoiceVox, weather data, train schedules, and more.',
  GITHUB_URL: 'https://github.com/DimasGodim',
  CONTACT_EMAIL: 'dimas.ngadinegaran@gmail.com',
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  DOCS: '/docs',
  USAGE: '/usage',
  VERIFY_EMAIL: '/verify-email',
} as const;

// Cookie Names
export const COOKIES = {
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

// TailwindCSS Class Groups
export const STYLES = {
  BUTTON_PRIMARY: 'bg-neon-blue text-black hover:bg-neon-cyan transition-all duration-300',
  BUTTON_OUTLINE: 'border-neon-blue text-neon-blue hover:text-white hover:bg-neon-blue/10 transition-all duration-300',
  INPUT_BASE: 'bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-neon-cyan focus:ring-neon-cyan/50',
  CARD_BASE: 'bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg',
  TEXT_GLOW: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]',
} as const;

// Modal Types
export type ModalType = 'create-key' | 'edit-profile' | 'delete-account' | 'logout' | 'generated-key' | 'delete-key';
