import { SessionInterface } from "../interfaces/SessionInterface";
import { GuestInterface } from "../interfaces/GuestInterface";
import { Table } from "./Table";
export declare class Session implements SessionInterface {
    sessionId?: string;
    table: Table;
    guests: GuestInterface[];
    status: 'Activa' | 'Pagando' | 'Finalizada';
    createdAt?: Date;
    updatedAt?: Date;
    private sessionRepository;
    constructor(data: Partial<SessionInterface>);
    private populateGuests;
    findActiveSessionByTableId(): Promise<Session | null>;
    findById(): Promise<Session | null>;
    deleteSession(): Promise<boolean | null>;
    addGuest(guest: GuestInterface): Promise<GuestInterface | null>;
    updateGuestToLogged(guestId: string, userId: string): Promise<Session | null>;
    static getAllSessions(): Promise<Session[] | null>;
    updateStatus(status: 'Activa' | 'Pagando' | 'Finalizada'): Promise<Session | null>;
    save(): Promise<Session>;
    static getSessionsBetweenDates(startDate: Date, endDate: Date): Promise<Session[]>;
    private populateFromDocument;
}
