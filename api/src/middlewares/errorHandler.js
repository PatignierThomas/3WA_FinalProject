export const errorHandler = (err, req, res, next) => {
    return res.status(err.HttpStatusCode).json(err.JSON);
};
