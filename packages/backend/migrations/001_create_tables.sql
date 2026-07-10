CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    payload JSONB NOT NULL,
    next_run_at TIMESTAMPTZ DEFAULT NOW(),
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    namespace TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_pending_priority_next_run
ON jobs (priority DESC, next_run_at ASC)
WHERE status IN ('PENDING', 'RUNNING');

CREATE TABLE dead_letter_jobs (
    id BIGSERIAL PRIMARY KEY,
    original_job_id BIGINT NOT NULL,
    type TEXT NOT NULL,
    namespace TEXT NOT NULL,
    payload JSONB NOT NULL,
    priority INTEGER NOT NULL,
    attempts INTEGER NOT NULL,
    failure_history JSONB NOT NULL,
    final_error TEXT NOT NULL,
    died_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE job_results (
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    result JSONB NOT NULL,
    completed_at TIMESTAMPTZ
);