import mongoose, { Model } from "mongoose";
import { OrderDocument, OrderInterface, OrderItemInterface } from "../interfaces/OrderInterface";
import { OrderSchema } from "../schemas/OrderSchema";

export class Order implements OrderInterface {
    public orderId?: string;
    public sessionId: string;
    public tableId: string;
    public guestId: string;
    public userId: string;
    public items: OrderItemInterface[];
    public status: 'Sin Pagar' | 'Pagado' | 'Pendiente';
    private static mongooseModel: Model<OrderDocument>;
  
    public static getModel(): Model<OrderDocument> {
      if (!this.mongooseModel) {
        this.mongooseModel = mongoose.model<OrderDocument>("Order", OrderSchema);
      }
      return this.mongooseModel;
    }
}