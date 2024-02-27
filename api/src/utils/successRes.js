import { response } from 'express';

export default response.customSuccess = function (httpStatusCode, message, data = null) {
    return this.status(httpStatusCode).json({status: httpStatusCode, message, data });
};
