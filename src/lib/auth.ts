import axios, { AxiosError } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_RESTAPI_URL;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Middleware untuk refresh token otomatis
api.interceptors.response.use(
  res => res,
  async err => {
    const originalConfig = err.config;

    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const res = await api.post(`/auth/refresh`, {}, {
          withCredentials: true,
        });

        const newToken = res.data.access_token;
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalConfig.headers['Authorization'] = `Bearer ${newToken}`;

        return api(originalConfig);
      } catch (refreshError) {
        console.error(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

// Fungsi signup
export async function SignUp(data: { email: string; password: string; name: string; nickname: string; }) {
  try {
    const res = await api.post('/auth/signup', data);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Signup failed.';
    throw new Error(msg);
  }
}

// Fungsi signin
export async function SignIn(data:{ identification: string, password: string }) {
  try {
    const res = await api.post('/auth/signin', data);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Signin failed.';
    throw new Error(msg);
  }
}

// Fungsi verify email
export async function verifyEmail(data:{ email: string, verification_code: string }) {
  try {
    const res = await api.post('/auth/verification', data);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Verification Failed.';
    throw new Error(msg);
  }
}
// Fungsi cek apakah user sudah login
export async function fetchMe(token: string) {
  const res = await api.get('/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}