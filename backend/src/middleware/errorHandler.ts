import {NextFunction, Request, Response} from "express";
import ApiError from "../interfaces/ApiError";
import AuthenticationError from "../interfaces/AuthError";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);

    if (err instanceof AuthenticationError) {
        res.status(401).json({message: "Unauthorized: " + err.message});
    } else if (err instanceof ApiError) {
        const apiError = err as ApiError;
        res.status(apiError.status).json({
            message: apiError.message,
            error: apiError.error,
        });
    } else {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message, // Include the error message for debugging
        });
    }
};

export {errorHandler};