"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistanceService = void 0;
const Assistance_1 = require("../models/Assistance");
const Order_1 = require("../models/Order");
const Session_1 = require("../models/Session");
const Transaction_1 = require("../models/Transaction");
const User_1 = require("../models/User");
const SocketService_1 = require("./SocketService");
class AssistanceService {
    async createAssistance(assistanceData) {
        const sessionInstance = new Session_1.Session({ sessionId: assistanceData.sessionId });
        if (!await sessionInstance.findById()) {
            throw new Error('Sesión no encontrada');
        }
        // Comprobar si ya existe una asistencia para esta sesión
        const existingAssistance = await new Assistance_1.Assistance({ session: sessionInstance }).findBySessionId();
        let assignedUser = null;
        // Si ya existe una asistencia con un garzón asignado, usar al mismo garzón
        if (existingAssistance.some(assistance => assistance.user)) {
            assignedUser = existingAssistance.find(assistance => assistance.user)?.user;
        }
        else {
            // Si no hay asistencias previas con un garzón, asignar el usuario de la primera asistencia
            assignedUser = null; // Para este ejemplo, dejamos como null para que sea asignado dinámicamente (si es necesario).
        }
        // Crear la nueva asistencia y asignar al garzón (si hay uno asignado)
        const assistanceInstance = new Assistance_1.Assistance({
            session: sessionInstance,
            type: assistanceData.type,
            user: assignedUser,
            status: 'Pendiente',
            transactionToken: assistanceData.transactionToken,
        });
        await assistanceInstance.save();
        // Emitir evento para los camareros sobre la asistencia creada
        SocketService_1.SocketService.to('waiterRoom', 'newAssistance', assistanceInstance);
        return assistanceInstance;
    }
    async assignAssistance(assistanceId, userId) {
        const assistance = new Assistance_1.Assistance({ assistanceId });
        const foundAssistance = await assistance.findById();
        if (!foundAssistance) {
            throw new Error('Asistencia no encontrada');
        }
        // Verificar si ya hay un usuario asignado a la asistencia
        if (foundAssistance.user && foundAssistance.user.userId !== userId) {
            throw new Error('Esta asistencia ya está asignada a otro usuario');
        }
        // Verificar si la asistencia tiene un estado que no permite ser tomada
        if (foundAssistance.status !== 'Pendiente') {
            throw new Error('La asistencia no puede ser tomada en su estado actual');
        }
        // Obtener todas las asistencias de la misma sesión
        const sessionAssistance = await new Assistance_1.Assistance({ session: foundAssistance.session }).findBySessionId();
        // Si alguna asistencia de la sesión ya tiene un garzón asignado, todos deben tenerlo
        if (sessionAssistance.some(assistance => assistance.user)) {
            const assignedUser = sessionAssistance.find(assistance => assistance.user)?.user;
            // Asignar todas las asistencias de la sesión al mismo garzón
            for (let assist of sessionAssistance) {
                if (assist.status === 'Pendiente' && !assist.user) {
                    await assist.assignUser(assignedUser.userId);
                    SocketService_1.SocketService.to("waiterRoom", 'assistanceUpdated', assist);
                }
            }
        }
        else {
            // Si no hay un garzón asignado a ninguna asistencia, asignamos el primer garzón a todas
            for (let assist of sessionAssistance) {
                await assist.assignUser(userId);
                SocketService_1.SocketService.to("waiterRoom", 'assistanceUpdated', assist);
            }
        }
        // Actualizar la asistencia específica que fue seleccionada
        await foundAssistance.assignUser(userId);
        await foundAssistance.updateStatus('En Progreso');
        SocketService_1.SocketService.to("waiterRoom", 'assistanceUpdated', foundAssistance);
        return foundAssistance;
    }
    async completeAssistance(assistanceId) {
        const assistance = new Assistance_1.Assistance({ assistanceId });
        const foundAssistance = await assistance.findById();
        if (!foundAssistance) {
            throw new Error('Asistencia no encontrada');
        }
        await assistance.complete();
        SocketService_1.SocketService.to('waiterRoom', 'assistanceUpdated', assistance);
        return assistance;
    }
    async confirmTransaction(assistanceId, transactionToken) {
        const assistance = new Assistance_1.Assistance({ assistanceId });
        const foundAssistance = await assistance.findById();
        if (!foundAssistance) {
            throw new Error('Asistencia no encontrada');
        }
        const transaction = new Transaction_1.Transaction({ token: transactionToken });
        if (!await transaction.findByToken()) {
            throw new Error('Transacción no encontrada');
        }
        for (const order of transaction.orders) {
            const orderInstance = await new Order_1.Order({ orderId: order.orderId }).findById();
            if (!order)
                throw new Error('Orden no encontrada');
            await orderInstance.updateOrderStatus('Pagado');
        }
        const sessionOrders = await Order_1.Order.findBySessionId(transaction.session.sessionId);
        const allOrdersPaid = sessionOrders.every((order) => order.status === 'Pagado');
        const session = new Session_1.Session({ sessionId: transaction.session.sessionId });
        if (allOrdersPaid) {
            await session.updateStatus('Finalizada');
        }
        else {
            await session.updateStatus('Activa');
        }
        await transaction.updateStatus('CONFIRMADA');
        await assistance.confirmTransaction(transactionToken);
        // Emitir eventos de asistencia y sesión
        SocketService_1.SocketService.to('waiterRoom', 'removeAssistance', assistance);
        SocketService_1.SocketService.to(session.sessionId, 'assistanceApproved', sessionOrders);
        return assistance;
    }
    async declineTransaction(assistanceId, transactionToken) {
        const assistance = new Assistance_1.Assistance({ assistanceId });
        const foundAssistance = await assistance.findById();
        if (!foundAssistance) {
            throw new Error('Asistencia no encontrada');
        }
        const transaction = new Transaction_1.Transaction({ token: transactionToken });
        if (!await transaction.findByToken()) {
            throw new Error('Transacción no encontrada');
        }
        await transaction.updateStatus('ANULADA');
        await assistance.updateStatus('Completado');
        const session = new Session_1.Session({ sessionId: transaction.session.sessionId });
        await session.updateStatus('Activa');
        // Emitir eventos de asistencia
        SocketService_1.SocketService.to('waiterRoom', 'removeAssistance', assistance);
        SocketService_1.SocketService.to(session.sessionId, 'assistanceDeclined', transaction.orders);
        return assistance;
    }
    async getAllAssistances() {
        return await Assistance_1.Assistance.getAll();
    }
    async getAvailableAssistances(userId) {
        const user = new User_1.User({ userId });
        if (!await user.findById()) {
            throw new Error('Usuario no encontrado');
        }
        const availableAssistances = await Assistance_1.Assistance.getAllAvailable();
        const filteredAssistances = availableAssistances.filter(async (assistance) => {
            const sessionId = assistance.session.sessionId;
            const isSessionAssigned = await Assistance_1.Assistance.isSessionAssignedToOtherWaiter(sessionId, userId);
            if (isSessionAssigned)
                return false;
            return !assistance.user || assistance.user.userId === userId;
        });
        return availableAssistances;
    }
    async updateStatus(assistanceId, status) {
        const assistance = new Assistance_1.Assistance({ assistanceId });
        await assistance.updateStatus(status);
        SocketService_1.SocketService.to('waiterRoom', 'assistanceUpdated', assistance);
        return assistance;
    }
}
exports.AssistanceService = AssistanceService;
//# sourceMappingURL=AssistanceService.js.map