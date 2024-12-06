import { RoleInterface } from "../interfaces/RoleInterface";
export declare class Role implements RoleInterface {
    roleId?: string;
    name: string;
    permissions: string[];
    private roleRepository;
    constructor(data: Partial<RoleInterface>);
    private populateRole;
    save(): Promise<this>;
    update(updateData: Partial<RoleInterface>): Promise<this>;
    static getAll(): Promise<Role[]>;
    findById(): Promise<this>;
    delete(): Promise<boolean>;
    findByName(): Promise<this>;
    private toDatabaseObject;
}
