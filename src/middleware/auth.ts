import {NextFunction, Request, Response} from 'express';
import jwt from "jsonwebtoken";
import config from "../utils/config";

// Middleware to protect routes
function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({message: 'Access Denied'});

    try {
        // Verify the token
        const verified = jwt.verify(token, config.BACKEND_SECRET);
        next();
    } catch (err) {
        res.status(400).json({message: 'Invalid Token'});
    }
}

export default verifyToken;