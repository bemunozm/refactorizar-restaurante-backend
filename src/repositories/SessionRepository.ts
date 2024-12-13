// SessionRepository.ts
import { SessionDocument } from "../interfaces/SessionInterface";
import { GenericRepository } from "./GenericRepository";
import SessionModel from "../schemas/SessionSchema";
import { Session } from "../models/Session";
import { GuestDocument } from "../interfaces/GuestInterface";

export class SessionRepository extends GenericRepository<SessionDocument> {
    private static mongooseModel = SessionModel;

    constructor() {
        super(SessionRepository.mongooseModel);
    }

    
    public async findActiveSessionByTableId(tableId: string): Promise<SessionDocument | null> {
        return await this.model.findOne({ table: tableId, status: { $ne: 'Finalizada' } }).exec();
    }

    
    public async findBySessionId(sessionId: string): Promise<SessionDocument | null> {
        return await this.model.findById(sessionId).exec();
    }

    
    public async updateGuestToLogged(sessionId: string, userId: string, guestId: string): Promise<SessionDocument | null> {
        return await this.model.findOneAndUpdate(
            { _id: sessionId, "guests._id": guestId },
            { $set: { "guests.$.user": userId } }, // Solo actualizar el campo `user` del invitado
            { new: true }
        ).exec();
    }

   
    public async save(session: Session): Promise<SessionDocument> {
        const sessionDocument = new this.model({
            table: session.table.tableId,
            guests: session.guests.map(guest => ({
                id: guest.guestId,
                name: guest.name,
                user: guest.user instanceof Object ? guest.user.userId : guest.user,
                orders: guest.orders.map(order => order.orderId),
            })),
            status: session.status,
        });
        return await sessionDocument.save();
    }

    public async findSessionsBetweenDates(startDate: Date, endDate: Date): Promise<SessionDocument[]> {
        return await this.model.find({ createdAt: { $gte: startDate, $lte: endDate } }).exec();
    }


    public async pushGuest(sessionId: string, guestData: any): Promise<SessionDocument | null> {
        return await this.model.findByIdAndUpdate(
            sessionId,
            { $push: { guests: guestData } }, // Solo agregar el nuevo invitado
            { new: true } // Retornar el documento actualizado
        ).exec();
    }
    
}
