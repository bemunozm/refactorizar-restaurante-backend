import { SessionDocument } from "../interfaces/SessionInterface";
import { GenericRepository } from "./GenericRepository";
import { Session } from "../models/Session"; // Importamos la clase Session con el modelo encapsulado
import SessionModel from "../schemas/SessionSchema";

export class SessionRepository extends GenericRepository<SessionDocument> {
    private static mongooseModel = SessionModel;

    constructor() {
        super(SessionRepository.mongooseModel);
    }

    // Métodos específicos de SessionRepository pueden añadirse aquí

    public async findActiveSessionByTableId(tableId: string): Promise<SessionDocument | null> {
        try {
            return await this.model.findOne({ tableId, status: 'Activa' }).exec();
        } catch (error) {
            console.error(`Error al buscar una sesión activa para la mesa: ${error}`);
            throw new Error("Error al verificar la sesión activa de la mesa");
        }
    }

    public async findBySessionId(sessionId: string): Promise<SessionDocument | null> {

        try {
            const session = await this.model.findOne({_id: sessionId}).exec()
            return session ;
        } catch (error) {
            console.error(`Error al buscar por sessionId: ${error}`);
            throw new Error("Error al buscar el documento por sessionId");
        }
    }

    public async findByUserId(userId: string): Promise<SessionDocument | null> {
        try {
            return await this.model.findOne({ userId }).exec();
        } catch (error) {
                console.error(`Error al buscar por userId: ${error}`);
                throw new Error("Error al buscar el documento por userId");
        }
    }

    public async updateGuestToLogged(sessionId: string, guestId: string, userId: string) {
        try {
            const session = await this.model.findOne({ id: sessionId }).exec();
            if (session) {
                const updatedGuests = session.guests.map((guest: any) => {
                    if (guest.id === guestId) {
                        guest.user = userId;
                    }
                    return guest;
                });
                session.guests = updatedGuests;
                return await session.save();
            }
        } catch (error) {
            console.error(`Error al actualizar el estado de los invitados a logged: ${error}`);
            throw new Error("Error al actualizar el estado de los invitados a logged");
        }
    }

    // Método para guardar una instancia de Session en la base de datos
    public async save(session: Session): Promise<SessionDocument> {
        try {
            const sessionDocument = new this.model({
            sessionId: session.sessionId,
            tableId: session.tableId,
            guests: session.guests,
            status: session.status,
            });
            return await sessionDocument.save();
        } catch (error) {
            console.error(`Error al guardar la sesión: ${error}`);
            throw new Error("Error al guardar la sesión en la base de datos");
        }
    }
}
