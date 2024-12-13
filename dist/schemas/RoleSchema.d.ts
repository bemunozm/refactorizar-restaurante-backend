import mongoose from "mongoose";
import { RoleDocument } from "../interfaces/RoleInterface";
export declare const RoleSchema: mongoose.Schema<RoleDocument, mongoose.Model<RoleDocument, any, any, any, mongoose.Document<unknown, any, RoleDocument> & RoleDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RoleDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<RoleDocument>> & mongoose.FlatRecord<RoleDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const RoleModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default RoleModel;
