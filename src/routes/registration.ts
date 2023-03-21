import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secret from "../config.json";
import { UserDTO } from "../dto/UserDTO";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";
import { verifyJWT } from "../midleware/verifyJWT";

const registartionRouter = Router();

const getJWT = (): string => {
    return jwt.sign({ date: new Date() }, secret.secret, { expiresIn: "6h" });
}

registartionRouter.post("/registration", async (req, res) => {
    try {
        const { email, password } = req.body as UserDTO;
        if (!password || !email) {
            res.status(401).json({ error: "email or password is absent" });
            return;
        }

        const user = await UserModel.findOne({ email }) as UserDTO;
        if (!user) {
            res.status(402).json({ error: "unknown user" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(403).json({ error: "incorect password" });
            return;
        }

        res.json({ jwt: getJWT() });
    } catch (error) {
        res.status(500).json({ error: "registration error" });
        console.log(error);
    }
})

registartionRouter.post("/user", verifyJWT, async (req, res) => {
    try {
        const newUser = req.body as UserDTO;
        if (!newUser.password || !newUser.email) {
            res.status(401).json({ error: "email or password is absent" });
            return;
        }

        newUser.password = await bcrypt.hash(newUser.password, secret.salt);
        const userModel = new UserModel(newUser);
        await userModel.save();

        res.json({ result: "user added" })
    } catch (error: any) {
        if(error.name === "MongoServerError") {
            res.status(400).json({ error: "user already exist" });
            return;
        }
        res.status(500).json({ error: "unable to add new user" })
    }
})


export { registartionRouter };