import axios, { AxiosError, AxiosRequestConfig } from "axios";
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

// Fungsi list characters
export async function ListCharacter(apiKey: string) {
    try {
      const res = await api.get(
        `/tts/list_characters`,
        {
          headers: {
            Authorization: `ApiKey ${apiKey}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>;
      const msg = error.response?.data?.detail ?? 'Failed to fetch character list.';
      throw new Error(msg);
    }
  }
  
export async function ChangeTTS(apiKey: string, text: string, char: string, mode: string) {
    try {
        const res = await api.get(
        `/tts/change?text=${encodeURIComponent(text)}&char=${encodeURIComponent(char)}&mode=${encodeURIComponent(mode)}`,
        {
            headers: {
            Authorization: `ApiKey ${apiKey}`,
            },
        }
        );
        return res.data;
    } catch (err) {
        const error = err as AxiosError<{ detail?: string }>;
        const msg = error.response?.data?.detail ?? 'Failed to change text to speech.';
        throw new Error(msg);
    }
}