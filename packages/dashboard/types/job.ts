import {JobStatus} from '../../shared/src/types'
export type JobPriority = 'critical' | 'high' | 'normal' | 'low';

export interface RetryAttempt {
  attemptNumber: number;
  timestamp: string;
  workerId: string;
  error: string;
  duration: number;
}

export interface Job {
  id: number;
  status: JobStatus;
  payload: Record<string, unknown>;
  priority: JobPriority;
  attempts: number;
  maxAttempts: number;
  next_run_at: Date;
  created_at: string;
  namespace: string;
  type: string;
  updatedAt: Date;
  started_at: Date;
  completed_at: Date;
  workerId?: string;
  retryHistory: RetryAttempt[];
  aiOutput?: string;
}

export interface Metrics {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  deadLetter: number;
}

export interface WebSocketState {
  connected: boolean;
  lastPing?: string;
}

export type TabFilter = 'all' | JobStatus;
