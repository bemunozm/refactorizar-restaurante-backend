import mongoose, { Schema, Types } from "mongoose";
import { TransactionDocument } from "../interfaces/TransactionInterface";



const TransactionSchema: Schema = new Schema({
    token: { type: String, trim: true },
    orders : [{ type: Types.ObjectId , ref: "Order" }],
    session: { type: Schema.Types.ObjectId, ref: "Session" },
    onlineOrderId: { type: String, trim: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['CREADA', 'CONFIRMADA', 'ANULADA'], default: 'CREADA' }
});

const TransactionModel = mongoose.models.Transaction || mongoose.model<TransactionDocument>("Transaction", TransactionSchema);
export default TransactionModel;