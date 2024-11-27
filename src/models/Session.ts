// Session.ts
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
    public createdAt?: Date;
    public updatedAt?: Date;
    private sessionRepository: SessionRepository;

    constructor(data: Partial<SessionInterface>) {
        this.sessionId = data.sessionId?.toString();
        this.status = data.status || 'Activa';
        this.guests = data.guests || [];
        this.sessionRepository = new SessionRepository();
        
        // Inicialización segura de `table` y `guests` para evitar errores
        this.table = data.table instanceof Table ? data.table : new Table({ tableId: data.table  || '' });
        this.guests = (data.guests || []).map(guest => ({
            ...guest,
            user: guest.user instanceof User ? guest.user : new User({ userId: guest.user || '' }),
        }));
    }

    private async populateGuests(guests: GuestDocument[]): Promise<GuestInterface[]> {
        return Promise.all(guests.map(async (guest) => ({
            guestId: guest.id.toString(),
            name: guest.name,
            user: typeof guest.user === 'string' 
                ? await new User({ userId: guest.user }).findById()
                : guest.user,
            orders: await Promise.all(guest.orders.map(async (orderData: OrderDocument) => {
                const order = new Order({ orderId: orderData.id });
                await order.populate(); // Llenar la instancia completa
                return order;
            })),
        })));
    }

    public async findActiveSessionByTableId(): Promise<Session | null> {
        const sessionDoc = await this.sessionRepository.findActiveSessionByTableId(this.table.tableId);
        if (sessionDoc) {
            this.populateFromDocument(sessionDoc);
            await this.table.findById(); // Poblar la instancia de `Table`
            return this;
        }
        return null;
    }

    public async findById(): Promise<Session | null> {
        const sessionDoc = await this.sessionRepository.findBySessionId(this.sessionId);
        if (sessionDoc) {
            this.populateFromDocument(sessionDoc);
            await this.table.findById(); // Poblar la instancia de `Table`
            return this;
        }
        return null;
    }

    public async deleteSession(): Promise<boolean | null> {
        return await this.sessionRepository.delete(this.sessionId);
    }

    public async addGuest(guest: GuestInterface): Promise<GuestInterface | null> {
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
            const newGuest = (updatedSession.guests as GuestDocument[]).slice(-1)[0];
            const populatedGuest = await this.populateGuests([newGuest]);
    
            // Actualizar la lista local de invitados
            this.guests = await this.populateGuests(updatedSession.guests as GuestDocument[]);
            return populatedGuest[0];
        }
    
        return null;
    }

    public async updateGuestToLogged(guestId: string, userId: string): Promise<Session | null> {
        const updatedSession = await this.sessionRepository.updateGuestToLogged(this.sessionId, userId, guestId);
        if (updatedSession) {
            this.guests = await this.populateGuests(updatedSession.guests as GuestDocument[]);
            return this;
        }
        return null;
    }

    static async getAllSessions(): Promise<Session[] | null> {
        const sessionRepository = new SessionRepository();
        const sessions = await sessionRepository.findAll();
        return sessions ? Promise.all(sessions.map(async (sessionDoc) => {
            const sessionInstance = new Session({});
            sessionInstance.populateFromDocument(sessionDoc);
            await sessionInstance.table.findById(); // Poblar la instancia de `Table`
            return sessionInstance;
        })) : null;
    }

    public async updateStatus(status: 'Activa' | 'Pagando' | 'Finalizada'): Promise<Session | null> {
        const updatedSession = await this.sessionRepository.update(this.sessionId, { status: status });
        console.log('Updated Session', updatedSession);
        if (updatedSession) {
            this.status = updatedSession.status;
            return this;
        }
        return null;
    }

    public async save(): Promise<Session> {
        const savedSession = await this.sessionRepository.save(this);
        this.populateFromDocument(savedSession);
        return this;
    }

    private populateFromDocument(sessionDoc: SessionDocument) {
        this.sessionId = sessionDoc.id.toString();
        this.table = new Table({ tableId: sessionDoc.table.toString() });
        this.status = sessionDoc.status;
        this.guests = sessionDoc.guests.map((guest: GuestDocument) => ({
            guestId: guest.id,
            name: guest.name,
            user: new User({ userId: guest.user?.toString() || '' }),  // Instancia mínima de `User`
            orders: guest.orders.map((orderDoc: OrderDocument) => new Order({ orderId: orderDoc.id })),  // Instancia mínima de `Order`
        }));
        this.createdAt = sessionDoc.createdAt;
        this.updatedAt = sessionDoc.updatedAt;
    }
}
