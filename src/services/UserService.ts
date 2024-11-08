import { UserRepository } from "../repositories/UserRepository";
import { UserInterface } from "../interfaces/UserInterface";
import { User } from "../models/User";
import { RoleInterface } from "../interfaces/RoleInterface";
import { Role } from "../models/Role";

export class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository; // Usa el singleton de UserRepository
    }

    public async getAllUsers(): Promise<UserInterface[]> {
        // Obtiene todos los documentos de usuarios
        const userDocuments = await this.userRepository.getAllUsers('roles');

        // Convierte cada documento en una instancia de User o un objeto que cumple con UserInterface
        const users: UserInterface[] = userDocuments.map(userDoc => {
            const roles = userDoc.roles.map((role: RoleInterface) => { return new Role({ roleId: role.roleId, name: role.name, permissions: role.permissions })});
            return new User({
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

    public async getUserById(id: string): Promise<UserInterface | null> {
        const user = new User({ userId: id, name: '', lastname: '', email: '', password: '', confirmed: false, roles: [] });
        await user.findById();
        return user;
    }
    public async updateUserById(id: string, data: Partial<UserInterface>): Promise<UserInterface | null> {
        const user = new User({ userId: id, name: '', lastname: '', email: '', password: '', confirmed: false, roles: [] });
        const updatedUser = await user.update(data);
        return updatedUser;
    }

    public async deleteUserById(id: string): Promise<void> {
        const user = new User({ userId: id, name: '', lastname: '', email: '', password: '', confirmed: false, roles: [] });
        await user.delete();
    }
}
