import Cookies from 'js-cookie';
import { COOKIES, ROUTES } from '../constants';

// Cookie management utilities
export const authCookies = {
  set: (accessToken: string, refreshToken?: string) => {
    Cookies.set(COOKIES.ACCESS_TOKEN, accessToken, { path: '/' });
    if (refreshToken) {
      Cookies.set(COOKIES.REFRESH_TOKEN, refreshToken, { path: '/' });
    }
  },
  
  clear: () => {
    Cookies.remove(COOKIES.ACCESS_TOKEN, { path: '/' });
    Cookies.remove(COOKIES.REFRESH_TOKEN, { path: '/' });
  },
  
  getAccessToken: () => Cookies.get(COOKIES.ACCESS_TOKEN),
  
  getRefreshToken: () => Cookies.get(COOKIES.REFRESH_TOKEN),
  
  hasValidSession: () => !!Cookies.get(COOKIES.ACCESS_TOKEN),
};

// Navigation utilities
export const authNavigation = {
  redirectToHome: () => {
    window.location.href = ROUTES.HOME;
  },
  
  redirectToDashboard: () => {
    window.location.href = ROUTES.DASHBOARD;
  },
  
  redirectToSignin: () => {
    window.location.href = ROUTES.SIGNIN;
  },
  
  redirectTo: (path: string) => {
    window.location.href = path;
  },
};

// Session management
export const sessionManager = {
  logout: () => {
    authCookies.clear();
    authNavigation.redirectToHome();
  },
  
  loginSuccess: (accessToken: string, refreshToken?: string) => {
    authCookies.set(accessToken, refreshToken);
    authNavigation.redirectToDashboard();
  },
};
