import { Request, Response } from 'express';
import { SessionService } from "../services/SessionService";

export class SessionController {
    private readonly sessionService: SessionService;

    constructor() {
        this.sessionService = new SessionService();
    }

    public async createSession(req: Request, res: Response): Promise<Response> {
        try {
            const { tableId } = req.body;
            const result = await this.sessionService.createSession(tableId);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async getAllSessions(req: Request, res: Response): Promise<Response> {
        try {
            const sessions = await this.sessionService.getAllSessions();
            return res.status(200).json(sessions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async getSessionById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const session = await this.sessionService.getSessionById(id);
            return session
                ? res.status(200).json(session)
                : res.status(404).json({ error: 'Session not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async getSessionByTableId(req: Request, res: Response): Promise<Response> {
        try {
            const { tableId } = req.params;
            const session = await this.sessionService.getSessionByTableId(tableId);
            return session
                ? res.status(200).json(session)
                : res.status(404).json({ error: 'Session not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async updateSession(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { endedAt } = req.body;
            const session = await this.sessionService.updateSession(id, endedAt);
            return session
                ? res.status(200).json(session)
                : res.status(404).json({ error: 'Session not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async deleteSession(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await this.sessionService.deleteSession(id);
            return result
                ? res.status(200).json({ message: 'Session deleted successfully' })
                : res.status(404).json({ error: 'Session not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async addGuestToSession(req: Request, res: Response): Promise<Response> {
        try {
            const { sessionId } = req.params;
            const { guestName, userId } = req.body;
            const result = await this.sessionService.addGuestToSession(sessionId, guestName, userId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async transferGuestOrdersToUser(req: Request, res: Response): Promise<Response> {
        try {
            const { guestId, userId } = req.body;
            await this.sessionService.transferGuestOrdersToUser(guestId, userId);
            return res.status(200).json({ message: 'Órdenes transferidas correctamente' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async validateToken(req: Request, res: Response): Promise<Response> {
        try {
            const { token } = req.body;
            const isValid = await this.sessionService.validateToken(token);
            return isValid
                ? res.status(200).json({ message: 'Token válido' })
                : res.status(404).json({ error: 'Clave Incorrecta' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async checkSessionExists(req: Request, res: Response): Promise<Response> {
        try {
            const { tableId } = req.params;
            const session = await this.sessionService.checkSessionExists(tableId);
            return session
                ? res.status(200).json(session)
                : res.status(404).json('Sesion no disponible');
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    public async getSessionToken(req: Request, res: Response): Promise<Response> {
        try {
            const { sessionId } = req.params;
            const sessionToken = await this.sessionService.getSessionToken(sessionId);
            return sessionToken
                ? res.status(200).json(sessionToken)
                : res.status(404).json({ error: 'Token not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
