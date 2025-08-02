import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
const baseUrl = process.env.NEXT_PUBLIC_RESTAPI_URL;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Tambah type _retry ke config
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Middleware refresh token otomatis
api.interceptors.response.use(
  res => res,
  async err => {
    const originalConfig = err.config as CustomAxiosRequestConfig;

    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const res = await api.post(`/auth/refresh`, {}, {
          withCredentials: true,
        });

        const newToken = res.data.access_token;

        // Update default header dan request ulang dengan token baru
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalConfig.headers = {
          ...originalConfig.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalConfig);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Misalnya redirect ke login page atau clear session di sini
        // window.location.href = "/login"; (opsional)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

// Fungsi detail
export async function UserDetail() {
  const access_token = Cookies.get('access-token');
  if (!access_token) {
    throw new Error('Access token not found.');
  }

  try {
    const res = await api.get(
      '/user/detail',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Failed to fetch user details.';
    throw new Error(msg);
  }
}
  
// Fungsi update
export async function UserUpdate(data: { name?: string; nickname?: string }) {
  const access_token = Cookies.get('access-token');
  if (!access_token) {
      throw new Error('Access token not found.');
  }

  try {
      const res = await api.patch(
      '/user/update',
      data,
      {
          headers: {
              Authorization: `Bearer ${access_token}`,
          },
      }
      );
      return res.data;
  } catch (err) {
      const error = err as AxiosError<{ detail?: string }>;
      const msg = error.response?.data?.detail ?? 'Failed to update user.';
      throw new Error(msg);
  }
}

// Fungsi delete
export async function UserDelete() {
  const access_token = Cookies.get('access-token');
  if (!access_token) {
      throw new Error('Access token not found.');
  }

  try {
      const res = await api.delete(
      '/user/delete',
      {
          headers: {
              Authorization: `Bearer ${access_token}`,
          },
      }
      );
      return res.data;
  } catch (err) {
      const error = err as AxiosError<{ detail?: string }>;
      const msg = error.response?.data?.detail ?? 'Failed to delete user.';
      throw new Error(msg);
  }
}