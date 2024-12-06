"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistanceRepository = void 0;
const GenericRepository_1 = require("./GenericRepository");
const AssistanceSchema_1 = __importDefault(require("../schemas/AssistanceSchema"));
class AssistanceRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = AssistanceSchema_1.default;
    constructor() {
        super(AssistanceRepository.mongooseModel);
    }
    /**
     * Guarda una nueva instancia de Assistance en la base de datos.
     * @param assistance Datos de la asistencia.
     * @returns Documento de Assistance.
     */
    async save(assistance) {
        try {
            const assistanceDocument = new this.model({
                session: assistance.session,
                user: assistance.user || undefined,
                type: assistance.type,
                status: assistance.status,
                transactionToken: assistance.transactionToken,
                itemId: assistance.itemId,
                itemDetails: assistance.itemDetails,
            });
            return await assistanceDocument.save();
        }
        catch (error) {
            console.error(`Error al guardar la asistencia: ${error}`);
            throw new Error('Error al guardar la asistencia');
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        }
        catch (error) {
            console.error(`Error al actualizar la asistencia: ${error}`);
            throw new Error('Error al actualizar la asistencia');
        }
    }
    /**
     * Encuentra asistencias relacionadas con una sesión específica.
     * @param sessionId ID de la sesión.
     * @returns Lista de asistencias.
     */
    async findBySessionId(sessionId) {
        try {
            return await this.model.find({ session: sessionId });
        }
        catch (error) {
            console.error(`Error al buscar asistencias por sesión: ${error}`);
            throw new Error('Error al buscar asistencias por sesión');
        }
    }
    async findByItemId(itemId) {
        try {
            return await this.model.findOne({ itemId });
        }
        catch (error) {
            console.error(`Error al buscar asistencias por item: ${error}`);
            throw new Error('Error al buscar asistencias por item');
        }
    }
    /**
     * Encuentra asistencias asignadas a un usuario específico.
     * @param userId ID del usuario.
     * @returns Lista de asistencias.
     */
    async findByUserId(userId) {
        try {
            return await this.model.find({ user: userId });
        }
        catch (error) {
            console.error(`Error al buscar asistencias por usuario: ${error}`);
            throw new Error('Error al buscar asistencias por usuario');
        }
    }
    /**
     * Encuentra asistencias con un estado específico.
     * @param status Estado de la asistencia ('Pendiente', 'En Progreso', 'Completado').
     * @returns Lista de asistencias.
     */
    async findByStatus(status) {
        try {
            return await this.model.find({ status });
        }
        catch (error) {
            console.error(`Error al buscar asistencias por estado: ${error}`);
            throw new Error('Error al buscar asistencias por estado');
        }
    }
    /**
     * Actualiza el estado de una asistencia.
     * @param assistanceId ID de la asistencia.
     * @param status Nuevo estado de la asistencia.
     * @returns Documento de Assistance actualizado.
     */
    async updateStatus(assistanceId, status) {
        try {
            return await this.model.findByIdAndUpdate(assistanceId, { status }, { new: true });
        }
        catch (error) {
            console.error(`Error al actualizar el estado de la asistencia: ${error}`);
            throw new Error('Error al actualizar el estado de la asistencia');
        }
    }
    /**
     * Encuentra todas las asistencias pendientes.
     * @returns Lista de asistencias pendientes.
     */
    async findPendingAssistances() {
        return this.findByStatus('Pendiente');
    }
    /**
     * Encuentra todas las asistencias completadas.
     * @returns Lista de asistencias completadas.
     */
    async findCompletedAssistances() {
        return this.findByStatus('Completado');
    }
    //Encuentra todas las asitencias con status diferente a Completado
    async getAllAssistance() {
        try {
            return await this.model.find({ status: { $ne: 'Completado' } });
        }
        catch (error) {
            console.error(`Error al buscar asistencias no completadas y sin usuario: ${error}`);
            throw new Error('Error al buscar asistencias no completadas y sin usuario');
        }
    }
}
exports.AssistanceRepository = AssistanceRepository;
//# sourceMappingURL=AssistanceRepository.js.map