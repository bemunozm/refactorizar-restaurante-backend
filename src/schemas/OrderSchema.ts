import mongoose, { Schema, Types } from "mongoose";
import { OrderDocument } from "../interfaces/OrderInterface";

export const OrderSchema = new Schema<OrderDocument>(
    {
      session: { type: Schema.Types.ObjectId, ref: "Session"},
      table: { type: Schema.Types.ObjectId, ref: "Table"},
      guest: { type: Schema.Types.ObjectId },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      type: { type: String, enum: ["Retiro en Tienda", "Delivery", "Presencial"], default: "Presencial" },
      items: [
        {
          product: { type: Types.ObjectId, ref: "Product", required: true },
          quantity: { type: Number, required: true, min: 1 },
          status: {
            type: String,
            enum: ["Pendiente", "En Preparacion", "Listo", "Cancelado", "Entregado"],
            default: "Pendiente",
          },
          comment: { type: String },
        },
      ],
      status: { type: String, enum: ["Sin Pagar", "Pagado", "Pendiente"], default: "Sin Pagar" },
    },
    { timestamps: true }
);

const OrderModel = mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);
export default OrderModel;