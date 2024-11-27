
import { GenericRepository } from "./GenericRepository";
import { Token } from "../models/Token"; // Importamos la clase User con el modelo encapsulado
import OrderModel from "../schemas/OrderSchema";
import { OrderDocument } from "../interfaces/OrderInterface";
import { Order } from "../models/Order";
import SessionModel from "../schemas/SessionSchema";

export class OrderRepository extends GenericRepository<OrderDocument> {
  private static mongooseModel = OrderModel;

  constructor() {
    super(OrderRepository.mongooseModel);
  }

  // Métodos específicos de OrderRepository pueden añadirse aquí

public async updateGuestToUserOrders(guestId: string, userId: string) {
    try {
        return await this.model.updateMany(
            { guest: guestId },
            { $set: { user: userId }, $unset: {guest: 1 } }
        ).exec();
    } catch (error) {
        console.error(`Error al actualizar los estados de las ordenes: ${error}`);
        throw new Error("Error al actualizar los estados de las ordenes");
    }
}
  

  // Método para guardar una instancia de Order en la base de datos
  public async save(order): Promise<OrderDocument> {
    try {
      const orderDocument = new this.model({
        session: order.session.sessionId,
        table: order.table.tableId,
        guest: order.guest.guestId || undefined,
        user: order.user.userId || undefined,
        items: order.items,
        status: order.status,
      });
      return await orderDocument.save();
    } catch (error) {
      console.error(`Error al guardar el token: ${error}`);
      throw new Error("Error al guardar el documento del token");
    }
  }
  
  public async updateItemStatus( itemId: string, status: string) {
    const order = await this.model.findOneAndUpdate(
        { 'items._id': itemId },
        { $set: { 'items.$.status': status } },
        { new: true }
    );
    return order;
    }

    public async findForKitchen() {
      const activeSessions = await SessionModel.find({ status: { $ne: 'Finalizada' } }).select('_id');
      return await this.model.find({ session: { $in: activeSessions } })
        .sort({ createdAt: 1 });
    }

    public async findByUserId(userId: string) {
        return await this.model.find({ user: userId });
            
    }

    public async findBySessionId(sessionId: string) {
        return await this.model.find({ session: sessionId })
    }

}
