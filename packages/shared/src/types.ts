export enum JobStatus{
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    DEAD = "DEAD",
}

export enum JobPriority{
    critical = "critical",
    high = "high",
    medium = "medium",
    low = "low"
}