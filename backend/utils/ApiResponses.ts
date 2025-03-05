class ApiSuccessResponse {
    success: boolean;
    message: string;
    data?: any;
    constructor(message: string, data: any = {}) {
        this.success = true;
        this.message = message;
        this.data = data;
    }
}


class ApiError extends Error {
    success: boolean;
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export { ApiError, ApiSuccessResponse }
