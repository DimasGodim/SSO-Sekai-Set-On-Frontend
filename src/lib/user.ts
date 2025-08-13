import apiClient from './api-client';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type { User, UserUpdateData, ApiResponse } from './types';
import { COOKIES } from './constants';

// Helper function to get access token
const getAccessToken = (): string => {
  const token = Cookies.get(COOKIES.ACCESS_TOKEN);
  if (!token) {
    throw new Error('Access token not found.');
  }
  return token;
};

// Helper function to create authorization headers
const createAuthHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get user details
export async function UserDetail(): Promise<ApiResponse<User>> {
  const accessToken = getAccessToken();
  
  try {
    const response = await apiClient.get('/user/detail', createAuthHeaders(accessToken));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Failed to fetch user details.';
    throw new Error(message);
  }
}

// Update user information
export async function UserUpdate(data: UserUpdateData): Promise<ApiResponse<User>> {
  const accessToken = getAccessToken();
  
  try {
    const response = await apiClient.patch('/user/update', data, createAuthHeaders(accessToken));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Failed to update user.';
    throw new Error(message);
  }
}

// Delete user account
export async function UserDelete(): Promise<ApiResponse> {
  const accessToken = getAccessToken();
  
  try {
    const response = await apiClient.delete('/user/delete', createAuthHeaders(accessToken));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Failed to delete user.';
    throw new Error(message);
  }
}
