import { Job, RetryAttempt } from '@/types/job';

const generateRetryHistory = (count: number, baseTime: Date): RetryAttempt[] => {
  const errors = [
    'Connection timeout after 30s',
    'Rate limit exceeded (429)',
    'Upstream service unavailable',
    'Memory allocation failed',
    'Invalid response format',
  ];

  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(baseTime.getTime() - (count - i) * 60000 * 5);
    return {
      attemptNumber: i + 1,
      timestamp: timestamp.toISOString(),
      workerId: `worker-${Math.floor(Math.random() * 8).toString().padStart(2, '0')}`,
      error: errors[Math.floor(Math.random() * errors.length)],
      duration: Math.floor(Math.random() * 45000) + 5000,
    };
  });
};

const jobDescriptions = [
  'Process payment webhook for order #ORD-2847',
  'Generate monthly analytics report',
  'Send notification batch to 1,247 users',
  'Sync customer data from CRM',
  'Resize and optimize image assets',
  'Execute database migration script',
  'Process CSV import for inventory update',
  'Generate invoice PDF for client #ACME',
  'Archive expired session tokens',
  'Trigger webhook delivery for event ORDER_CREATED',
  'Index documents for search service',
  'Calculate subscription renewal dates',
  'Aggregate metrics from external APIs',
  'Export user data for compliance audit',
  'Validate address geocoding bulk request',
  'Process refund batch for declined transactions',
  'Update cache invalidation triggers',
  'Schedule email campaign delivery',
  'Compress and archive log files',
  'Parse and route incoming support tickets',
  'Calculate real-time pricing updates',
  'Fetch weather data for location service',
  'Process video transcoding job',
  'Generate thumbnails for uploaded media',
];

const priorities: ('critical' | 'high' | 'normal' | 'low')[] = ['critical', 'high', 'normal', 'low'];
const statuses: Job['status'][] = ['pending', 'processing', 'completed', 'failed', 'deadLetter'];

const generateJob = (index: number): Job => {
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const createdAt = new Date(Date.now() - Math.random() * 86400000 * 2);
  const attemptCount = status === 'deadLetter' ? 5 : status === 'failed' ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 3);
  const hasAiOutput = status === 'completed' || (status === 'failed' && Math.random() > 0.5);

  return {
    id: `job-${(1000 + index).toString().padStart(6, '0')}`,
    description: jobDescriptions[index % jobDescriptions.length],
    status,
    priority,
    createdAt: createdAt.toISOString(),
    updatedAt: new Date(createdAt.getTime() + Math.random() * 3600000).toISOString(),
    workerId: status === 'processing' ? `worker-${Math.floor(Math.random() * 8).toString().padStart(2, '0')}` : undefined,
    attemptCount,
    maxAttempts: 5,
    payload: {
      requestId: `req_${Math.random().toString(36).substring(7)}`,
      userId: `user_${Math.floor(Math.random() * 10000)}`,
      action: ['process', 'sync', 'notify', 'archive'][Math.floor(Math.random() * 4)],
      metadata: {
        source: ['api', 'webhook', 'scheduled', 'manual'][Math.floor(Math.random() * 4)],
        region: ['us-east-1', 'us-west-2', 'eu-west-1'][Math.floor(Math.random() * 3)],
        priority: priority,
        tags: ['production', 'automated', 'batch'].filter(() => Math.random() > 0.5),
      },
      params: {
        batchId: `batch_${Math.floor(Math.random() * 1000)}`,
        retryOnFailure: Math.random() > 0.3,
        timeout: Math.floor(Math.random() * 60) + 30,
      },
    },
    retryHistory: status === 'deadLetter' || status === 'failed' ? generateRetryHistory(attemptCount, createdAt) : [],
    aiOutput: hasAiOutput
      ? `Analysis completed for job batch. Identified 3 potential bottlenecks in the processing pipeline. Recommendation: Increase worker pool allocation by 20% during peak hours. Estimated throughput improvement: 15-25%.`
      : undefined,
  };
};

export const generateMockJobs = (count: number): Job[] => {
  return Array.from({ length: count }, (_, i) => generateJob(i));
};

export const mockJobs = generateMockJobs(24);
