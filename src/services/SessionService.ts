import { Session } from "../models/Session";
import { Token } from "../models/Token";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { generateToken } from "../utils/token";
import { generateJWT } from "../utils/jwt";


export class SessionService {
    public async createSession(tableId: string) {
        const sessionInstance = new Session({ tableId, guests: [], status: 'Activa' });
        const existingSession = await sessionInstance.findActiveSessionByTableId();

        if (existingSession) throw new Error("Ya existe una sesión activa para esta mesa.");

        await sessionInstance.save();
        const newSessionToken = new Token({ session: sessionInstance.sessionId, token: generateToken() });
        await newSessionToken.save();

        return sessionInstance;
    }

    public async getAllSessions() {
        return await Session.getAllSessions();
    }

    public async getSessionById(id: string) {
        const session = new Session({ sessionId: id, tableId: '', guests: [], status: 'Activa' });
        const sessionExists = await session.findById();

        if (!sessionExists) throw new Error("Session not found");

        return sessionExists;
    }

    public async getSessionByTableId(tableId: string) {
        const session = new Session({ sessionId: '', tableId: tableId, guests: [], status: 'Activa' });
        const sessionExists = await session.findActiveSessionByTableId();
        console.log(sessionExists);
        if (!sessionExists) throw new Error("Session not found");

        return sessionExists;
    }

    public async updateSession(id: string, endedAt?: Date) {
        //Por implementar

        // const session = new Session({ sessionId: id, tableId: '', guests: [], status: 'Activa' });
        // return await session.update({ endedAt: endedAt ? new Date(endedAt) : new Date() });

        return 'Por implementar';
    }

    public async deleteSession(id: string) {
        const session = new Session({ sessionId: id, tableId: '', guests: [], status: 'Activa' });
        return await session.deleteSession();
    }

    public async addGuestToSession(sessionId: string, guestName: string, userId?: string) {
        const session = new Session({ sessionId: sessionId, tableId: '', guests: [], status: 'Activa' });
        const sessionData = await session.findById();
        if (!sessionData) throw new Error("Session not found");

        if (userId) {
            const user = await new User({ userId: userId, name: '', lastname: '', email: '', password: '', confirmed: false, roles: []}).findById();

            if (!user) throw new Error("User not found");
            const token = generateJWT({ id: user.userId, sessionId, role: 'Usuario' });
            return { token, sessionId };
        }

        const guest = await session.addGuest({ name: guestName, orders: [] });
        const guestToken = generateJWT({ id: guest.guestId, sessionId, role: 'Invitado' });

        console.log(session);
        return { token: guestToken, sessionId };
    }

    public async transferGuestOrdersToUser(guestId: string, userId: string) {
        //Actualizar los pedidos del invitado para que pertenezcan al usuario
        const order = new Order({ guestId: guestId, sessionId: '', tableId: '', userId: userId, items: [], status: "Sin Pagar" });

        //Actualizar los pedidos de invitado a usuario
        const updatedOrders = await order.updateGuestToUserOrders();

        if (!updatedOrders) throw new Error("Error Transfiereindo los pedidos del invitado al usuario");

        return updatedOrders;
    }

    public async validateToken(token: string) {
        return await new Token({ token }).findByToken();
    }

    public async checkSessionExists(tableId: string) {
        const sessionInstance = new Session({ tableId, guests: [], status: 'Activa' });
        const existingSession = await sessionInstance.findActiveSessionByTableId();

        return existingSession;
    }

    public async getSessionToken(sessionId: string) {
        return await new Token({ session: sessionId, token: '' }).findBySessionId();
    }
}
