import { Order } from "../models/Order";
export declare class OrderService {
    orderProducts(orderData: any): Promise<Order>;
    getOrders(): Promise<Order[]>;
    getOrdersBySessionId(sessionId: string): Promise<Order[]>;
    updateOrderItemStatus(itemId: string, status: string): Promise<Order>;
    getOrderById(orderId: string): Promise<Order>;
    getOrdersForKitchen(): Promise<Order[]>;
    getOrdersByUserId(userId: string): Promise<Order[]>;
    updateOrderStatus(orderId: string, status: 'Sin Pagar' | 'Pagado' | 'Pendiente'): Promise<Order>;
}
