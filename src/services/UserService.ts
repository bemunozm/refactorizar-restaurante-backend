import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { hashPassword } from "../utils/auth";
import { UserInterface } from "../interfaces/UserInterface";

export class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
    }

    public async getAllUsers(): Promise<UserInterface[]> {
        return this.userRepository.findAll();
    }

    public async getUserById(id: string): Promise<UserInterface | null> {
        return this.userRepository.findById(id);
    }

    // public async updateUser(id: string, data: Partial<UserInterface>): Promise<UserInterface | null> {
    //     const { roles, ...userData } = data;

    //     if (roles) {
    //         const assignedRoles = await this.roleRepository.findRolesByIds(roles);
    //         if (assignedRoles.length !== roles.length) throw new Error("Uno o más roles no fueron encontrados");
    //         userData.roles = assignedRoles.map(role => role._id);
    //     }

    //     return this.userRepository.update(id, userData);
    // }
}
