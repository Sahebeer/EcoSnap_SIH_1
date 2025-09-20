import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  User,
  Action,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ApiResponse,
  PaginatedResponse,
  ActionFilters,
  LeaderboardResponse,
  LeaderboardFilters,
  UserImpactStats,
  AdminStats,
  CreateActionForm,
  UpdateProfileForm,
  ChangePasswordForm,
  ActionType,
} from '../types';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'API request failed');
  }
  return response.data.data;
};

// Authentication API
export const authAPI = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    console.log('login() called with credentials:', credentials);
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('login() response:', response.data);
      return handleApiResponse(response);
    } catch (error) {
      console.error('login() error:', error);
      throw error;
    }
  },

  // Register user
  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return handleApiResponse(response);
  },

  // Get current user
  getMe: async (): Promise<User> => {
    console.log('getMe() called, token:', !!localStorage.getItem('token'));
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      console.log('getMe() response:', response.data);
      return handleApiResponse(response);
    } catch (error) {
      console.error('getMe() error:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data: UpdateProfileForm): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    return handleApiResponse(response);
  },

  // Change password
  changePassword: async (data: ChangePasswordForm): Promise<void> => {
    const response = await api.put<ApiResponse<null>>('/auth/change-password', data);
    handleApiResponse(response);
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ profilePicture: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post<ApiResponse<{ profilePicture: string }>>(
      '/auth/upload-avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return handleApiResponse(response);
  },

  // Delete account
  deleteAccount: async (password: string): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>('/auth/account', {
      data: { password },
    });
    handleApiResponse(response);
  },
};

// Actions API
export const actionsAPI = {
  // Get user actions
  getUserActions: async (filters: ActionFilters = {}): Promise<{
    actions: Action[];
    pagination: any;
  }> => {
    const params = new URLSearchParams();
    
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<PaginatedResponse<Action>>(`/actions?${params}`);
    const data = handleApiResponse(response);
    return {
      actions: Array.isArray(data.actions) ? data.actions : Array.isArray(data.data) ? data.data : [],
      pagination: data.pagination
    };
  },

  // Get action by ID
  getAction: async (id: string): Promise<Action> => {
    const response = await api.get<ApiResponse<Action>>(`/actions/${id}`);
    return handleApiResponse(response);
  },

  // Create action
  createAction: async (data: CreateActionForm): Promise<{
    action: Action;
    newAchievements: any[];
    userLevel: string;
    totalPoints: number;
  }> => {
    const formData = new FormData();
    
    // Append regular fields
    formData.append('type', data.type);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('points', data.points.toString());
    
    if (data.location) formData.append('location', data.location);
    if (data.quantity) formData.append('quantity', data.quantity.toString());
    if (data.tags.length > 0) {
      data.tags.forEach(tag => formData.append('tags', tag));
    }
    
    // Append file if exists
    if (data.proofImage) {
      formData.append('proofImage', data.proofImage);
    }

    const response = await api.post<ApiResponse<{
      action: Action;
      newAchievements: any[];
      userLevel: string;
      totalPoints: number;
    }>>('/actions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return handleApiResponse(response);
  },

  // Update action
  updateAction: async (id: string, data: Partial<CreateActionForm>): Promise<Action> => {
    const response = await api.put<ApiResponse<Action>>(`/actions/${id}`, data);
    return handleApiResponse(response);
  },

  // Delete action
  deleteAction: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(`/actions/${id}`);
    handleApiResponse(response);
  },

  // Get impact statistics
  getImpactStats: async (): Promise<UserImpactStats> => {
    const response = await api.get<ApiResponse<UserImpactStats>>('/actions/impact/stats');
    return handleApiResponse(response);
  },

  // Get action types
  getActionTypes: async (): Promise<Record<ActionType, any>> => {
    const response = await api.get<ApiResponse<Record<ActionType, any>>>('/actions/types/all');
    return handleApiResponse(response);
  },
};

// Leaderboard API
export const leaderboardAPI = {
  // Get global leaderboard
  getGlobalLeaderboard: async (filters: LeaderboardFilters = {}): Promise<LeaderboardResponse['data']> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<LeaderboardResponse>(`/leaderboard/global?${params}`);
    return handleApiResponse(response);
  },

  // Get regional leaderboard
  getRegionalLeaderboard: async (filters: LeaderboardFilters = {}): Promise<LeaderboardResponse['data']> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.country) params.append('country', filters.country);
    if (filters.region) params.append('region', filters.region);

    const response = await api.get<LeaderboardResponse>(`/leaderboard/regional?${params}`);
    return handleApiResponse(response);
  },

  // Get category leaderboard
  getCategoryLeaderboard: async (type: ActionType, filters: LeaderboardFilters = {}): Promise<LeaderboardResponse['data']> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<LeaderboardResponse>(`/leaderboard/category/${type}?${params}`);
    return handleApiResponse(response);
  },

  // Get monthly leaderboard
  getMonthlyLeaderboard: async (): Promise<LeaderboardResponse['data']> => {
    const response = await api.get<LeaderboardResponse>('/leaderboard/monthly');
    return handleApiResponse(response);
  },

  // Get leaderboard stats
  getLeaderboardStats: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/leaderboard/stats');
    return handleApiResponse(response);
  },
};

// Admin API
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<AdminStats> => {
    const response = await api.get<ApiResponse<AdminStats>>('/admin/stats');
    return handleApiResponse(response);
  },

  // Get all users
  getAllUsers: async (filters: any = {}): Promise<{
    users: User[];
    pagination: any;
  }> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get<PaginatedResponse<User>>(`/admin/users?${params}`);
    const data = handleApiResponse(response);
    return {
      users: Array.isArray(data.users) ? data.users : Array.isArray(data.data) ? data.data : [],
      pagination: data.pagination
    };
  },

  // Get user details
  getUserDetails: async (id: string): Promise<{
    user: User;
    stats: any;
    recentActions: Action[];
  }> => {
    const response = await api.get<ApiResponse<{
      user: User;
      stats: any;
      recentActions: Action[];
    }>>(`/admin/users/${id}`);
    return handleApiResponse(response);
  },

  // Update user status
  updateUserStatus: async (id: string, data: { isActive?: boolean; isAdmin?: boolean }): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${id}/status`, data);
    return handleApiResponse(response);
  },

  // Get all actions
  getAllActions: async (filters: any = {}): Promise<{
    actions: Action[];
    pagination: any;
  }> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.verified && filters.verified !== 'all') params.append('verified', filters.verified);

    const response = await api.get<PaginatedResponse<Action>>(`/admin/actions?${params}`);
    const data = handleApiResponse(response);
    return {
      actions: Array.isArray(data.actions) ? data.actions : Array.isArray(data.data) ? data.data : [],
      pagination: data.pagination
    };
  },

  // Verify action
  verifyAction: async (id: string, isVerified: boolean): Promise<Action> => {
    const response = await api.put<ApiResponse<Action>>(`/admin/actions/${id}/verify`, { isVerified });
    return handleApiResponse(response);
  },

  // Delete action
  deleteAction: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(`/admin/actions/${id}`);
    handleApiResponse(response);
  },
};

// Export the configured axios instance for direct use if needed
export default api;