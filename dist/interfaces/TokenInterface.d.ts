import { Document } from "mongoose";
import { User } from "../models/User";
import { Session } from "../models/Session";
export interface TokenInterface {
    tokenId?: string;
    token: string;
    user?: User | string;
    session?: Session | string;
}
export interface TokenDocument extends TokenInterface, Document {
}
