class ApiError extends Error {
    status: number;
    timestamp: string;

    constructor(status: number, message: string,) {
        super(message);
        this.status = status;
        this.timestamp = new Date().toISOString();
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export default ApiError;