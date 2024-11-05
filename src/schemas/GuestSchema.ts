import mongoose, { Schema, Types } from "mongoose";
import { OrderSchema } from "./OrderSchema";
import { GuestDocument } from "../interfaces/GuestInterface";

export const GuestSchema = new Schema<GuestDocument>({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    orders: [OrderSchema],
});

const GuestModel = mongoose.models.Guest || mongoose.model<GuestDocument>("Guest", GuestSchema);
export default GuestModel;