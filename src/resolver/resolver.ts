import TokenModel from "../models/TokenModel"
import UserModel from "../models/UserModel"
import { TokenDTO } from "../dto/TokenDTO"
import jwt from "jsonwebtoken";
import secret from "../config";
import { UserDTO } from "../dto/UserDTO";
import bcrypt from "bcrypt";
import { getBalancesByAddress } from "../getBalances/getBalancesByAddress";
import { ResponseDTO } from "../dto/ResponseDTO";

const verifyJWT = (jwtToken: string) => {
    if (!jwtToken) {
        throw Error("Unothorized")
    }
    try {
        jwt.verify(jwtToken, secret.secret)
    } catch (error) {
        throw Error("invalid jwttoken");
    }
}

export const resolvers = {
    Query: {
        token: async () => await TokenModel.find(),
        balances: async (root: any, { address, chain }: { address: string, chain: string }) => {
            try {
                return await getBalancesByAddress(address, chain);
            } catch (error) {
                console.log(error);
                throw Error("error geting balances");
            }
        }
    },
    Mutation: {
        addToken: async (root: any, { input }: { input: TokenDTO }, { jwtToken }: { jwtToken: string }) => {
            verifyJWT(jwtToken);
            try {
                const newToken = new TokenModel(input);
                return await newToken.save();
            } catch (error) {
                console.log(error);
                throw Error("error adding token");
            }
        },

        updateToken: async (root: any, { input }: { input: TokenDTO }, { jwtToken }: { jwtToken: string }) => {
            verifyJWT(jwtToken);
            try {
                const result = await TokenModel.updateOne({ token_name: input.token_name }, { $set: input })
                return input;
            } catch (error) {
                console.log(error);
                throw Error("error updating token");
            }
        },

        deleteToken: async (root: any, input: any, { jwtToken }: { jwtToken: string }) => {
            verifyJWT(jwtToken);
            try {
                return await TokenModel.deleteOne({ token_name: input.tokenName });
            } catch (error) {
                console.log(error);
                throw Error("error deleting token");
            }
        },

        login: async (root: any, { input }: { input: { password: string, email: string } }) => {
            const user = await UserModel.findOne({ email: input.email }) as UserDTO;
            if (!user) {
                throw Error("unknown user");
            }
            if (!await bcrypt.compare(input.password, user.password)) {
                throw Error("incorect password")
            }
            return jwt.sign({ date: new Date() }, secret.secret, { expiresIn: "6h" });
        }
    },
    Balances: {
        token: async (token: ResponseDTO) => {
            return await TokenModel.findOne({ token_name: token.token_name });
        }
    }
}
