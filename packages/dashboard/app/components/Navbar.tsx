import { Activity, Layers } from 'lucide-react';
import { WebSocketState } from '@/types/job';

interface NavbarProps {
  wsState: WebSocketState;
  activeWorkers: number;
}

export function Navbar({ wsState, activeWorkers }: NavbarProps) {
  return (
    <nav className="h-14 bg-surface border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img src='/relay.svg' className='invert'></img>
          </div>
          <span className="font-syne font-semibold text-lg text-textPrimary">Relay</span>
        </div>
        <span className="text-textSecondary text-sm font-mono ml-2">Monitor</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              wsState.connected ? 'bg-completed animate-pulse-dot' : 'bg-failed'
            }`}
          />
          <span className="text-sm font-mono text-textSecondary">
            {wsState.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-surfaceHover rounded-md border border-border">
          <Activity className="w-4 h-4 text-processing" />
          <span className="text-sm font-mono text-textPrimary">{activeWorkers}</span>
          <span className="text-sm text-textMuted">workers</span>
        </div>
      </div>
    </nav>
  );
}
