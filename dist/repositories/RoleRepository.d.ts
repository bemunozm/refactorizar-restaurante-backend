import { GenericRepository } from "./GenericRepository";
import { RoleDocument } from "../interfaces/RoleInterface";
export declare class RoleRepository extends GenericRepository<RoleDocument> {
    private static mongooseModel;
    constructor();
    save(roleData: {
        name: string;
        permissions: string[];
    }): Promise<import("mongoose").Document<unknown, {}, RoleDocument> & RoleDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
