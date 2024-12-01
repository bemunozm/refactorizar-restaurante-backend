import { Order } from "../models/Order";
import { Session } from "../models/Session";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { OrderInterface } from "../interfaces/OrderInterface";
import { SocketService } from "./SocketService";
import { Assistance } from "../models/Assistance";
import { Socket } from "socket.io";

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
        // Paso 1: Obtener la orden y actualizar el estado del ítem
        const order = new Order({});
        const updatedOrder = await order.updateItemStatus(itemId, status);
    
        // Paso 2: Buscar la asistencia asociada al ítem
        const assistance = await new Assistance({ itemId }).findByItemId();
    
        // Obtener detalles del ítem (producto, cantidad, comentario)
        const itemDetails = updatedOrder.items.find(item => item.itemId === itemId);
    
        // Validación: Si el ítem está asociado a una asistencia, gestionamos la transición de estado
        if (assistance) {
            // Caso 1: Si el ítem estaba "Listo" y ahora pasa a otro estado, lo eliminamos de la waiterRoom
            if (status !== 'Listo') {
                // Emitir evento para eliminar la asistencia de la waiterRoom
                if (status !== 'Entregado') {
                    await assistance.updateStatus('Pendiente');
                } else {
                    await assistance.updateStatus('Completado');
                }
                SocketService.to('waiterRoom', 'removeAssistance', assistance);
            }
    
            if (status === 'Listo') {
                // Asegurarse de que la asistencia se le asigne al mismo garzón de la sesión
                const existingAssistanceForSession = await new Assistance({ session: updatedOrder.session }).findBySessionId();
                
                let assignedUser = existingAssistanceForSession.find(assistance => assistance.user)?.user;
    
                // Si ya existe un garzón asignado, actualizar la asistencia
                if (assignedUser) {
                    await assistance.updateStatus('Pendiente');
                    assistance.user = assignedUser; // Asegurar que se asigna el mismo garzón
                    await assistance.save();
                }
    
                // Actualizar los detalles del ítem (producto, cantidad, comentario) en la asistencia
                if (itemDetails) {
                    assistance.itemDetails = {
                        product: itemDetails.product,
                        quantity: itemDetails.quantity,
                        comment: itemDetails.comment,
                    };
                }
            }
    
            // Emitir evento de actualización de la asistencia
            SocketService.to('waiterRoom', 'assistanceUpdated', assistance);
        }
    
        // Caso 2: Si el ítem pasa a "Listo", crear una nueva asistencia o actualizar la existente
        if (status === 'Listo') {
            // Buscar si ya existe una asistencia activa para esta sesión
            const existingAssistanceForSession = await new Assistance({ session: updatedOrder.session }).findBySessionId();
    
            let assignedUser = existingAssistanceForSession.find(assistance => assistance.user)?.user;
    
            // Crear o actualizar la asistencia para este ítem y asignar al garzón correcto
            const newAssistance = new Assistance({
                session: updatedOrder.session,
                type: 'Pedido Listo',
                status: 'Pendiente',
                itemId,
                user: assignedUser,
            });
    
            // Si existen detalles de ítem, añadirlos a la asistencia
            if (itemDetails) {
                newAssistance.itemDetails = {
                    product: itemDetails.product,
                    quantity: itemDetails.quantity,
                    comment: itemDetails.comment,
                };
            }
    
            await newAssistance.save();
    
            // Emitir evento de nueva asistencia en la waiterRoom
            SocketService.to('waiterRoom', 'newAssistance', newAssistance);
        }
    
        // Paso 3: Emitir la actualización de la orden a todos los grupos relevantes
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
