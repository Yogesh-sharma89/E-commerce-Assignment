class AppError extends Error {
    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;
    public override  readonly name:string;

    constructor(statusCode: number, message: string, status: string = statusCode >= 500 ? "error" : "fail") {

        super(message);
        
        this.name = "AppError"
        this.statusCode = statusCode;
        this.status = status;

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;