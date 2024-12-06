"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
// SessionService.ts
const Session_1 = require("../models/Session");
const Token_1 = require("../models/Token");
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
const token_1 = require("../utils/token");
const jwt_1 = require("../utils/jwt");
const Table_1 = require("../models/Table");
class SessionService {
    async createSession(tableId) {
        const sessionInstance = new Session_1.Session({ table: new Table_1.Table({ tableId }), guests: [], status: 'Activa' });
        const existingSession = await sessionInstance.findActiveSessionByTableId();
        if (existingSession)
            throw new Error("Ya existe una sesión activa para esta mesa.");
        await sessionInstance.save();
        //Actualiza el estado de la mesa
        const table = new Table_1.Table({ tableId });
        await table.update({ status: 'Ocupada' });
        const newSessionToken = new Token_1.Token({ session: sessionInstance, token: (0, token_1.generateToken)() });
        await newSessionToken.save();
        return sessionInstance;
    }
    async getAllSessions() {
        return await Session_1.Session.getAllSessions();
    }
    async getSessionById(id) {
        const session = new Session_1.Session({ sessionId: id });
        return await session.findById();
    }
    async getSessionByTableId(tableId) {
        const session = new Session_1.Session({ table: new Table_1.Table({ tableId }) });
        return await session.findActiveSessionByTableId();
    }
    async updateSession(id, endedAt) {
        const session = new Session_1.Session({ sessionId: id });
        return await session.updateStatus('Finalizada'); // Aquí podríamos ajustar el estado y la hora de finalización
    }
    async deleteSession(id) {
        const session = new Session_1.Session({ sessionId: id });
        return await session.deleteSession();
    }
    async addGuestToSession(sessionId, guestName, userId) {
        const session = new Session_1.Session({ sessionId: sessionId });
        const sessionData = await session.findById();
        if (!sessionData)
            throw new Error("Session not found");
        if (userId) {
            const user = await new User_1.User({ userId }).findById();
            if (!user)
                throw new Error("User not found");
            await session.addGuest({ name: user.name, user, orders: [] });
            const token = (0, jwt_1.generateJWT)({ id: user.userId, sessionId, role: 'Usuario' });
            return { token, sessionId };
        }
        const guest = await session.addGuest({ name: guestName, orders: [] });
        const guestToken = (0, jwt_1.generateJWT)({ id: guest.guestId, sessionId, role: 'Invitado' });
        return { token: guestToken, sessionId };
    }
    async transferGuestOrdersToUser(guestId, userId) {
        const order = new Order_1.Order({ guest: { guestId, name: '', orders: [] }, user: new User_1.User({ userId }), status: "Sin Pagar" });
        return await order.updateGuestToUserOrders();
    }
    async validateToken(token) {
        return await new Token_1.Token({ token }).findByToken();
    }
    async checkSessionExists(tableId) {
        const sessionInstance = new Session_1.Session({ table: new Table_1.Table({ tableId }), status: 'Activa' });
        return await sessionInstance.findActiveSessionByTableId();
    }
    async getSessionToken(sessionId) {
        return await new Token_1.Token({ session: new Session_1.Session({ sessionId }) }).findBySessionId();
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map