import { Schema } from "mongoose";
import { TokenDocument } from "../interfaces/TokenInterface";

export const TokenSchema = new Schema<TokenDocument>({
    token: { type: String, required: true },
    user: { type: String, required: false },
    session: { type: String, required: false },
}, { timestamps: true });
