import mongoose from "mongoose";
import { TableDocument } from "../interfaces/TableInterface";
export declare const TableSchema: mongoose.Schema<TableDocument, mongoose.Model<TableDocument, any, any, any, mongoose.Document<unknown, any, TableDocument> & TableDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, TableDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<TableDocument>> & mongoose.FlatRecord<TableDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const TableModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default TableModel;
