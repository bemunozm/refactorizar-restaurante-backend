"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const GenericRepository_1 = require("./GenericRepository");
const OrderSchema_1 = __importDefault(require("../schemas/OrderSchema"));
const SessionSchema_1 = __importDefault(require("../schemas/SessionSchema"));
class OrderRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = OrderSchema_1.default;
    constructor() {
        super(OrderRepository.mongooseModel);
    }
    // Métodos específicos de OrderRepository pueden añadirse aquí
    async updateGuestToUserOrders(guestId, userId) {
        try {
            return await this.model.updateMany({ guest: guestId }, { $set: { user: userId }, $unset: { guest: 1 } }).exec();
        }
        catch (error) {
            console.error(`Error al actualizar los estados de las ordenes: ${error}`);
            throw new Error("Error al actualizar los estados de las ordenes");
        }
    }
    // Método para guardar una instancia de Order en la base de datos
    async save(order) {
        try {
            const orderDocument = new this.model({
                session: order.session ? order.session.sessionId : undefined,
                table: order.table ? order.table.tableId : undefined,
                guest: order.guest ? order.guest.guestId : undefined,
                user: order.user ? order.user.userId : undefined,
                type: order.type,
                items: order.items,
                status: order.status,
            });
            return await orderDocument.save();
        }
        catch (error) {
            console.error(`Error al guardar el token: ${error}`);
            throw new Error("Error al guardar el documento del token");
        }
    }
    async updateItemStatus(itemId, status) {
        console.log(itemId, status);
        const order = await this.model.findOneAndUpdate({ 'items._id': itemId }, { $set: { 'items.$.status': status } }, { new: true });
        return order;
    }
    async findForKitchen() {
        const activeSessions = await SessionSchema_1.default.find({ status: { $ne: 'Finalizada' } }).select('_id');
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
    async findByUserId(userId) {
        return await this.model.find({ user: userId });
    }
    async findBySessionId(sessionId) {
        return await this.model.find({ session: sessionId });
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=OrderRepository.js.map