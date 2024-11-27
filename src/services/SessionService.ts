// SessionService.ts
import { Session } from "../models/Session";
import { Token } from "../models/Token";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { generateToken } from "../utils/token";
import { generateJWT } from "../utils/jwt";
import { Table } from "../models/Table";

export class SessionService {
    public async createSession(tableId: string) {
        const sessionInstance = new Session({ table: new Table({ tableId }), guests: [], status: 'Activa' });
        const existingSession = await sessionInstance.findActiveSessionByTableId();
        if (existingSession) throw new Error("Ya existe una sesión activa para esta mesa.");
        
        await sessionInstance.save();

        //Actualiza el estado de la mesa
        const table = new Table({ tableId });
        await table.update({ status: 'Ocupada' });

        const newSessionToken = new Token({ session: sessionInstance, token: generateToken() });
        await newSessionToken.save();

        return sessionInstance;
    }

    public async getAllSessions() {
        return await Session.getAllSessions();
    }

    public async getSessionById(id: string) {
        const session = new Session({ sessionId: id });
        return await session.findById();
    }

    public async getSessionByTableId(tableId: string) {
        const session = new Session({ table: new Table({ tableId }) });
        return await session.findActiveSessionByTableId();
    }

    public async updateSession(id: string, endedAt?: Date) {
        const session = new Session({ sessionId: id });
        return await session.updateStatus('Finalizada');  // Aquí podríamos ajustar el estado y la hora de finalización
    }

    public async deleteSession(id: string) {
        const session = new Session({ sessionId: id });
        return await session.deleteSession();
    }

    public async addGuestToSession(sessionId: string, guestName: string, userId?: string) {
        const session = new Session({ sessionId: sessionId });
        const sessionData = await session.findById();
        if (!sessionData) throw new Error("Session not found");
        if (userId) {
            const user = await new User({ userId }).findById();
            if (!user) throw new Error("User not found");
            
            await session.addGuest({ name: user.name, user, orders: [] });

            const token = generateJWT({ id: user.userId, sessionId, role: 'Usuario' });
            return { token, sessionId };
        }
        const guest = await session.addGuest({ name: guestName, orders: [] });
        const guestToken = generateJWT({ id: guest.guestId, sessionId, role: 'Invitado' });

        return { token: guestToken, sessionId };
    }

    public async transferGuestOrdersToUser(guestId: string, userId: string) {
        const order = new Order({ guest: { guestId, name: '', orders: [] }, user: new User({ userId }), status: "Sin Pagar" });
        return await order.updateGuestToUserOrders();
    }

    public async validateToken(token: string) {
        return await new Token({ token }).findByToken();
    }

    public async checkSessionExists(tableId: string) {
        const sessionInstance = new Session({ table: new Table({ tableId }), status: 'Activa' });
        return await sessionInstance.findActiveSessionByTableId();
    }

    public async getSessionToken(sessionId: string) {
        return await new Token({ session: new Session({ sessionId }) }).findBySessionId();
    }
}
