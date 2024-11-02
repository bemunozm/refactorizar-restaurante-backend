import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { UserDocument } from "../interfaces/UserInterface";
// import Session, { GuestType } from "../models/Session"; // Comentado para implementación futura

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument; // Usuario registrado
            guest?: any; // Invitado (de tipo `GuestType`, que se definirá luego)
            sessionId?: string; // ID de la sesión
            tableId?: string; // ID de la mesa
            role: string;
        }
    }
}

class AuthMiddleware {
    private static userRepository = new UserRepository();

    public static async authenticate(req: Request, res: Response, next: NextFunction) {
        const bearer = req.headers.authorization;

        if (!bearer) {
            return res.status(401).json({ error: "No Autorizado" });
        }

        const [, token] = bearer.split(" ");

        try {
            // Decodifica el token
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            console.log("Decoded Token:", decoded);

            // Asigna el sessionId y tableId si existen en el token decodificado
            if (decoded.sessionId) {
                req.sessionId = decoded.sessionId;
            }

            if (decoded.tableId) {
                req.tableId = decoded.tableId;
            }

            // Verifica el rol en el token para identificar si es un invitado o usuario
            if (decoded.role === "Usuario") {
                // Usuario registrado
                const user = await AuthMiddleware.userRepository.findById(decoded.id);
                if (user) {
                    req.user = user; // Asigna el usuario al request
                    req.role = "Usuario";
                    next();
                } else {
                    return res.status(401).json({ error: "Usuario No Encontrado" });
                }
            } 
            // else if (decoded.role === "Invitado") {
            //     // Invitado (implementación futura)
            //     const session = await Session.findOne({ $or: [{ "guests._id": decoded.id }, { "guests.user": decoded.id }] });

            //     if (!session) {
            //         return res.status(500).json({ error: "Este invitado no pertenece a ninguna sesión activa" });
            //     }

            //     // Encuentra el invitado en la sesión
            //     const guest = session.guests.find((guest: any) => guest._id.toString() === decoded.id);
            //     if (guest) {
            //         req.guest = guest; // Asigna el invitado al request
            //         req.role = "Invitado";
            //         next();
            //     } else {
            //         return res.status(500).json({ error: "Invitado No Encontrado" });
            //     }
            // } 
            else {
                return res.status(401).json({ error: "Rol no autorizado" });
            }
        } catch (error) {
            return res.status(401).json({ error: "Token No Válido" });
        }
    }
}

export default AuthMiddleware;
