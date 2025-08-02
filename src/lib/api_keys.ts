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

// Fungsi create
export async function CreateApiKeys(data:{title: string, desc?: string}) {
    const access_token = Cookies.get('access-token');
    if (!access_token) {
        throw new Error('Access token not found.');
    }

    try {
      const res = await api.post(
        '/api-key/create',
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
      const msg = error.response?.data?.detail ?? 'Failed to fetch create api keys.';
      throw new Error(msg);
    }
  }

// Fungsi list
export async function ListApiKeys() {
    const access_token = Cookies.get('access-token');
    if (!access_token) {
        throw new Error('Access token not found.');
    }

    try {
        const res = await api.get(
        '/api-key/list',
        {
            headers: {
            Authorization: `Bearer ${access_token}`,
            },
        }
        );
        return res.data;
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        const msg = error.response?.data?.detail ?? 'Failed to fetch list api keys.';
        throw new Error(msg);
    }
    }

// Fungsi UsageLog
export async function UsageLogApiKeys() {
    const access_token = Cookies.get('access-token');
    if (!access_token) {
        throw new Error('Access token not found.');
    }

    try {
        const res = await api.get(
        '/api-key/usage',
        {
            headers: {
            Authorization: `Bearer ${access_token}`,
            },
        }
        );
        return res.data;
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        const msg = error.response?.data?.detail ?? 'Failed to fetch usage api keys.';
        throw new Error(msg);
    }
    }

// Fungsi delete
export async function deleteApiKeys(identifier: string) {
    const access_token = Cookies.get('access-token');
    if (!access_token) {
      throw new Error('Access token not found.');
    }
  
    try {
      const res = await api.delete(`/api-key/delete/${identifier}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>;
      const msg = error.response?.data?.detail ?? 'Failed to delete api keys.';
      throw new Error(msg);
    }
  }
  