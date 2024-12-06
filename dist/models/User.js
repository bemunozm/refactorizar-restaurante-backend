"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const auth_1 = require("../utils/auth");
const UserRepository_1 = require("../repositories/UserRepository");
const Role_1 = require("./Role");
class User {
    userId;
    name;
    lastname;
    email;
    password;
    confirmed;
    roles;
    userRepository;
    constructor(data) {
        this.userId = data.userId || '';
        this.name = data.name || '';
        this.lastname = data.lastname || '';
        this.email = data.email || '';
        this.password = data.password || '';
        this.confirmed = data.confirmed || false;
        this.roles = data.roles ? data.roles.map(roleData => new Role_1.Role(roleData)) : [];
        this.userRepository = new UserRepository_1.UserRepository();
    }
    /**
     * Verificar si el usuario existe basado en el email.
     */
    async doesThatExist() {
        const userData = await this.userRepository.findByEmail(this.email);
        if (userData) {
            this.populateFromData(userData);
            return true;
        }
        return null;
    }
    /**
     * Encriptar contraseña y asignarla al usuario.
     */
    async hashPassword() {
        this.password = await (0, auth_1.hashPassword)(this.password);
    }
    /**
     * Verificar la contraseña en comparación con la almacenada.
     */
    async checkPassword(password) {
        return await (0, auth_1.checkPassword)(password, this.password);
    }
    /**
     * Buscar un usuario por ID, incluyendo los roles.
     */
    async findById() {
        const userData = await this.userRepository.findById(this.userId, 'roles');
        if (userData) {
            this.populateFromData(userData);
            return this;
        }
        return null;
    }
    /**
     * Actualizar los datos del usuario.
     * La función maneja la conversión de `Role` a `roleId` antes de enviar al repositorio.
     */
    async update(data) {
        // Convertir `data.roles` a IDs si se proporcionan, para enviar solo los IDs al repositorio
        const updateData = {
            ...data,
            roles: data.roles
        };
        // Actualizar en el repositorio
        const updatedUser = await this.userRepository.update(this.userId, updateData);
        // Si se actualiza, llenar los datos del usuario
        if (updatedUser) {
            this.populateFromData(updatedUser);
            return this;
        }
        return null;
    }
    /**
     * Eliminar el usuario de la base de datos.
     */
    async delete() {
        return await this.userRepository.delete(this.userId);
    }
    /**
     * Guardar el usuario en la base de datos.
     * Convierte `roles` a solo `roleIds` para almacenar en MongoDB.
     */
    async save() {
        const savedUser = await this.userRepository.save({
            ...this,
            roles: this.roles.map(role => role.roleId) // Enviar solo los role IDs
        });
        this.userId = savedUser.id;
        return this;
    }
    /**
     * Cargar datos en el usuario actual desde la estructura de la base de datos.
     */
    populateFromData(userData) {
        this.userId = userData.userId || userData.id;
        this.name = userData.name;
        this.lastname = userData.lastname;
        this.email = userData.email;
        this.password = userData.password;
        this.confirmed = userData.confirmed;
        this.roles = userData.roles ? userData.roles.map(role => role instanceof Role_1.Role ? role : new Role_1.Role({ roleId: role.id, name: role.name, permissions: role.permissions })) : this.roles;
    }
    /**
     * Obtener todos los usuarios por ID de Rol.
     */
    static async getUsersByRole(roleId) {
        const userRepository = new UserRepository_1.UserRepository();
        const usersData = await userRepository.getUsersByRole(roleId);
        if (usersData) {
            return usersData.map(userData => {
                const user = new User({});
                user.populateFromData(userData);
                return user;
            });
        }
        return null;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map