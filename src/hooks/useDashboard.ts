import { useState, useEffect, useCallback } from 'react';
import type { User, ApiKey, UsageStats, ApiKeyCreateData } from '../lib/types';
import { UserDetail, UserUpdate, UserDelete } from '../lib/user';
import { CreateApiKeys, deleteApiKeys } from '../lib/api_keys';
import { logoutUser } from '../lib/logout';
import { authCookies } from '../lib/utils/auth-helpers';
import { API_LIMITS } from '../lib/constants';

export interface DashboardData {
  userInfo: User | null;
  apiKeys: ApiKey[];
  usageStats: UsageStats | null;
}

export interface DashboardActions {
  // User actions
  updateUser: (data: { name: string; nickname: string }) => Promise<void>;
  deleteUser: () => Promise<void>;
  logout: () => Promise<void>;
  
  // API key actions
  createApiKey: (data: ApiKeyCreateData) => Promise<{ api_key: string }>;
  deleteApiKey: (identifier: string) => Promise<void>;
  
  // Data refresh
  refreshData: () => Promise<void>;
}

export interface DashboardState {
  loading: boolean;
  error: string | null;
  deleteKeyLoading: string | null;
  apiKeyCreationLoading: boolean;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData>({
    userInfo: null,
    apiKeys: [],
    usageStats: null,
  });
  
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    deleteKeyLoading: null,
    apiKeyCreationLoading: false,
  });
  
  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await UserDetail();
      const userData = response.data;
      
      const dashboardData: DashboardData = {
        userInfo: {
          name: userData.name,
          nickname: userData.nickname,
          email: userData.email,
          activate: userData.activate,
          total_api_usage: userData.total_api_usage,
          average_success_rate: userData.average_success_rate,
          average_error_rate: userData.average_error_rate,
          average_response_time: userData.average_response_time,
        },
        apiKeys: userData.api_keys || [],
        usageStats: {
          currentMonth: userData.total_api_usage,
          limit: API_LIMITS.MONTHLY,
          successfulCalls: Math.round(userData.total_api_usage * (userData.average_success_rate / 100)),
          errorRate: userData.average_error_rate,
          averageResponseTime: userData.average_response_time,
          successRate: userData.average_success_rate,
        },
      };
      
      setData(dashboardData);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load dashboard data' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);
  
  // User actions
  const updateUser = useCallback(async (updateData: { name: string; nickname: string }) => {
    try {
      await UserUpdate(updateData);
      setData(prev => ({
        ...prev,
        userInfo: prev.userInfo ? { ...prev.userInfo, ...updateData } : null,
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update user');
    }
  }, []);
  
  const deleteUser = useCallback(async () => {
    try {
      await UserDelete();
      authCookies.clear();
      window.location.href = '/';
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }, []);
  
  const logout = useCallback(async () => {
    try {
      await logoutUser();
      authCookies.clear();
      window.location.href = '/';
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to logout');
    }
  }, []);
  
  // API key actions
  const createApiKey = useCallback(async (keyData: ApiKeyCreateData) => {
    setState(prev => ({ ...prev, apiKeyCreationLoading: true }));
    
    try {
      const response = await CreateApiKeys(keyData);
      
      // Refresh data to get updated API keys list
      await fetchDashboardData();
      
      return { api_key: response.data.api_key || '' };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create API key');
    } finally {
      setState(prev => ({ ...prev, apiKeyCreationLoading: false }));
    }
  }, [fetchDashboardData]);
  
  const deleteApiKey = useCallback(async (identifier: string) => {
    setState(prev => ({ ...prev, deleteKeyLoading: identifier }));
    
    try {
      await deleteApiKeys(identifier);
      setData(prev => ({
        ...prev,
        apiKeys: prev.apiKeys.filter(key => key.identifier !== identifier),
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete API key');
    } finally {
      setState(prev => ({ ...prev, deleteKeyLoading: null }));
    }
  }, []);
  
  // Load data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  const actions: DashboardActions = {
    updateUser,
    deleteUser,
    logout,
    createApiKey,
    deleteApiKey,
    refreshData: fetchDashboardData,
  };
  
  return {
    ...data,
    ...state,
    ...actions,
  };
}
