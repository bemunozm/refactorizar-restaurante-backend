"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
class UserService {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository; // Usa el singleton de UserRepository
    }
    async getAllUsers() {
        // Obtiene todos los documentos de usuarios
        const userDocuments = await this.userRepository.getAllUsers('roles');
        // Convierte cada documento en una instancia de User o un objeto que cumple con UserInterface
        const users = userDocuments.map(userDoc => {
            const roles = userDoc.roles.map((role) => { return new Role_1.Role({ roleId: role.roleId, name: role.name, permissions: role.permissions }); });
            return new User_1.User({
                userId: userDoc.userId,
                name: userDoc.name,
                lastname: userDoc.lastname,
                email: userDoc.email,
                password: userDoc.password,
                confirmed: userDoc.confirmed,
                roles: roles
            });
        });
        return users;
    }
    async getUserById(id) {
        const user = new User_1.User({ userId: id, name: '', lastname: '', email: '', password: '', confirmed: false, roles: [] });
        await user.findById();
        return user;
    }
    async updateUserById(id, data) {
        const user = new User_1.User({ userId: id, name: '', lastname: '', email: '', password: '', confirmed: false, roles: [] });
        const updatedUser = await user.update(data);
        return updatedUser;
    }
    async deleteUserById(id) {
        const user = new User_1.User({ userId: id, name: '', lastname: '', email: '', password: '', confirmed: false, roles: [] });
        await user.delete();
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map