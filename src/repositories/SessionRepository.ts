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

    public async findBySessionId(sessionId: string): Promise<SessionDocument | null> {

        try {
            return await this.model.findOne({ sessionId }).populate('guests user').exec();
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
