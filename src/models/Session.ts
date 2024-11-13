import { SessionDocument, SessionInterface } from "../interfaces/SessionInterface";
import { GuestDocument, GuestInterface } from "../interfaces/GuestInterface";
import { OrderDocument } from "../interfaces/OrderInterface";
import { SessionRepository } from "../repositories/SessionRepository";
import { Table } from "./Table";
import { User } from "./User";
import { Order } from "./Order";

export class Session implements SessionInterface {
    public sessionId?: string;
    public table: Table;
    public guests: GuestInterface[];
    public status: 'Activa' | 'Pagando' | 'Finalizada';
    private sessionRepository: SessionRepository;

    constructor(data: Partial<SessionInterface>) {
        this.sessionId = data.sessionId?.toString();
        this.status = data.status || 'Activa';
        this.guests = data.guests || [];

        // Sanitizar datos para asegurar que `table` y `guests` sean instancias correctas
        this.sanitizeData(data);

        this.sessionRepository = new SessionRepository();
    }

    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    private sanitizeData(data: Partial<SessionInterface>) {
        // Crear una instancia mínima de `Table` si `table` es un string
        this.table = data.table instanceof Table 
            ? data.table 
            : new Table({ tableId: data.table?.toString() || '' });

        // Verificar si `guests` contiene objetos completos y ajustar si es necesario
        this.guests = (data.guests || []).map(guest => ({
            ...guest,
            user: typeof guest.user === 'string' ? new User({ userId: guest.user }) : guest.user,
        }));
    }

    /**
     * Método para poblar los datos completos de los `guests`, asumiendo que `orders` ya contiene objetos completos.
     */
    private async populateGuests(guests: GuestDocument[]): Promise<GuestInterface[]> {
        return Promise.all(guests.map(async (guest: GuestDocument) => ({
            guestId: guest.id.toString(),
            name: guest.name,
            user: typeof guest.user === 'string' 
                ? await new User({ userId: guest.user }).findById()
                : guest.user,
    
            // Crear instancias completas de Order
            orders: await Promise.all(guest.orders.map(async (orderData: OrderDocument) => {
                const order = new Order({ orderId: orderData.id });
                await order.populate(); // Llenar la instancia completa
                return order;
            })),
        })));
    }
    

    public async findActiveSessionByTableId(): Promise<Session | null> {
        try {
            const sessionDoc = await this.sessionRepository.findActiveSessionByTableId(this.table.tableId);
            if (sessionDoc) {
                this.sessionId = sessionDoc.id;
                this.table = await new Table({ tableId: sessionDoc.table.toString() }).findById();
                this.guests = await this.populateGuests(sessionDoc.guests as GuestDocument[]);
                this.status = sessionDoc.status;
                return this;
            }
            return null;
        } catch (error) {
            console.error(`Error encontrando sesión activa para la mesa con ID: ${this.table.tableId}`, error);
            return null;
        }
    }

    public async findById(): Promise<Session | null> {
        try {
            const session = await this.sessionRepository.findBySessionId(this.sessionId);
            if (session) {
                this.sessionId = session.id.toString();
                this.table = await new Table({ tableId: session.table.toString() }).findById();
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
                        table: await new Table({ tableId: session.table.toString() }).findById(),
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
        this.table = await new Table({ tableId: savedSession.table.toString() }).findById();
        this.guests = await this.populateGuests(savedSession.guests as GuestDocument[]);
        return this;
    }
}
