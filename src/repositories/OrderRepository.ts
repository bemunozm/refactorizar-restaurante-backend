import { GenericRepository } from "./GenericRepository";
import { Token } from "../models/Token"; // Importamos la clase User con el modelo encapsulado
import OrderModel from "../schemas/OrderSchema";
import { OrderDocument } from "../interfaces/OrderInterface";
import { Order } from "../models/Order";
import SessionModel from "../schemas/SessionSchema";
import DeliveryModel from "../schemas/DeliverySchema";
import { DeliveryDocument } from "../interfaces/DeliveryInterface";

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
      console.log('order desde el repositorio', order);
      const orderDocument = new this.model({
        session: order.session ? order.session : undefined,
        table: order.table ? order.table : undefined,
        guest: order.guest ? order.guest : undefined,
        user: order.user ? order.user : undefined,
        type: order.type,
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
    console.log(itemId, status);
    const order = await this.model.findOneAndUpdate(
        { 'items._id': itemId },
        { $set: { 'items.$.status': status } },
        { new: true }
    );
    return order;
    }

    public async findForKitchen() {
        const activeSessions = await SessionModel.find({ status: { $ne: 'Finalizada' } }).select('_id');
        
        // Obtiene todos los pedidos que sean del tipo Delivery o Retiro en Tienda
        const activeDeliveries = await this.model.find({ 
            type: { $in: ['Delivery', 'Retiro en Tienda'] }, 
        });

        // Obtener las órdenes relacionadas con las sesiones activas
        const sessionOrders = await this.model.find({ session: { $in: activeSessions } }).sort({ createdAt: 1 });


        // Combinar las órdenes de sesiones y entregas
        const combinedOrders = [...sessionOrders, ...activeDeliveries];

        return combinedOrders;
    }

    public async findByUserId(userId: string) {
        return await this.model.find({ user: userId });
            
    }

    public async findBySessionId(sessionId: string) {
        return await this.model.find({ session: sessionId })
    }

    public async getOrdersBetweenDates(startDate: Date, endDate: Date) {
        return await this.model.find({ createdAt: { $gte: startDate, $lte: endDate } });
    }

}

