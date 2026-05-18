// ============ API Response ============
export interface ApiResult<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// ============ User ============
export interface User {
  id?: number;
  username: string;
  password?: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  bio?: string;
  role: number; // 0=user, 1=admin, 2=super admin
  status: number; // 0=disabled, 1=enabled
  createTime?: string;
  updateTime?: string;
}

// ============ Exercise ============
export type ExerciseCategory = '胸部' | '背部' | '肩部' | '手臂' | '腿部' | '核心';

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  '胸部',
  '背部',
  '肩部',
  '手臂',
  '腿部',
  '核心',
];

export const CATEGORY_COLORS: Record<ExerciseCategory, string> = {
  '胸部': '#e0556a',
  '背部': '#f59e0b',
  '肩部': '#7d9b76',
  '手臂': '#60a5fa',
  '腿部': '#a78bfa',
  '核心': '#fb923c',
};

export interface Exercise {
  id?: number;
  name: string;
  category: string;
  description?: string;
  keyPoints?: string;
  precautions?: string;
  videoPath?: string;
  uploadUserId?: number;
  auditStatus?: number;
  viewCount?: number;
  sortWeight?: number;
  createTime?: string;
  updateTime?: string;
}

// ============ Training Record ============
export interface TrainingRecordDetail {
  id?: number;
  recordId?: number;
  exerciseId?: number;
  setNumber: number;
  reps: number;
  weight: number;
  isCompleted?: number;
  notes?: string;
  sortOrder?: number;
  exerciseName?: string;
  exerciseCategory?: string;
  restSeconds?: number;
  bodyPart?: string;
}

export interface TrainingRecord {
  id?: number;
  userId?: number;
  trainDate: string;
  duration?: number;
  totalSets?: number;
  totalReps?: number;
  calories?: number;
  difficulty?: number; // 1=easy, 2=moderate, 3=hard
  isCompleted?: number; // 0=in progress, 1=completed
  notes?: string;
  details: TrainingRecordDetail[];
  createTime?: string;
  updateTime?: string;
}

// ============ Plan ============
export interface PlanDetail {
  id?: number;
  planId?: number;
  exerciseId?: number;
  dayNumber: number;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds?: number;
  notes?: string;
  sortOrder?: number;
  exerciseName?: string;
  exerciseCategory?: string;
  bodyPart?: string;
}

export interface Plan {
  id?: number;
  userId?: number;
  groupId?: number;
  title: string;
  description?: string;
  targetBodyPart?: string;
  difficultyLevel?: number; // 1=beginner, 2=intermediate, 3=advanced
  trainDays?: number;
  viewCount?: number;
  collectCount?: number;
  likeCount?: number;
  isPublic?: number;
  details: PlanDetail[];
  groupName?: string;
  createTime?: string;
  updateTime?: string;
}

export interface PlanGroup {
  id?: number;
  userId?: number;
  name: string;
  sortWeight?: number;
}

// ============ Blogger ============
export interface Blogger {
  id?: number;
  nickname: string;
  avatar?: string;
  bio?: string;
  sourcePlatform?: string;
  platformUrl?: string;
  category?: string;
  followerCount?: number;
  isRecommended?: number;
  createTime?: string;
  updateTime?: string;
}

export interface BloggerPlan {
  id?: number;
  bloggerId?: number;
  title: string;
  coverImage?: string;
  difficultyLevel?: number;
  targetAudience?: string;
  targetBodyPart?: string;
  trainDays?: number;
  videoUrl?: string;
  videoType?: string;
  summary?: string;
  detailArrangement?: string;
  viewCount?: number;
  collectCount?: number;
  likeCount?: number;
  isOnline?: number;
  createTime?: string;
  updateTime?: string;
}

// ============ System Config ============
export interface SystemConfig {
  id?: number;
  configKey: string;
  configValue: string;
  configDesc?: string;
}

// ============ Statistics ============
export interface PersonalStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  totalWeight: number;
  avgDuration: number;
}

export interface MonthlyTrend {
  month: string;
  workouts: number;
  sets: number;
  reps: number;
}

export interface ExerciseFrequency {
  name: string;
  count: number;
}

// ============ Auth ============
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname: string;
}

// ============ Pagination ============
export interface PageRequest {
  page: number;
  pageSize: number;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  page: number;
  pageSize: number;
}
