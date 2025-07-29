// /lib/logout.ts
import Cookies from 'js-cookie';

export function logoutUser() {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
}
