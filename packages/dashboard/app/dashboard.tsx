"use client"
import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MetricsStrip } from './components/MetricsStrip';
import { JobList } from './components/JobList';
import { JobDetailPanel } from './components/JobDetailPanel';
import { Job, Metrics, WebSocketState, TabFilter } from '@/types/job';
import { mockJobs, generateMockJobs } from './data/mockJobs';
import { JobStatus } from '../../shared/src/types';


export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [wsState, setWsState] = useState<WebSocketState>({ connected: false });
  let ws: WebSocket;
  useEffect(() => {
    async function main() {
      const res = await fetch("http://localhost:8080/job")
      const data = await res.json()
      setJobs(data)
    }
    main()
  }, [])
   useEffect(() => {
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setWsState({connected: true})
    };

    ws.onmessage = (event) => {
      const res = JSON.parse(event.data)
      console.log(res)
      if(res.type === "JOB_UPDATE"){
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === res.id
            ? {
              ...job,
              status: res.status
            }
            : job
          )
        );
      }
      if(res.type === "JOB_ENQUEUE"){
        setJobs(prev => [res.job, ...prev])
      }
    };

    return () => {
      ws.close();
      setWsState({connected:false})
    };
  }, []);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [activeWorkers, setActiveWorkers] = useState(0);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || null;
  const failedJobs = jobs.filter((job) => {
    job.status === JobStatus.PENDING && job.attempts > 0
  })
  const calculateMetrics = useCallback((): Metrics => {
    return {
      pending: jobs.filter((j) => j.status === 'PENDING').length,
      processing: jobs.filter((j) => j.status === 'RUNNING').length,
      completed: jobs.filter((j) => j.status === 'COMPLETED').length,
      failed: failedJobs.length,
      deadLetter: jobs.filter((j) => j.status === 'DEAD').length,
    };
  }, [jobs]);

  const [metrics, setMetrics] = useState<Metrics>(calculateMetrics());

  useEffect(() => {
    setMetrics(calculateMetrics());
    setActiveWorkers(jobs.filter((j) => j.status === 'RUNNING').length);
  }, [jobs, calculateMetrics]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(calculateMetrics());
      setActiveWorkers(jobs.filter((j) => j.status === 'RUNNING').length);
    }, 1000);
    return () => clearInterval(interval);
  }, [jobs, calculateMetrics]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWsState((prev) => ({
        ...prev,
        lastPing: new Date().toISOString(),
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Logic
  /*
  useEffect(() => {
    const status: Job['status'][] = ['pending', 'processing', 'completed', 'failed'];
    const maxJobsPerStatus = { pending: 8, processing: 6, completed: 50, failed: 10, deadLetter: 10 };

    const interval = setInterval(() => {
      setJobs((prevJobs) => {
        const updatedJobs = [...prevJobs];
        const updates: number[] = [];
        const totalJobs = prevJobs.length;

        const numUpdates = Math.floor(Math.random() * 3) + 1;
        while (updates.length < numUpdates) {
          const idx = Math.floor(Math.random() * totalJobs);
          if (!updates.includes(idx)) updates.push(idx);
        }

        updates.forEach((idx) => {
          const job = updatedJobs[idx];
          const statusCounts = {
            pending: prevJobs.filter((j) => j.status === 'pending').length,
            processing: prevJobs.filter((j) => j.status === 'processing').length,
            completed: prevJobs.filter((j) => j.status === 'completed').length,
            failed: prevJobs.filter((j) => j.status === 'failed').length,
            deadLetter: prevJobs.filter((j) => j.status === 'deadLetter').length,
          };

          if (job.status === 'pending' && statusCounts.processing < maxJobsPerStatus.processing) {
            job.status = 'processing';
            job.workerId = `worker-${Math.floor(Math.random() * 8).toString().padStart(2, '0')}`;
            job.updatedAt = new Date().toISOString();
          } else if (job.status === 'processing') {
            const outcome = Math.random();
            if (outcome < 0.7 && statusCounts.completed < maxJobsPerStatus.completed) {
              job.status = 'completed';
              job.attemptCount++;
              job.updatedAt = new Date().toISOString();
              job.aiOutput = `Job completed successfully in ${Math.floor(Math.random() * 30) + 5} seconds. Resource utilization optimal.`;
            } else if (outcome < 0.9 && statusCounts.failed < maxJobsPerStatus.failed) {
              job.status = 'failed';
              job.attemptCount++;
              job.updatedAt = new Date().toISOString();
              job.retryHistory.push({
                attemptNumber: job.attemptCount,
                timestamp: new Date().toISOString(),
                workerId: job.workerId || 'unknown',
                error: ['Timeout exceeded', 'Connection reset', 'Invalid state'][Math.floor(Math.random() * 3)],
                duration: Math.floor(Math.random() * 30000) + 5000,
              });
            }
          } else if (job.status === 'failed') {
            if (job.attemptCount >= job.maxAttempts && statusCounts.deadLetter < maxJobsPerStatus.deadLetter) {
              job.status = 'deadLetter';
              job.updatedAt = new Date().toISOString();
            } else if (job.attemptCount < job.maxAttempts && statusCounts.processing < maxJobsPerStatus.processing) {
              job.status = 'processing';
              job.workerId = `worker-${Math.floor(Math.random() * 8).toString().padStart(2, '0')}`;
              job.updatedAt = new Date().toISOString();
            }
          } else if (job.status === 'completed' || job.status === 'deadLetter') {
            if (Math.random() < 0.05 && statusCounts.pending < maxJobsPerStatus.pending) {
              const newJob = generateMockJobs(1)[0];
              newJob.id = `job-${(prevJobs.length + 1000).toString().padStart(6, '0')}`;
              newJob.status = 'pending';
              newJob.createdAt = new Date().toISOString();
              newJob.updatedAt = new Date().toISOString();
              updatedJobs.unshift(newJob);
            }
          }
        });

        return updatedJobs;
      });
    }, 2000 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, []);
*/
  useEffect(() => {
    if (selectedJobId) {
      const jobStillExists = jobs.some((j) => j.id === selectedJobId);
      if (!jobStillExists) {
        setSelectedJobId(null);
      }
    }
  }, [jobs, selectedJobId]);

  const handleSelectJob = (job: Job) => {
    setSelectedJobId(job.id);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar wsState={wsState} activeWorkers={activeWorkers} />
      <MetricsStrip metrics={metrics} />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-border flex flex-col bg-background">
          <JobList
            jobs={jobs}
            selectedJobId={selectedJobId}
            onSelectJob={handleSelectJob}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        <div className="w-1/2 bg-surface">
          <JobDetailPanel job={selectedJob} />
        </div>
      </div>
    </div>
  );
}


