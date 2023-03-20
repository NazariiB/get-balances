import { Request, Response, NextFunction } from "express"
import { TokenInterface } from "../tokenScript/TokenInterface"

const validateTokenData = (req: Request, res: Response, next: NextFunction): void => {
    try {
        console.log(req.body);
        const token = req.body as TokenInterface;
        if (!token.token_name ||
          !token.decimals ||
          !token.symbol ||
          !token.addresses ||
          !token.priority) {
            console.log(token);
            res.status(401).json({ error: "token data is not valid" });
            return;
        }
        next();
    } catch(error) {
        console.log(error);
        res.status(501).json({error: "validation error"})
    }
}

export { validateTokenData }