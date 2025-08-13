import { authCookies } from './utils/auth-helpers';

export function logoutUser(): Promise<void> {
  return new Promise((resolve) => {
    authCookies.clear();
    resolve();
  });
}
