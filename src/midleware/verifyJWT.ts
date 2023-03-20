import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import secret from "../config.json";

const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(400).json({ error: "unregistered user" })
            return;
        }
        jwt.verify(token, secret.secret);
        next();
    } catch {
        res.status(403).json({error: "validation jwt token error"});
        console.log("token error");
    }
}

export { verifyJWT };