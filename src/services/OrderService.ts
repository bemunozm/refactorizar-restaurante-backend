import { Order } from "../models/Order";
import { OrderInterface } from "../interfaces/OrderInterface";
import { Session } from "../models/Session";
import { Product } from "../models/Product";
import { User } from "../models/User";

export class OrderService {
    public async orderProducts(orderData) {
        const { items, sessionId, guestId, userId } = orderData;
        //Verificar si la session existe
        const session = await new Session({ sessionId: sessionId.toString() }).findById();

        if (!session) {
            throw new Error('Session not found');
        }

        //Verificar si los items existen
        for (const item of items) {
            const product = new Product({productId: item.productId});
            await product.findById();
            if (!product) {
                throw new Error(`Producto no encontrado: ${item.productId}`);
            }
        }

        if (userId) {
            const user = new User({ userId });
            await user.findById();
            if (!user) {
                throw new Error(`Usuario no encontrado: ${userId}`);
            }
            const order = new Order({
                session: session.sessionId,
                table: session.table.tableId,
                user: user.userId,
                items: items,
                status: 'Sin Pagar'
            });
            console.log(order.items);
            return await order.save();
        } else {
            if (!guestId) {
                throw new Error('guestId es requerido');
            }
            const order = new Order({
                session: session,
                table: session.table,
                guest: {guestId: guestId, name: '', user: '', orders: []},
                items: items,
                status: 'Sin Pagar'
            });
            return await order.save();
        }
        
    }

    public async getOrders() {
        return await Order.getAll();
    }

    public async getOrdersBySessionId(sessionId: string) {
        return await Order.findBySessionId(sessionId);
    }

    public async updateOrderItemStatus( itemId: string, status: string) {
        const order = new Order({});
        return await order.updateItemStatus(itemId, status);
    }

    public async getOrderById(orderId: string) {
        const order = new Order({ orderId });
        return await order.findById();
    }

    public async getOrdersForKitchen() {
        return await new Order({}).findForKitchen();
    }

    public async getOrdersByUserId(userId: string) {
        return await new Order({ user: userId }).findByUserId();
    }

    public async updateOrderStatus(orderId: string, status: 'Sin Pagar' | 'Pagado' | 'Pendiente') {
        const order = new Order({ orderId });
        return await order.updateOrderStatus(status);
    }
}
