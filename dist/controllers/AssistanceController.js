"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistanceController = void 0;
const AssistanceService_1 = require("../services/AssistanceService");
class AssistanceController {
    assistanceService;
    constructor() {
        this.assistanceService = new AssistanceService_1.AssistanceService();
    }
    /**
     * Crea una nueva asistencia.
     */
    async create(req, res) {
        try {
            const { sessionId, type, transactionToken } = req.body;
            const assistance = await this.assistanceService.createAssistance({
                sessionId,
                type,
                transactionToken,
            });
            return res.status(201).json(assistance);
        }
        catch (error) {
            console.error(`Error al crear la asistencia: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    /**
     * Asigna un usuario (garzón) a una asistencia.
     */
    async assign(req, res) {
        try {
            const { assistanceId, userId } = req.body;
            const assistance = await this.assistanceService.assignAssistance(assistanceId, userId);
            return res.status(200).json(assistance);
        }
        catch (error) {
            console.error(`Error al asignar asistencia: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    /**
     * Completa una asistencia.
     */
    async complete(req, res) {
        try {
            const { assistanceId } = req.body;
            const assistance = await this.assistanceService.completeAssistance(assistanceId);
            return res.status(200).json(assistance);
        }
        catch (error) {
            console.error(`Error al completar asistencia: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { assistanceId, status } = req.body;
            const assistance = await this.assistanceService.updateStatus(assistanceId, status);
            return res.status(200).json(assistance);
        }
        catch (error) {
            console.error(`Error al actualizar estado de asistencia: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    /**
     * Confirma una transacción asociada a una asistencia.
     */
    async confirmTransaction(req, res) {
        try {
            const { assistanceId, transactionToken } = req.body;
            const assistance = await this.assistanceService.confirmTransaction(assistanceId, transactionToken);
            return res.status(200).json({ message: 'Transacción confirmada', assistance });
        }
        catch (error) {
            console.error(`Error al confirmar transacción: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async declineTransaction(req, res) {
        try {
            const { assistanceId, transactionToken } = req.body;
            const assistance = await this.assistanceService.declineTransaction(assistanceId, transactionToken);
            return res.status(200).json({ message: 'Transacción rechazada', assistance });
        }
        catch (error) {
            console.error(`Error al rechazar transacción: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    /**
     * Obtiene todas las asistencias.
     */
    async getAll(req, res) {
        try {
            const assistances = await this.assistanceService.getAllAssistances();
            return res.status(200).json(assistances);
        }
        catch (error) {
            console.error(`Error al obtener asistencias: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async getAvailableAssistances(req, res) {
        try {
            const { userId } = req.params;
            const assistances = await this.assistanceService.getAvailableAssistances(userId);
            return res.status(200).json(assistances);
        }
        catch (error) {
            console.error(`Error al obtener asistencias disponibles: ${error}`);
            return [];
        }
    }
}
exports.AssistanceController = AssistanceController;
//# sourceMappingURL=AssistanceController.js.map