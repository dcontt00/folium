class ApiError extends Error {
    status: number;
    error: string;
    timestamp: string;

    constructor(status: number, message: string, error: string) {
        super(message);
        this.status = status;
        this.error = error;
        this.timestamp = new Date().toISOString();
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export default ApiError;