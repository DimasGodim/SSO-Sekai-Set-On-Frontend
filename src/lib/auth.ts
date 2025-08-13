import apiClient from './api-client';
import type { UserCreateData, UserSignInData, ApiResponse } from './types';
import { AxiosError } from 'axios';

// Sign up function
export async function SignUp(data: UserCreateData): Promise<ApiResponse> {
  try {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Signup failed.';
    throw new Error(message);
  }
}

// Sign in function
export async function SignIn(data: UserSignInData): Promise<{ access_token: string; token_type: string }> {
  try {
    const response = await apiClient.post('/auth/signin', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Signin failed.';
    throw new Error(message);
  }
}

// Verify email function
export async function verifyEmail(data: { email: string; verification_code: string }): Promise<ApiResponse> {
  try {
    const response = await apiClient.post('/auth/verification', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Verification failed.';
    throw new Error(message);
  }
}
