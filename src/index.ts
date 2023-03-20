import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { tokenManageRouter } from "./routes/manageTokensInfo";
import { getBalancesRouter } from "./routes/getBalances";
import { registartionRouter } from "./routes/authentification";
import secret from "./config.json";
import Moralis from "moralis";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(tokenManageRouter)
app.use(getBalancesRouter)
app.use(registartionRouter)

const start = async () => {
    try {
        await mongoose.connect(secret.mongodbUri);
        await Moralis.start({
            apiKey: secret.moralisApiKey,
        });
        app.listen(secret.port, () => console.log(`run on port ${secret.port} http://localhost:${secret.port}`));
    } catch (error) {
        console.log(error);
    }
}

start();