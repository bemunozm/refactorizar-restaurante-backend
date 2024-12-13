import mongoose from "mongoose";
import { OrderDocument } from "../interfaces/OrderInterface";
export declare const OrderSchema: mongoose.Schema<OrderDocument, mongoose.Model<OrderDocument, any, any, any, mongoose.Document<unknown, any, OrderDocument> & OrderDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, OrderDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<OrderDocument>> & mongoose.FlatRecord<OrderDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const OrderModel: mongoose.Model<any, {}, {}, {}, any, any>;
export default OrderModel;
