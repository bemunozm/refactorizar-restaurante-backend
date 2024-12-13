import { SessionDocument } from "../interfaces/SessionInterface";
import { GenericRepository } from "./GenericRepository";
import { Session } from "../models/Session";
export declare class SessionRepository extends GenericRepository<SessionDocument> {
    private static mongooseModel;
    constructor();
    findActiveSessionByTableId(tableId: string): Promise<SessionDocument | null>;
    findBySessionId(sessionId: string): Promise<SessionDocument | null>;
    updateGuestToLogged(sessionId: string, userId: string, guestId: string): Promise<SessionDocument | null>;
    save(session: Session): Promise<SessionDocument>;
    findSessionsBetweenDates(startDate: Date, endDate: Date): Promise<SessionDocument[]>;
    pushGuest(sessionId: string, guestData: any): Promise<SessionDocument | null>;
}
