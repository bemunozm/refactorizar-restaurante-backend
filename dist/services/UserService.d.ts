import { UserInterface } from "../interfaces/UserInterface";
export declare class UserService {
    private userRepository;
    constructor();
    getAllUsers(): Promise<UserInterface[]>;
    getUserById(id: string): Promise<UserInterface | null>;
    updateUserById(id: string, data: Partial<UserInterface>): Promise<UserInterface | null>;
    deleteUserById(id: string): Promise<void>;
}
