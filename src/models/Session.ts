import { SessionDocument, SessionInterface } from "../interfaces/SessionInterface";
import { GuestDocument, GuestInterface } from "../interfaces/GuestInterface";
import { SessionRepository } from "../repositories/SessionRepository";
import { OrderDocument } from "../interfaces/OrderInterface";

export class Session implements SessionInterface {
    public sessionId?: string;
    public tableId: string;
    public guests: GuestInterface[];
    public status: 'Activa' | 'Pagando' | 'Finalizada';
    private sessionRepository: SessionRepository;
  
    constructor(data: Partial<SessionInterface>) {
        this.sessionId = data.sessionId?.toString();
        this.tableId = data.tableId?.toString() || '';
        this.guests = data.guests || [];
        this.status = data.status || 'Activa';
        this.sessionRepository = new SessionRepository();
    }

    private populateGuests(guests: GuestDocument[]): GuestInterface[] {
        const populatedGuest = guests.map((guest: GuestDocument) => ({
            guestId: guest.id.toString(),
            name: guest.name,
            user: guest.user,
            orders: guest.orders.map((order: OrderDocument) => ({
                orderId: order.id.toString(),
                sessionId: order.sessionId,
                tableId: order.tableId,
                guestId: order.guestId,
                userId: order.userId,
                items: order.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    status: item.status,
                    comment: item.comment
                })),
                status: order.status
            }))
        }));
        return populatedGuest;
    }

    public async findActiveSessionByTableId(): Promise<Session | null> {
        try {
            const sessionDoc = await this.sessionRepository.findActiveSessionByTableId(this.tableId);
            if (sessionDoc) {
                this.sessionId = sessionDoc.id;
                this.tableId = sessionDoc.tableId.toString();
                this.guests = this.populateGuests(sessionDoc.guests as GuestDocument[]);
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
                this.tableId = session.tableId.toString();
                this.guests = this.populateGuests(session.guests as GuestDocument[]);
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
            console.log(this.guests);
            const updatedSession = await this.sessionRepository.update(this.sessionId, { guests: this.guests });
            console.log(updatedSession);
            if (updatedSession) {
                const newGuest: GuestDocument = (updatedSession.guests as GuestDocument[])[updatedSession.guests.length - 1];
                const populatedGuest = {
                    guestId: newGuest.id.toString(),
                    name: newGuest.name,
                    orders: newGuest.orders.map((order: OrderDocument) => ({
                        orderId: order.id.toString(),
                        sessionId: order.sessionId,
                        tableId: order.tableId,
                        guestId: order.guestId,
                        userId: order.userId,
                        items: order.items,
                        status: order.status
                    }))
                };
                this.guests = this.populateGuests(updatedSession.guests as GuestDocument[]);
                return populatedGuest;
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
                this.guests = this.populateGuests(updatedSession.guests as GuestDocument[]);
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
                const sessionInstances = sessions.map((session: SessionDocument) => {
                    const sessionInstance = new Session({
                        sessionId: session.id,
                        tableId: session.tableId,
                        guests: [],
                        status: session.status
                    });
                    sessionInstance.guests = sessionInstance.populateGuests(session.guests as GuestDocument[]);
                    return sessionInstance;
                });
                return sessionInstances;
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
            //Si el status es Finalizada cambiar el endedAt a new Date()
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
        this.guests = this.populateGuests(savedSession.guests as GuestDocument[]);
        return this;
    }
}
