import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secret from "../config.json";

const registartionRouter = Router();

const getJWT = (): string => {
    return jwt.sign({ date: new Date() }, secret.secret, { expiresIn: "6h" });
}

registartionRouter.post("/registration", (req, res) => {
    try {
        res.json({ jwt: getJWT() });
    } catch (error) {
        console.log(error);
    }
})

export { registartionRouter };