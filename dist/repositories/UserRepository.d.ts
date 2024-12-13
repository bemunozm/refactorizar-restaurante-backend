import { UserDocument } from "../interfaces/UserInterface";
import { GenericRepository } from "./GenericRepository";
import { User } from "../models/User";
export declare class UserRepository extends GenericRepository<UserDocument> {
    private static mongooseModel;
    constructor();
    /**
     * Buscar un usuario por email e incluir los roles.
     */
    findByEmail(email: string): Promise<Partial<UserDocument> | null>;
    /**
     * Obtener todos los usuarios con la opción de poblado de relaciones.
     */
    getAllUsers(populate?: string | string[]): Promise<Partial<UserDocument>[] | null>;
    /**
     * Guardar una instancia de User en la base de datos.
     */
    save(user: User): Promise<UserDocument>;
    /**
     * Obtener todos los usuarios asociados a un rol específico.
     */
    getUsersByRole(roleId: string): Promise<UserDocument[] | null>;
}
