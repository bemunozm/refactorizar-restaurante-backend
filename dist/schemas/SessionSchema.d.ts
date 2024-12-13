import mongoose from "mongoose";
import { SessionDocument } from "../interfaces/SessionInterface";
export declare const SessionSchema: mongoose.Schema<SessionDocument, mongoose.Model<SessionDocument, any, any, any, mongoose.Document<unknown, any, SessionDocument> & SessionDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, SessionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<SessionDocument>> & mongoose.FlatRecord<SessionDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const SessionModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default SessionModel;
