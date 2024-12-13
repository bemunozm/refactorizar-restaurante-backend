import { Request, Response } from 'express';
export declare class SessionController {
    private readonly sessionService;
    constructor();
    createSession(req: Request, res: Response): Promise<Response>;
    getAllSessions(req: Request, res: Response): Promise<Response>;
    getSessionById(req: Request, res: Response): Promise<Response>;
    getSessionByTableId(req: Request, res: Response): Promise<Response>;
    updateSession(req: Request, res: Response): Promise<Response>;
    deleteSession(req: Request, res: Response): Promise<Response>;
    addGuestToSession(req: Request, res: Response): Promise<Response>;
    transferGuestOrdersToUser(req: Request, res: Response): Promise<Response>;
    validateToken(req: Request, res: Response): Promise<Response>;
    checkSessionExists(req: Request, res: Response): Promise<Response>;
    getSessionToken(req: Request, res: Response): Promise<Response>;
}
