import mongoose from "mongoose";
import { CategoryDocument } from "../interfaces/CategoryInterface";
export declare const CategorySchema: mongoose.Schema<CategoryDocument, mongoose.Model<CategoryDocument, any, any, any, mongoose.Document<unknown, any, CategoryDocument> & CategoryDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, CategoryDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<CategoryDocument>> & mongoose.FlatRecord<CategoryDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const CategoryModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default CategoryModel;
