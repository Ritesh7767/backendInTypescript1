interface apiErrorInterface {
    statusCode: number,
    message: string,
    data?: string,
    errors?: string[],
}

class ApiError extends Error implements apiErrorInterface {
    statusCode: number;
    message : string;
    data : string
    errors : string[]

    constructor(statusCode: number, message: string, data: string = '', errors: string[] = [], stack: string = ''){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.errors = errors

        if(stack) this.stack = stack
        else Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError