"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const SessionService_1 = require("../services/SessionService");
class SessionController {
    sessionService;
    constructor() {
        this.sessionService = new SessionService_1.SessionService();
    }
    async createSession(req, res) {
        try {
            const { tableId } = req.body;
            const result = await this.sessionService.createSession(tableId);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getAllSessions(req, res) {
        try {
            const sessions = await this.sessionService.getAllSessions();
            return res.status(200).json(sessions);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getSessionById(req, res) {
        try {
            const { id } = req.params;
            const session = await this.sessionService.getSessionById(id);
            return session
                ? res.status(200).json(session)
                : res.status(404).json({ error: 'Session not found' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getSessionByTableId(req, res) {
        try {
            const { tableId } = req.params;
            const session = await this.sessionService.getSessionByTableId(tableId);
            return session
                ? res.status(200).json(session)
                : res.status(404).json({ error: 'Session not found' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async updateSession(req, res) {
        try {
            const { id } = req.params;
            const { endedAt } = req.body;
            const session = await this.sessionService.updateSession(id, endedAt);
            return session
                ? res.status(200).json(session)
                : res.status(404).json({ error: 'Session not found' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async deleteSession(req, res) {
        try {
            const { id } = req.params;
            const result = await this.sessionService.deleteSession(id);
            return result
                ? res.status(200).json({ message: 'Session deleted successfully' })
                : res.status(404).json({ error: 'Session not found' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async addGuestToSession(req, res) {
        try {
            const { sessionId } = req.params;
            const { guestName, userId } = req.body;
            const result = await this.sessionService.addGuestToSession(sessionId, guestName, userId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async transferGuestOrdersToUser(req, res) {
        try {
            const { guestId, userId } = req.body;
            await this.sessionService.transferGuestOrdersToUser(guestId, userId);
            return res.status(200).json({ message: 'Órdenes transferidas correctamente' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async validateToken(req, res) {
        try {
            const { token } = req.body;
            const isValid = await this.sessionService.validateToken(token);
            return isValid
                ? res.status(200).json({ message: 'Token válido' })
                : res.status(404).json({ error: 'Clave Incorrecta' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async checkSessionExists(req, res) {
        try {
            const { tableId } = req.params;
            const session = await this.sessionService.checkSessionExists(tableId);
            return session
                ? res.status(200).json(session)
                : res.status(404).json('Sesion no disponible');
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getSessionToken(req, res) {
        try {
            const { sessionId } = req.params;
            const sessionToken = await this.sessionService.getSessionToken(sessionId);
            return sessionToken
                ? res.status(200).json(sessionToken)
                : res.status(404).json({ error: 'Token not found' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.SessionController = SessionController;
//# sourceMappingURL=SessionController.js.map