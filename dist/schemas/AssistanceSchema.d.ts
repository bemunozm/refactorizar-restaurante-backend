import mongoose from 'mongoose';
import { AssistanceDocument } from '../interfaces/AssistanceInterface';
export declare const AssistanceSchema: mongoose.Schema<AssistanceDocument, mongoose.Model<AssistanceDocument, any, any, any, mongoose.Document<unknown, any, AssistanceDocument> & AssistanceDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AssistanceDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<AssistanceDocument>> & mongoose.FlatRecord<AssistanceDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const AssistanceModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default AssistanceModel;
