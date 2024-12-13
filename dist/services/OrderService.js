"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const Order_1 = require("../models/Order");
const Session_1 = require("../models/Session");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
const SocketService_1 = require("./SocketService");
const Assistance_1 = require("../models/Assistance");
const Delivery_1 = require("../models/Delivery");
class OrderService {
    async orderProducts(orderData) {
        const { items, sessionId, guestId, userId, type, status } = orderData;
        // Crear instancia de sesión usando el sessionId si está presente
        let sessionInstance;
        if (sessionId) {
            sessionInstance = new Session_1.Session({ sessionId });
            if (!await sessionInstance.findById()) {
                throw new Error('Session not found');
            }
        }
        // Verificar que todos los productos existen
        const verifiedItems = await Promise.all(items?.map(async (item) => {
            const productInstance = new Product_1.Product({ productId: item.product.toString() });
            if (!await productInstance.findById()) {
                throw new Error(`Producto no encontrado: ${item.product}`);
            }
            return { ...item, product: productInstance };
        }) || []);
        // Crear instancia de usuario si userId existe
        let userInstance;
        if (userId) {
            userInstance = new User_1.User({ userId });
            if (!await userInstance.findById()) {
                throw new Error(`Usuario no encontrado: ${userId}`);
            }
        }
        // Revisa el invitado si guestId existe
        let guestInstance;
        if (guestId && sessionInstance) {
            guestInstance = sessionInstance.guests.find(guest => guest.guestId === guestId);
            if (!guestInstance) {
                throw new Error(`Invitado no encontrado: ${guestId}`);
            }
        }
        // Crear la orden
        const order = new Order_1.Order({
            session: sessionInstance,
            table: sessionInstance?.table,
            guest: guestInstance ? { guestId, name: '', user: null, orders: [] } : undefined,
            user: userInstance,
            items: verifiedItems,
            status: status || 'Sin Pagar',
            type: type
        });
        const savedOrder = await order.save();
        console.log('savedOrder', savedOrder);
        // Emitir actualización a la sesión correspondiente si existe
        if (sessionId) {
            SocketService_1.SocketService.to(sessionId, "orderUpdated", savedOrder);
        }
        // Emitir a la cocina con la actualización de la orden
        SocketService_1.SocketService.to("kitchen", "kitchenOrderUpdated", savedOrder);
        // Emitir a los camareros (waiters) de la sesión con la actualización
        SocketService_1.SocketService.to("waiters", "waiterOrderUpdated", savedOrder);
        // Emitir a los administradores con la actualización
        SocketService_1.SocketService.to("admin", "adminOrderUpdated", savedOrder);
        return savedOrder;
    }
    async getOrders() {
        return await Order_1.Order.getAll();
    }
    async getOrdersBySessionId(sessionId) {
        return await Order_1.Order.findBySessionId(sessionId);
    }
    async updateOrderItemStatus(itemId, status) {
        // Paso 1: Obtener la orden y actualizar el estado del ítem
        const order = new Order_1.Order({});
        const updatedOrder = await order.updateItemStatus(itemId, status);
        // Verificar si la orden tiene sessionId
        if (updatedOrder.session?.sessionId) {
            // Flujo para órdenes con sessionId (mesas)
            // Paso 2: Buscar la asistencia asociada al ítem
            const assistance = await new Assistance_1.Assistance({ itemId }).findByItemId();
            // Obtener detalles del ítem (producto, cantidad, comentario)
            const itemDetails = updatedOrder.items.find(item => item.itemId === itemId);
            // Validación: Si el ítem está asociado a una asistencia, gestionamos la transición de estado
            if (assistance) {
                // Caso 1: Si el ítem estaba "Listo" y ahora pasa a otro estado, lo eliminamos de la waiterRoom
                if (status !== 'Listo') {
                    // Emitir evento para eliminar la asistencia de la waiterRoom
                    if (status !== 'Entregado') {
                        await assistance.updateStatus('Pendiente');
                    }
                    else {
                        await assistance.updateStatus('Completado');
                    }
                    SocketService_1.SocketService.to('waiterRoom', 'removeAssistance', assistance);
                }
                if (status === 'Listo') {
                    // Asegurarse de que la asistencia se le asigne al mismo garzón de la sesión
                    const existingAssistanceForSession = await new Assistance_1.Assistance({ session: updatedOrder.session }).findBySessionId();
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
                SocketService_1.SocketService.to('waiterRoom', 'assistanceUpdated', assistance);
            }
            // Caso 2: Si el ítem pasa a "Listo", crear una nueva asistencia o actualizar la existente
            if (status === 'Listo') {
                // Buscar si ya existe una asistencia activa para esta sesión
                const existingAssistanceForSession = await new Assistance_1.Assistance({ session: updatedOrder.session }).findBySessionId();
                let assignedUser = existingAssistanceForSession.find(assistance => assistance.user)?.user;
                // Crear o actualizar la asistencia para este ítem y asignar al garzón correcto
                const newAssistance = new Assistance_1.Assistance({
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
                SocketService_1.SocketService.to('waiterRoom', 'newAssistance', newAssistance);
            }
            // Emitir la actualización de la orden a todos los grupos relevantes
            SocketService_1.SocketService.to(updatedOrder.session.sessionId, "orderUpdated", updatedOrder);
            SocketService_1.SocketService.to("kitchen", "kitchenOrderUpdated", updatedOrder);
            SocketService_1.SocketService.to("waiters", "waiterOrderUpdated", updatedOrder);
            SocketService_1.SocketService.to("admin", "adminOrderUpdated", updatedOrder);
        }
        else {
            //Si existe un pedido en linea
            const delivery = await Delivery_1.Delivery.getByOrderId(updatedOrder.orderId);
            if (delivery) {
                if (status === 'Listo') {
                    const updatedOrder = await order.updateItemStatus(itemId, 'Entregado');
                    SocketService_1.SocketService.to(delivery.deliveryId, "orderUpdated", updatedOrder);
                    SocketService_1.SocketService.to("kitchen", "kitchenOrderUpdated", updatedOrder);
                    SocketService_1.SocketService.to("waiters", "waiterOrderUpdated", updatedOrder);
                    SocketService_1.SocketService.to("admin", "adminOrderUpdated", updatedOrder);
                }
                if (delivery.status !== 'Completado' && delivery.status !== 'En Camino') {
                    await delivery.updateStatus('En Preparación');
                }
                //Si todos los items estan listos, actualizar el estado de la orden a "Listo"
                if (order.items.every(item => item.status === 'Entregado')) {
                    await delivery.updateStatus('Listo para Entregar');
                }
                //SocketService.to("onlineOrders", "onlineOrderUpdated", updatedOrder);
            }
        }
        return updatedOrder;
    }
    async getOrderById(orderId) {
        const order = new Order_1.Order({ orderId });
        return await order.findById();
    }
    async getOrdersForKitchen() {
        return await new Order_1.Order({}).findForKitchen();
    }
    async getOrdersByUserId(userId) {
        const orders = await Order_1.Order.findByUserId(userId);
        return orders;
    }
    async updateOrderStatus(orderId, status) {
        const order = new Order_1.Order({ orderId });
        const updatedOrder = await order.updateOrderStatus(status);
        // Emitir la actualización a la sesión, cocina, camareros y administradores
        SocketService_1.SocketService.to(updatedOrder.session.sessionId, "orderUpdated", updatedOrder);
        SocketService_1.SocketService.to("kitchen", "kitchenOrderUpdated", updatedOrder);
        SocketService_1.SocketService.to("waiters", "waiterOrderUpdated", updatedOrder);
        SocketService_1.SocketService.to("admin", "adminOrderUpdated", updatedOrder);
        return updatedOrder;
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map