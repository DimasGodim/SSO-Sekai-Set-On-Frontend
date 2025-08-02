// /lib/logout.ts
import Cookies from 'js-cookie';

export function logoutUser() {
  Cookies.remove('access-token');
  Cookies.remove('refresh_token');
}
