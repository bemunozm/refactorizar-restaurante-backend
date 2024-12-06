import mongoose from "mongoose";
import { IngredientDocument } from "../interfaces/IngredientInterface";
export declare const IngredientSchema: mongoose.Schema<IngredientDocument, mongoose.Model<IngredientDocument, any, any, any, mongoose.Document<unknown, any, IngredientDocument> & IngredientDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IngredientDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<IngredientDocument>> & mongoose.FlatRecord<IngredientDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const IngredientModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default IngredientModel;
