import { Document } from "mongoose";


export interface TokenInterface {
    userId?: string;
    token: string;
    user?: string;
    session?: string;
}

export interface TokenDocument extends TokenInterface, Document {}
