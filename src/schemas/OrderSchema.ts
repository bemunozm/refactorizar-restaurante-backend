import mongoose, { Schema, Types } from "mongoose";
import { OrderDocument } from "../interfaces/OrderInterface";

export const OrderSchema = new Schema<OrderDocument>(
    {
      sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
      tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
      guestId: { type: Schema.Types.ObjectId },
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      items: [
        {
          productId: { type: Types.ObjectId, ref: "Product", required: true },
          quantity: { type: Number, required: true, min: 1 },
          status: {
            type: String,
            enum: ["Pendiente", "En Preparacion", "Listo", "Cancelado", "Entregado"],
            default: "Pendiente",
          },
        },
      ],
      status: { type: String, enum: ["Sin Pagar", "Pagado", "Pendiente"], default: "Sin Pagar" },
    },
    { timestamps: true }
);

const OrderModel = mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);
export default OrderModel;