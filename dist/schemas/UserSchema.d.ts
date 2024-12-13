import mongoose from "mongoose";
import { UserDocument } from "../interfaces/UserInterface";
export declare const UserSchema: mongoose.Schema<UserDocument, mongoose.Model<UserDocument, any, any, any, mongoose.Document<unknown, any, UserDocument> & UserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UserDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<UserDocument>> & mongoose.FlatRecord<UserDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const UserModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default UserModel;
