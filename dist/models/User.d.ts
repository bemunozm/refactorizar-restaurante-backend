import { UserInterface } from "../interfaces/UserInterface";
import { Role } from "./Role";
export declare class User implements UserInterface {
    userId: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
    confirmed: boolean;
    roles: Role[];
    private userRepository;
    constructor(data: Partial<UserInterface>);
    /**
     * Verificar si el usuario existe basado en el email.
     */
    doesThatExist(): Promise<boolean>;
    /**
     * Encriptar contraseña y asignarla al usuario.
     */
    hashPassword(): Promise<void>;
    /**
     * Verificar la contraseña en comparación con la almacenada.
     */
    checkPassword(password: string): Promise<boolean>;
    /**
     * Buscar un usuario por ID, incluyendo los roles.
     */
    findById(): Promise<User | null>;
    /**
     * Actualizar los datos del usuario.
     * La función maneja la conversión de `Role` a `roleId` antes de enviar al repositorio.
     */
    update(data: Partial<UserInterface>): Promise<User | null>;
    /**
     * Eliminar el usuario de la base de datos.
     */
    delete(): Promise<boolean>;
    /**
     * Guardar el usuario en la base de datos.
     * Convierte `roles` a solo `roleIds` para almacenar en MongoDB.
     */
    save(): Promise<User>;
    /**
     * Cargar datos en el usuario actual desde la estructura de la base de datos.
     */
    private populateFromData;
    /**
     * Obtener todos los usuarios por ID de Rol.
     */
    static getUsersByRole(roleId: string): Promise<User[] | null>;
}
