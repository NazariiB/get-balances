import { Router } from "express";
import TokenModel from "../models/TokenModel";
import { verifyJWT } from "../midleware/verifyJWT";
import { TokenInterface } from "../dto/TokenDTO";
import { validateTokenData } from "../midleware/validateTokenData";

const tokenManageRouter = Router();

tokenManageRouter.get("/token", async (req, res) => {
    try {
        const tokenCursor = TokenModel.collection.find();
        res.send(await tokenCursor.toArray());
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "getting data error" });
    }
})

tokenManageRouter.post("/token", verifyJWT, validateTokenData, async (req, res) => {
    try {
        const token = req.body as TokenInterface;
        const tokenItem = new TokenModel(token);
        await tokenItem.save();
        res.json({ result: "token added" });
    } catch (error) {
        console.log(error);
        res.status(503).json({ error: "token add error" });
    }
});

tokenManageRouter.put("/token/:id", verifyJWT, validateTokenData, async (req, res) => {
    try {
        const id = req.params.id;
        const token = req.body as TokenInterface;
        const searchedToken = await TokenModel.findByIdAndUpdate(id, token);
        if (!searchedToken) {
            res.status(402).json({ error: "token not found" });
            return;
        }
        res.json({ result: "token updated" })
    } catch (error) {
        console.log(error);
        res.status(504).json({ error: "fail to update token" });
    }
})

tokenManageRouter.delete("/token/:id", verifyJWT, async (req, res) => {
    try {
        const id = req.params.id;
        const deletedToken = await TokenModel.findByIdAndDelete(id);
        if (!deletedToken) {
            res.status(403).json({ error: `token not found` });
            return;
        }
        res.json({ result: "token deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "delete error" });
    }
});

export { tokenManageRouter };
