import mongoose from "mongoose";
import { GuestDocument } from "../interfaces/GuestInterface";
export declare const GuestSchema: mongoose.Schema<GuestDocument, mongoose.Model<GuestDocument, any, any, any, mongoose.Document<unknown, any, GuestDocument> & GuestDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, GuestDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<GuestDocument>> & mongoose.FlatRecord<GuestDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const GuestModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default GuestModel;
