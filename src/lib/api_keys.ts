import apiClient from './api-client';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type { ApiKeyCreateData, ApiResponse, ApiKey } from './types';
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



// Create API key
export async function CreateApiKeys(data: ApiKeyCreateData): Promise<ApiResponse<{ api_key: string }>> {
  const accessToken = getAccessToken();
  
  try {
    const response = await apiClient.post('/api-key/create', data, createAuthHeaders(accessToken));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Failed to create API key.';
    throw new Error(message);
  }
}

// List API keys
export async function ListApiKeys(): Promise<ApiResponse<ApiKey[]>> {
  const accessToken = getAccessToken();
  
  try {
    const response = await apiClient.get('/api-key/list', createAuthHeaders(accessToken));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Failed to fetch API keys.';
    throw new Error(message);
  }
}

// Get usage logs for API keys
export async function UsageLogApiKeys(): Promise<ApiResponse<ApiKey[]>> {
  const accessToken = getAccessToken();
  
  try {
    const response = await apiClient.get('/api-key/usage', createAuthHeaders(accessToken));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Failed to fetch API key usage logs.';
    throw new Error(message);
  }
}

// Delete API key
export async function deleteApiKeys(identifier: string): Promise<ApiResponse> {
  const accessToken = getAccessToken();
  
  try {
    const response = await apiClient.delete(`/api-key/delete/${identifier}`, createAuthHeaders(accessToken));
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message = axiosError.response?.data?.detail ?? 'Failed to delete API key.';
    throw new Error(message);
  }
}
