import { Schema, model } from "mongoose";

const Token = new Schema({
    priority: { type: Number, required: true },
    token_name: { type: String, unique: true, required: true },
    decimals: { type: Number, required: true },
    symbol: { type: String, required: true },
    addresses: { type: Map, require: true }
})

export = model("Token", Token);