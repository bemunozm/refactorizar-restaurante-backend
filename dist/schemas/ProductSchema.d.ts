import mongoose from "mongoose";
import { ProductDocument } from "../interfaces/ProductInterface";
export declare const ProductSchema: mongoose.Schema<ProductDocument, mongoose.Model<ProductDocument, any, any, any, mongoose.Document<unknown, any, ProductDocument> & ProductDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ProductDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<ProductDocument>> & mongoose.FlatRecord<ProductDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const ProductModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default ProductModel;
