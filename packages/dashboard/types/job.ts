export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'deadLetter';
export type JobPriority = 'critical' | 'high' | 'normal' | 'low';

export interface RetryAttempt {
  attemptNumber: number;
  timestamp: string;
  workerId: string;
  error: string;
  duration: number;
}

export interface Job {
  id: string;
  description: string;
  status: JobStatus;
  priority: JobPriority;
  createdAt: string;
  updatedAt: string;
  workerId?: string;
  attemptCount: number;
  maxAttempts: number;
  payload: Record<string, unknown>;
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
