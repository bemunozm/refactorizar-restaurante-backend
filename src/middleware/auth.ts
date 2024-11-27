import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { UserInterface } from "../interfaces/UserInterface";
import { Session } from "../models/Session";
import { User } from "../models/User";
import { GuestInterface } from "../interfaces/GuestInterface";
import { Table } from "../models/Table";

declare global {
    namespace Express {
        interface Request {
            user?: UserInterface; // Usuario registrado
            guest?: GuestInterface; // Invitado (de tipo `GuestType`, que se definirá luego)
            sessionId?: Session; // ID de la sesión
            tableId?: Table; // ID de la mesa
            role: string;
        }
    }
}

class AuthMiddleware {

    public static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearer = req.headers.authorization;

        if (!bearer) {
            res.status(401).json({ error: "No Autorizado" });
            return;
        }

        const [, token] = bearer.split(" ");

        

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            const session = new Session({ sessionId: decoded.sessionId });
            await session.findById();

            let table;
            if (decoded.tableId !== ''){
                table = new Table({ tableId: decoded.tableId });
                await table.findById();
            }
            
            // Asigna sessionId y tableId desde el token decodificado, si existen
            req.sessionId = session || undefined;
            req.tableId = table || undefined;

            if (decoded.role === "Usuario") {
                // Usuario registrado
                const user = new User({ userId: decoded.id });
                await user.findById();
                if (user) {
                    req.user = user;
                    req.role = "Usuario";
                    next();
                } else {
                    res.status(401).json({ error: "Usuario No Encontrado" });
                }
            } else if (decoded.role === "Invitado") {
                          
                if (!session) {
                    res.status(500).json({ error: "Este invitado no pertenece a ninguna sesión activa" });
                    return;
                }
                const guest = session.guests.find((guest: GuestInterface) => guest.guestId === decoded.id);
                console.log('session');
                if (guest) {
                    req.guest = guest;
                    req.role = "Invitado";
                    next();
                } else {
                    res.status(500).json({ error: "Invitado No Encontrado" });
                }
            } else {
                res.status(401).json({ error: "Rol no autorizado" });
            }
        } catch (error) {
            res.status(401).json({ error: "Token No Válido" });
        }
    }
}

export default AuthMiddleware;
