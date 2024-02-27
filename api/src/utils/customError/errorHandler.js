class CustomError extends Error {
    constructor(
        httpStatusCode = 500,
        errorType,
        message,
        errors = null,
        errorRaw = null,
        errorsValidation = null
    ) {
        super(message);

        this.name = this.constructor.name;

        this.httpStatusCode = httpStatusCode;
        this.errorType = errorType;
        this.errors = errors;
        this.errorRaw = errorRaw;
        this.errorsValidation = errorsValidation;
    }

    get HttpStatusCode() {
        return this.httpStatusCode;
    }

    get JSON() {
        const errorResponse = {
            errorType: this.errorType,
            errorMessage: this.message,
            errors: this.errors,
            errorRaw: this.errorRaw,
            errorsValidation: this.errorsValidation,
        };
    
        if (process.env.NODE_ENV === 'development') {
            errorResponse.stack = this.stack;
        }
    
        return errorResponse;
    }
}

export default CustomError;
