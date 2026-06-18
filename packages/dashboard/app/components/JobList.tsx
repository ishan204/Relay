import { Job, TabFilter, JobStatus } from '@/types/job';

interface JobListProps {
  jobs: Job[];
  selectedJobId: string | null;
  onSelectJob: (job: Job) => void;
  activeTab: TabFilter;
  onTabChange: (tab: TabFilter) => void;
}

const statusColors: Record<JobStatus, string> = {
  pending: 'border-l-pending',
  processing: 'border-l-processing',
  completed: 'border-l-completed',
  failed: 'border-l-failed',
  deadLetter: 'border-l-deadLetter',
};

const statusBadgeClasses: Record<JobStatus, string> = {
  pending: 'status-badge status-badge-pending',
  processing: 'status-badge status-badge-processing',
  completed: 'status-badge status-badge-completed',
  failed: 'status-badge status-badge-failed',
  deadLetter: 'status-badge status-badge-deadLetter',
};

const priorityBadgeClasses: Record<string, string> = {
  critical: 'status-badge priority-badge-critical',
  high: 'status-badge priority-badge-high',
  normal: 'status-badge priority-badge-normal',
  low: 'status-badge priority-badge-low',
};

const tabs: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'processing', label: 'Processing' },
  { id: 'failed', label: 'Failed' },
  { id: 'deadLetter', label: 'Dead Letter' },
];

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function JobList({ jobs, selectedJobId, onSelectJob, activeTab, onTabChange }: JobListProps) {
  const filteredJobs = activeTab === 'all' ? jobs : jobs.filter((job) => job.status === activeTab);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-2 py-2 border-b border-border bg-surface">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 text-sm font-mono rounded transition-colors ${
              activeTab === tab.id
                ? 'bg-textPrimary/10 text-textPrimary'
                : 'text-textMuted hover:text-textSecondary hover:bg-surfaceHover'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job)}
            className={`job-row ${statusColors[job.status]} border-l-4 ${
              selectedJobId === job.id ? 'job-row-selected' : ''
            } px-4 py-3`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="font-mono text-sm text-textPrimary shrink-0">{job.id}</span>
                <span className="text-sm text-textSecondary truncate">{job.description}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={priorityBadgeClasses[job.priority]}>{job.priority}</span>
                <span className="font-mono text-xs text-textMuted w-20 text-right">
                  {formatTimestamp(job.updatedAt)}
                </span>
                <span className={statusBadgeClasses[job.status]}>{job.status}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="flex items-center justify-center h-32 text-textMuted text-sm">
            No jobs in this category
          </div>
        )}
      </div>
    </div>
  );
}
