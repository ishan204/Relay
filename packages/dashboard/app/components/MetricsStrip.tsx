import { Clock, Loader2, CheckCircle2, XCircle, Archive } from 'lucide-react';
import { Metrics } from '@/types/job';

interface MetricsStripProps {
  metrics: Metrics;
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

function MetricCard({ label, value, icon, colorClass, bgClass }: MetricCardProps) {
  return (
    <div className="metric-card flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center`}>
        <div className={colorClass}>{icon}</div>
      </div>
      <div>
        <div className={`text-2xl font-mono font-semibold ${colorClass}`}>{value.toLocaleString()}</div>
        <div className="text-xs text-textMuted uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}

export function MetricsStrip({ metrics }: MetricsStripProps) {
  return (
    <div className="h-auto bg-background py-4 px-6">
      <div className="grid grid-cols-5 gap-4">
        <MetricCard
          label="Pending"
          value={metrics.pending}
          icon={<Clock className="w-5 h-5" />}
          colorClass="text-pending"
          bgClass="bg-pending/10"
        />
        <MetricCard
          label="Processing"
          value={metrics.processing}
          icon={<Loader2 className="w-5 h-5 animate-spin" />}
          colorClass="text-processing"
          bgClass="bg-processing/10"
        />
        <MetricCard
          label="Completed"
          value={metrics.completed}
          icon={<CheckCircle2 className="w-5 h-5" />}
          colorClass="text-completed"
          bgClass="bg-completed/10"
        />
        <MetricCard
          label="Failed"
          value={metrics.failed}
          icon={<XCircle className="w-5 h-5" />}
          colorClass="text-failed"
          bgClass="bg-failed/10"
        />
        <MetricCard
          label="Dead Letter"
          value={metrics.deadLetter}
          icon={<Archive className="w-5 h-5" />}
          colorClass="text-deadLetter"
          bgClass="bg-deadLetter/10"
        />
      </div>
    </div>
  );
}
