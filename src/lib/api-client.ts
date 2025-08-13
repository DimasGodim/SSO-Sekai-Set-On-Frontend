import axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_RESTAPI_URL;

export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Extend type for retry functionality
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Automatic token refresh middleware
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const refreshResponse = await apiClient.post(`/auth/refresh`, {}, {
          withCredentials: true,
        });

        const newToken = refreshResponse.data.access_token;

        // Update default headers and retry request with new token
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalConfig.headers = {
          ...originalConfig.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return apiClient(originalConfig);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
