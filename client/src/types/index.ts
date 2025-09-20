// User related types
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  profilePicture?: string;
  totalPoints: number;
  level: 'Beginner' | 'Eco-Warrior' | 'Green Champion' | 'Planet Guardian' | 'Earth Hero';
  achievements: Achievement[];
  location: {
    country?: string;
    city?: string;
    region?: string;
  };
  joinDate: string;
  isActive: boolean;
  isAdmin: boolean;
  notifications: {
    email: boolean;
    achievements: boolean;
    leaderboard: boolean;
  };
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  _id?: string;
  name: string;
  description: string;
  icon: string;
  dateEarned?: string;
}

// Action related types
export interface Action {
  _id: string;
  user: string | User;
  type: ActionType;
  title: string;
  description: string;
  points: number;
  impact: Impact;
  proofImage?: string;
  isVerified: boolean;
  verifiedBy?: string | User;
  verificationDate?: string;
  location?: string;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type ActionType = 
  | 'Recycling'
  | 'Energy Saving'
  | 'Water Conservation'
  | 'Sustainable Transportation'
  | 'Green Purchase'
  | 'Waste Reduction'
  | 'Composting'
  | 'Tree Planting'
  | 'Education/Awareness'
  | 'Other';

export interface Impact {
  co2Saved: number;
  moneySaved: number;
  waterSaved: number;
  energySaved: number;
  wasteReduced: number;
}

export interface ActionTypeInfo {
  basePoints: number;
  description: string;
  impactMultipliers: Partial<Impact>;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[] | {
      current: number;
      pages: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    pagination: {
      current: number;
      pages: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Leaderboard types
export interface LeaderboardEntry {
  _id?: string;
  user: User;
  rank: number;
  totalPoints?: number;
  categoryStats?: {
    totalActions: number;
    totalPoints: number;
    totalImpact: number;
  };
  monthlyStats?: {
    points: number;
    actions: number;
    impact: number;
  };
}

export interface LeaderboardResponse {
  success: boolean;
  data: {
    leaderboard: LeaderboardEntry[];
    currentUserRank?: number;
    location?: {
      country?: string;
      region?: string;
    };
    category?: string;
    month?: {
      start: string;
      end: string;
      name: string;
    };
    pagination?: {
      current: number;
      pages: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Statistics types
export interface ImpactStats {
  totalActions: number;
  totalPoints: number;
  totalCO2Saved: number;
  totalMoneySaved: number;
  totalWaterSaved: number;
  totalEnergySaved: number;
  totalWasteReduced: number;
}

export interface ActionsByType {
  _id: string;
  count: number;
  points: number;
}

export interface MonthlyProgress {
  _id: {
    year: number;
    month: number;
  };
  actions: number;
  points: number;
  co2Saved: number;
}

export interface UserImpactStats {
  totalStats: ImpactStats;
  actionsByType: ActionsByType[];
  monthlyProgress: MonthlyProgress[];
}

// Form types
export interface CreateActionForm {
  type: ActionType;
  title: string;
  description: string;
  points: number;
  location?: string;
  tags: string[];
  quantity?: number;
  proofImage?: File;
}

export interface UpdateProfileForm {
  firstName: string;
  lastName: string;
  location: {
    country?: string;
    city?: string;
    region?: string;
  };
  notifications: {
    email: boolean;
    achievements: boolean;
    leaderboard: boolean;
  };
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Admin types
export interface AdminStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    newThisMonth: number;
  };
  actions: {
    total: number;
    verified: number;
    unverified: number;
    thisMonth: number;
    byType: ActionsByType[];
  };
  impact: ImpactStats;
  monthlyGrowth: Array<{
    _id: {
      year: number;
      month: number;
    };
    newUsers: number;
  }>;
}

// Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

// Component props types
export interface PrivateRouteProps {
  children: React.ReactNode;
}

export interface AdminRouteProps {
  children: React.ReactNode;
}

// Filter and sort types
export interface ActionFilters {
  type?: ActionType | 'all';
  sortBy?: 'date' | 'points' | 'type';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface LeaderboardFilters {
  page?: number;
  limit?: number;
  country?: string;
  region?: string;
}