import mongoose from "mongoose";
import { TokenDocument } from "../interfaces/TokenInterface";
export declare const TokenSchema: mongoose.Schema<TokenDocument, mongoose.Model<TokenDocument, any, any, any, mongoose.Document<unknown, any, TokenDocument> & TokenDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, TokenDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<TokenDocument>> & mongoose.FlatRecord<TokenDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const TokenModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default TokenModel;
