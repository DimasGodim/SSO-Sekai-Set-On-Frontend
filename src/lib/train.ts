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

// Fungsi list train
export async function ListTrain(apiKey: string, city: string = '', prefekture: string = '') {
    try {
      const params = new URLSearchParams();
  
      if (city) params.append('city', city);
      if (prefekture) params.append('prefekture', prefekture);
  
      const res = await api.get(
        `/train/list?${params.toString()}`,
        {
          headers: {
            'Authorization': `ApiKey ${apiKey}`
          }
        }
      );
      
      return res.data;
    } catch (error) {
      console.error("Error fetching train list:", error);
      throw error;
    }
  }

// Fungsi schedule train
type timeparameter = { hour: number; minute: number };
export async function ScheduleTrain(apiKey: string, from_station: string, to_station: string, date: Date, time: timeparameter) {
    const formattedDate = date.toISOString().split("T")[0];

    // Format jadi "HH:MM"
    const formattedTime = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;

    try {
        const res = await api.get(`/train/schedule`, {
        params: {
            from_station,
            to_station,
            date: formattedDate,
            time: formattedTime,
        },
        headers: {
            Authorization: `ApiKey ${apiKey}`,
        },
        });
        return res.data;
    } catch (err) {
        console.error("Error fetching schedule:", err);
        throw err;
    }
}
