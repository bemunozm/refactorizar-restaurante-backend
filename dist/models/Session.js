"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const SessionRepository_1 = require("../repositories/SessionRepository");
const Table_1 = require("./Table");
const User_1 = require("./User");
const Order_1 = require("./Order");
class Session {
    sessionId;
    table;
    guests;
    status;
    createdAt;
    updatedAt;
    sessionRepository;
    constructor(data) {
        this.sessionId = data.sessionId?.toString();
        this.status = data.status || 'Activa';
        this.guests = data.guests || [];
        this.sessionRepository = new SessionRepository_1.SessionRepository();
        // Inicialización segura de `table` y `guests` para evitar errores
        this.table = data.table instanceof Table_1.Table ? data.table : new Table_1.Table({ tableId: data.table || '' });
        this.guests = (data.guests || []).map(guest => ({
            ...guest,
            user: guest.user instanceof User_1.User ? guest.user : new User_1.User({ userId: guest.user || '' }),
        }));
    }
    async populateGuests(guests) {
        return Promise.all(guests.map(async (guest) => ({
            guestId: guest.id.toString(),
            name: guest.name,
            user: typeof guest.user === 'string'
                ? await new User_1.User({ userId: guest.user }).findById()
                : guest.user,
            orders: await Promise.all(guest.orders.map(async (orderData) => {
                const order = new Order_1.Order({ orderId: orderData.id });
                await order.populate(); // Llenar la instancia completa
                return order;
            })),
        })));
    }
    async findActiveSessionByTableId() {
        const sessionDoc = await this.sessionRepository.findActiveSessionByTableId(this.table.tableId);
        if (sessionDoc) {
            this.populateFromDocument(sessionDoc);
            await this.table.findById(); // Poblar la instancia de `Table`
            return this;
        }
        return null;
    }
    async findById() {
        const sessionDoc = await this.sessionRepository.findBySessionId(this.sessionId);
        if (sessionDoc) {
            this.populateFromDocument(sessionDoc);
            await this.table.findById(); // Poblar la instancia de `Table`
            return this;
        }
        return null;
    }
    async deleteSession() {
        return await this.sessionRepository.delete(this.sessionId);
    }
    async addGuest(guest) {
        // Serializar los datos del invitado antes de la operación
        const sanitizedGuest = {
            name: guest.name,
            user: guest.user && guest.user.userId ? guest.user.userId : null,
            orders: guest.orders.map(order => order.orderId),
        };
        // Usar $push para agregar el nuevo invitado sin reemplazar el array completo
        const updatedSession = await this.sessionRepository.pushGuest(this.sessionId, sanitizedGuest);
        if (updatedSession) {
            // Obtener el nuevo invitado desde la sesión actualizada
            const newGuest = updatedSession.guests.slice(-1)[0];
            const populatedGuest = await this.populateGuests([newGuest]);
            // Actualizar la lista local de invitados
            this.guests = await this.populateGuests(updatedSession.guests);
            return populatedGuest[0];
        }
        return null;
    }
    async updateGuestToLogged(guestId, userId) {
        const updatedSession = await this.sessionRepository.updateGuestToLogged(this.sessionId, userId, guestId);
        if (updatedSession) {
            this.guests = await this.populateGuests(updatedSession.guests);
            return this;
        }
        return null;
    }
    static async getAllSessions() {
        const sessionRepository = new SessionRepository_1.SessionRepository();
        const sessions = await sessionRepository.findAll();
        return sessions ? Promise.all(sessions.map(async (sessionDoc) => {
            const sessionInstance = new Session({});
            sessionInstance.populateFromDocument(sessionDoc);
            await sessionInstance.table.findById(); // Poblar la instancia de `Table`
            return sessionInstance;
        })) : null;
    }
    async updateStatus(status) {
        const updatedSession = await this.sessionRepository.update(this.sessionId, { status: status });
        console.log('Updated Session', updatedSession);
        if (updatedSession) {
            this.status = updatedSession.status;
            return this;
        }
        return null;
    }
    async save() {
        const savedSession = await this.sessionRepository.save(this);
        this.populateFromDocument(savedSession);
        return this;
    }
    static async getSessionsBetweenDates(startDate, endDate) {
        const sessionRepository = new SessionRepository_1.SessionRepository();
        const sessions = await sessionRepository.findSessionsBetweenDates(startDate, endDate);
        return Promise.all(sessions.map(async (sessionDoc) => {
            const sessionInstance = new Session({});
            await sessionInstance.populateFromDocument(sessionDoc);
            await sessionInstance.table.findById();
            return sessionInstance;
        }));
    }
    populateFromDocument(sessionDoc) {
        this.sessionId = sessionDoc.id.toString();
        this.table = new Table_1.Table({ tableId: sessionDoc.table.toString() });
        this.status = sessionDoc.status;
        this.guests = sessionDoc.guests.map((guest) => ({
            guestId: guest.id,
            name: guest.name,
            user: new User_1.User({ userId: guest.user?.toString() || '' }), // Instancia mínima de `User`
            orders: guest.orders.map((orderDoc) => new Order_1.Order({ orderId: orderDoc.id })), // Instancia mínima de `Order`
        }));
        this.createdAt = sessionDoc.createdAt;
        this.updatedAt = sessionDoc.updatedAt;
    }
}
exports.Session = Session;
//# sourceMappingURL=Session.js.map