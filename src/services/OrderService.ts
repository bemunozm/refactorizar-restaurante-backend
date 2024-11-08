import { Order } from "../models/Order";
import { OrderInterface } from "../interfaces/OrderInterface";
import { Session } from "../models/Session";
import { Product } from "../models/Product";

export class OrderService {
    public async orderProducts(orderData: Partial<OrderInterface>) {
        const { items, sessionId, tableId, guestId, userId } = orderData;
        
        //Verificar si la session existe
        const session = await new Session({ sessionId: sessionId.toString() }).findById();

        if (!session) {
            throw new Error('Session not found');
        }

        //Verificar si los items existen
        for (const item of items) {
            const product = new Product({productId: item.productId});
            await product.findById();
            console.log(product);
            if (!product) {
                throw new Error(`Producto no encontrado: ${item.productId}`);
            }
        }

        //Crear la orden
        const order = new Order({
            sessionId: sessionId,
            tableId: tableId,
            guestId: guestId || '',
            userId: userId || '',
            items: items,
            status: 'Sin Pagar'
        });

        return await order.save();
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
        return await new Order({ userId }).findByUserId();
    }

    public async updateOrderStatus(orderId: string, status: 'Sin Pagar' | 'Pagado' | 'Pendiente') {
        const order = new Order({ orderId });
        return await order.updateOrderStatus(status);
    }
}
