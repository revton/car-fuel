export interface ProblemDetails {
    type?: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    code: string;
    requestId?: string;
    errors?: Record<string, string[]>;
}

export class ApiError extends Error {
    public readonly status: number;
    public readonly code: string;
    public readonly details?: string;
    public readonly errors?: Record<string, string[]>;
    public readonly requestId?: string;

    constructor(problem: ProblemDetails) {
        super(problem.title);
        this.name = 'ApiError';
        this.status = problem.status;
        this.code = problem.code;
        this.details = problem.detail;
        this.errors = problem.errors;
        this.requestId = problem.requestId;
    }
}
