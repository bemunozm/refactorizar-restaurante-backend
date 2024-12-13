"use strict";
// UserRepository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const GenericRepository_1 = require("./GenericRepository");
const UserSchema_1 = __importDefault(require("../schemas/UserSchema"));
class UserRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = UserSchema_1.default;
    constructor() {
        super(UserRepository.mongooseModel);
    }
    /**
     * Buscar un usuario por email e incluir los roles.
     */
    async findByEmail(email) {
        try {
            const userModel = await this.model.findOne({ email }).populate("roles").exec();
            if (userModel) {
                return {
                    userId: userModel.id,
                    name: userModel.name,
                    lastname: userModel.lastname,
                    email: userModel.email,
                    password: userModel.password,
                    confirmed: userModel.confirmed,
                    roles: userModel.roles
                };
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error(`Error al buscar por email: ${error}`);
            throw new Error("Error al buscar el documento por email");
        }
    }
    /**
     * Obtener todos los usuarios con la opción de poblado de relaciones.
     */
    async getAllUsers(populate) {
        try {
            const userModel = await super.findAll(populate);
            if (userModel) {
                return userModel.map(user => ({
                    userId: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    password: user.password,
                    confirmed: user.confirmed,
                    roles: user.roles
                }));
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error(`Error al obtener todos los usuarios: ${error}`);
            throw new Error("Error al obtener los usuarios");
        }
    }
    /**
     * Guardar una instancia de User en la base de datos.
     */
    async save(user) {
        try {
            // Crear un documento de usuario con los IDs de roles asignados
            const userDocument = new this.model({
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                confirmed: user.confirmed,
                roles: user.roles,
            });
            return await userDocument.save();
        }
        catch (error) {
            console.error(`Error al guardar el usuario: ${error}`);
            throw new Error("Error al guardar el documento del usuario");
        }
    }
    /**
     * Obtener todos los usuarios asociados a un rol específico.
     */
    async getUsersByRole(roleId) {
        try {
            return await this.model.find({ roles: roleId }).populate("roles").exec();
        }
        catch (error) {
            console.error(`Error al buscar usuarios por rol: ${error}`);
            throw new Error("Error al buscar el documento por rol");
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map