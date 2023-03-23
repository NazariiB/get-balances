import express, {Request} from "express"
import { ApolloServer } from "apollo-server-express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Moralis from "moralis";
import secret from "./config";
import fs from "fs";
import { resolvers } from "./resolver/resolver";

const main = async () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    await mongoose.connect(secret.mongodbUri);
    await Moralis.start({
        apiKey: secret.moralisApiKey,
    });

    const typeDefs = fs.readFileSync("./src/schema/schemas.graphql", "utf8");
    const context = ({req}: {req: Request}) => ({jwtToken: req.headers.authorization})
    const apolloServer = new ApolloServer({typeDefs, resolvers, context})
    await apolloServer.start()
    apolloServer.applyMiddleware({app, path:"/graphql"})

    app.listen(8084, () => console.log(`run on http://localhost:8084/`));
}

main()