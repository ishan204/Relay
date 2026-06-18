import { FileJson, History, Sparkles, User, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Job, JobStatus } from '@/types/job';
interface JobDetailPanelProps {
  job: Job | null;
}

const statusBadgeClasses: Record<JobStatus, string> = {
  pending: 'status-badge status-badge-pending',
  processing: 'status-badge status-badge-processing',
  completed: 'status-badge status-badge-completed',
  failed: 'status-badge status-badge-failed',
  deadLetter: 'status-badge status-badge-deadLetter',
};

const statusColors: Record<JobStatus, string> = {
  pending: 'text-pending',
  processing: 'text-processing',
  completed: 'text-completed',
  failed: 'text-failed',
  deadLetter: 'text-deadLetter',
};

const statusDotColors: Record<JobStatus, string> = {
  pending: 'bg-pending',
  processing: 'bg-processing',
  completed: 'bg-completed',
  failed: 'bg-failed',
  deadLetter: 'bg-deadLetter',
};

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function JobDetailPanel({ job }: JobDetailPanelProps) {
  if (!job) {
    return (
      <div className="h-full flex items-center justify-center text-textMuted text-sm">
        Select a job to view details
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-surface">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-mono text-lg text-textPrimary">{job.id}</h2>
          <span className={statusBadgeClasses[job.status]}>{job.status}</span>
        </div>
        <p className="text-sm text-textSecondary">{job.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h3 className="text-xs uppercase tracking-wide text-textMuted mb-3 flex items-center gap-2">
            <User className="w-3 h-3" />
            Metadata
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surfaceHover rounded px-3 py-2">
              <div className="text-xs text-textMuted mb-1">Status</div>
              <div className={`text-sm font-mono ${statusColors[job.status]}`}>{job.status}</div>
            </div>
            <div className="bg-surfaceHover rounded px-3 py-2">
              <div className="text-xs text-textMuted mb-1">Priority</div>
              <div className="text-sm font-mono text-textPrimary">{job.priority}</div>
            </div>
            <div className="bg-surfaceHover rounded px-3 py-2">
              <div className="text-xs text-textMuted mb-1">Worker ID</div>
              <div className="text-sm font-mono text-textPrimary">
                {job.workerId || 'Unassigned'}
              </div>
            </div>
            <div className="bg-surfaceHover rounded px-3 py-2">
              <div className="text-xs text-textMuted mb-1">Attempt</div>
              <div className="text-sm font-mono text-textPrimary">
                {job.attemptCount} / {job.maxAttempts}
              </div>
            </div>
            <div className="bg-surfaceHover rounded px-3 py-2 col-span-2">
              <div className="text-xs text-textMuted mb-1">Created</div>
              <div className="text-sm font-mono text-textPrimary">
                {formatTimestamp(job.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <h3 className="text-xs uppercase tracking-wide text-textMuted mb-3 flex items-center gap-2">
            <FileJson className="w-3 h-3" />
            Payload
          </h3>
          <div className="bg-background rounded border border-border p-3 overflow-x-auto">
            <pre className="font-mono text-xs text-textSecondary">{JSON.stringify(job.payload, null, 2)}</pre>
          </div>
        </div>

        {job.retryHistory.length > 0 && (
          <div className="p-4 border-b border-border">
            <h3 className="text-xs uppercase tracking-wide text-textMuted mb-3 flex items-center gap-2">
              <History className="w-3 h-3" />
              Retry History
            </h3>
            <div className="space-y-3">
              {job.retryHistory.map((attempt, index) => (
                <div key={attempt.attemptNumber} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${statusDotColors.failed} ring-2 ring-failed/20`}
                    />
                    {index < job.retryHistory.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-textMuted">
                        Attempt {attempt.attemptNumber}
                      </span>
                      <span className="text-xs text-textMuted">•</span>
                      <span className="text-xs font-mono text-textMuted">
                        {formatTimestamp(attempt.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-failed">{attempt.error}</div>
                    <div className="text-xs text-textMuted mt-1">
                      Worker: <span className="font-mono">{attempt.workerId}</span> • Duration:{' '}
                      <span className="font-mono">{formatDuration(attempt.duration)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {job.aiOutput && (
          <div className="p-4">
            <h3 className="text-xs uppercase tracking-wide text-textMuted mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              AI Analysis
            </h3>
            <div className="bg-background rounded border border-border p-3">
              <p className="text-sm text-textSecondary leading-relaxed">{job.aiOutput}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
