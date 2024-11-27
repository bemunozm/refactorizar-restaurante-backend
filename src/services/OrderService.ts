import { Order } from "../models/Order";
import { Session } from "../models/Session";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { OrderInterface } from "../interfaces/OrderInterface";
import { SocketService } from "./SocketService";

export class OrderService {
    public async orderProducts(orderData) {
        const { items, sessionId, guestId, userId } = orderData;
        
        // Crear instancia de sesión usando el sessionId
        const sessionInstance = new Session({ sessionId });
        if (!await sessionInstance.findById()) {
            throw new Error('Session not found');
        }

        // Verificar que todos los productos existen
        const verifiedItems = await Promise.all(items?.map(async item => {
            const productInstance = new Product({ productId: item.product.toString() });
            if (!await productInstance.findById()) {
                throw new Error(`Producto no encontrado: ${item.product}`);
            }
            return { ...item, product: productInstance };
        }) || []);

        // Crear instancia de usuario si userId existe, o manejar invitado si solo guestId está disponible
        const userInstance = userId ? new User({ userId }) : undefined;
        if (userInstance && !await userInstance.findById()) {
            throw new Error(`Usuario no encontrado: ${userId}`);
        }

        // Revisa el invitado si guestId existe
        const guestInstance = guestId ? sessionInstance.guests.find(guest => guest.guestId === guestId) : undefined;

        if (guestId && !guestInstance) {
            throw new Error(`Invitado no encontrado: ${guestId}`);
        }

        // Crear la orden
        const order = new Order({
            session: sessionInstance,
            table: sessionInstance.table,
            guest: guestInstance ? { guestId, name: '', user: null, orders: [] } : undefined,
            user: userInstance,
            items: verifiedItems,
            status: 'Sin Pagar',
        });
        const savedOrder = await order.save();

        // Emitir actualización a la sesión correspondiente
        SocketService.to(sessionId, "orderUpdated", savedOrder);

        // Emitir a la cocina con la actualización de la orden
        SocketService.to("kitchen", "kitchenOrderUpdated", savedOrder);

        // Emitir a los camareros (waiters) de la sesión con la actualización
        SocketService.to("waiters", "waiterOrderUpdated", savedOrder);

        // Emitir a los administradores con la actualización
        SocketService.to("admin", "adminOrderUpdated", savedOrder);

        return savedOrder;
    }

    public async getOrders() {
        return await Order.getAll();
    }

    public async getOrdersBySessionId(sessionId: string) {
        return await Order.findBySessionId(sessionId);
    }

    public async updateOrderItemStatus(itemId: string, status: string) {
        const order = new Order({});
        const updatedOrder = await order.updateItemStatus(itemId, status);

        // Emitir la actualización a los clientes, camareros y cocina
        SocketService.to(updatedOrder.session.sessionId, "orderUpdated", updatedOrder);
        SocketService.to("kitchen", "kitchenOrderUpdated", updatedOrder);
        SocketService.to("waiters", "waiterOrderUpdated", updatedOrder);
        SocketService.to("admin", "adminOrderUpdated", updatedOrder);

        return updatedOrder;
    }

    public async getOrderById(orderId: string) {
        const order = new Order({ orderId });
        return await order.findById();
    }

    public async getOrdersForKitchen() {
        return await new Order({}).findForKitchen();
    }

    public async getOrdersByUserId(userId: string) {
        const orders = await Order.findByUserId(userId);
        return orders;
    }

    public async updateOrderStatus(orderId: string, status: 'Sin Pagar' | 'Pagado' | 'Pendiente') {
        const order = new Order({ orderId });
        const updatedOrder = await order.updateOrderStatus(status);

        // Emitir la actualización a la sesión, cocina, camareros y administradores
        SocketService.to(updatedOrder.session.sessionId, "orderUpdated", updatedOrder);
        SocketService.to("kitchen", "kitchenOrderUpdated", updatedOrder);
        SocketService.to("waiters", "waiterOrderUpdated", updatedOrder);
        SocketService.to("admin", "adminOrderUpdated", updatedOrder);

        return updatedOrder;
    }
}
