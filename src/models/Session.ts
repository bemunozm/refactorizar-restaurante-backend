import { SessionDocument, SessionInterface } from "../interfaces/SessionInterface";
import { GuestDocument, GuestInterface } from "../interfaces/GuestInterface";
import { OrderDocument, OrderItemInterface } from "../interfaces/OrderInterface";
import { SessionRepository } from "../repositories/SessionRepository";
import { Product } from "./Product";
import { Table } from "./Table";
import { User } from "./User";

export class Session implements SessionInterface {
    public sessionId?: string;
    public tableId: Table;
    public guests: GuestInterface[];
    public status: 'Activa' | 'Pagando' | 'Finalizada';
    private sessionRepository: SessionRepository;

    constructor(data: Partial<SessionInterface>) {
        this.sessionId = data.sessionId?.toString();
        this.tableId = data.tableId instanceof Table ? data.tableId : new Table({ tableId: data.tableId || '' });
        this.guests = data.guests || [];
        this.status = data.status || 'Activa';
        this.sessionRepository = new SessionRepository();
    }

    private async populateOrderItems(items: OrderItemInterface[]): Promise<OrderItemInterface[]> {
        return Promise.all(items.map(async (item) => {
            const product = typeof item.productId === 'string' ? await new Product({ productId: item.productId }).findById() : item.productId;
            return {
                ...item,
                productId: product,
            };
        }));
    }

    private async populateGuests(guests: GuestDocument[]): Promise<GuestInterface[]> {
        return Promise.all(guests.map(async (guest: GuestDocument) => ({
            guestId: guest.id.toString(),
            name: guest.name,
            user: typeof guest.user === 'string' ? await new User({ userId: guest.user }).findById() : guest.user,
            orders: await Promise.all(guest.orders.map(async (order: OrderDocument) => ({
                orderId: order.id.toString(),
                sessionId: typeof order.sessionId === 'string' ? await new Session({ sessionId: order.sessionId }).findById() : order.sessionId,
                tableId: typeof order.tableId === 'string' ? await new Table({ tableId: order.tableId }).findById() : order.tableId,
                guestId: order.guestId,
                userId: typeof order.userId === 'string' ? await new User({ userId: order.userId }).findById() : order.userId,
                items: await this.populateOrderItems(order.items),
                status: order.status,
            }))),
        })));
    }

    public async findActiveSessionByTableId(): Promise<Session | null> {
        try {
            const sessionDoc = await this.sessionRepository.findActiveSessionByTableId(this.tableId.tableId);
            if (sessionDoc) {
                this.sessionId = sessionDoc.id;
                this.tableId = await new Table({ tableId: sessionDoc.tableId.toString() }).findById();
                this.guests = await this.populateGuests(sessionDoc.guests as GuestDocument[]);
                this.status = sessionDoc.status;
                return this;
            }
            return null;
        } catch (error) {
            console.error(`Error encontrando sesión activa para la mesa con ID: ${this.tableId}`, error);
            return null;
        }
    }

    public async findById(): Promise<Session | null> {
        try {
            const session = await this.sessionRepository.findBySessionId(this.sessionId);
            if (session) {
                this.sessionId = session.id.toString();
                this.tableId = await new Table({ tableId: session.tableId.toString() }).findById();
                this.guests = await this.populateGuests(session.guests as GuestDocument[]);
                this.status = session.status;
                return this;
            }
            return null;
        } catch (error) {
            console.error(`Error encontrando sesión por ID: ${this.sessionId}`, error);
            return null;
        }
    }

    public async deleteSession(): Promise<boolean | null> {
        try {
            const deletedSession = await this.sessionRepository.delete(this.sessionId);
            return deletedSession ? true : null;
        } catch (error) {
            console.error(`Error eliminando la sesión: ${error}`);
            return null;
        }
    }

    public async addGuest(guest: GuestInterface): Promise<GuestInterface | null> {
        try {
            this.guests.push(guest);
            const updatedSession = await this.sessionRepository.update(this.sessionId, { guests: this.guests });
            if (updatedSession) {
                const newGuest: GuestDocument = (updatedSession.guests as GuestDocument[])[updatedSession.guests.length - 1];
                const populatedGuest = await this.populateGuests([newGuest]);
                this.guests = await this.populateGuests(updatedSession.guests as GuestDocument[]);
                return populatedGuest[0];
            }
            return null;
        } catch (error) {
            console.error(`Error añadiendo un invitado a la sesión: ${error}`);
            return null;
        }
    }

    public async updateGuestToLogged(guestId: string, userId: string): Promise<Session | null> {
        try {
            const updatedSession = await this.sessionRepository.updateGuestToLogged(this.sessionId, userId, guestId);
            if (updatedSession) {
                this.guests = await this.populateGuests(updatedSession.guests as GuestDocument[]);
                return this;
            }
            return null;
        } catch (error) {
            console.error(`Error actualizando el estado de los invitados a logged: ${error}`);
            return null;
        }
    }

    static async getAllSessions(): Promise<Session[] | null> {
        try {
            const sessionRepository = new SessionRepository();
            const sessions = await sessionRepository.findAll();
            if (sessions) {
                return Promise.all(sessions.map(async (session: SessionDocument) => {
                    const sessionInstance = new Session({
                        sessionId: session.id,
                        tableId: await new Table({ tableId: session.tableId.toString() }).findById(),
                        guests: [],
                        status: session.status
                    });
                    sessionInstance.guests = await sessionInstance.populateGuests(session.guests as GuestDocument[]);
                    return sessionInstance;
                }));
            }
            return null;
        } catch (error) {
            console.error(`Error encontrando todas las sesiones:`, error);
            return null;
        }
    }

    public async updateStatus(status: 'Activa' | 'Pagando' | 'Finalizada'): Promise<Session | null> {
        try {
            const updatedSession = await this.sessionRepository.update(this.sessionId, { status });
            if (updatedSession) {
                this.status = updatedSession.status;
                return this;
            }
            return null;
        } catch (error) {
            console.error(`Error actualizando el estado de la sesión: ${error}`);
            return null;
        }
    }

    public async save(): Promise<Session> {
        const savedSession = await this.sessionRepository.save(this);
        this.sessionId = savedSession.id;
        this.tableId = await new Table({ tableId: savedSession.tableId.toString() }).findById();
        this.guests = await this.populateGuests(savedSession.guests as GuestDocument[]);
        return this;
    }
}
