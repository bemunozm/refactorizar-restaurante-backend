import { Document } from "mongoose";


export interface TokenInterface {
    token: string;
    user?: string;
    session?: string;
}

export interface TokenDocument extends TokenInterface, Document {}
