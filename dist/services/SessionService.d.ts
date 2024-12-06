import { Session } from "../models/Session";
import { Token } from "../models/Token";
export declare class SessionService {
    createSession(tableId: string): Promise<Session>;
    getAllSessions(): Promise<Session[]>;
    getSessionById(id: string): Promise<Session>;
    getSessionByTableId(tableId: string): Promise<Session>;
    updateSession(id: string, endedAt?: Date): Promise<Session>;
    deleteSession(id: string): Promise<boolean>;
    addGuestToSession(sessionId: string, guestName: string, userId?: string): Promise<{
        token: any;
        sessionId: string;
    }>;
    transferGuestOrdersToUser(guestId: string, userId: string): Promise<boolean>;
    validateToken(token: string): Promise<false | Token>;
    checkSessionExists(tableId: string): Promise<Session>;
    getSessionToken(sessionId: string): Promise<false | Token>;
}
